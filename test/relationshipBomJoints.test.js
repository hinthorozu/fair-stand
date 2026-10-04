import test from 'node:test';
import assert from 'node:assert/strict';

import { createFlatPanelModuleState } from '../src/designState.js';
import { createModulePlacement } from '../src/modulePlacement.js';
import { resolveProjectBom } from '../src/projectBom.js';
import { detectRelationshipJoints, getInnerCornerPanelSku } from '../src/relationshipBom.js';

function qty(bom, itemKey) {
  const line = bom.lines.find((entry) => entry.itemKey === itemKey);
  return line ? line.quantity : 0;
}

function placed(id, itemKey, { xCm = 0, yCm = 0, zCm = 0, rotationZDeg = 0, widthCm }) {
  return {
    id,
    itemKey,
    widthCm,
    placement: createModulePlacement({ xCm, yCm, zCm, rotationZDeg }),
  };
}

function cornerPair(id, itemKey, widthCm, { xCm, yCm }) {
  // 270 keeps the front face toward the other wall. 90 puts this module on the back.
  return placed(id, itemKey, { xCm, yCm, rotationZDeg: 270, widthCm });
}

test('wall + door end-to-end → 3 upright, 4 start, 8 single, 3 double', () => {
  const bom = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    placed('b', 'wall_door_100_350', { xCm: 200, widthCm: 100 }),
  ]);
  assert.equal(bom.appliedEndToEndCount, 1);
  assert.equal(bom.appliedCornerCount, 0);
  assert.equal(qty(bom, 'upright_346_5'), 3);
  assert.equal(qty(bom, 'connector_start'), 4);
  assert.equal(qty(bom, 'connector_single'), 8);
  assert.equal(qty(bom, 'connector_double'), 3);
  assert.equal(qty(bom, 'connector_corner'), 0);
  assert.equal(qty(bom, 'panel_197'), 7);
  assert.equal(qty(bom, 'panel_98'), 3);
  assert.equal(qty(bom, 'door_leaf_100'), 1);
});

test('wall + separator 50 and 100 end-to-end keep 6+6 singles and 7 doubles', () => {
  const sep50 = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    placed('b', 'wall_separator_50_350', { xCm: 200, widthCm: 50 }),
  ]);
  assert.equal(qty(sep50, 'upright_346_5'), 3);
  assert.equal(qty(sep50, 'connector_start'), 4);
  assert.equal(qty(sep50, 'connector_single'), 12);
  assert.equal(qty(sep50, 'connector_double'), 7);
  assert.equal(qty(sep50, 'panel_197'), 7);
  assert.equal(qty(sep50, 'separator_panel_48_5'), 7);
  assert.equal(qty(sep50, 'separator_panel_98'), 0);

  const sep100 = resolveProjectBom([
    placed('a', 'wall_100_350', { xCm: 0, widthCm: 100 }),
    placed('b', 'wall_separator_100_350', { xCm: 100, widthCm: 100 }),
  ]);
  assert.equal(qty(sep100, 'connector_single'), 12);
  assert.equal(qty(sep100, 'connector_double'), 7);
  assert.equal(qty(sep100, 'upright_346_5'), 3);
  assert.equal(qty(sep100, 'separator_panel_98'), 7);
  assert.equal(qty(sep100, 'panel_98'), 7);
});

test('sarmasik separator end-to-end matches the plain separator of the same width', () => {
  const plain = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    placed('b', 'wall_separator_50_350', { xCm: 200, widthCm: 50 }),
  ]);
  const ivy = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    placed('b', 'wall_separator_50_350_sarmasik', { xCm: 200, widthCm: 50 }),
  ]);
  for (const itemKey of ['upright_346_5', 'connector_start', 'connector_single', 'connector_double', 'connector_corner', 'separator_panel_48_5', 'separator_panel_98']) {
    assert.equal(qty(ivy, itemKey), qty(plain, itemKey), itemKey);
  }
  assert.equal(qty(ivy, 'separator_panel_48_5'), 7);
  assert.equal(qty(ivy, 'separator_panel_98'), 0);
});

