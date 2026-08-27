import test from 'node:test';
import assert from 'node:assert/strict';
import { placementsOverlap, snapPlacementToModules } from '../src/modulePlacement.js';

for (const size of [100, 150, 200]) {
  test(`Köşe Banko ${size} empty inner area is not treated as a solid rectangle`, () => {
    const counter = {
      id: `l-counter-${size}`,
      type: 'counter',
      shape: 'L',
      widthCm: size,
      depthCm: size,
      placement: { xCm: 200, yCm: 400, zCm: 0, rotationZDeg: 0, wallId: 'free' },
    };
    const voidStartY = 400 - size / 2 + 50;
    const panelInVoid = {
      id: 'panel-in-void',
      type: 'flat-panel',
      widthCm: 50,
      placement: { xCm: 225, yCm: voidStartY, zCm: 0, rotationZDeg: 90, wallId: 'free' },
    };
    const panelOnReturnArm = {
      id: 'panel-on-arm',
      type: 'flat-panel',
      widthCm: 50,
      placement: { xCm: 200 + size - 25, yCm: 400 - 25, zCm: 0, rotationZDeg: 90, wallId: 'free' },
    };

    assert.equal(placementsOverlap(counter, panelInVoid), false);
    assert.equal(placementsOverlap(counter, panelOnReturnArm), true);
  });

  test(`Düz Panel 50 snaps flush to exposed short side of Köşe Banko ${size}`, () => {
    const frontArmCenterY = 400 - size / 2 + 25;
    const counter = {
      id: `l-counter-${size}`,
      type: 'counter',
      shape: 'L',
      widthCm: size,
      depthCm: size,
      placement: { xCm: 200, yCm: 400, zCm: 0, rotationZDeg: 0, wallId: 'free' },
    };

    const result = snapPlacementToModules({
      moduleId: 'panel-50',
      moduleType: 'flat-panel',
      widthCm: 50,
      pointerXCm: 200,
      pointerYCm: frontArmCenterY,
      rotationZDeg: 90,
      modules: [counter],
      standType: 'island',
      standXCm: 1200,
      standYCm: 1200,
    });

    assert.equal(result?.snapKind, 'fixture-side');
    assert.deepEqual(result?.placement, {
      xCm: 200,
      yCm: frontArmCenterY - 25,
      zCm: 0,
      rotationZDeg: 90,
      wallId: 'free',
    });
  });
}
