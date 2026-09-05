import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getModuleBehavior } from '../src/moduleBehavior.js';

test('illuminated foam keeps fixed physical offsets and SVG loader', () => {
  const design = readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const behavior = getModuleBehavior('illuminated-foam');

  assert.match(design, /type: 'illuminated-foam'/);
  assert.match(design, /depthCm: 3\.5/);
  assert.match(design, /wallGapCm: 1\.5/);
  assert.equal(behavior.placement, 'wall-overlay');
  assert.equal(behavior.moveSnapCm, 10);
  assert.equal(behavior.collision, 'none');
  assert.match(scene, /SVGLoader/);
  assert.match(scene, /fillOpacity < 0\.5/);
  assert.match(main, /Işıklı Strafora Dönüştür/);
  assert.match(main, /previewCatalogModuleDrag/);
});
