import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  base: '/constellation/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  server: {
    open: true,
  },
  // Rewrite /constellation/{locale} to /constellation/ so the SPA handles routing
  appType: 'spa',
});
