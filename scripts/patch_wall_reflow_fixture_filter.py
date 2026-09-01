from pathlib import Path

wall = Path('src/wallReflow.js')
text = wall.read_text()
old_import = "import { createModulePlacement } from './modulePlacement.js';\n"
new_import = old_import + "import { getModuleBehavior } from './moduleBehavior.js';\n"
if "getModuleBehavior" not in text:
    if old_import not in text:
        raise SystemExit('wallReflow import anchor not found')
    text = text.replace(old_import, new_import, 1)

old_filter = ".filter((module) => activeWallIds.has(module?.placement?.wallId))"
new_filter = ".filter((module) => (\n      getModuleBehavior(module).placement === 'wall'\n      && activeWallIds.has(module?.placement?.wallId)\n    ))"
if new_filter not in text:
    if old_filter not in text:
        raise SystemExit('activeModules filter anchor not found')
    text = text.replace(old_filter, new_filter, 1)
wall.write_text(text)

test = Path('test/wallReflow.test.js')
t = test.read_text()
marker = "test('top fixtures do not consume continuous wall capacity during duplication',"
if marker not in t:
    t += r'''

test('top fixtures do not consume continuous wall capacity during duplication', () => {
  const target = { id: 'panel-a', type: 'flat-panel', widthCm: 200, placement: {
    xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back',
  } };
  const next = { id: 'panel-b', type: 'flat-panel', widthCm: 200, placement: {
    xCm: 200, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back',
  } };
  const lamp = { id: 'lamp', type: 'led-floodlight', widthCm: 50, placement: {
    xCm: 150, yCm: 0, zCm: 350, rotationZDeg: 0, wallId: 'back',
  } };
  const duplicate = { id: 'panel-copy', type: 'flat-panel', widthCm: 100, placement: null };

  const result = planContinuousWallInsertion({
    modules: [target, lamp, next],
    insertedModules: [duplicate],
    targetModuleId: target.id,
    side: 'right',
    standType: 'back-wall',
    standXCm: 500,
    standYCm: 500,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.get('panel-copy').xCm, 200);
  assert.equal(result.placements.get('panel-b').xCm, 300);
  assert.equal(result.placements.has('lamp'), false);
  assert.ok(result.orderedModuleIds.includes('lamp'));
});

test('wall overlays do not consume continuous wall capacity', () => {
  const target = { id: 'panel-a', type: 'flat-panel', widthCm: 200, placement: {
    xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back',
  } };
  const tv = { id: 'tv', type: 'tv', widthCm: 93, placement: {
    xCm: 100, yCm: 0, zCm: 0, rotationZDeg: 0, wallId: 'back',
  } };
  const duplicate = { id: 'panel-copy', type: 'flat-panel', widthCm: 200, placement: null };

  const result = planContinuousWallInsertion({
    modules: [target, tv],
    insertedModules: [duplicate],
    targetModuleId: target.id,
    side: 'right',
    standType: 'back-wall',
    standXCm: 400,
    standYCm: 400,
  });

  assert.equal(result.ok, true);
  assert.equal(result.placements.get('panel-copy').xCm, 200);
  assert.equal(result.placements.has('tv'), false);
  assert.ok(result.orderedModuleIds.includes('tv'));
});
'''
    test.write_text(t)
