import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { mapCatalogSeedToBootstrap } from './test/mapCatalogSeed.mjs';

function e2eCatalogPlugin() {
  if (process.env.FAIR_STAND_E2E_CATALOG !== '1') return null;
  const seed = JSON.parse(readFileSync(new URL('./test/fixtures/itemCatalogSeed.json', import.meta.url), 'utf8'));
  const payload = JSON.stringify(mapCatalogSeedToBootstrap(seed));
  return {
    name: 'fair-stand-e2e-catalog',
    configureServer(server) {
      server.middlewares.use('/api/v1/fair-stand/catalog/bootstrap', (_request, response) => {
        response.setHeader('Content-Type', 'application/json');
        response.end(payload);
      });
    },
  };
}

export default defineConfig({
  plugins: [e2eCatalogPlugin()].filter(Boolean),
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
