import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return `${source.slice(0, index)}${replacement}${source.slice(index + needle.length)}`;
}

// modulePlacement.js
{
  const file = 'src/modulePlacement.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    "export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 90]);",
    "export const MODULE_PLACEMENT_ROTATIONS = Object.freeze([0, 90, 180, 270]);",
    'rotation constants',
  );

  source = replaceOnce(
    source,
    `function nearlyEqual(a, b) {\n  return Math.abs(Number(a) - Number(b)) <= EPSILON_CM;\n}\n`,
    `function nearlyEqual(a, b) {\n  return Math.abs(Number(a) - Number(b)) <= EPSILON_CM;\n}\n\nexport function normalizeModuleRotationZDeg(value) {\n  const number = Number(value);\n  if (!Number.isFinite(number)) return 0;\n  const quarterTurns = Math.round(number / 90);\n  return ((quarterTurns * 90) % 360 + 360) % 360;\n}\n\nexport function rotateModuleRotationZDeg(value, deltaDeg = 90) {\n  return normalizeModuleRotationZDeg(\n    normalizeModuleRotationZDeg(value) + Number(deltaDeg || 0),\n  );\n}\n\nexport function isVerticalModuleRotation(rotationZDeg) {\n  const rotation = normalizeModuleRotationZDeg(rotationZDeg);\n  return rotation === 90 || rotation === 270;\n}\n`,
    'rotation helpers',
  );

  source = replaceOnce(
    source,
    `    rotationZDeg: rotationZDeg === 90 ? 90 : 0,`,
    `    rotationZDeg: normalizeModuleRotationZDeg(rotationZDeg),`,
    'create placement rotation',
  );

  source = replaceOnce(
    source,
    `  const axis = getWallAxis(placement.wallId)\n    ?? (placement.rotationZDeg === 90 ? 'y' : 'x');`,
    `  const axis = getWallAxis(placement.wallId)\n    ?? (isVerticalModuleRotation(placement.rotationZDeg) ? 'y' : 'x');`,
    'placement interval axis',
  );

  source = replaceOnce(
    source,
    `  const rotation = placement.rotationZDeg === 90 ? 90 : 0;`,
    `  const rotation = normalizeModuleRotationZDeg(placement.rotationZDeg);`,
    'ground segment rotation',
  );

  source = replaceOnce(
    source,
    `  if (rotation === 90) {`,
    `  if (isVerticalModuleRotation(rotation)) {`,
    'ground segment vertical',
  );

  source = replaceOnce(
    source,
    `  const rotation = placement.rotationZDeg === 90 ? 90 : 0;\n  const x = Number(placement.xCm);`,
    `  const rotation = normalizeModuleRotationZDeg(placement.rotationZDeg);\n  const vertical = isVerticalModuleRotation(rotation);\n  const x = Number(placement.xCm);`,
    'validation rotation',
  );

  source = replaceOnce(
    source,
    `  if (placement.wallId === 'back') {\n    if (rotation !== 0 || y !== 0) return { ok: false, message: 'Sırt duvar modülü X yönünde olmalı.' };\n    if (x < 0 || x + width > xLimit) return { ok: false, message: 'Modül X stand sınırını aşıyor.' };\n  } else if (placement.wallId === 'left') {\n    if (rotation !== 90 || x !== 0) return { ok: false, message: 'Sol duvar modülü Y yönünde olmalı.' };\n    if (y < 0 || y + width > yLimit) return { ok: false, message: 'Modül Y stand sınırını aşıyor.' };\n  } else if (placement.wallId === 'right') {\n    if (rotation !== 90 || x !== xLimit) return { ok: false, message: 'Sağ duvar modülü Y yönünde olmalı.' };\n    if (y < 0 || y + width > yLimit) return { ok: false, message: 'Modül Y stand sınırını aşıyor.' };\n  } else {\n    const endX = x + (rotation === 0 ? width : 0);\n    const endY = y + (rotation === 90 ? width : 0);`,
    `  if (placement.wallId === 'back') {\n    if (vertical || y !== 0) return { ok: false, message: 'Sırt duvar modülü X yönünde olmalı.' };\n    if (x < 0 || x + width > xLimit) return { ok: false, message: 'Modül X stand sınırını aşıyor.' };\n  } else if (placement.wallId === 'left') {\n    if (!vertical || x !== 0) return { ok: false, message: 'Sol duvar modülü Y yönünde olmalı.' };\n    if (y < 0 || y + width > yLimit) return { ok: false, message: 'Modül Y stand sınırını aşıyor.' };\n  } else if (placement.wallId === 'right') {\n    if (!vertical || x !== xLimit) return { ok: false, message: 'Sağ duvar modülü Y yönünde olmalı.' };\n    if (y < 0 || y + width > yLimit) return { ok: false, message: 'Modül Y stand sınırını aşıyor.' };\n  } else {\n    const endX = x + (!vertical ? width : 0);\n    const endY = y + (vertical ? width : 0);`,
    'validation axes',
  );

  source = replaceOnce(
    source,
    `  const rotation = rotationZDeg === 90 ? 90 : 0;\n  const maxX = rotation === 0 ? xLimit - width : xLimit;\n  const maxY = rotation === 90 ? yLimit - width : yLimit;`,
    `  const rotation = normalizeModuleRotationZDeg(rotationZDeg);\n  const vertical = isVerticalModuleRotation(rotation);\n  const maxX = !vertical ? xLimit - width : xLimit;\n  const maxY = vertical ? yLimit - width : yLimit;`,
    'free placement rotation',
  );

  source = replaceOnce(
    source,
    `    xCm: rotation === 0\n      ? clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)\n      : clamp(snapCm(pointerXCm), 0, maxX),\n    yCm: rotation === 90\n      ? clamp(snapCm(Number(pointerYCm) - width / 2), 0, maxY)\n      : clamp(snapCm(pointerYCm), 0, maxY),`,
    `    xCm: !vertical\n      ? clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)\n      : clamp(snapCm(pointerXCm), 0, maxX),\n    yCm: vertical\n      ? clamp(snapCm(Number(pointerYCm) - width / 2), 0, maxY)\n      : clamp(snapCm(pointerYCm), 0, maxY),`,
    'free placement coordinates',
  );

  source = replaceOnce(
    source,
    `  const preferredRotation = preferredRotationZDeg === 90 ? 90 : 0;`,
    `  const preferredRotation = normalizeModuleRotationZDeg(preferredRotationZDeg);`,
    'preferred rotation',
  );

  source = replaceOnce(
    source,
    `  const boundaryCandidates = activeBoundaryWalls.map((wallId) => {\n    const wallRotation = wallId === 'back' ? 0 : 90;\n    if (rotationLocked && wallRotation !== preferredRotation) return null;`,
    `  const boundaryCandidates = activeBoundaryWalls.map((wallId) => {\n    const wallRotation = wallId === 'back' ? 0 : (wallId === 'left' ? 90 : 270);\n    const wallIsVertical = wallId !== 'back';\n    if (rotationLocked && wallIsVertical !== isVerticalModuleRotation(preferredRotation)) return null;\n    const resolvedRotation = rotationLocked ? preferredRotation : wallRotation;`,
    'boundary orientation',
  );

  source = replaceOnce(
    source,
    `          rotationZDeg: 0,\n          wallId,`,
    `          rotationZDeg: resolvedRotation,\n          wallId,`,
    'back boundary rotation',
  );

  source = replaceOnce(
    source,
    `        rotationZDeg: 90,\n        wallId,`,
    `        rotationZDeg: resolvedRotation,\n        wallId,`,
    'side boundary rotation',
  );

  fs.writeFileSync(file, source);
}

