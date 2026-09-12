import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');

test('GLB yükleme önbelleği reddedilince silinir ve kullanıcıya #stage-result yazar', () => {
  assert.match(source, /const gltfSceneCache = new Map\(\)/);
  assert.match(source, /function loadGltfScene\(url\)/);
  assert.match(source, /gltfSceneCache\.delete\(url\)/);
  assert.match(source, /querySelector\('#stage-result'\)/);
  assert.match(source, /3D model yüklenemedi/);
  assert.doesNotMatch(source, /let eamesChairModelPromise/);
});
