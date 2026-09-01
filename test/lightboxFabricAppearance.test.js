import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('lightbox fabric owns one persistent color and image state', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /fabricColor/);
  assert.match(scene, /fabricImageAssetId/);
  assert.match(scene, /fabricImageFit/);
  assert.match(scene, /loadFabricOverlayImage/);
  assert.match(scene, /mode: 'fabric-group'/);
  assert.match(scene, /state\.fabricColor = hexColor/);
  assert.match(scene, /state\.fabricImageAssetId = assetId/);
  assert.match(scene, /new THREE\.CanvasTexture\(canvas\)/);
});

test('main editor treats a fabric group as one color and image target', () => {
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /Tek parça lightbox bezi seçili · renk \+ görsel uygulanabilir/);
  assert.match(main, /result\.mode === 'fabric-group'/);
  assert.match(main, /Tek parça lightbox bezine görsel uygulandı/);
});
