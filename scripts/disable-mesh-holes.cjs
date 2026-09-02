const fs = require('node:fs');

function replaceExactly(source, oldText, newText, label) {
  const count = source.split(oldText).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 match, got ${count}`);
  return source.replace(oldText, newText);
}

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
scene = replaceExactly(
  scene,
  `      if (fabricType === 'mesh') {\n        overlayMaterial.alphaMap = createMeshBrandaAlphaMap(width, height);\n        overlayMaterial.alphaTest = 0.45;\n        overlayMaterial.alphaToCoverage = true;\n        overlayMaterial.transparent = false;\n        overlayMaterial.depthWrite = true;\n      }`,
  `      if (fabricType === 'mesh') {\n        overlayMaterial.transparent = false;\n        overlayMaterial.depthWrite = true;\n      }`,
  'Mesh alpha block',
);
fs.writeFileSync(scenePath, scene);

const coverPath = 'test/coverModeExclusivity.test.js';
let cover = fs.readFileSync(coverPath, 'utf8');
cover = replaceExactly(
  cover,
  `test('Mesh stays one continuous plane and uses much finer perforations', () => {\n  assert.match(scene, /new THREE\\.PlaneGeometry\\(width, height\\)/);\n  assert.match(scene, /Number\\(widthM\\) \\* 300/);\n  assert.match(scene, /Number\\(heightM\\) \\* 300/);\n  assert.match(scene, /texture\\.minFilter = THREE\\.LinearMipmapLinearFilter/);\n  assert.match(scene, /texture\\.anisotropy = renderer\\.capabilities\\.getMaxAnisotropy\\(\\)/);\n  assert.match(scene, /overlayMaterial\\.alphaToCoverage = true/);\n});`,
  `test('Mesh stays one continuous plane without a perforation mask', () => {\n  assert.match(scene, /new THREE\\.PlaneGeometry\\(width, height\\)/);\n  assert.doesNotMatch(scene, /overlayMaterial\\.alphaMap/);\n  assert.doesNotMatch(scene, /overlayMaterial\\.alphaTest/);\n  assert.doesNotMatch(scene, /overlayMaterial\\.alphaToCoverage/);\n  assert.match(scene, /if \\(fabricType === 'mesh'\\) \\{\\s*overlayMaterial\\.transparent = false;\\s*overlayMaterial\\.depthWrite = true;/);\n});`,
  'Mesh regression test',
);
fs.writeFileSync(coverPath, cover);

const lightboxPath = 'test/lightboxFabric.test.js';
let lightbox = fs.readFileSync(lightboxPath, 'utf8');
lightbox = replaceExactly(
  lightbox,
  `test('mesh branda is a separate perforated cover without lightbox lighting', () => {`,
  `test('mesh branda is a separate one-piece cover without lightbox lighting', () => {`,
  'Mesh test title',
);
for (const line of [
  `  assert.match(scene, /function createMeshBrandaAlphaMap/);\n`,
  `  assert.match(scene, /overlayMaterial\\.alphaMap = createMeshBrandaAlphaMap/);\n`,
  `  assert.match(scene, /overlayMaterial\\.alphaTest = 0\\.45/);\n`,
]) {
  lightbox = replaceExactly(lightbox, line, '', `stale Mesh alpha assertion: ${line.trim()}`);
}
fs.writeFileSync(lightboxPath, lightbox);
