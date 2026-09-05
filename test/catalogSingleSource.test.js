import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  getModuleCatalogLabel,
  MODULE_CATALOG,
  MODULE_CATALOG_GROUPS,
  MODULE_CATALOG_KEYS,
  resolveModuleCatalogKey,
} from '../src/catalog.js';

test('every catalog module belongs to exactly one catalog group', () => {
  const groupedKeys = MODULE_CATALOG_GROUPS.flatMap((group) => group.keys);
  assert.equal(groupedKeys.length, MODULE_CATALOG_KEYS.length);
  assert.deepEqual([...groupedKeys].sort(), [...MODULE_CATALOG_KEYS].sort());
  assert.equal(new Set(groupedKeys).size, groupedKeys.length);
});

test('every catalog module resolves its single-source key and label', () => {
  MODULE_CATALOG_KEYS.forEach((moduleKey) => {
    const module = MODULE_CATALOG[moduleKey];
    assert.ok(module, moduleKey);
    assert.equal(resolveModuleCatalogKey({ ...module, catalogKey: moduleKey }), moduleKey);
    assert.equal(getModuleCatalogLabel({ ...module, catalogKey: moduleKey }), module.label);
  });
});

test('legacy separators resolve exact normal versus vine catalog identity from modelFile', () => {
  assert.equal(resolveModuleCatalogKey({ type: 'separator', widthCm: 100 }), 'wall_separator_100');
  assert.equal(resolveModuleCatalogKey({ type: 'separator', widthCm: 50 }), 'wall_separator_50');
  assert.equal(
    resolveModuleCatalogKey({ type: 'separator', widthCm: 100, modelFile: 'wall_separator_100_sarmasik.glb' }),
    'wall_separator_100_sarmasik',
  );
  assert.equal(
    resolveModuleCatalogKey({ type: 'separator', widthCm: 50, modelFile: 'wall_separator_50_sarmasik.glb' }),
    'wall_separator_50_sarmasik',
  );
});

test('left catalog, context catalog and drag badge share catalog presentation source', () => {
  const sidebar = readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
  const contextMenu = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

  assert.match(sidebar, /MODULE_CATALOG_GROUPS/);
  assert.match(contextMenu, /createModuleCatalogPreview/);
  assert.match(contextMenu, /getModuleCatalogLabel/);
  assert.match(scene, /createModuleCatalogPreview/);
  assert.match(scene, /getModuleCatalogLabel/);
  assert.doesNotMatch(scene, /function getDragModuleLabel/);
});
