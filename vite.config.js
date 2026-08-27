import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Three.js is intentionally a large core dependency of the 3D editor. Keep it in a
    // stable vendor chunk so future application features do not continuously invalidate
    // the renderer payload in browser caches.
    chunkSizeWarningLimit: 650,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'three-vendor',
              test: /node_modules[\\/]three[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
});
