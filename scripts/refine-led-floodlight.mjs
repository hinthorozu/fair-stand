import fs from 'node:fs';

const path = 'src/scene3d.js';
let text = fs.readFileSync(path, 'utf8');

const replacement = `function createLedFloodlightModule(moduleState, moduleIndex) {
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'led-floodlight',
    widthCm: 50,
    depthCm: 20,
    heightCm: 35,
  };

  const blackMaterial = new THREE.MeshStandardMaterial({
    color: 0x15171a,
    roughness: 0.42,
    metalness: 0.62,
  });
  const lensMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fff4,
    emissive: 0xf2ffe8,
    emissiveIntensity: 2.1,
    roughness: 0.14,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  // Maxima üst profile oturan kısa bağlantı pabucu.
  const mount = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.025, 0.075),
    blackMaterial.clone(),
  );
  mount.position.set(0, 0.0125, 0.015);
  mount.castShadow = true;
  group.add(mount);

  // Gerçek projektörlerdeki kısa U braket: uzun sap yok.
  const bracketBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.022, 0.035),
    blackMaterial.clone(),
  );
  bracketBase.position.set(0, 0.055, 0.045);
  bracketBase.castShadow = true;
  group.add(bracketBase);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.085, 0.03),
      blackMaterial.clone(),
    );
    ear.position.set(side * 0.099, 0.092, 0.058);
    ear.castShadow = true;
    group.add(ear);
  });

  // İnce, yatay dikdörtgen floodlight gövdesi. Ön yüz panel yönüne aşağı eğilir.
  const head = new THREE.Group();
  head.position.set(0, 0.145, 0.105);
  head.rotation.x = THREE.MathUtils.degToRad(40);
  group.add(head);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.29, 0.17, 0.045),
    blackMaterial.clone(),
  );
  body.castShadow = true;
  body.receiveShadow = true;
  head.add(body);

  // Ön tarafta siyah çerçeve içinde beyaz LED yüzeyi.
  const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.245, 0.125), lensMaterial);
  lens.position.z = 0.0235;
  head.add(lens);

  // Panelin üst-orta bölgesine sıcak/nötr beyaz gerçek ışık.
  const spot = new THREE.SpotLight(0xfffbed, 42, 5.4, 0.48, 0.62, 1.35);
  spot.position.set(0, 0.16, 0.13);
  spot.castShadow = false;
  spot.target.position.set(0, -1.45, 1.15);
  group.add(spot, spot.target);

  const selectionFrame = createSelectionFrame(0.29, 0.17);
  selectionFrame.visible = false;
  lens.add(selectionFrame);
  lens.userData = {
    kind: 'surface',
    moduleType: 'led-floodlight',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm: 50,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'light',
    surfaceId: moduleState.surface?.id,
    surfaceState: moduleState.surface,
    selectionFrame,
    colorTargets: [],
  };

  return { group, surfaces: [lens] };
}

function createBarStoolModule`;

const pattern = /function createLedFloodlightModule\(moduleState, moduleIndex\) \{[\s\S]*?\n\}\n\nfunction createBarStoolModule/;
if (!pattern.test(text)) throw new Error('LED floodlight function not found');
text = text.replace(pattern, replacement);
fs.writeFileSync(path, text);
