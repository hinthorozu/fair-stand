import test from 'node:test';
import assert from 'node:assert/strict';

import { collectPrintAreas } from '../src/printAreaBom.js';
import { resolveProjectBom } from '../src/projectBom.js';
import { formatProductionBomText } from '../src/productionBomPanel.js';

function strip(stripIndex, extra = {}) {
  return { stripIndex, ...extra };
}

function wall(id, widthCm, strips) {
  return {
    id,
    type: 'flat-panel',
    itemKey: widthCm === 100 ? 'wall_100_350' : 'wall_200_350',
    widthCm,
    strips,
  };
}

function rectCell(stripIndex, column, row, columns, rows) {
  return strip(stripIndex, {
    imageAssetId: 'asset-rect',
    imageTransform: {
      mode: 'rect-group',
      regionStartX: column / columns,
      regionWidth: 1 / columns,
      regionStartY: row / rows,
      regionHeight: 1 / rows,
    },
  });
}

function section(areas, id) {
  return areas.find((entry) => entry.id === id) ?? null;
}

test('a single printed panel is 100×50 cm and 0.50 m²', () => {
  const strips = [
    strip(0, { imageAssetId: 'asset-a', imageTransform: { mode: 'single' } }),
    strip(1),
  ];
  const areas = collectPrintAreas([wall('a', 100, strips)]);
  const images = section(areas, 'image');
  assert.equal(areas.length, 1);
  assert.equal(images.lines.length, 1);
  assert.equal(images.lines[0].quantity, 1);
  assert.equal(images.lines[0].widthCm, 100);
  assert.equal(images.lines[0].heightCm, 50);
  assert.equal(images.lines[0].areaM2, 0.5);
  assert.equal(images.lines[0].name, 'Görsel');
  assert.equal(images.lines[0].subjectId, 'asset-a');
  assert.equal(images.totalAreaM2, 0.5);
});

test('a 2×3 panel image is one 200×150 cm piece at 3 m²', () => {
  const modules = [0, 1].map((column) => wall(
    `m${column}`,
    100,
    [0, 1, 2].map((row) => rectCell(row, column, row, 2, 3)),
  ));
  const images = section(collectPrintAreas(modules), 'image');
  assert.equal(images.lines.length, 1);
  assert.equal(images.lines[0].quantity, 1);
  assert.equal(images.lines[0].widthCm, 200);
  assert.equal(images.lines[0].heightCm, 150);
  assert.equal(images.lines[0].areaM2, 3);
  assert.equal(images.totalAreaM2, 3);
});

test('the same image at the same size shares one quantity line', () => {
  const one = wall('a', 100, [
    strip(0, { imageAssetId: 'asset-a', imageTransform: { mode: 'single' } }),
  ]);
  const two = wall('b', 100, [
    strip(0, { imageAssetId: 'asset-a', imageTransform: { mode: 'single' } }),
  ]);
  const images = section(collectPrintAreas([one, two], new Map([['asset-a', 'logo.png']])), 'image');
  assert.equal(images.lines.length, 1);
  assert.equal(images.lines[0].name, 'logo.png');
  assert.equal(images.lines[0].quantity, 2);
  assert.equal(images.lines[0].widthCm, 100);
  assert.equal(images.lines[0].heightCm, 50);
  assert.equal(images.lines[0].areaM2, 0.5);
  assert.equal(images.lines[0].totalAreaM2, 1);
  assert.equal(images.totalAreaM2, 1);
});

test('different images at the same size stay separate lines', () => {
  const one = wall('a', 100, [
    strip(0, { imageAssetId: 'asset-a', imageTransform: { mode: 'single' } }),
  ]);
  const two = wall('b', 100, [
    strip(0, { imageAssetId: 'asset-b', imageTransform: { mode: 'single' } }),
  ]);
  const images = section(collectPrintAreas([one, two]), 'image');
  assert.equal(images.lines.length, 2);
  assert.equal(images.lines[0].quantity, 1);
  assert.equal(images.lines[1].quantity, 1);
  assert.equal(images.lines[0].widthCm, 100);
  assert.equal(images.lines[0].heightCm, 50);
  assert.equal(images.lines[0].areaM2, 0.5);
  assert.equal(images.totalAreaM2, 1);
  assert.deepEqual(images.lines.map((line) => line.subjectId).sort(), ['asset-a', 'asset-b']);
});

