import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('active fabric releases hidden panel GPU textures and drawing', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function suspendFabricSurface\(surface, fabricType = 'lightbox'\)/);
  assert.match(scene, /surface\.material\.map\?\.dispose\?\.\(\)/);
  assert.match(scene, /surface\.material\.colorWrite = false/);
  assert.match(scene, /backing\.visible = fabricType !== 'mesh'/);
  assert.match(scene, /meshes\.forEach\(\(mesh\) => suspendFabricSurface\(mesh, resolvedFabricType\)\)/);
});

test('removing fabric restores panel rendering and stored images', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function restoreFabricSurface\(surface\)/);
  assert.match(scene, /surface\.material\.colorWrite = true/);
  assert.match(scene, /restoredSurfaces\.forEach\(restoreFabricSurface\)/);
  assert.match(scene, /if \(state\?\.imageAssetId\) \{\s*applyStoredImage\(surface\)/s);
});

test('fabric state prevents hidden panel textures from reloading asynchronously', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /if \(mesh\.userData\.surfaceState\?\.fabricGroupId\) return/);
  assert.match(scene, /surfaceState\?\.fabricGroupId \|\| surfaceState\?\.imageAssetId !== assetId/);
  assert.match(scene, /surfaceState\?\.fabricGroupId\s*\|\| surfaceState\?\.imageAssetId !== assetId/s);
});