test('wall + showcase end-to-end uses the locked single and double counts', () => {
  const showcase3 = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    placed('b', 'wall_showcase_100_3_350', { xCm: 200, widthCm: 100 }),
  ]);
  assert.equal(qty(showcase3, 'upright_346_5'), 3);
  assert.equal(qty(showcase3, 'connector_start'), 6);
  assert.equal(qty(showcase3, 'connector_single'), 12);
  assert.equal(qty(showcase3, 'connector_double'), 4);
  assert.equal(qty(showcase3, 'panel_197'), 7);
  assert.equal(qty(showcase3, 'panel_98'), 4);
  assert.equal(qty(showcase3, 'glass_shelf'), 2);

  const showcase2 = resolveProjectBom([
    placed('a', 'wall_50_350', { xCm: 0, widthCm: 50 }),
    placed('b', 'wall_showcase_100_2_350', { xCm: 50, widthCm: 100 }),
  ]);
  assert.equal(qty(showcase2, 'upright_346_5'), 3);
  assert.equal(qty(showcase2, 'connector_start'), 6);
  assert.equal(qty(showcase2, 'connector_single'), 12);
  assert.equal(qty(showcase2, 'connector_double'), 5);
  assert.equal(qty(showcase2, 'panel_48_5'), 7);
  assert.equal(qty(showcase2, 'panel_98'), 5);
  assert.equal(qty(showcase2, 'glass_shelf'), 1);
});

test('a module on the back face takes no corner connectors: 20 single, 6 corner', () => {
  const bom = resolveProjectBom([
    placed('a', 'wall_100_350', { xCm: 0, widthCm: 100 }),
    placed('b', 'wall_100_350', { xCm: 100, yCm: 0, rotationZDeg: 90, widthCm: 100 }),
  ]);
  assert.equal(bom.appliedCornerCount, 1);
  assert.equal(qty(bom, 'upright_346_5'), 3);
  assert.equal(qty(bom, 'connector_start'), 4);
  assert.equal(qty(bom, 'connector_single'), 20);
  assert.equal(qty(bom, 'connector_double'), 0);
  assert.equal(qty(bom, 'connector_corner'), 6);
  assert.equal(qty(bom, 'panel_corner_92'), 7);
  assert.equal(qty(bom, 'panel_98'), 7);
});

test('two walls inner corner → 3 upright, 14 single, 12 corner, corner panels', () => {
  const bom = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    cornerPair('b', 'wall_150_350', 150, { xCm: 200, yCm: 0 }),
  ]);
  assert.equal(bom.joints.length, 1);
  assert.equal(bom.joints[0].kind, 'corner');
  assert.equal(bom.appliedCornerCount, 1);
  assert.equal(qty(bom, 'upright_346_5'), 3);
  assert.equal(qty(bom, 'connector_start'), 4);
  assert.equal(qty(bom, 'connector_single'), 14);
  assert.equal(qty(bom, 'connector_double'), 0);
  assert.equal(qty(bom, 'connector_corner'), 12);
  assert.equal(qty(bom, 'panel_corner_192'), 7);
  assert.equal(qty(bom, 'panel_corner_142_5'), 7);
  assert.equal(qty(bom, 'panel_197'), 0);
  assert.equal(qty(bom, 'panel_147_5'), 0);
  assert.equal(qty(bom, 'profile_190'), 2);
  assert.equal(qty(bom, 'profile_140_5'), 2);
});

test('wall + door inner corner converts both panel families and adds 8 corner connectors', () => {
  const bom = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    cornerPair('b', 'wall_door_100_350', 100, { xCm: 200, yCm: 0 }),
  ]);
  assert.equal(qty(bom, 'upright_346_5'), 3);
  assert.equal(qty(bom, 'profile_190'), 2);
  assert.equal(qty(bom, 'profile_91'), 1);
  assert.equal(qty(bom, 'panel_corner_192'), 7);
  assert.equal(qty(bom, 'panel_corner_92'), 3);
  assert.equal(qty(bom, 'panel_98'), 0);
  assert.equal(qty(bom, 'door_leaf_100'), 1);
  assert.equal(qty(bom, 'connector_start'), 4);
  assert.equal(qty(bom, 'connector_single'), 10);
  assert.equal(qty(bom, 'connector_corner'), 8);
  assert.equal(qty(bom, 'connector_double'), 0);
});

