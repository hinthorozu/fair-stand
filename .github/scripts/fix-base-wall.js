const fs = require('fs');

function replaceOnce(path, needle, replacement) {
  let s = fs.readFileSync(path, 'utf8');
  if (!s.includes(needle)) throw new Error(`Needle not found: ${path}`);
  s = s.replace(needle, replacement);
  fs.writeFileSync(path, s);
}

replaceOnce(
  'src/designState.js',
  "    faces: {\n      front: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      left: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      right: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n    },\n  };\n}\n\nexport function createBaseModuleState",
  "    faces: {\n      left: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n      right: createEditablePanelState(null, DEFAULT_PANEL_COLOR),\n    },\n  };\n}\n\nexport function createBaseModuleState",
);

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
const start = scene.indexOf('  function createBaseWallModule(moduleState, moduleIndex, applyStoredImage) {');
const end = scene.indexOf('\n  function buildWall(modules, { resetView = true } = {}) {', start);
if (start < 0 || end < 0) throw new Error('createBaseWallModule block not found');

const replacement = `  function createBaseWallModule(moduleState, moduleIndex, applyStoredImage) {
    // Panel Bazalı normal Düz Panel ile aynı duvar geometrisidir.
    // Baza sadece panelin önüne monte edilen ektir; bağımsız tam Baza modülü değildir.
    const wallState = { ...moduleState, type: 'flat-panel' };
    const wall = createFlatPanelModule(wallState, moduleIndex, applyStoredImage);
    const group = wall.group;
    group.userData.kind = 'module';
    group.userData.moduleId = moduleState.id;
    group.userData.moduleType = 'base-wall';
    group.userData.moduleIndex = moduleIndex;

    const widthM = Number(moduleState.widthCm) / 100;
    const depthM = 0.50;
    const heightM = 0.50;
    const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;
    const railHeightM = PANEL_RAIL_HEIGHT_M;
    const frameDepthM = Number(STAND_DIMENSIONS.frameDepth);
    const topThicknessM = 0.035;
    const topOverhangM = 0.02;
    const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);
    const sidePanelWidthM = Math.max(depthM - profileM * 2, 0.05);
    const sidePanelHeightM = Math.max(frameHeightM - railHeightM, 0.05);
    const frontRailWidthM = Math.max(widthM - profileM * 2, 0.05);

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

    // Yalnızca öndeki iki kısa dikme. Arka dikmeler normal panelin 346,5 cm dikmeleridir.
    const shortPostGeometry = new THREE.BoxGeometry(profileM, frameHeightM, profileM);
    [-1, 1].forEach((xSide) => {
      addProfile(
        shortPostGeometry.clone(),
        new THREE.Vector3(
          xSide * (widthM / 2 - profileM / 2),
          frameHeightM / 2,
          depthM - profileM / 2,
        ),
      );
    });

    // Ön alt + üst uzun profil.
    const frontRailGeometry = new THREE.BoxGeometry(frontRailWidthM, railHeightM, frameDepthM);
    [0, frameHeightM].forEach((y) => {
      addProfile(
        frontRailGeometry.clone(),
        new THREE.Vector3(0, y, depthM - frameDepthM / 2),
      );
    });

    // Sol/sağ alt + üst bağlantı profilleri.
    const sideRailGeometry = new THREE.BoxGeometry(frameDepthM, railHeightM, sidePanelWidthM);
    [-1, 1].forEach((xSide) => {
      [0, frameHeightM].forEach((y) => {
        addProfile(
          sideRailGeometry.clone(),
          new THREE.Vector3(
            xSide * (widthM / 2 - frameDepthM / 2),
            y,
            depthM / 2,
          ),
        );
      });
    });

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(
        widthM + topOverhangM * 2,
        topThicknessM,
        depthM + topOverhangM * 2,
      ),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.74, metalness: 0 }),
    );
    top.position.set(0, frameHeightM + topThicknessM / 2, depthM / 2);
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    const attachmentSurfaces = [];
    const addSidePanel = (surfaceRole, surfaceState, x, rotationY) => {
      if (!surfaceState) return;
      const panelCenterZ = depthM / 2;
      const panelCenterY = frameHeightM / 2;

      const backing = new THREE.Mesh(
        new THREE.BoxGeometry(sidePanelWidthM, sidePanelHeightM, 0.012),
        new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.74, metalness: 0 }),
      );
      backing.position.set(x, panelCenterY, panelCenterZ);
      backing.rotation.y = rotationY;
      backing.position.x += surfaceRole === 'left' ? 0.006 : -0.006;
      backing.castShadow = true;
      backing.receiveShadow = true;
      group.add(backing);

      const surface = new THREE.Mesh(
        new THREE.PlaneGeometry(sidePanelWidthM, sidePanelHeightM),
        new THREE.MeshStandardMaterial({
          color: surfaceState.imageAssetId ? 0xffffff : surfaceState.color,
          roughness: 0.72,
          metalness: 0,
          side: THREE.DoubleSide,
          emissive: 0x000000,
          emissiveIntensity: 0,
        }),
      );
      surface.position.set(x, panelCenterY, panelCenterZ);
      surface.rotation.y = rotationY;
      surface.position.x += surfaceRole === 'left' ? -0.006 : 0.006;
      const selectionFrame = createSelectionFrame(sidePanelWidthM, sidePanelHeightM);
      selectionFrame.visible = false;
      surface.add(selectionFrame);
      surface.userData = {
        kind: 'surface',
        moduleType: 'base-wall',
        selectionMode: 'module',
        acceptsImage: true,
        moduleIndex,
        moduleId: moduleState.id,
        widthCm: Number(moduleState.widthCm),
        stripIndex: null,
        stripNumber: null,
        surfaceRole,
        surfaceId: surfaceState.id,
        surfaceState,
        selectionFrame,
        backing,
      };
      group.add(surface);
      attachmentSurfaces.push(surface);
      applyStoredImage?.(surface);
    };

    addSidePanel('left', moduleState.faces?.left, -widthM / 2 + 0.006, -Math.PI / 2);
    addSidePanel('right', moduleState.faces?.right, widthM / 2 - 0.006, Math.PI / 2);

    const surfaces = [...wall.surfaces, ...attachmentSurfaces];
    surfaces.forEach((surface) => {
      surface.userData.moduleId = moduleState.id;
      surface.userData.moduleType = 'base-wall';
      surface.userData.moduleIndex = moduleIndex;
    });
    return { group, surfaces };
  }
`;
scene = scene.slice(0, start) + replacement + scene.slice(end);
fs.writeFileSync(scenePath, scene);

