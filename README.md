# BOLD PRINTS Website

Static marketing site for BOLD PRINTS.

## Local preview

```bash
cd "c:\Users\BOLD\Documents\BOLDWEB\bold-prints-website\bold-prints-website"
npm install
npm start
```

Open `http://127.0.0.1:3000` in the browser.

## WhatsApp Business API

1. Copy `.env.example` to `.env`.
2. Set `WHATSAPP_PROVIDER=meta`.
3. Set `WHATSAPP_PHONE_NUMBER_ID` to your Meta WhatsApp phone number ID.
4. Set `WHATSAPP_API_TOKEN` to a valid Meta access token.
5. Optionally set `WHATSAPP_PHONE` to the number that should receive submissions.
6. Restart the server and submit artwork using the upload form.

When Meta Cloud API is configured, uploaded artwork is sent as an actual WhatsApp document message. Without WhatsApp API credentials, a normal `wa.me` chat link can only prefill text; it cannot attach files automatically.

## GitHub Pages deployment

1. Create a GitHub repository.
2. Add the repo as a remote:
   ```bash
git remote add origin https://github.com/<username>/<repo>.git
```
3. Push the branch:
   ```bash
git push -u origin master
```

The workflow in `.github/workflows/deploy-pages.yml` will publish the site to the `gh-pages` branch automatically on every push to `master`.
