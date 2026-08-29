const fs = require('fs');

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

source = source.replace(
  "  getAllowedWallIds,\n  isVerticalModuleRotation,",
  "  getAllowedWallIds,\n  getModulePlacementSnapCm,\n  isVerticalModuleRotation,",
);

const keydownAnchor = `  window.addEventListener('keydown', (event) => {\n    const pressedKey = String(event.key).toLowerCase();\n`;
if (!source.includes(keydownAnchor)) throw new Error('keydown anchor not found');

const arrowBlock = `  window.addEventListener('keydown', (event) => {\n    const pressedKey = String(event.key).toLowerCase();\n\n    const arrowDelta = {\n      arrowleft: [-1, 0],\n      arrowright: [1, 0],\n      arrowup: [0, -1],\n      arrowdown: [0, 1],\n    }[pressedKey];\n    if (arrowDelta) {\n      const target = event.target;\n      const tagName = String(target?.tagName ?? '').toLowerCase();\n      const isEditing = tagName === 'input'\n        || tagName === 'textarea'\n        || tagName === 'select'\n        || Boolean(target?.isContentEditable);\n      if (isEditing || dragSession?.dragging) return;\n\n      const moduleGroup = getSingleSelectedModuleGroup();\n      const moduleState = moduleGroup?.userData?.moduleState;\n      if (!moduleGroup || !moduleState?.placement || !stageLayout) return;\n\n      event.preventDefault();\n      const stepCm = getModulePlacementSnapCm(moduleState.type);\n      const desiredPlacement = createModulePlacement({\n        ...moduleState.placement,\n        xCm: Number(moduleState.placement.xCm || 0) + arrowDelta[0] * stepCm,\n        yCm: Number(moduleState.placement.yCm || 0) + arrowDelta[1] * stepCm,\n        wallId: 'free',\n      });\n      desiredPlacement.zCm = Number(moduleState.placement.zCm || 0);\n\n      const renderedModules = getRenderedModuleStates();\n      const validation = validatePlacementAgainstModules({\n        placement: desiredPlacement,\n        widthCm: moduleState.widthCm,\n        depthCm: moduleState.depthCm,\n        moduleId: moduleState.id,\n        moduleType: moduleState.type,\n        shape: moduleState.shape,\n        modules: renderedModules,\n        standType: stageLayout.standType,\n        standXCm: stageLayout.widthCm,\n        standYCm: stageLayout.depthCm,\n      });\n      if (!validation.ok) {\n        showPlacementFeedback(validation.message ?? 'Bu yöne hareket edemez.', { durationMs: 900 });\n        return;\n      }\n\n      moduleState.placement = { ...desiredPlacement };\n      moduleGroup.userData.placement = { ...desiredPlacement };\n      applyPlacementToGroup(moduleGroup, desiredPlacement, moduleState.widthCm);\n      clearPlacementFeedback();\n      return;\n    }\n`;
source = source.replace(keydownAnchor, arrowBlock);

if (!source.includes("arrowleft: [-1, 0]") || !source.includes('getModulePlacementSnapCm(moduleState.type)')) {
  throw new Error('arrow movement patch missing');
}

fs.writeFileSync(path, source);
