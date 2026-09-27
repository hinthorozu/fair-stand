import test from 'node:test';
import assert from 'node:assert/strict';

import { groupBomLines } from '../src/bomLineGroups.js';
import { resolveItemBom } from '../src/itemBom.js';
import { initializeItemRegistry, listRegisteredItems } from '../src/items.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getModuleRecipe } from './recipeParentItemKey.js';

// Live fair_stand component rows. Seed still has these three shelves as leaves.
const LIVE_SHELF_RECIPES = Object.freeze({
  shelf_100: Object.freeze({ board: 'shelf_100_self', boardName: 'Raf 100 Tek', legs: 2, boardVisible: false }),
  shelf_150: Object.freeze({ board: 'shelf_150_self', boardName: 'Raf 150 Tek', legs: 3, boardVisible: false }),
  shelf_200: Object.freeze({ board: 'shelf_200_self', boardName: 'Raf 200 Tek', legs: 3, boardVisible: true }),
});

function catalogWithLiveShelfRecipes(items) {
  const next = items.map((item) => structuredClone(item));
  const boards = [];
  for (const item of next) {
    const spec = LIVE_SHELF_RECIPES[item.itemKey];
    if (!spec) continue;
    const board = structuredClone(item);
    board.itemKey = spec.board;
    board.name = spec.boardName;
    board.catalogVisible = spec.boardVisible;
    board.isRender = false;
    board.acceptsColor = false;
    board.acceptsImage = false;
    board.acceptsLightbox = false;
    board.acceptsGlass = false;
    board.acceptsMesh = false;
    board.composition = {
      items: [{ itemKey: 'shelf_leg', quantity: spec.legs }],
    };
    boards.push(board);
    item.composition = {
      mode: 'recipe',
      items: [
        { itemKey: spec.board, quantity: 1 },
        { itemKey: 'shelf_leg', quantity: spec.legs },
      ],
    };
  }
  return [...next, ...boards];
}

function quantities(itemKey) {
  return Object.fromEntries(resolveItemBom(itemKey).map((line) => [line.itemKey, line.quantity]));
}

test('live shelf recipes expand to the board plus the stored shelf_leg quantity', () => {
  const snapshot = listRegisteredItems().map((item) => structuredClone(item));
  try {
    initializeItemRegistry(catalogWithLiveShelfRecipes(snapshot));

    assert.deepEqual(quantities('shelf_100'), { shelf_100_self: 1, shelf_leg: 2 });
    assert.deepEqual(quantities('shelf_150'), { shelf_150_self: 1, shelf_leg: 3 });
    assert.deepEqual(quantities('shelf_200'), { shelf_200_self: 1, shelf_leg: 3 });

    for (const line of resolveItemBom('shelf_200')) {
      assert.equal(line.unit, 'adet');
    }

    assert.equal(resolveModuleContract('shelf_100').bom.mode, 'recipe');
    assert.equal(resolveModuleContract('shelf_150').bom.mode, 'recipe');
    assert.equal(resolveModuleContract('shelf_200').bom.mode, 'recipe');
    assert.equal(getModuleRecipe('shelf', 100), null);
    assert.equal(getModuleRecipe('shelf', 150), null);
    assert.equal(getModuleRecipe('shelf', 200), null);

    const groups = groupBomLines(resolveItemBom('shelf_100'));
    assert.deepEqual(groups.map((group) => group.id), ['shelf']);
    assert.deepEqual(
      groups[0].lines.map((line) => line.itemKey).sort(),
      ['shelf_100_self', 'shelf_leg'],
    );
  } finally {
    initializeItemRegistry(snapshot);
  }
});

test('shelf board components without recipe mode stay off the list', () => {
  const snapshot = listRegisteredItems().map((item) => structuredClone(item));
  try {
    initializeItemRegistry(catalogWithLiveShelfRecipes(snapshot));

    for (const spec of Object.values(LIVE_SHELF_RECIPES)) {
      const board = listRegisteredItems().find((item) => item.itemKey === spec.board);
      assert.equal(board.name, spec.boardName);
      assert.equal(board.catalogVisible, spec.boardVisible);
      assert.equal(board.isRender, false);
      assert.equal(board.composition.mode, undefined);
      assert.deepEqual(board.composition.items, [{ itemKey: 'shelf_leg', quantity: spec.legs }]);
      assert.deepEqual(quantities(spec.board), { [spec.board]: 1 });
      assert.equal(resolveModuleContract(spec.board).bom.mode, 'self');
    }
  } finally {
    initializeItemRegistry(snapshot);
  }
});
