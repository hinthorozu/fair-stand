import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const startMarker = `  // FAZ 4: lightweight 3D exhibition-hall environment.`;
const endMarker = `  const outerFloor = new THREE.Mesh(`;
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('existing exhibition hall block not found');

const environment = `  // FAZ 4: dynamic exhibition hall environment. The hall follows the stand size
  // with a controlled margin, so maximum layouts still read as a real fair venue.
  const exhibitionHall = new THREE.Group();
  exhibitionHall.name = 'exhibition-hall-environment';

  const hallFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8f9294,
    roughness: 0.62,
    metalness: 0.06,
  });
  const hallWallMaterial = new THREE.MeshStandardMaterial({
    color: 0xc8c9c8,
    roughness: 0.88,
    metalness: 0.02,
  });
  const hallStructureMaterial = new THREE.MeshStandardMaterial({
    color: 0x292d30,
    roughness: 0.5,
    metalness: 0.58,
  });
  const hallDarkMaterial = new THREE.MeshStandardMaterial({
    color: 0x242729,
    roughness: 0.72,
    metalness: 0.2,
  });
  const hallLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 2.2,
    roughness: 0.3,
    metalness: 0,
  });

  function rebuildExhibitionHall(standWidthM, standDepthM) {
    while (exhibitionHall.children.length) {
      const child = exhibitionHall.children.pop();
      child.geometry?.dispose?.();
    }

    // Keep the venue close enough to frame the stand while guaranteeing breathing
    // room around the largest supported stage.
    const marginX = THREE.MathUtils.clamp(standWidthM * 0.22, 8, 12);
    const marginZ = THREE.MathUtils.clamp(standDepthM * 0.22, 8, 12);
    const hallWidthM = standWidthM + marginX * 2;
    const hallDepthM = standDepthM + marginZ * 2;
    const hallHeightM = 11.5;
    const wallThicknessM = 0.22;
    const roofY = 10.2;

    const hallFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(hallWidthM, hallDepthM),
      hallFloorMaterial,
    );
    hallFloor.rotation.x = -Math.PI / 2;
    hallFloor.position.y = -0.014;
    hallFloor.receiveShadow = true;
    exhibitionHall.add(hallFloor);

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

    // Dark lower wall band gives the hall the same grounded industrial proportion
    // as a real exhibition venue.
    const bandHeight = 2.25;
    const addBand = (width, depth, x, z) => {
      const band = new THREE.Mesh(new THREE.BoxGeometry(width, bandHeight, depth), hallDarkMaterial);
      band.position.set(x, bandHeight / 2, z);
      exhibitionHall.add(band);
    };
    addBand(hallWidthM - 0.25, 0.12, 0, -hallDepthM / 2 + 0.12);
    addBand(hallWidthM - 0.25, 0.12, 0, hallDepthM / 2 - 0.12);
    addBand(0.12, hallDepthM - 0.25, -hallWidthM / 2 + 0.12, 0);
    addBand(0.12, hallDepthM - 0.25, hallWidthM / 2 - 0.12, 0);

    // Structural columns stay on the walls instead of floating over the stand.
    const columnGeometry = new THREE.BoxGeometry(0.46, hallHeightM, 0.46);
    const columnSpacing = 8;
    for (let x = -hallWidthM / 2 + 4; x <= hallWidthM / 2 - 4; x += columnSpacing) {
      for (const z of [-hallDepthM / 2 + 0.32, hallDepthM / 2 - 0.32]) {
        const column = new THREE.Mesh(columnGeometry, hallStructureMaterial);
        column.position.set(x, hallHeightM / 2, z);
        exhibitionHall.add(column);
      }
    }
    for (let z = -hallDepthM / 2 + 4; z <= hallDepthM / 2 - 4; z += columnSpacing) {
      for (const x of [-hallWidthM / 2 + 0.32, hallWidthM / 2 - 0.32]) {
        const column = new THREE.Mesh(columnGeometry, hallStructureMaterial);
        column.position.set(x, hallHeightM / 2, z);
        exhibitionHall.add(column);
      }
    }

    // Roof structure is concentrated around the perimeter. There is deliberately no
    // solid ceiling and no dense grid directly over the editable stand area.
    const trussDepth = 2.2;
    const trussThickness = 0.18;
    for (const z of [-hallDepthM / 2 + 1.4, hallDepthM / 2 - 1.4]) {
      const truss = new THREE.Mesh(
        new THREE.BoxGeometry(hallWidthM - 1.2, trussThickness, trussDepth),
        hallStructureMaterial,
      );
      truss.position.set(0, roofY, z);
      exhibitionHall.add(truss);
    }
    for (const x of [-hallWidthM / 2 + 1.4, hallWidthM / 2 - 1.4]) {
      const truss = new THREE.Mesh(
        new THREE.BoxGeometry(trussDepth, trussThickness, hallDepthM - 1.2),
        hallStructureMaterial,
      );
      truss.position.set(x, roofY, 0);
      exhibitionHall.add(truss);
    }

    // Short inward roof ribs add depth at normal camera angles without covering the
    // stand when viewed from above.
    for (let x = -hallWidthM / 2 + 4; x <= hallWidthM / 2 - 4; x += 8) {
      for (const z of [-hallDepthM / 2 + 2.7, hallDepthM / 2 - 2.7]) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 2.8), hallStructureMaterial);
        rib.position.set(x, roofY - 0.06, z);
        exhibitionHall.add(rib);
      }
    }
    for (let z = -hallDepthM / 2 + 4; z <= hallDepthM / 2 - 4; z += 8) {
      for (const x of [-hallWidthM / 2 + 2.7, hallWidthM / 2 - 2.7]) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.14), hallStructureMaterial);
        rib.position.set(x, roofY - 0.06, z);
        exhibitionHall.add(rib);
      }
    }

    // Perimeter luminaires provide visible hall detail while keeping the center clean.
    for (let x = -hallWidthM / 2 + 4; x <= hallWidthM / 2 - 4; x += 6) {
      for (const z of [-hallDepthM / 2 + 2.1, hallDepthM / 2 - 2.1]) {
        const fixture = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.16), hallLightMaterial);
        fixture.position.set(x, roofY - 0.35, z);
        exhibitionHall.add(fixture);
      }
    }
    for (let z = -hallDepthM / 2 + 4; z <= hallDepthM / 2 - 4; z += 6) {
      for (const x of [-hallWidthM / 2 + 2.1, hallWidthM / 2 - 2.1]) {
        const fixture = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 1.8), hallLightMaterial);
        fixture.position.set(x, roofY - 0.35, z);
        exhibitionHall.add(fixture);
      }
    }
  }

  scene.add(exhibitionHall);

`;

source = source.slice(0, start) + environment + source.slice(end);

const stageAnchor = `    const centerX = widthM / 2;\n    const centerZ = depthM / 2;`;
const oldPositionBlock = `    // Keep the surrounding hall centered on the current stand, independent of stand size.\n    exhibitionHall.position.set(centerX, 0, centerZ);`;
const newPositionBlock = `    // Rebuild the venue around the current stand so large layouts keep realistic clearance.\n    rebuildExhibitionHall(widthM, depthM);\n    exhibitionHall.position.set(centerX, 0, centerZ);`;
if (source.includes(oldPositionBlock)) {
  source = source.replace(oldPositionBlock, newPositionBlock);
} else if (!source.includes(`rebuildExhibitionHall(widthM, depthM);`)) {
  if (!source.includes(stageAnchor)) throw new Error('createStage center anchor not found');
  source = source.replace(stageAnchor, `${stageAnchor}\n\n${newPositionBlock}`);
}

fs.writeFileSync(path, source);
