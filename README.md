# cardo-portfolio

Portfolio of **Ricardo Jose Gagno (rica)** — graphic designer, layout artist and photographer.

Live: https://kazeeeeen.github.io/cardo-portfolio/

Built with Vite, React, TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger) and Lenis.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run images     # regenerate responsive image sizes after adding/replacing images
```

Copy lives in `src/data/content.json`; images in `public/assets/` with their details in `src/data/manifest.json`.

## Deploy

Every push to `main` builds and publishes the site to GitHub Pages (`.github/workflows/deploy.yml`).
