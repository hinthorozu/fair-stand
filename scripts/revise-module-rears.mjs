import fs from 'node:fs';

function replaceOnce(source, needle, replacement, label) {
  const index = source.indexOf(needle);
  if (index < 0) throw new Error('Patch target not found: ' + label);
  return source.slice(0, index) + replacement + source.slice(index + needle.length);
}

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

scene = replaceOnce(
  scene,
  'const PANEL_BACK_COLOR = 0xf4f4f4;\nconst MODULE_REAR_COLOR = 0xe1e5e9;\n',
  'const PANEL_BACK_COLOR = 0x4b5563;\n',
  'rear color constants',
);

const helperStart = scene.indexOf('\nfunction addFlatModuleRear(group, widthM, height, depth) {');
const flatStart = scene.indexOf('\nfunction createFlatPanelModule(', helperStart);
if (helperStart < 0 || flatStart < 0) throw new Error('Flat rear helper not found');
scene = scene.slice(0, helperStart) + scene.slice(flatStart);

scene = scene.replaceAll('  addFlatModuleRear(group, widthM, height, depth);\n', '');

scene = replaceOnce(
  scene,
  'new THREE.MeshStandardMaterial({ color: 0xe9ecef, roughness: 0.82 })',
  'new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.82 })',
  'showcase opening rear color',
);

fs.writeFileSync(scenePath, scene);

const rulesPath = 'PROJECT_RULES.md';
let rules = fs.readFileSync(rulesPath, 'utf8');
const oldRules = `## Modül arka yüz standardı\n\n- Aksi açıkça belirtilmedikçe düz panel, vitrin, kapı ve gelecekte eklenecek kapalı yüzeyli modüllerin arka yüzü **tek parça düz yüzey** olarak görünür.\n- Düz arka yüz yalnızca arkadan görünür; öndeki renk, görsel ve cam davranışını kapatmaz veya değiştirmez.\n- **Separatör bu kuralın istisnasıdır**; açık çıtalı yapısı ön/arka olarak korunur.\n- Amaç 0° / 90° / 180° / 270° dönüşlerde modülün ön ve arka yönünün görsel olarak hemen ayırt edilmesidir.`;
const newRules = `## Modül arka yüz standardı\n\n- Aksi açıkça belirtilmedikçe düz panel, vitrin, kapı ve gelecekte eklenecek kapalı yüzeyli modüllerin **opak arka yüzleri koyu gri** görünür.\n- Arka yüz tek parça kapakla örtülmez; panel/vitrin/kapı yapısı korunur.\n- Cam panele çevrilen yüzeylerin arkası da cam/şeffaf kalır; koyu gri arka yüz camı kapatmaz.\n- Ön taraftaki renk ve görsel arka yüz renginden etkilenmez.\n- **Separatör bu kuralın istisnasıdır**; açık çıtalı yapısı ön/arka olarak korunur.\n- Amaç 0° / 90° / 180° / 270° dönüşlerde modülün ön ve arka yönünün görsel olarak hemen ayırt edilmesidir.`;
rules = replaceOnce(rules, oldRules, newRules, 'project rear rules');
fs.writeFileSync(rulesPath, rules);

const changelogPath = 'Changelog.md';
let changelog = fs.readFileSync(changelogPath, 'utf8');
const oldChange = `## Modül arka yüz ayrımı\n\n412. Düz panel, depo kapısı ve 2/3 gözlü vitrin modüllerine arkadan bakıldığında tek parça düz arka yüz gösterimi eklendi.\n413. Düz arka yüz yalnızca arka taraftan render edilir hale getirildi; öndeki panel renkleri, görselleri ve cam şeffaflığı etkilenmedi.\n414. Separatör modülleri açık çıtalı ön/arka görünümünü korumak için düz arka yüz standardının dışında bırakıldı.\n415. Modülün 4 yön dönüşünde ön/arka tarafın daha kolay ayırt edilmesi kalıcı görsel standart olarak PROJECT_RULES.md içine eklendi.`;
const newChange = `## Modül arka yüz ayrımı\n\n412. Düz panel, depo kapısı ve 2/3 gözlü vitrin modüllerinin opak arka yüzleri koyu gri olacak şekilde ayrıştırıldı.\n413. Arka taraf tek parça kapakla örtülmek yerine mevcut panel/vitrin/kapı yapısı korunarak renklendirildi; ön taraftaki renk ve görseller etkilenmedi.\n414. Cam panel arka yüzleri cam/şeffaf davranışını korudu; koyu gri arka yüz standardı camı kapatmayacak şekilde uygulandı.\n415. Separatörler açık çıtalı ön/arka görünümünü korumak için bu standardın dışında bırakıldı; kural PROJECT_RULES.md içine işlendi.`;
changelog = replaceOnce(changelog, oldChange, newChange, 'changelog rear section');
fs.writeFileSync(changelogPath, changelog);
