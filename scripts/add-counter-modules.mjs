import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, content) { fs.writeFileSync(path, content); }
function replaceOnce(source, from, to, label) {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 occurrence, found ${count}`);
  return source.replace(from, to);
}
function replaceCount(source, from, to, expected, label) {
  const count = source.split(from).length - 1;
  if (count !== expected) throw new Error(`${label}: expected ${expected}, found ${count}`);
  return source.split(from).join(to);
}
function replaceFunction(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error(`${label}: function boundaries not found`);
  return source.slice(0, start) + replacement + source.slice(end);
}

// catalog.js
{
  const path = 'src/catalog.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "export const MODULE_WIDTHS_CM = Object.freeze([50, 100, 150, 200]);\n",
    "export const MODULE_WIDTHS_CM = Object.freeze([50, 100, 150, 200]);\n\nexport const COUNTER_DIMENSIONS = Object.freeze({\n  depthCm: 50,\n  heightCm: 100,\n  widthsCm: Object.freeze([100, 150, 200]),\n});\n",
    'catalog counter dimensions',
  );
  s = replaceOnce(
    s,
    "  DOOR_100: { type: 'door', widthCm: 100, label: 'Depo Kapısı 100' },\n",
    "  DOOR_100: { type: 'door', widthCm: 100, label: 'Depo Kapısı 100' },\n\n  COUNTER_100: { type: 'counter', widthCm: 100, depthCm: 50, heightCm: 100, label: 'Banko 100' },\n  COUNTER_150: { type: 'counter', widthCm: 150, depthCm: 50, heightCm: 100, label: 'Banko 150' },\n  COUNTER_200: { type: 'counter', widthCm: 200, depthCm: 50, heightCm: 100, label: 'Banko 200' },\n",
    'catalog counter entries',
  );
  write(path, s);
}

// designState.js
{
  const path = 'src/designState.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "export function duplicateModuleState(moduleState) {\n",
    "export function createCounterModuleState(widthCm) {\n  const width = Number(widthCm);\n  if (![100, 150, 200].includes(width)) return null;\n\n  return {\n    id: createId('module'),\n    type: 'counter',\n    widthCm: width,\n    depthCm: 50,\n    heightCm: 100,\n    faces: {\n      front: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      left: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      right: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n    },\n  };\n}\n\nexport function duplicateModuleState(moduleState) {\n",
    'design counter state',
  );
  s = replaceOnce(
    s,
    "  if (duplicate.surface) {\n",
    "  if (duplicate.faces) {\n    duplicate.faces = Object.fromEntries(\n      Object.entries(duplicate.faces).map(([faceKey, face]) => [\n        faceKey,\n        {\n          ...face,\n          id: createId('surface'),\n          imageTransform: face.imageTransform\n            ? { ...face.imageTransform }\n            : createDefaultImageTransform(),\n        },\n      ]),\n    );\n  }\n  if (duplicate.surface) {\n",
    'duplicate counter faces',
  );
  write(path, s);
}

// modulePlacement.js
{
  const path = 'src/modulePlacement.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "function nearlyEqual(a, b) {\n  return Math.abs(Number(a) - Number(b)) <= EPSILON_CM;\n}\n",
    "function nearlyEqual(a, b) {\n  return Math.abs(Number(a) - Number(b)) <= EPSILON_CM;\n}\n\nfunction hasStrictDepthBounds(depthCm) {\n  const depth = Number(depthCm);\n  return Number.isFinite(depth) && depth > MODULE_COLLISION_DEPTH_CM + EPSILON_CM;\n}\n\nfunction snapDepthCenterCm(value, depthCm) {\n  const depth = Number(depthCm);\n  const halfDepth = depth / 2;\n  return halfDepth + snapCm(Number(value) - halfDepth);\n}\n",
    'placement depth helpers',
  );
  s = replaceOnce(
    s,
    "export function rotateModulePlacementAroundCenter(placement, widthCm, deltaDeg = 90) {\n",
    "export function rotateModulePlacementAroundCenter(placement, widthCm, deltaDeg = 90, depthCm = null) {\n",
    'rotation depth signature',
  );
  s = replaceOnce(
    s,
    "  return createModulePlacement({\n    ...placement,\n    xCm: snapCm(nextVertical ? centerX : centerX - width / 2),\n    yCm: snapCm(nextVertical ? centerY - width / 2 : centerY),\n    rotationZDeg: nextRotation,\n  });\n",
    "  const strictDepth = hasStrictDepthBounds(depthCm);\n  return createModulePlacement({\n    ...placement,\n    xCm: nextVertical\n      ? (strictDepth ? snapDepthCenterCm(centerX, depthCm) : snapCm(centerX))\n      : snapCm(centerX - width / 2),\n    yCm: nextVertical\n      ? snapCm(centerY - width / 2)\n      : (strictDepth ? snapDepthCenterCm(centerY, depthCm) : snapCm(centerY)),\n    rotationZDeg: nextRotation,\n  });\n",
    'rotation depth snapping',
  );
  s = replaceOnce(
    s,
    "export function validateModulePlacement({\n  placement,\n  widthCm,\n  standType,\n",
    "export function validateModulePlacement({\n  placement,\n  widthCm,\n  depthCm = null,\n  standType,\n",
    'validate depth signature',
  );
  s = replaceOnce(
    s,
    "  } else {\n    const endX = x + (!vertical ? width : 0);\n    const endY = y + (vertical ? width : 0);\n    if (x < 0 || y < 0 || endX > xLimit || endY > yLimit) {\n      return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };\n    }\n  }\n",
    "  } else {\n    const strictDepth = hasStrictDepthBounds(depthCm);\n    if (strictDepth) {\n      const halfDepth = Number(depthCm) / 2;\n      if (vertical) {\n        if (x - halfDepth < 0 || x + halfDepth > xLimit || y < 0 || y + width > yLimit) {\n          return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };\n        }\n      } else if (x < 0 || x + width > xLimit || y - halfDepth < 0 || y + halfDepth > yLimit) {\n        return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };\n      }\n    } else {\n      const endX = x + (!vertical ? width : 0);\n      const endY = y + (vertical ? width : 0);\n      if (x < 0 || y < 0 || endX > xLimit || endY > yLimit) {\n        return { ok: false, message: 'Modül aktif stand alanını aşıyor.' };\n      }\n    }\n  }\n",
    'validate strict footprint',
  );
  s = replaceOnce(
    s,
    "export function validatePlacementAgainstModules({\n  placement,\n  widthCm,\n  moduleId = null,\n",
    "export function validatePlacementAgainstModules({\n  placement,\n  widthCm,\n  depthCm = null,\n  moduleId = null,\n",
    'collision depth signature',
  );
  s = replaceOnce(
    s,
    "  const boundary = validateModulePlacement({\n    placement,\n    widthCm,\n    standType,\n",
    "  const boundary = validateModulePlacement({\n    placement,\n    widthCm,\n    depthCm,\n    standType,\n",
    'collision boundary depth',
  );
  s = replaceOnce(
    s,
    "  const candidate = { id: moduleId, widthCm, placement };\n",
    "  const candidate = { id: moduleId, widthCm, depthCm, placement };\n",
    'collision candidate depth',
  );
  s = replaceOnce(
    s,
    "    const horizontalEndpoint = pointIsSegmentEndpoint(horizontal, intersectionX);\n    const verticalEndpoint = pointIsSegmentEndpoint(vertical, intersectionY);\n    return !horizontalEndpoint && !verticalEndpoint;\n",
    "    const horizontalEndpoint = pointIsSegmentEndpoint(horizontal, intersectionX);\n    const verticalEndpoint = pointIsSegmentEndpoint(vertical, intersectionY);\n    const thinEndpointJoin = horizontalDepth <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM\n      && verticalDepth <= MODULE_COLLISION_DEPTH_CM + EPSILON_CM;\n    if (!thinEndpointJoin) return true;\n    return !horizontalEndpoint && !verticalEndpoint;\n",
    'counter endpoint collision',
  );

  const freePlacement = "function createFreePlacement({\n  widthCm,\n  depthCm = null,\n  pointerXCm,\n  pointerYCm,\n  standXCm,\n  standYCm,\n  rotationZDeg,\n}) {\n  const width = Number(widthCm);\n  const xLimit = Number(standXCm);\n  const yLimit = Number(standYCm);\n  const rotation = normalizeModuleRotationZDeg(rotationZDeg);\n  const vertical = isVerticalModuleRotation(rotation);\n  const strictDepth = hasStrictDepthBounds(depthCm);\n  const halfDepth = strictDepth ? Number(depthCm) / 2 : 0;\n  const minX = vertical && strictDepth ? halfDepth : 0;\n  const maxX = !vertical ? xLimit - width : (strictDepth ? xLimit - halfDepth : xLimit);\n  const minY = !vertical && strictDepth ? halfDepth : 0;\n  const maxY = vertical ? yLimit - width : (strictDepth ? yLimit - halfDepth : yLimit);\n  if (maxX < minX || maxY < minY) return null;\n\n  return createModulePlacement({\n    xCm: !vertical\n      ? clamp(snapCm(Number(pointerXCm) - width / 2), 0, maxX)\n      : clamp(\n          strictDepth ? snapDepthCenterCm(pointerXCm, depthCm) : snapCm(pointerXCm),\n          minX,\n          maxX,\n        ),\n    yCm: vertical\n      ? clamp(snapCm(Number(pointerYCm) - width / 2), 0, maxY)\n      : clamp(\n          strictDepth ? snapDepthCenterCm(pointerYCm, depthCm) : snapCm(pointerYCm),\n          minY,\n          maxY,\n        ),\n    rotationZDeg: rotation,\n    wallId: 'free',\n  });\n}\n\n";
  s = replaceFunction(s, 'function createFreePlacement({', 'export function snapPlacementToStand({', freePlacement, 'free placement rewrite');
  s = replaceOnce(
    s,
    "export function snapPlacementToStand({\n  standType,\n  widthCm,\n  pointerXCm,\n",
    "export function snapPlacementToStand({\n  standType,\n  widthCm,\n  depthCm = null,\n  forceFree = false,\n  pointerXCm,\n",
    'snap stand counter signature',
  );
  s = replaceOnce(
    s,
    "  const freePlacement = createFreePlacement({\n    widthCm: width,\n    pointerXCm: pointerX,\n",
    "  const freePlacement = createFreePlacement({\n    widthCm: width,\n    depthCm,\n    pointerXCm: pointerX,\n",
    'snap stand depth free',
  );
  s = replaceOnce(
    s,
    "  if (nearestBoundary?.distanceCm <= MODULE_WALL_SNAP_DISTANCE_CM) {\n",
    "  if (!forceFree && nearestBoundary?.distanceCm <= MODULE_WALL_SNAP_DISTANCE_CM) {\n",
    'force free counters',
  );
  s = replaceOnce(
    s,
    "      widthCm: module.widthCm,\n      moduleId: module.id,\n      modules: [...modules, ...plannedModules],\n",
    "      widthCm: module.widthCm,\n      depthCm: module.depthCm,\n      moduleId: module.id,\n      modules: [...modules, ...plannedModules],\n",
    'free insertion counter depth',
  );
  write(path, s);
}

// main.js
{
  const path = 'src/main.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "  createDoorModuleState,\n  createFlatPanelModuleState,\n",
    "  createCounterModuleState,\n  createDoorModuleState,\n  createFlatPanelModuleState,\n",
    'main counter import',
  );
  s = replaceOnce(
    s,
    "      if (moduleType === 'separator') {\n",
    "      if (moduleType === 'counter') {\n        const faceLabel = surface.userData.surfaceRole === 'front'\n          ? 'ön'\n          : (surface.userData.surfaceRole === 'left' ? 'sol yan' : 'sağ yan');\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Banko ' + widthCm + ' cm · ' + faceLabel + ' cephe · renk + görsel uygulanabilir.';\n        return;\n      }\n\n      if (moduleType === 'separator') {\n",
    'main counter selection info',
  );
  s = replaceOnce(
    s,
    "  if (module.type === 'flat-panel') state = createFlatPanelModuleState(module.widthCm);\n  else if (module.type === 'separator') state = createSeparatorModuleState(module.widthCm);\n",
    "  if (module.type === 'flat-panel') state = createFlatPanelModuleState(module.widthCm);\n  else if (module.type === 'counter') state = createCounterModuleState(module.widthCm);\n  else if (module.type === 'separator') state = createSeparatorModuleState(module.widthCm);\n",
    'main create counter state',
  );
  write(path, s);
}

// moduleDragSidebar.js
{
  const path = 'src/moduleDragSidebar.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "  'SHOWCASE_2_100',\n];\n",
    "  'SHOWCASE_2_100',\n  'COUNTER_200',\n  'COUNTER_150',\n  'COUNTER_100',\n];\n",
    'drag counter keys',
  );
  s = replaceOnce(
    s,
    "    .module-drag-door::after { content:''; position:absolute; right:3px; bottom:19px; width:3px; height:3px; border-radius:50%; background:#4b5563; }\n",
    "    .module-drag-door::after { content:''; position:absolute; right:3px; bottom:19px; width:3px; height:3px; border-radius:50%; background:#4b5563; }\n    .module-drag-counter { position:relative; height:34px; border:3px solid #7b838c; background:#f8fafc; box-shadow:5px 5px 0 #d7dde4,0 2px 5px rgba(15,23,42,.08); }\n    .module-drag-counter::after { content:''; position:absolute; left:-3px; right:-3px; top:-6px; height:5px; border:1px solid #9aa0a6; background:#eef2f6; }\n",
    'drag counter css',
  );
  s = replaceOnce(
    s,
    "  if (module.type === 'separator') {\n",
    "  if (module.type === 'counter') {\n    const body = document.createElement('div');\n    body.className = 'module-drag-counter';\n    body.style.width = Math.max(34, previewWidthPx(module.widthCm)) + 'px';\n    preview.appendChild(body);\n    return preview;\n  }\n\n  if (module.type === 'separator') {\n",
    'drag counter preview',
  );
  write(path, s);
}

// moduleContextMenu.js label only; bankos remain drag-only in the picker.
{
  const path = 'src/moduleContextMenu.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "  door: 'Depo Kapısı',\n};\n",
    "  door: 'Depo Kapısı',\n  counter: 'Banko',\n};\n",
    'counter context label',
  );
  write(path, s);
}

// scene3d.js
{
  const path = 'src/scene3d.js';
  let s = read(path);
  s = replaceOnce(
    s,
    "      if (moduleState.type === 'separator') {\n        module = createSeparatorModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'door') {\n",
    "      if (moduleState.type === 'separator') {\n        module = createSeparatorModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'counter') {\n        module = createCounterModule(\n          moduleState,\n          moduleIndex,\n          (surface) => applyStoredImage(surface),\n        );\n      } else if (moduleState.type === 'door') {\n",
    'scene counter dispatch',
  );

  const oldGhost = "  function ensurePlacementGhost(widthCm) {\n    if (placementGhost?.widthCm === widthCm) return placementGhost;\n    disposePlacementGhost();\n\n    const root = new THREE.Group();\n    const mesh = new THREE.Mesh(\n      new THREE.BoxGeometry(\n        Math.max(Number(widthCm) / 100, 0.02),\n        STAND_DIMENSIONS.height,\n        Math.max(STAND_DIMENSIONS.depth, 0.08),\n      ),\n      new THREE.MeshBasicMaterial({\n        color: PLACEMENT_VALID_COLOR,\n        transparent: true,\n        opacity: PLACEMENT_GHOST_OPACITY,\n        depthWrite: false,\n        depthTest: false,\n        side: THREE.DoubleSide,\n      }),\n    );\n    mesh.renderOrder = 10000;\n    mesh.position.y = STAND_DIMENSIONS.height / 2;\n    root.add(mesh);\n    scene.add(root);\n    placementGhost = { root, mesh, widthCm };\n    return placementGhost;\n  }\n\n  function showPlacementGhost(widthCm, placement, valid) {\n    const ghost = ensurePlacementGhost(widthCm);\n    ghost.mesh.material.color.setHex(valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR);\n    applyPlacementToGroup(ghost.root, placement, widthCm);\n    ghost.root.visible = true;\n  }\n";
  const newGhost = "  function getPlacementGhostDimensions(moduleOrWidthCm) {\n    if (typeof moduleOrWidthCm === 'object' && moduleOrWidthCm) {\n      return {\n        widthCm: Number(moduleOrWidthCm.widthCm),\n        depthM: Math.max(Number(moduleOrWidthCm.depthCm ?? (STAND_DIMENSIONS.depth * 100)) / 100, 0.02),\n        heightM: Math.max(Number(moduleOrWidthCm.heightCm ?? (STAND_DIMENSIONS.height * 100)) / 100, 0.02),\n      };\n    }\n    return {\n      widthCm: Number(moduleOrWidthCm),\n      depthM: Math.max(STAND_DIMENSIONS.depth, 0.08),\n      heightM: STAND_DIMENSIONS.height,\n    };\n  }\n\n  function ensurePlacementGhost(moduleOrWidthCm) {\n    const dimensions = getPlacementGhostDimensions(moduleOrWidthCm);\n    const key = [dimensions.widthCm, dimensions.depthM, dimensions.heightM].join(':');\n    if (placementGhost?.key === key) return placementGhost;\n    disposePlacementGhost();\n\n    const root = new THREE.Group();\n    const mesh = new THREE.Mesh(\n      new THREE.BoxGeometry(\n        Math.max(dimensions.widthCm / 100, 0.02),\n        dimensions.heightM,\n        dimensions.depthM,\n      ),\n      new THREE.MeshBasicMaterial({\n        color: PLACEMENT_VALID_COLOR,\n        transparent: true,\n        opacity: PLACEMENT_GHOST_OPACITY,\n        depthWrite: false,\n        depthTest: false,\n        side: THREE.DoubleSide,\n      }),\n    );\n    mesh.renderOrder = 10000;\n    mesh.position.y = dimensions.heightM / 2;\n    root.add(mesh);\n    scene.add(root);\n    placementGhost = { root, mesh, key, widthCm: dimensions.widthCm };\n    return placementGhost;\n  }\n\n  function showPlacementGhost(moduleOrWidthCm, placement, valid) {\n    const ghost = ensurePlacementGhost(moduleOrWidthCm);\n    ghost.mesh.material.color.setHex(valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR);\n    applyPlacementToGroup(ghost.root, placement, ghost.widthCm);\n    ghost.root.visible = true;\n  }\n";
  s = replaceOnce(s, oldGhost, newGhost, 'scene ghost dimensions');
  s = replaceOnce(
    s,
    "    if (moduleState?.type === 'separator') return `Separatör ${widthCm}`;\n",
    "    if (moduleState?.type === 'counter') return `Banko ${widthCm}`;\n    if (moduleState?.type === 'separator') return `Separatör ${widthCm}`;\n",
    'scene counter drag label',
  );
  s = replaceOnce(
    s,
    "    if (preview) {\n      if (moduleState?.type === 'separator') {\n",
    "    if (preview) {\n      preview.style.height = moduleState?.type === 'counter' ? '28px' : '48px';\n      if (moduleState?.type === 'counter') {\n        preview.style.background = 'linear-gradient(to bottom,#eef2f6 0 16%,#d1d5db 16% 20%,#f8fafc 20% 100%)';\n      } else if (moduleState?.type === 'separator') {\n",
    'scene counter drag badge',
  );
  s = replaceOnce(
    s,
    "      moduleState.widthCm,\n      deltaDeg,\n    );\n",
    "      moduleState.widthCm,\n      deltaDeg,\n      moduleState.depthCm,\n    );\n",
    'scene rotate counter depth',
  );
  s = replaceOnce(
    s,
    "    nextPlacement.wallId = inferWallIdForRotation(\n      nextPlacement,\n      nextPlacement.rotationZDeg,\n    );\n",
    "    nextPlacement.wallId = moduleState.type === 'counter'\n      ? 'free'\n      : inferWallIdForRotation(\n          nextPlacement,\n          nextPlacement.rotationZDeg,\n        );\n",
    'scene counter rotation free',
  );
  s = replaceCount(
    s,
    "      widthCm: moduleState.widthCm,\n      moduleId: moduleState.id,\n",
    "      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,\n      moduleId: moduleState.id,\n",
    3,
    'scene validation counter depth',
  );
  s = replaceCount(
    s,
    "      widthCm: moduleState.widthCm,\n      pointerXCm: ground.xCm,\n",
    "      widthCm: moduleState.widthCm,\n      depthCm: moduleState.depthCm,\n      forceFree: moduleState.type === 'counter',\n      pointerXCm: ground.xCm,\n",
    2,
    'scene snap counter footprint',
  );
  s = replaceCount(
    s,
    "    const magneticSnap = snapPlacementToModules({\n",
    "    const magneticSnap = moduleState.type === 'counter' ? null : snapPlacementToModules({\n",
    2,
    'scene disable counter magnetic',
  );
  s = replaceCount(
    s,
    "      modules: renderedModules,\n      standType: stageLayout.standType,\n",
    "      modules: renderedModules.filter((module) => module.type !== 'counter'),\n      standType: stageLayout.standType,\n",
    2,
    'scene ignore counters as magnetic targets',
  );
  s = replaceCount(
    s,
    "    showPlacementGhost(moduleState.widthCm, previewPlacement, plan.ok);\n",
    "    showPlacementGhost(moduleState, previewPlacement, plan.ok);\n",
    2,
    'scene counter ghost drag',
  );
  s = replaceOnce(
    s,
    "      showPlacementGhost(moduleState.widthCm, nextPlacement, false);\n",
    "      showPlacementGhost(moduleState, nextPlacement, false);\n",
    'scene counter ghost rotate',
  );

  const counterFunction = "function createCounterModule(moduleState, moduleIndex, onSurfaceReady) {\n  const widthCm = Number(moduleState.widthCm);\n  const depthCm = Number(moduleState.depthCm) || 50;\n  const heightCm = Number(moduleState.heightCm) || 100;\n  const widthM = widthCm / 100;\n  const depthM = depthCm / 100;\n  const heightM = heightCm / 100;\n  const group = new THREE.Group();\n  group.userData = {\n    kind: 'module',\n    moduleIndex,\n    moduleId: moduleState.id,\n    type: moduleState.type,\n    widthCm,\n    depthCm,\n    heightCm,\n  };\n\n  const body = new THREE.Mesh(\n    new THREE.BoxGeometry(widthM, heightM, depthM),\n    new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.76, metalness: 0 }),\n  );\n  body.position.set(0, heightM / 2, 0);\n  body.castShadow = true;\n  body.receiveShadow = true;\n  group.add(body);\n\n  const top = new THREE.Mesh(\n    new THREE.PlaneGeometry(widthM, depthM),\n    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.58, metalness: 0 }),\n  );\n  top.rotation.x = -Math.PI / 2;\n  top.position.set(0, heightM + 0.0015, 0);\n  top.receiveShadow = true;\n  group.add(top);\n\n  const surfaces = [];\n  const addFace = (surfaceRole, surfaceState, faceWidthM, position, rotationY = 0) => {\n    if (!surfaceState) return;\n    const surface = new THREE.Mesh(\n      new THREE.PlaneGeometry(faceWidthM, heightM),\n      new THREE.MeshStandardMaterial({\n        color: surfaceState.imageAssetId ? 0xffffff : surfaceState.color,\n        roughness: 0.72,\n        metalness: 0,\n        side: THREE.DoubleSide,\n        emissive: 0x000000,\n        emissiveIntensity: 0,\n      }),\n    );\n    surface.position.copy(position);\n    surface.rotation.y = rotationY;\n\n    const selectionFrame = createSelectionFrame(faceWidthM, heightM);\n    selectionFrame.visible = false;\n    surface.add(selectionFrame);\n\n    surface.userData = {\n      kind: 'surface',\n      moduleType: 'counter',\n      selectionMode: 'module',\n      acceptsImage: true,\n      moduleIndex,\n      moduleId: moduleState.id,\n      widthCm,\n      stripIndex: null,\n      stripNumber: null,\n      surfaceRole,\n      surfaceId: surfaceState.id,\n      surfaceState,\n      selectionFrame,\n    };\n    group.add(surface);\n    surfaces.push(surface);\n    onSurfaceReady?.(surface);\n  };\n\n  addFace(\n    'front',\n    moduleState.faces?.front,\n    widthM,\n    new THREE.Vector3(0, heightM / 2, depthM / 2 + 0.0015),\n  );\n  addFace(\n    'left',\n    moduleState.faces?.left,\n    depthM,\n    new THREE.Vector3(-widthM / 2 - 0.0015, heightM / 2, 0),\n    -Math.PI / 2,\n  );\n  addFace(\n    'right',\n    moduleState.faces?.right,\n    depthM,\n    new THREE.Vector3(widthM / 2 + 0.0015, heightM / 2, 0),\n    Math.PI / 2,\n  );\n\n  return { group, surfaces };\n}\n\n";
  s = replaceOnce(
    s,
    "function createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady) {\n",
    counterFunction + "function createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady) {\n",
    'scene counter geometry',
  );
  write(path, s);
}

// PROJECT_RULES.md
{
  const path = 'PROJECT_RULES.md';
  let s = read(path);
  const heading = '## Banko modülü standardı';
  if (!s.includes(heading)) {
    s = s.trimEnd() + '\n\n' + heading + '\n\n'
      + '- Banko genişlikleri X = 100 / 150 / 200 cm; derinlik Y = 50 cm; yükseklik H = 100 cm.\n'
      + '- Ön X cephesi ile sol ve sağ Y cepheleri birbirinden bağımsız seçilebilir; her cepheye ayrı renk veya görsel atanabilir.\n'
      + '- Bankolar serbest yerleşim modülüdür; aktif duvar zincirine otomatik katılmaz. 0/90/180/270 dönüş, R / Shift+R ve stand sınırı/collision kontrolleri geçerlidir.\n';
    write(path, s);
  }
}

// Changelog.md
{
  const path = 'Changelog.md';
  let s = read(path);
  const heading = '## Banko modülleri';
  if (!s.includes(heading)) {
    s = s.trimEnd() + '\n\n' + heading + '\n\n'
      + '427. Banko 100, Banko 150 ve Banko 200 modülleri eklendi; sabit derinlik 50 cm ve yükseklik 100 cm olarak tanımlandı.\n'
      + '428. Bankoların ön X cephesi ile sol ve sağ 50 cm Y cepheleri üç bağımsız yüzey olarak tanımlandı; her cephe mevcut yüzey editörü üzerinden ayrı renk veya görsel alabilir.\n'
      + '429. Bankolar drag kataloguna eklendi ve serbest yerleşime zorlandı; 4 yön dönüş desteklenirken 50 cm derinlik gerçek collision ve aktif alan sınır hesabına dahil edildi.\n'
      + '430. Banko footprint merkez çizgisi, 50 cm grid üzerinde kenarları hizalayacak 25 cm ofsetli çapraz eksen snap mantığına bağlandı; mevcut 10 cm duvar modülü davranışı değiştirilmedi.\n'
      + '431. Banko state çoğaltma/sıfırlama desteği, seçili cephe açıklaması, gerçek ölçülü placement ghost ve regresyon testleri eklendi.\n';
    write(path, s);
  }
}

// counter tests
{
  const path = 'test/counterModule.test.js';
  const lines = [
    "import test from 'node:test';",
    "import assert from 'node:assert/strict';",
    "import { createCounterModuleState, duplicateModuleState } from '../src/designState.js';",
    "import { rotateModulePlacementAroundCenter, snapPlacementToStand, validatePlacementAgainstModules } from '../src/modulePlacement.js';",
    '',
    "test('counter state exposes three independent editable faces', () => {",
    "  const counter = createCounterModuleState(150);",
    "  assert.equal(counter.type, 'counter');",
    "  assert.equal(counter.widthCm, 150);",
    "  assert.equal(counter.depthCm, 50);",
    "  assert.equal(counter.heightCm, 100);",
    "  assert.deepEqual(Object.keys(counter.faces), ['front', 'left', 'right']);",
    "  assert.notEqual(counter.faces.front.id, counter.faces.left.id);",
    "  counter.faces.front.color = '#ff0000';",
    "  assert.equal(counter.faces.left.color, '#ffffff');",
    "});",
    '',
    "test('duplicating a counter gives every face a new surface id', () => {",
    "  const source = createCounterModuleState(100);",
    "  const copy = duplicateModuleState(source);",
    "  assert.notEqual(copy.id, source.id);",
    "  for (const key of ['front', 'left', 'right']) {",
    "    assert.notEqual(copy.faces[key].id, source.faces[key].id);",
    "  }",
    "});",
    '',
    "test('counter free placement stays inside the stand with 50 cm physical depth', () => {",
    "  const result = snapPlacementToStand({",
    "    standType: 'u-stand',",
    "    widthCm: 150,",
    "    depthCm: 50,",
    "    forceFree: true,",
    "    pointerXCm: 220,",
    "    pointerYCm: 20,",
    "    standXCm: 800,",
    "    standYCm: 600,",
    "  });",
    "  assert.equal(result.ok, true);",
    "  assert.equal(result.placement.wallId, 'free');",
    "  assert.equal(result.placement.rotationZDeg, 0);",
    "  assert.equal(result.placement.yCm, 25);",
    "  const validation = validatePlacementAgainstModules({",
    "    placement: result.placement,",
    "    widthCm: 150,",
    "    depthCm: 50,",
    "    moduleId: 'counter',",
    "    modules: [],",
    "    standType: 'u-stand',",
    "    standXCm: 800,",
    "    standYCm: 600,",
    "  });",
    "  assert.equal(validation.ok, true);",
    "});",
    '',
    "test('counter depth participates in collision checks', () => {",
    "  const counter = {",
    "    id: 'counter-a', widthCm: 150, depthCm: 50,",
    "    placement: { xCm: 100, yCm: 125, zCm: 0, rotationZDeg: 0, wallId: 'free' },",
    "  };",
    "  const overlap = validatePlacementAgainstModules({",
    "    moduleId: 'counter-b',",
    "    widthCm: 100,",
    "    depthCm: 50,",
    "    placement: { xCm: 150, yCm: 150, zCm: 0, rotationZDeg: 0, wallId: 'free' },",
    "    modules: [counter],",
    "    standType: 'island',",
    "    standXCm: 800,",
    "    standYCm: 600,",
    "  });",
    "  assert.equal(overlap.ok, false);",
    "});",
    '',
    "test('counter selected rotation remains free and snaps its 50 cm depth axis safely', () => {",
    "  const rotated = rotateModulePlacementAroundCenter({",
    "    xCm: 100, yCm: 125, zCm: 0, rotationZDeg: 0, wallId: 'free',",
    "  }, 150, 90, 50);",
    "  assert.equal(rotated.rotationZDeg, 90);",
    "  assert.equal((rotated.xCm - 25) % 50, 0);",
    "  assert.equal(rotated.yCm % 50, 0);",
    "});",
    '',
  ];
  write(path, lines.join('\n'));
}
