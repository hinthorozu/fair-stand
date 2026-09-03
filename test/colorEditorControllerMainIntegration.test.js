import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('main delegates color editor synchronization to the controller', () => {
  assert.match(source, /import \{ createColorEditorController \} from '\.\/colorEditorController\.js'/);
  assert.match(source, /createColorEditorController\(\{[\s\S]*onApply: \(\) => applyActiveColorToSelection\(\)/);
  assert.match(source, /syncFromHex: syncColorEditorFromHex/);
  assert.doesNotMatch(source, /function syncColorEditorFromHex\(/);
  assert.doesNotMatch(source, /function syncFromRgbInputs\(/);
  assert.doesNotMatch(source, /function syncFromCmykInputs\(/);
});
