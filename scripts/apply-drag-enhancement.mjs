import fs from 'node:fs';

const file = 'src/scene3d.js';
let source = fs.readFileSync(file, 'utf8');

function replaceOnce(needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  if (source.indexOf(needle, index + needle.length) >= 0 && label === 'import') {
    throw new Error(`Patch target is not unique: ${label}`);
  }
  source = `${source.slice(0, index)}${replacement}${source.slice(index + needle.length)}`;
}

replaceOnce(
  `} from './modulePlacement.js';\n`,
  `} from './modulePlacement.js';\nimport { planContinuousModuleMove } from './moduleMove.js';\n`,
  'import',
);

const oldUpdate = `  function updatePlacementDrag(event) {
    if (!dragSession || !stageLayout) return;
    const distance = Math.hypot(
      event.clientX - dragSession.startClientX,
      event.clientY - dragSession.startClientY,
    );
    if (!dragSession.dragging && distance < DRAG_THRESHOLD_PX) return;

    dragSession.dragging = true;
    dragSession.moduleGroup.visible = false;

    const ground = getGroundPoint(event.clientX, event.clientY);
    if (!ground) {
      disposePlacementGhost();
      dragSession.preview = null;
      return;
    }

    const moduleState = dragSession.moduleState;
    const snapped = snapPlacementToStand({
      standType: stageLayout.standType,
      widthCm: moduleState.widthCm,
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
      preferredRotationZDeg: moduleState.placement?.rotationZDeg ?? 0,
    });

    if (!snapped.ok || !snapped.placement) {
      dragSession.preview = null;
      disposePlacementGhost();
      return;
    }

    const validation = validatePlacementAgainstModules({
      placement: snapped.placement,
      widthCm: moduleState.widthCm,
      moduleId: moduleState.id,
      modules: getRenderedModuleStates(),
      standType: stageLayout.standType,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
    });

    dragSession.preview = {
      placement: snapped.placement,
      valid: validation.ok,
      message: validation.message ?? null,
    };
    showPlacementGhost(moduleState.widthCm, snapped.placement, validation.ok);
  }
`;

const newUpdate = `  function updatePlacementDrag(event) {
    if (!dragSession || !stageLayout) return;
    const distance = Math.hypot(
      event.clientX - dragSession.startClientX,
      event.clientY - dragSession.startClientY,
    );
    if (!dragSession.dragging && distance < DRAG_THRESHOLD_PX) return;

    dragSession.dragging = true;
    dragSession.moduleGroup.visible = false;

    const ground = getGroundPoint(event.clientX, event.clientY);
    if (!ground) {
      disposePlacementGhost();
      dragSession.preview = null;
      return;
    }

    const moduleState = dragSession.moduleState;
    const snapped = snapPlacementToStand({
      standType: stageLayout.standType,
      widthCm: moduleState.widthCm,
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
      preferredRotationZDeg: moduleState.placement?.rotationZDeg ?? 0,
    });

    if (!snapped.ok || !snapped.placement) {
      dragSession.preview = null;
      disposePlacementGhost();
      return;
    }

    let plan;
    if (stageLayout.standType === 'island') {
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
    showPlacementGhost(moduleState.widthCm, previewPlacement, plan.ok);
  }
`;

replaceOnce(oldUpdate, newUpdate, 'updatePlacementDrag');

const oldFinish = `  function finishPlacementDrag(event) {
    if (!dragSession) return false;

    const session = dragSession;
    const wasDragging = session.dragging;
    const preview = session.preview;
    session.moduleGroup.visible = true;

    if (wasDragging && preview?.valid) {
      session.moduleState.placement = { ...preview.placement };
      session.moduleGroup.userData.placement = { ...preview.placement };
      applyPlacementToGroup(
        session.moduleGroup,
        session.moduleState.placement,
        session.moduleState.widthCm,
      );
      clearSelection();
    }

    dragSession = null;
    controls.enabled = true;
    disposePlacementGhost();

    try {
      renderer.domElement.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }

    return wasDragging;
  }
`;

const newFinish = `  function finishPlacementDrag(event) {
    if (!dragSession) return false;

    const session = dragSession;
    const wasDragging = session.dragging;
    const preview = session.preview;
    session.moduleGroup.visible = true;

    if (wasDragging && preview?.valid) {
      const plannedPlacements = preview.plan?.placements instanceof Map
        ? preview.plan.placements
        : new Map([[session.moduleState.id, { ...preview.placement }]]);

      plannedPlacements.forEach((placement, moduleId) => {
        const moduleGroup = wallRoot.children.find((group) => (
          group.userData?.moduleState?.id === moduleId
          || group.userData?.moduleId === moduleId
        ));
        const moduleState = moduleGroup?.userData?.moduleState;
        if (!moduleGroup || !moduleState) return;

        moduleState.placement = { ...placement };
        moduleGroup.userData.placement = { ...placement };
        applyPlacementToGroup(moduleGroup, placement, moduleState.widthCm);
      });
      clearSelection();
    }

    dragSession = null;
    controls.enabled = true;
    disposePlacementGhost();

    try {
      renderer.domElement.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }

    return wasDragging;
  }
`;

replaceOnce(oldFinish, newFinish, 'finishPlacementDrag');

fs.writeFileSync(file, source);
console.log('scene3d drag enhancement applied');
