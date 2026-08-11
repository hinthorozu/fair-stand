import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error(`Patch target not found: ${label}`);
  return `${source.slice(0, index)}${replacement}${source.slice(index + needle.length)}`;
}

// designState.js
{
  const file = 'src/designState.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `export function createShowcaseModuleState(type, widthCm = 100) {\n  if (type !== 'showcase-2' && type !== 'showcase-3') return null;\n\n  return {\n    id: createId('module'),\n    type,\n    widthCm,\n    strips: Array.from(\n      { length: STRIP_COUNT },\n      (_, stripIndex) => createEditablePanelState(stripIndex, DEFAULT_PANEL_COLOR),\n    ),\n  };\n}\n`,
    `export function createShowcaseModuleState(type, widthCm = 100) {\n  if (type !== 'showcase-2' && type !== 'showcase-3') return null;\n\n  return {\n    id: createId('module'),\n    type,\n    widthCm,\n    strips: Array.from(\n      { length: STRIP_COUNT },\n      (_, stripIndex) => createEditablePanelState(stripIndex, DEFAULT_PANEL_COLOR),\n    ),\n  };\n}\n\nexport function createDoorModuleState(widthCm = 100) {\n  if (Number(widthCm) !== 100) return null;\n\n  return {\n    id: createId('module'),\n    type: 'door',\n    widthCm: 100,\n    // Kapı 2 m yüksekliğinde (alt 4 x 50 cm), üstte 3 x 50 cm panel kalır.\n    strips: Array.from(\n      { length: 3 },\n      (_, index) => createEditablePanelState(index + 4, DEFAULT_PANEL_COLOR),\n    ),\n    // Kapı kanadı tek başına renk ve görsel alabilen bağımsız bir yüzeydir.\n    surface: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n  };\n}\n`,
    'door state',
  );

  source = replaceOnce(
    source,
    `      ...strip,\n      id: createId('surface'),\n      stripIndex,\n      imageTransform: strip.imageTransform ? { ...strip.imageTransform } : createDefaultImageTransform(),\n`,
    `      ...strip,\n      id: createId('surface'),\n      stripIndex: Number.isInteger(strip.stripIndex) ? strip.stripIndex : stripIndex,\n      imageTransform: strip.imageTransform ? { ...strip.imageTransform } : createDefaultImageTransform(),\n`,
    'preserve physical strip index',
  );

  source = replaceOnce(
    source,
    `  if (duplicate.surface) {\n    duplicate.surface = {\n      ...duplicate.surface,\n      id: createId('surface'),\n    };\n  }\n`,
    `  if (duplicate.surface) {\n    duplicate.surface = {\n      ...duplicate.surface,\n      id: createId('surface'),\n      ...(\n        'imageAssetId' in duplicate.surface\n          ? {\n              imageTransform: duplicate.surface.imageTransform\n                ? { ...duplicate.surface.imageTransform }\n                : createDefaultImageTransform(),\n            }\n          : {}\n      ),\n    };\n  }\n`,
    'duplicate door surface image state',
  );

  fs.writeFileSync(file, source);
}

