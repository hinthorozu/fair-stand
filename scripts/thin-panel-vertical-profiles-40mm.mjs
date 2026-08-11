import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
const from = 'const PANEL_VERTICAL_PROFILE_WIDTH_M = 0.047;';
const to = 'const PANEL_VERTICAL_PROFILE_WIDTH_M = 0.040;';
if (!scene.includes(from)) throw new Error('Expected 47 mm vertical profile constant not found');
scene = scene.replace(from, to);
fs.writeFileSync(scenePath, scene);

const changelogPath = 'Changelog.md';
let changelog = fs.readFileSync(changelogPath, 'utf8');
const entry = '426. Düz panel, Depo Kapısı ve 2/3 gözlü vitrin modüllerindeki görsel dikey profil genişliği 47 mm’den 40 mm’ye indirildi; modül dış ölçüleri, panel yerleşimi, snap/collision/rotation ve separatör geometrisi değiştirilmedi.';
if (!changelog.includes(entry)) {
  changelog = changelog.trimEnd() + '\n' + entry + '\n';
  fs.writeFileSync(changelogPath, changelog);
}
