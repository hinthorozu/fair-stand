import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

import {
  getCatalogItem,
  listCatalogItems,
  MODULE_CATALOG_KEYS,
} from '../src/catalog.js';
import { planAutomaticDepot } from '../src/autoDepot.js';
import { getItem, listRegisteredItems, resolveItemKey } from '../src/items.js';
import { resolveModuleContract } from '../src/moduleContracts.js';

const SRC_DIR = new URL('../src/', import.meta.url);
const AUTO_DEPOT_SOURCE = readFileSync(new URL('../src/autoDepot.js', import.meta.url), 'utf8');
const MODULE_CONTRACTS_SOURCE = readFileSync(new URL('../src/moduleContracts.js', import.meta.url), 'utf8');
const CATALOG_SOURCE = readFileSync(new URL('../src/catalog.js', import.meta.url), 'utf8');

function listSrcJsFiles() {
  return readdirSync(SRC_DIR)
    .filter((name) => extname(name) === '.js')
    .map((name) => ({ name, source: readFileSync(new URL(name, SRC_DIR), 'utf8') }));
}

test('autoDepot.js Catalog API veya catalogVisible kullanmaz; Item master okur', () => {
  assert.doesNotMatch(AUTO_DEPOT_SOURCE, /from ['"]\.\/catalog\.js['"]/);
  assert.doesNotMatch(AUTO_DEPOT_SOURCE, /getCatalogItem/);
  assert.doesNotMatch(AUTO_DEPOT_SOURCE, /MODULE_CATALOG/);
  assert.doesNotMatch(AUTO_DEPOT_SOURCE, /catalogVisible/);
  assert.doesNotMatch(AUTO_DEPOT_SOURCE, /catalogCategory/);
  assert.doesNotMatch(AUTO_DEPOT_SOURCE, /catalogItemIndex/);
  assert.match(AUTO_DEPOT_SOURCE, /from ['"]\.\/items\.js['"]/);
  assert.match(AUTO_DEPOT_SOURCE, /getItem\(/);
  assert.match(AUTO_DEPOT_SOURCE, /dimensions\.widthCm/);
  assert.match(AUTO_DEPOT_SOURCE, /dimensions\.depthCm/);
  assert.match(AUTO_DEPOT_SOURCE, /dimensions\.heightCm/);
});

test('moduleContracts.js Catalog projection’ı Item varlığı olarak kullanmaz', () => {
  assert.doesNotMatch(MODULE_CONTRACTS_SOURCE, /from ['"]\.\/catalog\.js['"]/);
  assert.doesNotMatch(MODULE_CONTRACTS_SOURCE, /getCatalogItem/);
  assert.doesNotMatch(MODULE_CONTRACTS_SOURCE, /MODULE_CATALOG/);
  assert.doesNotMatch(MODULE_CONTRACTS_SOURCE, /catalogVisible/);
  assert.match(MODULE_CONTRACTS_SOURCE, /from ['"]\.\/items\.js['"]/);
  assert.match(MODULE_CONTRACTS_SOURCE, /getItem\(/);
  assert.match(MODULE_CONTRACTS_SOURCE, /resolveItemKey/);
});

test('CATALOG.md Catalog’un runtime repository olmadığını kilitler', () => {
  const catalogDoc = readFileSync(new URL('../docs/refactor/CATALOG.md', import.meta.url), 'utf8');
  assert.match(catalogDoc, /Catalog bir Item runtime repository değildir/);
  assert.match(catalogDoc, /catalogVisible=false` yalnız Catalog UI görünürlüğünü etkiler/);
  assert.match(catalogDoc, /AutoDepot → Catalog/);
  assert.match(catalogDoc, /ModuleContract → Catalog/);
});

test('catalog.js Recipe/BOM’dan Item özelliği öğrenmez; resolveItemKey Item identity re-export’tur', () => {
  const itemsSource = readFileSync(new URL('../src/items.js', import.meta.url), 'utf8');
  assert.doesNotMatch(CATALOG_SOURCE, /moduleRecipes/);
  assert.doesNotMatch(CATALOG_SOURCE, /getStraightWallNominalWidthForProfileItem/);
  assert.match(CATALOG_SOURCE, /catalogWidthCm/);
  assert.match(CATALOG_SOURCE, /export \{ resolveItemKey \}/);
  assert.match(itemsSource, /export function resolveItemKey/);
  assert.match(itemsSource, /Item identity çözümlemesi Catalog üyeliğine bağlı değildir/);
  assert.doesNotMatch(CATALOG_SOURCE, /normalized\.itemKey && getCatalogItem/);
});

test('catalogVisible yalnız Catalog üyeliği içindir; src runtime domainleri okumaz', () => {
  const offenders = [];
  for (const file of listSrcJsFiles()) {
    if (file.name === 'catalog.js' || file.name === 'items.js') continue;
    if (file.source.includes('catalogVisible')) offenders.push(file.name);
  }
  assert.deepEqual(offenders, []);
});

test('catalogVisible=false Item runtime’da yok demek değildir', () => {
  const hiddenKeys = ['panel_197', 'upright_99', 'illuminated-foam', 'shelf_100'];
  for (const itemKey of hiddenKeys) {
    const item = getItem(itemKey);
    assert.ok(item, itemKey);
    assert.equal(item.catalogVisible, false, itemKey);
    assert.equal(getCatalogItem(itemKey), null, itemKey);
    assert.equal(resolveItemKey({ itemKey }), itemKey, itemKey);
  }

  assert.equal(listRegisteredItems().length, 104);
  assert.equal(listRegisteredItems().filter((item) => item.catalogVisible === true).length, 64);
  assert.equal(listCatalogItems().length, 64);
  assert.equal(MODULE_CATALOG_KEYS.length, 64);

  const hiddenItem = getItem('panel_197');
  assert.ok(hiddenItem);
  assert.equal(getCatalogItem('panel_197'), null);
  assert.notEqual(Boolean(hiddenItem), Boolean(getCatalogItem('panel_197')));
});

test('gizli Item’ın contract yokluğu Catalog gizliliğinden değil assignment yokluğundandır', () => {
  assert.ok(getItem('panel_197'));
  assert.equal(getCatalogItem('panel_197'), null);
  assert.equal(resolveModuleContract('panel_197'), null);

  const wall = resolveModuleContract('wall_200');
  assert.ok(wall);
  assert.equal(wall.itemKey, 'wall_200');
  assert.equal(wall.type, getItem('wall_200').type);

  const foam = resolveModuleContract('illuminated-foam');
  assert.ok(foam);
  assert.equal(foam.itemKey, 'illuminated-foam');
  assert.equal(getCatalogItem('illuminated-foam'), null);
});

test('AutoDepot includeContents çıktısı Item.dimensions regression’ı ile birebir aynıdır', () => {
  const fridge = getItem('MINI_FRIDGE_AVANTI').dimensions;
  const rack = getItem('COAT_RACK').dimensions;
  const kettle = getItem('KETTLE').dimensions;
  const trash = getItem('PLASTIC_TRASH_BIN');

  const plan = planAutomaticDepot({
    standType: 'island',
    standXCm: 600,
    standYCm: 500,
    sizeKey: '200x200',
    includeContents: true,
  });
  assert.equal(plan.ok, true);
  assert.equal(plan.originXCm, 200);
  assert.equal(plan.originYCm, 150);

  const fridgeSpec = plan.specs.find((spec) => spec.kind === 'mini-fridge');
  const rackSpec = plan.specs.find((spec) => spec.kind === 'coat-rack');
  const kettleSpec = plan.specs.find((spec) => spec.kind === 'kettle');
  const trashSpec = plan.specs.find((spec) => spec.itemKey === 'PLASTIC_TRASH_BIN');

  assert.deepEqual([fridgeSpec.widthCm, fridgeSpec.depthCm], [fridge.widthCm, fridge.depthCm]);
  assert.deepEqual([rackSpec.widthCm, rackSpec.depthCm], [rack.widthCm, rack.depthCm]);
  assert.deepEqual([kettleSpec.widthCm, kettleSpec.depthCm], [kettle.widthCm, kettle.depthCm]);
  assert.deepEqual(
    [trashSpec.widthCm, trashSpec.depthCm, trashSpec.heightCm],
    [trash.dimensions.widthCm, trash.dimensions.depthCm, trash.dimensions.heightCm],
  );
  assert.equal(trashSpec.kind, trash.type);
  assert.equal(trashSpec.modelFile, trash.modelFile);
  assert.equal(trashSpec.preserveModelScale, Boolean(trash.preserveModelScale));

  assert.deepEqual([fridge.widthCm, fridge.depthCm], [50, 50]);
  assert.deepEqual([rack.widthCm, rack.depthCm], [43, 43]);
  assert.deepEqual([kettle.widthCm, kettle.depthCm], [24, 19]);
  assert.deepEqual([trash.dimensions.widthCm, trash.dimensions.depthCm, trash.dimensions.heightCm], [40, 40, 60]);

  assert.deepEqual([fridgeSpec.placement.xCm, fridgeSpec.placement.yCm], [250.5, 227]);
  assert.deepEqual([rackSpec.placement.xCm, rackSpec.placement.yCm], [306.5, 227]);
  assert.deepEqual([kettleSpec.placement.xCm, kettleSpec.placement.yCm], [263.5, 242.5]);
  assert.deepEqual([trashSpec.placement.xCm, trashSpec.placement.yCm], [280, 278]);
});
