import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveItemBom } from '../src/itemBom.js';
import { resolveProjectBom } from '../src/projectBom.js';
import { getItem } from '../src/items.js';

test('empty modules → empty project BOM', () => {
  const bom = resolveProjectBom([]);
  assert.deepEqual(bom.modules, []);
  assert.deepEqual(bom.unresolved, []);
  assert.deepEqual(bom.lines, []);
});

test('two same walls aggregate leaf quantities ×2', () => {
  const itemKey = 'wall_100_350';
  assert.ok(getItem(itemKey));
  const single = resolveItemBom(itemKey);
  const bom = resolveProjectBom([
    { id: 'm1', itemKey },
    { id: 'm2', itemKey },
  ]);

  assert.equal(bom.modules.length, 2);
  assert.equal(bom.unresolved.length, 0);
  assert.equal(bom.modules[0].status, 'ok');
  assert.ok(bom.modules[0].lines.length > 0);

  for (const line of single) {
    const total = bom.lines.find((entry) => entry.itemKey === line.itemKey && entry.unit === line.unit);
    assert.ok(total, line.itemKey);
    assert.equal(total.quantity, line.quantity * 2);
  }
});

test('missing itemKey is unresolved', () => {
  const bom = resolveProjectBom([{ id: 'orphan', type: 'flat-panel' }]);
  assert.equal(bom.modules.length, 1);
  assert.equal(bom.modules[0].status, 'unresolved');
  assert.equal(bom.unresolved.length, 1);
  assert.match(bom.unresolved[0].message, /itemKey/);
  assert.deepEqual(bom.lines, []);
});

test('unknown itemKey is unresolved', () => {
  const bom = resolveProjectBom([{ id: 'x', itemKey: 'does_not_exist_item' }]);
  assert.equal(bom.unresolved.length, 1);
  assert.match(bom.unresolved[0].message, /Unknown Item|çözülemedi/i);
});

test('decision-required furniture cluster is unresolved', () => {
  const itemKey = 'furniture_sofa_set_classic';
  if (!getItem(itemKey)) return;
  const bom = resolveProjectBom([{ id: 'sofa', itemKey }]);
  assert.equal(bom.modules[0].status, 'unresolved');
  assert.equal(bom.unresolved.length, 1);
  assert.equal(bom.lines.length, 0);
});
