import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

import { resolveItemBom } from '../src/itemBom.js';
import { getItem } from '../src/items.js';

const DELETED_FIELDS = Object.freeze([
  'screenWidthCm',
  'screenHeightCm',
  'catalogHeightCm',
  'tableDiameterCm',
  'panelScreenWidthCm',
  'panelScreenHeightCm',
  'sizeInch',
]);

test('src runtime deleted duplicate dimension fields are gone except Recipe.nominalWidthCm', () => {
  const srcDir = new URL('../src/', import.meta.url);
  for (const name of readdirSync(srcDir).filter((file) => extname(file) === '.js')) {
    const source = readFileSync(new URL(name, srcDir), 'utf8');
    for (const field of DELETED_FIELDS) {
      assert.doesNotMatch(source, new RegExp(field), `${name} still mentions ${field}`);
    }
    if (name !== 'moduleRecipes.js') {
      assert.doesNotMatch(source, /composition\.nominalWidthCm/, `${name} still reads composition.nominalWidthCm`);
    }
  }
  const itemsSource = readFileSync(new URL('../src/items.js', import.meta.url), 'utf8');
  assert.doesNotMatch(itemsSource, /nominalWidthCm/);
  const bomSource = readFileSync(new URL('../src/itemBom.js', import.meta.url), 'utf8');
  assert.match(bomSource, /composition\.items/);
  assert.doesNotMatch(bomSource, /item\.dimensions\?\.widthCm/);
});

test('itemBom recipe BOM uses composition.items for wall_200 and door_100', () => {
  const wall = getItem('wall_200_350');
  assert.equal(wall.composition.nominalWidthCm, undefined);
  assert.equal(wall.dimensions.widthCm, 200);
  const wallBom = Object.fromEntries(resolveItemBom('wall_200_350').map((line) => [line.itemKey, line.quantity]));
  assert.equal(wallBom.profile_190, 2);
  assert.equal(wallBom.panel_197, 7);

  const doorBom = Object.fromEntries(resolveItemBom('wall_door_100_350').map((line) => [line.itemKey, line.quantity]));
  assert.equal(doorBom.door_leaf_100, 1);
});
