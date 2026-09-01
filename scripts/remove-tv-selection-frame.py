from pathlib import Path

scene_path = Path('src/scene3d.js')
test_path = Path('test/tv42Module.test.js')

scene = scene_path.read_text(encoding='utf-8')
old_block = """  // TV uses an array of six face materials, so emissive-based selection cannot mark it.\n  // Give it the same explicit selection frame used by selectable panel surfaces.\n  const selectionFrame = createSelectionFrame(widthM, heightM);\n  selectionFrame.position.z = depthM / 2 + 0.006;\n  selectionFrame.visible = false;\n  tv.add(selectionFrame);\n\n"""
if old_block not in scene:
    raise SystemExit('TV selection frame block not found')
scene = scene.replace(old_block, '', 1)
old_line = "  tv.userData.selectionFrame = selectionFrame;\n"
if old_line not in scene:
    raise SystemExit('TV selectionFrame userData line not found')
scene = scene.replace(old_line, '', 1)
scene_path.write_text(scene, encoding='utf-8')

test = test_path.read_text(encoding='utf-8')
test = test.replace("  assert.match(tvSource, /createSelectionFrame\\(widthM, heightM\\)/);\n", "  assert.doesNotMatch(tvSource, /createSelectionFrame\\(widthM, heightM\\)/);\n", 1)
test = test.replace("  assert.match(tvSource, /tv\\.userData\\.selectionFrame = selectionFrame/);\n", "  assert.doesNotMatch(tvSource, /tv\\.userData\\.selectionFrame/);\n", 1)
test_path.write_text(test, encoding='utf-8')
