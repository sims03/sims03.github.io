# Simona Zlatanovska — Portfolio

Personal portfolio site: plain HTML, CSS and a little vanilla JavaScript. No framework and no build step, so the folder can be published exactly as it is.

| File | Purpose |
| --- | --- |
| `index.html` | All page content |
| `styles.css` | Styles (colors and fonts are set as variables at the top) |
| `script.js` | Mobile menu, scroll reveals, active nav link, the decorative timeline playheads |
| `favicon.svg` | Browser tab icon |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

The CV is deliberately **not** included on the site, and the only public contact details are email and GitHub.

## Preview locally

Open `index.html` in a browser (double-click it). That's all.

## Publish on GitHub Pages

1. On GitHub, create a new **public** repository named exactly **`sims03.github.io`** (no README, so it starts empty).
2. Push the **contents** of this `portfolio/` folder to the repository's `main` branch, so that `index.html` sits at the root of the repo (not inside a `portfolio/` subfolder). From inside this folder:

   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/sims03/sims03.github.io.git
   git push -u origin main
   ```

   (Or upload the files with **Add file → Upload files** on the GitHub website.)
3. In the repository go to **Settings → Pages**. Under **Build and deployment** choose **Deploy from a branch**, then branch **`main`** and folder **`/ (root)`**, and click **Save**.
4. After a minute or two the site is live at **https://sims03.github.io**.

To update the site later, edit the files and push again; GitHub Pages republishes automatically.
