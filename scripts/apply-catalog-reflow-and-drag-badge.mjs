import fs from 'node:fs';

const file = 'src/scene3d.js';
let source = fs.readFileSync(file, 'utf8');

const oldBlock = `      new THREE.MeshBasicMaterial({
        color: PLACEMENT_VALID_COLOR,
        transparent: true,
        opacity: PLACEMENT_GHOST_OPACITY,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.y = STAND_DIMENSIONS.height / 2;`;

const newBlock = `      new THREE.MeshBasicMaterial({
        color: PLACEMENT_VALID_COLOR,
        transparent: true,
        opacity: PLACEMENT_GHOST_OPACITY,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      }),
    );
    mesh.renderOrder = 10000;
    mesh.position.y = STAND_DIMENSIONS.height / 2;`;

if (!source.includes(oldBlock)) throw new Error('Placement ghost material target not found');
source = source.replace(oldBlock, newBlock);
fs.writeFileSync(file, source);
console.log('Placement ghost now renders above existing modules.');
