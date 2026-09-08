import test from 'node:test';
import assert from 'node:assert/strict';

import { getConnectorItemKey, resolveConnectorBom } from '../src/productionParts.js';

test('all four connector types resolve to canonical Item keys', () => {
  assert.equal(getConnectorItemKey('start'), 'connector_start');
  assert.equal(getConnectorItemKey('single'), 'connector_single');
  assert.equal(getConnectorItemKey('double'), 'connector_double');
  assert.equal(getConnectorItemKey('corner'), 'connector_corner');
  assert.equal(getConnectorItemKey('unknown'), null);
});

test('connector BOM resolver resolves explicit double and corner Items with quantity and unit', () => {
  const bom = resolveConnectorBom([
    { connectorType: 'double', quantity: 3 },
    { connectorType: 'corner', quantity: 2 },
    { itemKey: 'connector_double', quantity: 4 },
  ]);

  assert.deepEqual(bom.map(({ itemKey, quantity, unit }) => ({ itemKey, quantity, unit })), [
    { itemKey: 'connector_double', quantity: 7, unit: 'adet' },
    { itemKey: 'connector_corner', quantity: 2, unit: 'adet' },
  ]);
  assert.equal(bom[0].item.name, 'Çiftli Aparat');
  assert.equal(bom[1].item.name, 'Köşe Aparatı');
});

test('connector BOM never guesses missing or invalid quantities', () => {
  assert.throws(() => resolveConnectorBom([{ connectorType: 'corner' }]), /quantity is required/i);
  assert.throws(() => resolveConnectorBom([{ connectorType: 'double', quantity: 0 }]), /quantity is required/i);
  assert.throws(() => resolveConnectorBom([{ connectorType: 'unknown', quantity: 1 }]), /unknown connector item/i);
});
