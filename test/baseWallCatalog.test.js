import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';

test('Panel Bazalı catalog entries kaldırıldı', () => {
  for (const width of [100, 150, 200]) {
    const moduleKey = `wall_base_${width}`;
    assert.equal(MODULE_CATALOG[moduleKey], undefined, moduleKey);
    assert.equal(MODULE_CATALOG_KEYS.includes(moduleKey), false, moduleKey);
  }
});
