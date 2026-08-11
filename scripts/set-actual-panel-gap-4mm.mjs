import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

const oldConstants = "const PANEL_BACK_COLOR = 0x4b5563;\nconst PANEL_VERTICAL_CLEARANCE_M = 0.004;\n";
const newConstants = "const PANEL_BACK_COLOR = 0x4b5563;\nconst PANEL_RAIL_HEIGHT_M = 0.004;\nconst PANEL_VERTICAL_CLEARANCE_M = 0;\n";
if (!scene.includes(oldConstants)) throw new Error('Expected panel constants not found');
scene = scene.replace(oldConstants, newConstants);

const railDecl = 'const railHeight = 0.026;';
const railCount = scene.split(railDecl).length - 1;
if (railCount !== 3) throw new Error(`Expected 3 panel rail declarations, found ${railCount}`);
scene = scene.split(railDecl).join('const railHeight = PANEL_RAIL_HEIGHT_M;');

fs.writeFileSync(scenePath, scene);

const changelogPath = 'Changelog.md';
let changelog = fs.readFileSync(changelogPath, 'utf8');
const heading = '## Panel arası gerçek 4 mm düzeltmesi';
if (!changelog.includes(heading)) {
  changelog = changelog.trimEnd() + `\n\n${heading}\n\n420. Kullanıcının kastettiği ölçünün panel iç payı değil, 7 panel arasındaki 6 adet görünen yatay aralığın toplam kalınlığı olduğu netleştirildi.\n421. Düz panel, Depo Kapısı üst panelleri ve 2/3 gözlü vitrin panel bölgelerinde yatay ray yüksekliği 26 mm'den 4 mm'ye indirildi ve ekstra düşey clearance sıfırlandı; böylece komşu iki panel yüzeyi arasındaki toplam görünen bant 4 mm oldu.\n422. 50 cm strip merkezleri ve 350 cm toplam modül yüksekliği korunurken panel yüzeyleri büyütüldü; separatör geometrisine dokunulmadı.\n`;
  fs.writeFileSync(changelogPath, changelog);
}
