import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return `${source.slice(0, index)}${replacement}${source.slice(index + needle.length)}`;
}

// 1) Continuous wall: allow insertion at the chain's open end by keeping the
// new module on the edge and shifting only the colliding chain inward.
{
  const file = 'src/wallReflow.js';
  let source = fs.readFileSync(file, 'utf8');

  const helperMarker = `export function planContinuousWallLayout({`;
  const helper = `function tryPlanBackwardEdgeInsertion({
  insertedModules,
  activeModules,
  targetIndex,
  cursorEndCm,
  segments,
  standXCm,
  standYCm,
}) {
  const placements = new Map();
  let currentCursorEndCm = cursorEndCm;

  // Açık zincir ucunda yeni modül fiziksel uçta kalır. Son modülden başlayarak
  // yalnızca çarpışan mevcut zinciri içeri / geriye doğru iteriz.
  for (let index = insertedModules.length - 1; index >= 0; index -= 1) {
    const module = insertedModules[index];
    const widthCm = Number(module?.widthCm);
    if (!module?.id || !Number.isFinite(widthCm) || widthCm <= 0) {
      return { ok: false, invalid: true, message: 'Geçersiz modül genişliği bulundu.' };
    }

    const previous = findPreviousPlacement(
      currentCursorEndCm,
      widthCm,
      segments,
      standXCm,
      standYCm,
    );
    if (!previous) return { ok: false };

    placements.set(module.id, previous.placement);
    currentCursorEndCm = previous.previousCursorCm;
  }

  for (let index = targetIndex; index >= 0; index -= 1) {
    const entry = activeModules[index];
    const widthCm = Number(entry.module.widthCm);
    const entryEndCm = entry.pathStartCm + widthCm;

    if (entryEndCm <= currentCursorEndCm + EPSILON_CM) break;

    const previous = findPreviousPlacement(
      currentCursorEndCm,
      widthCm,
      segments,
      standXCm,
      standYCm,
    );
    if (!previous) return { ok: false };

    placements.set(entry.module.id, previous.placement);
    currentCursorEndCm = previous.previousCursorCm;
  }

  return { ok: true, placements };
}

`;
  source = replaceOnce(source, helperMarker, helper + helperMarker, 'backward edge helper');

  const oldRightBranch = `  if (normalizedSide === 'right') {
    insertionPlan = planForwardInsertion({
      insertedModules,
      activeModules,
      firstExistingIndex: targetIndex + 1,
      cursorCm: targetEntry.pathStartCm + targetWidthCm,
      segments,
      standXCm,
      standYCm,
    });
  } else {`;

  const newRightBranch = `  if (normalizedSide === 'right') {
    insertionPlan = planForwardInsertion({
      insertedModules,
      activeModules,
      firstExistingIndex: targetIndex + 1,
      cursorCm: targetEntry.pathStartCm + targetWidthCm,
      segments,
      standXCm,
      standYCm,
    });

    // Hedef zincirin fiziksel sonundaysa dışarı taşmak yerine yeni modülü
    // açık uçta sabit tutup hedef ve yalnızca çarpışan önceki zinciri içeri it.
    const capacityCm = segments.reduce((sum, segment) => sum + segment.lengthCm, 0);
    const targetEndCm = targetEntry.pathStartCm + targetWidthCm;
    const isOpenChainEnd = targetIndex === activeModules.length - 1
      && targetEndCm >= capacityCm - EPSILON_CM;

    if (!insertionPlan.ok && isOpenChainEnd) {
      insertionPlan = tryPlanBackwardEdgeInsertion({
        insertedModules,
        activeModules,
        targetIndex,
        cursorEndCm: targetEndCm,
        segments,
        standXCm,
        standYCm,
      });
    }
  } else {`;

  source = replaceOnce(source, oldRightBranch, newRightBranch, 'open end right branch');
  fs.writeFileSync(file, source);
}

