import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error('Patch target not found: ' + label);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

// Restore rectangle selection to geometry-agnostic module/strip selection.
const rectPath = 'src/rectSelection.js';
fs.writeFileSync(rectPath, `function normalizePoint(point) {
  return {
    moduleIndex: Number(point?.moduleIndex),
    stripIndex: Number(point?.stripIndex),
  };
}

export function createRectSelection(items, anchorPoint, targetPoint) {
  if (!Array.isArray(items) || !items.length) {
    return { ok: false, message: 'Seçilebilir panel bulunamadı.' };
  }

  const anchor = normalizePoint(anchorPoint);
  const target = normalizePoint(targetPoint);

  if (
    !Number.isInteger(anchor.moduleIndex)
    || !Number.isInteger(anchor.stripIndex)
    || !Number.isInteger(target.moduleIndex)
    || !Number.isInteger(target.stripIndex)
  ) {
    return { ok: false, message: 'Seçim başlangıç veya bitiş noktası geçersiz.' };
  }

  const minModuleIndex = Math.min(anchor.moduleIndex, target.moduleIndex);
  const maxModuleIndex = Math.max(anchor.moduleIndex, target.moduleIndex);
  const minStripIndex = Math.min(anchor.stripIndex, target.stripIndex);
  const maxStripIndex = Math.max(anchor.stripIndex, target.stripIndex);

  const columnCount = maxModuleIndex - minModuleIndex + 1;
  const rowCount = maxStripIndex - minStripIndex + 1;
  const expectedCount = columnCount * rowCount;

  const entries = items
    .filter((item) => (
      item.moduleIndex >= minModuleIndex
      && item.moduleIndex <= maxModuleIndex
      && item.stripIndex >= minStripIndex
      && item.stripIndex <= maxStripIndex
    ))
    .sort((a, b) => (
      a.stripIndex - b.stripIndex
      || a.moduleIndex - b.moduleIndex
    ));

  const coordinateCount = new Set(
    entries.map((item) => \`${'${item.moduleIndex}:${item.stripIndex}'}\`),
  ).size;

  if (entries.length !== expectedCount || coordinateCount !== expectedCount) {
    return {
      ok: false,
      message: 'Seçim alanında eksik panel var; yalnızca tam dikdörtgen bloklar seçilebilir.',
    };
  }

  return {
    ok: true,
    entries,
    panelCount: expectedCount,
    columnCount,
    rowCount,
    bounds: {
      minModuleIndex,
      maxModuleIndex,
      minStripIndex,
      maxStripIndex,
    },
  };
}

export function describeRectSelection(items) {
  if (!Array.isArray(items) || !items.length) {
    return { columnCount: 0, rowCount: 0, panelCount: 0 };
  }

  const moduleIndices = items.map((item) => item.moduleIndex);
  const stripIndices = items.map((item) => item.stripIndex);

  return {
    columnCount: Math.max(...moduleIndices) - Math.min(...moduleIndices) + 1,
    rowCount: Math.max(...stripIndices) - Math.min(...stripIndices) + 1,
    panelCount: items.length,
  };
}
`);

// Remove the wall-plane test and add a regression test proving wall metadata does not block a rectangle.
const testPath = 'test/rectSelection.test.js';
let test = fs.readFileSync(testPath, 'utf8');
test = test.replace(/\n\ntest\('rejects rectangle selection across different wall planes',[\s\S]*?\n\}\);\n?/, '\n');
if (!test.includes("allows rectangle selection across wall-plane metadata")) {
  test += `\n\ntest('allows rectangle selection across wall-plane metadata', () => {\n  const items = makeGrid(3, 2).map((item) => ({\n    ...item,\n    selectionPlaneKey: item.moduleIndex === 1 ? 'left:90:y:0' : 'back:0:x:0',\n  }));\n  const result = createRectSelection(\n    items,\n    { moduleIndex: 0, stripIndex: 0, selectionPlaneKey: 'back:0:x:0' },\n    { moduleIndex: 2, stripIndex: 1, selectionPlaneKey: 'right:270:y:1000' },\n  );\n\n  assert.equal(result.ok, true);\n  assert.equal(result.panelCount, 6);\n});\n`;
}
fs.writeFileSync(testPath, test);

// Remove scene-level plane metadata plumbing.
const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
scene = replaceOnce(
  scene,
  "          stripIndex: surface.userData.stripIndex,\n          selectionPlaneKey: surface.userData.selectionPlaneKey ?? null,\n",
  "          stripIndex: surface.userData.stripIndex,\n",
  'rect selection scene metadata',
);
scene = scene.replace(/\n  function createSelectionPlaneKey\(placement\) \{[\s\S]*?\n  \}\n\n  function applyPlacementToGroup/, '\n  function applyPlacementToGroup');
scene = replaceOnce(
  scene,
  "\n    const selectionPlaneKey = createSelectionPlaneKey(placement);\n    group.userData.selectionPlaneKey = selectionPlaneKey;\n    group.traverse((child) => {\n      if (child.userData?.kind === 'surface') {\n        child.userData.selectionPlaneKey = selectionPlaneKey;\n      }\n    });",
  '',
  'selection plane assignment',
);
fs.writeFileSync(scenePath, scene);

// Correct roadmap: corner-crossing selection remains allowed by product design.
const roadmapPath = 'ROADMAP.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
  '- Çoklu panel dikdörtgen seçiminin farklı duvar düzlemlerini/köşeleri geçmesinin engellenmesi.\n',
  '- Çoklu panel seçimi köşe boyunca devam edebilir; bağlı duvarlarda renk/görsel sürekliliği korunur.\n',
);
fs.writeFileSync(roadmapPath, roadmap);
