import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASSEMBLY_CORNERS,
  getCornerDef,
  localCornerOffsetMeters,
  snapMeshCornerToCorner,
} from '../src/itemAdminCornerSnap.js';

test('ASSEMBLY_CORNERS has 8 unique keys', () => {
  assert.equal(ASSEMBLY_CORNERS.length, 8);
  assert.equal(new Set(ASSEMBLY_CORNERS.map((c) => c.key)).size, 8);
});

test('localCornerOffsetMeters uses half extents', () => {
  const offset = localCornerOffsetMeters(
    { widthM: 2, heightM: 4, depthM: 6 },
    getCornerDef('w+h-d+'),
  );
  assert.deepEqual(offset, { x: 1, y: -2, z: 3 });
});

test('snapMeshCornerToCorner aligns source corner to target (identity world)', () => {
  const source = {
    position: { x: 0, y: 1, z: 0 },
    userData: { partSize: { widthM: 0.2, heightM: 2, depthM: 0.2 } },
  };
  const target = {
    position: { x: 1, y: 0.1, z: 0.5 },
    userData: { partSize: { widthM: 1, heightM: 0.2, depthM: 0.05 } },
  };
  // upright bottom (h-) corner w-h-d- → profile top (h+) w-h+d-
  const delta = snapMeshCornerToCorner(source, 'w-h-d-', target, 'w-h+d-');
  assert.ok(delta);
  const srcOff = localCornerOffsetMeters(source.userData.partSize, getCornerDef('w-h-d-'));
  const tgtOff = localCornerOffsetMeters(target.userData.partSize, getCornerDef('w-h+d-'));
  assert.ok(Math.abs(source.position.x + srcOff.x - (target.position.x + tgtOff.x)) < 1e-9);
  assert.ok(Math.abs(source.position.y + srcOff.y - (target.position.y + tgtOff.y)) < 1e-9);
  assert.ok(Math.abs(source.position.z + srcOff.z - (target.position.z + tgtOff.z)) < 1e-9);
});

test('snapMeshCornerToCorner rejects same mesh', () => {
  const mesh = {
    position: { x: 0, y: 0, z: 0 },
    userData: { partSize: { widthM: 1, heightM: 1, depthM: 1 } },
  };
  assert.equal(snapMeshCornerToCorner(mesh, 'w-h-d-', mesh, 'w+h+d+'), null);
});
