import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('main delegates selection and status feedback observers to uiFeedback helpers', () => {
  assert.match(source, /import \{ observeSelectionFeedback, observeStatusTones \} from '\.\/uiFeedback\.js'/);
  assert.match(source, /observeSelectionFeedback\(\{[\s\S]*element: selectionInfo,[\s\S]*defaultHint: DEFAULT_SELECTION_HINT,[\s\S]*\}\)/);
  assert.match(source, /observeStatusTones\(\{ elements: \[stageResult, projectStatus, assetStatus\] \}\)/);
  assert.doesNotMatch(source, /function syncSelectionFeedback\(/);
  assert.doesNotMatch(source, /function inferStatusTone\(/);
  assert.doesNotMatch(source, /function syncStatusTone\(/);
});
