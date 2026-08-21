import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const from = '  controls.enableDamping = false;';
const to = '  controls.enableDamping = true;';

if (!source.includes(to)) {
  if (!source.includes(from)) throw new Error('OrbitControls damping anchor not found');
  source = source.replace(from, to);
  fs.writeFileSync(path, source);
}
