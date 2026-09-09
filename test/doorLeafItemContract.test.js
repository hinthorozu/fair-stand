import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getItemSurfaceCapabilities } from '../src/itemCapabilities.js';
import { createDoorModuleState, normalizeModuleItemState } from '../src/designState.js';
import { getExpandedModuleRecipe, getModuleRecipe } from '../src/moduleRecipes.js';
import { getDoorLeafProductionItem, getProductionItem } from '../src/productionParts.js';

test('door_leaf_100 owns canonical wooden door leaf product properties', () => {
  const item = getProductionItem('door_leaf_100');
  assert.equal(item.itemKey, 'door_leaf_100');
  assert.equal(item.partId, undefined);
  assert.equal(item.name, 'Ahşap Kapı Kanadı 100 × 200 cm');
  assert.equal(item.type, 'door-leaf');
  assert.equal(item.unit, 'adet');
  assert.deepEqual(item.dimensions, { widthCm: 100, heightCm: 200, thicknessCm: 8 });
  assert.equal(item.material, 'ahşap');
  assert.equal(item.defaultColor, 0xffffff);
  assert.equal(item.nominalModuleWidthCm, 100);
  assert.equal(getDoorLeafProductionItem(100), item);
  assert.equal(getDoorLeafProductionItem(150), null);
  assert.equal(getProductionItem('door_100'), null);
});

test('door-leaf type capability contract allows color and image only', () => {
  assert.deepEqual(getItemSurfaceCapabilities('door_leaf_100'), {
    color: true,
    image: true,
    glass: false,
    lightbox: false,
    mesh: false,
  });
});

test('door module factory binds the child leaf Item and consumes its canonical defaultColor', () => {
  const door = createDoorModuleState(100);
  assert.equal(door.surface.itemKey, 'door_leaf_100');
  assert.equal(door.surface.color, '#ffffff');
  assert.equal(door.surface.imageAssetId, null);
  assert.equal(door.surface.imageTransform.mode, 'single');
});

test('legacy persisted door surface is migrated without losing user color or image override', () => {
  const legacy = {
    id: 'module-old-door',
    type: 'door',
    widthCm: 100,
    strips: [],
    surface: {
      id: 'surface-old-door',
      color: '#123456',
      imageAssetId: 'asset-door',
      imageTransform: { mode: 'single', fit: 'cover' },
    },
  };
  const normalized = normalizeModuleItemState(legacy);
  assert.equal(normalized.surface.itemKey, 'door_leaf_100');
  assert.equal(normalized.surface.color, '#123456');
  assert.equal(normalized.surface.imageAssetId, 'asset-door');
  assert.equal(normalized.surface.imageTransform.fit, 'cover');
});

test('door recipe consumes canonical door_leaf_100 once and expanded BOM resolves it', () => {
  const recipe = getModuleRecipe('door', 100);
  const leaf = recipe.items.find((item) => item.itemKey === 'door_leaf_100');
  assert.deepEqual(leaf, { itemKey: 'door_leaf_100', quantity: 1 });

  const expanded = getExpandedModuleRecipe('door', 100);
  const expandedLeaf = expanded.items.find((item) => item.itemKey === 'door_leaf_100');
  assert.equal(expandedLeaf.quantity, 1);
  assert.equal(expandedLeaf.part.itemKey, 'door_leaf_100');
  assert.equal(expandedLeaf.part.unit, 'adet');
});

test('door renderer consumes Item-linked color/image capabilities while special panel modes remain disabled', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /const doorLeafItem = getProductionItem\(doorState\?\.itemKey\)/);
  assert.match(scene, /const doorLeafCapabilities = getItemSurfaceCapabilities\(doorLeafItem\)/);
  assert.match(scene, /itemKey: doorLeafItem\.itemKey/);
  assert.match(scene, /acceptsColor: doorLeafCapabilities\.color/);
  assert.match(scene, /mesh\.userData\.acceptsColor === false/);
  assert.match(scene, /acceptsImage: doorLeafCapabilities\.image/);
  assert.match(scene, /surfaceRole: 'door'[\s\S]*?selectionMode: 'module'/);
});
