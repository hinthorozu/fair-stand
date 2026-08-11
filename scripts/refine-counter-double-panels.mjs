import fs from 'node:fs';

function replaceBlock(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`${label} block not found`);
  return source.slice(0, start) + replacement + source.slice(end);
}

// 1) Counter state: six truly independent editable surfaces.
{
  const path = 'src/designState.js';
  let source = fs.readFileSync(path, 'utf8');
  const replacement = `export function createCounterModuleState(widthCm) {
  const width = Number(widthCm);
  if (![100, 150, 200].includes(width)) return null;

  return {
    id: createId('module'),
    type: 'counter',
    widthCm: width,
    depthCm: 50,
    heightCm: 100,
    faces: {
      frontLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      frontUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      leftLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      leftUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      rightLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      rightUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    },
  };
}

`;
  source = replaceBlock(
    source,
    'export function createCounterModuleState(widthCm) {',
    'export function createBaseModuleState(widthCm)',
    replacement,
    'createCounterModuleState',
  );
  fs.writeFileSync(path, source);
}

// 2) Counter geometry: Maxima-style corner frame + 2 stacked panels on front/left/right.
{
  const path = 'src/scene3d.js';
  let source = fs.readFileSync(path, 'utf8');
  const replacement = `function createCounterModule(moduleState, moduleIndex, onSurfaceReady) {
  const widthCm = Number(moduleState.widthCm);
  const depthCm = Number(moduleState.depthCm) || 50;
  const heightCm = Number(moduleState.heightCm) || 100;
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const heightM = heightCm / 100;
  const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;
  const topThicknessM = 0.04;
  const topOverhangM = 0.02;
  const frameHeightM = Math.max(heightM - topThicknessM, profileM * 5);
  const panelHeightM = Math.max((frameHeightM - profileM * 3) / 2, 0.05);
  const frontPanelWidthM = Math.max(widthM - profileM * 2, 0.05);
  const sidePanelWidthM = Math.max(depthM - profileM * 2, 0.05);
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: moduleState.type,
    widthCm,
    depthCm,
    heightCm,
  };

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });
  const addProfile = (geometry, position) => {
    const mesh = new THREE.Mesh(geometry, frameMaterial.clone());
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  // 4 visible Maxima corner posts.
  const cornerPostGeometry = new THREE.BoxGeometry(profileM, frameHeightM, profileM);
  [-1, 1].forEach((xSide) => {
    [-1, 1].forEach((zSide) => {
      addProfile(
        cornerPostGeometry.clone(),
        new THREE.Vector3(
          xSide * (widthM / 2 - profileM / 2),
          frameHeightM / 2,
          zSide * (depthM / 2 - profileM / 2),
        ),
      );
    });
  });

  // Bottom, middle and top rails create two stacked panel openings.
  const railYs = [profileM / 2, frameHeightM / 2, frameHeightM - profileM / 2];
  const frontRailGeometry = new THREE.BoxGeometry(frontPanelWidthM, profileM, profileM);
  railYs.forEach((y) => {
    addProfile(
      frontRailGeometry.clone(),
      new THREE.Vector3(0, y, depthM / 2 - profileM / 2),
    );
  });

  const sideRailGeometry = new THREE.BoxGeometry(profileM, profileM, sidePanelWidthM);
  [-1, 1].forEach((xSide) => {
    railYs.forEach((y) => {
      addProfile(
        sideRailGeometry.clone(),
        new THREE.Vector3(xSide * (widthM / 2 - profileM / 2), y, 0),
      );
    });
  });

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(
      widthM + topOverhangM * 2,
      topThicknessM,
      depthM + topOverhangM * 2,
    ),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.58, metalness: 0 }),
  );
  top.position.set(0, frameHeightM + topThicknessM / 2, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const surfaces = [];
  const addFace = (
    surfaceRole,
    panelLevel,
    surfaceState,
    faceWidthM,
    position,
    rotationY = 0,
  ) => {
    if (!surfaceState) return;

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(faceWidthM, panelHeightM, 0.012),
      new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.74, metalness: 0 }),
    );
    backing.position.copy(position);
    backing.rotation.y = rotationY;
    backing.castShadow = true;
    backing.receiveShadow = true;
    group.add(backing);

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(faceWidthM, panelHeightM),
      new THREE.MeshStandardMaterial({
        color: surfaceState.imageAssetId ? 0xffffff : surfaceState.color,
        roughness: 0.72,
        metalness: 0,
        side: THREE.DoubleSide,
        emissive: 0x000000,
        emissiveIntensity: 0,
      }),
    );
    surface.position.copy(position);
    surface.rotation.y = rotationY;
    if (surfaceRole === 'front') surface.position.z += 0.0065;
    else if (surfaceRole === 'left') surface.position.x -= 0.0065;
    else surface.position.x += 0.0065;

    const selectionFrame = createSelectionFrame(faceWidthM, panelHeightM);
    selectionFrame.visible = false;
    surface.add(selectionFrame);

    surface.userData = {
      kind: 'surface',
      moduleType: 'counter',
      selectionMode: 'module',
      acceptsImage: true,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex: panelLevel === 'lower' ? 0 : 1,
      stripNumber: panelLevel === 'lower' ? 1 : 2,
      surfaceRole,
      panelLevel,
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
      backing,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  };

  const lowerY = profileM + panelHeightM / 2;
  const upperY = frameHeightM - profileM - panelHeightM / 2;
  const frontZ = depthM / 2 - profileM - 0.006;
  const leftX = -widthM / 2 + profileM + 0.006;
  const rightX = widthM / 2 - profileM - 0.006;

  addFace('front', 'lower', moduleState.faces?.frontLower, frontPanelWidthM, new THREE.Vector3(0, lowerY, frontZ));
  addFace('front', 'upper', moduleState.faces?.frontUpper, frontPanelWidthM, new THREE.Vector3(0, upperY, frontZ));
  addFace('left', 'lower', moduleState.faces?.leftLower, sidePanelWidthM, new THREE.Vector3(leftX, lowerY, 0), -Math.PI / 2);
  addFace('left', 'upper', moduleState.faces?.leftUpper, sidePanelWidthM, new THREE.Vector3(leftX, upperY, 0), -Math.PI / 2);
  addFace('right', 'lower', moduleState.faces?.rightLower, sidePanelWidthM, new THREE.Vector3(rightX, lowerY, 0), Math.PI / 2);
  addFace('right', 'upper', moduleState.faces?.rightUpper, sidePanelWidthM, new THREE.Vector3(rightX, upperY, 0), Math.PI / 2);

  return { group, surfaces };
}
`;
  source = replaceBlock(
    source,
    'function createCounterModule(',
    '\nfunction createShelfModule(',
    replacement,
    'createCounterModule',
  );
  fs.writeFileSync(path, source);
}

