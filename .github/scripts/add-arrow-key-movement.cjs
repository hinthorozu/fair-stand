const fs = require('fs');

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const previous = '      const stepCm = getModulePlacementSnapCm(moduleState.type);';
const next = `      const stepCm = isTopFixtureType(moduleState.type)\n        ? 20\n        : getModulePlacementSnapCm(moduleState.type);`;

if (source.includes(previous)) {
  source = source.replace(previous, next);
} else if (!source.includes(next)) {
  throw new Error('arrow step anchor not found');
}

fs.writeFileSync(path, source);
