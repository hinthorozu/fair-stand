import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

if (!scene.includes('const PANEL_VERTICAL_CLEARANCE_M = 0.006;')) {
  const marker = 'const PANEL_BACK_COLOR = 0x4b5563;\n';
  if (!scene.includes(marker)) throw new Error('Scene constant marker not found');
  scene = scene.replace(marker, marker + 'const PANEL_VERTICAL_CLEARANCE_M = 0.006;\n');
}

const oldExpr = 'stripHeight - railHeight - 0.012';
const matches = scene.split(oldExpr).length - 1;
if (matches !== 3) {
  throw new Error(`Expected 3 panel height clearances, found ${matches}`);
}
scene = scene.split(oldExpr).join('stripHeight - railHeight - PANEL_VERTICAL_CLEARANCE_M');
fs.writeFileSync(scenePath, scene);

const changelogPath = 'Changelog.md';
let changelog = fs.readFileSync(changelogPath, 'utf8');
const heading = '## Panel yüzeyi boşluk polish';
if (!changelog.includes(heading)) {
  changelog = changelog.trimEnd() + `\n\n${heading}\n\n416. Düz panel yüzeylerinde yatay ray ile panel yüzeyi arasındaki ekstra düşey açıklık 12 mm'den 6 mm'ye düşürüldü; panel alanı bir tık büyütüldü.\n417. Aynı 6 mm panel açıklığı Düz Panel 50 / 100 / 150 / 200, Depo Kapısı üst panelleri ve 2/3 gözlü vitrinlerin panel kullanılan bölümlerinde ortaklaştırıldı; separatör geometrisine dokunulmadı.\n418. Değişiklik yalnızca görsel panel boşluğunu sıkılaştırır; 50 cm strip ritmi, ray kalınlığı, renk/görsel/cam state davranışı ve yerleşim motoru korunur.\n`;
  fs.writeFileSync(changelogPath, changelog);
}
