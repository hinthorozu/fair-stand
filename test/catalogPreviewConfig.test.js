import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { CATALOG_PREVIEWS, getCatalogItem, listCatalogItems } from '../src/catalog.js';
import { getItem, listRegisteredItems } from '../src/items.js';
import {
  CATALOG_PREVIEW_RENDERERS,
  createModuleCatalogPreview,
} from '../src/moduleDragSidebar.js';

const SIDEBAR_SOURCE = readFileSync(new URL('../src/moduleDragSidebar.js', import.meta.url), 'utf8');
const CONTEXT_SOURCE = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
const CATALOG_SOURCE = readFileSync(new URL('../src/catalog.js', import.meta.url), 'utf8');

const PREVIEW_FN = SIDEBAR_SOURCE.slice(
  SIDEBAR_SOURCE.indexOf('export function createModuleCatalogPreview'),
  SIDEBAR_SOURCE.indexOf('export function createModuleDragSidebar'),
);

const ROOT_CLASS_BY_PREVIEW = Object.freeze({
  shelf: 'module-drag-panel module-drag-shelf',
  'sofa-set': 'module-drag-sofa',
  'sofa-single': 'module-drag-sofa-single',
  'sofa-double': 'module-drag-sofa-double',
  'coffee-table': 'module-drag-coffee-table',
  'table-chair-set': 'module-drag-table-chair',
  chair: 'module-drag-eames-chair',
  'glass-table': 'module-drag-glass-table',
  'bar-stool': 'module-drag-bar-stool',
  'mini-fridge': 'module-drag-mini-fridge',
  'coat-rack': 'module-drag-coat-rack',
  'plastic-trash-bin': 'module-drag-trash-bin',
  'long-planter': 'module-drag-long-planter',
  'indoor-plant': 'module-drag-plant module-drag-plant-1',
  kettle: 'module-drag-kettle',
  tv: 'module-drag-tv',
  'video-wall': 'module-drag-tv is-video-wall',
  floodlight: 'module-drag-floodlight',
  upright: 'module-drag-upright',
  profile: 'module-drag-profile',
  'base-wall': 'module-drag-base-wall',
  base: 'module-drag-base',
  counter: 'module-drag-counter',
  separator: 'module-drag-separator',
  'separator-vine': 'module-drag-separator is-vine',
  door: 'module-drag-door',
  showcase: 'module-drag-showcase',
  'flat-panel': 'module-drag-panel',
});

function installDocument() {
  function createElement(tagName) {
    const el = {
      tagName: String(tagName).toUpperCase(),
      className: '',
      style: {},
      dataset: {},
      childNodes: [],
      classList: {
        add(...names) {
          const parts = new Set(String(el.className).split(/\s+/).filter(Boolean));
          for (const name of names) parts.add(name);
          el.className = [...parts].join(' ');
        },
      },
      appendChild(child) {
        el.childNodes.push(child);
        return child;
      },
      append(...nodes) {
        nodes.forEach((node) => el.appendChild(node));
      },
    };
    return el;
  }

  globalThis.document = {
    querySelector() { return {}; },
    createElement,
    head: { appendChild() {} },
  };
}

function serializeNode(node) {
  return {
    tag: node.tagName,
    className: node.className,
    style: { ...node.style },
    dataset: { ...node.dataset },
    children: node.childNodes.map(serializeNode),
  };
}

test('64 görünür Item catalogPreview taşır; gizli Item zorunlu değildir', () => {
  const visible = listRegisteredItems().filter((item) => item.catalogVisible === true);
  const hidden = listRegisteredItems().filter((item) => item.catalogVisible !== true);
  assert.equal(visible.length, 64);
  assert.equal(hidden.length, 41);

  for (const item of visible) {
    assert.equal(typeof item.catalogPreview, 'string', item.itemKey);
    assert.ok(CATALOG_PREVIEWS.includes(item.catalogPreview), `${item.itemKey} ${item.catalogPreview}`);
    assert.equal(getCatalogItem(item.itemKey).catalogPreview, item.catalogPreview, item.itemKey);
  }

  for (const item of hidden) {
    assert.equal(Object.hasOwn(item, 'catalogPreview'), false, item.itemKey);
  }
});

