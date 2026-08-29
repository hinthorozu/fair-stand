const fs = require('fs');

const path = 'src/modulePlacement.js';
let source = fs.readFileSync(path, 'utf8');
const before = "export function getModulePlacementSnapCm(moduleType) {\n  return moduleType === 'sofa-set' || moduleType === 'table-chair-set-eames' ? 10 : MODULE_PLACEMENT_SNAP_CM;\n}";
const after = "export function getModulePlacementSnapCm(moduleType) {\n  return moduleType === 'sofa-set' || moduleType === 'table-chair-set-eames' || moduleType === 'bar-stool'\n    ? 10\n    : MODULE_PLACEMENT_SNAP_CM;\n}";
if (!source.includes(before)) {
  if (source.includes("moduleType === 'bar-stool'")) process.exit(0);
  throw new Error('grid function anchor not found');
}
source = source.replace(before, after);
fs.writeFileSync(path, source);
