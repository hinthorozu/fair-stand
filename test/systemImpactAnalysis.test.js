import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  analyzeChangeImpact,
  buildReverseReferenceGraph,
  collectReverseDependents,
  discoverCandidateFindings,
  extractImpactTokensFromPatch,
  extractLocalReferenceSpecifiers,
} from '../scripts/change-impact-analysis.mjs';

test('reference extraction sees imports, source reads, HTML resources and CSS asset URLs', () => {
  const source = `
    import { alpha } from '../src/a.js';
    export { beta } from '../src/b.js';
    const lazy = import('../src/c.js');
    const sourceText = new URL('../src/main.js', import.meta.url);
    const legacy = '../src/legacy.js';
    <link href="/src/style.css" rel="stylesheet">
    <script src="/src/main.js"></script>
    .stage { background-image: url('/textures/background.jpg'); }
  `;

  assert.deepEqual(extractLocalReferenceSpecifiers(source).sort(), [
    '../src/a.js',
    '../src/b.js',
    '../src/c.js',
    '../src/legacy.js',
    '../src/main.js',
    '/src/main.js',
    '/src/style.css',
    '/textures/background.jpg',
  ].sort());
});

test('reverse dependency discovery walks transitive callers and source-text tests', () => {
  const files = {
    'src/core.js': 'export function createThing() {}\n',
    'src/wrapper.js': "import { createThing } from './core.js';\nexport const wrapped = createThing;\n",
    'src/main.js': "import { wrapped } from './wrapper.js';\nconsole.log(wrapped);\n",
    'test/coreShape.test.js': "const source = new URL('../src/core.js', import.meta.url);\n",
  };

  const reverse = buildReverseReferenceGraph(files);
  assert.deepEqual(collectReverseDependents(['src/core.js'], reverse), [
    'src/main.js',
    'src/wrapper.js',
    'test/coreShape.test.js',
  ]);
});

test('changed public background asset discovers the code and CSS that reference it', () => {
  const files = {
    'src/scene3d.js': "const floor = '/textures/exhibition-floor.jpg';\n",
    'src/style.css': ".stage { background: url('/textures/exhibition-floor.jpg'); }\n",
    'test/render.test.js': "const scene = new URL('../src/scene3d.js', import.meta.url);\n",
  };

  const result = analyzeChangeImpact({
    changedFiles: ['public/textures/exhibition-floor.jpg'],
    tokenFiles: [],
    referenceFiles: ['public/textures/exhibition-floor.jpg'],
    fileContents: files,
  });

  assert.ok(result.affectedFiles.includes('src/scene3d.js'));
  assert.ok(result.affectedFiles.includes('src/style.css'));
  assert.ok(result.affectedTests.includes('test/render.test.js'));
});

test('diff token discovery sees removed implementation symbols and UI identifiers', () => {
  const patch = `
--- a/src/main.js
+++ b/src/main.js
@@ -1,2 +1,2 @@
-const createCatalogModuleState = (module) => createCoatRackModuleState(module);
+const createCatalogModuleState = (module) => createModuleStateFromDescriptor(module);
-<button id="reset-all-features">Reset</button>
+<button id="reset-module-features">Reset</button>
`;

  const tokens = extractImpactTokensFromPatch(patch);
  for (const token of [
    'createCatalogModuleState',
    'createCoatRackModuleState',
    'createModuleStateFromDescriptor',
    'reset-all-features',
    'reset-module-features',
  ]) {
    assert.ok(tokens.includes(token), `${token} must be discovered from the diff`);
  }
});

test('finding discovery maps matching changed tokens to the nearest finding heading', () => {
  const files = {
    'audit/evidence/A10.md': `
### F-027 — unrelated
This section mentions anotherThing.

### F-028 — reset failure
The reset path calls createCatalogModuleState and fails for illuminated foam.
`,
  };

  assert.deepEqual(
    discoverCandidateFindings(files, ['createCatalogModuleState']),
    ['F-028'],
  );
});

test('full analysis reports code dependents, existing tests, docs and finding candidates together', () => {
  const files = {
    'src/designState.js': 'export function createModuleStateFromDescriptor() {}\n',
    'src/main.js': "import { createModuleStateFromDescriptor } from './designState.js';\n",
    'test/module.test.js': "const main = new URL('../src/main.js', import.meta.url);\nassert.match('createModuleStateFromDescriptor', /Descriptor/);\n",
    'SYSTEM_IMPACT_SWEEP.md': 'createModuleStateFromDescriptor is canonical.\n',
    'audit/evidence/A10.md': '### F-028 — reset\ncreateModuleStateFromDescriptor affects reset.\n',
  };

  const patch = `
--- a/src/designState.js
+++ b/src/designState.js
@@ -1 +1 @@
-export function createOldModuleState() {}
+export function createModuleStateFromDescriptor() {}
`;

  const result = analyzeChangeImpact({
    changedFiles: ['src/designState.js'],
    fileContents: files,
    patchText: patch,
  });

  assert.ok(result.affectedFiles.includes('src/main.js'));
  assert.ok(result.affectedTests.includes('test/module.test.js'));
  assert.ok(result.affectedDocs.includes('SYSTEM_IMPACT_SWEEP.md'));
  assert.ok(result.candidateFindings.includes('F-028'));
});

test('F-010-style ownership refactor discovers the real stale source-shape tests and linked F-028 finding', () => {
  const paths = [
    'src/main.js',
    'src/designState.js',
    'test/coatRackModule.test.js',
    'test/indoorPlants.test.js',
    'audit/evidence/A10_UI_CONTROLS.md',
  ];
  const files = Object.fromEntries(paths.map((filePath) => [
    filePath,
    readFileSync(new URL(`../${filePath}`, import.meta.url), 'utf8'),
  ]));

  const patch = `
--- a/src/main.js
+++ b/src/main.js
@@ -1,2 +1,2 @@
-const createCatalogModuleState = (module) => createCoatRackModuleState(module);
+const createCatalogModuleState = (module) => createModuleStateFromDescriptor(module);
-createIndoorPlantModuleState(module);
+createModuleStateFromDescriptor(module);
`;

  const result = analyzeChangeImpact({
    changedFiles: ['src/main.js', 'src/designState.js'],
    tokenFiles: ['src/main.js', 'src/designState.js'],
    fileContents: files,
    patchText: patch,
  });

  assert.ok(result.affectedTests.includes('test/coatRackModule.test.js'));
  assert.ok(result.affectedTests.includes('test/indoorPlants.test.js'));
  assert.ok(result.candidateFindings.includes('F-028'));
});
