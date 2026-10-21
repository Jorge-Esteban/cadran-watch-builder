import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Rutas relativas: el build funciona igual en la raíz o en /<repo>/ de GitHub Pages.
  base: './',
  plugins: [react(), tailwindcss()],
});
