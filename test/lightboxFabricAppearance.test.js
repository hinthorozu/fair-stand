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
  const selectionFeedback = readFileSync(new URL('../src/selectionFeedback.js', import.meta.url), 'utf8');
  assert.match(selectionFeedback, /Tek parça Lightbox Kumaş seçili · renk \+ görsel uygulanabilir/);
  assert.match(selectionFeedback, /Tek parça Mesh \(Delikli\) Branda seçili · renk \+ görsel uygulanabilir/);
  assert.match(main, /result\.mode === 'fabric-group'/);
  assert.match(main, /Tek parça Lightbox Kumaşa görsel uygulandı/);
  assert.match(main, /Tek parça Mesh \(Delikli\) Brandaya görsel uygulandı/);
});
