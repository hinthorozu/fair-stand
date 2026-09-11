import test from 'node:test';
import assert from 'node:assert/strict';
import { WALL_MEDIA_ITEMS, resolveWallMediaMetrics, getItem } from '../src/items.js';
import { MODULE_CATALOG, resolveModuleCatalogKey } from '../src/catalog.js';
import { createModuleStateFromDescriptor, duplicateModuleState, normalizeModuleItemState } from '../src/designState.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

for (const item of Object.values(WALL_MEDIA_ITEMS)) {
  test(`${item.itemKey}: canonical wall-media identity, state and BOM policy`, () => {
    const metrics = resolveWallMediaMetrics(item.itemKey);
    const catalog = MODULE_CATALOG[item.itemKey];
    const isVideoWall = Boolean(item.videoWall);

    // Catalog descriptor is projected from the canonical Item.
    assert.equal(catalog.itemKey, item.itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.type, 'tv');
    assert.equal(catalog.sizeInch, item.sizeInch);
    assert.equal(catalog.widthCm, metrics.widthCm);
    assert.equal(catalog.depthCm, metrics.depthCm);
    assert.equal(catalog.heightCm, metrics.catalogHeightCm);
    assert.equal(catalog.screenWidthCm, metrics.screenWidthCm);
    assert.equal(catalog.screenHeightCm, metrics.screenHeightCm);
    assert.equal(catalog.videoWallRows, isVideoWall ? item.videoWall.rows : undefined);
    assert.equal(catalog.videoWallCols, isVideoWall ? item.videoWall.cols : undefined);
    assert.equal(catalog.panelScreenWidthCm, isVideoWall ? item.videoWall.panelScreenWidthCm : undefined);

    // A runtime instance sources every default from the Item.
    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, item.itemKey);
    assert.equal(state.catalogKey, item.itemKey);
    assert.equal(state.type, 'tv');
    assert.equal(state.sizeInch, item.sizeInch);
    assert.equal(state.widthCm, metrics.widthCm);
    assert.equal(state.depthCm, metrics.depthCm);
    assert.equal(state.heightCm, metrics.screenHeightCm);
    assert.equal(state.screenWidthCm, metrics.screenWidthCm);
    assert.equal(state.screenHeightCm, metrics.screenHeightCm);
    assert.equal(state.videoWallRows, metrics.videoWallRows);
    assert.equal(state.videoWallCols, metrics.videoWallCols);
    assert.equal(state.panelScreenWidthCm, metrics.panelScreenWidthCm);
    assert.equal(state.panelScreenHeightCm, metrics.panelScreenHeightCm);

    // Shared wall-overlay behavior family; no per-item behavior override.
    assert.equal(getModuleBehavior(state).placement, 'wall-overlay');

    // BOM stays decision-required with no fabricated source/unit.
    assert.equal(Object.hasOwn(item, 'unit'), false);
    const contract = resolveModuleContract(item.itemKey);
    assert.equal(contract.bom.mode, 'decision-required');
    assert.equal(contract.bom.source, null);

    // Legacy project load: catalogKey -> itemKey hydration resolves the canonical key.
    // Fake historical footprint widthCm=100 is rewritten to the screen width.
    const legacy = JSON.parse(JSON.stringify(state));
    delete legacy.itemKey;
    delete legacy.catalogKey;
    legacy.widthCm = 100;
    const restored = normalizeModuleItemState(legacy);
    assert.equal(restored.itemKey, item.itemKey);
    assert.equal(restored.widthCm, metrics.screenWidthCm);
    assert.equal(resolveModuleCatalogKey(restored), item.itemKey);

    // Duplicate is an independent instance carrying the same product identity.
    const duplicate = duplicateModuleState(state);
    assert.notEqual(duplicate.id, state.id);
    assert.equal(duplicate.itemKey, item.itemKey);
  });
}

test('video walls are singular parametric Items whose totals derive from panel x grid', () => {
  for (const key of ['VIDEO_WALL_2X2', 'VIDEO_WALL_3X3']) {
    const item = getItem(key);
    const metrics = resolveWallMediaMetrics(key);
    assert.ok(item.videoWall);
    assert.equal(metrics.screenWidthCm, item.videoWall.panelScreenWidthCm * item.videoWall.cols);
    assert.equal(metrics.screenHeightCm, item.videoWall.panelScreenHeightCm * item.videoWall.rows);
    assert.equal(metrics.widthCm, metrics.screenWidthCm);
    // One instance carries the whole grid; it is not a composite of N x TV_55.
    const state = createModuleStateFromDescriptor(MODULE_CATALOG[key]);
    assert.equal(state.videoWallRows, item.videoWall.rows);
    assert.equal(state.videoWallCols, item.videoWall.cols);
  }
});

test('ordinary and video-wall Items use screen width as placement width', () => {
  for (const key of Object.keys(WALL_MEDIA_ITEMS)) {
    const metrics = resolveWallMediaMetrics(key);
    assert.equal(metrics.widthCm, metrics.screenWidthCm);
    const state = createModuleStateFromDescriptor(MODULE_CATALOG[key]);
    assert.equal(state.widthCm, state.screenWidthCm);
  }
});

test('ordinary TV Items keep the 350 cm catalog mounting height but render at screen height', () => {
  for (const key of ['TV_42', 'TV_55', 'TV_65']) {
    const metrics = resolveWallMediaMetrics(key);
    assert.equal(MODULE_CATALOG[key].heightCm, 350);
    const state = createModuleStateFromDescriptor(MODULE_CATALOG[key]);
    assert.equal(state.heightCm, metrics.screenHeightCm);
    assert.notEqual(metrics.screenHeightCm, 350);
  }
});
