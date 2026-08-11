import fs from 'node:fs';

function patch(path, transform) {
  const before = fs.readFileSync(path, 'utf8');
  const after = transform(before);
  if (after === before) throw new Error(`No changes applied to ${path}`);
  fs.writeFileSync(path, after);
}

patch('index.html', (source) => source.replace(
`          <p class="stand-limit-note">50 cm ve katları · Maksimum: 5000 × 5000 cm (50 × 50 m)</p>
          <button id="create-stage" type="button" class="primary" disabled>Sahneyi Oluştur</button>`,
`          <p class="stand-limit-note">50 cm ve katları · Maksimum: 5000 × 5000 cm (50 × 50 m)</p>

          <label class="stand-size-field" for="floor-type">
            <span>Zemin Kaplaması</span>
            <select id="floor-type">
              <option value="karolaj">Karolaj · 100 × 100 cm</option>
              <option value="hali">Halı</option>
              <option value="parke">Parke</option>
            </select>
          </label>

          <button id="create-stage" type="button" class="primary" disabled>Sahneyi Oluştur</button>`
));

patch('src/main.js', (source) => {
  let next = source.replace(
`const createStageButton = document.querySelector('#create-stage');`,
`const createStageButton = document.querySelector('#create-stage');
const floorTypeSelect = document.querySelector('#floor-type');`
  );

  next = next.replace(
`  currentStand = setup;
  syncWallLengthFromSetup(setup);`,
`  currentStand = { ...setup, floorType: floorTypeSelect.value };
  scene3d.setFloorType(floorTypeSelect.value);
  syncWallLengthFromSetup(setup);`
  );

  next = next.replace(
`openModuleCatalogButton.addEventListener('click', () => {`,
`floorTypeSelect.addEventListener('change', () => {
  if (!currentStand) return;
  currentStand = { ...currentStand, floorType: floorTypeSelect.value };
  scene3d.setFloorType(floorTypeSelect.value);
});

openModuleCatalogButton.addEventListener('click', () => {`
  );
  return next;
});

patch('src/scene3d.js', (source) => {
  let next = source.replace(
`const ACTIVE_PLATFORM_HEIGHT_M = 0.05;`,
`const ACTIVE_PLATFORM_HEIGHT_M = 0.05;
const FLOOR_TYPES = Object.freeze(['karolaj', 'hali', 'parke']);
const FLOOR_TOP_EPSILON_M = 0.006;`
  );

  next = next.replace(
`  let grid = null;
  let standOutline = null;
  let activeWallGuides = [];
  let stageLayout = null;`,
`  let grid = null;
  let standOutline = null;
  let activeWallGuides = [];
  let floorPattern = null;
  let stageLayout = null;
  let currentFloorType = 'karolaj';`
  );

  next = next.replace(
`  function disposeGroundGuides() {
    disposeGroundObject(grid);
    disposeGroundObject(standOutline);
    activeWallGuides.forEach(disposeGroundObject);
    grid = null;
    standOutline = null;
    activeWallGuides = [];
  }`,
`  function disposeGroundGuides() {
    disposeGroundObject(grid);
    disposeGroundObject(standOutline);
    disposeGroundObject(floorPattern);
    activeWallGuides.forEach(disposeGroundObject);
    grid = null;
    standOutline = null;
    floorPattern = null;
    activeWallGuides = [];
  }

  function collectSurfaceCuts(lengthM, stepM) {
    const cuts = [0];
    for (let value = stepM; value < lengthM; value += stepM) cuts.push(value);
    cuts.push(lengthM);
    return [...new Set(cuts.map((value) => Number(value.toFixed(6))))];
  }

  function createFloorPattern(widthM, depthM, floorType) {
    const positions = [];
    const topY = ACTIVE_PLATFORM_HEIGHT_M + FLOOR_TOP_EPSILON_M;

    if (floorType === 'karolaj') {
      collectSurfaceCuts(widthM, 1).forEach((x) => {
        positions.push(x, topY, 0, x, topY, depthM);
      });
      collectSurfaceCuts(depthM, 1).forEach((z) => {
        positions.push(0, topY, z, widthM, topY, z);
      });
    } else if (floorType === 'parke') {
      const plankDepthM = 0.20;
      collectSurfaceCuts(depthM, plankDepthM).forEach((z) => {
        positions.push(0, topY, z, widthM, topY, z);
      });
      let row = 0;
      for (let z = 0; z < depthM - 0.000001; z += plankDepthM, row += 1) {
        const rowEnd = Math.min(depthM, z + plankDepthM);
        const offset = row % 2 === 0 ? 0 : 0.5;
        for (let x = offset; x < widthM; x += 1) {
          if (x <= 0.000001) continue;
          positions.push(x, topY, z, x, topY, rowEnd);
        }
      }
    }

    if (!positions.length) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({
      color: floorType === 'parke' ? 0x6f4a2d : 0x9aa0a6,
      transparent: true,
      opacity: floorType === 'parke' ? 0.55 : 0.68,
    });
    const lines = new THREE.LineSegments(geometry, material);
    lines.renderOrder = 8;
    return lines;
  }

  function setFloorType(floorType = 'karolaj') {
    const resolved = FLOOR_TYPES.includes(floorType) ? floorType : 'karolaj';
    currentFloorType = resolved;

    const material = activeFloor.material;
    if (resolved === 'hali') {
      material.color.set(0x8b8f94);
      material.roughness = 1;
      material.metalness = 0;
    } else if (resolved === 'parke') {
      material.color.set(0xb98252);
      material.roughness = 0.72;
      material.metalness = 0;
    } else {
      material.color.set(FLOOR_COLOR);
      material.roughness = 0.92;
      material.metalness = 0;
    }
    material.needsUpdate = true;

    disposeGroundObject(floorPattern);
    floorPattern = null;
    if (stageLayout) {
      floorPattern = createFloorPattern(stageLayout.widthM, stageLayout.depthM, resolved);
      if (floorPattern) scene.add(floorPattern);
    }
    return resolved;
  }`
  );

  next = next.replace(
`    stageLayout = {
      standType,`,
`    stageLayout = {
      standType,`
  );

  next = next.replace(
`      surroundM: STAGE_SURROUND_M,
    };

    if (resetView) resetStageView();`,
`      surroundM: STAGE_SURROUND_M,
      platformHeightM: ACTIVE_PLATFORM_HEIGHT_M,
      floorType: currentFloorType,
    };

    setFloorType(currentFloorType);
    if (resetView) resetStageView();`
  );

  next = next.replace(
`    createStage,
    buildWall,`,
`    createStage,
    setFloorType,
    buildWall,`
  );
  return next;
});

console.log('Floor types added.');
