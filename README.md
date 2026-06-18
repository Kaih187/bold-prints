# BOLD PRINTS Website

Static marketing site for BOLD PRINTS.

## Local preview

```bash
cd "c:\Users\BOLD\Documents\BOLDWEB\bold-prints-website\bold-prints-website"
python -m http.server 8000
```

Open `http://127.0.0.1:8000` in the browser.

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