test('separator inner corner matches wall hardware and keeps separator panels', () => {
  const sep50 = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    cornerPair('b', 'wall_separator_50_350', 50, { xCm: 200, yCm: 0 }),
  ]);
  assert.equal(qty(sep50, 'upright_346_5'), 3);
  assert.equal(qty(sep50, 'connector_start'), 4);
  assert.equal(qty(sep50, 'connector_single'), 14);
  assert.equal(qty(sep50, 'connector_corner'), 12);
  assert.equal(qty(sep50, 'connector_double'), 0);
  assert.equal(qty(sep50, 'profile_190'), 2);
  assert.equal(qty(sep50, 'profile_41_5'), 2);
  assert.equal(qty(sep50, 'panel_corner_192'), 7);
  assert.equal(qty(sep50, 'separator_panel_48_5'), 7);
  assert.equal(qty(sep50, 'separator_panel_98'), 0);
  assert.equal(qty(sep50, 'panel_corner_42_5'), 0);

  const sep100 = resolveProjectBom([
    placed('a', 'wall_50_350', { xCm: 0, widthCm: 50 }),
    cornerPair('b', 'wall_separator_100_350', 100, { xCm: 50, yCm: 0 }),
  ]);
  assert.equal(qty(sep100, 'connector_single'), 14);
  assert.equal(qty(sep100, 'connector_corner'), 12);
  assert.equal(qty(sep100, 'panel_corner_42_5'), 7);
  assert.equal(qty(sep100, 'separator_panel_98'), 7);
  assert.equal(qty(sep100, 'profile_41_5'), 2);
  assert.equal(qty(sep100, 'profile_91'), 2);

  const ivy = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    cornerPair('b', 'wall_separator_100_350_sarmasik', 100, { xCm: 200, yCm: 0 }),
  ]);
  assert.equal(qty(ivy, 'connector_single'), 14);
  assert.equal(qty(ivy, 'connector_corner'), 12);
  assert.equal(qty(ivy, 'separator_panel_98'), 7);
  assert.equal(qty(ivy, 'panel_corner_92'), 0);

  const ivy50 = resolveProjectBom([
    placed('a', 'wall_50_350', { xCm: 0, widthCm: 50 }),
    cornerPair('b', 'wall_separator_50_350_sarmasik', 50, { xCm: 50, yCm: 0 }),
  ]);
  assert.equal(qty(ivy50, 'separator_panel_48_5'), 7);
  assert.equal(qty(ivy50, 'separator_panel_98'), 0);
  assert.equal(qty(ivy50, 'panel_corner_42_5'), 7);
  assert.equal(qty(ivy50, 'connector_corner'), 12);
  assert.equal(qty(ivy50, 'connector_single'), 14);
});

test('showcase inner corner keeps wall width on profiles and showcase panels become corner panels', () => {
  const showcase3 = resolveProjectBom([
    placed('a', 'wall_100_350', { xCm: 0, widthCm: 100 }),
    cornerPair('b', 'wall_showcase_100_3_350', 100, { xCm: 100, yCm: 0 }),
  ]);
  assert.equal(qty(showcase3, 'upright_346_5'), 3);
  assert.equal(qty(showcase3, 'profile_91'), 6);
  assert.equal(qty(showcase3, 'panel_corner_92'), 11);
  assert.equal(qty(showcase3, 'panel_98'), 0);
  assert.equal(qty(showcase3, 'showcase_side_143_5_30'), 2);
  assert.equal(qty(showcase3, 'glass_shelf'), 2);
  assert.equal(qty(showcase3, 'connector_start'), 6);
  assert.equal(qty(showcase3, 'connector_single'), 11);
  assert.equal(qty(showcase3, 'connector_corner'), 9);
  assert.equal(qty(showcase3, 'connector_double'), 0);

  const showcase2 = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    cornerPair('b', 'wall_showcase_100_2_350', 100, { xCm: 200, yCm: 0 }),
  ]);
  assert.equal(qty(showcase2, 'profile_190'), 2);
  assert.equal(qty(showcase2, 'profile_91'), 4);
  assert.equal(qty(showcase2, 'panel_corner_192'), 7);
  assert.equal(qty(showcase2, 'panel_corner_92'), 5);
  assert.equal(qty(showcase2, 'glass_shelf'), 1);
  assert.equal(qty(showcase2, 'connector_single'), 12);
  assert.equal(qty(showcase2, 'connector_corner'), 10);
  assert.equal(qty(showcase2, 'connector_start'), 6);
});

