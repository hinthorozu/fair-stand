import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const showcaseStart = scene.indexOf('function createShowcaseModule(');
const showcaseEnd = scene.indexOf('function createSelectionFrame', showcaseStart);
const showcase = scene.slice(showcaseStart, showcaseEnd);

test('showcase body uses canonical board dimensions and grouped project color override', () => {
  assert.match(showcase, /const bodyDefinition = getShowcaseBodyDefinition\(moduleState\.itemKey\);/);
  assert.match(showcase, /const bodyHeight = Number\(sideDimensions\.lengthCm\) \/ 100;/);
  assert.match(showcase, /const bodyInnerWidth = Number\(horizontalDimensions\.lengthCm\) \/ 100;/);
  assert.match(showcase, /const bodyThickness = Number\(sideDimensions\.thicknessCm\) \/ 100;/);
  assert.match(showcase, /color: bodyColor,/);
  assert.match(showcase, /colorTargets: bodyColorTargets/);
});

test('showcase grouped body color targets only the two side and two horizontal canonical boards', () => {
  assert.match(showcase, /bodyColorTargets\.push\(sidePanel\)/);
  assert.match(showcase, /bodyColorTargets\.push\(cap\)/);
  assert.match(showcase, /sidePanel\.userData\.itemKey = bodyDefinition\.sideItem\.itemKey/);
  assert.match(showcase, /cap\.userData\.itemKey = bodyDefinition\.horizontalItem\.itemKey/);
  assert.match(showcase, /acceptsImage: false/);
  assert.match(showcase, /surfaceRole: 'showcase-body'/);
});

test('unverified thin front showcase details stay renderer-only and out of grouped board targets', () => {
  assert.match(showcase, /const showcaseDetailMaterial = new THREE\.MeshStandardMaterial/);
  assert.match(showcase, /const frontPostGeometry/);
  assert.match(showcase, /const frontEdgeGeometry/);
  assert.match(showcase, /const shelfFrontGeometry/);
  assert.doesNotMatch(showcase, /bodyColorTargets\.push\(post\)/);
  assert.doesNotMatch(showcase, /bodyColorTargets\.push\(edge\)/);
  assert.doesNotMatch(showcase, /bodyColorTargets\.push\(shelfFront\)/);
});
