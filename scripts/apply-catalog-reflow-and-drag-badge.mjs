import fs from 'node:fs';

function patchFile(path, patches) {
  let source = fs.readFileSync(path, 'utf8');
  for (const [label, needle, replacement] of patches) {
    const index = source.indexOf(needle);
    if (index < 0) throw new Error(`${path}: patch target not found: ${label}`);
    source = `${source.slice(0, index)}${replacement}${source.slice(index + needle.length)}`;
  }
  fs.writeFileSync(path, source);
}

patchFile('src/scene3d.js', [
  [
    'moduleMove import',
    "import { planContinuousModuleMove } from './moduleMove.js';",
    "import {\n  planContinuousModuleInsert,\n  planContinuousModuleMove,\n} from './moduleMove.js';",
  ],
  [
    'drag badge state',
    '  let placementGhost = null;\n  let dragSession = null;',
    '  let placementGhost = null;\n  let dragSession = null;\n  let dragBadge = null;',
  ],
  [
    'drag badge helpers',
    `  function showPlacementGhost(widthCm, placement, valid) {
    const ghost = ensurePlacementGhost(widthCm);
    ghost.mesh.material.color.setHex(valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR);
    applyPlacementToGroup(ghost.root, placement, widthCm);
    ghost.root.visible = true;
  }
`,
    `  function showPlacementGhost(widthCm, placement, valid) {
    const ghost = ensurePlacementGhost(widthCm);
    ghost.mesh.material.color.setHex(valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR);
    applyPlacementToGroup(ghost.root, placement, widthCm);
    ghost.root.visible = true;
  }

  function getDragModuleLabel(moduleState) {
    const widthCm = Number(moduleState?.widthCm) || 0;
    if (moduleState?.type === 'separator') return \`Separatör \${widthCm}\`;
    if (moduleState?.type === 'showcase-3') return \`3 Gözlü Vitrin \${widthCm}\`;
    if (moduleState?.type === 'showcase-2') return \`2 Gözlü Vitrin \${widthCm}\`;
    return \`Düz Panel \${widthCm}\`;
  }

  function disposeDragBadge() {
    dragBadge?.remove?.();
    dragBadge = null;
  }

  function updateDragBadge(moduleState, clientX, clientY) {
    if (!dragBadge) {
      dragBadge = document.createElement('div');
      dragBadge.style.cssText = [
        'position:fixed',
        'z-index:10000',
        'display:flex',
        'align-items:center',
        'gap:8px',
        'padding:7px 9px',
        'border:1px solid #d9dee5',
        'border-radius:9px',
        'background:rgba(255,255,255,.94)',
        'box-shadow:0 8px 24px rgba(15,23,42,.16)',
        'color:#364152',
        'font:600 11px/1.2 system-ui,sans-serif',
        'pointer-events:none',
        'user-select:none',
      ].join(';');

      const preview = document.createElement('div');
      preview.dataset.role = 'preview';
      preview.style.cssText = [
        'width:24px',
        'height:48px',
        'box-sizing:border-box',
        'border:2px solid #8a929a',
        'background:repeating-linear-gradient(to bottom,#f7f7f5 0 5px,#c4c9ce 5px 6px)',
      ].join(';');

      const label = document.createElement('span');
      label.dataset.role = 'label';
      dragBadge.append(preview, label);
      document.body.appendChild(dragBadge);
    }

    const preview = dragBadge.querySelector('[data-role="preview"]');
    const label = dragBadge.querySelector('[data-role="label"]');
    if (label) label.textContent = getDragModuleLabel(moduleState);
    if (preview) {
      if (moduleState?.type === 'separator') {
        preview.style.background = 'repeating-linear-gradient(to bottom,#c79b63 0 2px,#eef2f6 2px 4px)';
      } else if (moduleState?.type === 'showcase-2' || moduleState?.type === 'showcase-3') {
        preview.style.background = 'linear-gradient(to bottom,#f7f7f5 0 32%,#d8eadb 32% 72%,#f7f7f5 72% 100%)';
      } else {
        preview.style.background = 'repeating-linear-gradient(to bottom,#f7f7f5 0 5px,#c4c9ce 5px 6px)';
      }
    }

    dragBadge.style.left = \`\${clientX + 18}px\`;
    dragBadge.style.top = \`\${clientY + 18}px\`;
  }
`,
  ],
  [
    'clear drag badge',
    `  function clearPlacementDrag() {
    if (dragSession?.moduleGroup) dragSession.moduleGroup.visible = true;
    dragSession = null;
    controls.enabled = true;
    disposePlacementGhost();
  }
`,
    `  function clearPlacementDrag() {
    if (dragSession?.moduleGroup) dragSession.moduleGroup.visible = true;
    dragSession = null;
    controls.enabled = true;
    disposePlacementGhost();
    disposeDragBadge();
  }
`,
  ],
  [
    'catalog preview reflow',
    `    const validation = validatePlacementAgainstModules({
      placement: snapped.placement,
      widthCm: moduleState.widthCm,
      moduleId: moduleState.id,
      modules: getRenderedModuleStates(),
      standType: stageLayout.standType,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
    });

    showPlacementGhost(moduleState.widthCm, snapped.placement, validation.ok);
    return {
      ok: validation.ok,
      placement: { ...snapped.placement },
      message: validation.message ?? null,
    };
`,
    `    const plan = planContinuousModuleInsert({
      modules: getRenderedModuleStates(),
      insertedModule: moduleState,
      desiredPlacement: snapped.placement,
      standType: stageLayout.standType,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
    });

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
`,
  ],
  [
    'existing drag badge update',
    `    dragSession.dragging = true;
    dragSession.moduleGroup.visible = false;

    const ground = getGroundPoint(event.clientX, event.clientY);`,
    `    dragSession.dragging = true;
    dragSession.moduleGroup.visible = false;
    updateDragBadge(dragSession.moduleState, event.clientX, event.clientY);

    const ground = getGroundPoint(event.clientX, event.clientY);`,
  ],
  [
    'finish drag badge cleanup',
    `    dragSession = null;
    controls.enabled = true;
    disposePlacementGhost();

    try {`,
    `    dragSession = null;
    controls.enabled = true;
    disposePlacementGhost();
    disposeDragBadge();

    try {`,
  ],
]);

patchFile('src/main.js', [
  [
    'catalog drop plan apply',
    `    moduleState.placement = { ...result.placement };
    currentModules.push(moduleState);
    rebuildWall({ resetView: false });`,
    `    if (result.plan?.placements instanceof Map && result.plan?.orderedModuleIds?.length) {
      applyContinuousInsertionPlan(result.plan, [moduleState]);
    } else {
      moduleState.placement = { ...result.placement };
      currentModules.push(moduleState);
    }
    rebuildWall({ resetView: false });`,
  ],
]);

console.log('Catalog reflow + existing drag badge patch applied.');
