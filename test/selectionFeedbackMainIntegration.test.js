import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('main delegates scene selection descriptions to selectionFeedback', () => {
  assert.match(
    source,
    /import \{ DEFAULT_SELECTION_HINT, describeFloorSelection, describeSurfaceSelection \} from '\.\/selectionFeedback\.js'/,
  );
  assert.match(source, /const feedback = describeSurfaceSelection\(surfaces, currentModules\);/);
  assert.match(source, /const message = describeFloorSelection\(floorSelection\);/);
  assert.doesNotMatch(source, /const DEFAULT_SELECTION_HINT =/);
  assert.doesNotMatch(source, /if \(moduleType === 'counter'\)/);
  assert.doesNotMatch(source, /selectedFabricGroupIds = new Set/);
});