// main.js
{
  const file = 'src/main.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  createFlatPanelModuleState,\n  createSeparatorModuleState,\n  createShowcaseModuleState,\n`,
    `  createDoorModuleState,\n  createFlatPanelModuleState,\n  createSeparatorModuleState,\n  createShowcaseModuleState,\n`,
    'main door import',
  );

  source = replaceOnce(
    source,
    `      if (moduleType === 'separator') {\n        selectionInfo.textContent = \`Modül \${moduleIndex + 1} · Separatör \${widthCm} cm · yalnızca renk uygulanabilir.\`;\n        return;\n      }\n\n      if (moduleType === 'showcase-3' || moduleType === 'showcase-2') {\n`,
    `      if (moduleType === 'separator') {\n        selectionInfo.textContent = \`Modül \${moduleIndex + 1} · Separatör \${widthCm} cm · yalnızca renk uygulanabilir.\`;\n        return;\n      }\n\n      if (moduleType === 'door') {\n        selectionInfo.textContent = surface.userData.surfaceRole === 'door'\n          ? \`Modül \${moduleIndex + 1} · Kapı \${widthCm} cm · kapı yüzeyi · renk + görsel uygulanabilir.\`\n          : \`Modül \${moduleIndex + 1} · Kapı \${widthCm} cm · üst \${stripNumber}. panel · renk + görsel uygulanabilir.\`;\n        return;\n      }\n\n      if (moduleType === 'showcase-3' || moduleType === 'showcase-2') {\n`,
    'door selection info',
  );

  source = replaceOnce(
    source,
    `  if (module.type === 'flat-panel') state = createFlatPanelModuleState(module.widthCm);\n  else if (module.type === 'separator') state = createSeparatorModuleState(module.widthCm);\n  else if (module.type === 'showcase-2' || module.type === 'showcase-3') {\n`,
    `  if (module.type === 'flat-panel') state = createFlatPanelModuleState(module.widthCm);\n  else if (module.type === 'separator') state = createSeparatorModuleState(module.widthCm);\n  else if (module.type === 'door') state = createDoorModuleState(module.widthCm);\n  else if (module.type === 'showcase-2' || module.type === 'showcase-3') {\n`,
    'create catalog door state',
  );

  fs.writeFileSync(file, source);
}

// moduleDragSidebar.js
{
  const file = 'src/moduleDragSidebar.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  'SEPARATOR_50',\n  'SHOWCASE_3_100',\n  'SHOWCASE_2_100',\n`,
    `  'SEPARATOR_50',\n  'DOOR_100',\n  'SHOWCASE_3_100',\n  'SHOWCASE_2_100',\n`,
    'sidebar door key',
  );

  source = replaceOnce(
    source,
    `    .module-drag-showcase[data-eyes='3']::after { content:''; position:absolute; left:4px; right:4px; top:42px; height:1px; background:#9fbfa5; }\n    .viewport-wrap.catalog-drag-active`,
    `    .module-drag-showcase[data-eyes='3']::after { content:''; position:absolute; left:4px; right:4px; top:42px; height:1px; background:#9fbfa5; }\n    .module-drag-door { position:relative; height:68px; border:3px solid #8a929a; background:linear-gradient(to bottom,#f7f7f5 0 13%,#c4c9ce 13% 14%,#f7f7f5 14% 27%,#c4c9ce 27% 28%,#f7f7f5 28% 42%,#747b82 42% 45%,#e5e7eb 45% 100%); box-shadow:0 2px 5px rgba(15,23,42,.08); }\n    .module-drag-door::after { content:''; position:absolute; right:3px; bottom:19px; width:3px; height:3px; border-radius:50%; background:#4b5563; }\n    .viewport-wrap.catalog-drag-active`,
    'sidebar door style',
  );

  source = replaceOnce(
    source,
    `  if (module.type === 'showcase-2' || module.type === 'showcase-3') {\n`,
    `  if (module.type === 'door') {\n    const body = document.createElement('div');\n    body.className = 'module-drag-door';\n    body.style.width = \`\${previewWidthPx(module.widthCm)}px\`;\n    preview.appendChild(body);\n    return preview;\n  }\n\n  if (module.type === 'showcase-2' || module.type === 'showcase-3') {\n`,
    'sidebar door preview',
  );

  fs.writeFileSync(file, source);
}

