// Files in public/ are referenced from the site root ("/assets/…"). On GitHub
// Pages the site lives under /cardo-portfolio/, so prefix Vite's base URL.
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
