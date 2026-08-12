import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const startMarker = `  // FAZ 4:`;
const endMarker = `  const outerFloor = new THREE.Mesh(`;
const start = source.indexOf(startMarker);
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('exhibition hall block not found');

const environment = `  // FAZ 4: one visually continuous exhibition-hall ground plane.
  // No walls, columns, roof, trusses or hall lights are rendered.
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

    const hallSizeM = Math.max(standWidthM, standDepthM, 20) + 80;
    const hallFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(hallSizeM, hallSizeM),
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
const stageTail = source.slice(stageStart, stageStart + 1400);
if (!stageTail.includes(rebuildLine)) {
  source = source.replace(stageAnchor, `${stageAnchor}\n\n    ${rebuildLine.trim()}\n    ${positionLine.trim()}`);
}

source = source.replace(`    outerFloor.visible = true;`, `    outerFloor.visible = false;`);

// Shelf cleanup: give the shelf slab enough contrast against the white wall panels and
// keep the aluminium front profile physically separated from the slab to avoid flicker.
const shelfMaterialPattern = /  const shelfMaterial = new THREE\.MeshStandardMaterial\(\{\n    color: 0x(?:ffffff|d7d9dc),\n    roughness: 0\.(?:72|76),\n    metalness: 0,\n  \}\);/;
const shelfMaterial = `  const shelfMaterial = new THREE.MeshStandardMaterial({\n    color: 0xb8bcc1,\n    roughness: 0.78,\n    metalness: 0,\n  });`;
if (!shelfMaterialPattern.test(source)) throw new Error('shelf material block not found');
source = source.replace(shelfMaterialPattern, shelfMaterial);

const oldFrontProfileZ = `      wallDepthM / 2 + shelfDepthM - 0.0125,`;
const separatedFrontProfileZ = `      wallDepthM / 2 + shelfDepthM + 0.0125,`;
if (source.includes(oldFrontProfileZ)) {
  source = source.replaceAll(oldFrontProfileZ, separatedFrontProfileZ);
}

fs.writeFileSync(path, source);