// moduleContextMenu.js
{
  const file = 'src/moduleContextMenu.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  'SEPARATOR_50',\n  'SHOWCASE_3_100',\n  'SHOWCASE_2_100',\n`,
    `  'SEPARATOR_50',\n  'DOOR_100',\n  'SHOWCASE_3_100',\n  'SHOWCASE_2_100',\n`,
    'picker door key',
  );

  source = replaceOnce(
    source,
    `  function createModulePreview(module) {\n    if (module.type === 'separator') return createSeparatorPreview(module.widthCm);\n`,
    `  function createDoorPreview(widthCm) {\n    const preview = document.createElement('div');\n    preview.className = 'module-card-preview';\n\n    const frame = document.createElement('div');\n    frame.className = 'module-card-flat-panel';\n    frame.style.position = 'relative';\n    frame.style.width = \`\${Math.max(30, Math.round((widthCm / 200) * 118))}px\`;\n\n    for (let index = 0; index < 3; index += 1) {\n      const strip = document.createElement('span');\n      strip.className = 'module-card-strip';\n      strip.style.flex = '1 1 0';\n      frame.appendChild(strip);\n    }\n\n    const door = document.createElement('div');\n    door.style.position = 'relative';\n    door.style.flex = '4 4 0';\n    door.style.minHeight = '0';\n    door.style.borderTop = '3px solid #747b82';\n    door.style.background = '#e5e7eb';\n\n    const handle = document.createElement('span');\n    handle.style.position = 'absolute';\n    handle.style.right = '6px';\n    handle.style.top = '50%';\n    handle.style.width = '4px';\n    handle.style.height = '4px';\n    handle.style.borderRadius = '50%';\n    handle.style.background = '#4b5563';\n    door.appendChild(handle);\n    frame.appendChild(door);\n\n    preview.appendChild(frame);\n    return preview;\n  }\n\n  function createModulePreview(module) {\n    if (module.type === 'separator') return createSeparatorPreview(module.widthCm);\n    if (module.type === 'door') return createDoorPreview(module.widthCm);\n`,
    'picker door preview',
  );

  fs.writeFileSync(file, source);
}

