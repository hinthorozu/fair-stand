from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text()
old = "      wallRoot.add(module.group);\n      if (moduleState.type === 'tv') addTvScreenOverlay(module.group);\n      surfaceMeshes.push(...module.surfaces);"
new = "      wallRoot.add(module.group);\n      surfaceMeshes.push(...module.surfaces);"
if old not in s:
    raise SystemExit('stale TV overlay call block not found')
s = s.replace(old, new, 1)
scene.write_text(s)

test = Path('test/tv42Module.test.js')
t = test.read_text()
needle = "  assert.doesNotMatch(source, /addTvScreenOverlay/);"
if needle not in t:
    raise SystemExit('TV runtime guard insertion point not found')
t = t.replace(needle, needle + "\n  assert.doesNotMatch(source, /if \\(moduleState\\.type === 'tv'\\) addTvScreenOverlay/);", 1)
test.write_text(t)
