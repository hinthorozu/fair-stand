import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('JSZip stays out of the initial application bundle', () => {
  const source = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /import\s+JSZip\s+from\s+['"]jszip['"]/);
  assert.match(source, /import\(['"]jszip['"]\)/);
  assert.match(source, /await loadJSZip\(\)/);
});

test('Three.js has a stable Vite vendor chunk', () => {
  const config = fs.readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
  assert.match(config, /name:\s*['"]three-vendor['"]/);
  assert.match(config, /codeSplitting/);
});
