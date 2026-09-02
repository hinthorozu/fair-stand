import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const showcaseStart = scene.indexOf('function createShowcaseModule(');
const showcaseEnd = scene.indexOf('function createSelectionFrame', showcaseStart);
const showcase = scene.slice(showcaseStart, showcaseEnd);

test('showcase is 30 cm deep and projects behind the panel plane', () => {
  assert.match(showcase, /const showcaseDepth = 0\.30;/);
  assert.match(showcase, /const caseFrontZ = depth \/ 2;/);
  assert.match(showcase, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);
});

test('showcase back, frame and top-bottom caps are white', () => {
  assert.match(showcase, /const showcaseWhiteMaterial = new THREE\.MeshStandardMaterial\(\{/);
  assert.match(showcase, /color: 0xffffff/);
  assert.match(showcase, /const backPanel = new THREE\.Mesh\([\s\S]*?showcaseWhiteMaterial\.clone\(\)/);
  assert.match(showcase, /const capGeometry = new THREE\.BoxGeometry\([\s\S]*?showcaseDepth/);
  assert.match(showcase, /for \(const y of \[openingBottom, openingTop\]\)/);
  assert.match(showcase, /frontPostGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)/);
  assert.match(showcase, /frontEdgeGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)/);
  assert.match(showcase, /shelfFrontGeometry\.clone\(\), showcaseWhiteMaterial\.clone\(\)/);
});
