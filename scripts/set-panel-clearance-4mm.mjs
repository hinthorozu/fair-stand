import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
const from = 'const PANEL_VERTICAL_CLEARANCE_M = 0.006;';
const to = 'const PANEL_VERTICAL_CLEARANCE_M = 0.004;';
if (!scene.includes(from)) throw new Error('Expected 6 mm panel clearance constant not found');
scene = scene.replace(from, to);
fs.writeFileSync(scenePath, scene);

const changelogPath = 'Changelog.md';
let changelog = fs.readFileSync(changelogPath, 'utf8');
const entry = '419. Tüm panel yüzeylerinde ortak ekstra düşey açıklık 6 mm’den 4 mm’ye indirildi; Düz Panel 50 / 100 / 150 / 200, Depo Kapısı üst panelleri ve 2/3 gözlü vitrin panel bölgeleri aynı 4 mm clearance değerini kullanır. Separatör geometrisi değişmedi.';
if (!changelog.includes(entry)) {
  changelog = changelog.trimEnd() + '\n' + entry + '\n';
  fs.writeFileSync(changelogPath, changelog);
}
