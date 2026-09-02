from pathlib import Path


def replace_once(path, old, new):
    p = Path(path)
    s = p.read_text()
    if old not in s:
        raise SystemExit(f'pattern not found in {path}: {old[:120]!r}')
    p.write_text(s.replace(old, new, 1))

# Catalog
replace_once('src/catalog.js',
"  TV_55: createTvCatalogItem(TV_55_DEFINITION),\n  TV_65: createTvCatalogItem(TV_65_DEFINITION),",
"  TV_55: createTvCatalogItem(TV_55_DEFINITION),\n  VIDEO_WALL_2X2: Object.freeze({\n    ...createTvCatalogItem(TV_55_DEFINITION),\n    widthCm: TV_55_DEFINITION.screenWidthCm * 2,\n    heightCm: TV_55_DEFINITION.screenHeightCm * 2,\n    screenWidthCm: TV_55_DEFINITION.screenWidthCm * 2,\n    screenHeightCm: TV_55_DEFINITION.screenHeightCm * 2,\n    panelScreenWidthCm: TV_55_DEFINITION.screenWidthCm,\n    panelScreenHeightCm: TV_55_DEFINITION.screenHeightCm,\n    videoWallRows: 2,\n    videoWallCols: 2,\n    label: 'Video Wall 2×2 · 4×55-inch',\n  }),\n  TV_65: createTvCatalogItem(TV_65_DEFINITION),")
replace_once('src/catalog.js',
"  'TV_42',\n  'TV_55',\n  'TV_65',",
"  'TV_42',\n  'TV_55',\n  'VIDEO_WALL_2X2',\n  'TV_65',")
replace_once('src/catalog.js',
"keys: Object.freeze(['TV_42', 'TV_55', 'TV_65', 'LED_FLOODLIGHT'])",
"keys: Object.freeze(['TV_42', 'TV_55', 'VIDEO_WALL_2X2', 'TV_65', 'LED_FLOODLIGHT'])")

# TV state inheritance
replace_once('src/designState.js',
"export function createTvModuleState(sizeInch = 42) {\n\n  const definition = getTvDefinition(sizeInch);",
"export function createTvModuleState(sizeInch = 42, descriptor = {}) {\n\n  const definition = getTvDefinition(sizeInch);")
replace_once('src/designState.js',
"    widthCm: definition.widthCm,\n    depthCm: definition.depthCm,\n    heightCm: definition.screenHeightCm,\n    sizeInch: definition.sizeInch,\n    screenWidthCm: definition.screenWidthCm,\n    screenHeightCm: definition.screenHeightCm,\n  };",
"    widthCm: Number(descriptor.widthCm) || definition.widthCm,\n    depthCm: definition.depthCm,\n    heightCm: Number(descriptor.screenHeightCm) || definition.screenHeightCm,\n    sizeInch: definition.sizeInch,\n    screenWidthCm: Number(descriptor.screenWidthCm) || definition.screenWidthCm,\n    screenHeightCm: Number(descriptor.screenHeightCm) || definition.screenHeightCm,\n    videoWallRows: Math.max(1, Number(descriptor.videoWallRows) || 1),\n    videoWallCols: Math.max(1, Number(descriptor.videoWallCols) || 1),\n    panelScreenWidthCm: Number(descriptor.panelScreenWidthCm) || definition.screenWidthCm,\n    panelScreenHeightCm: Number(descriptor.panelScreenHeightCm) || definition.screenHeightCm,\n  };")
replace_once('src/main.js',
"else if (module.type === 'tv') state = createTvModuleState(module.sizeInch ?? 42);",
"else if (module.type === 'tv') state = createTvModuleState(module.sizeInch ?? 42, module);")

