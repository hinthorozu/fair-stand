from pathlib import Path
import subprocess

HISTORIC_COMMIT = '45f639dee7bdffe6c0e155ce6bae28fe53abe6ef'
HISTORIC_PATH = '.github/tmp/beige_sofa_model.glb.gz'
TARGET = Path('public/models/bej_koltuk_1_ciftli_2_tekli.glb')

TARGET.parent.mkdir(parents=True, exist_ok=True)
gz = subprocess.check_output(['git', 'show', f'{HISTORIC_COMMIT}:{HISTORIC_PATH}'])
import gzip
raw = gzip.decompress(gz)
if raw[:4] != b'glTF':
    raise SystemExit('restored payload is not a GLB')
TARGET.write_bytes(raw)
print(f'wrote {TARGET} ({len(raw)} bytes)')

scene_path = Path('src/scene3d.js')
s = scene_path.read_text()
loader_start = s.find('const BEIGE_SOFA_MESH_META')
floor_start = s.find('function isFloorFixtureType', loader_start)
if loader_start < 0 or floor_start < 0:
    raise SystemExit('beige binary loader block not found')

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

direct_renderer = """function createBeigeSofaSetModule(moduleState, moduleIndex) {
  const group = new THREE.Group();
  const widthM = Number(moduleState.widthCm || 150) / 100;
  const depthM = Number(moduleState.depthCm || 150) / 100;
  const heightM = Number(moduleState.heightCm || 78) / 100;

  const proxyMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, Math.max(heightM, 0.02), depthM),
    proxyMaterial,
  );
  proxy.position.y = Math.max(heightM, 0.02) / 2;
  proxy.userData.surfaceId = moduleState.surface?.id;
  proxy.userData.moduleIndex = moduleIndex;
  group.add(proxy);

  loadBeigeSofaModel()
    .then((sourceScene) => {
      const model = sourceScene.clone(true);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      model.updateMatrixWorld(true);
      const sourceBox = new THREE.Box3().setFromObject(model);
      const sourceSize = sourceBox.getSize(new THREE.Vector3());
      const footprint = Math.max(sourceSize.x, sourceSize.z);
      if (Number.isFinite(footprint) && footprint > 0) {
        model.scale.setScalar(Math.min(widthM, depthM) / footprint);
      }

      model.updateMatrixWorld(true);
      const fittedBox = new THREE.Box3().setFromObject(model);
      const fittedCenter = fittedBox.getCenter(new THREE.Vector3());
      model.position.x -= fittedCenter.x;
      model.position.z -= fittedCenter.z;
      model.position.y -= fittedBox.min.y;
      group.add(model);
    })
    .catch((error) => console.error('Bej koltuk GLB yüklenemedi:', error));

  return { group, surfaces: [proxy] };
}

"""
s = s[:fn_start] + direct_renderer + s[next_fn:]
scene_path.write_text(s)

obsolete = Path('public/models/beige_sofa_mesh.bin')
if obsolete.exists():
    obsolete.unlink()
print('scene3d.js switched to direct GLTFLoader')
