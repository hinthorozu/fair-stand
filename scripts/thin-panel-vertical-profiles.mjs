import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

const constantMarker = 'const PANEL_VERTICAL_CLEARANCE_M = 0;\n';
const constantLine = 'const PANEL_VERTICAL_PROFILE_WIDTH_M = 0.047;\n';
if (!scene.includes(constantLine)) {
  if (!scene.includes(constantMarker)) throw new Error('Panel constant marker not found');
  scene = scene.replace(constantMarker, constantMarker + constantLine);
}

function replaceInFunction(source, functionName, nextFunctionName, replacements) {
  const startMarker = `function ${functionName}(`;
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`${functionName} start not found`);
  const end = nextFunctionName
    ? source.indexOf(`function ${nextFunctionName}(`, start + startMarker.length)
    : source.length;
  if (end < 0) throw new Error(`${functionName} end not found`);

  let block = source.slice(start, end);
  for (const [from, to, expected] of replacements) {
    const count = block.split(from).length - 1;
    if (count !== expected) {
      throw new Error(`${functionName}: expected ${expected} occurrences of ${from}, found ${count}`);
    }
    block = block.split(from).join(to);
  }
  return source.slice(0, start) + block + source.slice(end);
}

const replacements = [
  ['new THREE.BoxGeometry(frameWidth, height, frameDepth)', 'new THREE.BoxGeometry(PANEL_VERTICAL_PROFILE_WIDTH_M, height, frameDepth)', 1],
  ['widthM / 2 - frameWidth / 2', 'widthM / 2 - PANEL_VERTICAL_PROFILE_WIDTH_M / 2', 1],
  ['Math.max(widthM - frameWidth * 2, 0.02)', 'Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2, 0.02)', 1],
  ['Math.max(widthM - frameWidth * 2 - 0.012, 0.02)', 'Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2 - 0.012, 0.02)', 1],
];

scene = replaceInFunction(scene, 'createFlatPanelModule', 'createDoorModule', replacements);
scene = replaceInFunction(scene, 'createDoorModule', 'createSeparatorModule', replacements);
scene = replaceInFunction(scene, 'createShowcaseModule', null, replacements);

fs.writeFileSync(scenePath, scene);

const changelogPath = 'Changelog.md';
let changelog = fs.readFileSync(changelogPath, 'utf8');
const heading = '## Dikey profil görsel inceltme';
if (!changelog.includes(heading)) {
  changelog = changelog.trimEnd() + `\n\n${heading}\n\n423. Düz panel, Depo Kapısı ve 2/3 gözlü vitrin modüllerindeki dikey profiller yalnızca görsel geometride 55 mm'den 47 mm'ye inceltildi (yaklaşık %15); modül dış ölçüleri ve placement ölçüleri değişmedi.\n424. Dikey profillerin dış kenarı modül sınırında sabit tutuldu; incelme içe doğru panel alanını büyüttüğü için komşu modüller arasındaki koyu profil bandı daha hafif görünür hale geldi.\n425. 50/100/150/200 modül genişlikleri, 350 cm yükseklik, 50 cm strip ritmi, snap/collision/rotation ve separatör geometrisi korunmuştur.\n`;
  fs.writeFileSync(changelogPath, changelog);
}
