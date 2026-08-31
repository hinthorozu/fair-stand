from pathlib import Path

# designState: TV must not inherit/create flat-panel state.
p = Path('src/designState.js')
s = p.read_text()
old = """export function createTvModuleState(sizeInch = 42) {
  if (Number(sizeInch) !== 42) return null;
  const base = createFlatPanelModuleState(100);
  return {
    ...base,
    type: 'tv',
    heightCm: 350,
    sizeInch: 42,
    screenWidthCm: 93.0,
    screenHeightCm: 52.3,
  };
}
"""
new = """export function createTvModuleState(sizeInch = 42) {
  if (Number(sizeInch) !== 42) return null;
  return {
    id: createId('module'),
    type: 'tv',
    widthCm: 100,
    depthCm: 6,
    heightCm: 52.3,
    sizeInch: 42,
    screenWidthCm: 93.0,
    screenHeightCm: 52.3,
  };
}
"""
assert old in s
p.write_text(s.replace(old, new, 1))

# Behavior: real model ghost.
p = Path('src/moduleBehavior.js')
s = p.read_text()
old = "ghost: Object.freeze({ mode: 'proxy', renderer: null, opacity: 0.3 }),"
new = "ghost: Object.freeze({ kind: 'real-model', renderer: 'tv', opacity: 0.38 }),"
assert old in s
p.write_text(s.replace(old, new, 1))

# Scene: replace panel-derived TV with pure GLB-only module.
p = Path('src/scene3d.js')
s = p.read_text()
start = s.index('function createTvModule(moduleState, moduleIndex, onSurfaceReady) {')
end = s.index('\nfunction createLedFloodlightModule(', start)
new_func = r'''function createTvModule(moduleState, moduleIndex) {
  const logicalWidthCm = Number(moduleState.widthCm || 100);
  const targetWidthM = Number(moduleState.screenWidthCm || 93) / 100;
  const targetHeightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'tv',
    moduleType: 'tv',
    widthCm: logicalWidthCm,
    depthCm: Number(moduleState.depthCm || 6),
    heightCm: Number(moduleState.heightCm || 52.3),
    moduleState,
  };

  // Invisible selection proxy only; no wall/panel geometry is created for TV modules.
  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(targetWidthM, targetHeightM, 0.06),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  );
  proxy.position.set(0, 1.75, 0.05);
  group.add(proxy);
  const selectionFrame = createSelectionFrame(targetWidthM, targetHeightM);
  selectionFrame.visible = false;
  proxy.add(selectionFrame);
  proxy.userData = {
    kind: 'surface',
    moduleType: 'tv',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm: logicalWidthCm,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'tv',
    surfaceId: `${moduleState.id}-tv`,
    surfaceState: null,
    selectionFrame,
    colorTargets: [],
  };

  loadTvModel().then((template) => {
    if (!group.parent) return;
    const tv = template.clone(true);
    const allowedMeshes = new Set(['Object_4', 'Object_5']);
    tv.traverse((object) => {
      if (!object.isMesh) return;
      if (!allowedMeshes.has(object.name)) {
        object.visible = false;
        return;
      }
      object.castShadow = true;
      object.receiveShadow = true;
      if (object.name === 'Object_5') {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 576;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111318';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '700 92px Arial, sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('KYROX', 430, canvas.height / 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('.STUDIO', 680, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        object.material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
      }
    });

    tv.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(tv);
    const size = box.getSize(new THREE.Vector3());
    const scale = size.x > 0 ? targetWidthM / size.x : 1;
    tv.scale.multiplyScalar(scale);
    tv.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(tv);
    const center = box.getCenter(new THREE.Vector3());
    tv.position.x -= center.x;
    tv.position.y -= center.y;
    tv.position.z -= box.min.z;
    tv.position.y += 1.75;
    tv.position.z += 0.058;
    group.add(tv);
  }).catch((error) => {
    console.warn('TV GLB modeli yüklenemedi:', error);
  });

  return { group, surfaces: [proxy] };
}
'''
s = s[:start] + new_func + s[end:]

# Build dispatch no longer passes panel-image callback.
s = s.replace("module = createTvModule(moduleState, moduleIndex, (surface) => applyStoredImage(surface));", "module = createTvModule(moduleState, moduleIndex);")

# Real TV ghost branch before Bar Stool branch.
marker = "    // Bar Taburesi uses the actual GLB geometry as its placement ghost.\n"
assert marker in s
ghost = r'''    if (ghostBehavior.renderer === 'tv') {
      const proxy = new THREE.Mesh(
        new THREE.BoxGeometry(0.93, 0.523, 0.06),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
      );
      proxy.position.y = 1.75;
      root.add(proxy);
      scene.add(root);

      const tintMaterials = [];
      placementGhost = {
        root,
        mesh: proxy,
        tintMaterials,
        key,
        widthCm: dimensions.widthCm,
        ownsGeometry: true,
        colorHex: PLACEMENT_VALID_COLOR,
      };

      loadTvModel().then((template) => {
        if (placementGhost?.key !== key || placementGhost.root !== root) return;
        const tv = template.clone(true);
        const allowedMeshes = new Set(['Object_4', 'Object_5']);
        tv.traverse((object) => {
          if (!object.isMesh) return;
          if (!allowedMeshes.has(object.name)) {
            object.visible = false;
            return;
          }
          const material = new THREE.MeshBasicMaterial({
            color: placementGhost.colorHex ?? PLACEMENT_VALID_COLOR,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
            depthTest: false,
            side: THREE.DoubleSide,
          });
          object.material = material;
          object.renderOrder = 10000;
          tintMaterials.push(material);
        });
        tv.updateMatrixWorld(true);
        let box = new THREE.Box3().setFromObject(tv);
        const size = box.getSize(new THREE.Vector3());
        tv.scale.multiplyScalar(size.x > 0 ? 0.93 / size.x : 1);
        tv.updateMatrixWorld(true);
        box = new THREE.Box3().setFromObject(tv);
        const center = box.getCenter(new THREE.Vector3());
        tv.position.x -= center.x;
        tv.position.y -= center.y;
        tv.position.z -= box.min.z;
        tv.position.y += 1.75;
        tv.position.z += 0.058;
        root.add(tv);
      }).catch((error) => console.warn('TV ghost GLB modeli yüklenemedi:', error));
      return placementGhost;
    }

'''
s = s.replace(marker, ghost + marker, 1)
p.write_text(s)

# Main: selection wording should describe TV, and import/state already exists.
p = Path('src/main.js')
s = p.read_text()
needle = """      if (moduleType === 'bar-stool') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Bar Taburesi · GLB model.';
        return;
      }
"""
assert needle in s
addition = needle + """
      if (moduleType === 'tv') {
        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · TV 42\\\" · 93.0 × 52.3 cm · bağımsız GLB model.';
        return;
      }
"""
s = s.replace(needle, addition, 1)
p.write_text(s)

# Regression source contract.
p = Path('test/tv42Module.test.js')
s = p.read_text() if p.exists() else ''
if "does not inherit flat panel state" not in s:
    s += r'''

test('TV 42 does not inherit flat panel state', () => {
  const tv = createTvModuleState(42);
  assert.equal(tv.type, 'tv');
  assert.equal(tv.widthCm, 100);
  assert.equal(tv.screenWidthCm, 93);
  assert.equal(tv.screenHeightCm, 52.3);
  assert.equal('strips' in tv, false);
  assert.equal('faces' in tv, false);
});
'''
p.write_text(s)
