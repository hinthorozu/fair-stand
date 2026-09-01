import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('lightbox fabric lighting is a right-click toggle', () => {
  const menu = readFileSync(new URL('../src/moduleContextMenu.js', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(menu, /data-module-action="toggle-fabric-light"/);
  assert.match(menu, /Lightbox aydınlatmayı aç/);
  assert.match(menu, /Lightbox aydınlatmayı kapat/);
  assert.match(main, /function changeContextFabricLighting/);
  assert.match(main, /scene3d\.setFabricLighting\(selectedPanels, enabled\)/);
});

test('lightbox backlight brightens only the fabric material without a physical light', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /function applyFabricOverlayLighting/);
  assert.match(scene, /fabricLightingOn/);
  assert.match(scene, /material\.emissiveMap = material\.map/);
  assert.match(scene, /material\.emissiveIntensity = 1\.08/);
  assert.match(scene, /context\.filter = 'saturate\(1\.08\) contrast\(1\.06\)'/);
  assert.match(scene, /side: THREE\.FrontSide/);
  assert.match(scene, /if \(backing\) backing\.visible = true/);
  assert.match(scene, /function setFabricLighting/);
  assert.match(scene, /setFabricLighting,/);
});
