import assert from 'node:assert/strict';
import test from 'node:test';

import { getItem } from '../src/items.js';

const FAMILY = Object.freeze([
  ['panel_48_5', 'panel_cam_48_5', 'Cam Panel 48,5 × 47 cm', 48.5],
  ['panel_98', 'panel_cam_98', 'Cam Panel 98 × 47 cm', 98],
  ['panel_147_5', 'panel_cam_147_5', 'Cam Panel 147,5 × 47 cm', 147.5],
  ['panel_197', 'panel_cam_197', 'Cam Panel 197 × 47 cm', 197],
  ['panel_corner_42_5', 'panel_corner_cam_42_5', 'Cam İç Köşe Paneli 42,5 × 47 cm', 42.5],
  ['panel_corner_92', 'panel_corner_cam_92', 'Cam İç Köşe Paneli 92 × 47 cm', 92],
  ['panel_corner_142_5', 'panel_corner_cam_142_5', 'Cam İç Köşe Paneli 142,5 × 47 cm', 142.5],
  ['panel_corner_192', 'panel_corner_cam_192', 'Cam İç Köşe Paneli 192 × 47 cm', 192],
]);

test('straight and corner panel families have a non-render cam twin with the same box', () => {
  for (const [sourceKey, camKey, name, widthCm] of FAMILY) {
    const source = getItem(sourceKey);
    const cam = getItem(camKey);
    assert.equal(cam.itemKey, camKey);
    assert.equal(cam.name, name);
    assert.equal(cam.type, 'panel-glass');
    assert.equal(cam.material, 'cam');
    assert.equal(cam.defaultColor, undefined);
    assert.equal(cam.catalogVisible, false);
    assert.equal(cam.isRender, false);
    assert.equal(cam.acceptsColor, false);
    assert.equal(cam.acceptsImage, false);
    assert.equal(cam.acceptsLightbox, false);
    assert.equal(cam.acceptsGlass, false);
    assert.equal(cam.acceptsMesh, false);
    assert.deepEqual(cam.dimensions, {
      widthCm,
      depthCm: source.dimensions.depthCm,
      heightCm: source.dimensions.heightCm,
    });
  }
});
