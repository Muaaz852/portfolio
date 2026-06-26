# Portfolio website

A clean, responsive personal portfolio built with plain HTML, CSS, and vanilla
JavaScript. No build step, no framework — it runs as static files and is ready
for GitHub Pages.

## Folder contents

```
portfolio-site/
├── index.html              ← landing page (hero, about, projects grid)
├── barqbooks.html          ← project detail page
├── impactify-world.html    ← project detail page
├── shoowme.html            ← project detail page
├── taxi-management.html    ← project detail page
├── .nojekyll               ← tells GitHub Pages to serve every folder as-is
├── README.md
└── assets/
    ├── css/styles.css      ← all styling (accent color lives here)
    ├── js/main.js          ← lightbox for enlarging flow screens
    ├── favicon.svg
    └── projects/<name>/    ← flow screenshots, web-safe filenames
```

## Publish on GitHub Pages

1. Create a repository on your personal GitHub account and push these files so
   that **`index.html` sits at the repository root**. (If you keep them inside a
   `portfolio-site/` folder, move the contents up to the root, or push the
   contents of this folder as the repo root.)
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **`main`** and folder **`/ (root)`**, then click **Save**.
5. Wait a minute, then visit the URL GitHub shows
   (`https://<your-username>.github.io/<repo-name>/`).

All links and asset paths are **relative**, so the site works whether it's served
from a user site (`<username>.github.io`) or a project subpath
(`<username>.github.io/<repo-name>/`).

## Change the accent color (one place)

Open `assets/css/styles.css` and edit the first variable:

```css
:root {
  --accent: #4f46e5;   /* ← change this hex value */
}
```

Every accent on the site (buttons, links, highlights, the brand dot) is derived
from this one value, so changing it updates the whole site.

## Change the two links (Calendly + LinkedIn)

The **Book a call** button points to your Calendly link, and the **LinkedIn**
button points to your profile. They appear in the header and footer of every
page. To update them, find-and-replace the URLs across the `.html` files:

- Calendly — current value: `https://calendly.com/muaaz-hamood-barqbytes`
- LinkedIn — current value: `https://www.linkedin.com/in/muaaz-hamood/`

On macOS/Linux you can do both from a terminal in this folder:

```bash
# replace the Calendly link everywhere
grep -rl 'calendly.com/muaaz-hamood-barqbytes' . --include='*.html' \
  | xargs sed -i '' 's#https://calendly.com/muaaz-hamood-barqbytes#YOUR_NEW_CALENDLY_URL#g'

# replace the LinkedIn link everywhere
grep -rl 'linkedin.com/in/muaaz-hamood' . --include='*.html' \
  | xargs sed -i '' 's#https://www.linkedin.com/in/muaaz-hamood/#YOUR_NEW_LINKEDIN_URL#g'
```

(On Linux, use `sed -i` without the `''` after it.)

## Preview locally

Just open `index.html` in a browser. Everything — images, links, and the
lightbox — works directly from the file system.
