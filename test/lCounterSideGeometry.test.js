import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const start = source.indexOf('function createLCounterModule');
const end = source.indexOf('function createShelfModule', start);
const block = source.slice(start, end);

test('L counter short side panels close the two outer arm ends', () => {
  assert.match(block, /new THREE\.Vector3\(-0\.5,lowerY,-0\.25\),-Math\.PI\/2,-1/);
  assert.match(block, /new THREE\.Vector3\(0\.25,lowerY,0\.5\),0,1/);
  assert.doesNotMatch(block, /new THREE\.Vector3\(-0\.25,lowerY,0\),0,1/);
  assert.doesNotMatch(block, /new THREE\.Vector3\(0,lowerY,0\.25\),Math\.PI\/2,-1/);
});

test('L counter side posts use the same inset clearance as straight Banko 100', () => {
  assert.match(block, /\[profileM \/ 2, 0\.5 - profileM \/ 2\]/);
  assert.match(block, /\[-0\.5 \+ profileM \/ 2, -profileM \/ 2\]/);
  assert.doesNotMatch(block, /\[0,0\.5\]/);
  assert.doesNotMatch(block, /\[-0\.5,0\]/);
});
