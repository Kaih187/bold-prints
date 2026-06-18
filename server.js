require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const whatsappPhone = process.env.WHATSAPP_PHONE || '255769604606';
const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

if (!whatsappApiUrl || !whatsappApiToken) {
  console.warn('WARNING: WHATSAPP_API_URL and WHATSAPP_API_TOKEN must be set in .env for WhatsApp Business API calls.');
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
    if (!whatsappApiUrl || !whatsappApiToken) {
      req.files.forEach(file => fs.unlink(file.path, () => {}));
      return res.status(500).json({ success: false, message: 'WhatsApp Business API not configured.' });
    }

    const responses = [];
    for (const file of req.files) {
      const formData = new FormData();
      formData.append('messaging_product', 'whatsapp');
      formData.append('to', targetPhone);
      formData.append('type', 'document');
      formData.append('recipient_type', 'individual');
      formData.append('document', fs.createReadStream(file.path), {
        filename: file.originalname,
        contentType: file.mimetype
      });
      formData.append('caption', `${messageText}\nFile: ${file.originalname}`);

      const response = await axios.post(whatsappApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${whatsappApiToken}`
        }
      });
      responses.push(response.data);
    }

    req.files.forEach(file => fs.unlink(file.path, () => {}));

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
