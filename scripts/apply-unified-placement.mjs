import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return `${source.slice(0, index)}${replacement}${source.slice(index + needle.length)}`;
}

// scene3d.js
{
  const file = 'src/scene3d.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  function previewCatalogModuleDrag(moduleState, clientX, clientY) {\n    if (!stageLayout || !moduleState) {\n      disposePlacementGhost();\n      return { ok: false, message: 'Önce stand alanını oluştur.' };\n    }\n\n    if (stageLayout.standType === 'island') {\n      disposePlacementGhost();\n      return { ok: false, message: 'Ada Stand serbest yerleşimi sonraki adımda eklenecek.' };\n    }\n`,
    `  function previewCatalogModuleDrag(\n    moduleState,\n    clientX,\n    clientY,\n    preferredRotationZDeg = 0,\n    rotationLocked = false,\n  ) {\n    if (!stageLayout || !moduleState) {\n      disposePlacementGhost();\n      return { ok: false, message: 'Önce stand alanını oluştur.' };\n    }\n`,
    'catalog preview signature',
  );

  source = replaceOnce(
    source,
    `      preferredRotationZDeg: 0,\n    });\n\n    if (!snapped.ok || !snapped.placement) {`,
    `      preferredRotationZDeg,\n      rotationLocked,\n    });\n\n    if (!snapped.ok || !snapped.placement) {`,
    'catalog snap rotation',
  );

  source = replaceOnce(
    source,
    `    const plan = planContinuousModuleInsert({\n      modules: getRenderedModuleStates(),\n      insertedModule: moduleState,\n      desiredPlacement: snapped.placement,\n      standType: stageLayout.standType,\n      standXCm: stageLayout.widthCm,\n      standYCm: stageLayout.depthCm,\n    });\n`,
    `    let plan;\n    if (snapped.placement.wallId === 'free') {\n      const validation = validatePlacementAgainstModules({\n        placement: snapped.placement,\n        widthCm: moduleState.widthCm,\n        moduleId: moduleState.id,\n        modules: getRenderedModuleStates(),\n        standType: stageLayout.standType,\n        standXCm: stageLayout.widthCm,\n        standYCm: stageLayout.depthCm,\n      });\n      plan = {\n        ok: validation.ok,\n        message: validation.message ?? null,\n        movingPlacement: { ...snapped.placement },\n        placements: validation.ok\n          ? new Map([[moduleState.id, { ...snapped.placement }]])\n          : new Map(),\n      };\n    } else {\n      plan = planContinuousModuleInsert({\n        modules: getRenderedModuleStates(),\n        insertedModule: moduleState,\n        desiredPlacement: snapped.placement,\n        standType: stageLayout.standType,\n        standXCm: stageLayout.widthCm,\n        standYCm: stageLayout.depthCm,\n      });\n    }\n`,
    'catalog free plan',
  );

  source = replaceOnce(
    source,
    `  function dropCatalogModuleDrag(moduleState, clientX, clientY) {\n    const result = previewCatalogModuleDrag(moduleState, clientX, clientY);`,
    `  function dropCatalogModuleDrag(\n    moduleState,\n    clientX,\n    clientY,\n    preferredRotationZDeg = 0,\n    rotationLocked = false,\n  ) {\n    const result = previewCatalogModuleDrag(\n      moduleState,\n      clientX,\n      clientY,\n      preferredRotationZDeg,\n      rotationLocked,\n    );`,
    'catalog drop rotation',
  );

  source = replaceOnce(
    source,
    `    dragSession.dragging = true;\n    dragSession.moduleGroup.visible = false;\n    updateDragBadge(dragSession.moduleState, event.clientX, event.clientY);\n`,
    `    dragSession.dragging = true;\n    dragSession.lastClientX = event.clientX;\n    dragSession.lastClientY = event.clientY;\n    dragSession.moduleGroup.visible = false;\n    updateDragBadge(dragSession.moduleState, event.clientX, event.clientY);\n`,
    'drag pointer state',
  );

  source = replaceOnce(
    source,
    `      preferredRotationZDeg: moduleState.placement?.rotationZDeg ?? 0,\n    });`,
    `      preferredRotationZDeg: dragSession.preferredRotationZDeg,\n      rotationLocked: dragSession.rotationLocked,\n    });`,
    'existing drag rotation snap',
  );

  source = replaceOnce(
    source,
    `    let plan;\n    if (stageLayout.standType === 'island') {\n      const validation = validatePlacementAgainstModules({\n        placement: snapped.placement,\n        widthCm: moduleState.widthCm,\n        moduleId: moduleState.id,\n        modules: getRenderedModuleStates(),\n        standType: stageLayout.standType,\n        standXCm: stageLayout.widthCm,\n        standYCm: stageLayout.depthCm,\n      });\n      plan = {\n        ok: validation.ok,\n        message: validation.message ?? null,\n        movingPlacement: { ...snapped.placement },\n        placements: validation.ok\n          ? new Map([[moduleState.id, { ...snapped.placement }]])\n          : new Map(),\n      };\n    } else {\n      plan = planContinuousModuleMove({\n        modules: getRenderedModuleStates(),\n        movingModuleId: moduleState.id,\n        desiredPlacement: snapped.placement,\n        standType: stageLayout.standType,\n        standXCm: stageLayout.widthCm,\n        standYCm: stageLayout.depthCm,\n      });\n    }\n`,
    `    let plan;\n    if (snapped.placement.wallId === 'free') {\n      const validation = validatePlacementAgainstModules({\n        placement: snapped.placement,\n        widthCm: moduleState.widthCm,\n        moduleId: moduleState.id,\n        modules: getRenderedModuleStates(),\n        standType: stageLayout.standType,\n        standXCm: stageLayout.widthCm,\n        standYCm: stageLayout.depthCm,\n      });\n      plan = {\n        ok: validation.ok,\n        message: validation.message ?? null,\n        movingPlacement: { ...snapped.placement },\n        placements: validation.ok\n          ? new Map([[moduleState.id, { ...snapped.placement }]])\n          : new Map(),\n      };\n    } else {\n      plan = planContinuousModuleMove({\n        modules: getRenderedModuleStates(),\n        movingModuleId: moduleState.id,\n        desiredPlacement: snapped.placement,\n        standType: stageLayout.standType,\n        standXCm: stageLayout.widthCm,\n        standYCm: stageLayout.depthCm,\n      });\n    }\n`,
    'existing free plan',
  );

  source = replaceOnce(
    source,
    `      moduleState,\n      dragging: false,\n      preview: null,\n    };`,
    `      moduleState,\n      dragging: false,\n      preview: null,\n      preferredRotationZDeg: moduleState.placement?.rotationZDeg === 90 ? 90 : 0,\n      rotationLocked: false,\n      lastClientX: event.clientX,\n      lastClientY: event.clientY,\n    };`,
    'drag session rotation',
  );

  source = replaceOnce(
    source,
    `  renderer.domElement.addEventListener('pointermove', (event) => {\n    if (!dragSession || event.pointerId !== dragSession.pointerId) return;\n    updatePlacementDrag(event);\n  });\n\n  renderer.domElement.addEventListener('pointerup', (event) => {`,
    `  renderer.domElement.addEventListener('pointermove', (event) => {\n    if (!dragSession || event.pointerId !== dragSession.pointerId) return;\n    updatePlacementDrag(event);\n  });\n\n  window.addEventListener('keydown', (event) => {\n    if (!dragSession?.dragging || String(event.key).toLowerCase() !== 'r') return;\n    event.preventDefault();\n    dragSession.preferredRotationZDeg = dragSession.preferredRotationZDeg === 90 ? 0 : 90;\n    dragSession.rotationLocked = true;\n    updatePlacementDrag({\n      clientX: dragSession.lastClientX,\n      clientY: dragSession.lastClientY,\n    });\n  });\n\n  renderer.domElement.addEventListener('pointerup', (event) => {`,
    'existing drag R key',
  );

  fs.writeFileSync(file, source);
}

