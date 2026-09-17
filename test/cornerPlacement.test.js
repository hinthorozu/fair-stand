import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('production placement path does not import cornerPlacement', () => {
  const files = [
    'src/main.js',
    'src/moduleMove.js',
    'src/automaticWall.js',
    'src/scene3d.js',
  ];
  for (const relative of files) {
    const source = readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /cornerPlacement/, relative);
  }
});
