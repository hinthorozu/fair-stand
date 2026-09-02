import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('showcase extra depth projects behind the panel, not in front', () => {
  assert.match(scene, /const caseFrontZ = depth \/ 2;/);
  assert.match(scene, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);
  assert.match(scene, /backPanel\.position\.set\(0, openingCenterY, caseFrontZ - showcaseDepth \+ 0\.009\);/);
  assert.doesNotMatch(scene, /caseCenterZ = \(showcaseDepth - depth\) \/ 2/);
});


test('showcase case is white and only horizontal shelves use glass material', () => {
  const start = scene.indexOf('function createShowcaseModule(');
  const end = scene.indexOf('function createSelectionFrame(', start);
  const showcase = scene.slice(start, end);
  assert.match(showcase, /const frameMaterial = new THREE\.MeshStandardMaterial\(\{\s*color: 0xffffff,/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(0\.018, openingHeight, showcaseDepth\);/);
  assert.match(showcase, /new THREE\.Mesh\(sidePanelGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)\)/);
  assert.doesNotMatch(showcase, /sideGlassMaterial|sideGlassGeometry/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});