// wallReflow.js: right wall's real facing is 270° (left/inward), not an implicit -90 render trick.
{
  const file = 'src/wallReflow.js';
  let source = fs.readFileSync(file, 'utf8');
  source = replaceOnce(
    source,
    `  if (segment.wallId === 'right') {\n    return createModulePlacement({\n      xCm: Number(standXCm),\n      yCm: localStartCm,\n      zCm: 0,\n      rotationZDeg: 90,\n      wallId: 'right',\n    });\n  }`,
    `  if (segment.wallId === 'right') {\n    return createModulePlacement({\n      xCm: Number(standXCm),\n      yCm: localStartCm,\n      zCm: 0,\n      rotationZDeg: 270,\n      wallId: 'right',\n    });\n  }`,
    'right wall rotation',
  );
  fs.writeFileSync(file, source);
}

// moduleDragSidebar.js
{
  const file = 'src/moduleDragSidebar.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  hint.textContent = 'Kartı sahneye sürükle · R: 0° / 90° yön değiştir · 50 cm grid';`,
    `  hint.textContent = 'Kartı sahneye sürükle · R: +90° · Shift+R: -90° · 50 cm grid';`,
    'drag hint',
  );

  source = replaceOnce(
    source,
    `    activeRotationZDeg = activeRotationZDeg === 90 ? 0 : 90;\n    rotationLocked = true;`,
    `    const deltaDeg = event.shiftKey ? -90 : 90;\n    activeRotationZDeg = ((activeRotationZDeg + deltaDeg) % 360 + 360) % 360;\n    rotationLocked = true;`,
    'catalog rotation key',
  );

  fs.writeFileSync(file, source);
}

