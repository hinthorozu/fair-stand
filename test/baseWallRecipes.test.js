import test from 'node:test';
import assert from 'node:assert/strict';
import { getModuleRecipe } from '../src/moduleRecipes.js';
import { MODULE_CATALOG } from '../src/catalog.js';

test('Panel Bazalı recipe ve catalog kayıtları yoktur', () => {
  for (const width of [100, 150, 200]) {
    assert.equal(getModuleRecipe('base-wall', width), null, String(width));
    assert.equal(MODULE_CATALOG[`wall_base_${width}`], undefined, String(width));
  }
});
