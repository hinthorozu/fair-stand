import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const startMarker = `  // FAZ 4: lightweight 3D exhibition-hall environment.`;
const endMarker = `  const outerFloor = new THREE.Mesh(`;
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('existing exhibition hall block not found');

const environment = `  // FAZ 4: lightweight 3D exhibition-hall environment. The stand and its platform
  // remain real scene geometry; this group supplies a believable surrounding venue.
  const exhibitionHall = new THREE.Group();
  exhibitionHall.name = 'exhibition-hall-environment';

  const hallWidthM = 90;
  const hallDepthM = 70;
  const hallHeightM = 12;
  const hallFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8d9296,
    roughness: 0.72,
    metalness: 0.05,
  });
  const hallWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xd2d5d7,
    roughness: 0.9,
    metalness: 0.02,
  });
  const hallStructureMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b4146,
    roughness: 0.58,
    metalness: 0.5,
  });
  const hallDarkMaterial = new THREE.MeshStandardMaterial({
    color: 0x24292d,
    roughness: 0.7,
    metalness: 0.28,
  });

  // Large real floor around the stand. From bird's-eye views this remains the main
  // visible environment instead of an artificial ceiling/background surface.
  const hallFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(hallWidthM, hallDepthM),
    hallFloorMaterial,
  );
  hallFloor.rotation.x = -Math.PI / 2;
  hallFloor.position.y = -0.014;
  hallFloor.receiveShadow = true;
  exhibitionHall.add(hallFloor);

  // Rectangular exhibition hall walls sit far away from the stand so perspective
  // reads like a real venue rather than a cylindrical studio backdrop.
  const wallThicknessM = 0.18;
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(hallWidthM, hallHeightM, wallThicknessM),
    hallWallMaterial,
  );
  backWall.position.set(0, hallHeightM / 2, -hallDepthM / 2);
  exhibitionHall.add(backWall);

  const frontWall = backWall.clone();
  frontWall.position.z = hallDepthM / 2;
  exhibitionHall.add(frontWall);

  const sideWallGeometry = new THREE.BoxGeometry(wallThicknessM, hallHeightM, hallDepthM);
  const leftWall = new THREE.Mesh(sideWallGeometry, hallWallMaterial);
  leftWall.position.set(-hallWidthM / 2, hallHeightM / 2, 0);
  exhibitionHall.add(leftWall);
  const rightWall = leftWall.clone();
  rightWall.position.x = hallWidthM / 2;
  exhibitionHall.add(rightWall);

  // Dark lower wall band and repeated columns create the scale cues seen in real
  // fair halls without adding heavy models or textures.
  const wallBandHeightM = 2.7;
  const backBand = new THREE.Mesh(
    new THREE.BoxGeometry(hallWidthM - 0.2, wallBandHeightM, 0.12),
    hallDarkMaterial,
  );
  backBand.position.set(0, wallBandHeightM / 2, -hallDepthM / 2 + 0.11);
  exhibitionHall.add(backBand);
  const frontBand = backBand.clone();
  frontBand.position.z = hallDepthM / 2 - 0.11;
  exhibitionHall.add(frontBand);

  const columnGeometry = new THREE.BoxGeometry(0.34, hallHeightM, 0.34);
  for (let x = -hallWidthM / 2 + 5; x <= hallWidthM / 2 - 5; x += 10) {
    for (const z of [-hallDepthM / 2 + 0.35, hallDepthM / 2 - 0.35]) {
      const column = new THREE.Mesh(columnGeometry, hallStructureMaterial);
      column.position.set(x, hallHeightM / 2, z);
      exhibitionHall.add(column);
    }
  }
  for (let z = -hallDepthM / 2 + 5; z <= hallDepthM / 2 - 5; z += 10) {
    for (const x of [-hallWidthM / 2 + 0.35, hallWidthM / 2 - 0.35]) {
      const column = new THREE.Mesh(columnGeometry, hallStructureMaterial);
      column.position.set(x, hallHeightM / 2, z);
      exhibitionHall.add(column);
    }
  }

  // Open roof structure: beams and luminous fixtures are visible from normal camera
  // angles but there is no solid ceiling, so a top camera can still see the floor.
  const roofY = 9.7;
  const beamThickness = 0.16;
  for (let z = -30; z <= 30; z += 7.5) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(hallWidthM - 2, beamThickness, 0.2),
      hallStructureMaterial,
    );
    beam.position.set(0, roofY, z);
    exhibitionHall.add(beam);
  }
  for (let x = -40; x <= 40; x += 8) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, beamThickness, hallDepthM - 2),
      hallStructureMaterial,
    );
    beam.position.set(x, roofY + 0.08, 0);
    exhibitionHall.add(beam);
  }

  const hallLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 2.1,
    roughness: 0.34,
    metalness: 0,
  });
  for (let z = -26; z <= 26; z += 13) {
    for (let x = -36; x <= 36; x += 12) {
      const fixture = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 0.06, 0.18),
        hallLightMaterial,
      );
      fixture.position.set(x, roofY - 0.22, z);
      exhibitionHall.add(fixture);
    }
  }

  // A few distant booth-like blocks prevent the horizon from feeling empty while
  // staying intentionally generic and non-interactive.
  const boothMaterial = new THREE.MeshStandardMaterial({ color: 0xe7e8e9, roughness: 0.88 });
  const boothAccentMaterial = new THREE.MeshStandardMaterial({ color: 0x596168, roughness: 0.82 });
  const distantBooths = [
    [-28, -23, 8, 3.2, 5],
    [-14, -25, 7, 3.6, 4],
    [18, -24, 9, 3.4, 5],
    [31, -21, 7, 3.1, 4],
    [-31, 22, 8, 3.3, 5],
    [26, 23, 10, 3.5, 4.5],
  ];
  distantBooths.forEach(([x, z, width, height, depth]) => {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      boothMaterial,
    );
    block.position.set(x, height / 2, z);
    block.receiveShadow = true;
    exhibitionHall.add(block);

    const fascia = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.72, 0.46, 0.1),
      boothAccentMaterial,
    );
    fascia.position.set(x, height - 0.48, z + depth / 2 + 0.06);
    exhibitionHall.add(fascia);
  });

  scene.add(exhibitionHall);

`;

source = source.slice(0, start) + environment + source.slice(end);

const stageAnchor = `    const centerX = widthM / 2;\n    const centerZ = depthM / 2;`;
const hallPositionLine = `    exhibitionHall.position.set(centerX, 0, centerZ);`;
if (!source.includes(hallPositionLine)) {
  if (!source.includes(stageAnchor)) throw new Error('createStage center anchor not found');
  source = source.replace(
    stageAnchor,
    `${stageAnchor}\n\n    // Keep the surrounding hall centered on the current stand, independent of stand size.\n    ${hallPositionLine.trim()}`,
  );
}

fs.writeFileSync(path, source);
