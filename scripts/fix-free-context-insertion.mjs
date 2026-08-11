import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error('Patch target not found: ' + label);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

// 1) Add a reusable free-side insertion planner to the placement engine.
const placementPath = 'src/modulePlacement.js';
let placement = fs.readFileSync(placementPath, 'utf8');
if (!placement.includes('export function planFreeSideInsertion')) {
  placement += `

function getVisualRightAxisDirection(rotationZDeg) {
  const rotation = normalizeModuleRotationZDeg(rotationZDeg);
  if (rotation === 0) return { axis: 'x', sign: 1 };
  if (rotation === 90) return { axis: 'y', sign: -1 };
  if (rotation === 180) return { axis: 'x', sign: -1 };
  return { axis: 'y', sign: 1 };
}

export function createFreeSidePlacement({
  sourcePlacement,
  sourceWidthCm,
  insertedWidthCm,
  side = 'right',
} = {}) {
  if (!sourcePlacement || (side !== 'left' && side !== 'right')) return null;
  const sourceWidth = Number(sourceWidthCm);
  const insertedWidth = Number(insertedWidthCm);
  const sourceX = Number(sourcePlacement.xCm);
  const sourceY = Number(sourcePlacement.yCm);
  if (
    ![sourceWidth, insertedWidth, sourceX, sourceY].every(Number.isFinite)
    || sourceWidth <= 0
    || insertedWidth <= 0
  ) return null;

  const rotationZDeg = normalizeModuleRotationZDeg(sourcePlacement.rotationZDeg);
  const rightDirection = getVisualRightAxisDirection(rotationZDeg);
  const direction = rightDirection.sign * (side === 'right' ? 1 : -1);
  let xCm = sourceX;
  let yCm = sourceY;

  if (rightDirection.axis === 'x') {
    xCm = direction > 0 ? sourceX + sourceWidth : sourceX - insertedWidth;
  } else {
    yCm = direction > 0 ? sourceY + sourceWidth : sourceY - insertedWidth;
  }

  return createModulePlacement({
    xCm,
    yCm,
    zCm: sourcePlacement.zCm ?? 0,
    rotationZDeg,
    wallId: 'free',
  });
}

export function planFreeSideInsertion({
  modules = [],
  insertedModules = [],
  targetModuleId,
  side = 'right',
  standType,
  standXCm,
  standYCm,
} = {}) {
  if (side !== 'left' && side !== 'right') {
    return { ok: false, message: 'Ekleme yönü geçersiz.' };
  }
  const sourceModule = modules.find((module) => module?.id === targetModuleId);
  if (!sourceModule?.placement || sourceModule.placement.wallId !== 'free') {
    return { ok: false, message: 'Hedef modül serbest yerleşimde değil.' };
  }
  if (!insertedModules.length) {
    return { ok: false, message: 'Eklenecek modül bulunamadı.' };
  }

  // insertedModules görsel soldan sağa seçim sırasıdır. Sol tarafa eklerken
  // hedefe en yakın modül listenin sonundaki olacağı için fiziksel planı tersten kurarız.
  const physicalOrder = side === 'left'
    ? [...insertedModules].reverse()
    : [...insertedModules];
  const placements = new Map();
  const plannedModules = [];
  let anchorPlacement = sourceModule.placement;
  let anchorWidthCm = Number(sourceModule.widthCm);

  for (const module of physicalOrder) {
    const nextPlacement = createFreeSidePlacement({
      sourcePlacement: anchorPlacement,
      sourceWidthCm: anchorWidthCm,
      insertedWidthCm: module.widthCm,
      side,
    });
    if (!nextPlacement) {
      return { ok: false, message: 'Serbest komşu yerleşimi hesaplanamadı.' };
    }

    const validation = validatePlacementAgainstModules({
      placement: nextPlacement,
      widthCm: module.widthCm,
      moduleId: module.id,
      modules: [...modules, ...plannedModules],
      standType,
      standXCm,
      standYCm,
    });
    if (!validation.ok) return validation;

    placements.set(module.id, nextPlacement);
    plannedModules.push({ ...module, placement: nextPlacement });
    anchorPlacement = nextPlacement;
    anchorWidthCm = Number(module.widthCm);
  }

  return {
    ok: true,
    placements,
    insertedModuleIds: insertedModules.map((module) => module.id),
  };
}
`;
}
fs.writeFileSync(placementPath, placement);

// 2) Route context-menu add/duplicate for free modules through spatial validation.
const mainPath = 'src/main.js';
let main = fs.readFileSync(mainPath, 'utf8');
main = replaceOnce(
  main,
  "  getWallUsedCm,\n  validatePlacementAgainstModules,\n} from './modulePlacement.js';",
  "  getWallUsedCm,\n  planFreeSideInsertion,\n  validatePlacementAgainstModules,\n} from './modulePlacement.js';",
  'main placement import',
);

