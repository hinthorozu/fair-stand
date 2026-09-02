import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('asset deletion clears matching live panel and fabric textures immediately', () => {
  assert.match(scene, /function clearImageAssetById\(assetId\)/);
  assert.match(scene, /surfaceState\?\.imageAssetId === assetId/);
  assert.match(scene, /surfaceState\?\.fabricImageAssetId === assetId/);
  assert.match(scene, /clearImage\(targets\);/);
  assert.match(scene, /renderer\.render\(scene, camera\);/);
  assert.match(scene, /clearImageAssetById,/);
});

test('clearImage rebuilds fabric overlays after removing a fabric image', () => {
  const clearStart = scene.indexOf('function clearImage(meshOrMeshes)');
  const clearEnd = scene.indexOf("renderer.domElement.addEventListener('contextmenu'", clearStart);
  const clearBlock = scene.slice(clearStart, clearEnd);
  assert.match(clearBlock, /if \(fabricGroupIds\.size\) rebuildFabricOverlays\(\);/);
});

test('library deletion clears the live scene before persisted references', () => {
  const deleteStart = main.indexOf('async function requestDeleteImageAsset(assetId)');
  const deleteEnd = main.indexOf('function setActiveAsset', deleteStart);
  const block = main.slice(deleteStart, deleteEnd);
  const liveIndex = block.indexOf('scene3d.clearImageAssetById(assetId);');
  const stateIndex = block.indexOf('clearImageAssetReferences(currentModules, assetId);');
  assert.ok(liveIndex >= 0);
  assert.ok(stateIndex > liveIndex);
  assert.doesNotMatch(block, /rebuildWall\(\{ resetView: false \}\)/);
});