// 2) UI: keep the automatic wall length synchronized with the selected stand
// type and valid X/Y dimensions. The user can still type a smaller value later.
{
  const file = 'src/main.js';
  let source = fs.readFileSync(file, 'utf8');

  const updateMarker = `function updateStageCreateState() {`;
  const helper = `function syncWallLengthFromSetup(setup) {
  if (!setup?.ok) return;

  const capacityCm = getAutomaticWallCapacityCm({
    standType: setup.standType,
    standXCm: setup.xCm,
    standYCm: setup.yCm,
  });
  if (!Number.isFinite(capacityCm)) return;

  wallLengthInput.max = String(capacityCm);
  wallLengthInput.value = String(capacityCm);
}

`;
  source = replaceOnce(source, updateMarker, helper + updateMarker, 'wall length sync helper');

  const oldValid = `  if (result.ok) {
    if (!currentStand) renderStageResult('Stand alanı hazır. Sahneyi oluşturabilirsin.');
    return;
  }`;
  const newValid = `  if (result.ok) {
    syncWallLengthFromSetup(result);
    if (!currentStand) renderStageResult('Stand alanı hazır. Sahneyi oluşturabilirsin.');
    return;
  }`;
  source = replaceOnce(source, oldValid, newValid, 'sync valid stand preview');

  const oldStageCapacity = `  const automaticWallCapacityCm = getAutomaticWallCapacityCm({
    standType: setup.standType,
    standXCm: setup.xCm,
    standYCm: setup.yCm,
  });
  wallLengthInput.max = String(automaticWallCapacityCm || setup.xCm);`;
  const newStageCapacity = `  syncWallLengthFromSetup(setup);`;
  source = replaceOnce(source, oldStageCapacity, newStageCapacity, 'sync created stand wall length');

  fs.writeFileSync(file, source);
}

// 3) Regression tests for U/L open edges.
{
  const file = 'test/moduleMove.test.js';
  let source = fs.readFileSync(file, 'utf8');

  const tests = `

test('catalog insert at U start edge keeps new module on the edge and pushes chain inward', () => {
  const modules = [
    module('first', 100, left(300)),
    module('second', 100, left(200)),
  ];
  const inserted = module('new', 50, null);

  const result = planContinuousModuleInsert({
    modules,
    insertedModule: inserted,
    desiredPlacement: left(350),
    standType: 'u-stand',
    standXCm: 400,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'reflow');
  assert.equal(result.edge, 'start');
  assert.deepEqual(result.movingPlacement, left(350));
  assert.deepEqual(result.placements.get('first'), left(250));
  assert.deepEqual(result.placements.get('second'), left(150));
  assert.deepEqual(result.orderedModuleIds, ['new', 'first', 'second']);
});

test('catalog insert at U end edge keeps new module on the edge and pushes chain inward', () => {
  const modules = [
    module('previous', 100, right(400, 200)),
    module('last', 100, right(400, 300)),
  ];
  const inserted = module('new', 50, null);

  const result = planContinuousModuleInsert({
    modules,
    insertedModule: inserted,
    desiredPlacement: right(400, 350),
    standType: 'u-stand',
    standXCm: 400,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.mode, 'reflow');
  assert.equal(result.edge, 'end');
  assert.deepEqual(result.movingPlacement, right(400, 350));
  assert.deepEqual(result.placements.get('last'), right(400, 250));
  assert.deepEqual(result.placements.get('previous'), right(400, 150));
  assert.deepEqual(result.orderedModuleIds, ['previous', 'last', 'new']);
});

test('catalog insert at L-left start edge shifts the first module inward', () => {
  const modules = [
    module('first', 100, left(150)),
  ];
  const inserted = module('new', 50, null);

  const result = planContinuousModuleInsert({
    modules,
    insertedModule: inserted,
    desiredPlacement: left(200),
    standType: 'l-left',
    standXCm: 400,
    standYCm: 250,
  });

  assert.equal(result.ok, true);
  assert.equal(result.edge, 'start');
  assert.deepEqual(result.movingPlacement, left(200));
  assert.deepEqual(result.placements.get('first'), left(100));
  assert.deepEqual(result.orderedModuleIds, ['new', 'first']);
});

test('catalog insert at L-right end edge shifts the last module inward', () => {
  const modules = [
    module('previous', 100, right(400, 50)),
    module('last', 100, right(400, 150)),
  ];
  const inserted = module('new', 50, null);

  const result = planContinuousModuleInsert({
    modules,
    insertedModule: inserted,
    desiredPlacement: right(400, 200),
    standType: 'l-right',
    standXCm: 400,
    standYCm: 250,
  });

  assert.equal(result.ok, true);
  assert.equal(result.edge, 'end');
  assert.deepEqual(result.movingPlacement, right(400, 200));
  assert.deepEqual(result.placements.get('last'), right(400, 100));
  assert.deepEqual(result.placements.get('previous'), right(400, 0));
  assert.deepEqual(result.orderedModuleIds, ['previous', 'last', 'new']);
});
`;

  if (source.includes("catalog insert at U start edge keeps new module")) {
    throw new Error('Open edge tests already present');
  }
  source += tests;
  fs.writeFileSync(file, source);
}

console.log('Open edge insertion, regression tests, and automatic wall length sync applied.');
