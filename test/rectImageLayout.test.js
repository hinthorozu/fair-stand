import test from 'node:test';
import assert from 'node:assert/strict';
import { createRectImageLayout } from '../src/rectImageLayout.js';

function makeGrid({ columns, rows, widths, height = 0.46 }) {
  const items = [];
  for (const moduleIndex of columns) {
    for (const stripIndex of rows) {
      items.push({
        moduleIndex,
        stripIndex,
        width: widths[moduleIndex],
        height,
      });
    }
  }
  return items;
}

test('creates a 3 x 2 grouped image layout with mixed column widths', () => {
  const result = createRectImageLayout(makeGrid({
    columns: [0, 1, 2],
    rows: [2, 3],
    widths: { 0: 1.0, 1: 0.5, 2: 2.0 },
  }));

  assert.equal(result.ok, true);
  assert.equal(result.columnCount, 3);
  assert.equal(result.rowCount, 2);
  assert.equal(result.panelCount, 6);
  assert.ok(Math.abs(result.totalWidth - 3.5) < 1e-9);
  assert.ok(Math.abs(result.totalHeight - 0.92) < 1e-9);

  const bottomLeft = result.entries.find(
    (entry) => entry.moduleIndex === 0 && entry.stripIndex === 2,
  );
  assert.equal(bottomLeft.regionStartX, 0);
  assert.equal(bottomLeft.regionStartY, 0);
  assert.ok(Math.abs(bottomLeft.regionWidth - (1 / 3.5)) < 1e-9);
  assert.equal(bottomLeft.regionHeight, 0.5);

  const topRight = result.entries.find(
    (entry) => entry.moduleIndex === 2 && entry.stripIndex === 3,
  );
  assert.ok(Math.abs(topRight.regionStartX - (1.5 / 3.5)) < 1e-9);
  assert.equal(topRight.regionStartY, 0.5);
  assert.ok(Math.abs(topRight.regionWidth - (2 / 3.5)) < 1e-9);
  assert.equal(topRight.regionHeight, 0.5);
});

test('supports a single vertical column spanning all seven rows', () => {
  const result = createRectImageLayout(makeGrid({
    columns: [4],
    rows: [0, 1, 2, 3, 4, 5, 6],
    widths: { 4: 1.5 },
  }));

  assert.equal(result.ok, true);
  assert.equal(result.columnCount, 1);
  assert.equal(result.rowCount, 7);
  assert.equal(result.panelCount, 7);
});

test('rejects an L-shaped or incomplete selection', () => {
  const result = createRectImageLayout([
    { moduleIndex: 0, stripIndex: 0, width: 1, height: 0.46 },
    { moduleIndex: 1, stripIndex: 0, width: 1, height: 0.46 },
    { moduleIndex: 0, stripIndex: 1, width: 1, height: 0.46 },
  ]);

  assert.equal(result.ok, false);
});

test('rejects gaps between selected columns', () => {
  const result = createRectImageLayout([
    { moduleIndex: 0, stripIndex: 0, width: 1, height: 0.46 },
    { moduleIndex: 2, stripIndex: 0, width: 1, height: 0.46 },
  ]);

  assert.equal(result.ok, false);
});
