import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const startMarker = `  // FAZ 4:`;
const endMarker = `  const outerFloor = new THREE.Mesh(`;
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('exhibition hall block not found');

const environment = `  // FAZ 4: exhibition environment baseline. For now only a simple surrounding
  // grey venue floor is rendered; walls, columns, roof, trusses and hall lights are omitted.
  const exhibitionHall = new THREE.Group();
  exhibitionHall.name = 'exhibition-hall-environment';

  const hallFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x9a9d9f,
    roughness: 0.78,
    metalness: 0.02,
  });

  function rebuildExhibitionHall(standWidthM, standDepthM) {
    while (exhibitionHall.children.length) {
      const child = exhibitionHall.children.pop();
      child.geometry?.dispose?.();
    }

    const marginX = THREE.MathUtils.clamp(standWidthM * 0.22, 8, 12);
    const marginZ = THREE.MathUtils.clamp(standDepthM * 0.22, 8, 12);
    const hallWidthM = standWidthM + marginX * 2;
    const hallDepthM = standDepthM + marginZ * 2;

    const hallFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(hallWidthM, hallDepthM),
      hallFloorMaterial,
    );
    hallFloor.rotation.x = -Math.PI / 2;
    hallFloor.position.y = -0.014;
    hallFloor.receiveShadow = true;
    exhibitionHall.add(hallFloor);
  }

  scene.add(exhibitionHall);

`;

source = source.slice(0, start) + environment + source.slice(end);

const stageAnchor = `    const centerX = widthM / 2;\n    const centerZ = depthM / 2;`;
const rebuildLine = `    rebuildExhibitionHall(widthM, depthM);`;
const positionLine = `    exhibitionHall.position.set(centerX, 0, centerZ);`;

const stageStart = source.indexOf(stageAnchor);
if (stageStart < 0) throw new Error('createStage center anchor not found');
const stageTail = source.slice(stageStart, stageStart + 1200);

if (!stageTail.includes(rebuildLine)) {
  source = source.replace(stageAnchor, `${stageAnchor}\n\n    ${rebuildLine.trim()}\n    ${positionLine.trim()}`);
}

fs.writeFileSync(path, source);
