import fs from 'node:fs';

const path = 'src/scene3d.js';
let text = fs.readFileSync(path, 'utf8');

function replaceOnce(from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing pattern: ${label}`);
  text = text.replace(from, to);
}

replaceOnce(
`  let selectionAnchorSurfaceId = null;\n  let placementGhost = null;`,
`  let selectionAnchorSurfaceId = null;\n  let selectedModuleId = null;\n  let placementGhost = null;`,
'add selectedModuleId state',
);

replaceOnce(
`  function selectOnly(mesh) {\n    clearSelection({ notify: false });\n    if (mesh) {\n      selectedSurfaces.add(mesh);\n      selectionAnchorSurfaceId = mesh.userData.surfaceId ?? null;\n      setSelectionVisual(mesh, true);\n    }\n    notifySelection();\n  }`,
`  function selectOnly(mesh) {\n    clearSelection({ notify: false });\n    if (mesh) {\n      selectedSurfaces.add(mesh);\n      selectedModuleId = mesh.userData.moduleId ?? null;\n      selectionAnchorSurfaceId = mesh.userData.surfaceId ?? null;\n      setSelectionVisual(mesh, true);\n    }\n    notifySelection();\n  }\n\n  function selectModuleOnly(moduleId) {\n    selectedSurfaces.forEach((mesh) => setSelectionVisual(mesh, false));\n    selectedSurfaces.clear();\n    selectionAnchorSurfaceId = null;\n    floorSelected = false;\n    selectedModuleId = moduleId ?? null;\n    notifySelection();\n  }`,
'selectOnly module state',
);

replaceOnce(
`    result.entries.forEach((entry) => {\n      selectedSurfaces.add(entry.mesh);\n      setSelectionVisual(entry.mesh, true);\n    });\n    notifySelection();`,
`    result.entries.forEach((entry) => {\n      selectedSurfaces.add(entry.mesh);\n      setSelectionVisual(entry.mesh, true);\n    });\n    const selectedModuleIds = new Set(\n      result.entries.map((entry) => entry.mesh.userData?.moduleId).filter(Boolean),\n    );\n    selectedModuleId = selectedModuleIds.size === 1 ? [...selectedModuleIds][0] : null;\n    notifySelection();`,
'rectangle module state',
);

replaceOnce(
`  function getSingleSelectedModuleGroup() {\n    const moduleIds = new Set(\n      [...selectedSurfaces].map((surface) => surface.userData?.moduleId).filter(Boolean),\n    );\n    if (moduleIds.size !== 1) return null;\n    const [moduleId] = moduleIds;\n    return wallRoot.children.find((group) => (\n      group.userData?.moduleState?.id === moduleId || group.userData?.moduleId === moduleId\n    )) ?? null;\n  }`,
`  function getSingleSelectedModuleGroup() {\n    let moduleId = selectedModuleId;\n    if (!moduleId) {\n      const moduleIds = new Set(\n        [...selectedSurfaces].map((surface) => surface.userData?.moduleId).filter(Boolean),\n      );\n      if (moduleIds.size !== 1) return null;\n      [moduleId] = moduleIds;\n    }\n    return wallRoot.children.find((group) => (\n      group.userData?.moduleState?.id === moduleId || group.userData?.moduleId === moduleId\n    )) ?? null;\n  }`,
'rotate uses module selection',
);

replaceOnce(
`  function handleSurfaceSelectionAt(clientX, clientY, rectangleSelect) {`,
`  function handleSurfaceSelectionAt(clientX, clientY, rectangleSelect, fallbackModuleId = null) {`,
'handler signature',
);

replaceOnce(
`    if (!rectangleSelect && activeFloor.visible) {\n      const floorHit = raycaster.intersectObject(activeFloor, false)[0];\n      if (floorHit) {\n        clearSelection({ notify: false });\n        floorSelected = true;\n        notifyFloorSelection();\n        return;\n      }\n    }\n\n    if (!rectangleSelect) clearSelection();`,
`    if (!rectangleSelect && fallbackModuleId) {\n      selectModuleOnly(fallbackModuleId);\n      return;\n    }\n\n    if (!rectangleSelect && activeFloor.visible) {\n      const floorHit = raycaster.intersectObject(activeFloor, false)[0];\n      if (floorHit) {\n        clearSelection({ notify: false });\n        selectedModuleId = null;\n        floorSelected = true;\n        notifyFloorSelection();\n        return;\n      }\n    }\n\n    if (!rectangleSelect) {\n      selectedModuleId = null;\n      clearSelection();\n    }`,
'fallback module selection',
);

replaceOnce(
`    const moduleState = picked.moduleGroup.userData.moduleState;\n    if (!moduleState) {`,
`    const moduleState = picked.moduleGroup.userData.moduleState;\n    if (moduleState) selectedModuleId = moduleState.id;\n    if (!moduleState) {`,
'pointerdown module activation',
);

replaceOnce(
`  renderer.domElement.addEventListener('pointerup', (event) => {\n    if (!dragSession || event.pointerId !== dragSession.pointerId) return;\n    const startClientX = dragSession.startClientX;\n    const startClientY = dragSession.startClientY;\n    const wasDragging = finishPlacementDrag(event);\n    if (!wasDragging) handleSurfaceSelectionAt(startClientX, startClientY, false);\n  });`,
`  renderer.domElement.addEventListener('pointerup', (event) => {\n    if (!dragSession || event.pointerId !== dragSession.pointerId) return;\n    const startClientX = dragSession.startClientX;\n    const startClientY = dragSession.startClientY;\n    const clickedModuleId = dragSession.moduleState?.id ?? null;\n    const wasDragging = finishPlacementDrag(event);\n    if (!wasDragging) {\n      handleSurfaceSelectionAt(startClientX, startClientY, false, clickedModuleId);\n    }\n  });`,
'pointerup preserves module',
);

replaceOnce(
`    clearSelection,\n    resetStageView,`,
`    clearSelection: (...args) => {\n      selectedModuleId = null;\n      return clearSelection(...args);\n    },\n    resetStageView,`,
'public clearSelection clears module',
);

fs.writeFileSync(path, text);
