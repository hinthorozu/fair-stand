import assert from 'node:assert/strict';
import test from 'node:test';

import { bridgeBomUnitToCostUnit } from '../src/costUnits.js';
import { buildCostSnapshot } from '../src/costSnapshot.js';
import { buildQuotePackage, formatCostTotal, standRenderUrl } from '../src/quotePackage.js';

test('adet and m2 bridge to CRM catalog units', () => {
  assert.equal(bridgeBomUnitToCostUnit('adet'), 'Adet');
  assert.equal(bridgeBomUnitToCostUnit('m2'), 'm²');
  assert.equal(bridgeBomUnitToCostUnit('kg'), 'Kg');
  assert.equal(bridgeBomUnitToCostUnit('metre'), 'Metre');
  assert.equal(bridgeBomUnitToCostUnit('gün'), 'Gün');
  assert.equal(bridgeBomUnitToCostUnit('saat'), 'Saat');
  assert.equal(bridgeBomUnitToCostUnit('litre'), null);
});

test('priced BOM line uses catalog price and leaves the recipe line unchanged', () => {
  const bomLine = { itemKey: 'panel_197', name: 'Panel', quantity: 2, unit: 'adet' };
  const snapshot = buildCostSnapshot({
    bomLines: [bomLine],
    costProducts: [{
      id: 'p1',
      item_key: 'panel_197',
      name: 'Panel',
      unit: 'Adet',
      unit_price: '10.5000',
      currency: 'TL',
    }],
    projectId: 'proj-1',
    projectVersion: 3,
    pricedAt: '2026-09-27T00:00:00.000Z',
  });

  assert.equal(bomLine.quantity, 2);
  assert.equal(snapshot.lines[0].status, 'priced');
  assert.equal(snapshot.lines[0].lineTotal, '21.0000');
  assert.equal(snapshot.lines[0].currency, 'TL');
  assert.deepEqual(snapshot.total, { currency: 'TL', amount: '21.0000' });
  assert.equal(snapshot.mixedCurrency, false);
  assert.equal(snapshot.pricedAt, '2026-09-27T00:00:00.000Z');
  assert.equal(snapshot.projectVersion, 3);
});

test('missing catalog match and missing price are not summed as zero', () => {
  const snapshot = buildCostSnapshot({
    bomLines: [
      { itemKey: 'panel_197', name: 'Panel', quantity: 2, unit: 'adet' },
      { itemKey: 'upright_99', name: 'Dikme', quantity: 4, unit: 'adet' },
    ],
    costProducts: [{
      id: 'p1',
      itemKey: 'panel_197',
      name: 'Panel',
      unit: 'Adet',
      unitPrice: null,
      currency: 'TL',
    }],
    pricedAt: '2026-09-27T00:00:00.000Z',
  });

  assert.equal(snapshot.lines[0].status, 'unpriced');
  assert.equal(snapshot.lines[0].lineTotal, null);
  assert.equal(snapshot.lines[1].status, 'unmapped');
  assert.equal(snapshot.lines[1].lineTotal, null);
  assert.equal(snapshot.total, null);
  assert.deepEqual(snapshot.totalsByCurrency, {});
});

test('unit mismatch and ambiguous itemKey stay out of the total', () => {
  const snapshot = buildCostSnapshot({
    bomLines: [
      { itemKey: 'floor_carpet', quantity: 12.5, unit: 'm2' },
      { itemKey: 'panel_197', quantity: 1, unit: 'adet' },
    ],
    costProducts: [
      { id: 'carpet', itemKey: 'floor_carpet', name: 'Halı', unit: 'Metre', unitPrice: '5', currency: 'TL' },
      { id: 'a', itemKey: 'panel_197', name: 'A', unit: 'Adet', unitPrice: '1', currency: 'TL' },
      { id: 'b', itemKey: 'panel_197', name: 'B', unit: 'Adet', unitPrice: '9', currency: 'TL' },
    ],
    pricedAt: '2026-09-27T00:00:00.000Z',
  });

  assert.equal(snapshot.lines[0].status, 'unit_mismatch');
  assert.equal(snapshot.lines[1].status, 'ambiguous');
  assert.equal(snapshot.total, null);
});

test('selected fixed lines use catalog price and an explicit quantity', () => {
  const snapshot = buildCostSnapshot({
    bomLines: [],
    costProducts: [
      { id: 'ship', name: 'Nakliye', unit: 'Adet', unitPrice: '100', currency: 'TL' },
      { id: 'labor', itemKey: null, name: 'İşçilik', unit: 'Saat', unitPrice: '50', currency: 'TL' },
    ],
    selectedFixedLines: [
      { productId: 'ship', quantity: '1' },
      { productId: 'labor', quantity: '' },
    ],
    pricedAt: '2026-09-27T00:00:00.000Z',
  });

  assert.equal(snapshot.lines[0].source, 'fixed');
  assert.equal(snapshot.lines[0].status, 'priced');
  assert.equal(snapshot.lines[0].lineTotal, '100.0000');
  assert.equal(snapshot.lines[1].status, 'quantity_required');
  assert.equal(snapshot.lines[1].lineTotal, null);
  assert.deepEqual(snapshot.total, { currency: 'TL', amount: '100.0000' });
});

test('mixed currency is not collapsed into one total', () => {
  const snapshot = buildCostSnapshot({
    bomLines: [{ itemKey: 'panel_197', quantity: 1, unit: 'adet' }],
    costProducts: [
      { id: 'p', itemKey: 'panel_197', name: 'Panel', unit: 'Adet', unitPrice: '10', currency: 'TL' },
      { id: 'ship', name: 'Nakliye', unit: 'Adet', unitPrice: '20', currency: 'USD' },
    ],
    selectedFixedLines: [{ productId: 'ship', quantity: 1 }],
    pricedAt: '2026-09-27T00:00:00.000Z',
  });

  assert.equal(snapshot.mixedCurrency, true);
  assert.equal(snapshot.total, null);
  assert.equal(snapshot.totalsByCurrency.TL, '10.0000');
  assert.equal(snapshot.totalsByCurrency.USD, '20.0000');
});

test('explicit zero catalog price is a price, not an unpriced line', () => {
  const snapshot = buildCostSnapshot({
    bomLines: [{ itemKey: 'panel_197', quantity: 2, unit: 'adet' }],
    costProducts: [{
      id: 'p',
      itemKey: 'panel_197',
      name: 'Panel',
      unit: 'Adet',
      unitPrice: '0',
      currency: 'TL',
    }],
    pricedAt: '2026-09-27T00:00:00.000Z',
  });
  assert.equal(snapshot.lines[0].status, 'priced');
  assert.equal(snapshot.lines[0].lineTotal, '0.0000');
  assert.equal(formatCostTotal(snapshot), '0.0000 TL');
});

test('quote package carries project id and render path without a foreign key', () => {
  const snapshot = buildCostSnapshot({
    bomLines: [],
    pricedAt: '2026-09-27T00:00:00.000Z',
    projectId: '11111111-1111-1111-1111-111111111111',
  });
  const assetId = '22222222-2222-2222-2222-222222222222';
  const pack = buildQuotePackage({
    snapshot,
    projectId: snapshot.projectId,
    standRenderAssetId: assetId,
  });
  assert.equal(pack.standProjectId, snapshot.projectId);
  assert.equal(pack.costSnapshot, snapshot);
  assert.equal(pack.standRenderUrl, standRenderUrl(snapshot.projectId, assetId));
  assert.equal(pack.standRenderUrl, `/api/v1/fair-stand/projects/${snapshot.projectId}/assets/${assetId}`);
});
