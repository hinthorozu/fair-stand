import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

function insertBeforeOnce(source, needle, addition, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Insert target not found: ${label}`);
  return source.slice(0, index) + addition + source.slice(index);
}

// --- modulePlacement.js ---
const placementPath = 'src/modulePlacement.js';
let placement = fs.readFileSync(placementPath, 'utf8');

placement = replaceOnce(
  placement,
  'export const MODULE_WALL_SNAP_DISTANCE_CM = 50;\n',
  'export const MODULE_WALL_SNAP_DISTANCE_CM = 50;\nexport const MODULE_NEIGHBOR_SNAP_DISTANCE_CM = 30;\n',
  'neighbor snap constant',
);

const magneticSnapCode = `function getPlacementCenter(placement, widthCm) {
  const width = Number(widthCm);
  const x = Number(placement?.xCm);
  const y = Number(placement?.yCm);
  if (![width, x, y].every(Number.isFinite) || width <= 0) return null;
  const vertical = isVerticalModuleRotation(placement.rotationZDeg);
  return {
    xCm: x + (vertical ? 0 : width / 2),
    yCm: y + (vertical ? width / 2 : 0),
  };
}

function inferPlacementWallId({ placement, standType, standXCm } = {}) {
  if (!placement) return 'free';
  const allowedWalls = getAllowedWallIds(standType);
  const vertical = isVerticalModuleRotation(placement.rotationZDeg);
  const xCm = Number(placement.xCm);
  const yCm = Number(placement.yCm);
  const xLimit = Number(standXCm);

  if (!vertical && nearlyEqual(yCm, 0) && allowedWalls.includes('back')) return 'back';
  if (vertical && nearlyEqual(xCm, 0) && allowedWalls.includes('left')) return 'left';
  if (vertical && nearlyEqual(xCm, xLimit) && allowedWalls.includes('right')) return 'right';
  return 'free';
}

function getSegmentSnapCoordinates(segment) {
  const coordinates = [];
  for (
    let coordinate = segment.startCm;
    coordinate <= segment.endCm + EPSILON_CM;
    coordinate += MODULE_PLACEMENT_SNAP_CM
  ) {
    coordinates.push(Math.min(coordinate, segment.endCm));
  }
  if (!coordinates.some((coordinate) => nearlyEqual(coordinate, segment.endCm))) {
    coordinates.push(segment.endCm);
  }
  return coordinates;
}

function createEndpointConnectionPlacement({
  axis,
  pointXCm,
  pointYCm,
  widthCm,
  rotationZDeg,
  movingEndpoint,
  standType,
  standXCm,
}) {
  const width = Number(widthCm);
  const placement = createModulePlacement({
    xCm: axis === 'x'
      ? pointXCm - (movingEndpoint === 'end' ? width : 0)
      : pointXCm,
    yCm: axis === 'y'
      ? pointYCm - (movingEndpoint === 'end' ? width : 0)
      : pointYCm,
    zCm: 0,
    rotationZDeg,
    wallId: 'free',
  });
  placement.wallId = inferPlacementWallId({ placement, standType, standXCm });
  return placement;
}

export function snapPlacementToModules({
  moduleId = null,
  widthCm,
  pointerXCm,
  pointerYCm,
  rotationZDeg = 0,
  modules = [],
  standType,
  standXCm,
  standYCm,
  snapDistanceCm = MODULE_NEIGHBOR_SNAP_DISTANCE_CM,
} = {}) {
  const width = Number(widthCm);
  const pointerX = Number(pointerXCm);
  const pointerY = Number(pointerYCm);
  const threshold = Number(snapDistanceCm);
  if (
    ![width, pointerX, pointerY, threshold].every(Number.isFinite)
    || width <= 0
    || threshold < 0
  ) return null;

  const resolvedRotation = normalizeModuleRotationZDeg(rotationZDeg);
  const movingAxis = isVerticalModuleRotation(resolvedRotation) ? 'y' : 'x';
  const candidates = [];

  const addCandidate = (placement, targetModuleId, snapKind, priority = 0) => {
    const center = getPlacementCenter(placement, width);
    if (!center) return;
    const distanceCm = Math.hypot(center.xCm - pointerX, center.yCm - pointerY);
    if (distanceCm > threshold + EPSILON_CM) return;

    const validation = validatePlacementAgainstModules({
      placement,
      widthCm: width,
      moduleId,
      modules,
      standType,
      standXCm,
      standYCm,
    });
    if (!validation.ok) return;

    candidates.push({
      placement,
      targetModuleId,
      snapKind,
      priority,
      distanceCm,
    });
  };

  modules.forEach((targetModule) => {
    if (!targetModule?.placement || targetModule.id === moduleId) return;
    const target = getGroundSegment(targetModule);
    if (!target) return;

    if (target.axis === movingAxis) {
      // Aynı doğrultuda yalnızca gerçek uç-uca bağlantı üret.
      if (movingAxis === 'x') {
        addCandidate(createEndpointConnectionPlacement({
          axis: 'x', pointXCm: target.endCm, pointYCm: target.fixedCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'start',
          standType, standXCm,
        }), targetModule.id, 'end-to-end', 0);
        addCandidate(createEndpointConnectionPlacement({
          axis: 'x', pointXCm: target.startCm, pointYCm: target.fixedCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'end',
          standType, standXCm,
        }), targetModule.id, 'end-to-end', 0);
      } else {
        addCandidate(createEndpointConnectionPlacement({
          axis: 'y', pointXCm: target.fixedCm, pointYCm: target.endCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'start',
          standType, standXCm,
        }), targetModule.id, 'end-to-end', 0);
        addCandidate(createEndpointConnectionPlacement({
          axis: 'y', pointXCm: target.fixedCm, pointYCm: target.startCm,
          widthCm: width, rotationZDeg: resolvedRotation, movingEndpoint: 'end',
          standType, standXCm,
        }), targetModule.id, 'end-to-end', 0);
      }
      return;
    }

    // Dik modül: hedef modül boyunca her 50 cm bağlantı noktasını aday yap.
    // Hedefin ucundaki bağlantı L, gövde üzerindeki bağlantı T olur.
    getSegmentSnapCoordinates(target).forEach((coordinateCm) => {
      const pointXCm = target.axis === 'x' ? coordinateCm : target.fixedCm;
      const pointYCm = target.axis === 'y' ? coordinateCm : target.fixedCm;
      const targetEndpoint = nearlyEqual(coordinateCm, target.startCm)
        || nearlyEqual(coordinateCm, target.endCm);
      const snapKind = targetEndpoint ? 'corner' : 'tee';
      const priority = targetEndpoint ? 1 : 2;

      addCandidate(createEndpointConnectionPlacement({
        axis: movingAxis,
        pointXCm,
        pointYCm,
        widthCm: width,
        rotationZDeg: resolvedRotation,
        movingEndpoint: 'start',
        standType,
        standXCm,
      }), targetModule.id, snapKind, priority);

      addCandidate(createEndpointConnectionPlacement({
        axis: movingAxis,
        pointXCm,
        pointYCm,
        widthCm: width,
        rotationZDeg: resolvedRotation,
        movingEndpoint: 'end',
        standType,
        standXCm,
      }), targetModule.id, snapKind, priority);
    });
  });

  if (!candidates.length) return null;
  candidates.sort((a, b) => (
    a.distanceCm - b.distanceCm
    || a.priority - b.priority
    || String(a.targetModuleId).localeCompare(String(b.targetModuleId))
  ));

  const best = candidates[0];
  return {
    ok: true,
    mode: 'module-snap',
    placement: { ...best.placement },
    targetModuleId: best.targetModuleId,
    snapKind: best.snapKind,
    distanceCm: best.distanceCm,
  };
}

`;

placement = insertBeforeOnce(
  placement,
  'function createFreePlacement({\n',
  magneticSnapCode,
  'magnetic module snap helpers',
);
fs.writeFileSync(placementPath, placement);

// --- scene3d.js ---
const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

scene = replaceOnce(
  scene,
  '  snapPlacementToStand,\n  validatePlacementAgainstModules,\n',
  '  snapPlacementToStand,\n  snapPlacementToModules,\n  validatePlacementAgainstModules,\n',
  'scene magnetic snap import',
);

const catalogOld = `    let plan;
    if (snapped.placement.wallId === 'free') {
      const validation = validatePlacementAgainstModules({
        placement: snapped.placement,
        widthCm: moduleState.widthCm,
        moduleId: moduleState.id,
        modules: getRenderedModuleStates(),
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
      plan = {
        ok: validation.ok,
        message: validation.message ?? null,
        movingPlacement: { ...snapped.placement },
        placements: validation.ok
          ? new Map([[moduleState.id, { ...snapped.placement }]])
          : new Map(),
      };
    } else {
      plan = planContinuousModuleInsert({
        modules: getRenderedModuleStates(),
        insertedModule: moduleState,
        desiredPlacement: snapped.placement,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
    }

    const previewPlacement = plan.ok && plan.movingPlacement
      ? plan.movingPlacement
      : snapped.placement;
    showPlacementGhost(moduleState.widthCm, previewPlacement, plan.ok);
    return {
      ok: plan.ok,
      placement: { ...previewPlacement },
      message: plan.message ?? null,
      plan,
    };
`;

const catalogNew = `    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
      moduleId: moduleState.id,
      widthCm: moduleState.widthCm,
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      rotationZDeg: preferredRotationZDeg,
      modules: renderedModules,
      standType: stageLayout.standType,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
    });
    const desiredPlacement = magneticSnap?.placement ?? snapped.placement;

    let plan;
    if (desiredPlacement.wallId === 'free') {
      const validation = validatePlacementAgainstModules({
        placement: desiredPlacement,
        widthCm: moduleState.widthCm,
        moduleId: moduleState.id,
        modules: renderedModules,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
      plan = {
        ok: validation.ok,
        message: validation.message ?? null,
        movingPlacement: { ...desiredPlacement },
        placements: validation.ok
          ? new Map([[moduleState.id, { ...desiredPlacement }]])
          : new Map(),
      };
    } else {
      plan = planContinuousModuleInsert({
        modules: renderedModules,
        insertedModule: moduleState,
        desiredPlacement,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
    }

    const previewPlacement = plan.ok && plan.movingPlacement
      ? plan.movingPlacement
      : desiredPlacement;
    showPlacementGhost(moduleState.widthCm, previewPlacement, plan.ok);
    return {
      ok: plan.ok,
      placement: { ...previewPlacement },
      message: plan.message ?? null,
      plan,
      snap: magneticSnap ? {
        mode: magneticSnap.mode,
        targetModuleId: magneticSnap.targetModuleId,
        snapKind: magneticSnap.snapKind,
      } : null,
    };
`;
scene = replaceOnce(scene, catalogOld, catalogNew, 'catalog drag magnetic snap');

const existingOld = `    let plan;
    if (snapped.placement.wallId === 'free') {
      const validation = validatePlacementAgainstModules({
        placement: snapped.placement,
        widthCm: moduleState.widthCm,
        moduleId: moduleState.id,
        modules: getRenderedModuleStates(),
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
      plan = {
        ok: validation.ok,
        message: validation.message ?? null,
        movingPlacement: { ...snapped.placement },
        placements: validation.ok
          ? new Map([[moduleState.id, { ...snapped.placement }]])
          : new Map(),
      };
    } else {
      plan = planContinuousModuleMove({
        modules: getRenderedModuleStates(),
        movingModuleId: moduleState.id,
        desiredPlacement: snapped.placement,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
    }

    const previewPlacement = plan.ok && plan.movingPlacement
      ? plan.movingPlacement
      : snapped.placement;
    dragSession.preview = {
      placement: previewPlacement,
      valid: plan.ok,
      message: plan.message ?? null,
      plan,
    };
`;

const existingNew = `    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
      moduleId: moduleState.id,
      widthCm: moduleState.widthCm,
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      rotationZDeg: dragSession.preferredRotationZDeg,
      modules: renderedModules,
      standType: stageLayout.standType,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
    });
    const desiredPlacement = magneticSnap?.placement ?? snapped.placement;

    let plan;
    if (desiredPlacement.wallId === 'free') {
      const validation = validatePlacementAgainstModules({
        placement: desiredPlacement,
        widthCm: moduleState.widthCm,
        moduleId: moduleState.id,
        modules: renderedModules,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
      plan = {
        ok: validation.ok,
        message: validation.message ?? null,
        movingPlacement: { ...desiredPlacement },
        placements: validation.ok
          ? new Map([[moduleState.id, { ...desiredPlacement }]])
          : new Map(),
      };
    } else {
      plan = planContinuousModuleMove({
        modules: renderedModules,
        movingModuleId: moduleState.id,
        desiredPlacement,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
    }

    const previewPlacement = plan.ok && plan.movingPlacement
      ? plan.movingPlacement
      : desiredPlacement;
    dragSession.preview = {
      placement: previewPlacement,
      valid: plan.ok,
      message: plan.message ?? null,
      plan,
      snap: magneticSnap ? {
        mode: magneticSnap.mode,
        targetModuleId: magneticSnap.targetModuleId,
        snapKind: magneticSnap.snapKind,
      } : null,
    };
`;
scene = replaceOnce(scene, existingOld, existingNew, 'existing drag magnetic snap');
fs.writeFileSync(scenePath, scene);

// --- modulePlacement tests ---
const testPath = 'test/modulePlacement.test.js';
let tests = fs.readFileSync(testPath, 'utf8');
tests = replaceOnce(
  tests,
  '  snapPlacementToStand,\n  rotateModulePlacementAroundCenter,\n',
  '  snapPlacementToStand,\n  snapPlacementToModules,\n  rotateModulePlacementAroundCenter,\n',
  'test magnetic snap import',
);

tests += `

test('magnetic snap joins parallel modules end to end without changing rotation', () => {
  const modules = [{
    id: 'target',
    widthCm: 100,
    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  }];
  const result = snapPlacementToModules({
    moduleId: 'moving',
    widthCm: 100,
    pointerXCm: 247,
    pointerYCm: 202,
    rotationZDeg: 0,
    modules,
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });

  assert.equal(result?.snapKind, 'end-to-end');
  assert.deepEqual(result?.placement, {
    xCm: 200, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free',
  });
});

test('magnetic snap creates an L connection at a target endpoint', () => {
  const modules = [{
    id: 'target',
    widthCm: 200,
    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  }];
  const result = snapPlacementToModules({
    moduleId: 'moving',
    widthCm: 100,
    pointerXCm: 302,
    pointerYCm: 248,
    rotationZDeg: 90,
    modules,
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });

  assert.equal(result?.snapKind, 'corner');
  assert.deepEqual(result?.placement, {
    xCm: 300, yCm: 200, zCm: 0, rotationZDeg: 90, wallId: 'free',
  });
});

test('magnetic snap creates a T connection on a 50 cm point along target body', () => {
  const modules = [{
    id: 'target',
    widthCm: 300,
    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  }];
  const result = snapPlacementToModules({
    moduleId: 'moving',
    widthCm: 100,
    pointerXCm: 252,
    pointerYCm: 251,
    rotationZDeg: 90,
    modules,
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });

  assert.equal(result?.snapKind, 'tee');
  assert.deepEqual(result?.placement, {
    xCm: 250, yCm: 200, zCm: 0, rotationZDeg: 90, wallId: 'free',
  });
});

test('magnetic snap preserves 270 degree facing and ignores distant targets', () => {
  const modules = [{
    id: 'target',
    widthCm: 200,
    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },
  }];
  const snapped = snapPlacementToModules({
    moduleId: 'moving',
    widthCm: 100,
    pointerXCm: 300,
    pointerYCm: 250,
    rotationZDeg: 270,
    modules,
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(snapped?.placement.rotationZDeg, 270);

  const distant = snapPlacementToModules({
    moduleId: 'moving',
    widthCm: 100,
    pointerXCm: 700,
    pointerYCm: 500,
    rotationZDeg: 270,
    modules,
    standType: 'island',
    standXCm: 800,
    standYCm: 600,
  });
  assert.equal(distant, null);
});
`;
fs.writeFileSync(testPath, tests);
