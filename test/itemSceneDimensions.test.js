import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  getCatalogItem,
  listCatalogItems,
  MODULE_CATALOG,
  MODULE_CATALOG_KEYS,
} from '../src/catalog.js';
import {
  createProfileModuleState,
  createUprightModuleState,
  normalizeModuleItemState,
} from '../src/designState.js';
import {
  getItem,
  listRegisteredItems,
  resolveItemKey,
  resolveSceneDimensions,
  SCENE_DIMENSION_FIELDS,
} from '../src/items.js';

const ITEMS_SOURCE = readFileSync(new URL('../src/items.js', import.meta.url), 'utf8');
const CATALOG_SOURCE = readFileSync(new URL('../src/catalog.js', import.meta.url), 'utf8');
const DESIGN_STATE_SOURCE = readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');
const RESOLVER_SOURCE = ITEMS_SOURCE.slice(
  ITEMS_SOURCE.indexOf('export function resolveSceneDimensions'),
  ITEMS_SOURCE.indexOf('export function requireSceneDimension'),
);

function syntheticItem(dimensions, sceneDimensions) {
  return { itemKey: 'synthetic', dimensions, sceneDimensions };
}

test('1. scene width override physical width’i ezer', () => {
  const scene = resolveSceneDimensions(syntheticItem(
    { widthCm: 190 },
    { widthCm: 250 },
  ));
  assert.equal(scene.widthCm, 250);
});

test('2. scene width null ise physical width kullanılır', () => {
  const scene = resolveSceneDimensions(syntheticItem(
    { widthCm: 190 },
    { widthCm: null },
  ));
  assert.equal(scene.widthCm, 190);
});

test('3. sceneDimensions yoksa physical width kullanılır', () => {
  const scene = resolveSceneDimensions(syntheticItem({ widthCm: 190 }, undefined));
  assert.equal(scene.widthCm, 190);
});

test('4. lengthCm widthCm’e çapraz düşmez; effective width MISSING', () => {
  const scene = resolveSceneDimensions(syntheticItem({ lengthCm: 190 }, undefined));
  assert.equal(scene.widthCm, null);
  assert.equal(scene.lengthCm, 190);
});

test('5. thicknessCm depthCm’e çapraz düşmez; effective depth MISSING', () => {
  const scene = resolveSceneDimensions(syntheticItem({ thicknessCm: 8 }, undefined));
  assert.equal(scene.depthCm, null);
  assert.equal(scene.thicknessCm, 8);
});

test('6. scene length null ise physical length kullanılır', () => {
  const scene = resolveSceneDimensions(syntheticItem(
    { lengthCm: 190 },
    { lengthCm: null },
  ));
  assert.equal(scene.lengthCm, 190);
});

test('7. scene thickness null ise physical thickness kullanılır', () => {
  const scene = resolveSceneDimensions(syntheticItem(
    { thicknessCm: 8 },
    { thicknessCm: null },
  ));
  assert.equal(scene.thicknessCm, 8);
});

test('8. profile_190 physical length/thickness ve scene width/depth/height', () => {
  const item = getItem('profile_190');
  assert.deepEqual(item.dimensions, { lengthCm: 190, thicknessCm: 8 });
  assert.deepEqual(item.sceneDimensions, { widthCm: 200, depthCm: 8, heightCm: 350 });
  assert.deepEqual(resolveSceneDimensions(item), Object.freeze({
    widthCm: 200,
    depthCm: 8,
    heightCm: 350,
    lengthCm: 190,
    thicknessCm: 8,
  }));
});