// scene3d.js
{
  const file = 'src/scene3d.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  createModulePlacement,\n  getAllowedWallIds,\n  snapPlacementToStand,\n  validatePlacementAgainstModules,`,
    `  createModulePlacement,\n  getAllowedWallIds,\n  isVerticalModuleRotation,\n  normalizeModuleRotationZDeg,\n  rotateModuleRotationZDeg,\n  snapPlacementToStand,\n  validatePlacementAgainstModules,`,
    'scene placement imports',
  );

  source = replaceOnce(
    source,
    `  function applyPlacementToGroup(group, placement, widthCm) {\n    if (!group || !placement) return;\n    const widthM = Number(widthCm) / 100;\n    const xM = Number(placement.xCm) / 100;\n    const logicalYM = Number(placement.yCm) / 100;\n    const logicalZM = Number(placement.zCm ?? 0) / 100;\n\n    group.rotation.set(0, 0, 0);\n\n    // Proje standardı X/Y zemin, Z yüksekliktir. Three.js sahnesinde mevcut\n    // geometriyi bozmamak için logical Y -> world Z, logical Z -> world Y map edilir.\n    if (placement.rotationZDeg === 90) {\n      group.rotation.y = placement.wallId === 'left' ? Math.PI / 2 : -Math.PI / 2;\n      group.position.set(xM, logicalZM, logicalYM + widthM / 2);\n    } else {\n      group.position.set(xM + widthM / 2, logicalZM, logicalYM);\n    }\n  }`,
    `  function applyPlacementToGroup(group, placement, widthCm) {\n    if (!group || !placement) return;\n    const widthM = Number(widthCm) / 100;\n    const xM = Number(placement.xCm) / 100;\n    const logicalYM = Number(placement.yCm) / 100;\n    const logicalZM = Number(placement.zCm ?? 0) / 100;\n    const rotationZDeg = normalizeModuleRotationZDeg(placement.rotationZDeg);\n    const vertical = isVerticalModuleRotation(rotationZDeg);\n\n    // Logical Z etrafındaki plan dönüşü Three.js world-Y yaw olarak uygulanır.\n    // 0=ön, 90=sağ, 180=arka, 270=sol. Ön yüz artık wallId hilesiyle değil\n    // doğrudan rotationZDeg state'iyle belirlenir.\n    group.rotation.set(0, THREE.MathUtils.degToRad(rotationZDeg), 0);\n\n    if (vertical) {\n      group.position.set(xM, logicalZM, logicalYM + widthM / 2);\n    } else {\n      group.position.set(xM + widthM / 2, logicalZM, logicalYM);\n    }\n  }`,
    'apply placement rotation',
  );

  source = replaceOnce(
    source,
    `      if (placement.wallId === 'back' && placement.rotationZDeg === 0) {`,
    `      if (placement.wallId === 'back' && !isVerticalModuleRotation(placement.rotationZDeg)) {`,
    'back cursor rotation',
  );

  source = replaceOnce(
    source,
    `  function getRenderedModuleStates() {\n    return wallRoot.children\n      .map((group) => group.userData?.moduleState)\n      .filter(Boolean);\n  }\n`,
    `  function getRenderedModuleStates() {\n    return wallRoot.children\n      .map((group) => group.userData?.moduleState)\n      .filter(Boolean);\n  }\n\n  function inferWallIdForRotation(placement, rotationZDeg) {\n    if (!stageLayout || !placement) return 'free';\n    const allowedWalls = getAllowedWallIds(stageLayout.standType);\n    const vertical = isVerticalModuleRotation(rotationZDeg);\n    const xCm = Number(placement.xCm);\n    const yCm = Number(placement.yCm);\n    const epsilonCm = 0.001;\n\n    if (!vertical && Math.abs(yCm) <= epsilonCm && allowedWalls.includes('back')) {\n      return 'back';\n    }\n    if (vertical && Math.abs(xCm) <= epsilonCm && allowedWalls.includes('left')) {\n      return 'left';\n    }\n    if (\n      vertical\n      && Math.abs(xCm - Number(stageLayout.widthCm)) <= epsilonCm\n      && allowedWalls.includes('right')\n    ) {\n      return 'right';\n    }\n    return 'free';\n  }\n\n  function getSingleSelectedModuleGroup() {\n    const moduleIds = new Set(\n      [...selectedSurfaces].map((surface) => surface.userData?.moduleId).filter(Boolean),\n    );\n    if (moduleIds.size !== 1) return null;\n    const [moduleId] = moduleIds;\n    return wallRoot.children.find((group) => (\n      group.userData?.moduleState?.id === moduleId || group.userData?.moduleId === moduleId\n    )) ?? null;\n  }\n\n  function rotateSelectedModule(deltaDeg) {\n    if (!stageLayout || dragSession?.dragging) return false;\n    const moduleGroup = getSingleSelectedModuleGroup();\n    const moduleState = moduleGroup?.userData?.moduleState;\n    if (!moduleGroup || !moduleState?.placement) return false;\n\n    const nextRotationZDeg = rotateModuleRotationZDeg(\n      moduleState.placement.rotationZDeg,\n      deltaDeg,\n    );\n    const nextPlacement = {\n      ...moduleState.placement,\n      rotationZDeg: nextRotationZDeg,\n    };\n    nextPlacement.wallId = inferWallIdForRotation(nextPlacement, nextRotationZDeg);\n\n    const validation = validatePlacementAgainstModules({\n      placement: nextPlacement,\n      widthCm: moduleState.widthCm,\n      moduleId: moduleState.id,\n      modules: getRenderedModuleStates(),\n      standType: stageLayout.standType,\n      standXCm: stageLayout.widthCm,\n      standYCm: stageLayout.depthCm,\n    });\n    if (!validation.ok) return false;\n\n    moduleState.placement = { ...nextPlacement };\n    moduleGroup.userData.placement = { ...nextPlacement };\n    applyPlacementToGroup(moduleGroup, nextPlacement, moduleState.widthCm);\n    return true;\n  }\n`,
    'selected module rotation helpers',
  );

  source = replaceOnce(
    source,
    `      preferredRotationZDeg: moduleState.placement?.rotationZDeg === 90 ? 90 : 0,`,
    `      preferredRotationZDeg: normalizeModuleRotationZDeg(moduleState.placement?.rotationZDeg),`,
    'existing drag preferred rotation',
  );

  source = replaceOnce(
    source,
    `  window.addEventListener('keydown', (event) => {\n    if (!dragSession?.dragging || String(event.key).toLowerCase() !== 'r') return;\n    event.preventDefault();\n    dragSession.preferredRotationZDeg = dragSession.preferredRotationZDeg === 90 ? 0 : 90;\n    dragSession.rotationLocked = true;\n    updatePlacementDrag({\n      clientX: dragSession.lastClientX,\n      clientY: dragSession.lastClientY,\n    });\n  });`,
    `  window.addEventListener('keydown', (event) => {\n    if (String(event.key).toLowerCase() !== 'r') return;\n\n    const target = event.target;\n    const tagName = String(target?.tagName ?? '').toLowerCase();\n    const isEditing = tagName === 'input'\n      || tagName === 'textarea'\n      || tagName === 'select'\n      || Boolean(target?.isContentEditable);\n    if (isEditing && !dragSession?.dragging) return;\n\n    const deltaDeg = event.shiftKey ? -90 : 90;\n\n    if (dragSession?.dragging) {\n      event.preventDefault();\n      dragSession.preferredRotationZDeg = rotateModuleRotationZDeg(\n        dragSession.preferredRotationZDeg,\n        deltaDeg,\n      );\n      dragSession.rotationLocked = true;\n      updatePlacementDrag({\n        clientX: dragSession.lastClientX,\n        clientY: dragSession.lastClientY,\n      });\n      return;\n    }\n\n    if (rotateSelectedModule(deltaDeg)) event.preventDefault();\n  });`,
    'scene rotation key',
  );

  fs.writeFileSync(file, source);
}

