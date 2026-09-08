import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getConnectorItemKey, resolveConnectorBom } from '../src/productionParts.js';

test('all four connector types resolve to canonical Item keys', () => {
  assert.equal(getConnectorItemKey('start'), 'connector_start');
  assert.equal(getConnectorItemKey('single'), 'connector_single');
  assert.equal(getConnectorItemKey('double'), 'connector_double');
  assert.equal(getConnectorItemKey('corner'), 'connector_corner');
  assert.equal(getConnectorItemKey('unknown'), null);
});

test('connector BOM resolver capability resolves double and corner Items when explicitly called', () => {
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


function listJavaScriptFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listJavaScriptFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
  });
}

test('double and corner connector resolver has no active src runtime consumer yet', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const srcDir = path.resolve(here, '../src');
  const productionPartsPath = path.join(srcDir, 'productionParts.js');

  const consumers = listJavaScriptFiles(srcDir)
    .filter((filePath) => filePath !== productionPartsPath)
    .filter((filePath) => fs.readFileSync(filePath, 'utf8').includes('resolveConnectorBom'))
    .map((filePath) => path.relative(srcDir, filePath));

  assert.deepEqual(consumers, []);
});

test('double and corner completion status stays pending while runtime consumer is absent', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const itemList = fs.readFileSync(path.resolve(here, '../docs/items/ITEM_LIST.md'), 'utf8');
  const doubleDefinition = fs.readFileSync(path.resolve(here, '../docs/items/definitions/connector_double.md'), 'utf8');
  const cornerDefinition = fs.readFileSync(path.resolve(here, '../docs/items/definitions/connector_corner.md'), 'utf8');

  assert.match(itemList, /`connector_double`[^\n]*Bekliyor[^\n]*aktif runtime BOM consumer yok/);
  assert.match(itemList, /`connector_corner`[^\n]*Bekliyor[^\n]*aktif runtime BOM consumer yok/);
  assert.match(doubleDefinition, /active runtime BOM consumer = yok/);
  assert.match(cornerDefinition, /active runtime BOM consumer = yok/);
});
