import { readFileSync } from 'node:fs';
import { initializeCatalogCategories, initializeCatalogPreviews } from '../src/catalog.js';
import { initializeItemRegistry } from '../src/items.js';
import { mapCatalogSeedToBootstrap } from './mapCatalogSeed.mjs';

const seed = JSON.parse(readFileSync(new URL('./fixtures/itemCatalogSeed.json', import.meta.url), 'utf8'));
const snapshot = mapCatalogSeedToBootstrap(seed);
initializeCatalogCategories(snapshot.categories);
initializeCatalogPreviews(snapshot.previewKinds);
initializeItemRegistry(snapshot.items);
