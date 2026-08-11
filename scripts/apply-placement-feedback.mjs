import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

scene = replaceOnce(
  scene,
  `  let placementGhost = null;\n  let dragSession = null;\n  let dragBadge = null;\n`,
  `  let placementGhost = null;\n  let dragSession = null;\n  let dragBadge = null;\n  let placementFeedback = null;\n  let placementFeedbackTimer = null;\n\n  function clearPlacementFeedback() {\n    if (placementFeedbackTimer) {\n      window.clearTimeout(placementFeedbackTimer);\n      placementFeedbackTimer = null;\n    }\n    placementFeedback?.remove?.();\n    placementFeedback = null;\n  }\n\n  function showPlacementFeedback(message, { clientX = null, clientY = null, durationMs = 0 } = {}) {\n    const text = String(message ?? '').trim();\n    if (!text) {\n      clearPlacementFeedback();\n      return;\n    }\n\n    if (placementFeedbackTimer) {\n      window.clearTimeout(placementFeedbackTimer);\n      placementFeedbackTimer = null;\n    }\n\n    if (!placementFeedback) {\n      placementFeedback = document.createElement('div');\n      placementFeedback.style.cssText = [\n        'position:fixed',\n        'z-index:10002',\n        'max-width:320px',\n        'padding:8px 11px',\n        'border:1px solid rgba(220,38,38,.35)',\n        'border-radius:9px',\n        'background:rgba(127,29,29,.94)',\n        'box-shadow:0 8px 24px rgba(15,23,42,.2)',\n        'color:#fff',\n        'font:600 12px/1.35 system-ui,sans-serif',\n        'pointer-events:none',\n        'user-select:none',\n      ].join(';');\n      document.body.appendChild(placementFeedback);\n    }\n\n    placementFeedback.textContent = text;\n    const rect = renderer.domElement.getBoundingClientRect();\n    const hasPointer = Number.isFinite(Number(clientX)) && Number.isFinite(Number(clientY));\n    const rawX = hasPointer ? Number(clientX) + 18 : rect.left + rect.width / 2;\n    const rawY = hasPointer ? Number(clientY) + 18 : rect.top + 18;\n    const x = Math.min(window.innerWidth - 20, Math.max(20, rawX));\n    const y = Math.min(window.innerHeight - 52, Math.max(12, rawY));\n    placementFeedback.style.left = \`${'${x}'}px\`;\n    placementFeedback.style.top = \`${'${y}'}px\`;\n    placementFeedback.style.transform = hasPointer ? 'none' : 'translateX(-50%)';\n\n    if (durationMs > 0) {\n      placementFeedbackTimer = window.setTimeout(() => {\n        clearPlacementFeedback();\n      }, durationMs);\n    }\n  }\n`,
  'feedback state',
);

scene = replaceOnce(
  scene,
  `  function clearPlacementDrag() {\n    if (dragSession?.moduleGroup) dragSession.moduleGroup.visible = true;\n    dragSession = null;\n    controls.enabled = true;\n    disposePlacementGhost();\n    disposeDragBadge();\n  }\n`,
  `  function clearPlacementDrag() {\n    if (dragSession?.moduleGroup) dragSession.moduleGroup.visible = true;\n    dragSession = null;\n    controls.enabled = true;\n    disposePlacementGhost();\n    disposeDragBadge();\n    clearPlacementFeedback();\n  }\n`,
  'clear placement feedback',
);

const oldRotate = `  function rotateSelectedModule(deltaDeg) {\n    if (!stageLayout || dragSession?.dragging) return false;\n    const moduleGroup = getSingleSelectedModuleGroup();\n    const moduleState = moduleGroup?.userData?.moduleState;\n    if (!moduleGroup || !moduleState?.placement) return false;\n\n    const nextPlacement = rotateModulePlacementAroundCenter(\n      moduleState.placement,\n      moduleState.widthCm,\n      deltaDeg,\n    );\n    if (!nextPlacement) return false;\n    nextPlacement.wallId = inferWallIdForRotation(\n      nextPlacement,\n      nextPlacement.rotationZDeg,\n    );\n\n    const validation = validatePlacementAgainstModules({\n      placement: nextPlacement,\n      widthCm: moduleState.widthCm,\n      moduleId: moduleState.id,\n      modules: getRenderedModuleStates(),\n      standType: stageLayout.standType,\n      standXCm: stageLayout.widthCm,\n      standYCm: stageLayout.depthCm,\n    });\n    if (!validation.ok) return false;\n\n    moduleState.placement = { ...nextPlacement };\n    moduleGroup.userData.placement = { ...nextPlacement };\n    applyPlacementToGroup(moduleGroup, nextPlacement, moduleState.widthCm);\n    return true;\n  }\n`;