test('explicit inner-corner mapping converts only the four straight panels', () => {
  assert.equal(getInnerCornerPanelSku('panel_48_5'), 'panel_corner_42_5');
  assert.equal(getInnerCornerPanelSku('panel_98'), 'panel_corner_92');
  assert.equal(getInnerCornerPanelSku('panel_147_5'), 'panel_corner_142_5');
  assert.equal(getInnerCornerPanelSku('panel_197'), 'panel_corner_192');
  for (const sku of ['panel_cam_197', 'separator_panel_48_5', 'separator_panel_98', 'door_leaf_100', 'glass_shelf']) {
    assert.equal(getInnerCornerPanelSku(sku), sku, sku);
  }

  const wall50 = resolveProjectBom([
    placed('a', 'wall_50_350', { widthCm: 50 }),
    cornerPair('b', 'wall_50_350', 50, { xCm: 50, yCm: 0 }),
  ]);
  assert.equal(qty(wall50, 'panel_corner_42_5'), 14);
  assert.equal(qty(wall50, 'panel_48_5'), 0);

  const door = resolveProjectBom([
    placed('a', 'wall_door_100_350', { widthCm: 100 }),
    cornerPair('b', 'wall_100_350', 100, { xCm: 100, yCm: 0 }),
  ]);
  assert.equal(qty(door, 'panel_corner_92'), 10);
  assert.equal(qty(door, 'door_leaf_100'), 1);
  assert.equal(qty(door, 'panel_98'), 0);

  const showcase = resolveProjectBom([
    placed('a', 'wall_showcase_100_2_350', { widthCm: 100 }),
    cornerPair('b', 'wall_100_350', 100, { xCm: 100, yCm: 0 }),
  ]);
  assert.equal(qty(showcase, 'panel_corner_92'), 12);
  assert.equal(qty(showcase, 'glass_shelf'), 1);
  assert.equal(qty(showcase, 'panel_98'), 0);
});

test('glass strips on an inner-corner wall stay panel_cam', () => {
  const wall = createFlatPanelModuleState({ itemKey: 'wall_200_350' });
  wall.id = 'a';
  wall.widthCm = 200;
  wall.placement = createModulePlacement({ xCm: 0, yCm: 0, rotationZDeg: 0 });
  for (let index = 0; index < 4; index += 1) wall.strips[index].isGlass = true;

  const bom = resolveProjectBom([
    wall,
    cornerPair('b', 'wall_200_350', 200, { xCm: 200, yCm: 0 }),
  ]);
  assert.equal(qty(bom, 'panel_corner_192'), 10);
  assert.equal(qty(bom, 'panel_corner_cam_192'), 0);
  assert.equal(qty(bom, 'panel_197'), 0);
  assert.equal(qty(bom, 'panel_cam_197'), 4);
  assert.ok(bom.relationshipNotes.some((note) => note.includes('panel_197 × 4 → panel_cam_197')));
});

test('a tee into the middle of a wall shares one upright and does not add doubles', () => {
  const modules = [
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    cornerPair('b', 'wall_100_350', 100, { xCm: 100, yCm: 0 }),
  ];
  const joints = detectRelationshipJoints(modules);
  assert.equal(joints.length, 1);
  assert.equal(joints[0].kind, 'tee');
  const bom = resolveProjectBom(modules);
  assert.equal(bom.appliedTeeCount, 1);
  assert.equal(qty(bom, 'upright_346_5'), 3);
  assert.equal(qty(bom, 'connector_double'), 0);
  assert.equal(qty(bom, 'connector_corner'), 6);
  assert.equal(qty(bom, 'panel_197'), 7);
  assert.equal(qty(bom, 'panel_98'), 7);
  assert.equal(qty(bom, 'panel_corner_92'), 0);
});

test('a 150 cm wall in front of another wall is not an inner corner', () => {
  const modules = [
    placed('face', 'wall_150_350', { yCm: 30, widthCm: 150 }),
    placed('back', 'wall_200_350', { widthCm: 200 }),
  ];
  assert.equal(detectRelationshipJoints(modules).length, 0);
  const bom = resolveProjectBom(modules);
  assert.equal(qty(bom, 'panel_147_5'), 7);
  assert.equal(qty(bom, 'panel_corner_142_5'), 0);
  assert.equal(qty(bom, 'connector_corner'), 0);
  assert.equal(qty(bom, 'connector_single'), 26);
  assert.equal(qty(bom, 'upright_346_5'), 4);
});

