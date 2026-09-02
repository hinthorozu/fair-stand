const fs = require('fs');
const path = 'src/scene3d.js';
let s = fs.readFileSync(path, 'utf8');
const old = `      raw.position.set(-center.x, -center.y, 0);\n      raw.scale.set(scale, -scale, 1);\n`;
const next = `      raw.scale.set(scale, -scale, 1);\n      raw.position.set(-center.x * scale, center.y * scale, 0);\n`;
if (!s.includes(old)) throw new Error('illuminated foam centering block not found');
s = s.replace(old, next);
fs.writeFileSync(path, s);