// modulePlacement.test.js
{
  const file = 'test/modulePlacement.test.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  getAllowedWallIds,\n  snapCm,`,
    `  getAllowedWallIds,\n  isVerticalModuleRotation,\n  normalizeModuleRotationZDeg,\n  rotateModuleRotationZDeg,\n  snapCm,`,
    'test imports',
  );

  source += `\n\ntest('module rotations use four 90 degree directions', () => {\n  assert.equal(normalizeModuleRotationZDeg(0), 0);\n  assert.equal(normalizeModuleRotationZDeg(90), 90);\n  assert.equal(normalizeModuleRotationZDeg(180), 180);\n  assert.equal(normalizeModuleRotationZDeg(270), 270);\n  assert.equal(normalizeModuleRotationZDeg(360), 0);\n  assert.equal(rotateModuleRotationZDeg(270, 90), 0);\n  assert.equal(rotateModuleRotationZDeg(0, -90), 270);\n  assert.equal(isVerticalModuleRotation(90), true);\n  assert.equal(isVerticalModuleRotation(270), true);\n  assert.equal(isVerticalModuleRotation(180), false);\n});\n\ntest('right wall canonical snap faces inward at 270 degrees', () => {\n  const result = snapPlacementToStand({\n    standType: 'u-stand',\n    widthCm: 100,\n    pointerXCm: 795,\n    pointerYCm: 300,\n    standXCm: 800,\n    standYCm: 600,\n  });\n  assert.equal(result.ok, true);\n  assert.equal(result.placement.wallId, 'right');\n  assert.equal(result.placement.rotationZDeg, 270);\n});\n\ntest('rotation lock preserves 180 and 270 degree facing on matching axes', () => {\n  const back = snapPlacementToStand({\n    standType: 'u-stand',\n    widthCm: 100,\n    pointerXCm: 300,\n    pointerYCm: 10,\n    standXCm: 800,\n    standYCm: 600,\n    preferredRotationZDeg: 180,\n    rotationLocked: true,\n  });\n  assert.equal(back.placement.wallId, 'back');\n  assert.equal(back.placement.rotationZDeg, 180);\n\n  const right = snapPlacementToStand({\n    standType: 'u-stand',\n    widthCm: 100,\n    pointerXCm: 790,\n    pointerYCm: 250,\n    standXCm: 800,\n    standYCm: 600,\n    preferredRotationZDeg: 270,\n    rotationLocked: true,\n  });\n  assert.equal(right.placement.wallId, 'right');\n  assert.equal(right.placement.rotationZDeg, 270);\n});\n`;

  fs.writeFileSync(file, source);
}
