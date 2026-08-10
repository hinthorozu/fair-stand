import test from 'node:test';
import assert from 'node:assert/strict';
import { createRectSelection, describeRectSelection } from '../src/rectSelection.js';

function makeGrid(columns = 4, rows = 7) {
  const items = [];
  for (let moduleIndex = 0; moduleIndex < columns; moduleIndex += 1) {
    for (let stripIndex = 0; stripIndex < rows; stripIndex += 1) {
      items.push({ moduleIndex, stripIndex, id: `${moduleIndex}:${stripIndex}` });
    }
  }
  return items;
}

test('selects a complete 3x2 rectangle from two corners', () => {
  const result = createRectSelection(
    makeGrid(),
    { moduleIndex: 0, stripIndex: 1 },
    { moduleIndex: 2, stripIndex: 2 },
  );

  assert.equal(result.ok, true);
  assert.equal(result.columnCount, 3);
  assert.equal(result.rowCount, 2);
  assert.equal(result.panelCount, 6);
  assert.deepEqual(
    result.entries.map((item) => item.id),
    ['0:1', '1:1', '2:1', '0:2', '1:2', '2:2'],
  );
});

test('supports a full vertical 1x7 selection', () => {
  const result = createRectSelection(
    makeGrid(),
    { moduleIndex: 2, stripIndex: 0 },
    { moduleIndex: 2, stripIndex: 6 },
  );

  assert.equal(result.ok, true);
  assert.equal(result.columnCount, 1);
  assert.equal(result.rowCount, 7);
  assert.equal(result.panelCount, 7);
});

test('supports a 10x7 selection', () => {
  const result = createRectSelection(
    makeGrid(10, 7),
    { moduleIndex: 0, stripIndex: 0 },
    { moduleIndex: 9, stripIndex: 6 },
  );

  assert.equal(result.ok, true);
  assert.equal(result.panelCount, 70);
});

test('rejects a rectangle when a cell inside the block is missing', () => {
  const items = makeGrid(3, 3).filter((item) => item.id !== '1:1');
  const result = createRectSelection(
    items,
    { moduleIndex: 0, stripIndex: 0 },
    { moduleIndex: 2, stripIndex: 2 },
  );

  assert.equal(result.ok, false);
});

test('describes rectangle dimensions', () => {
  const items = [
    { moduleIndex: 1, stripIndex: 2 },
    { moduleIndex: 2, stripIndex: 2 },
    { moduleIndex: 1, stripIndex: 3 },
    { moduleIndex: 2, stripIndex: 3 },
  ];

  assert.deepEqual(describeRectSelection(items), {
    columnCount: 2,
    rowCount: 2,
    panelCount: 4,
  });
});