test('inner-corner negatives stay straight panels', () => {
  function absent(label, modules) {
    const joints = detectRelationshipJoints(modules);
    assert.equal(joints.some((joint) => joint.kind === 'corner'), false, label);
    const bom = resolveProjectBom(modules);
    assert.equal(qty(bom, 'panel_corner_142_5'), 0, label);
    assert.equal(qty(bom, 'panel_corner_42_5') + qty(bom, 'panel_corner_92') + qty(bom, 'panel_corner_192'), 0, label);
  }

  absent('90 with a gap', [
    placed('a', 'wall_150_350', { widthCm: 150 }),
    placed('b', 'wall_200_350', { xCm: 150, yCm: 10, rotationZDeg: 270, widthCm: 200 }),
  ]);
  absent('parallel gap', [
    placed('a', 'wall_150_350', { widthCm: 150 }),
    placed('b', 'wall_200_350', { xCm: 151, widthCm: 200 }),
  ]);
  absent('in front without contact', [
    placed('a', 'wall_150_350', { widthCm: 150 }),
    placed('b', 'wall_200_350', { yCm: 40, rotationZDeg: 180, widthCm: 200 }),
  ]);
  absent('body overlap', [
    placed('a', 'wall_200_350', { widthCm: 200 }),
    placed('b', 'wall_150_350', { xCm: 25, widthCm: 150 }),
  ]);
  absent('z overlap without xy contact', [
    placed('a', 'wall_150_350', { widthCm: 150 }),
    placed('b', 'wall_200_350', { yCm: 20, widthCm: 200 }),
  ]);

  const splitZ = [
    placed('a', 'wall_150_350', { widthCm: 150 }),
    placed('b', 'wall_200_350', { xCm: 150, rotationZDeg: 270, zCm: 400, widthCm: 200 }),
  ];
  absent('xy contact with split z', splitZ);
  assert.equal(qty(resolveProjectBom(splitZ), 'connector_corner'), 0);
  assert.equal(qty(resolveProjectBom(splitZ), 'upright_346_5'), 4);
  assert.equal(qty(resolveProjectBom(splitZ), 'panel_147_5'), 7);

  const tee = [
    placed('host', 'wall_200_350', { widthCm: 200 }),
    placed('branch', 'wall_150_350', { xCm: 100, rotationZDeg: 270, widthCm: 150 }),
  ];
  assert.equal(detectRelationshipJoints(tee)[0].kind, 'tee');
  const teeBom = resolveProjectBom(tee);
  assert.equal(qty(teeBom, 'panel_147_5'), 7);
  assert.equal(qty(teeBom, 'panel_197'), 7);
  assert.equal(qty(teeBom, 'panel_corner_142_5'), 0);
  assert.equal(qty(teeBom, 'connector_corner'), 6);
  assert.equal(qty(teeBom, 'upright_346_5'), 3);

  const end = [
    placed('a', 'wall_150_350', { widthCm: 150 }),
    placed('b', 'wall_200_350', { xCm: 150, widthCm: 200 }),
  ];
  assert.equal(detectRelationshipJoints(end)[0].kind, 'end-to-end');
  assert.equal(qty(resolveProjectBom(end), 'panel_147_5'), 7);
  assert.equal(qty(resolveProjectBom(end), 'panel_corner_142_5'), 0);

  const back = resolveProjectBom([
    placed('inner', 'wall_150_350', { widthCm: 150 }),
    placed('outer', 'wall_200_350', { xCm: 150, rotationZDeg: 90, widthCm: 200 }),
  ]);
  assert.equal(qty(back, 'panel_corner_142_5'), 7);
  assert.equal(qty(back, 'panel_197'), 7);
  assert.equal(qty(back, 'panel_corner_192'), 0);
});

test('two collinear walls with a branch at the joint are one tee: 4 uprights, no doubles', () => {
  const bom = resolveProjectBom([
    placed('a', 'wall_200_350', { xCm: 0, widthCm: 200 }),
    placed('b', 'wall_200_350', { xCm: 200, widthCm: 200 }),
    cornerPair('c', 'wall_showcase_100_2_350', 100, { xCm: 200, yCm: 0 }),
  ]);
  assert.equal(bom.joints.length, 1);
  assert.equal(bom.joints[0].kind, 'tee');
  assert.equal(qty(bom, 'upright_346_5'), 4);
  assert.equal(qty(bom, 'connector_double'), 0);
  assert.equal(qty(bom, 'connector_corner'), 16);
  assert.equal(qty(bom, 'connector_start'), 8);
});

test('an unlocked door-door joint does not add doubles or corners', () => {
  const doors = resolveProjectBom([
    placed('a', 'wall_door_100_350', { xCm: 0, widthCm: 100 }),
    placed('b', 'wall_door_100_350', { xCm: 100, widthCm: 100 }),
  ]);
  assert.equal(doors.joints.length, 0);
  assert.equal(qty(doors, 'connector_single'), 10);
  assert.equal(qty(doors, 'connector_double'), 0);
  assert.equal(qty(doors, 'panel_98'), 6);
});
