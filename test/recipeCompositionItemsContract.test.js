import test from 'node:test';
import assert from 'node:assert/strict';
import { listRegisteredItems } from '../src/items.js';
import { getModuleRecipe, getRecipeItemKey } from '../src/moduleRecipes.js';

function childTuples(entries) {
  return (entries ?? []).map((entry) => [getRecipeItemKey(entry) ?? entry.itemKey, entry.quantity]);
}

test('recipe parents copy canonical moduleRecipes child lists onto composition.items', () => {
  const parents = listRegisteredItems().filter((item) => item.composition?.mode === 'recipe');
  assert.equal(parents.length, 28);

  for (const item of parents) {
    assert.ok(Array.isArray(item.composition.items), `${item.itemKey} composition.items missing`);
    const recipe = getModuleRecipe(
      item.composition.moduleType,
      item.dimensions?.widthCm,
      item.composition.options ?? {},
    );
    assert.ok(recipe, `${item.itemKey} missing moduleRecipes row`);
    assert.deepEqual(
      childTuples(item.composition.items),
      childTuples(recipe.items),
      item.itemKey,
    );
  }
});

test('cluster parents keep composition.items without recipe mode', () => {
  const clusters = listRegisteredItems().filter(
    (item) => item.composition?.items && item.composition?.mode !== 'recipe',
  );
  assert.deepEqual(
    clusters.map((item) => item.itemKey).sort(),
    ['furniture_sofa_set_classic', 'furniture_table_chair_set_eames'],
  );
});
