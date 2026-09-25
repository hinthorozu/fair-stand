import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assemblyPartKey,
  applyRelativePose,
  captureRelativePose,
  createAssemblyLock,
} from '../src/itemAdminAssemblyLock.js';

test('assemblyPartKey joins child and instance', () => {
  assert.equal(assemblyPartKey('upright_99', 0), 'upright_99#0');
});

test('capture + apply relative pose round-trips', () => {
  const host = {
    xCm: 10,
    yCm: 20,
    zCm: 0,
    rotationXDeg: 0,
    rotationYDeg: 0,
    rotationZDeg: 90,
  };
  const follower = {
    xCm: 15,
    yCm: 20,
    zCm: 5,
    rotationXDeg: 0,
    rotationYDeg: 0,
    rotationZDeg: 90,
  };
  const relative = captureRelativePose(follower, host);
  assert.deepEqual(relative, {
    xCm: 5,
    yCm: 0,
    zCm: 5,
    rotationXDeg: 0,
    rotationYDeg: 0,
    rotationZDeg: 0,
  });
  const movedHost = { ...host, xCm: 100, rotationZDeg: 180 };
  const next = applyRelativePose(movedHost, relative);
  assert.equal(next.xCm, 105);
  assert.equal(next.zCm, 5);
  assert.equal(next.rotationZDeg, 180);
});

test('createAssemblyLock rejects same part', () => {
  const part = { childItemKey: 'a', instanceIndex: 0 };
  const pose = {
    xCm: 0, yCm: 0, zCm: 0, rotationXDeg: 0, rotationYDeg: 0, rotationZDeg: 0,
  };
  assert.equal(createAssemblyLock(part, part, pose, pose), null);
});

test('createAssemblyLock stores host follower and relative', () => {
  const lock = createAssemblyLock(
    { childItemKey: 'upright_99', instanceIndex: 0 },
    { childItemKey: 'profile_41_5', instanceIndex: 0 },
    { xCm: 5, yCm: 0, zCm: 0, rotationXDeg: 0, rotationYDeg: 0, rotationZDeg: 0 },
    { xCm: 0, yCm: 0, zCm: 0, rotationXDeg: 0, rotationYDeg: 0, rotationZDeg: 0 },
  );
  assert.equal(lock.host.childItemKey, 'profile_41_5');
  assert.equal(lock.follower.childItemKey, 'upright_99');
  assert.equal(lock.relative.xCm, 5);
});