main = replaceOnce(
  main,
  "function applyContinuousInsertionPlan(plan, insertedModules) {",
  `function planContextFreeInsertion(insertedModules, context, side) {
  if (!currentStand) return { ok: false, message: 'Önce stand alanını oluştur.' };
  const index = findContextModuleIndex(context);
  if (index < 0 || index >= currentModules.length) {
    return { ok: false, message: 'Hedef modül bulunamadı.' };
  }

  const sourceModule = currentModules[index];
  return planFreeSideInsertion({
    modules: currentModules,
    insertedModules,
    targetModuleId: sourceModule.id,
    side,
    standType: currentStand.standType,
    standXCm: currentStand.xCm,
    standYCm: currentStand.yCm,
  });
}

function applyFreeInsertionPlan(plan, insertedModules, context, side) {
  const index = findContextModuleIndex(context);
  if (index < 0 || index >= currentModules.length) return false;

  plan.placements?.forEach((nextPlacement, moduleId) => {
    const module = insertedModules.find((candidate) => candidate.id === moduleId);
    if (module) module.placement = { ...nextPlacement };
  });

  const insertIndex = side === 'left' ? index : index + 1;
  currentModules.splice(insertIndex, 0, ...insertedModules);
  return true;
}

function isFreeContextInsertion(context) {
  const index = findContextModuleIndex(context);
  return index >= 0 && currentModules[index]?.placement?.wallId === 'free';
}

function applyContinuousInsertionPlan(plan, insertedModules) {`,
  'free insertion helpers',
);

main = replaceOnce(
  main,
  `  const capacity = validateCurrentAxisCapacity(
    'x',
    duplicate.widthCm,
    getWallUsedCm(currentModules, 'back'),
    { popupTitle: 'Modül çoğaltılamadı' },
  );
  if (!capacity.ok) return;

  const insertIndex = side === 'left' ? index : index + 1;
  currentModules.splice(insertIndex, 0, duplicate);
  rebuildWall({ resetView: false });`,
  `  const plan = planContextFreeInsertion([duplicate], context, side);
  if (!plan.ok) {
    renderWallResult(plan.message, true);
    window.alert(\`Modül çoğaltılamadı\\n\\n\${plan.message}\`);
    return;
  }

  applyFreeInsertionPlan(plan, [duplicate], context, side);
  rebuildWall({ resetView: false });`,
  'free duplicate capacity branch',
);

main = replaceOnce(
  main,
  `  if (placement === 'left' || placement === 'right') {
    moduleStates = [...moduleStates].reverse();
  }

  const plan = planContextContinuousInsertion(moduleStates, context, placement);`,
  `  if ((placement === 'left' || placement === 'right') && isFreeContextInsertion(context)) {
    // Picker sağ eklemede gönderim sırasını ters çevirir; burada tekrar görsel
    // seçim sırasına döndürüp serbest komşu planına veriyoruz.
    const visualOrderedStates = placement === 'right'
      ? [...moduleStates].reverse()
      : moduleStates;
    const plan = planContextFreeInsertion(visualOrderedStates, context, placement);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(\`Modüller eklenemedi\\n\\n\${plan.message}\`);
    }
    return plan;
  }

  if (placement === 'left' || placement === 'right') {
    moduleStates = [...moduleStates].reverse();
  }

  const plan = planContextContinuousInsertion(moduleStates, context, placement);`,
  'free batch validation',
);

main = replaceOnce(
  main,
  `  if ((placementMode === 'left' || placementMode === 'right') && context) {
    moduleStates = [...moduleStates].reverse();
    const plan = planContextContinuousInsertion(moduleStates, context, placementMode);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(\`Modüller eklenemedi\\n\\n\${plan.message}\`);
      return;
    }

    applyContinuousInsertionPlan(plan, moduleStates);
    rebuildWall({ resetView: false });
    return;
  }`,
  `  if ((placementMode === 'left' || placementMode === 'right') && context) {
    if (isFreeContextInsertion(context)) {
      const visualOrderedStates = placementMode === 'right'
        ? [...moduleStates].reverse()
        : moduleStates;
      const plan = planContextFreeInsertion(visualOrderedStates, context, placementMode);
      if (!plan.ok) {
        renderWallResult(plan.message, true);
        window.alert(\`Modüller eklenemedi\\n\\n\${plan.message}\`);
        return;
      }

      applyFreeInsertionPlan(plan, visualOrderedStates, context, placementMode);
      rebuildWall({ resetView: false });
      return;
    }

    moduleStates = [...moduleStates].reverse();
    const plan = planContextContinuousInsertion(moduleStates, context, placementMode);
    if (!plan.ok) {
      renderWallResult(plan.message, true);
      window.alert(\`Modüller eklenemedi\\n\\n\${plan.message}\`);
      return;
    }

    applyContinuousInsertionPlan(plan, moduleStates);
    rebuildWall({ resetView: false });
    return;
  }`,
  'free batch flush',
);
fs.writeFileSync(mainPath, main);

