import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  getOccupiedStripLayout,
  getStandStripMetrics,
  getStripOccupancyHeightRangeCm,
  normalizeStripOccupancy,
  resolveModuleStripOccupancy,
} from '../src/stripOccupancy.js';

test('strip occupancy is the shared hanging-panel contract', () => {
  assert.deepEqual(normalizeStripOccupancy({ align: 'top', stripCount: 2 }), {
    align: 'top',
    stripCount: 2,
  });
  assert.equal(normalizeStripOccupancy({ stripCount: 0 }), null);
  assert.deepEqual(getStripOccupancyHeightRangeCm({ align: 'top', stripCount: 2 }), {
    minCm: 250,
    maxCm: 350,
  });
  assert.deepEqual(getStripOccupancyHeightRangeCm({ align: 'bottom', stripCount: 2 }), {
    minCm: 0,
    maxCm: 100,
  });

  const stand = getStandStripMetrics();
  const layout = getOccupiedStripLayout({ align: 'top', stripCount: 2 }, {
    stripCount: stand.stripCount,
    stripHeight: stand.stripHeightM,
  });
  assert.equal(layout.visibleCount, 2);
  assert.equal(layout.skipCount, 5);
  assert.equal(layout.frameBottomY, 2.5);
  assert.equal(layout.frameHeight, 1);
  assert.equal(getOccupiedStripLayout(null), null);
});

test('canonical Item occupancy wins and legacy shot_2 keys still hang from the top', () => {
  assert.deepEqual(
    resolveModuleStripOccupancy({ itemKey: 'wall_200_short_up_2', stripOccupancy: { align: 'bottom', stripCount: 2 } }),
    { align: 'top', stripCount: 2 },
  );
  assert.deepEqual(
    resolveModuleStripOccupancy({ itemKey: 'wall_200_shot_2', type: 'flat-panel' }),
    { align: 'top', stripCount: 2 },
  );
  assert.deepEqual(
    resolveModuleStripOccupancy({ itemKey: 'wall_200_short_up_2', type: 'flat-panel' }),
    { align: 'top', stripCount: 2 },
  );
  assert.equal(resolveModuleStripOccupancy({ itemKey: 'wall_200', type: 'flat-panel' }), null);

  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const state = readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');
  const behavior = readFileSync(new URL('../src/moduleBehavior.js', import.meta.url), 'utf8');
  const sidebar = readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
  for (const source of [scene, state, behavior, sidebar]) {
    assert.doesNotMatch(source, /itemKey === 'wall_200_short_up_2'/);
  }
});