// main.js
{
  const file = 'src/main.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  moduleDragSidebar?.setEnabled(\n    Boolean(enabled && currentStand && currentStand.standType !== 'island'),\n  );`,
    `  moduleDragSidebar?.setEnabled(Boolean(enabled && currentStand));`,
    'enable sidebar for all stands',
  );

  source = replaceOnce(
    source,
    `  canDrag: () => Boolean(currentStand && currentStand.standType !== 'island'),\n  createModuleState: (module) => createCatalogModuleState(module),\n  onPreview: (moduleState, clientX, clientY) => (\n    scene3d.previewCatalogModuleDrag(moduleState, clientX, clientY)\n  ),\n  onDrop: (moduleState, clientX, clientY) => {\n    const result = scene3d.dropCatalogModuleDrag(moduleState, clientX, clientY);`,
    `  canDrag: () => Boolean(currentStand),\n  createModuleState: (module) => createCatalogModuleState(module),\n  onPreview: (moduleState, clientX, clientY, rotationZDeg, rotationLocked) => (\n    scene3d.previewCatalogModuleDrag(\n      moduleState,\n      clientX,\n      clientY,\n      rotationZDeg,\n      rotationLocked,\n    )\n  ),\n  onDrop: (moduleState, clientX, clientY, rotationZDeg, rotationLocked) => {\n    const result = scene3d.dropCatalogModuleDrag(\n      moduleState,\n      clientX,\n      clientY,\n      rotationZDeg,\n      rotationLocked,\n    );`,
    'sidebar callbacks',
  );

  source = replaceOnce(
    source,
    `  if (sourceModule.placement && currentStand?.standType !== 'island') {`,
    `  if (sourceModule.placement && sourceModule.placement.wallId !== 'free') {`,
    'free duplicate avoids wall reflow',
  );

  fs.writeFileSync(file, source);
}

