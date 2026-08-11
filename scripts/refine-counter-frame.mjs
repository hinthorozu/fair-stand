import fs from 'node:fs';

const path = 'src/scene3d.js';
const source = fs.readFileSync(path, 'utf8');
const start = source.indexOf('function createCounterModule(');
const end = source.indexOf('\nfunction createShelfModule(', start);
if (start < 0 || end < 0) throw new Error('createCounterModule block not found');

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
  const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);
  const panelHeightM = Math.max(frameHeightM - profileM * 2, 0.05);
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

  // Banko da baza gibi görünür Maxima konstrüksiyona sahip olur.
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

  const frontRailGeometry = new THREE.BoxGeometry(frontPanelWidthM, profileM, profileM);
  [profileM / 2, frameHeightM - profileM / 2].forEach((y) => {
    addProfile(
      frontRailGeometry.clone(),
      new THREE.Vector3(0, y, depthM / 2 - profileM / 2),
    );
  });

  const sideRailGeometry = new THREE.BoxGeometry(profileM, profileM, sidePanelWidthM);
  [-1, 1].forEach((xSide) => {
    [profileM / 2, frameHeightM - profileM / 2].forEach((y) => {
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
  const addFace = (surfaceRole, surfaceState, faceWidthM, position, rotationY = 0) => {
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
      stripIndex: null,
      stripNumber: null,
      surfaceRole,
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
      backing,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  };

  const panelCenterY = profileM + panelHeightM / 2;
  addFace(
    'front',
    moduleState.faces?.front,
    frontPanelWidthM,
    new THREE.Vector3(0, panelCenterY, depthM / 2 - profileM - 0.006),
  );
  addFace(
    'left',
    moduleState.faces?.left,
    sidePanelWidthM,
    new THREE.Vector3(-widthM / 2 + profileM + 0.006, panelCenterY, 0),
    -Math.PI / 2,
  );
  addFace(
    'right',
    moduleState.faces?.right,
    sidePanelWidthM,
    new THREE.Vector3(widthM / 2 - profileM - 0.006, panelCenterY, 0),
    Math.PI / 2,
  );

  return { group, surfaces };
}
`;

fs.writeFileSync(path, source.slice(0, start) + replacement + source.slice(end));
