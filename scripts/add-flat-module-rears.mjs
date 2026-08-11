import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error('Patch target not found: ' + label);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

if (!scene.includes('const MODULE_REAR_COLOR')) {
  scene = replaceOnce(
    scene,
    'const PANEL_BACK_COLOR = 0xf4f4f4;\n',
    'const PANEL_BACK_COLOR = 0xf4f4f4;\nconst MODULE_REAR_COLOR = 0xe1e5e9;\n',
    'rear color constant',
  );
}

if (!scene.includes('function addFlatModuleRear(')) {
  scene = replaceOnce(
    scene,
    '\nfunction createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady) {',
    `\nfunction addFlatModuleRear(group, widthM, height, depth) {\n  const rear = new THREE.Mesh(\n    new THREE.PlaneGeometry(Math.max(widthM, 0.02), Math.max(height, 0.02)),\n    new THREE.MeshStandardMaterial({\n      color: MODULE_REAR_COLOR,\n      roughness: 0.88,\n      metalness: 0,\n      side: THREE.BackSide,\n    }),\n  );\n\n  // Plane normal +Z yönündedir. BackSide sayesinde yalnızca modülün arka\n  // tarafından görünür; önden cam/renk/görsel davranışını kapatmaz.\n  rear.position.set(0, height / 2, -depth / 2 - 0.0015);\n  rear.receiveShadow = true;\n  rear.userData = { kind: 'module-rear' };\n  group.add(rear);\n  return rear;\n}\n\nfunction createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady) {`,
    'flat rear helper',
  );
}

scene = replaceOnce(
  scene,
  '  return { group, surfaces };\n}\n\n\nfunction createDoorModule(moduleState, moduleIndex, onSurfaceReady) {',
  '  addFlatModuleRear(group, widthM, height, depth);\n  return { group, surfaces };\n}\n\n\nfunction createDoorModule(moduleState, moduleIndex, onSurfaceReady) {',
  'flat panel rear call',
);

scene = replaceOnce(
  scene,
  '  return { group, surfaces };\n}\n\nfunction createSeparatorModule(moduleState, moduleIndex) {',
  '  addFlatModuleRear(group, widthM, height, depth);\n  return { group, surfaces };\n}\n\nfunction createSeparatorModule(moduleState, moduleIndex) {',
  'door rear call',
);

scene = replaceOnce(
  scene,
  '  return { group, surfaces };\n}\n\nfunction createSelectionFrame(width, height) {',
  '  addFlatModuleRear(group, widthM, height, depth);\n  return { group, surfaces };\n}\n\nfunction createSelectionFrame(width, height) {',
  'showcase rear call',
);

fs.writeFileSync(scenePath, scene);

const rulesPath = 'PROJECT_RULES.md';
let rules = fs.readFileSync(rulesPath, 'utf8');
const ruleMarker = '## Modül arka yüz standardı';
if (!rules.includes(ruleMarker)) {
  rules = rules.trimEnd() + `\n\n${ruleMarker}\n\n- Aksi açıkça belirtilmedikçe düz panel, vitrin, kapı ve gelecekte eklenecek kapalı yüzeyli modüllerin arka yüzü **tek parça düz yüzey** olarak görünür.\n- Düz arka yüz yalnızca arkadan görünür; öndeki renk, görsel ve cam davranışını kapatmaz veya değiştirmez.\n- **Separatör bu kuralın istisnasıdır**; açık çıtalı yapısı ön/arka olarak korunur.\n- Amaç 0° / 90° / 180° / 270° dönüşlerde modülün ön ve arka yönünün görsel olarak hemen ayırt edilmesidir.\n`;
  fs.writeFileSync(rulesPath, rules);
}

const changelogPath = 'Changelog.md';
let changelog = fs.readFileSync(changelogPath, 'utf8');
const changeMarker = '## Modül arka yüz ayrımı';
if (!changelog.includes(changeMarker)) {
  changelog = changelog.trimEnd() + `\n\n${changeMarker}\n\n412. Düz panel, depo kapısı ve 2/3 gözlü vitrin modüllerine arkadan bakıldığında tek parça düz arka yüz gösterimi eklendi.\n413. Düz arka yüz yalnızca arka taraftan render edilir hale getirildi; öndeki panel renkleri, görselleri ve cam şeffaflığı etkilenmedi.\n414. Separatör modülleri açık çıtalı ön/arka görünümünü korumak için düz arka yüz standardının dışında bırakıldı.\n415. Modülün 4 yön dönüşünde ön/arka tarafın daha kolay ayırt edilmesi kalıcı görsel standart olarak PROJECT_RULES.md içine eklendi.\n`;
  fs.writeFileSync(changelogPath, changelog);
}
