import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const start = scene.indexOf('function createShowcaseModule(');
const end = scene.indexOf('function createSelectionFrame(', start);
const showcase = scene.slice(start, end);

test('showcase depth comes from canonical body board and projects behind the wall panel plane', () => {
  assert.match(showcase, /const showcaseDepth = Number\(sideDimensions\.depthCm\) \/ 100;/);
  assert.match(showcase, /const caseFrontZ = depth \/ 2;/);
  assert.match(showcase, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);
  assert.doesNotMatch(showcase, /const showcaseDepth = 0\.30;/);
});

test('showcase rear remains open while canonical side and horizontal boards form the case', () => {
  assert.doesNotMatch(showcase, /const backPanel = new THREE\.Mesh/);
  assert.match(showcase, /const sidePanelGeometry = new THREE\.BoxGeometry\(bodyThickness, bodyHeight, showcaseDepth\);/);
  assert.match(showcase, /const capGeometry = new THREE\.BoxGeometry\(\s*bodyInnerWidth,\s*horizontalThickness,\s*showcaseDepth,/);
  assert.match(showcase, /const shelf = new THREE\.Mesh\(shelfGeometry\.clone\(\), glassMaterial\.clone\(\)\);/);
});
