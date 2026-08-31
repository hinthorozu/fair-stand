from pathlib import Path

# Fix Bar Taburesi default facing in drag/catalog add paths.
p = Path('src/moduleDragSidebar.js')
s = p.read_text()
s = s.replace("activeRotationZDeg = state.type === 'bar-stool' ? 90 : 0", "activeRotationZDeg = state.type === 'bar-stool' ? 270 : 0")
p.write_text(s)

p = Path('src/main.js')
s = p.read_text()
s = s.replace("rotationZDeg: moduleState.type === 'bar-stool' ? 90 : 0", "rotationZDeg: moduleState.type === 'bar-stool' ? 270 : 0")
p.write_text(s)

# Fix free-side insertion so floor fixtures use their own physical footprint/orientation.
p = Path('src/modulePlacement.js')
s = p.read_text()
needle = """export function planFreeSideInsertion({\n  modules = [],\n  insertedModules = [],\n  targetModuleId,\n  side = 'right',\n  standType,\n  standXCm,\n  standYCm,\n} = {}) {\n"""
helper = """function createFreeSideFixturePlacement({\n  sourceModule,\n  insertedModule,\n  side,\n  standXCm,\n  standYCm,\n} = {}) {\n  if (!sourceModule?.placement || !insertedModule) return null;\n  const sourceWidth = Number(sourceModule.widthCm);\n  const sourceDepth = Number(sourceModule.depthCm);\n  const insertedWidth = Number(insertedModule.widthCm);\n  const insertedDepth = Number(insertedModule.depthCm);\n  if (![sourceWidth, insertedWidth, insertedDepth].every(Number.isFinite)) return null;\n\n  const sourceRotation = normalizeModuleRotationZDeg(sourceModule.placement.rotationZDeg);\n  const insertedRotation = normalizeModuleRotationZDeg(\n    insertedModule.type === 'bar-stool' ? 270 : sourceRotation,\n  );\n  const directionInfo = getVisualRightAxisDirection(sourceRotation);\n  const direction = directionInfo.sign * (side === 'right' ? 1 : -1);\n  const sourceVertical = isVerticalModuleRotation(sourceRotation);\n  const insertedVertical = isVerticalModuleRotation(insertedRotation);\n  const sourceCenter = {\n    xCm: Number(sourceModule.placement.xCm) + (sourceVertical ? 0 : sourceWidth / 2),\n    yCm: Number(sourceModule.placement.yCm) + (sourceVertical ? sourceWidth / 2 : 0),\n  };\n  if (![sourceCenter.xCm, sourceCenter.yCm].every(Number.isFinite)) return null;\n\n  const sourcePhysicalDepth = Number.isFinite(sourceDepth) && sourceDepth > 0\n    ? sourceDepth\n    : MODULE_COLLISION_DEPTH_CM;\n  const sourceHalfAlong = directionInfo.axis === 'x'\n    ? (sourceVertical ? sourcePhysicalDepth / 2 : sourceWidth / 2)\n    : (sourceVertical ? sourceWidth / 2 : sourcePhysicalDepth / 2);\n  const insertedHalfAlong = directionInfo.axis === 'x'\n    ? (insertedVertical ? insertedDepth / 2 : insertedWidth / 2)\n    : (insertedVertical ? insertedWidth / 2 : insertedDepth / 2);\n\n  const center = { ...sourceCenter };\n  center[directionInfo.axis === 'x' ? 'xCm' : 'yCm'] += direction * (sourceHalfAlong + insertedHalfAlong);\n\n  let xCm = insertedVertical ? center.xCm : center.xCm - insertedWidth / 2;\n  let yCm = insertedVertical ? center.yCm - insertedWidth / 2 : center.yCm;\n  const xLimit = Number(standXCm);\n  const yLimit = Number(standYCm);\n\n  // Keep the side contact fixed, but clamp the perpendicular axis so a deeper/wider\n  // floor fixture can sit flush beside a target that itself is close to a stand edge.\n  if (directionInfo.axis === 'x') {\n    if (insertedVertical) yCm = clamp(yCm, 0, Math.max(0, yLimit - insertedWidth));\n    else yCm = clamp(yCm, insertedDepth / 2, Math.max(insertedDepth / 2, yLimit - insertedDepth / 2));\n  } else if (insertedVertical) {\n    xCm = clamp(xCm, insertedDepth / 2, Math.max(insertedDepth / 2, xLimit - insertedDepth / 2));\n  } else {\n    xCm = clamp(xCm, 0, Math.max(0, xLimit - insertedWidth));\n  }\n\n  return createModulePlacement({\n    xCm,\n    yCm,\n    zCm: insertedModule.placement?.zCm ?? sourceModule.placement.zCm ?? 0,\n    rotationZDeg: insertedRotation,\n    wallId: 'free',\n  });\n}\n\nexport function planFreeSideInsertion({\n  modules = [],\n  insertedModules = [],\n  targetModuleId,\n  side = 'right',\n  standType,\n  standXCm,\n  standYCm,\n} = {}) {\n"""
if needle not in s:
    raise SystemExit('planFreeSideInsertion anchor not found')
s = s.replace(needle, helper, 1)
old = """    const nextPlacement = createFreeSidePlacement({\n      sourcePlacement: anchorPlacement,\n      sourceWidthCm: anchorWidthCm,\n      insertedWidthCm: module.widthCm,\n      side,\n    });\n"""
new = """    const anchorModule = plannedModules.length\n      ? plannedModules[plannedModules.length - 1]\n      : sourceModule;\n    const nextPlacement = hasStrictDepthBounds(module.depthCm)\n      ? createFreeSideFixturePlacement({\n          sourceModule: { ...anchorModule, placement: anchorPlacement, widthCm: anchorWidthCm },\n          insertedModule: module,\n          side,\n          standXCm,\n          standYCm,\n        })\n      : createFreeSidePlacement({\n          sourcePlacement: anchorPlacement,\n          sourceWidthCm: anchorWidthCm,\n          insertedWidthCm: module.widthCm,\n          side,\n        });\n"""
if old not in s:
    raise SystemExit('free side placement block not found')
s = s.replace(old, new, 1)
old_validation = """      moduleId: module.id,\n      modules: [...modules, ...plannedModules],\n"""
new_validation = """      moduleId: module.id,\n      moduleType: module.type,\n      shape: module.shape,\n      modules: [...modules, ...plannedModules],\n"""
if old_validation not in s:
    raise SystemExit('free side validation block not found')
s = s.replace(old_validation, new_validation, 1)
p.write_text(s)

print('Fixed free-side floor-fixture placement and Bar Taburesi default facing.')
