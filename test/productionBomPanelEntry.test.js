import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { resolveItemBom } from '../src/itemBom.js';
import { createModulePlacement } from '../src/modulePlacement.js';
import { resolveProjectBom } from '../src/projectBom.js';
import { buildProductionBomHtml, formatProductionBomText } from '../src/productionBomPanel.js';
import { describeSurfaceSelection } from '../src/selectionFeedback.js';

const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const panelSource = readFileSync(new URL('../src/productionBomPanel.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('production BOM panel loads from main runtime; opens via toolbar toggle not auto', () => {
  assert.match(mainSource, /import \{ createProductionBomPanel \} from '\.\/productionBomPanel\.js'/);
  assert.match(mainSource, /toggle-production-bom/);
  assert.match(mainSource, /productionBomPanel\.open\(\)/);
  assert.doesNotMatch(mainSource, /rebuildSceneFromSetup[\s\S]{0,400}productionBomPanel\.open\(\)/);
  assert.doesNotMatch(mainSource, /rawBomDebug/);
  assert.doesNotMatch(mainSource, /rawBom/);
  assert.match(panelSource, /data-role="bom-popout"/);
  assert.match(panelSource, /data-role="bom-download"/);
  assert.match(panelSource, /uretim-listesi\.txt/);
  assert.match(panelSource, /view\.open\(''/);
});

function placed(id, itemKey, { xCm = 0, yCm = 0, rotationZDeg = 0, widthCm }) {
  return {
    id,
    itemKey,
    widthCm,
    placement: createModulePlacement({ xCm, yCm, rotationZDeg }),
  };
}

test('corner connectors stay off the module card and stay on the combined list and text export', () => {
  const bom = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    placed('b', 'wall_150_350', { xCm: 200, yCm: 0, rotationZDeg: 270, widthCm: 150 }),
  ]);
  assert.equal(bom.lines.find((line) => line.itemKey === 'connector_corner')?.quantity, 12);

  const html = buildProductionBomHtml(bom);
  const modules = html.split('data-bom-collapse-key="__modules__"')[1].split('data-bom-collapse-key="__totals__"')[0];
  const totals = html.split('data-bom-collapse-key="__totals__"')[1];
  assert.match(html, /data-role="bom-download"/);
  assert.match(html, /data-role="bom-corner-connectors"[\s\S]*12 × Köşe Aparatı · adet · connector_corner/);
  assert.ok(html.indexOf('data-role="bom-corner-connectors"') < html.indexOf('data-bom-collapse-key="__modules__"'));
  assert.doesNotMatch(modules, /connector_corner/);
  assert.match(totals, /12 × Köşe Aparatı · adet · connector_corner/);

  const text = formatProductionBomText(bom);
  const moduleText = text.split('Birleşik leaf toplam')[0];
  assert.match(text, /12 × Köşe Aparatı · adet · connector_corner/);
  assert.doesNotMatch(moduleText, /connector_corner/);
  assert.match(text.split('Birleşik leaf toplam')[1], /connector_corner/);
});

test('wall selection feedback still describes width used by wall BOM recipes', () => {
  const message = describeSurfaceSelection([{
    userData: {
      moduleIndex: 0,
      widthCm: 100,
      stripNumber: 1,
      moduleType: 'flat-panel',
    },
  }]).message;

  assert.match(message, /·\s*100\s*cm\s*·/i);
  assert.doesNotMatch(message, /Banko|Baza|Kapı|Vitrin|Separatör/);

  const lines = resolveItemBom('wall_100_350');
  assert.ok(lines.length > 0);
  for (const line of lines) {
    assert.ok(line.itemKey);
    assert.ok(Number.isFinite(line.quantity) && line.quantity > 0);
    assert.equal(line.unit, 'adet');
  }
});
