# GlennBeeckman.github.io

Static GitHub Pages website for:

- Small developer tools (Base64, URL encode/decode, JSON format/minify)
- Blog posts

## Local preview

Because this is a static site, you can open `index.html` directly in your browser.

If you prefer a local server, from this folder run one of these:

- Python: `python -m http.server 8080`
- Node (if installed): `npx serve .`

Then open `http://localhost:8080`.

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open **Settings > Pages**.
3. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main** (or your default branch)
   - Folder: **/** (root)
4. Save and wait for the first deployment.

Your site will be available at:

`https://<your-github-username>.github.io/`

## Add a new tool

1. Create a new subfolder under `tools/` (for example `tools/new-tool/`).
2. Add an `index.html` page and optional `tool.js` script inside that folder.
3. Add a card link to the tool in `tools/index.html`.
4. Reuse shared styles from `assets/css/styles.css`.

## Add a new blog post

1. Create a new subfolder under `blog/posts/` (for example `blog/posts/my-post/`).
2. Create an `index.html` file inside that post folder.
3. Add a teaser entry in `blog/index.html` linking to `posts/my-post/`.
4. Optionally feature it on the home page in `index.html`.