# Renderer
start = Path('src/scene3d.js').read_text()
func_start = start.index('function createTvModule(moduleState, moduleIndex) {')
func_end = start.index('\nfunction createMiniFridgeTopLabel', func_start)
new_func = '''function createTvModule(moduleState, moduleIndex) {
  const rows = Math.max(1, Math.round(Number(moduleState.videoWallRows) || 1));
  const cols = Math.max(1, Math.round(Number(moduleState.videoWallCols) || 1));
  const panelWidthM = Number(moduleState.panelScreenWidthCm || moduleState.screenWidthCm || 93) / 100;
  const panelHeightM = Number(moduleState.panelScreenHeightCm || moduleState.screenHeightCm || 52.3) / 100;
  const widthM = panelWidthM * cols;
  const heightM = panelHeightM * rows;
  const depthM = Number(moduleState.depthCm || 5) / 100;
  const centerYM = 1.75;

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
  const wallFrontM = STAND_DIMENSIONS.depth / 2 + 0.0015;
  const centerZM = wallFrontM + depthM / 2 + 0.003;
  const surfaces = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const screenTexture = createTvScreenTexture();
      const materials = [
        blackMaterial(), blackMaterial(), blackMaterial(), blackMaterial(),
        new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }),
        blackMaterial(),
      ];
      const tv = new THREE.Mesh(new THREE.BoxGeometry(panelWidthM, panelHeightM, depthM), materials);
      tv.position.set(
        (col - (cols - 1) / 2) * panelWidthM,
        centerYM + ((rows - 1) / 2 - row) * panelHeightM,
        centerZM,
      );
      tv.castShadow = true;
      tv.receiveShadow = true;
      tv.userData.kind = 'surface';
      tv.userData.surfaceId = `${moduleState.id}:tv:${row}:${col}`;
      tv.userData.moduleId = moduleState.id;
      tv.userData.moduleType = 'tv';
      tv.userData.moduleIndex = moduleIndex;
      tv.userData.acceptsImage = false;
      tv.userData.selectionMode = 'module';
      tv.userData.videoWallRow = row;
      tv.userData.videoWallCol = col;
      group.add(tv);
      surfaces.push(tv);
    }
  }

  if (rows > 1 || cols > 1) {
    const seamMaterial = new THREE.MeshBasicMaterial({ color: 0x090909, toneMapped: false });
    const seamThicknessM = 0.010;
    for (let col = 1; col < cols; col += 1) {
      const seam = new THREE.Mesh(new THREE.PlaneGeometry(seamThicknessM, heightM), seamMaterial.clone());
      seam.position.set((col - cols / 2) * panelWidthM, centerYM, centerZM + depthM / 2 + 0.0006);
      group.add(seam);
    }
    for (let row = 1; row < rows; row += 1) {
      const seam = new THREE.Mesh(new THREE.PlaneGeometry(widthM, seamThicknessM), seamMaterial.clone());
      seam.position.set(0, centerYM + (rows / 2 - row) * panelHeightM, centerZM + depthM / 2 + 0.0007);
      group.add(seam);
    }
  }

  group.userData.selectionBounds = Object.freeze({
    widthM,
    heightM,
    depthM,
    centerX: 0,
    centerY: centerYM,
    centerZ: centerZM,
  });
  return { group, surfaces };
}
'''
Path('src/scene3d.js').write_text(start[:func_start] + new_func + start[func_end:])

# Catalog icon
replace_once('src/moduleDragSidebar.js',
"    .module-drag-tv::after { content:''; position:absolute; left:22px; top:39px; width:22px; height:5px; background:#30343a; box-shadow:0 7px 0 -1px #30343a; clip-path:polygon(27% 0,73% 0,86% 100%,100% 100%,100% 100%,0 100%,14% 100%); }",
"    .module-drag-tv::after { content:''; position:absolute; left:22px; top:39px; width:22px; height:5px; background:#30343a; box-shadow:0 7px 0 -1px #30343a; clip-path:polygon(27% 0,73% 0,86% 100%,100% 100%,100% 100%,0 100%,14% 100%); }\n    .module-drag-tv.is-video-wall::before { left:3px; top:5px; width:60px; height:42px; border:3px solid #26292d; border-radius:1px; background:linear-gradient(to right,transparent calc(50% - 1px),#111 50%,transparent calc(50% + 1px)),linear-gradient(to bottom,transparent calc(50% - 1px),#111 50%,transparent calc(50% + 1px)),#dbeafe; box-sizing:border-box; }\n    .module-drag-tv.is-video-wall::after { display:none; }")
replace_once('src/moduleDragSidebar.js',
"    body.className = 'module-drag-tv';\n    preview.appendChild(body);",
"    body.className = 'module-drag-tv';\n    if (Number(module.videoWallRows) > 1 || Number(module.videoWallCols) > 1) body.classList.add('is-video-wall');\n    preview.appendChild(body);")

Path('.github/workflows/add-video-wall-2x2.yml').unlink(missing_ok=True)
Path('scripts/add-video-wall-2x2.py').unlink(missing_ok=True)
