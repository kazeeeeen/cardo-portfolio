import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // "/" locally and on Netlify; the GitHub Pages workflow sets BASE_PATH to
  // "/cardo-portfolio/" because Pages serves the site from that sub-folder.
  base: process.env.BASE_PATH ?? '/',
  // Hashed bundles go to /static so they can be cached forever without
  // catching the unhashed images in /assets (see netlify.toml).
  build: { assetsDir: 'static' },
})
