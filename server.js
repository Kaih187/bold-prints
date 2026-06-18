require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));
app.use(express.static(__dirname));

const whatsappPhone = process.env.WHATSAPP_PHONE || '255769604606';
const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
const whatsappMediaUploadUrl = process.env.WHATSAPP_MEDIA_UPLOAD_URL;
const whatsappMessageUrl = process.env.WHATSAPP_MESSAGE_URL;
const whatsappProvider = (process.env.WHATSAPP_PROVIDER || '').toLowerCase(); // 'meta' or 'twilio'
const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM; // e.g. 'whatsapp:+1415XXXXXXX'
const publicBaseUrl = process.env.WHATSAPP_PUBLIC_BASE_URL; // used for Twilio MediaUrl (must point to this server)

function isConfiguredValue(value) {
  return Boolean(value) && !String(value).includes('YOUR_');
}

function normalizeBaseUrl(url) {
  return String(url || '').replace(/\/+$/, '');
}

function getPublicBaseUrl(req) {
  return normalizeBaseUrl(publicBaseUrl) || `${req.protocol}://${req.get('host')}`;
}

function safePublicFilename(originalName) {
  const cleanName = path.basename(originalName || 'artwork-file')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleanName || 'artwork-file';
}

function keepFallbackUploads(files, baseUrl) {
  return files.map(file => {
    const storedName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safePublicFilename(file.originalname)}`;
    const storedPath = path.join(uploadDir, storedName);
    fs.renameSync(file.path, storedPath);

    return {
      name: file.originalname,
      url: `${baseUrl}/uploads/${encodeURIComponent(storedName)}`
    };
  });
}

const hasMetaConfig = whatsappProvider === 'meta' && isConfiguredValue(whatsappApiToken) && isConfiguredValue(metaPhoneId);
const hasTwilioConfig = whatsappProvider === 'twilio' && isConfiguredValue(twilioAccountSid) && isConfiguredValue(twilioAuthToken) && isConfiguredValue(twilioFrom) && isConfiguredValue(publicBaseUrl);
const hasGenericTwoStepConfig = isConfiguredValue(whatsappMediaUploadUrl) && isConfiguredValue(whatsappMessageUrl) && isConfiguredValue(whatsappApiToken);
const hasDirectConfig = isConfiguredValue(whatsappApiUrl) && isConfiguredValue(whatsappApiToken);
const hasConfiguredSendPath = hasMetaConfig || hasTwilioConfig || hasGenericTwoStepConfig || hasDirectConfig;

if (!hasConfiguredSendPath) {
  console.warn('WARNING: WhatsApp Business API is not configured. Artwork submissions will use a WhatsApp chat fallback.');
}

app.post('/api/send-artwork', upload.array('artwork'), async (req, res) => {
  try {
    const { name, phone, email, company, product, notes } = req.body;
    if (!name || !phone || !product) {
      return res.status(400).json({ success: false, message: 'Name, phone, and product are required.' });
    }
    if (!req.files || !req.files.length) {
      return res.status(400).json({ success: false, message: 'Please attach at least one artwork file.' });
    }

    const incomingPhone = phone.trim();
    const messageText = `New artwork submission from ${name}\nPhone: ${incomingPhone}\nProduct: ${product}\nNotes: ${notes || 'None'}${email ? `\nEmail: ${email}` : ''}${company ? `\nCompany: ${company}` : ''}`;

    const targetPhone = whatsappPhone.replace(/[^0-9]/g, '');
    if (!hasConfiguredSendPath) {
      const baseUrl = getPublicBaseUrl(req);
      const uploadedFiles = keepFallbackUploads(req.files, baseUrl);
      const fileList = uploadedFiles.map(file => `- ${file.name}: ${file.url}`).join('\n');
      const fallbackText = `${messageText}\nArtwork files:\n${fileList}`;
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(fallbackText)}`;
      return res.json({
        success: true,
        fallback: true,
        whatsappUrl,
        files: uploadedFiles,
        message: 'WhatsApp chat fallback ready with artwork links.'
      });
    }

    // Basic sanity checks
    if (hasDirectConfig && !/^https?:\/\//i.test(whatsappApiUrl)) {
      req.files.forEach(file => fs.unlink(file.path, () => {}));
      return res.status(500).json({ success: false, message: 'WHATSAPP_API_URL must be a valid http(s) URL.' });
    }

    const responses = [];
    for (const file of req.files) {
      // Ensure file exists before attempting to stream
      if (!fs.existsSync(file.path)) {
        responses.push({ file: file.originalname, success: false, error: 'Uploaded file not found on server.' });
        continue;
      }

      const formData = new FormData();
      // Include client details in the caption so the recipient sees context
      formData.append('messaging_product', 'whatsapp');
      formData.append('to', targetPhone);
      formData.append('type', 'document');
      formData.append('recipient_type', 'individual');
      formData.append('document', fs.createReadStream(file.path), {
        filename: file.originalname,
        contentType: file.mimetype
      });
      formData.append('caption', `${messageText}\nFile: ${file.originalname}`);

      try {
        // Provider-specific two-step flows
        if (whatsappProvider === 'meta') {
          if (!metaPhoneId) {
            responses.push({ file: file.originalname, success: false, error: 'Meta provider selected but WHATSAPP_PHONE_NUMBER_ID not set.' });
            continue;
          }

          // Media upload to Meta Graph API
          const mediaUrl = `https://graph.facebook.com/v17.0/${metaPhoneId}/media`;
          const mediaForm = new FormData();
          mediaForm.append('file', fs.createReadStream(file.path), { filename: file.originalname, contentType: file.mimetype });
          mediaForm.append('access_token', whatsappApiToken);

          const mediaResp = await axios.post(mediaUrl, mediaForm, {
            headers: {
              ...mediaForm.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            validateStatus: status => true
          });

          console.log('Meta media upload response for', file.originalname, 'status', mediaResp.status);
          console.log('Meta media data:', JSON.stringify(mediaResp.data).slice(0, 2000));

          const mediaId = mediaResp.data?.id || mediaResp.data?.media?.[0]?.id || null;
          if (!mediaId) {
            responses.push({ file: file.originalname, success: false, error: 'Meta media upload did not return media id.', raw: mediaResp.data });
            continue;
          }

          // Send message referencing media id
          const messageUrl = `https://graph.facebook.com/v17.0/${metaPhoneId}/messages`;
          const messagePayload = {
            messaging_product: 'whatsapp',
            to: targetPhone,
            type: 'document',
            document: { id: mediaId, caption: `${messageText}\nFile: ${file.originalname}` },
            access_token: whatsappApiToken
          };

          const msgResp = await axios.post(messageUrl, messagePayload, {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: status => true
          });

          console.log('Meta message send response for', file.originalname, 'status', msgResp.status);
          console.log('Meta message data:', JSON.stringify(msgResp.data).slice(0, 2000));

          if (msgResp.status >= 200 && msgResp.status < 300) {
            responses.push({ file: file.originalname, success: true, status: msgResp.status, data: msgResp.data });
          } else {
            responses.push({ file: file.originalname, success: false, status: msgResp.status, error: msgResp.data || msgResp.statusText });
          }

        } else if (whatsappProvider === 'twilio') {
          // Twilio requires MediaUrl to be publicly accessible. Ensure public base URL and Twilio creds are set.
          if (!twilioAccountSid || !twilioAuthToken || !twilioFrom || !publicBaseUrl) {
            responses.push({ file: file.originalname, success: false, error: 'Twilio provider requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, and WHATSAPP_PUBLIC_BASE_URL.' });
            continue;
          }

          // Construct a public URL where Twilio can fetch the uploaded file. Ensure your server is reachable at publicBaseUrl.
          const publicUrl = `${publicBaseUrl.replace(/\/\/$/, '')}/uploads/${encodeURIComponent(path.basename(file.path))}`;

          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
          const params = new URLSearchParams();
          params.append('From', twilioFrom);
          params.append('To', `whatsapp:+${targetPhone}`);
          params.append('Body', `${messageText}\nFile: ${file.originalname}`);
          params.append('MediaUrl', publicUrl);

          const twResp = await axios.post(twilioUrl, params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            auth: { username: twilioAccountSid, password: twilioAuthToken },
            validateStatus: status => true
          });

          console.log('Twilio message response for', file.originalname, 'status', twResp.status);
          console.log('Twilio data:', JSON.stringify(twResp.data).slice(0, 2000));

          if (twResp.status >= 200 && twResp.status < 300) {
            responses.push({ file: file.originalname, success: true, status: twResp.status, data: twResp.data });
          } else {
            responses.push({ file: file.originalname, success: false, status: twResp.status, error: twResp.data || twResp.statusText });
          }

        } else if (whatsappMediaUploadUrl && whatsappMessageUrl) {
          // Generic two-step: upload to provided endpoints then send
          const mediaForm = new FormData();
          mediaForm.append('file', fs.createReadStream(file.path), { filename: file.originalname, contentType: file.mimetype });

          const mediaResp = await axios.post(whatsappMediaUploadUrl, mediaForm, {
            headers: { ...mediaForm.getHeaders(), Authorization: `Bearer ${whatsappApiToken}` },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            validateStatus: status => true
          });

          console.log('Media upload response for', file.originalname, 'status', mediaResp.status);
          console.log('Media data:', JSON.stringify(mediaResp.data).slice(0, 2000));

          const mediaId = mediaResp.data?.id || mediaResp.data?.media?.[0]?.id || mediaResp.data?.media_id || (Array.isArray(mediaResp.data) && mediaResp.data[0]?.id) || null;
          if (!mediaId) {
            responses.push({ file: file.originalname, success: false, error: 'Media upload did not return a media id.', raw: mediaResp.data });
            continue;
          }

          const messagePayload = { messaging_product: 'whatsapp', to: targetPhone, type: 'document', document: { id: mediaId, caption: `${messageText}\nFile: ${file.originalname}` } };
          const msgResp = await axios.post(whatsappMessageUrl, messagePayload, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${whatsappApiToken}` }, validateStatus: status => true });

          console.log('Message send response for', file.originalname, 'status', msgResp.status);
          console.log('Message data:', JSON.stringify(msgResp.data).slice(0, 2000));

          if (msgResp.status >= 200 && msgResp.status < 300) {
            responses.push({ file: file.originalname, success: true, status: msgResp.status, data: msgResp.data });
          } else {
            responses.push({ file: file.originalname, success: false, status: msgResp.status, error: msgResp.data || msgResp.statusText });
          }

        } else {
          // Single-step: send document directly
          const response = await axios.post(whatsappApiUrl, formData, {
            headers: {
              ...formData.getHeaders(),
              Authorization: `Bearer ${whatsappApiToken}`
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            validateStatus: status => true // we'll handle non-2xx ourselves
          });

          // Log full response for diagnostics (server console only)
          console.log('WhatsApp API response for', file.originalname, 'status', response.status);
          console.log('Headers:', response.headers);
          console.log('Data:', JSON.stringify(response.data).slice(0, 5000));

          if (response.status >= 200 && response.status < 300) {
            responses.push({ file: file.originalname, success: true, status: response.status, data: response.data });
          } else {
            responses.push({ file: file.originalname, success: false, status: response.status, error: response.data || response.statusText });
          }
        }
      } catch (err) {
        // Catch network / unexpected errors per-file
        console.error('Error sending file to WhatsApp API for', file.originalname, err.message);
        console.error('Err response data:', err.response?.data);
        responses.push({ file: file.originalname, success: false, error: err.response?.data || err.message });
      }
    }

    // Clean up uploaded files
    req.files.forEach(file => fs.unlink(file.path, () => {}));

    const failed = responses.filter(r => !r.success);
    if (failed.length) {
      // Return diagnostic info about failures (avoid exposing tokens)
      return res.status(502).json({ success: false, message: 'One or more files failed to send via WhatsApp.', details: responses });
    }

    return res.json({ success: true, message: 'Artwork details sent via WhatsApp.', data: responses });
  } catch (error) {
    console.error('WhatsApp send failed:', error.response?.data || error.message || error);
    if (req.file?.path) { fs.unlink(req.file.path, () => {}); }
    return res.status(500).json({ success: false, message: 'Failed to send artwork submission via WhatsApp.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
