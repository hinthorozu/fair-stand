const fs = require('fs');
const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');
const before = `  const chairPlacements = [\n    [-0.43, -0.43, Math.PI / 4],\n    [0.43, -0.43, -Math.PI / 4],\n    [-0.43, 0.43, Math.PI * 3 / 4],\n    [0.43, 0.43, -Math.PI * 3 / 4],\n  ];`;
const after = `  const chairPlacements = [\n    [-0.38, -0.38, Math.PI / 4],\n    [0.38, -0.38, -Math.PI / 4],\n    [-0.38, 0.38, Math.PI * 3 / 4],\n    [0.38, 0.38, -Math.PI * 3 / 4],\n  ];`;
if (!source.includes(before)) throw new Error('Eames chair placement block not found');
source = source.replace(before, after);
fs.writeFileSync(path, source);