test('Catalog preview renderer yalnız catalogPreview key ile seçilir; type branch yoktur', () => {
  assert.doesNotMatch(PREVIEW_FN, /module\.type/);
  assert.doesNotMatch(PREVIEW_FN, /item\.type/);
  assert.doesNotMatch(PREVIEW_FN, /switch\s*\(\s*type/);
  assert.doesNotMatch(PREVIEW_FN, /type\s*===/);
  assert.doesNotMatch(PREVIEW_FN, /type\.includes/);
  assert.doesNotMatch(PREVIEW_FN, /startsWith/);
  assert.match(PREVIEW_FN, /CATALOG_PREVIEW_RENDERERS\[catalogPreview\]/);
  assert.doesNotMatch(SIDEBAR_SOURCE, /if \(module\.type ===/);
  assert.doesNotMatch(SIDEBAR_SOURCE, /itemKey ===/);
  assert.doesNotMatch(SIDEBAR_SOURCE, /MODULE_CATALOG_GROUPS/);

  const pickerStart = CONTEXT_SOURCE.indexOf('function createPickerCard');
  const pickerEnd = CONTEXT_SOURCE.indexOf('function collapsePickerGroups');
  const picker = CONTEXT_SOURCE.slice(pickerStart, pickerEnd);
  assert.match(picker, /createModuleCatalogPreview\(module\)/);
  assert.doesNotMatch(picker, /module\.type/);
  assert.doesNotMatch(picker, /item\.type/);

  const rendererKeys = Object.keys(CATALOG_PREVIEW_RENDERERS).sort();
  assert.deepEqual(rendererKeys, [...CATALOG_PREVIEWS].sort());
  assert.match(CATALOG_SOURCE, /catalogPreview: item\.catalogPreview/);
  assert.match(CATALOG_SOURCE, /is catalogVisible without catalogPreview/);

  const catalogDoc = readFileSync(new URL('../docs/refactor/CATALOG.md', import.meta.url), 'utf8');
  assert.match(catalogDoc, /Catalog görünümü Item\.type üzerinden belirlenmez/);
  assert.match(catalogDoc, /Catalog preview renderer seçimi yalnız Item\.catalogPreview üzerinden yapılır/);
});

test('64 Item catalogPreview dağılımı kilitlidir', () => {
  const counts = {};
  for (const item of listCatalogItems()) {
    counts[item.catalogPreview] = (counts[item.catalogPreview] ?? 0) + 1;
  }
  assert.deepEqual(counts, {
    'bar-stool': 1,
    base: 3,
    'base-wall': 3,
    chair: 1,
    'coat-rack': 1,
    'coffee-table': 1,
    counter: 6,
    door: 1,
    'flat-panel': 12,
    floodlight: 1,
    'glass-table': 1,
    'indoor-plant': 1,
    kettle: 1,
    'long-planter': 3,
    'mini-fridge': 1,
    'plastic-trash-bin': 1,
    profile: 4,
    separator: 2,
    'separator-vine': 2,
    shelf: 6,
    showcase: 2,
    'sofa-double': 1,
    'sofa-set': 1,
    'sofa-single': 1,
    'table-chair-set': 1,
    tv: 3,
    upright: 1,
    'video-wall': 2,
  });
});

test('64 Catalog preview kök sınıfı önceki CSS silüetini korur', () => {
  installDocument();
  const projected = listCatalogItems();
  assert.equal(projected.length, 64);

  for (const module of projected) {
    const tree = serializeNode(createModuleCatalogPreview(module));
    assert.equal(tree.className, 'module-drag-preview', module.itemKey);
    const root = tree.children[0];
    assert.ok(root, module.itemKey);
    let expected = ROOT_CLASS_BY_PREVIEW[module.catalogPreview];
    if (module.catalogPreview === 'flat-panel' && module.stripOccupancy?.align === 'top') {
      expected = 'module-drag-panel is-hanging-top';
    }
    if (module.catalogPreview === 'video-wall' && Number(module.videoWallRows) === 3) {
      expected = 'module-drag-tv is-video-wall is-video-wall-3x3';
    }
    assert.equal(root.className, expected, module.itemKey);
  }

  const kettle = serializeNode(createModuleCatalogPreview(getCatalogItem('KETTLE')));
  assert.deepEqual(kettle.children[0].children.map((child) => child.className), [
    'module-drag-kettle-body',
    'module-drag-kettle-handle',
    'module-drag-kettle-spout',
    'module-drag-kettle-lid',
    'module-drag-kettle-knob',
  ]);

  const trash = serializeNode(createModuleCatalogPreview(getCatalogItem('PLASTIC_TRASH_BIN')));
  assert.deepEqual(trash.children[0].children.map((child) => child.className), [
    'module-drag-trash-bin-handle',
    'module-drag-trash-bin-lid',
    'module-drag-trash-bin-body',
  ]);

  const showcase3 = serializeNode(createModuleCatalogPreview(getCatalogItem('wall_showcase_100_3')));
  assert.equal(showcase3.children[0].dataset.eyes, '3');
  const showcase2 = serializeNode(createModuleCatalogPreview(getCatalogItem('wall_showcase_100_2')));
  assert.equal(showcase2.children[0].dataset.eyes, '2');

  const vine = serializeNode(createModuleCatalogPreview(getCatalogItem('wall_separator_100_sarmasik')));
  assert.match(vine.children[0].className, /is-vine/);
  const plain = serializeNode(createModuleCatalogPreview(getCatalogItem('wall_separator_100')));
  assert.doesNotMatch(plain.children[0].className, /is-vine/);

  const hanging = serializeNode(createModuleCatalogPreview(getCatalogItem('wall_200_short_up_2')));
  assert.match(hanging.children[0].className, /is-hanging-top/);
  assert.equal(hanging.children[0].children[0].className, 'module-drag-hanging-frame');

  const shelf3 = serializeNode(createModuleCatalogPreview(getCatalogItem('wall_shelf_3_100')));
  assert.equal(shelf3.children[0].children.filter((child) => child.tag === 'I').length, 3);

  const empty = serializeNode(createModuleCatalogPreview({ itemKey: 'illuminated-foam' }));
  assert.equal(empty.children.length, 0);

  assert.throws(
    () => createModuleCatalogPreview({ itemKey: 'x', catalogPreview: 'not-a-preview' }),
    /Unknown catalogPreview/,
  );

  assert.equal(getItem('wall_200').catalogPreview, 'flat-panel');
  assert.equal(getItem('KETTLE').catalogPreview, 'kettle');
  assert.equal(getItem('VIDEO_WALL_2X2').catalogPreview, 'video-wall');
  assert.equal(getItem('profile_190').catalogPreview, 'profile');
});
