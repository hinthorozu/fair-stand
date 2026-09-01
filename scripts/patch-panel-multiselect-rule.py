from pathlib import Path

scene_path = Path('src/scene3d.js')
rect_path = Path('src/rectSelection.js')
test_path = Path('test/panelMultiSelectRule.test.js')

scene = scene_path.read_text(encoding='utf-8')
rect = rect_path.read_text(encoding='utf-8')

old_import = "import { createRectSelection } from './rectSelection.js';"
new_import = "import { createPanelRangeSelection, createRectSelection } from './rectSelection.js';"
if old_import not in scene:
    raise SystemExit('rectSelection import marker not found')
scene = scene.replace(old_import, new_import, 1)

func_marker = '  function selectRectangleTo(mesh) {'
func_start = scene.find(func_marker)
if func_start < 0:
    raise SystemExit('selectRectangleTo marker not found')
call_pos = scene.find('    const result = createRectSelection(', func_start)
if call_pos < 0:
    raise SystemExit('selectRectangleTo createRectSelection call not found')
scene = scene[:call_pos] + scene[call_pos:].replace(
    '    const result = createRectSelection(',
    '    const result = createPanelRangeSelection(',
    1,
)

insert_marker = 'export function createRectSelection(items, anchorPoint, targetPoint) {'
if insert_marker not in rect:
    raise SystemExit('createRectSelection marker not found')

helper = '''export function createPanelRangeSelection(items, anchorPoint, targetPoint) {\n  if (!Array.isArray(items) || !items.length) {\n    return { ok: false, message: 'Seçilebilir panel bulunamadı.' };\n  }\n\n  const anchor = normalizePoint(anchorPoint);\n  const target = normalizePoint(targetPoint);\n\n  if (\n    !Number.isInteger(anchor.moduleIndex)\n    || !Number.isInteger(anchor.stripIndex)\n    || !Number.isInteger(target.moduleIndex)\n    || !Number.isInteger(target.stripIndex)\n  ) {\n    return { ok: false, message: 'Seçim başlangıç veya bitiş noktası geçersiz.' };\n  }\n\n  const selectableModuleIndices = [...new Set(\n    items\n      .map((item) => Number(item?.moduleIndex))\n      .filter(Number.isInteger),\n  )].sort((a, b) => a - b);\n  const anchorColumn = selectableModuleIndices.indexOf(anchor.moduleIndex);\n  const targetColumn = selectableModuleIndices.indexOf(target.moduleIndex);\n  if (anchorColumn < 0 || targetColumn < 0) {\n    return { ok: false, message: 'Seçim başlangıç veya bitiş paneli bulunamadı.' };\n  }\n\n  const minColumn = Math.min(anchorColumn, targetColumn);\n  const maxColumn = Math.max(anchorColumn, targetColumn);\n  const selectedModuleIndices = selectableModuleIndices.slice(minColumn, maxColumn + 1);\n  const selectedModuleSet = new Set(selectedModuleIndices);\n  const minStripIndex = Math.min(anchor.stripIndex, target.stripIndex);\n  const maxStripIndex = Math.max(anchor.stripIndex, target.stripIndex);\n  const columnOrder = new Map(selectedModuleIndices.map((moduleIndex, index) => [moduleIndex, index]));\n\n  // Ctrl/Cmd çoklu seçimde kural modül tipi değil panel varlığıdır. Aralıkta\n  // kapı/vitrin açıklığı gibi panel olmayan hücreler bulunabilir; bunlar seçimi\n  // bozmaz, yalnızca gerçekten var olan panel yüzeyleri seçilir.\n  const entries = items\n    .filter((item) => (\n      selectedModuleSet.has(Number(item?.moduleIndex))\n      && Number(item?.stripIndex) >= minStripIndex\n      && Number(item?.stripIndex) <= maxStripIndex\n    ))\n    .sort((a, b) => (\n      Number(a.stripIndex) - Number(b.stripIndex)\n      || columnOrder.get(Number(a.moduleIndex)) - columnOrder.get(Number(b.moduleIndex))\n    ));\n\n  if (!entries.length) {\n    return { ok: false, message: 'Seçim aralığında panel bulunamadı.' };\n  }\n\n  return {\n    ok: true,\n    entries,\n    panelCount: entries.length,\n    columnCount: selectedModuleIndices.length,\n    rowCount: maxStripIndex - minStripIndex + 1,\n    bounds: {\n      minModuleIndex: selectedModuleIndices[0],\n      maxModuleIndex: selectedModuleIndices.at(-1),\n      minStripIndex,\n      maxStripIndex,\n    },\n  };\n}\n\n'''
rect = rect.replace(insert_marker, helper + insert_marker, 1)