// 3) Regression tests for free side semantics, all four rotations, boundaries and collision.
const testPath = 'test/modulePlacement.test.js';
let test = fs.readFileSync(testPath, 'utf8');
test = replaceOnce(
  test,
  "  normalizeModuleRotationZDeg,\n  rotateModuleRotationZDeg,",
  "  normalizeModuleRotationZDeg,\n  planFreeSideInsertion,\n  rotateModuleRotationZDeg,",
  'module placement test import',
);
if (!test.includes("plans free context insertion without wall capacity")) {
  test += `

test('plans free context insertion without wall capacity', () => {
  const source = {
    id: 'source',
    widthCm: 100,
    placement: { xCm: 300, yCm: 300, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const inserted = [{ id: 'new-1', widthCm: 200 }];
  const result = planFreeSideInsertion({
    modules: [source],
    insertedModules: inserted,
    targetModuleId: source.id,
    side: 'right',
    standType: 'u-stand',
    standXCm: 1000,
    standYCm: 1000,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.placements.get('new-1'), {
    xCm: 400,
    yCm: 300,
    zCm: 0,
    rotationZDeg: 0,
    wallId: 'free',
  });
});

test('free context visual right follows all four module rotations', () => {
  const cases = [
    [0, 300, 400],
    [90, 300, 200],
    [180, 200, 300],
    [270, 300, 400],
  ];

  cases.forEach(([rotationZDeg, expectedAxisValue, expectedOtherValue]) => {
    const source = {
      id: 'source-' + rotationZDeg,
      widthCm: 100,
      placement: { xCm: 300, yCm: 300, zCm: 0, rotationZDeg, wallId: 'free' },
    };
    const inserted = [{ id: 'new-' + rotationZDeg, widthCm: 100 }];
    const result = planFreeSideInsertion({
      modules: [source],
      insertedModules: inserted,
      targetModuleId: source.id,
      side: 'right',
      standType: 'island',
      standXCm: 1000,
      standYCm: 1000,
    });
    assert.equal(result.ok, true);
    const next = result.placements.get(inserted[0].id);
    if (rotationZDeg === 0 || rotationZDeg === 180) {
      assert.equal(next.xCm, expectedAxisValue);
      assert.equal(next.yCm, expectedOtherValue);
    } else {
      assert.equal(next.yCm, expectedAxisValue);
      assert.equal(next.xCm, expectedOtherValue);
    }
  });
});

test('free left batch keeps visual order while placing nearest module last in the selection', () => {
  const source = {
    id: 'source',
    widthCm: 100,
    placement: { xCm: 500, yCm: 300, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const inserted = [
    { id: 'a', widthCm: 50 },
    { id: 'b', widthCm: 100 },
  ];
  const result = planFreeSideInsertion({
    modules: [source],
    insertedModules: inserted,
    targetModuleId: source.id,
    side: 'left',
    standType: 'island',
    standXCm: 1000,
    standYCm: 1000,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.get('a').xCm, 350);
  assert.equal(result.placements.get('b').xCm, 400);
});

test('free context insertion rejects stand overflow and real collision', () => {
  const edgeSource = {
    id: 'edge-source',
    widthCm: 100,
    placement: { xCm: 0, yCm: 300, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const overflow = planFreeSideInsertion({
    modules: [edgeSource],
    insertedModules: [{ id: 'outside', widthCm: 100 }],
    targetModuleId: edgeSource.id,
    side: 'left',
    standType: 'island',
    standXCm: 1000,
    standYCm: 1000,
  });
  assert.equal(overflow.ok, false);
  assert.match(overflow.message, /stand alanını aşıyor/i);

  const source = {
    id: 'source',
    widthCm: 100,
    placement: { xCm: 300, yCm: 300, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const blocker = {
    id: 'blocker',
    widthCm: 100,
    placement: { xCm: 400, yCm: 300, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  };
  const collision = planFreeSideInsertion({
    modules: [source, blocker],
    insertedModules: [{ id: 'blocked', widthCm: 100 }],
    targetModuleId: source.id,
    side: 'right',
    standType: 'island',
    standXCm: 1000,
    standYCm: 1000,
  });
  assert.equal(collision.ok, false);
  assert.match(collision.message, /çakışıyor/i);
});
`;
}
fs.writeFileSync(testPath, test);

// 4) Mark Issue #1 fixed in the roadmap; final regression remains the only closing step.
const roadmapPath = 'ROADMAP.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
  '- **Issue #1 — EN SON:** serbest alandaki modül sıralarında Ekle/Çoğalt Sağ/Sol işlemlerinin yanlışlıkla duvar kapasitesi kontrolüne girmesi.\n- Issue #1 sonrası final regresyon ve FAZ 2 kapanış kararı.',
  '- ✅ **Issue #1:** serbest alandaki modül sıralarında Ekle/Çoğalt Sağ/Sol artık duvar kapasitesi yerine komşu konum + X/Y sınırı + collision ile doğrulanır.\n- Final regresyon ve FAZ 2 kapanış kararı.',
);
fs.writeFileSync(roadmapPath, roadmap);
