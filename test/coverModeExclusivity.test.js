import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('glass cancels any active Lightbox or Mesh group before applying glass', () => {
  assert.match(scene, /const glassMeshes = normalizeMeshes\(meshOrMeshes\)\.filter/);
  assert.match(scene, /if \(glass\) \{[\s\S]*?conflictingFabricGroupIds[\s\S]*?clearFabricState\(surface\)[\s\S]*?rebuildFabricOverlays\(\);/);
});

test('Lightbox and Mesh cancel glass before creating their one-piece cover', () => {
  assert.match(scene, /if \(fabric\) \{\s*applyGlassMode\(meshes, false\);\s*\}/);
  assert.match(scene, /const replacedGroupIds = new Set/);
  assert.match(scene, /state\.fabricType = resolvedFabricType/);
});

test('image plus glass keeps the image and uses the centralized glass appearance contract', () => {
  assert.match(scene, /const hasImage = Boolean\(mesh\.material\.map\)/);
  assert.match(scene, /mesh\.material\.transparent = glass/);
  assert.match(scene, /mesh\.material\.opacity = glass \? GLASS_APPEARANCE\.opacity : 1/);
  assert.match(scene, /mesh\.material\.depthWrite = !glass/);
  assert.match(scene, /glass\s*\? \(hasImage \? 0xffffff : GLASS_APPEARANCE\.color\)/);
  assert.match(scene, /backing\.material\.opacity = glass \? PANEL_GLASS_BACKING_APPEARANCE\.opacity : 1/);
});

test('Mesh stays one continuous plane without a perforation mask', () => {
  assert.match(scene, /new THREE\.PlaneGeometry\(width, height\)/);
  assert.doesNotMatch(scene, /overlayMaterial\.alphaMap/);
  assert.doesNotMatch(scene, /overlayMaterial\.alphaTest/);
  assert.doesNotMatch(scene, /overlayMaterial\.alphaToCoverage/);
  assert.match(scene, /if \(fabricType === 'mesh'\) \{[\s\S]*?overlayMaterial\.transparent = true;[\s\S]*?overlayMaterial\.opacity = MESH_FABRIC_OPACITY;[\s\S]*?overlayMaterial\.depthWrite = false;/);
  assert.match(scene, /material\.opacity = fabricType === 'mesh' \? MESH_FABRIC_OPACITY : 1/);
  assert.match(scene, /material\.transparent = fabricType === 'mesh'/);
  assert.match(scene, /material\.depthWrite = fabricType !== 'mesh'/);
});