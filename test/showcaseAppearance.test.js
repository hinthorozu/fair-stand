import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { getShowcaseBodyDefinition } from '../src/items.js';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const showcaseStart = scene.indexOf('function createShowcaseModule(');
const showcaseEnd = scene.indexOf('function createSelectionFrame', showcaseStart);
const showcase = scene.slice(showcaseStart, showcaseEnd);

test('showcase canonical body is 30 cm deep and projects behind the panel plane', () => {
  for (const itemKey of ['wall_showcase_100_2', 'wall_showcase_100_3']) {
    const body = getShowcaseBodyDefinition(itemKey);
    assert.equal(body.sideItem.dimensions.depthCm, 30, itemKey);
    assert.equal(body.horizontalItem.dimensions.depthCm, 30, itemKey);
  }

  assert.match(showcase, /const showcaseDepth = Number\(sideDimensions\.depthCm\) \/ 100;/);
  assert.match(showcase, /const caseFrontZ = depth \/ 2;/);
  assert.match(showcase, /const caseCenterZ = caseFrontZ - showcaseDepth \/ 2;/);
});

test('showcase body defaults white but accepts one grouped body color override while rear stays open', () => {
  for (const itemKey of ['wall_showcase_100_2', 'wall_showcase_100_3']) {
    assert.equal(getShowcaseBodyDefinition(itemKey).defaultColor, 0xffffff, itemKey);
  }

  assert.match(showcase, /const canonicalBodyColor = `#\$\{bodyDefinition\.defaultColor\.toString\(16\)\.padStart\(6, '0'\)\}`;/);
  assert.match(showcase, /const bodyColor = moduleState\.bodySurface\.color \|\| canonicalBodyColor;/);
  assert.match(showcase, /const showcaseBodyMaterial = new THREE\.MeshStandardMaterial\(\{ color: bodyColor,/);
  assert.match(showcase, /const showcaseDetailMaterial = new THREE\.MeshStandardMaterial\(\{ color: 0xffffff,/);
  assert.doesNotMatch(showcase, /const backPanel = new THREE\.Mesh/);
  assert.match(showcase, /const capGeometry = new THREE\.BoxGeometry\(bodyInnerWidth, horizontalThickness, showcaseDepth\);/);
  assert.match(showcase, /frontPostGeometry\.clone\(\), showcaseDetailMaterial\.clone\(\)/);
  assert.match(showcase, /frontEdgeGeometry\.clone\(\), showcaseDetailMaterial\.clone\(\)/);
  assert.match(showcase, /shelfFrontGeometry\.clone\(\), showcaseDetailMaterial\.clone\(\)/);
});