// scene3d.js
{
  const file = 'src/scene3d.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `      if (moduleState.type === 'separator') {\n        module = createSeparatorModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'showcase-2' || moduleState.type === 'showcase-3') {\n`,
    `      if (moduleState.type === 'separator') {\n        module = createSeparatorModule(moduleState, moduleIndex);\n      } else if (moduleState.type === 'door') {\n        module = createDoorModule(\n          moduleState,\n          moduleIndex,\n          (surface) => applyStoredImage(surface),\n        );\n      } else if (moduleState.type === 'showcase-2' || moduleState.type === 'showcase-3') {\n`,
    'scene build door',
  );

  source = replaceOnce(
    source,
    `    if (moduleState?.type === 'separator') return \`Separatör \${widthCm}\`;\n    if (moduleState?.type === 'showcase-3') return \`3 Gözlü Vitrin \${widthCm}\`;\n`,
    `    if (moduleState?.type === 'separator') return \`Separatör \${widthCm}\`;\n    if (moduleState?.type === 'door') return \`Kapı \${widthCm}\`;\n    if (moduleState?.type === 'showcase-3') return \`3 Gözlü Vitrin \${widthCm}\`;\n`,
    'door drag label',
  );

  source = replaceOnce(
    source,
    `      if (moduleState?.type === 'separator') {\n        preview.style.background = 'repeating-linear-gradient(to bottom,#c79b63 0 2px,#eef2f6 2px 4px)';\n      } else if (moduleState?.type === 'showcase-2' || moduleState?.type === 'showcase-3') {\n`,
    `      if (moduleState?.type === 'separator') {\n        preview.style.background = 'repeating-linear-gradient(to bottom,#c79b63 0 2px,#eef2f6 2px 4px)';\n      } else if (moduleState?.type === 'door') {\n        preview.style.background = 'linear-gradient(to bottom,#f7f7f5 0 40%,#8a929a 40% 44%,#e5e7eb 44% 100%)';\n      } else if (moduleState?.type === 'showcase-2' || moduleState?.type === 'showcase-3') {\n`,
    'door drag badge',
  );

  const doorFunction = String.raw`
function createDoorModule(moduleState, moduleIndex, onSurfaceReady) {
  const {
    height,
    depth,
    stripHeight,
    frameWidth,
    frameDepth,
  } = STAND_DIMENSIONS;

  const widthCm = Number(moduleState.widthCm) || 100;
  const widthM = widthCm / 100;
  const doorHeight = stripHeight * 4;
  const upperPanelCount = 3;
  const railHeight = 0.026;
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: moduleState.type,
    widthCm,
  };

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });

  const profileGeometry = new THREE.BoxGeometry(frameWidth, height, frameDepth);
  for (const side of [-1, 1]) {
    const profile = new THREE.Mesh(profileGeometry.clone(), frameMaterial.clone());
    profile.position.set(side * (widthM / 2 - frameWidth / 2), height / 2, 0);
    profile.castShadow = true;
    group.add(profile);
  }

  const railGeometry = new THREE.BoxGeometry(
    Math.max(widthM - frameWidth * 2, 0.02),
    railHeight,
    frameDepth,
  );
  const railYs = [
    0,
    doorHeight,
    doorHeight + stripHeight,
    doorHeight + stripHeight * 2,
    height,
  ];
  railYs.forEach((y) => {
    const rail = new THREE.Mesh(railGeometry.clone(), frameMaterial.clone());
    rail.position.set(0, y, 0);
    rail.castShadow = true;
    group.add(rail);
  });

  const surfaces = [];
  const innerWidth = Math.max(widthM - frameWidth * 2 - 0.012, 0.02);
  const panelDepth = Math.max(depth - 0.026, 0.035);

  // Alt bölüm: kapalı kapı kanadı. Sahne düzleminden dışarı açılmaz.
  const doorState = moduleState.surface;
  const doorPanelHeight = Math.max(doorHeight - railHeight - 0.018, 0.1);
  const doorBacking = new THREE.Mesh(
    new THREE.BoxGeometry(innerWidth, doorPanelHeight, panelDepth),
    new THREE.MeshStandardMaterial({
      color: PANEL_BACK_COLOR,
      roughness: 0.74,
    }),
  );
  doorBacking.position.set(0, doorHeight / 2, 0);
  doorBacking.castShadow = true;
  doorBacking.receiveShadow = true;
  group.add(doorBacking);

  const doorSurface = new THREE.Mesh(
    new THREE.PlaneGeometry(innerWidth, doorPanelHeight),
    new THREE.MeshStandardMaterial({
      color: doorState?.imageAssetId ? 0xffffff : (doorState?.color ?? '#ffffff'),
      roughness: 0.72,
      metalness: 0,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      emissiveIntensity: 0,
    }),
  );
  doorSurface.position.set(0, doorHeight / 2, depth / 2 + 0.0015);
  const doorSelectionFrame = createSelectionFrame(innerWidth, doorPanelHeight);
  doorSelectionFrame.visible = false;
  doorSurface.add(doorSelectionFrame);
  doorSurface.userData = {
    kind: 'surface',
    moduleType: 'door',
    selectionMode: 'module',
    acceptsImage: true,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'door',
    surfaceId: doorState.id,
    surfaceState: doorState,
    selectionFrame: doorSelectionFrame,
    backing: doorBacking,
  };
  group.add(doorSurface);
  surfaces.push(doorSurface);
  onSurfaceReady?.(doorSurface);

  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.032, 0.032),
    new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.55, roughness: 0.3 }),
  );
  handle.position.set(innerWidth / 2 - 0.13, doorHeight * 0.52, depth / 2 + 0.025);
  handle.castShadow = true;
  group.add(handle);

  // Üst bölüm: fiziksel olarak 4., 5. ve 6. strip indexlerine denk gelen 3 panel.
  for (let index = 0; index < upperPanelCount; index += 1) {
    const surfaceState = moduleState.strips[index];
    if (!surfaceState) continue;
    const centerY = doorHeight + index * stripHeight + stripHeight / 2;
    const panelHeight = stripHeight - railHeight - 0.012;

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(innerWidth, panelHeight, panelDepth),
      new THREE.MeshStandardMaterial({
        color: surfaceState.isGlass ? GLASS_BACK_COLOR : PANEL_BACK_COLOR,
        roughness: surfaceState.isGlass ? 0.22 : 0.74,
        transparent: Boolean(surfaceState.isGlass),
        opacity: surfaceState.isGlass ? GLASS_BACK_OPACITY : 1,
        depthWrite: !surfaceState.isGlass,
      }),
    );
    backing.position.set(0, centerY, 0);
    backing.castShadow = !surfaceState.isGlass;
    backing.receiveShadow = true;
    group.add(backing);

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(innerWidth, panelHeight),
      new THREE.MeshStandardMaterial({
        color: surfaceState.imageAssetId
          ? 0xffffff
          : (surfaceState.isGlass ? GLASS_SURFACE_COLOR : surfaceState.color),
        roughness: surfaceState.isGlass ? 0.16 : 0.72,
        metalness: 0,
        transparent: Boolean(surfaceState.isGlass),
        opacity: surfaceState.isGlass ? GLASS_SURFACE_OPACITY : 1,
        depthWrite: !surfaceState.isGlass,
        side: THREE.DoubleSide,
        emissive: 0x000000,
        emissiveIntensity: 0,
      }),
    );
    surface.position.set(0, centerY, depth / 2 + 0.0015);

    const selectionFrame = createSelectionFrame(innerWidth, panelHeight);
    selectionFrame.visible = false;
    surface.add(selectionFrame);

    surface.userData = {
      kind: 'surface',
      moduleType: 'door',
      selectionMode: 'panel',
      acceptsImage: true,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex: surfaceState.stripIndex,
      stripNumber: index + 1,
      surfaceRole: 'upper-panel',
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
      backing,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  }

  return { group, surfaces };
}

`;

  source = replaceOnce(
    source,
    `function createSeparatorModule(moduleState, moduleIndex) {\n`,
    `${doorFunction}function createSeparatorModule(moduleState, moduleIndex) {\n`,
    'door renderer function',
  );

  fs.writeFileSync(file, source);
}

