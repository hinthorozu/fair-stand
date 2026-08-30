from pathlib import Path
import re

path = Path('src/scene3d.js')
text = path.read_text()

loader = """let beigeSofaModelPromise = null;

function loadBeigeSofaModel() {
  if (!beigeSofaModelPromise) {
    const loader = new GLTFLoader();
    beigeSofaModelPromise = loader
      .loadAsync(import.meta.env.BASE_URL + 'models/bej_koltuk_1_ciftli_2_tekli.glb')
      .then((gltf) => gltf.scene);
  }
  return beigeSofaModelPromise;
}

function isFloorFixtureType"""

text, count = re.subn(
    r"const BEIGE_SOFA_MESH_META = Object\.freeze\(\[.*?\nfunction isFloorFixtureType",
    loader,
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit(f'beige loader block replacement count={count}')

renderer = r'''function createBeigeSofaSetModule(moduleState, moduleIndex) {
  const widthCm = Number(moduleState.widthCm || 150);
  const depthCm = Number(moduleState.depthCm || 150);
  const heightCm = Number(moduleState.heightCm || 78);
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const heightM = heightCm / 100;
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'sofa-set-beige',
    widthCm,
    depthCm,
    heightCm,
  };

  const loveseatWidthM = 1.50;
  const chairWidthM = 0.65;
  const sofaDepthM = 0.45;
  const chairGapM = 0.20;
  const chairCenterOffsetM = (chairWidthM + chairGapM) / 2;
  const backRowZ = -depthM / 2 + sofaDepthM / 2;
  const frontRowZ = depthM / 2 - sofaDepthM / 2;

  const colorTargets = [];
  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  );
  proxy.position.set(0, heightM / 2, 0);
  group.add(proxy);

  const selectionFrame = createSelectionFrame(widthM, heightM);
  selectionFrame.visible = false;
  proxy.add(selectionFrame);
  proxy.userData = {
    kind: 'surface',
    moduleType: 'sofa-set-beige',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'furniture',
    surfaceId: moduleState.surface?.id,
    surfaceState: moduleState.surface,
    selectionFrame,
    colorTargets,
  };

  const placements = Object.freeze([
    Object.freeze({ meshName: 'beigechair2seatsofa_tripo_mat_0691346e_0', targetWidthM: loveseatWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: 0, z: backRowZ, rotationYDeg: -45.26002361732807 }),
    Object.freeze({ meshName: 'beigechair1_tripo_mat_0691346e_0', targetWidthM: chairWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: -chairCenterOffsetM, z: frontRowZ, rotationYDeg: 35.1154498349714 }),
    Object.freeze({ meshName: 'beigechair3_tripo_mat_0691346e_0', targetWidthM: chairWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: chairCenterOffsetM, z: frontRowZ, rotationYDeg: -136.13688181359935 }),
  ]);

  loadBeigeSofaModel().then((template) => {
    if (!group.parent) return;

    placements.forEach((placement) => {
      const source = template.getObjectByName(placement.meshName);
      if (!source) {
        console.warn('Bej koltuk GLB mesh bulunamadı:', placement.meshName);
        return;
      }

      const mesh = source.clone(true);
      mesh.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = true;
        object.receiveShadow = true;
        if (Array.isArray(object.material)) {
          object.material = object.material.map((material) => material?.clone?.() ?? material);
        } else if (object.material) {
          object.material = object.material.clone();
        }
        colorTargets.push(object);
      });

      mesh.updateMatrixWorld(true);
      const sourceBox = new THREE.Box3().setFromObject(mesh);
      const sourceCenter = sourceBox.getCenter(new THREE.Vector3());
      mesh.position.x -= sourceCenter.x;
      mesh.position.y -= sourceCenter.y;
      mesh.position.z -= sourceCenter.z;

      const oriented = new THREE.Group();
      oriented.rotation.y = THREE.MathUtils.degToRad(placement.rotationYDeg);
      oriented.add(mesh);
      oriented.updateMatrixWorld(true);

      const orientedBox = new THREE.Box3().setFromObject(oriented);
      const orientedSize = orientedBox.getSize(new THREE.Vector3());
      const fitted = new THREE.Group();
      fitted.scale.set(
        orientedSize.x > 0 ? placement.targetWidthM / orientedSize.x : 1,
        orientedSize.y > 0 ? placement.targetHeightM / orientedSize.y : 1,
        orientedSize.z > 0 ? placement.targetDepthM / orientedSize.z : 1,
      );
      fitted.position.set(placement.x, placement.targetHeightM / 2, placement.z);
      fitted.add(oriented);
      group.add(fitted);
    });
  }).catch((error) => {
    console.warn('Bej koltuk takımı GLB modeli yüklenemedi:', error);
  });

  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.60, 0.018, 0.42),
    new THREE.MeshPhysicalMaterial({ color: 0xd7e9ed, transparent: true, opacity: 0.42, roughness: 0.12, metalness: 0, transmission: 0.28, depthWrite: false }),
  );
  tableTop.position.set(0, 0.38, 0);
  tableTop.receiveShadow = true;
  group.add(tableTop);

  const tableStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.35, 20),
    new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.28 }),
  );
  tableStem.position.set(0, 0.19, 0);
  tableStem.castShadow = true;
  group.add(tableStem);

  const tableBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32),
    new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.30 }),
  );
  tableBase.position.set(0, 0.018, 0);
  tableBase.castShadow = true;
  tableBase.receiveShadow = true;
  group.add(tableBase);

  return { group, surfaces: [proxy] };
}

function createSofaSetModule'''

text, count = re.subn(
    r"function createBeigeSofaSetModule\(moduleState, moduleIndex\) \{.*?\n\}\n\nfunction createSofaSetModule",
    renderer,
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise SystemExit(f'beige renderer replacement count={count}')

path.write_text(text)
