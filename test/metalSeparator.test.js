import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

import { getItem } from '../src/items.js';
import { resolveProjectBom } from '../src/projectBom.js';
import { formatProductionBomText } from '../src/productionBomPanel.js';

function qty(lines, itemKey) {
  const line = lines.find((entry) => entry.itemKey === itemKey);
  return line ? line.quantity : 0;
}

function wall(strips) {
  return {
    id: 'wall',
    itemKey: 'wall_200_350',
    type: 'flat-panel',
    strips,
  };
}

test('metal separator is a hidden square-metre item that can take a price', () => {
  const item = getItem('metal_separator');
  assert.equal(item.name, 'Metal Separatör');
  assert.equal(item.type, 'panel-glass');
  assert.equal(item.unit, 'metre_kare');
  assert.equal(item.catalogVisible, false);
  assert.equal(item.isCostEnabled, true);
  assert.equal(item.isRender, false);
});

test('one ctrl group is a single width by height, priced in square metres', () => {
  const strips = Array.from({ length: 7 }, (_, index) => ({
    itemKey: 'panel_197',
    isMetalSeparator: index < 2,
    metalSeparatorGroupId: index < 2 ? 'group-a' : null,
    stripIndex: index,
  }));
  const bom = resolveProjectBom([wall(strips)]);
  const metal = bom.lines.find((entry) => entry.itemKey === 'metal_separator');
  const section = bom.printAreas.find((entry) => entry.id === 'metal');
  assert.equal(qty(bom.lines, 'panel_197'), 5);
  assert.equal(qty(bom.lines, 'panel_cam_197'), 0);
  assert.equal(section.lines.length, 1);
  assert.equal(section.lines[0].widthCm, 197);
  assert.equal(section.lines[0].heightCm, 94);
  assert.equal(section.lines[0].quantity, 1);
  assert.equal(metal.unit, 'metre_kare');
  assert.equal(metal.quantity, section.totalAreaM2);
  assert.equal(metal.quantity, (197 * 94) / 10000);
});

test('panels side by side in one ctrl group share one width', () => {
  const strip = (groupId) => Array.from({ length: 7 }, (_, index) => ({
    itemKey: 'panel_197',
    isMetalSeparator: index === 0,
    metalSeparatorGroupId: index === 0 ? groupId : null,
    stripIndex: index,
  }));
  const bom = resolveProjectBom([
    { ...wall(strip('group-a')), id: 'left' },
    { ...wall(strip('group-a')), id: 'right' },
  ]);
  const section = bom.printAreas.find((entry) => entry.id === 'metal');
  assert.equal(section.lines.length, 1);
  assert.equal(section.lines[0].widthCm, 394);
  assert.equal(section.lines[0].heightCm, 47);
  assert.equal(section.lines[0].quantity, 1);
  assert.equal(qty(bom.lines, 'metal_separator'), (394 * 47) / 10000);
});

test('separate groups keep their own measurements and add up in square metres', () => {
  const left = Array.from({ length: 7 }, (_, index) => ({
    itemKey: 'panel_197',
    isMetalSeparator: index === 0,
    metalSeparatorGroupId: index === 0 ? 'group-a' : null,
    stripIndex: index,
  }));
  const right = Array.from({ length: 7 }, (_, index) => ({
    itemKey: 'panel_197',
    isMetalSeparator: index === 0,
    metalSeparatorGroupId: index === 0 ? 'group-b' : null,
    stripIndex: index,
  }));
  const bom = resolveProjectBom([
    { ...wall(left), id: 'left' },
    { ...wall(right), id: 'right' },
  ]);
  const section = bom.printAreas.find((entry) => entry.id === 'metal');
  assert.equal(section.lines.length, 1);
  assert.equal(section.lines[0].widthCm, 197);
  assert.equal(section.lines[0].heightCm, 47);
  assert.equal(section.lines[0].quantity, 2);
  assert.equal(qty(bom.lines, 'metal_separator'), section.totalAreaM2);
  const text = formatProductionBomText(bom);
  const panelsStart = text.indexOf('\nPaneller\n');
  const productionStart = text.indexOf('\nÜretim\n');
  const panels = text.slice(panelsStart, productionStart);
  assert.match(panels, /2 x Metal Separatör 197 × 47 cm - metre_kare/);
  assert.doesNotMatch(panels, /Toplam /);
  assert.match(text.slice(productionStart), /1,85 × Metal Separatör · metre_kare · metal_separator/);
  assert.doesNotMatch(text, /Toplam \d/);
});

test('the panel menu offers metal separator next to glass', () => {
  const source = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  assert.match(source, /Metal Separatöre Çevir/);
  assert.match(source, /toggle-metal-separator/);
});
