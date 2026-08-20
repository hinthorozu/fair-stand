import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const textureUrl = 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/concrete_floor_03/concrete_floor_03_diff_1k.jpg';
const texturePath = 'public/textures/exhibition-floor.jpg';
fs.mkdirSync('public/textures', { recursive: true });
const textureResponse = await fetch(textureUrl);
if (!textureResponse.ok) {
  throw new Error(`Failed to download exhibition floor texture: ${textureResponse.status}`);
}
fs.writeFileSync(texturePath, Buffer.from(await textureResponse.arrayBuffer()));

const startMarker = `  // Fixed exhibition-hall ground:`;
const fallbackStartMarker = `  // FAZ 4:`;
const endMarker = `  const outerFloor = new THREE.Mesh(`;
let start = source.indexOf(startMarker);
if (start < 0) start = source.indexOf(fallbackStartMarker);
const end = source.indexOf(endMarker, start);
if (start < 0 || end < 0) throw new Error('exhibition hall block not found');

const environment = `  // Fixed exhibition-hall ground: one continuous CC0 Concrete Floor 03 image from Poly Haven.
  // No tiled/repeated pattern: the whole hall reads as one uninterrupted surface.
  // It is intentionally not user-configurable; the stand platform remains independent.
  const exhibitionHall = new THREE.Group();
  exhibitionHall.name = 'exhibition-hall-environment';

  const hallFloorTexture = new THREE.TextureLoader().load(
    import.meta.env.BASE_URL + 'textures/exhibition-floor.jpg',
  );
  hallFloorTexture.colorSpace = THREE.SRGBColorSpace;
  hallFloorTexture.wrapS = THREE.ClampToEdgeWrapping;
  hallFloorTexture.wrapT = THREE.ClampToEdgeWrapping;
  hallFloorTexture.repeat.set(1, 1);
  hallFloorTexture.offset.set(0, 0);
  hallFloorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const hallFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x86898c,
    map: hallFloorTexture,
    roughness: 0.94,
    metalness: 0,
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

source = source.replace(
  `  scene.background = new THREE.Color(0xf4f6f8);`,
  `  scene.background = new THREE.Color(0x5f6265);`,
);

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

// Keep editor measurements out of the visual presentation: the active platform outline
// remains, but the surrounding square grid no longer breaks the hall into tiles.
source = source.replace(
  `    scene.add(grid, standOutline, ...activeWallGuides);`,
  `    grid.visible = false;\n    scene.add(grid, standOutline, ...activeWallGuides);`,
);

// Shelf cleanup: give the shelf slab enough contrast against the white wall panels and
// keep the aluminium front profile physically separated from the slab to avoid flicker.
const shelfMaterialPattern = /  const shelfMaterial = new THREE\.MeshStandardMaterial\(\{\n    color: 0x(?:ffffff|d7d9dc|b8bcc1),\n    roughness: 0\.(?:72|76|78),\n    metalness: 0,\n  \}\);/;
const shelfMaterial = `  const shelfMaterial = new THREE.MeshStandardMaterial({\n    color: 0xb8bcc1,\n    roughness: 0.78,\n    metalness: 0,\n  });`;
if (!shelfMaterialPattern.test(source)) throw new Error('shelf material block not found');
source = source.replace(shelfMaterialPattern, shelfMaterial);

const oldFrontProfileZ = `      wallDepthM / 2 + shelfDepthM - 0.0125,`;
const separatedFrontProfileZ = `      wallDepthM / 2 + shelfDepthM + 0.0125,`;
if (source.includes(oldFrontProfileZ)) {
  source = source.replaceAll(oldFrontProfileZ, separatedFrontProfileZ);
}

fs.writeFileSync(path, source);
