const fs = require('fs');
const p = 'src/scene3d.js';
let s = fs.readFileSync(p, 'utf8');
s = s.replace('              opacity: 0.32,', '              opacity: 0.58,');
s = s.replace('      halo.scale.set(scale * 1.018, -scale * 1.018, 1);', '      halo.scale.set(scale * 1.025, -scale * 1.025, 1);');
s = s.replace('        -center.x * scale * 1.018,\n        center.y * scale * 1.018,', '        -center.x * scale * 1.025,\n        center.y * scale * 1.025,');
fs.writeFileSync(p, s);
