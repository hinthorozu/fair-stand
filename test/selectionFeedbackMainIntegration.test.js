import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

function getSceneSelectionWiring() {
  const start = source.indexOf('const scene3d = createStandScene(');
  const end = source.indexOf('\n\nfunction renderStageResult', start);
  assert.notEqual(start, -1, 'createStandScene wiring must exist');
  assert.notEqual(end, -1, 'renderStageResult boundary must exist after scene wiring');
  return source.slice(start, end);
}

test('main delegates scene selection descriptions to selectionFeedback', () => {
  assert.match(
    source,
    /import \{ DEFAULT_SELECTION_HINT, describeFloorSelection, describeSurfaceSelection \} from '\.\/selectionFeedback\.js'/,
  );
  assert.doesNotMatch(source, /const DEFAULT_SELECTION_HINT =/);

  const sceneWiring = getSceneSelectionWiring();
  assert.match(sceneWiring, /const feedback = describeSurfaceSelection\(surfaces, currentModules\);/);
  assert.match(sceneWiring, /const message = describeFloorSelection\(floorSelection\);/);
  assert.doesNotMatch(sceneWiring, /if \(moduleType === 'counter'\)/);
  assert.doesNotMatch(sceneWiring, /selectedFabricGroupIds = new Set/);
});
