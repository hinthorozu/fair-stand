import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');
const start = source.indexOf('function createCounterModule(');
const end = source.indexOf('\nfunction createShelfModule(', start);
if (start < 0 || end < 0) throw new Error('createCounterModule block not found');

let block = source.slice(start, end);

// Keep only four corner posts as the structural frame. Horizontal separators stay thin
// like wall-panel rails, but sit flush with the panel plane instead of protruding.
block = block.replace(
  "  const frontZ = depthM / 2 - profileM - 0.006;\n  const leftX = -widthM / 2 + profileM + 0.006;\n  const rightX = widthM / 2 - profileM - 0.006;",
  "  const frontZ = depthM / 2 - 0.006;\n  const leftX = -widthM / 2 + 0.006;\n  const rightX = widthM / 2 - 0.006;",
);

block = block.replace(
  "      new THREE.Vector3(0, y, depthM / 2 - profileM / 2),",
  "      new THREE.Vector3(0, y, depthM / 2 - frameDepthM / 2),",
);

block = block.replace(
  "        new THREE.Vector3(xSide * (widthM / 2 - profileM / 2), y, 0),",
  "        new THREE.Vector3(xSide * (widthM / 2 - frameDepthM / 2), y, 0),",
);

// Put panel backings just behind the visible face so the visible planes are flush with
// the outside face of the four corner posts, with no ledge/projection.
block = block.replace(
  "    backing.position.copy(position);\n    backing.rotation.y = rotationY;",
  "    backing.position.copy(position);\n    backing.rotation.y = rotationY;\n    if (surfaceRole === 'front') backing.position.z -= 0.006;\n    else if (surfaceRole === 'left') backing.position.x += 0.006;\n    else backing.position.x -= 0.006;",
);

// Visible panel planes are already placed at the outer frame line; remove the previous
// extra 6.5 mm push that caused the panels/rails to project beyond the corner posts.
block = block.replace(
  "    if (surfaceRole === 'front') surface.position.z += 0.0065;\n    else if (surfaceRole === 'left') surface.position.x -= 0.0065;\n    else surface.position.x += 0.0065;",
  "    if (surfaceRole === 'front') surface.position.z += 0.006;\n    else if (surfaceRole === 'left') surface.position.x -= 0.006;\n    else surface.position.x += 0.006;",
);

source = source.slice(0, start) + block + source.slice(end);
fs.writeFileSync(path, source);
