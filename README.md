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
2. Set `WHATSAPP_API_URL` and `WHATSAPP_API_TOKEN`.
3. Optionally set `WHATSAPP_PHONE` (defaults to `255769604606`).
4. Optionally set `WHATSAPP_PUBLIC_BASE_URL` to your public site URL so fallback upload links work outside your computer.
5. Restart the server and submit artwork using the upload form.

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
