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

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x101216,
    roughness: 0.3,
    metalness: 0.72,
  });
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x24282d,
    roughness: 0.34,
    metalness: 0.7,
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf8fff4,
    emissive: 0xf2ffe8,
    emissiveIntensity: 1.65,
    roughness: 0.08,
    metalness: 0,
    transmission: 0.08,
    clearcoat: 0.75,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
  });
  const ledMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff8d8,
    emissive: 0xfff2b8,
    emissiveIntensity: 2.5,
    roughness: 0.22,
    metalness: 0,
  });

  function roundedRectShape(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const r = Math.min(radius, width / 2, height / 2);
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  }

  function roundedBoxGeometry(width, height, depth, radius, bevel = 0.008) {
    const geometry = new THREE.ExtrudeGeometry(
      roundedRectShape(width, height, radius),
      {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 3,
        curveSegments: 8,
        steps: 1,
      },
    );
    geometry.translate(0, 0, -depth / 2);
    geometry.computeVertexNormals();
    return geometry;
  }

  // Profile oturan alçak bağlantı pabucu.
  const mount = new THREE.Mesh(
    roundedBoxGeometry(0.13, 0.026, 0.075, 0.012, 0.004),
    bodyMaterial.clone(),
  );
  mount.position.set(0, 0.014, 0.012);
  mount.castShadow = true;
  group.add(mount);

  // Gerçek floodlight tipi kalın U braket.
  const bracket = new THREE.Group();
  bracket.position.set(0, 0.045, 0.045);
  group.add(bracket);

  const bracketBase = new THREE.Mesh(
    roundedBoxGeometry(0.235, 0.026, 0.035, 0.01, 0.003),
    edgeMaterial.clone(),
  );
  bracketBase.castShadow = true;
  bracket.add(bracketBase);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(
      roundedBoxGeometry(0.026, 0.105, 0.034, 0.01, 0.003),
      edgeMaterial.clone(),
    );
    ear.position.set(side * 0.106, 0.057, 0.018);
    ear.castShadow = true;
    bracket.add(ear);
  });

  // Projektör kafa grubu: ince, yuvarlatılmış metal kasa.
  const head = new THREE.Group();
  head.position.set(0, 0.145, 0.108);
  head.rotation.x = THREE.MathUtils.degToRad(38);
  group.add(head);

  const body = new THREE.Mesh(
    roundedBoxGeometry(0.305, 0.178, 0.052, 0.018, 0.007),
    bodyMaterial.clone(),
  );
  body.castShadow = true;
  body.receiveShadow = true;
  head.add(body);

  // Ön yüzde hafif yükseltilmiş çerçeve + gömülü cam.
  const bezel = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRectShape(0.272, 0.145, 0.012), 8),
    edgeMaterial.clone(),
  );
  bezel.position.z = 0.032;
  head.add(bezel);

  const lens = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRectShape(0.246, 0.119, 0.009), 8),
    glassMaterial,
  );
  lens.position.z = 0.0335;
  head.add(lens);

  // LED dizisi: camın arkasında küçük ışık noktaları.
  const ledGroup = new THREE.Group();
  ledGroup.position.z = 0.0342;
  for (let row = -2; row <= 2; row += 1) {
    for (let col = -4; col <= 4; col += 1) {
      const led = new THREE.Mesh(new THREE.CircleGeometry(0.0042, 10), ledMaterial);
      led.position.set(col * 0.023, row * 0.021, 0);
      ledGroup.add(led);
    }
  }
  head.add(ledGroup);

  // Arka soğutucu kanatlar, silüeti gerçek projektöre yaklaştırır.
  for (let index = -4; index <= 4; index += 1) {
    const fin = new THREE.Mesh(
      roundedBoxGeometry(0.012, 0.128, 0.018, 0.004, 0.002),
      edgeMaterial.clone(),
    );
    fin.position.set(index * 0.027, 0, -0.039);
    fin.castShadow = true;
    head.add(fin);
  }

  // Braket pivot vidaları.
  [-1, 1].forEach((side) => {
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.014, 20),
      edgeMaterial.clone(),
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(side * 0.157, 0.01, 0);
    screw.castShadow = true;
    head.add(screw);

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 0.016, 20),
      new THREE.MeshStandardMaterial({ color: 0x70757b, roughness: 0.3, metalness: 0.82 }),
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.set(side * 0.166, 0.01, 0);
    head.add(cap);
  });

  // Panel yüzüne gerçek aydınlatma.
  const spot = new THREE.SpotLight(0xfffbed, 44, 5.6, 0.48, 0.62, 1.35);
  spot.position.set(0, 0.16, 0.13);
  spot.castShadow = false;
  spot.target.position.set(0, -1.5, 1.15);
  group.add(spot, spot.target);

  const selectionFrame = createSelectionFrame(0.305, 0.178);
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
