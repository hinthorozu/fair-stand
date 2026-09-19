import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveWallMediaMetrics, getItem, listRegisteredItems, resolveSceneDimensions, resolveItemKey } from '../src/items.js';
import {
  getCatalogItem,
} from '../src/catalog.js';
import { createModuleStateFromDescriptor, duplicateModuleState, normalizeModuleItemState } from '../src/designState.js';
import { resolveModuleContract } from '../src/moduleContracts.js';
import { getModuleBehavior } from '../src/moduleBehavior.js';

for (const item of listRegisteredItems().filter((entry) => entry.type === 'tv')) {
  test(`${item.itemKey}: canonical wall-media identity, state and BOM policy`, () => {
    const metrics = resolveWallMediaMetrics(item.itemKey);
    const catalog = getCatalogItem(item.itemKey);
    const scene = resolveSceneDimensions(item);
    const isVideoWall = Boolean(item.videoWall);

    assert.equal(catalog.itemKey, item.itemKey);
    assert.equal(catalog.label, item.name);
    assert.equal(catalog.previewId, item.previewId);
    assert.equal(Object.hasOwn(catalog, 'type'), false);
    assert.equal(Object.hasOwn(catalog, 'widthCm'), false);
    assert.equal(Object.hasOwn(catalog, 'depthCm'), false);
    assert.equal(Object.hasOwn(catalog, 'heightCm'), false);
    assert.equal(Object.hasOwn(catalog, 'videoWallRows'), false);
    assert.equal(Object.hasOwn(catalog, 'videoWallCols'), false);
    assert.equal(Object.hasOwn(catalog, 'sizeInch'), false);
    assert.equal(Object.hasOwn(catalog, 'screenWidthCm'), false);
    assert.equal(Object.hasOwn(catalog, 'panelScreenWidthCm'), false);

    const state = createModuleStateFromDescriptor(catalog);
    assert.equal(state.itemKey, item.itemKey);
    assert.equal(state.type, 'tv');
    assert.equal(state.widthCm, scene.widthCm);
    assert.equal(state.depthCm, scene.depthCm);
    assert.equal(state.heightCm, scene.heightCm);
    assert.equal(state.videoWallRows, isVideoWall ? item.videoWall.rows : 1);
    assert.equal(state.videoWallCols, isVideoWall ? item.videoWall.cols : 1);
    assert.equal(Object.hasOwn(state, 'sizeInch'), false);
    assert.equal(Object.hasOwn(state, 'screenWidthCm'), false);
    assert.equal(Object.hasOwn(state, 'panelScreenWidthCm'), false);

    assert.equal(getModuleBehavior(state).placement, 'wall-overlay');

    assert.equal(Object.hasOwn(item, 'unit'), false);
    const contract = resolveModuleContract(item.itemKey);
    assert.equal(contract.bom.mode, 'decision-required');
    assert.equal(contract.bom.source, null);

    const legacy = JSON.parse(JSON.stringify(state));
    delete legacy.itemKey;
    const restored = normalizeModuleItemState(legacy);
    assert.equal(restored.itemKey, item.itemKey);
    assert.equal(restored.widthCm, scene.widthCm);
    assert.equal(resolveItemKey(restored), item.itemKey);

    const duplicate = duplicateModuleState(state);
    assert.notEqual(duplicate.id, state.id);
    assert.equal(duplicate.itemKey, item.itemKey);

    assert.equal(metrics.widthCm, scene.widthCm);
    assert.equal(metrics.heightCm, scene.heightCm);
  });
}

test('video walls read panel size from VIDEO_WALL_PANEL and keep rows/cols on the parent', () => {
  const panel = getItem('VIDEO_WALL_PANEL');
  assert.equal(panel.catalogVisible, false);
  assert.equal(panel.name, 'Video Wall Panel');
  assert.deepEqual(panel.dimensions, { widthCm: 108.5, heightCm: 61 });
  assert.equal(Object.hasOwn(panel.dimensions, 'depthCm'), false);

  for (const key of ['VIDEO_WALL_2X2', 'VIDEO_WALL_3X3']) {
    const item = getItem(key);
    const metrics = resolveWallMediaMetrics(key);
    assert.ok(item.videoWall);
    assert.equal(item.videoWall.panelItemKey, 'VIDEO_WALL_PANEL');
    assert.equal(Object.hasOwn(item.videoWall, 'panelScreenWidthCm'), false);
    assert.equal(metrics.widthCm, panel.dimensions.widthCm * item.videoWall.cols);
    assert.equal(metrics.heightCm, panel.dimensions.heightCm * item.videoWall.rows);
    const state = createModuleStateFromDescriptor(getCatalogItem(key));
    assert.equal(state.videoWallRows, item.videoWall.rows);
    assert.equal(state.videoWallCols, item.videoWall.cols);
  }
});

test('ordinary TV Items use canonical dimensions as catalog and scene height', () => {
  const expectedHeight = { TV_42: 52.3, TV_55: 68.5, TV_65: 80.9 };
  for (const key of ['TV_42', 'TV_55', 'TV_65']) {
    const item = getItem(key);
    const scene = resolveSceneDimensions(item);
    assert.equal(item.dimensions.heightCm, expectedHeight[key]);
    assert.equal(getCatalogItem(key).itemKey, key);
    assert.equal(scene.heightCm, expectedHeight[key]);
    const state = createModuleStateFromDescriptor(getCatalogItem(key));
    assert.equal(state.heightCm, item.dimensions.heightCm);
    assert.notEqual(state.heightCm, 350);
  }
});
