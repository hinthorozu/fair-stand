import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createModuleStateFromCatalogKey,
  createModuleStateFromDescriptor,
} from '../src/designState.js';
import { getItem, itemHasSceneRender, listRegisteredItems } from '../src/items.js';

const DESIGN_STATE_SOURCE = readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');

test('factory gates on item.isRender, not catalogVisible or type lists', () => {
  assert.match(DESIGN_STATE_SOURCE, /itemHasSceneRender/);
  assert.doesNotMatch(DESIGN_STATE_SOURCE, /catalogVisible/);
  assert.doesNotMatch(DESIGN_STATE_SOURCE, /PLACEABLE_ITEM_TYPES/);

  const virtual = [];
  const catalogHiddenButRenderable = [];
  for (const item of listRegisteredItems()) {
    const fromItem = createModuleStateFromDescriptor(item);
    const fromKey = createModuleStateFromCatalogKey(item.itemKey);
    if (item.isRender !== true) {
      virtual.push(item.itemKey);
      assert.equal(itemHasSceneRender(item), false, item.itemKey);
      assert.equal(fromItem, null, item.itemKey);
      assert.equal(fromKey, null, item.itemKey);
      continue;
    }
    assert.equal(itemHasSceneRender(item.itemKey), true, item.itemKey);
    if (item.catalogVisible !== true) catalogHiddenButRenderable.push(item.itemKey);
  }

  assert.ok(virtual.includes('panel_197'));
  assert.ok(virtual.includes('connector_start'));
  assert.equal(createModuleStateFromDescriptor(getItem('panel_197')), null);
  assert.equal(createModuleStateFromCatalogKey('connector_start'), null);

  assert.ok(catalogHiddenButRenderable.includes('upright_99'));
  assert.ok(catalogHiddenButRenderable.includes('illuminated-foam'));
  const upright = createModuleStateFromCatalogKey('upright_99');
  assert.ok(upright);
  assert.equal(upright.itemKey, 'upright_99');
  const foam = createModuleStateFromCatalogKey('illuminated-foam');
  assert.ok(foam);
  assert.equal(foam.itemKey, 'illuminated-foam');

  const wall = createModuleStateFromCatalogKey('wall_200_350');
  assert.ok(wall);
  assert.equal(wall.itemKey, 'wall_200_350');
});
