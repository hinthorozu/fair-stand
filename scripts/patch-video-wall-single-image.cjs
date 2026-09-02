const fs = require('fs');
const path = 'src/scene3d.js';
let s = fs.readFileSync(path, 'utf8');
const startToken = 'function createTvModule(moduleState, moduleIndex) {';
const endToken = '\nfunction createMiniFridgeTopLabel';
const start = s.indexOf(startToken);
const end = s.indexOf(endToken, start);
if (start < 0 || end < 0) throw new Error('TV renderer block not found');
const fn = `function createTvModule(moduleState, moduleIndex) {
  const rows = Math.max(1, Math.round(Number(moduleState.videoWallRows) || 1));
  const cols = Math.max(1, Math.round(Number(moduleState.videoWallCols) || 1));
  const widthM = Number(moduleState.screenWidthCm || 93) / 100;
  const heightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const panelWidthM = Number(moduleState.panelScreenWidthCm || moduleState.screenWidthCm || 93) / 100;
  const panelHeightM = Number(moduleState.panelScreenHeightCm || moduleState.screenHeightCm || 52.3) / 100;
  const depthM = Number(moduleState.depthCm || 5) / 100;
  const centerYM = 1.75;
  const wallFrontM = STAND_DIMENSIONS.depth / 2 + 0.0015;
  const centerZM = wallFrontM + depthM / 2 + 0.003;
  const isVideoWall = rows > 1 || cols > 1;

  const group = new THREE.Group();
  group.userData.kind = 'module';
  group.userData.moduleId = moduleState.id;
  group.userData.moduleIndex = moduleIndex;
  group.userData.moduleType = 'tv';
  group.userData.type = 'tv';
  group.userData.widthCm = Number(moduleState.widthCm || widthM * 100);
  group.userData.depthCm = Number(moduleState.depthCm || 5);
  group.userData.heightCm = heightM * 100;
  group.userData.videoWallRows = rows;
  group.userData.videoWallCols = cols;

  const blackMaterial = () => new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.72,
    metalness: 0.05,
  });

  const screenTexture = createTvScreenTexture();
  const tv = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    [
      blackMaterial(), blackMaterial(), blackMaterial(), blackMaterial(),
      new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
      blackMaterial(),
    ],
  );
  tv.position.set(0, centerYM, centerZM);
  tv.castShadow = true;
  tv.receiveShadow = true;
  tv.userData.kind = 'surface';
  tv.userData.surfaceId = moduleState.id + ':tv';
  tv.userData.moduleId = moduleState.id;
  tv.userData.moduleType = 'tv';
  tv.userData.moduleIndex = moduleIndex;
  tv.userData.acceptsImage = false;
  tv.userData.selectionMode = 'module';
  group.add(tv);

  if (isVideoWall) {
    const seamMaterial = new THREE.MeshBasicMaterial({ color: 0x090909, toneMapped: false });
    const seamThicknessM = 0.010;
    const seamDepthM = 0.002;
    for (let col = 1; col < cols; col += 1) {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(seamThicknessM, heightM, seamDepthM), seamMaterial.clone());
      seam.position.set((col - cols / 2) * panelWidthM, centerYM, centerZM + depthM / 2 + seamDepthM / 2 + 0.0002);
      group.add(seam);
    }
    for (let row = 1; row < rows; row += 1) {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(widthM, seamThicknessM, seamDepthM), seamMaterial.clone());
      seam.position.set(0, centerYM + (rows / 2 - row) * panelHeightM, centerZM + depthM / 2 + seamDepthM / 2 + 0.0003);
      group.add(seam);
    }
  }

  group.userData.selectionBounds = Object.freeze({
    widthM,
    heightM,
    depthM,
    centerX: tv.position.x,
    centerY: tv.position.y,
    centerZ: tv.position.z,
  });
  return { group, surfaces: [tv] };
}
`;
s = s.slice(0, start) + fn + s.slice(end);
fs.writeFileSync(path, s);
