from pathlib import Path

scene_path = Path('src/scene3d.js')
scene = scene_path.read_text(encoding='utf-8')

old_open = """    if (shelfLightingOn) {
      // Gerçek raf altı aydınlatma: görünür lineer LED + aşağı/öne bakan spot.
"""
new_open = """    {
      // Raf ışıkları bir kez oluşturulur; aç/kapa sadece visible değiştirir.
"""
if old_open not in scene:
    raise SystemExit('shelf lighting block start not found')
scene = scene.replace(old_open, new_open, 1)

old_led = """      ledStrip.userData.kind = 'decoration';
      ledStrip.userData.role = 'shelf-under-led-strip';
      built.group.add(ledStrip);
"""
new_led = """      ledStrip.visible = shelfLightingOn;
      ledStrip.userData.kind = 'decoration';
      ledStrip.userData.role = 'shelf-under-led-strip';
      built.group.add(ledStrip);
"""
if old_led not in scene:
    raise SystemExit('led strip marker not found')
scene = scene.replace(old_led, new_led, 1)

old_spot = """        spot.castShadow = false;
        spot.userData.kind = 'decoration';
        spot.userData.role = 'shelf-under-light';
        built.group.add(spot, spot.target);
"""
new_spot = """        spot.visible = shelfLightingOn;
        spot.castShadow = false;
        spot.userData.kind = 'decoration';
        spot.userData.role = 'shelf-under-light';
        built.group.add(spot, spot.target);
"""
if old_spot not in scene:
    raise SystemExit('spot marker not found')
scene = scene.replace(old_spot, new_spot, 1)

old_group_meta = """      module.group.userData.moduleState = moduleState;
      module.group.userData.placement = { ...placement };
"""
new_group_meta = """      module.group.userData.moduleState = moduleState;
      module.group.userData.moduleIndex = moduleIndex;
      module.group.userData.placement = { ...placement };
"""
if old_group_meta not in scene:
    raise SystemExit('module group metadata marker not found')
scene = scene.replace(old_group_meta, new_group_meta, 1)

return_marker = """  return {
    captureCurrentViewPng,
"""
method = """  function setShelfLightingVisible(moduleIndex, enabled) {
    const targetIndex = Number(moduleIndex);
    const visible = Boolean(enabled);
    let changed = false;

    wallRoot.children.forEach((group) => {
      if (Number(group.userData?.moduleIndex) !== targetIndex) return;
      if (group.userData?.moduleState?.type !== 'shelf') return;

      group.userData.moduleState.shelfLightingOn = visible;
      group.traverse((object) => {
        const role = object.userData?.role;
        if (role === 'shelf-under-led-strip' || role === 'shelf-under-light') {
          object.visible = visible;
          changed = true;
        }
      });
    });

    return changed;
  }

""" + return_marker
if return_marker not in scene:
    raise SystemExit('scene return marker not found')
scene = scene.replace(return_marker, method, 1)

api_marker = """    captureCurrentViewPng,
    setCameraMode,
"""
api_replacement = """    captureCurrentViewPng,
    setShelfLightingVisible,
    setCameraMode,
"""
if api_marker not in scene:
    raise SystemExit('scene api marker not found')
scene = scene.replace(api_marker, api_replacement, 1)
scene_path.write_text(scene, encoding='utf-8')

main_path = Path('src/main.js')
main = main_path.read_text(encoding='utf-8')
old_toggle = """function changeContextShelfLighting(context, enabled) {
  const index = findContextModuleIndex(context);
  if (index < 0 || currentModules[index]?.type !== 'shelf') return;

  currentModules[index].shelfLightingOn = Boolean(enabled);
  rebuildWall({ resetView: false });
  selectionInfo.textContent = enabled
    ? 'Raf altı aydınlatma açıldı.'
    : 'Raf altı aydınlatma kapatıldı.';
}
"""
new_toggle = """function changeContextShelfLighting(context, enabled) {
  const index = findContextModuleIndex(context);
  if (index < 0 || currentModules[index]?.type !== 'shelf') return;

  const nextEnabled = Boolean(enabled);
  currentModules[index].shelfLightingOn = nextEnabled;
  if (!scene3d.setShelfLightingVisible(index, nextEnabled)) {
    rebuildWall({ resetView: false });
  }
  selectionInfo.textContent = nextEnabled
    ? 'Raf altı aydınlatma açıldı.'
    : 'Raf altı aydınlatma kapatıldı.';
}
"""
if old_toggle not in main:
    raise SystemExit('main shelf toggle block not found')
main = main.replace(old_toggle, new_toggle, 1)
main_path.write_text(main, encoding='utf-8')

test_path = Path('test/shelfLighting.test.js')
test = test_path.read_text(encoding='utf-8')
needle = """  assert.match(source, /spot\\.castShadow = false/);
  assert.match(source, /role = 'shelf-under-light'/);
"""
replacement = """  assert.match(source, /spot\\.visible = shelfLightingOn/);
  assert.match(source, /ledStrip\\.visible = shelfLightingOn/);
  assert.match(source, /spot\\.castShadow = false/);
  assert.match(source, /role = 'shelf-under-light'/);
  assert.match(source, /function setShelfLightingVisible\\(moduleIndex, enabled\\)/);
  assert.match(source, /module\\.group\\.userData\\.moduleIndex = moduleIndex/);
"""
if needle not in test:
    raise SystemExit('renderer test marker not found')
test = test.replace(needle, replacement, 1)

main_assert = """  assert.match(main, /shelfLightingOn = Boolean\\(enabled\\)/);
"""
main_replacement = """  assert.match(main, /currentModules\\[index\\]\\.shelfLightingOn = nextEnabled/);
  assert.match(main, /scene3d\\.setShelfLightingVisible\\(index, nextEnabled\\)/);
"""
if main_assert not in test:
    raise SystemExit('main toggle test marker not found')
test = test.replace(main_assert, main_replacement, 1)
test_path.write_text(test, encoding='utf-8')
