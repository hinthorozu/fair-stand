const fs = require('fs');

function read(path) { return fs.readFileSync(path, 'utf8'); }
function write(path, text) { fs.writeFileSync(path, text); }
function removeFunction(source, name) {
  const marker = `function ${name}(`;
  let start = source.indexOf(marker);
  if (start < 0) return source;
  if (source.slice(Math.max(0, start - 7), start) === 'export ') start -= 7;
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        let end = i + 1;
        while (source[end] === '\n') end += 1;
        return source.slice(0, start) + source.slice(end);
      }
    }
  }
  throw new Error(`Unclosed function: ${name}`);
}

let catalog = read('src/catalog.js');
catalog = catalog.replace(/export const furniture_table_chair_set_minyon_DIMENSIONS = Object\.freeze\(\{[\s\S]*?\}\);\n\n/, '');
catalog = catalog.replace(/^\s*furniture_table_chair_set_minyon: \{[^\n]+\},\n/m, '');
catalog = catalog.replace(/^\s*'furniture_table_chair_set_minyon',\n/m, '');
write('src/catalog.js', catalog);

let state = read('src/designState.js');
state = removeFunction(state, 'createTableChairSetModuleState');
write('src/designState.js', state);

let scene = read('src/scene3d.js');
scene = removeFunction(scene, 'createTableChairSetModule');
scene = scene.replace("    || type === 'table-chair-set'\n", '');
scene = scene.replace("    if (moduleState?.type === 'table-chair-set') return 'Masa Sandalye Takımı';\n", '');
scene = scene.replace(/\s*\} else if \(moduleState\.type === 'table-chair-set'\) \{\n\s*module = createTableChairSetModule\(moduleState, moduleIndex\);\n\s*\} else if \(moduleState\.type === 'table-chair-set-eames'\) \{/m, "      } else if (moduleState.type === 'table-chair-set-eames') {");
write('src/scene3d.js', scene);

let main = read('src/main.js');
main = main.replace(/^\s*createTableChairSetModuleState,\n/m, '');
main = main.replace(/^\s*else if \(module\.type === 'table-chair-set'\) state = createTableChairSetModuleState\(\);\n/m, '');
write('src/main.js', main);

let sidebar = read('src/moduleDragSidebar.js');
sidebar = sidebar.replace("module.type === 'table-chair-set' || module.type === 'table-chair-set-eames'", "module.type === 'table-chair-set-eames'");
write('src/moduleDragSidebar.js', sidebar);

if (fs.existsSync('test/tableChairSet.test.js')) fs.unlinkSync('test/tableChairSet.test.js');

const test = `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs';\nimport { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';\nimport { createEamesTableChairSetModuleState } from '../src/designState.js';\n\ntest('Eames is the only table-chair set in the catalog', () => {\n  const eames = MODULE_CATALOG.furniture_table_chair_set_eames;\n  assert.equal(MODULE_CATALOG.furniture_table_chair_set_minyon, undefined);\n  assert.equal(MODULE_CATALOG_KEYS.includes('furniture_table_chair_set_minyon'), false);\n  assert.equal(eames.type, 'table-chair-set-eames');\n  assert.equal(eames.widthCm, 150);\n  assert.equal(eames.depthCm, 150);\n});\n\ntest('Eames set contains four chairs', () => {\n  const eames = createEamesTableChairSetModuleState();\n  assert.equal(eames.type, 'table-chair-set-eames');\n  assert.equal(eames.chairCount, 4);\n  assert.equal(eames.widthCm, 150);\n  assert.equal(eames.depthCm, 150);\n});\n\ntest('Eames renderer loads the original GLB once and clones four chairs', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(source, /GLTFLoader/);\n  assert.match(source, /models\\/eames_chair\\.glb/);\n  assert.match(source, /template\\.clone\\(true\\)/);\n  assert.match(source, /chairPlacements\\.forEach/);\n});\n\ntest('original Eames GLB asset is present', () => {\n  const payload = fs.statSync(new URL('../public/models/eames_chair.glb', import.meta.url));\n  assert.ok(payload.size > 400000);\n});\n`;
write('test/eamesTableChairSetContract.test.js', test);

const forbidden = [
  'furniture_table_chair_set_minyon',
  'createTableChairSetModuleState',
  "'table-chair-set'",
  'createTableChairSetModule(',
];
for (const path of ['src/catalog.js','src/designState.js','src/main.js','src/scene3d.js','src/moduleDragSidebar.js']) {
  const text = read(path);
  for (const token of forbidden) {
    if (text.includes(token)) throw new Error(`${token} still present in ${path}`);
  }
}