test('9. profile factory Recipe’den scene width okumaz', () => {
  assert.doesNotMatch(DESIGN_STATE_SOURCE, /getStraightWallNominalWidthForProfileItem/);
  assert.doesNotMatch(DESIGN_STATE_SOURCE, /from ['"]\.\/moduleRecipes\.js['"]/);
  const profile = createProfileModuleState({ itemKey: 'profile_190' });
  assert.equal(profile.widthCm, 200);
  assert.equal(profile.depthCm, 8);
  assert.equal(profile.heightCm, 350);
  const stale = normalizeModuleItemState({
    id: 'stale',
    itemKey: 'profile_190',
    type: 'profile',
    widthCm: 190,
    depthCm: 8,
    heightCm: 350,
  });
  assert.equal(stale.widthCm, 200);
});

test('10. Catalog profile width catalogWidthCm okumaz', () => {
  assert.doesNotMatch(CATALOG_SOURCE, /catalogWidthCm/);
  assert.match(CATALOG_SOURCE, /resolveSceneDimensions/);
  assert.equal(getCatalogItem('profile_190').widthCm, 200);
  assert.equal(getCatalogItem('profile_190').depthCm, 8);
  assert.equal(getCatalogItem('profile_190').heightCm, 350);
});

test('11. catalogWidthCm canonical Item field olarak kalmaz', () => {
  for (const item of listRegisteredItems()) {
    assert.equal(Object.hasOwn(item, 'catalogWidthCm'), false, item.itemKey);
  }
  assert.doesNotMatch(ITEMS_SOURCE, /catalogWidthCm/);
});

test('12. resolveItemKey catalogWidthCm kullanmaz', () => {
  const identitySource = ITEMS_SOURCE.slice(
    ITEMS_SOURCE.indexOf('function getItemIdentityFields'),
    ITEMS_SOURCE.indexOf('export function resolveItemKey'),
  );
  assert.doesNotMatch(identitySource, /catalogWidthCm/);
  assert.match(identitySource, /resolveSceneDimensions/);
  assert.equal(resolveItemKey({ type: 'profile', widthCm: 200 }), 'profile_190');
  assert.equal(resolveItemKey({ type: 'profile', widthCm: 190 }), null);
});

test('13. scene dimension için type fallback yok', () => {
  assert.doesNotMatch(RESOLVER_SOURCE, /item\.type/);
  assert.doesNotMatch(RESOLVER_SOURCE, /type ===/);
});

test('14. scene dimension için itemKey hardcode yok', () => {
  assert.doesNotMatch(RESOLVER_SOURCE, /itemKey ===/);
  assert.doesNotMatch(RESOLVER_SOURCE, /profile_190/);
});

test('15. scene dimension için Recipe fallback yok', () => {
  assert.doesNotMatch(RESOLVER_SOURCE, /Recipe/);
  assert.doesNotMatch(RESOLVER_SOURCE, /nominalWidth/);
  assert.doesNotMatch(ITEMS_SOURCE.slice(
    ITEMS_SOURCE.indexOf('export function resolveSceneDimensions'),
    ITEMS_SOURCE.indexOf('export function requireSceneDimension'),
  ), /moduleRecipes/);
});

test('16. scene dimension için Catalog fallback yok', () => {
  assert.doesNotMatch(RESOLVER_SOURCE, /catalog/i);
  assert.doesNotMatch(RESOLVER_SOURCE, /getCatalogItem/);
});

test('17. same-field dışında cross-remap yok', () => {
  const emptyOverride = resolveSceneDimensions(syntheticItem(
    { lengthCm: 190, thicknessCm: 8 },
    {},
  ));
  assert.equal(emptyOverride.widthCm, null);
  assert.equal(emptyOverride.depthCm, null);
  assert.equal(emptyOverride.heightCm, null);
  assert.equal(emptyOverride.lengthCm, 190);
  assert.equal(emptyOverride.thicknessCm, 8);

  const remapAttempt = resolveSceneDimensions(syntheticItem(
    { lengthCm: 190, thicknessCm: 8 },
    { widthCm: null, depthCm: null, heightCm: null },
  ));
  assert.equal(remapAttempt.widthCm, null);
  assert.equal(remapAttempt.depthCm, null);
  assert.equal(remapAttempt.heightCm, null);

  for (const field of SCENE_DIMENSION_FIELDS) {
    assert.match(RESOLVER_SOURCE, new RegExp(`readDimensionField\\(item\\?\\.sceneDimensions, field\\)`));
    assert.equal(
      resolveSceneDimensions(syntheticItem({ [field]: 11 }, { [field]: 22 }))[field],
      22,
      field,
    );
  }
});

test('18. 99 Item registry korunuyor', () => {
  assert.equal(listRegisteredItems().length, 99);
});

test('19. 58 visible Catalog Item korunuyor', () => {
  assert.equal(listRegisteredItems().filter((item) => item.catalogVisible === true).length, 58);
});

test('20. 58 Catalog projection korunuyor', () => {
  assert.equal(listCatalogItems().length, 58);
  assert.equal(MODULE_CATALOG_KEYS.length, 58);
  assert.equal(Object.keys(MODULE_CATALOG).length, 58);
});

test('upright_346_5 sceneDimensions placement 8×8×346.5; length→height remap yok', () => {
  const item = getItem('upright_346_5');
  assert.deepEqual(item.dimensions, { lengthCm: 346.5, thicknessCm: 8 });
  assert.deepEqual(item.sceneDimensions, { widthCm: 8, depthCm: 8, heightCm: 346.5 });
  const state = createUprightModuleState();
  assert.equal(state.widthCm, 8);
  assert.equal(state.depthCm, 8);
  assert.equal(state.heightCm, 346.5);
});

test('MISSING_PHYSICAL_DIMENSIONS: connector/shelf_leg/hali tahmin edilmez', () => {
  for (const itemKey of [
    'connector_start',
    'connector_single',
    'connector_double',
    'connector_corner',
    'shelf_leg',
    'hali',
  ]) {
    const item = getItem(itemKey);
    assert.equal(item.dimensions, undefined, itemKey);
    const scene = resolveSceneDimensions(item);
    for (const field of SCENE_DIMENSION_FIELDS) {
      assert.equal(scene[field], null, `${itemKey}.${field}`);
    }
  }
});
