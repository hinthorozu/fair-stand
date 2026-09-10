import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { MODULE_CATALOG, resolveModuleCatalogKey } from '../src/catalog.js';
import {
  applyColorOverride,
  createShowcaseModuleState,
  duplicateModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import { resolveItemBom } from '../src/itemBom.js';
import { getItem } from '../src/items.js';
import { getShowcaseBodyDefinition } from '../src/showcaseBody.js';

const CASES = [
  {
    itemKey: 'showcase_2_100',
    type: 'showcase-2',
    eyeCount: 2,
    sideItemKey: 'showcase_side_94_6_30',
    glassQuantity: 1,
    panelQuantity: 5,
    legacyCatalogKey: 'wall_showcase_100_2',
  },
  {
    itemKey: 'showcase_3_100',
    type: 'showcase-3',
    eyeCount: 3,
    sideItemKey: 'showcase_side_143_5_30',
    glassQuantity: 2,
    panelQuantity: 4,
    legacyCatalogKey: 'wall_showcase_100_3',
  },
];

function quantities(lines) {
  return new Map(lines.map((line) => [line.itemKey, line.quantity]));
}

test('showcase parent Items own canonical identity, width, eyeCount and body child roles', () => {
  for (const expected of CASES) {
    const item = getItem(expected.itemKey);
    assert.equal(item.itemKey, expected.itemKey);
    assert.equal(item.type, expected.type);
    assert.equal(item.unit, 'adet');
    assert.deepEqual(item.dimensions, { widthCm: 100 });
    assert.equal(item.eyeCount, expected.eyeCount);
    assert.deepEqual(item.bodyItems, {
      sideItemKey: expected.sideItemKey,
      horizontalItemKey: 'showcase_horizontal_87_4_30',
      glassShelfItemKey: 'glass_shelf',
    });
    assert.deepEqual(item.composition, {
      mode: 'recipe', moduleType: expected.type, nominalWidthCm: 100,
    });
  }
});

test('showcase body resolver validates shared canonical board product defaults', () => {
  for (const expected of CASES) {
    const body = getShowcaseBodyDefinition(expected.itemKey);
    assert.equal(body.item.itemKey, expected.itemKey);
    assert.equal(body.sideItem.itemKey, expected.sideItemKey);
    assert.equal(body.horizontalItem.itemKey, 'showcase_horizontal_87_4_30');
    assert.equal(body.glassShelfItem.itemKey, 'glass_shelf');
    assert.equal(body.sideItem.material, 'sunta');
    assert.equal(body.horizontalItem.material, 'sunta');
    assert.equal(body.defaultColor, 0xffffff);
  }
});

test('recursive showcase BOM expands verified base and inner-corner terminal quantities', () => {
  for (const expected of CASES) {
    const base = quantities(resolveItemBom(expected.itemKey));
    assert.equal(base.get(expected.sideItemKey), 2);
    assert.equal(base.get('showcase_horizontal_87_4_30'), 2);
    assert.equal(base.get('glass_shelf'), expected.glassQuantity);
    assert.equal(base.get('panel_98'), expected.panelQuantity);
    assert.equal(base.get('connector_start'), 4);

    const corner = quantities(resolveItemBom(expected.itemKey, 1, { panelVariant: 'inner-corner' }));
    assert.equal(corner.has('panel_98'), false);
    assert.equal(corner.get('panel_corner_92'), expected.panelQuantity);
    assert.equal(corner.get('connector_start'), 4);
    assert.equal(corner.get('connector_single'), 5);
    assert.equal(corner.get('connector_corner'), 4);
    assert.equal(corner.get(expected.sideItemKey), 2);
    assert.equal(corner.get('showcase_horizontal_87_4_30'), 2);
    assert.equal(corner.get('glass_shelf'), expected.glassQuantity);
  }
});

test('catalog uses canonical showcase itemKeys and resolves old wall_showcase keys only as restore aliases', () => {
  for (const expected of CASES) {
    const descriptor = MODULE_CATALOG[expected.itemKey];
    assert.ok(descriptor);
    assert.equal(descriptor.itemKey, expected.itemKey);
    assert.equal(descriptor.type, expected.type);
    assert.equal(descriptor.widthCm, 100);
    assert.equal(descriptor.eyeCount, expected.eyeCount);
    assert.equal(MODULE_CATALOG[expected.legacyCatalogKey], undefined);
    assert.equal(
      resolveModuleCatalogKey({ catalogKey: expected.legacyCatalogKey, type: expected.type, widthCm: 100 }),
      expected.itemKey,
    );
  }
});

test('showcase factory creates canonical parent identity plus one color-only body override surface', () => {
  for (const expected of CASES) {
    const state = createShowcaseModuleState(expected.type, 100);
    assert.equal(state.itemKey, expected.itemKey);
    assert.equal(state.type, expected.type);
    assert.equal(state.widthCm, 100);
    assert.equal(state.eyeCount, expected.eyeCount);
    assert.equal(state.bodySurface.color, '#ffffff');
    assert.equal('imageAssetId' in state.bodySurface, false);
    assert.equal('imageTransform' in state.bodySurface, false);

    applyColorOverride(state.bodySurface, '#336699');
    assert.equal(state.bodySurface.color, '#336699');
    assert.equal('imageAssetId' in state.bodySurface, false);
  }
});

test('legacy persisted showcase state normalizes to canonical identity/default without erasing existing body color', () => {
  const legacy = {
    id: 'legacy-showcase',
    type: 'showcase-2',
    widthCm: 100,
    strips: [],
  };
  normalizeModuleItemState(legacy);
  assert.equal(legacy.itemKey, 'showcase_2_100');
  assert.equal(legacy.eyeCount, 2);
  assert.equal(legacy.bodySurface.color, '#ffffff');

  const colored = {
    id: 'colored-showcase',
    type: 'showcase-3',
    widthCm: 100,
    strips: [],
    bodySurface: { id: 'body-existing', color: '#123456', imageAssetId: 'must-not-exist' },
  };
  normalizeModuleItemState(colored);
  assert.equal(colored.itemKey, 'showcase_3_100');
  assert.equal(colored.bodySurface.color, '#123456');
  assert.equal('imageAssetId' in colored.bodySurface, false);
});

test('duplicating a showcase preserves grouped body color with independent override identity', () => {
  const original = createShowcaseModuleState('showcase-3', 100);
  original.bodySurface.color = '#abcdef';
  const duplicate = duplicateModuleState(original);
  assert.equal(duplicate.itemKey, 'showcase_3_100');
  assert.equal(duplicate.bodySurface.color, '#abcdef');
  assert.notEqual(duplicate.bodySurface.id, original.bodySurface.id);
});

test('renderer consumes canonical showcase body resolver and one surface targets exactly four boards', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createShowcaseModule(');
  const end = source.indexOf('function createSelectionFrame', start);
  const showcase = source.slice(start, end);
  assert.match(showcase, /getShowcaseBodyDefinition\(moduleState\.itemKey\)/);
  assert.match(showcase, /sideDimensions\.lengthCm/);
  assert.match(showcase, /horizontalDimensions\.lengthCm/);
  assert.match(showcase, /sideDimensions\.thicknessCm/);
  assert.match(showcase, /moduleState\.bodySurface\.color/);
  assert.match(showcase, /surfaceRole: 'showcase-body'/);
  assert.match(showcase, /colorTargets: bodyColorTargets/);
  assert.match(showcase, /bodyColorTargets\.push\(sidePanel\)/);
  assert.match(showcase, /bodyColorTargets\.push\(cap\)/);
  assert.doesNotMatch(showcase, /const showcaseDepth = 0\.30/);
});
