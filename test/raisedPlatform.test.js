import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('aktif stand platformu 5 cm yükseltilir ve wallRoot aynı kota taşınır', () => {
  const scene = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /const ACTIVE_PLATFORM_HEIGHT_M = 0\.05;/);
  assert.match(scene, /new THREE\.BoxGeometry\(1, ACTIVE_PLATFORM_HEIGHT_M, 1\)/);
  assert.match(scene, /activeFloor\.position\.set\(centerX, ACTIVE_PLATFORM_HEIGHT_M \/ 2, centerZ\)/);
  assert.match(scene, /wallRoot\.position\.set\(0, ACTIVE_PLATFORM_HEIGHT_M, 0\)/);
});
