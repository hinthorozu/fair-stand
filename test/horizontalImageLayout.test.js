import test from 'node:test';
import assert from 'node:assert/strict';
import { createHorizontalImageLayout } from '../src/horizontalImageLayout.js';

test('creates one continuous horizontal image region across adjacent panels', () => {
  const result = createHorizontalImageLayout([
    { moduleIndex: 2, stripIndex: 3, width: 1.9, height: 0.46 },
    { moduleIndex: 3, stripIndex: 3, width: 0.9, height: 0.46 },
    { moduleIndex: 4, stripIndex: 3, width: 0.9, height: 0.46 },
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.entries.length, 3);
  assert.equal(result.entries[0].regionStart, 0);
  assert.ok(Math.abs(result.entries.at(-1).regionStart + result.entries.at(-1).regionWidth - 1) < 1e-9);
});

test('rejects panels from different horizontal rows', () => {
  const result = createHorizontalImageLayout([
    { moduleIndex: 0, stripIndex: 1, width: 1, height: 0.46 },
    { moduleIndex: 1, stripIndex: 2, width: 1, height: 0.46 },
  ]);

  assert.equal(result.ok, false);
});

test('rejects non-adjacent modules', () => {
  const result = createHorizontalImageLayout([
    { moduleIndex: 0, stripIndex: 1, width: 1, height: 0.46 },
    { moduleIndex: 2, stripIndex: 1, width: 1, height: 0.46 },
  ]);

  assert.equal(result.ok, false);
});
