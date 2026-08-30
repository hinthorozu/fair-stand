from pathlib import Path
import base64
import hashlib
import lzma

TARGET = Path('public/models/bej_koltuk_1_ciftli_2_tekli.glb')
PARTS_DIR = Path('.github/beige-upload')
EXPECTED_SIZE = 377632
EXPECTED_SHA256 = '35b0f3f8a1daca909507d55d2b3d8f642504ac0911d3b9b66150be9ecea8ad0b'

encoded = ''.join(path.read_text().strip() for path in sorted(PARTS_DIR.glob('part*.b64')))
raw = lzma.decompress(base64.b64decode(encoded))
if len(raw) != EXPECTED_SIZE:
    raise SystemExit(f'unexpected beige GLB size: {len(raw)}')
if hashlib.sha256(raw).hexdigest() != EXPECTED_SHA256:
    raise SystemExit('beige GLB checksum mismatch')
if raw[:4] != b'glTF':
    raise SystemExit('staged payload is not a GLB')
TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_bytes(raw)

obsolete = Path('public/models/beige_sofa_mesh.bin')
if obsolete.exists():
    obsolete.unlink()

scene_path = Path('src/scene3d.js')
s = scene_path.read_text()

loader_start = s.find('const BEIGE_SOFA_MESH_META')
floor_start = s.find('function isFloorFixtureType', loader_start)
if loader_start < 0 or floor_start < 0:
    loader_start = s.find('let beigeSofaModelPromise')
    floor_start = s.find('function isFloorFixtureType', loader_start)
if loader_start < 0 or floor_start < 0:
    raise SystemExit('beige loader block not found')

direct_loader = """let beigeSofaModelPromise = null;

function loadBeigeSofaModel() {
  if (!beigeSofaModelPromise) {
    const loader = new GLTFLoader();
    beigeSofaModelPromise = loader
      .loadAsync(import.meta.env.BASE_URL + 'models/bej_koltuk_1_ciftli_2_tekli.glb')
      .then((gltf) => gltf.scene);
  }
  return beigeSofaModelPromise;
}


"""
s = s[:loader_start] + direct_loader + s[floor_start:]

fn_start = s.find('function createBeigeSofaSetModule(')
next_fn = s.find('function createSofaSetModule(', fn_start)
if fn_start < 0 or next_fn < 0:
    raise SystemExit('beige renderer block not found')

renderer = r"""function createBeigeSofaSetModule(moduleState, moduleIndex) {
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

  const placements = [
    {
      meshName: 'beigechair2seatsofa_tripo_mat_0691346e_0',
      targetWidthM: loveseatWidthM,
      targetDepthM: sofaDepthM,
      targetHeightM: heightM,
      x: 0,
      z: backRowZ,
      desiredFrontAngle: Math.PI / 2,
    },
    {
      meshName: 'beigechair1_tripo_mat_0691346e_0',
      targetWidthM: chairWidthM,
      targetDepthM: sofaDepthM,
      targetHeightM: heightM,
      x: -chairCenterOffsetM,
      z: frontRowZ,
      desiredFrontAngle: -Math.PI / 2,
    },
    {
      meshName: 'beigechair3_tripo_mat_0691346e_0',
      targetWidthM: chairWidthM,
      targetDepthM: sofaDepthM,
      targetHeightM: heightM,
      x: chairCenterOffsetM,
      z: frontRowZ,
      desiredFrontAngle: -Math.PI / 2,
    },
  ];

  function getPrincipalAxisAngle(mesh) {
    const position = mesh.geometry?.getAttribute?.('position');
    if (!position || position.count < 2) return 0;
    let meanX = 0;
    let meanZ = 0;
    for (let i = 0; i < position.count; i += 1) {
      meanX += position.getX(i);
      meanZ += position.getZ(i);
    }
    meanX /= position.count;
    meanZ /= position.count;
    let xx = 0;
    let zz = 0;
    let xz = 0;
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i) - meanX;
      const z = position.getZ(i) - meanZ;
      xx += x * x;
      zz += z * z;
      xz += x * z;
    }
    return 0.5 * Math.atan2(2 * xz, xx - zz);
  }

  loadBeigeSofaModel().then((sourceScene) => {
    if (!group.parent) return;

    placements.forEach((placement) => {
      const source = sourceScene.getObjectByName(placement.meshName);
      if (!source?.isMesh) {
        console.warn('Bej koltuk mesh bulunamadı:', placement.meshName);
        return;
      }

      const mesh = source.clone(true);
      if (mesh.material) mesh.material = mesh.material.clone();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      colorTargets.push(mesh);

      mesh.updateMatrixWorld(true);
      const originalBox = new THREE.Box3().setFromObject(mesh);
      const originalCenter = originalBox.getCenter(new THREE.Vector3());
      const sourceCenterXZ = new THREE.Vector2(originalCenter.x, originalCenter.z);
      mesh.position.sub(originalCenter);

      const longAxis = getPrincipalAxisAngle(mesh);
      const normalA = longAxis + Math.PI / 2;
      const normalB = longAxis - Math.PI / 2;
      const towardOrigin = Math.atan2(-sourceCenterXZ.y, -sourceCenterXZ.x);
      const angleDistance = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
      const sourceFront = angleDistance(normalA, towardOrigin) <= angleDistance(normalB, towardOrigin)
        ? normalA
        : normalB;
      const rotationY = sourceFront - placement.desiredFrontAngle;

      const oriented = new THREE.Group();
      oriented.rotation.y = rotationY;
      oriented.add(mesh);
      oriented.updateMatrixWorld(true);

      const orientedBox = new THREE.Box3().setFromObject(oriented);
      const orientedSize = orientedBox.getSize(new THREE.Vector3());
      const uniformScale = Math.min(
        orientedSize.x > 0 ? placement.targetWidthM / orientedSize.x : 1,
        orientedSize.z > 0 ? placement.targetDepthM / orientedSize.z : 1,
        orientedSize.y > 0 ? placement.targetHeightM / orientedSize.y : 1,
      );

      const fitted = new THREE.Group();
      fitted.scale.setScalar(Number.isFinite(uniformScale) && uniformScale > 0 ? uniformScale : 1);
      fitted.add(oriented);
      fitted.updateMatrixWorld(true);
      const fittedBox = new THREE.Box3().setFromObject(fitted);
      const fittedCenter = fittedBox.getCenter(new THREE.Vector3());
      fitted.position.set(
        placement.x - fittedCenter.x,
        -fittedBox.min.y,
        placement.z - fittedCenter.z,
      );
      group.add(fitted);
    });
  }).catch((error) => {
    console.warn('Bej koltuk GLB yüklenemedi:', error);
  });

  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.60, 0.018, 0.42),
    new THREE.MeshPhysicalMaterial({
      color: 0xd7e9ed,
      transparent: true,
      opacity: 0.42,
      roughness: 0.12,
      metalness: 0,
      transmission: 0.28,
      depthWrite: false,
    }),
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

"""
s = s[:fn_start] + renderer + s[next_fn:]
scene_path.write_text(s)
print(f'wrote {TARGET} and switched beige sofa to native GLTFLoader')
