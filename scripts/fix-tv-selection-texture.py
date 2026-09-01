from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text()

old = """function createTvModule(moduleState, moduleIndex) {
  const widthM = Number(moduleState.screenWidthCm || 93) / 100;
  const heightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const depthM = 0.05;
  const centerYM = 1.75;

  const group = new THREE.Group();
  group.userData.kind = 'module';
  group.userData.moduleId = moduleState.id;
  group.userData.moduleIndex = moduleIndex;
  group.userData.moduleType = 'tv';

  const blackMaterial = () => new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.72,
    metalness: 0.05,
  });

  // BoxGeometry face material order:
  // +X, -X, +Y, -Y, +Z(front), -Z(back).
  // The TV is ONE 93 x 52.3 x 5 cm solid. No extra screen plane exists.
  const materials = [
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    new THREE.MeshBasicMaterial({
      map: getTvScreenTexture(),
      toneMapped: false,
    }),
    blackMaterial(),
  ];

  const tv = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    materials,
  );
  tv.position.set(0, centerYM, 0);
  tv.castShadow = true;
  tv.receiveShadow = true;
  tv.userData.kind = 'surface';
  tv.userData.surfaceId = `${moduleState.id}:tv`;
  tv.userData.moduleId = moduleState.id;
  tv.userData.moduleType = 'tv';
  tv.userData.moduleIndex = moduleIndex;
  tv.userData.acceptsImage = false;
  tv.userData.selectionMode = 'module';
  group.add(tv);

  return { group, surfaces: [tv] };
}"""

new = """function createTvModule(moduleState, moduleIndex) {
  const widthM = Number(moduleState.screenWidthCm || 93) / 100;
  const heightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const depthM = 0.05;
  const centerYM = 1.75;
  // Each rendered TV owns its texture clone. disposeWall() may dispose module maps
  // during rebuilds without invalidating the cached source texture used by later TVs.
  const screenTexture = getTvScreenTexture().clone();
  screenTexture.needsUpdate = true;

  const group = new THREE.Group();
  group.userData.kind = 'module';
  group.userData.moduleId = moduleState.id;
  group.userData.moduleIndex = moduleIndex;
  group.userData.moduleType = 'tv';
  group.userData.type = 'tv';
  group.userData.widthCm = Number(moduleState.widthCm || 100);
  group.userData.depthCm = 5;
  group.userData.heightCm = Number(moduleState.screenHeightCm || 52.3);

  const blackMaterial = () => new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.72,
    metalness: 0.05,
  });

  // BoxGeometry face material order:
  // +X, -X, +Y, -Y, +Z(front), -Z(back).
  // The TV is ONE 93 x 52.3 x 5 cm solid. No extra screen plane exists.
  const materials = [
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    }),
    blackMaterial(),
  ];

  const tv = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    materials,
  );
  tv.position.set(0, centerYM, 0);
  tv.castShadow = true;
  tv.receiveShadow = true;

  // TV uses an array of six face materials, so emissive-based selection cannot mark it.
  // Give it the same explicit selection frame used by selectable panel surfaces.
  const selectionFrame = createSelectionFrame(widthM, heightM);
  selectionFrame.position.z = depthM / 2 + 0.006;
  selectionFrame.visible = false;
  tv.add(selectionFrame);

  tv.userData.kind = 'surface';
  tv.userData.surfaceId = `${moduleState.id}:tv`;
  tv.userData.moduleId = moduleState.id;
  tv.userData.moduleType = 'tv';
  tv.userData.moduleIndex = moduleIndex;
  tv.userData.acceptsImage = false;
  tv.userData.selectionMode = 'module';
  tv.userData.selectionFrame = selectionFrame;
  group.add(tv);

  return { group, surfaces: [tv] };
}"""

if old not in s:
    raise SystemExit('createTvModule block not found')
s = s.replace(old, new, 1)
scene.write_text(s)

test = Path('test/tv42Module.test.js')
t = test.read_text()
needle = """  assert.match(tvSource, /map: getTvScreenTexture\\(\\)/);
  assert.doesNotMatch(tvSource, /new THREE\\.PlaneGeometry/);"""
replacement = """  assert.match(tvSource, /getTvScreenTexture\\(\\)\\.clone\\(\\)/);
  assert.match(tvSource, /map: screenTexture/);
  assert.match(tvSource, /createSelectionFrame\\(widthM, heightM\\)/);
  assert.match(tvSource, /tv\\.userData\\.selectionFrame = selectionFrame/);
  assert.doesNotMatch(tvSource, /new THREE\\.PlaneGeometry/);"""
if needle not in t:
    raise SystemExit('TV renderer test block not found')
t = t.replace(needle, replacement, 1)
test.write_text(t)
