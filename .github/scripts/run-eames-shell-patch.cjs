const fs = require('fs');

const sourcePath = '.github/scripts/add-eames-chair.js';
let source = fs.readFileSync(sourcePath, 'utf8');

source = source.replace("const zlib = require('zlib');\n", '');

const payloadStart = "const compressedPayload = fs.readFileSync('.github/eames-table-chair.mesh.bin.gz');\n";
const payloadEnd = "fs.writeFileSync('public/models/eames-table-chair.mesh.bin', chairPayload);\n";
const payloadStartIndex = source.indexOf(payloadStart);
const payloadEndIndex = source.indexOf(payloadEnd, payloadStartIndex);
if (payloadStartIndex < 0 || payloadEndIndex < 0) throw new Error('Eames payload block not found');
source = source.slice(0, payloadStartIndex)
  + "const chairPayload = fs.readFileSync('public/models/eames-table-chair.mesh.bin');\n"
  + "if (chairPayload.length !== 14999) throw new Error(`Unexpected Eames shell payload size: ${chairPayload.length}`);\n"
  + source.slice(payloadEndIndex + payloadEnd.length);

const metaStart = 'const EAMES_CHAIR_MESH_META = Object.freeze([';
const metaEnd = '].map((entry) => Object.freeze(entry)));';
const metaStartIndex = source.indexOf(metaStart);
const metaEndIndex = source.indexOf(metaEnd, metaStartIndex);
if (metaStartIndex < 0 || metaEndIndex < 0) throw new Error('Eames metadata block not found');
source = source.slice(0, metaStartIndex)
  + 'const EAMES_CHAIR_MESH_META = Object.freeze([{"name":"Object_4","role":"shell","vertexCount":547,"faceCount":1094,"indexCount":3282,"positionOffset":0,"indexOffset":3282}].map((entry) => Object.freeze(entry)));'
  + source.slice(metaEndIndex + metaEnd.length);

const chairAnchor = `      chair.scale.setScalar(EAMES_CHAIR_MODEL_SCALE);\n\n      geometries.forEach(({ meta, geometry }) => {`;
const chairReplacement = `      chair.scale.setScalar(EAMES_CHAIR_MODEL_SCALE);\n\n      const addRod = (start, end, radius, material, radialSegments = 10) => {\n        const direction = new THREE.Vector3().subVectors(end, start);\n        const length = direction.length();\n        const rod = new THREE.Mesh(\n          new THREE.CylinderGeometry(radius, radius, length, radialSegments),\n          material,\n        );\n        rod.position.copy(start).add(end).multiplyScalar(0.5);\n        rod.quaternion.setFromUnitVectors(\n          new THREE.Vector3(0, 1, 0),\n          direction.clone().normalize(),\n        );\n        rod.castShadow = true;\n        rod.receiveShadow = true;\n        chair.add(rod);\n      };\n\n      const legTopY = 0.49;\n      const legBottomY = 0.025;\n      const legTops = [\n        [-0.17, legTopY, -0.15],\n        [0.17, legTopY, -0.15],\n        [-0.17, legTopY, 0.14],\n        [0.17, legTopY, 0.14],\n      ];\n      const legBottoms = [\n        [-0.27, legBottomY, -0.22],\n        [0.27, legBottomY, -0.22],\n        [-0.27, legBottomY, 0.22],\n        [0.27, legBottomY, 0.22],\n      ];\n      legTops.forEach((coords, legIndex) => {\n        addRod(\n          new THREE.Vector3(...coords),\n          new THREE.Vector3(...legBottoms[legIndex]),\n          0.024,\n          woodMaterial,\n          12,\n        );\n      });\n\n      const braceY = 0.285;\n      addRod(new THREE.Vector3(-0.19, braceY, -0.16), new THREE.Vector3(0.19, braceY, 0.16), 0.007, supportMaterial, 8);\n      addRod(new THREE.Vector3(0.19, braceY, -0.16), new THREE.Vector3(-0.19, braceY, 0.16), 0.007, supportMaterial, 8);\n      addRod(new THREE.Vector3(-0.20, 0.34, 0), new THREE.Vector3(0.20, 0.34, 0), 0.006, supportMaterial, 8);\n\n      geometries.forEach(({ meta, geometry }) => {`;
if (!source.includes(chairAnchor)) throw new Error('Eames chair render anchor not found');
source = source.replace(chairAnchor, chairReplacement);

source = source.replace('assert.equal(payload.size, 30726);', 'assert.equal(payload.size, 14999);');

new Function('require', source)(require);

const testPath = 'test/eamesTableChairSetContract.test.js';
let testSource = fs.readFileSync(testPath, 'utf8');
testSource = testSource.replace(
  'assert.match(source, /models/eames-table-chair.mesh.bin/);',
  'assert.match(source, /models\\/eames-table-chair\\.mesh\\.bin/);',
);
fs.writeFileSync(testPath, testSource);
