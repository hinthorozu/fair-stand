import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const mainSource = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const controllerSource = fs.readFileSync(new URL('../src/colorEditorController.js', import.meta.url), 'utf8');

test('color input parsing and CMYK normalization live below main in the controller layer', () => {
  assert.doesNotMatch(mainSource, /colorEditorInputs\.js/);
  assert.match(controllerSource, /import \{ normalizeCmykValues, readNumberGroup \} from '\.\/colorEditorInputs\.js'/);
  assert.match(controllerSource, /const normalizedCmyk = normalizeCmykValues\(cmyk\)/);
});
