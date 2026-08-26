import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const start = source.indexOf('function createBaseModule(');
const end = source.indexOf('function createCounterModule(', start);
const baseBlock = source.slice(start, end);

test('baza renderer uses banko-style thin top and bottom rails with one panel tier', () => {
  assert.ok(baseBlock.includes('const railHeightM = PANEL_RAIL_HEIGHT_M;'));
  assert.ok(baseBlock.includes('const railYs = [0, frameHeightM];'));
  assert.equal(baseBlock.includes('stripHeightM'), false);
  assert.equal((baseBlock.match(/moduleState\.faces\?\.front/g) ?? []).length, 1);
  assert.equal((baseBlock.match(/moduleState\.faces\?\.left/g) ?? []).length, 1);
  assert.equal((baseBlock.match(/moduleState\.faces\?\.right/g) ?? []).length, 1);
});

test('baza renderer preserves existing width depth and height inputs', () => {
  assert.ok(baseBlock.includes('const widthCm = Number(moduleState.widthCm);'));
  assert.ok(baseBlock.includes('const depthCm = Number(moduleState.depthCm) || 50;'));
  assert.ok(baseBlock.includes('const heightCm = Number(moduleState.heightCm) || 50;'));
});
