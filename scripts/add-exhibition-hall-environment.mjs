import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

// Matches the user-selected Poly Haven package: damaged_concrete_floor_02_4k.blend.zip.
// Use the 4K diffuse map in-browser; the Blender/EXR files are not needed by the editor.
const textureUrl = 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/4k/damaged_concrete_floor_02/damaged_concrete_floor_02_diff_4k.jpg';
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

const environment = `  // Fixed exhibition-hall ground: 4K CC0 Damaged Concrete Floor 02 from Poly Haven.
  // The source is seamless and repeated at a large physical scale so the hall reads as
  // one continuous floor instead of one stretched image or visible square tiles.
  // It is intentionally not user-configurable; the stand platform remains independent.
  const exhibitionHall = new THREE.Group();
  exhibitionHall.name = 'exhibition-hall-environment';

  const hallFloorTexture = new THREE.TextureLoader().load(
    import.meta.env.BASE_URL + 'textures/exhibition-floor.jpg',
  );
  hallFloorTexture.colorSpace = THREE.SRGBColorSpace;
  hallFloorTexture.wrapS = THREE.RepeatWrapping;
  hallFloorTexture.wrapT = THREE.RepeatWrapping;
  hallFloorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const hallFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0xa9abad,
    map: hallFloorTexture,
    roughness: 0.96,
    metalness: 0,
  });

  function rebuildExhibitionHall(standWidthM, standDepthM) {
    while (exhibitionHall.children.length) {
      const child = exhibitionHall.children.pop();
      child.geometry?.dispose?.();
    }

    const hallSizeM = Math.max(standWidthM, standDepthM, 20) + 80;
    // One texture repeat represents roughly an 8 m square of real floor.
    // Large repeats prevent the checkerboard look while preserving detail near the stand.
    const textureRepeat = Math.max(1, hallSizeM / 8);
    hallFloorTexture.repeat.set(textureRepeat, textureRepeat);
    hallFloorTexture.offset.set(0.173, 0.287);
    hallFloorTexture.needsUpdate = true;

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

// Restore the 1 m editor reference grid around the active platform.
// Make it slightly bolder without turning it into a heavy CAD overlay: three very close
// parallel 1 px lines give a stable ~2-3 px visual weight even when lighting/background changes.
source = source.replace(`const GRID_COLOR = 0xb8c1cb;`, `const GRID_COLOR = 0x7f8994;`);
source = source.replace(`const GRID_COLOR = 0x7f8994;`, `const GRID_COLOR = 0x7f8994;`);

const gridFunctionPattern = /  function createRectangularGrid\(widthM, depthM\) \{[\s\S]*?\n  \}\n\n  function createStandOutline/;
const gridFunctionReplacement = `  function createRectangularGrid(widthM, depthM) {
    const leftX = -STAGE_SURROUND_M;
    const rightX = widthM + STAGE_SURROUND_M;
    const backZ = -STAGE_SURROUND_M;
    const frontZ = depthM + STAGE_SURROUND_M;
    const positions = [];
    const boldOffsetM = 0.006;

    const pushVertical = (x) => {
      [-boldOffsetM, 0, boldOffsetM].forEach((offset) => {
        positions.push(x + offset, 0.006, backZ, x + offset, 0.006, frontZ);
      });
    };
    const pushHorizontal = (z) => {
      [-boldOffsetM, 0, boldOffsetM].forEach((offset) => {
        positions.push(leftX, 0.006, z + offset, rightX, 0.006, z + offset);
      });
    };

    collectGridValues(widthM).forEach(pushVertical);
    collectGridValues(depthM).forEach(pushHorizontal);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const lines = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({
        color: GRID_COLOR,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    lines.renderOrder = 7;
    return lines;
  }

  function createStandOutline`;
if (!gridFunctionPattern.test(source)) throw new Error('reference grid function not found');
source = source.replace(gridFunctionPattern, gridFunctionReplacement);
source = source.replace(`    grid.visible = false;\n    scene.add(grid, standOutline, ...activeWallGuides);`, `    scene.add(grid, standOutline, ...activeWallGuides);`);

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