test('the same image at two sizes stays on two lines and keeps one m² total', () => {
  function stacked(widthCm, rows, assetId) {
    return wall(`w${widthCm}`, widthCm, Array.from({ length: rows }, (_, row) => strip(row, {
      imageAssetId: assetId,
      imageTransform: {
        mode: 'rect-group',
        regionStartX: 0,
        regionWidth: 1,
        regionStartY: row / rows,
        regionHeight: 1 / rows,
      },
    })));
  }
  const wide = stacked(200, 4, 'asset-a');
  const narrow = stacked(150, 2, 'asset-a');
  const names = new Map([['asset-a', 'logo.png']]);
  const images = section(collectPrintAreas([wide, narrow], names), 'image');
  assert.equal(images.lines.length, 2);
  assert.equal(images.lines[0].name, 'logo.png');
  assert.equal(images.lines[0].widthCm, 200);
  assert.equal(images.lines[0].heightCm, 200);
  assert.equal(images.lines[0].areaM2, 4);
  assert.equal(images.lines[1].widthCm, 150);
  assert.equal(images.lines[1].heightCm, 100);
  assert.equal(images.lines[1].areaM2, 1.5);
  assert.equal(images.totalAreaM2, 5.5);
  const text = formatProductionBomText(resolveProjectBom([wide, narrow], null, names));
  assert.match(text, /logo\.png · 1 × 200×200 cm · 4,00 m²/);
  assert.match(text, /logo\.png · 1 × 150×100 cm · 1,50 m²/);
  assert.match(text, /logo\.png toplam 5,50 m²/);
  assert.match(text, /Toplam 5,50 m²/);
});

test('adjacent rect groups stay separate pieces when their regions restart', () => {
  const first = [0, 1].map((column) => wall(
    `a${column}`,
    100,
    [rectCell(0, column, 0, 2, 1)],
  ));
  const second = [0, 1].map((column) => wall(
    `b${column}`,
    100,
    [strip(0, {
      imageAssetId: 'asset-rect',
      imageTransform: {
        mode: 'rect-group',
        regionStartX: column / 2,
        regionWidth: 1 / 2,
        regionStartY: 0,
        regionHeight: 1,
      },
    })],
  ));
  const images = section(collectPrintAreas([...first, ...second]), 'image');
  assert.equal(images.lines[0].quantity, 2);
  assert.equal(images.lines[0].widthCm, 200);
  assert.equal(images.lines[0].heightCm, 50);
  assert.equal(images.totalAreaM2, 2);
});

test('lightbox and mesh are separate pieces and their print is not also an image', () => {
  const lightbox = wall('light', 100, [0, 1, 2].map((row) => strip(row, {
    imageAssetId: 'printed-on-fabric',
    fabricGroupId: 'fabric-light',
    fabricType: 'lightbox',
  })));
  const mesh = wall('mesh', 200, [0, 1].map((row) => strip(row, {
    fabricGroupId: 'fabric-mesh',
    fabricType: 'mesh',
    fabricImageAssetId: 'mesh-print',
  })));
  const areas = collectPrintAreas([lightbox, mesh]);
  assert.equal(section(areas, 'image'), null);
  const light = section(areas, 'lightbox');
  const meshSection = section(areas, 'mesh');
  assert.equal(light.lines[0].widthCm, 100);
  assert.equal(light.lines[0].heightCm, 150);
  assert.equal(light.lines[0].areaM2, 1.5);
  assert.equal(meshSection.lines[0].widthCm, 200);
  assert.equal(meshSection.lines[0].heightCm, 100);
  assert.equal(meshSection.lines[0].areaM2, 2);
  assert.equal(meshSection.lines[0].name, 'Görsel');
  assert.equal(meshSection.lines[0].subjectId, 'mesh-print');
});

test('a colored lightbox is named by its hex and is not an image line', () => {
  const lightbox = wall('light', 100, [0, 1].map((row) => strip(row, {
    fabricGroupId: 'fabric-light',
    fabricType: 'lightbox',
    fabricColor: '#E11D48',
  })));
  const areas = collectPrintAreas([lightbox]);
  assert.equal(section(areas, 'image'), null);
  const light = section(areas, 'lightbox');
  assert.equal(light.lines[0].name, '#e11d48');
  assert.equal(light.lines[0].widthCm, 100);
  assert.equal(light.lines[0].heightCm, 100);
  assert.equal(light.lines[0].areaM2, 1);
});

test('styrofoam logos use width × height and ignore thickness', () => {
  const areas = collectPrintAreas([
    { id: 'f1', type: 'illuminated-foam', itemKey: 'illuminated-foam', widthCm: 80, heightCm: 40, depthCm: 3 },
    { id: 'f2', itemKey: 'illuminated-foam', widthCm: 80, heightCm: 40, depthCm: 3 },
    { id: 'f3', type: 'illuminated-foam', widthCm: 200, heightCm: 150, depthCm: 3 },
  ]);
  const foam = section(areas, 'foam');
  assert.equal(foam.lines.length, 2);
  assert.equal(foam.lines[0].widthCm, 200);
  assert.equal(foam.lines[0].heightCm, 150);
  assert.equal(foam.lines[0].quantity, 1);
  assert.equal(foam.lines[0].areaM2, 3);
  assert.equal(foam.lines[1].quantity, 2);
  assert.equal(foam.lines[1].widthCm, 80);
  assert.equal(foam.lines[1].heightCm, 40);
  assert.equal(foam.lines[1].areaM2, 0.32);
  assert.equal(foam.lines[1].totalAreaM2, 0.64);
  assert.equal(foam.totalAreaM2, 3.64);
});

test('project BOM carries print areas without adding them to hardware lines', () => {
  const bom = resolveProjectBom([]);
  assert.deepEqual(bom.printAreas, []);
  assert.deepEqual(bom.lines, []);
});
