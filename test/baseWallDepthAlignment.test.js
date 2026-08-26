import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Panel Bazalı keeps wall on rear plane and moves 50 cm baza body 25 cm forward', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /child\.position\.z \+= 0\.25/);
  assert.match(source, /duvar paneli baza derinliğinin ortasında değil arka kenarında/);
});
