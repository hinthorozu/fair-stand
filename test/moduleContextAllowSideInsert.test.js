import test from 'node:test';
import assert from 'node:assert/strict';
import { allowsModuleSideInsert } from '../src/moduleContextMenu.js';

test('overlay modüllerde yan ekleme kapalıdır', () => {
  assert.equal(allowsModuleSideInsert({ type: 'tv' }), false);
  assert.equal(allowsModuleSideInsert({ moduleType: 'tv' }), false);
  assert.equal(allowsModuleSideInsert({ type: 'illuminated-foam' }), false);
});

test('duvar ve serbest modüllerde yan ekleme açıktır', () => {
  assert.equal(allowsModuleSideInsert({ type: 'flat-panel' }), true);
  assert.equal(allowsModuleSideInsert({ type: 'mini-fridge' }), true);
});