scene_path.write_text(scene, encoding='utf-8')
rect_path.write_text(rect, encoding='utf-8')

test_path.write_text(r'''import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPanelRangeSelection, createRectSelection } from '../src/rectSelection.js';

test('Ctrl/Cmd panel range selection is based on panel presence, not module type', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /surface\.userData\.selectionMode === 'panel'/);
  assert.match(scene, /const result = createPanelRangeSelection\(/);
  assert.match(scene, /\.filter\(\(surface\) => surface\.userData\.selectionMode === 'panel'\)/);
});

test('door upper panels 4-6 can be selected vertically as one range', () => {
  const items = [4, 5, 6].map((stripIndex) => ({ moduleIndex: 0, stripIndex, id: `door-${stripIndex}` }));
  const result = createPanelRangeSelection(
    items,
    { moduleIndex: 0, stripIndex: 4 },
    { moduleIndex: 0, stripIndex: 6 },
  );
  assert.equal(result.ok, true);
  assert.deepEqual(result.entries.map((entry) => entry.stripIndex), [4, 5, 6]);
});

test('missing non-panel cells do not block Ctrl/Cmd multi selection', () => {
  const items = [
    { moduleIndex: 0, stripIndex: 0, id: 'flat-top' },
    { moduleIndex: 0, stripIndex: 1, id: 'flat-mid' },
    { moduleIndex: 0, stripIndex: 2, id: 'flat-low' },
    { moduleIndex: 1, stripIndex: 0, id: 'door-top' },
    { moduleIndex: 1, stripIndex: 2, id: 'door-low' },
    { moduleIndex: 2, stripIndex: 0, id: 'shelf-top' },
    { moduleIndex: 2, stripIndex: 1, id: 'shelf-mid' },
    { moduleIndex: 2, stripIndex: 2, id: 'shelf-low' },
  ];
  const range = createPanelRangeSelection(
    items,
    { moduleIndex: 0, stripIndex: 0 },
    { moduleIndex: 2, stripIndex: 2 },
  );
  assert.equal(range.ok, true);
  assert.equal(range.panelCount, 8);

  // Lightbox/beze çevirme için kullanılan strict dikdörtgen doğrulaması değişmez.
  const strict = createRectSelection(
    items,
    { moduleIndex: 0, stripIndex: 0 },
    { moduleIndex: 2, stripIndex: 2 },
  );
  assert.equal(strict.ok, false);
});

test('catalog panel-bearing wall module builders expose panel selection mode', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function createFlatPanelModule[\s\S]*?selectionMode: 'panel'/);
  assert.match(scene, /function createDoorModule[\s\S]*?surfaceRole: 'upper-panel'[\s\S]*?selectionMode: 'panel'|function createDoorModule[\s\S]*?selectionMode: 'panel'[\s\S]*?surfaceRole: 'upper-panel'/);
  assert.match(scene, /function createShowcaseModule[\s\S]*?selectionMode: 'panel'/);
  assert.match(scene, /function createShelfModule[\s\S]*?createFlatPanelModule/);
  assert.match(scene, /function createBaseWallModule[\s\S]*?createFlatPanelModule/);
});
''', encoding='utf-8')