const mainPath = 'src/main.js';
let main = fs.readFileSync(mainPath, 'utf8');
const anchor = `      if (moduleType === 'base') {
        const faceLabel = surface.userData.surfaceRole === 'front'
          ? 'ön'
          : (surface.userData.surfaceRole === 'left' ? 'sol yan' : 'sağ yan');
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Baza ' + widthCm + ' cm · ' + faceLabel + ' panel · renk + görsel uygulanabilir.';
        return;
      }
`;
if (!main.includes(anchor)) throw new Error('main base selection anchor not found');
main = main.replace(anchor, anchor + `
      if (moduleType === 'base-wall') {
        if (surface.userData.surfaceRole === 'left' || surface.userData.surfaceRole === 'right') {
          const faceLabel = surface.userData.surfaceRole === 'left' ? 'sol baza yanı' : 'sağ baza yanı';
          selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Panel Bazalı ' + widthCm + ' cm · ' + faceLabel + ' · renk + görsel uygulanabilir.';
        } else {
          selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Panel Bazalı ' + widthCm + ' cm · alttan ' + stripNumber + '. duvar paneli · Ctrl/Cmd + tık ile blok seç.';
        }
        return;
      }
`);
fs.writeFileSync(mainPath, main);

fs.writeFileSync('test/baseWallState.test.js', `import test from 'node:test';
import assert from 'node:assert/strict';
import { createBaseWallModuleState, duplicateModuleState } from '../src/designState.js';

for (const width of [100, 150, 200]) {
  test(\`Panel Bazalı \${width} normal panel + monte baza state kullanır\`, () => {
    const state = createBaseWallModuleState(width);
    assert.equal(state.type, 'base-wall');
    assert.equal(state.strips.length, 7);
    assert.deepEqual(Object.keys(state.faces).sort(), ['left', 'right']);
    assert.equal(state.depthCm, 50);
    assert.equal(state.heightCm, 350);
  });
}

test('Panel Bazalı kopyası 7 duvar ve 2 yan panel kimliğini bağımsızlaştırır', () => {
  const source = createBaseWallModuleState(100);
  const copy = duplicateModuleState(source);
  assert.notEqual(copy.id, source.id);
  source.strips.forEach((strip, i) => assert.notEqual(copy.strips[i].id, strip.id));
  assert.notEqual(copy.faces.left.id, source.faces.left.id);
  assert.notEqual(copy.faces.right.id, source.faces.right.id);
});
`);