// module placement tests
{
  const file = 'test/modulePlacement.test.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  assert.deepEqual(getAllowedWallIds('l-left'), ['back', 'left']);\n  assert.deepEqual(getAllowedWallIds('l-right'), ['back', 'right']);\n  assert.deepEqual(getAllowedWallIds('u-stand'), ['back', 'left', 'right']);`,
    `  assert.deepEqual(getAllowedWallIds('l-left'), ['back', 'left', 'free']);\n  assert.deepEqual(getAllowedWallIds('l-right'), ['back', 'right', 'free']);\n  assert.deepEqual(getAllowedWallIds('u-stand'), ['back', 'left', 'right', 'free']);\n  assert.deepEqual(getAllowedWallIds('island'), ['free']);`,
    'allowed free placement tests',
  );

  source += `\n\ntest('snaps a module inside every stand to the 50 cm free grid', () => {\n  const result = snapPlacementToStand({\n    standType: 'back-wall',\n    widthCm: 100,\n    pointerXCm: 375,\n    pointerYCm: 275,\n    standXCm: 800,\n    standYCm: 600,\n  });\n\n  assert.equal(result.ok, true);\n  assert.equal(result.mode, 'free');\n  assert.deepEqual(result.placement, {\n    xCm: 300,\n    yCm: 300,\n    zCm: 0,\n    rotationZDeg: 0,\n    wallId: 'free',\n  });\n});\n\ntest('rotation lock keeps a perpendicular return free instead of snapping it onto the back wall', () => {\n  const result = snapPlacementToStand({\n    standType: 'u-stand',\n    widthCm: 100,\n    pointerXCm: 300,\n    pointerYCm: 20,\n    standXCm: 800,\n    standYCm: 600,\n    preferredRotationZDeg: 90,\n    rotationLocked: true,\n  });\n\n  assert.equal(result.ok, true);\n  assert.equal(result.placement.wallId, 'free');\n  assert.equal(result.placement.rotationZDeg, 90);\n  assert.equal(result.placement.xCm, 300);\n});\n\ntest('free parallel walls may overlap in axis range when they are on different grid lines', () => {\n  const modules = [{\n    id: 'a',\n    widthCm: 200,\n    placement: { xCm: 100, yCm: 100, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n  }];\n  const result = validatePlacementAgainstModules({\n    moduleId: 'b',\n    widthCm: 200,\n    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n    modules,\n    standType: 'back-wall',\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(result.ok, true);\n});\n\ntest('free L and T joins are allowed but a plus crossing is rejected', () => {\n  const horizontal = {\n    id: 'horizontal',\n    widthCm: 300,\n    placement: { xCm: 100, yCm: 200, zCm: 0, rotationZDeg: 0, wallId: 'free' },\n  };\n\n  const tJoin = validatePlacementAgainstModules({\n    moduleId: 't',\n    widthCm: 100,\n    placement: { xCm: 250, yCm: 100, zCm: 0, rotationZDeg: 90, wallId: 'free' },\n    modules: [horizontal],\n    standType: 'u-stand',\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(tJoin.ok, true);\n\n  const plusCross = validatePlacementAgainstModules({\n    moduleId: 'plus',\n    widthCm: 300,\n    placement: { xCm: 250, yCm: 100, zCm: 0, rotationZDeg: 90, wallId: 'free' },\n    modules: [horizontal],\n    standType: 'u-stand',\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(plusCross.ok, false);\n});\n`;

  fs.writeFileSync(file, source);
}