// designState tests
{
  const file = 'test/designState.test.js';
  let source = fs.readFileSync(file, 'utf8');

  source = replaceOnce(
    source,
    `  applyColorOverride,\n  createFlatPanelModuleState,\n`,
    `  applyColorOverride,\n  createDoorModuleState,\n  createFlatPanelModuleState,\n`,
    'door test import',
  );

  source += String.raw`

test('door state has three upper panels and one independent editable door surface', () => {
  const door = createDoorModuleState(100);

  assert.equal(door.type, 'door');
  assert.equal(door.widthCm, 100);
  assert.deepEqual(door.strips.map((strip) => strip.stripIndex), [4, 5, 6]);
  assert.equal(door.strips.length, 3);
  assert.equal(door.surface.color, '#ffffff');
  assert.equal(door.surface.imageAssetId, null);
  assert.equal(door.surface.imageTransform.mode, 'single');
  assert.equal(createDoorModuleState(50), null);
});

test('door surface color and image state is independent from upper panels and survives duplication', () => {
  const door = createDoorModuleState(100);
  door.surface.imageAssetId = 'door-art';
  door.surface.imageTransform.fit = 'cover';
  door.strips[1].color = '#123456';

  const duplicate = duplicateModuleState(door);

  assert.notEqual(duplicate.id, door.id);
  assert.notEqual(duplicate.surface.id, door.surface.id);
  assert.equal(duplicate.surface.imageAssetId, 'door-art');
  assert.equal(duplicate.surface.imageTransform.fit, 'cover');
  assert.equal(duplicate.strips[1].color, '#123456');
  assert.deepEqual(duplicate.strips.map((strip) => strip.stripIndex), [4, 5, 6]);

  applyColorOverride(duplicate.surface, '#ff6600');
  assert.equal(duplicate.surface.color, '#ff6600');
  assert.equal(duplicate.surface.imageAssetId, null);
  assert.equal(door.surface.imageAssetId, 'door-art');
});
`;

  fs.writeFileSync(file, source);
}
