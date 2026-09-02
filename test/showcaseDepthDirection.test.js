import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('showcase extra depth projects behind the panel, not in front', () => {
  assert.match(scene, /const caseFrontZ = depth \/ 2;/);
  assert.match(scene, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);
  assert.doesNotMatch(scene, /caseCenterZ = \(showcaseDepth - depth\) \/ 2/);
});

test('showcase styling is isolated to the showcase box, not the parent module frame', () => {
  const start = scene.indexOf('function createShowcaseModule(');
  const end = scene.indexOf('function createSelectionFrame(', start);
  const showcase = scene.slice(start, end);
  assert.match(showcase, /const frameMaterial = new THREE\.MeshStandardMaterial\(\{\s*color: FRAME_COLOR,\s*metalness: 0\.68,\s*roughness: 0\.28,/);
  assert.match(showcase, /color: isGlass \? GLASS_BACK_COLOR : PANEL_BACK_COLOR,/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(0\.018, openingHeight, showcaseDepth\);/);
  assert.match(showcase, /new THREE\.Mesh\(sidePanelGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)\)/);
  assert.match(showcase, /const cap = new THREE\.Mesh\(capGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)\);/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});


test('showcase rear is open while the showcase case remains intact', () => {
  const start = scene.indexOf('function createShowcaseModule(');
  const end = scene.indexOf('function createSelectionFrame(', start);
  const showcase = scene.slice(start, end);
  assert.doesNotMatch(showcase, /const backPanel = new THREE\.Mesh/);
  assert.doesNotMatch(showcase, /group\.add\(backPanel\)/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(0\.018, openingHeight, showcaseDepth\);/);
  assert.match(showcase, /const cap = new THREE\.Mesh\(capGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)\);/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});
