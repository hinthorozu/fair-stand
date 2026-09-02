import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('illuminated foam keeps fixed physical offsets and SVG loader', () => {
  const design = readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');
  const behavior = readFileSync(new URL('../src/moduleBehavior.js', import.meta.url), 'utf8');
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(design, /type: 'illuminated-foam'/);
  assert.match(design, /depthCm: 3\.5/);
  assert.match(design, /wallGapCm: 1\.5/);
  assert.match(behavior, /'illuminated-foam': Object\.freeze/);
  assert.match(behavior, /placement: 'wall-overlay'/);
  assert.match(behavior, /moveSnapCm: 10/);
  assert.match(scene, /SVGLoader/);
  assert.match(scene, /fillOpacity < 0\.5/);
  assert.match(main, /Işıklı Strafora Dönüştür/);
  assert.match(main, /previewCatalogModuleDrag/);
});
