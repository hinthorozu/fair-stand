import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('main delegates color input parsing and CMYK normalization to extracted helpers', () => {
  assert.match(source, /import \{ normalizeCmykValues, readNumberGroup \} from '\.\/colorEditorInputs\.js'/);
  assert.doesNotMatch(source, /function readNumberGroup\(/);
  assert.match(source, /const normalizedCmyk = normalizeCmykValues\(cmyk\)/);
});
