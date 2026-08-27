import test from 'node:test';
import assert from 'node:assert/strict';
import { getModuleRecipe, expandRecipe } from '../src/moduleRecipes.js';
import { MODULE_CATALOG } from '../src/catalog.js';

const expected = {
  100: { profile: 'profile_91', panel: 'panel_98', corner: 'panel_corner_92', top: 'base_top_107_50' },
  150: { profile: 'profile_140_5', panel: 'panel_147_5', corner: 'panel_corner_142_5', top: 'base_top_157_50' },
  200: { profile: 'profile_190', panel: 'panel_197', corner: 'panel_corner_192', top: 'base_top_206_50' },
};

for (const [widthText, ids] of Object.entries(expected)) {
  const width = Number(widthText);
  test(`Panel Bazalı ${width} reçetesi verilen üretim adetlerini korur`, () => {
    const recipe = getModuleRecipe('base-wall', width);
    assert.ok(recipe);
    const q = Object.fromEntries(recipe.items.map((item) => [item.partId, item.quantity]));
    assert.equal(q[ids.profile], 4);
    assert.equal(q.upright_346_5, 2);
    assert.equal(q.profile_41_5, 4);
    assert.equal(q.upright_49_5, 2);
    assert.equal(q[ids.panel], 7);
    assert.equal(q.panel_48_5, 2);
    assert.equal(q.connector_start, 6);
    assert.equal(q.connector_single, 17);
    assert.equal(q[ids.top], 1);
    assert.equal(recipe.variants.innerCornerPanelPartId, ids.corner);
    assert.ok(expandRecipe(recipe).items.every((item) => item.part));
  });
}

test('Panel Bazalı katalog ölçüleri 100/150/200 ve 50 cm baza derinliğini korur', () => {
  for (const width of [100, 150, 200]) {
    const item = MODULE_CATALOG[`wall_base_${width}`];
    assert.equal(item.type, 'base-wall');
    assert.equal(item.widthCm, width);
    assert.equal(item.depthCm, 50);
    assert.equal(item.heightCm, 350);
  }
});
