import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('F-028 feature reset removes illuminated foam and resets remaining modules', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  const start = main.indexOf("resetModuleFeaturesButton.addEventListener('click'");
  const end = main.indexOf('function applyActiveColorToSelection', start);
  assert.ok(start >= 0 && end > start, 'feature reset handler must exist');

  const handler = main.slice(start, end);
  assert.match(handler, /module\?\.type === 'illuminated-foam'/);
  assert.match(handler, /module\?\.type !== 'illuminated-foam'/);
  assert.match(handler, /resetCandidates\.map\(\(module\) => createCatalogModuleState/);
  assert.match(handler, /\{ preservePlacement: true \}/);
  assert.match(handler, /selectedFoamModuleId = null/);
  assert.match(handler, /foamLightControls\) foamLightControls\.hidden = true/);
  assert.match(handler, /Işıklı Strafor sahneden silinecek/);
  assert.match(handler, /Işıklı Strafor sahneden silindi/);
});
