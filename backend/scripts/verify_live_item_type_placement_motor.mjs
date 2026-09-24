/**
 * Canlı DB'den dump edilen itemTypes ile motor — kesit1+2+3 tam set, gevşetme yok.
 */
import { readFileSync } from 'node:fs';
import { initializeItemTypeRegistry, resetItemRegistry } from '../../src/items.js';
import {
  getModuleBehavior,
  getModuleMoveSnapCm,
  usesLogicalFixtureEndpoint,
  usesWallBackboneCollisionDepth,
} from '../../src/moduleBehavior.js';
import {
  ITEM_TYPE_BEHAVIOR_SLICE1,
  ITEM_TYPE_BEHAVIOR_SLICE2,
  ITEM_TYPE_BEHAVIOR_SLICE3,
  assertSlice3Equal,
  behaviorSlice1ForType,
  behaviorSlice2ForType,
  behaviorSlice3ForType,
} from '../../test/itemTypeBehaviorSeed.mjs';

const rows = JSON.parse(
  readFileSync(new URL('./_live_item_types.json', import.meta.url), 'utf8'),
);
resetItemRegistry();
initializeItemTypeRegistry(rows);

const byKey = Object.fromEntries(rows.map((row) => [row.key, row]));
const missing = Object.keys(ITEM_TYPE_BEHAVIOR_SLICE1).filter((key) => !byKey[key]);
if (missing.length) {
  console.error('FAIL motor bootstrap missing types', missing);
  process.exit(1);
}

for (const key of Object.keys(ITEM_TYPE_BEHAVIOR_SLICE1)) {
  const s1 = behaviorSlice1ForType(key);
  const s2 = behaviorSlice2ForType(key);
  const s3 = behaviorSlice3ForType(key);
  const behavior = getModuleBehavior(key);
  if (
    behavior.placement !== s1.placement
    || behavior.collision !== s1.collision
    || behavior.moveSnapCm !== s1.moveSnapCm
    || behavior.magneticSnap !== s2.magneticSnap
    || behavior.allowSideInsert !== s2.allowSideInsert
    || behavior.supportsWallOverlayMount !== s2.supportsWallOverlayMount
    || behavior.wallCapacity !== s2.wallCapacity
  ) {
    console.error('FAIL motor s1/s2', key, { got: behavior, s1, s2 });
    process.exit(1);
  }
  try {
    assertSlice3Equal(behavior, s3, key);
  } catch (err) {
    console.error('FAIL motor s3', key, err.actual, err.expected);
    process.exit(1);
  }
  if (getModuleMoveSnapCm(key) !== s1.moveSnapCm) {
    console.error('FAIL moveSnapCm getter', key);
    process.exit(1);
  }
}

const wall = getModuleBehavior({ itemKey: 'wall_200_350', type: 'flat-panel' });
if (wall.placement !== 'wall' || wall.magneticSnap !== 'standard' || wall.moveSnapCm !== 50) {
  console.error('FAIL wall_200 via flat-panel type', wall);
  process.exit(1);
}
if (!usesLogicalFixtureEndpoint('counter') || !usesWallBackboneCollisionDepth('base-wall')) {
  console.error('FAIL slice3 getters');
  process.exit(1);
}

console.log(
  'OK motor from live DB itemTypes',
  Object.keys(ITEM_TYPE_BEHAVIOR_SLICE1).length,
  '+',
  Object.keys(ITEM_TYPE_BEHAVIOR_SLICE2).length,
  '+',
  Object.keys(ITEM_TYPE_BEHAVIOR_SLICE3).length,
);
