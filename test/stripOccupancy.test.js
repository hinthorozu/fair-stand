import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  getStandStripMetrics,
  normalizeStripOccupancy,
  resolveModuleStripOccupancy,
} from '../src/stripOccupancy.js';

test('strip occupancy normalizes catalog short-up contract', () => {
  assert.deepEqual(normalizeStripOccupancy({ align: 'top', stripCount: 2 }), {
    align: 'top',
    stripCount: 2,
  });
  assert.equal(normalizeStripOccupancy({ stripCount: 0 }), null);
  assert.deepEqual(getStandStripMetrics(), {
    stripCount: 7,
    stripHeightM: 0.5,
    stripHeightCm: 50,
    heightCm: 350,
  });
});

test('canonical Item occupancy wins and hanging short-up stays top-aligned', () => {
  assert.deepEqual(
    resolveModuleStripOccupancy({ itemKey: 'wall_200_short_up_2', stripOccupancy: { align: 'bottom', stripCount: 2 } }),
    { align: 'top', stripCount: 2 },
  );
  assert.deepEqual(
    resolveModuleStripOccupancy({ itemKey: 'wall_200_short_up_2', type: 'flat-panel' }),
    { align: 'top', stripCount: 2 },
  );
  assert.equal(resolveModuleStripOccupancy({ itemKey: 'wall_200_350', type: 'flat-panel' }), null);

  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const state = readFileSync(new URL('../src/designState.js', import.meta.url), 'utf8');
  const behavior = readFileSync(new URL('../src/moduleBehavior.js', import.meta.url), 'utf8');
  const sidebar = readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
  for (const source of [scene, state, behavior, sidebar]) {
    assert.doesNotMatch(source, /itemKey === 'wall_200_short_up_2'/);
  }
  assert.doesNotMatch(scene, /resolveOccupiedStripLayout/);
  assert.doesNotMatch(readFileSync(new URL('../src/stripOccupancy.js', import.meta.url), 'utf8'), /getOccupiedStripLayout/);
});
