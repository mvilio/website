# Markus Vilio — Portfolio Homepage

Static homepage built from the Figma design (Work / About page). No build step — plain HTML, CSS, and JS, ready to open in VS Code and push straight to GitHub (works great with GitHub Pages).

## Structure

```
index.html          → all homepage markup
css/styles.css       → all styling, design tokens at the top, responsive rules at the bottom
js/script.js         → mobile menu open/close logic
images/               → placeholder graphics (see below)
```

## Replace the placeholder images

I don't have access to your real Figma exports, so `images/` currently contains simple SVG placeholders that approximate each project's colors and wordmark:

- `davidson-placeholder.svg` → replace with your real Davidson & Company export
- `police-museum-placeholder.svg` → replace with your real Police Museum app export
- `jazzdor-placeholder.svg` → replace with your real Jazzdor export
- `avatar-placeholder.svg` → replace with your real headshot

To swap them: export each frame from Figma at 2x (right-click frame → Export), drop the file into `images/`, then update the matching `src="images/..."` path in `index.html`. Keep the same rounded-corner container — that's handled by CSS, not the image itself.

## Font

Uses SF Pro Text via the system font stack (`-apple-system, "SF Pro Text", ...`), so it renders as true SF Pro on Mac/iOS and falls back gracefully on Windows/Android/Linux without needing a font file. If you want SF Pro Text to render identically on every OS (not just Apple devices), you'd need to self-host the font files — let me know if you want that added, since Apple's licensing restricts redistributing SF Pro outside Apple platforms.

## Running locally

Just open `index.html` in a browser, or serve it locally:

```bash
npx serve .
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo → Settings → Pages → set source to your main branch, root folder.
3. Your site will be live at `https://<username>.github.io/<repo>/`.