// 3) Tests: lock the requested 6-surface model for all counter widths.
{
  const path = 'test/counterModule.test.js';
  let source = fs.readFileSync(path, 'utf8');
  const firstStart = source.indexOf("test('counter state exposes three independent editable faces'");
  const nextTest = source.indexOf("test('counter free placement stays inside the stand", firstStart);
  if (firstStart < 0 || nextTest < 0) throw new Error('counter state tests not found');
  const replacement = `test('100, 150 and 200 cm counters expose six independent stacked editable faces', () => {
  const faceKeys = [
    'frontLower', 'frontUpper',
    'leftLower', 'leftUpper',
    'rightLower', 'rightUpper',
  ];

  for (const widthCm of [100, 150, 200]) {
    const counter = createCounterModuleState(widthCm);
    assert.equal(counter.type, 'counter');
    assert.equal(counter.widthCm, widthCm);
    assert.equal(counter.depthCm, 50);
    assert.equal(counter.heightCm, 100);
    assert.deepEqual(Object.keys(counter.faces), faceKeys);
    assert.equal(new Set(faceKeys.map((key) => counter.faces[key].id)).size, 6);
    counter.faces.frontLower.color = '#ff0000';
    assert.equal(counter.faces.frontUpper.color, '#ffffff');
    assert.equal(counter.faces.leftLower.color, '#ffffff');
  }
});

test('duplicating a counter gives all six panels new surface ids', () => {
  const source = createCounterModuleState(100);
  const copy = duplicateModuleState(source);
  assert.notEqual(copy.id, source.id);
  for (const key of Object.keys(source.faces)) {
    assert.notEqual(copy.faces[key].id, source.faces[key].id);
  }
});

`;
  source = source.slice(0, firstStart) + replacement + source.slice(nextTest);
  fs.writeFileSync(path, source);
}
