import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const start = scene.indexOf('function createShowcaseModule(');
const end = scene.indexOf('function createSelectionFrame(', start);
const showcase = scene.slice(start, end);

test('showcase canonical depth projects behind the panel, not in front', () => {
  assert.match(showcase, /const showcaseDepth = Number\(sideDimensions\.depthCm\) \/ 100;/);
  assert.match(showcase, /const caseFrontZ = depth \/ 2;/);
  assert.match(showcase, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);
  assert.doesNotMatch(showcase, /caseCenterZ = \(showcaseDepth - depth\) \/ 2/);
});

test('showcase styling is isolated to canonical body boards, not the parent module frame', () => {
  assert.match(showcase, /const frameMaterial = new THREE\.MeshStandardMaterial\(\{ color: FRAME_COLOR, metalness: 0\.68, roughness: 0\.28 \}\);/);
  assert.match(showcase, /color: isGlass \? PANEL_GLASS_BACKING_APPEARANCE\.color : PANEL_BACK_COLOR,/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(bodyThickness, bodyHeight, showcaseDepth\);/);
  assert.match(showcase, /new THREE\.Mesh\(sidePanelGeometry\.clone\(\), showcaseBodyMaterial\.clone\(\)\)/);
  assert.match(showcase, /const cap = new THREE\.Mesh\(capGeometry\.clone\(\), showcaseBodyMaterial\.clone\(\)\);/);
  assert.match(showcase, /const showcaseDetailMaterial = new THREE\.MeshStandardMaterial\(\{ color: 0xffffff,/);
  assert.match(showcase, /const glassMaterial = new THREE\.MeshStandardMaterial\(\{ \.\.\.glassAppearance, side: THREE\.DoubleSide \}\);/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});

test('showcase rear stays open while the canonical four-board body remains intact', () => {
  assert.doesNotMatch(showcase, /const backPanel = new THREE\.Mesh/);
  assert.doesNotMatch(showcase, /group\.add\(backPanel\)/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(bodyThickness, bodyHeight, showcaseDepth\);/);
  assert.match(showcase, /const capGeometry = new THREE\.BoxGeometry\(bodyInnerWidth, horizontalThickness, showcaseDepth\);/);
  assert.match(showcase, /bodyColorTargets\.push\(sidePanel\)/);
  assert.match(showcase, /bodyColorTargets\.push\(cap\)/);
  assert.match(showcase, /colorTargets: bodyColorTargets,/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});