const newRotate = `  function rotateSelectedModule(deltaDeg) {\n    if (!stageLayout || dragSession?.dragging) return { handled: false, ok: false };\n    const moduleGroup = getSingleSelectedModuleGroup();\n    const moduleState = moduleGroup?.userData?.moduleState;\n    if (!moduleGroup || !moduleState?.placement) return { handled: false, ok: false };\n\n    const nextPlacement = rotateModulePlacementAroundCenter(\n      moduleState.placement,\n      moduleState.widthCm,\n      deltaDeg,\n    );\n    if (!nextPlacement) return { handled: false, ok: false };\n    nextPlacement.wallId = inferWallIdForRotation(\n      nextPlacement,\n      nextPlacement.rotationZDeg,\n    );\n\n    const validation = validatePlacementAgainstModules({\n      placement: nextPlacement,\n      widthCm: moduleState.widthCm,\n      moduleId: moduleState.id,\n      modules: getRenderedModuleStates(),\n      standType: stageLayout.standType,\n      standXCm: stageLayout.widthCm,\n      standYCm: stageLayout.depthCm,\n    });\n    if (!validation.ok) {\n      const message = validation.message ?? 'Modül bu yönde döndürülemez.';\n      showPlacementGhost(moduleState.widthCm, nextPlacement, false);\n      showPlacementFeedback(message, { durationMs: 1800 });\n      window.setTimeout(() => {\n        if (!dragSession?.dragging) disposePlacementGhost();\n      }, 850);\n      return { handled: true, ok: false, message };\n    }\n\n    clearPlacementFeedback();\n    disposePlacementGhost();\n    moduleState.placement = { ...nextPlacement };\n    moduleGroup.userData.placement = { ...nextPlacement };\n    applyPlacementToGroup(moduleGroup, nextPlacement, moduleState.widthCm);\n    return { handled: true, ok: true };\n  }\n`;
scene = replaceOnce(scene, oldRotate, newRotate, 'selected rotation feedback');

scene = replaceOnce(
  scene,
  `    if (!stageLayout || !moduleState) {\n      disposePlacementGhost();\n      return { ok: false, message: 'Önce stand alanını oluştur.' };\n    }\n\n    const ground = getGroundPoint(clientX, clientY);\n    if (!ground) {\n      disposePlacementGhost();\n      return { ok: false, message: 'Modülü aktif stand alanına bırak.' };\n    }\n`,
  `    if (!stageLayout || !moduleState) {\n      disposePlacementGhost();\n      const message = 'Önce stand alanını oluştur.';\n      showPlacementFeedback(message, { clientX, clientY });\n      return { ok: false, message };\n    }\n\n    const ground = getGroundPoint(clientX, clientY);\n    if (!ground) {\n      disposePlacementGhost();\n      const message = 'Modülü aktif stand alanına bırak.';\n      showPlacementFeedback(message, { clientX, clientY });\n      return { ok: false, message };\n    }\n`,
  'catalog early feedback',
);

scene = replaceOnce(
  scene,
  `    if (!snapped.ok || !snapped.placement) {\n      disposePlacementGhost();\n      return {\n        ok: false,\n        message: snapped.message ?? 'Bu konuma modül yerleştirilemedi.',\n      };\n    }\n`,
  `    if (!snapped.ok || !snapped.placement) {\n      disposePlacementGhost();\n      const message = snapped.message ?? 'Bu konuma modül yerleştirilemedi.';\n      showPlacementFeedback(message, { clientX, clientY });\n      return {\n        ok: false,\n        message,\n      };\n    }\n`,
  'catalog snap feedback',
);

scene = replaceOnce(
  scene,
  `    showPlacementGhost(moduleState.widthCm, previewPlacement, plan.ok);\n    return {\n      ok: plan.ok,\n`,
  `    showPlacementGhost(moduleState.widthCm, previewPlacement, plan.ok);\n    if (plan.ok) clearPlacementFeedback();\n    else showPlacementFeedback(plan.message ?? 'Bu konuma modül yerleştirilemez.', { clientX, clientY });\n    return {\n      ok: plan.ok,\n`,
  'catalog plan feedback',
);

