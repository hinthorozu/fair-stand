import fs from 'node:fs';

const path = 'src/scene3d.js';
let src = fs.readFileSync(path, 'utf8');
const needle = `    if (isTopFixtureType(moduleState.type)) {\n      const placement = snapTopFixturePlacement(\n        snapped.placement,\n        ground,\n        moduleState.widthCm,\n      );`;
const replacement = `    if (isTopFixtureType(moduleState.type)) {\n      const isFreeTopFixture = snapped.placement.wallId === 'free';\n      const placement = snapTopFixturePlacement(\n        snapped.placement,\n        ground,\n        moduleState.widthCm,\n      );`;
if (!src.includes(needle)) throw new Error('Target block not found');
src = src.replace(needle, replacement);
fs.writeFileSync(path, src);
