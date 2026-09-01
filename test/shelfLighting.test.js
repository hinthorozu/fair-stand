import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createShelfModuleState } from '../src/designState.js';

test('shelf under-lighting is persisted and off by default', () => {
  const state = createShelfModuleState(100, 2);
  assert.equal(state.type, 'shelf');
  assert.equal(state.shelfLightingOn, false);
});

test('shelf renderer adds lights without changing shelf box geometry', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /const shelfLightingOn = Boolean\(moduleState\.shelfLightingOn\)/);
  assert.match(source, /new THREE\.SpotLight\(/);
  assert.match(source, /shelf-under-led-strip/);
  assert.match(source, /emissive: 0xffe3bd/);
  assert.match(source, /0xfff2dc/);
  assert.match(source, /shelfBottomY - ledStripThicknessM \/ 2 - 0\.001/);
  assert.match(source, /spot\.castShadow = false/);
  assert.match(source, /role = 'shelf-under-light'/);
  assert.doesNotMatch(source, /shelf-under-front-glow/);
  assert.match(source, /new THREE\.BoxGeometry\(innerWidthM, shelfThicknessM, shelfDepthM\)/);
});

test('shelf lighting toggle is available only from shelf context', () => {
  const menu = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(menu, /toggle-shelf-light/);
  assert.match(menu, /Raf altı aydınlatmayı aç/);
  assert.match(menu, /Raf altı aydınlatmayı kapat/);
  assert.match(main, /changeContextShelfLighting/);
  assert.match(main, /shelfLightingOn = Boolean\(enabled\)/);
});