scene = replaceOnce(
  scene,
  `    const result = previewCatalogModuleDrag(\n      moduleState,\n      clientX,\n      clientY,\n      preferredRotationZDeg,\n      rotationLocked,\n    );\n    disposePlacementGhost();\n    return result;\n`,
  `    const result = previewCatalogModuleDrag(\n      moduleState,\n      clientX,\n      clientY,\n      preferredRotationZDeg,\n      rotationLocked,\n    );\n    disposePlacementGhost();\n    if (result.ok) clearPlacementFeedback();\n    else showPlacementFeedback(result.message ?? 'Bu konuma modül yerleştirilemez.', {\n      clientX,\n      clientY,\n      durationMs: 1800,\n    });\n    return result;\n`,
  'catalog drop feedback',
);

scene = replaceOnce(
  scene,
  `  function clearCatalogModuleDrag() {\n    disposePlacementGhost();\n  }\n`,
  `  function clearCatalogModuleDrag() {\n    disposePlacementGhost();\n    clearPlacementFeedback();\n  }\n`,
  'catalog clear feedback',
);

scene = replaceOnce(
  scene,
  `    const ground = getGroundPoint(event.clientX, event.clientY);\n    if (!ground) {\n      disposePlacementGhost();\n      dragSession.preview = null;\n      return;\n    }\n`,
  `    const ground = getGroundPoint(event.clientX, event.clientY);\n    if (!ground) {\n      disposePlacementGhost();\n      dragSession.preview = null;\n      showPlacementFeedback('Modülü aktif stand alanına bırak.', {\n        clientX: event.clientX,\n        clientY: event.clientY,\n      });\n      return;\n    }\n`,
  'existing drag ground feedback',
);

scene = replaceOnce(
  scene,
  `    if (!snapped.ok || !snapped.placement) {\n      dragSession.preview = null;\n      disposePlacementGhost();\n      return;\n    }\n`,
  `    if (!snapped.ok || !snapped.placement) {\n      dragSession.preview = null;\n      disposePlacementGhost();\n      showPlacementFeedback(snapped.message ?? 'Bu konuma modül yerleştirilemez.', {\n        clientX: event.clientX,\n        clientY: event.clientY,\n      });\n      return;\n    }\n`,
  'existing drag snap feedback',
);

scene = replaceOnce(
  scene,
  `    showPlacementGhost(moduleState.widthCm, previewPlacement, plan.ok);\n  }\n\n  function finishPlacementDrag(event) {\n`,
  `    showPlacementGhost(moduleState.widthCm, previewPlacement, plan.ok);\n    if (plan.ok) clearPlacementFeedback();\n    else showPlacementFeedback(plan.message ?? 'Bu konuma modül yerleştirilemez.', {\n      clientX: event.clientX,\n      clientY: event.clientY,\n    });\n  }\n\n  function finishPlacementDrag(event) {\n`,
  'existing drag plan feedback',
);

scene = replaceOnce(
  scene,
  `    if (wasDragging && preview?.valid) {\n      const plannedPlacements = preview.plan?.placements instanceof Map\n`,
  `    if (wasDragging && preview?.valid) {\n      clearPlacementFeedback();\n      const plannedPlacements = preview.plan?.placements instanceof Map\n`,
  'valid drop clear feedback',
);

scene = replaceOnce(
  scene,
  `      clearSelection();\n    }\n\n    dragSession = null;\n`,
  `      clearSelection();\n    } else if (wasDragging && preview && !preview.valid) {\n      showPlacementFeedback(preview.message ?? 'Bu konuma modül yerleştirilemez.', {\n        clientX: event.clientX,\n        clientY: event.clientY,\n        durationMs: 1800,\n      });\n    }\n\n    dragSession = null;\n`,
  'invalid drop persistent feedback',
);

scene = replaceOnce(
  scene,
  `    if (rotateSelectedModule(deltaDeg)) event.preventDefault();\n`,
  `    const rotationResult = rotateSelectedModule(deltaDeg);\n    if (rotationResult.handled) event.preventDefault();\n`,
  'keydown rotation result',
);

fs.writeFileSync(scenePath, scene);

const placementPath = 'src/modulePlacement.js';
let placement = fs.readFileSync(placementPath, 'utf8');
placement = replaceOnce(
  placement,
  `      message: 'Bu konumda başka bir modül var.',\n`,
  `      message: 'Başka bir modülle çakışıyor.',\n`,
  'collision message',
);
fs.writeFileSync(placementPath, placement);
