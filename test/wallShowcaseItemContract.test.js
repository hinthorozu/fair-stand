import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { MODULE_CATALOG } from '../src/catalog.js';
import { applyColorOverride, createShowcaseModuleState, duplicateModuleState, normalizeModuleItemState } from '../src/designState.js';
import { resolveItemBom } from '../src/itemBom.js';
import { getItem, getShowcaseBodyDefinition } from '../src/items.js';

const CASES = [
  { itemKey: 'wall_showcase_100_2', type: 'showcase-2', eyeCount: 2, sideItemKey: 'showcase_side_94_6_30', glassQuantity: 1, panelQuantity: 5, singleQuantity: 9 },
  { itemKey: 'wall_showcase_100_3', type: 'showcase-3', eyeCount: 3, sideItemKey: 'showcase_side_143_5_30', glassQuantity: 2, panelQuantity: 4, singleQuantity: 7 },
];

function quantities(lines) { return new Map(lines.map((line) => [line.itemKey, line.quantity])); }

test('wall_showcase parents own canonical cluster identity and child roles', () => {
  for (const expected of CASES) {
    const item = getItem(expected.itemKey);
    assert.equal(item.itemKey, expected.itemKey);
    assert.equal(item.type, expected.type);
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, { widthCm: 100 });
    assert.equal(item.eyeCount, expected.eyeCount);
    assert.deepEqual(item.bodyItems, { sideItemKey: expected.sideItemKey, horizontalItemKey: 'showcase_horizontal_87_4_30', glassShelfItemKey: 'glass_shelf' });
    assert.deepEqual(item.composition, { mode: 'recipe', moduleType: expected.type, nominalWidthCm: 100 });
  }
});

test('catalog keeps wall_showcase keys and derives canonical descriptor facts', () => {
  for (const expected of CASES) {
    const descriptor = MODULE_CATALOG[expected.itemKey];
    assert.equal(descriptor.itemKey, expected.itemKey);
    assert.equal(descriptor.type, expected.type);
    assert.equal(descriptor.widthCm, 100);
    assert.equal(descriptor.eyeCount, expected.eyeCount);
  }
  assert.equal(MODULE_CATALOG.showcase_2_100, undefined);
  assert.equal(MODULE_CATALOG.showcase_3_100, undefined);
});

test('recursive wall showcase BASE BOM expands verified physical children', () => {
  for (const expected of CASES) {
    const bom = quantities(resolveItemBom(expected.itemKey));
    assert.equal(bom.get('profile_91'), 4);
    assert.equal(bom.get('upright_346_5'), 2);
    assert.equal(bom.get('panel_98'), expected.panelQuantity);
    assert.equal(bom.get('connector_start'), 4);
    assert.equal(bom.get('connector_single'), expected.singleQuantity);
    assert.equal(bom.get(expected.sideItemKey), 2);
    assert.equal(bom.get('showcase_horizontal_87_4_30'), 2);
    assert.equal(bom.get('glass_shelf'), expected.glassQuantity);
    assert.equal(bom.has('showcase_2_100'), false);
    assert.equal(bom.has('showcase_3_100'), false);
  }
});

test('recursive wall showcase inner-corner BOM preserves canonical parent and verified child parity', () => {
  for (const expected of CASES) {
    const bom = quantities(resolveItemBom(expected.itemKey, 1, { panelVariant: 'inner-corner' }));
    assert.equal(bom.has('panel_98'), false);
    assert.equal(bom.get('panel_corner_92'), expected.panelQuantity);
    assert.equal(bom.get('connector_start'), 4);
    assert.equal(bom.get('connector_single'), 5);
    assert.equal(bom.get('connector_corner'), 4);
    assert.equal(bom.get(expected.sideItemKey), 2);
    assert.equal(bom.get('showcase_horizontal_87_4_30'), 2);
    assert.equal(bom.get('glass_shelf'), expected.glassQuantity);
    assert.equal(bom.has('showcase_2_100'), false);
    assert.equal(bom.has('showcase_3_100'), false);
  }
});

test('showcase body resolver owns canonical board geometry/default color', () => {
  for (const expected of CASES) {
    const body = getShowcaseBodyDefinition(expected.itemKey);
    assert.equal(body.sideItem.itemKey, expected.sideItemKey);
    assert.equal(body.horizontalItem.itemKey, 'showcase_horizontal_87_4_30');
    assert.equal(body.glassShelfItem.itemKey, 'glass_shelf');
    assert.equal(body.sideItem.material, 'sunta');
    assert.equal(body.horizontalItem.material, 'sunta');
    assert.equal(body.defaultColor, 0xffffff);
  }
});

test('factory/persistence use wall_showcase identity and one grouped color-only body override', () => {
  for (const expected of CASES) {
    const state = createShowcaseModuleState(expected.type, 100);
    assert.equal(state.itemKey, expected.itemKey);
    assert.equal(state.eyeCount, expected.eyeCount);
    assert.equal(state.bodySurface.color, '#ffffff');
    assert.equal('imageAssetId' in state.bodySurface, false);
    applyColorOverride(state.bodySurface, '#336699');
    assert.equal(state.bodySurface.color, '#336699');
    const duplicate = duplicateModuleState(state);
    assert.equal(duplicate.itemKey, expected.itemKey);
    assert.equal(duplicate.bodySurface.color, '#336699');
    assert.notEqual(duplicate.bodySurface.id, state.bodySurface.id);
  }

  const legacy = { id: 'legacy-showcase', type: 'showcase-2', widthCm: 100, strips: [] };
  normalizeModuleItemState(legacy);
  assert.equal(legacy.itemKey, 'wall_showcase_100_2');
  assert.equal(legacy.bodySurface.color, '#ffffff');
});

test('renderer reads canonical board facts and one selector targets exactly four body boards', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createShowcaseModule(');
  const end = source.indexOf('function createSelectionFrame', start);
  const showcase = source.slice(start, end);
  assert.match(showcase, /getShowcaseBodyDefinition\(moduleState\.itemKey\)/);
  assert.match(showcase, /sideDimensions\.lengthCm/);
  assert.match(showcase, /horizontalDimensions\.lengthCm/);
  assert.match(showcase, /surfaceRole: 'showcase-body'/);
  assert.match(showcase, /colorTargets: bodyColorTargets/);
  assert.doesNotMatch(showcase, /const showcaseDepth = 0\.30/);
});
