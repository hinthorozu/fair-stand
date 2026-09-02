const fs = require('fs');
const path = 'src/scene3d.js';
let s = fs.readFileSync(path, 'utf8');
const needle = `  const group = new THREE.Group();\n  const hitbox = new THREE.Mesh(\n`;
if (!s.includes('function createIlluminatedFoamModule(')) throw new Error('foam renderer not found');
const start = s.indexOf('function createIlluminatedFoamModule(');
const end = s.indexOf('function createTvModule(', start);
let block = s.slice(start, end);
if (!block.includes(needle)) throw new Error('foam group insertion point not found');
if (!block.includes("group.userData.moduleType = 'illuminated-foam';")) {
  const replacement = `  const group = new THREE.Group();\n  group.userData.kind = 'module';\n  group.userData.moduleId = moduleState.id;\n  group.userData.moduleIndex = moduleIndex;\n  group.userData.moduleType = 'illuminated-foam';\n  group.userData.type = 'illuminated-foam';\n  group.userData.widthCm = Number(moduleState.widthCm) || 200;\n  group.userData.depthCm = Number(moduleState.depthCm) || 3.5;\n  group.userData.heightCm = Number(moduleState.heightCm) || 50;\n  const hitbox = new THREE.Mesh(\n`;
  block = block.replace(needle, replacement);
}
s = s.slice(0, start) + block + s.slice(end);
fs.writeFileSync(path, s);

const testPath = 'test/illuminatedFoamInteraction.test.js';
fs.writeFileSync(testPath, `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { readFileSync } from 'node:fs';\n\ntest('illuminated foam exposes module metadata for selection and drag', () => {\n  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  const start = source.indexOf('function createIlluminatedFoamModule(');\n  const end = source.indexOf('function createTvModule(', start);\n  const block = source.slice(start, end);\n  assert.match(block, /group\\.userData\\.kind = 'module'/);\n  assert.match(block, /group\\.userData\\.moduleId = moduleState\\.id/);\n  assert.match(block, /group\\.userData\\.moduleType = 'illuminated-foam'/);\n  assert.match(block, /group\\.userData\\.type = 'illuminated-foam'/);\n  assert.match(block, /group\\.userData\\.widthCm/);\n  assert.match(block, /group\\.userData\\.depthCm/);\n  assert.match(block, /group\\.userData\\.heightCm/);\n});\n`);
