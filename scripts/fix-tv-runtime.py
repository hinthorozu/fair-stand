from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text()
stale = "if (moduleState.type === 'tv') addTvScreenOverlay(module.group);"
if stale in s:
    s = s.replace(stale, '', 1)
scene.write_text(s)

test = Path('test/tv42Module.test.js')
t = test.read_text()
needle = "  assert.doesNotMatch(source, /addTvScreenOverlay/);"
guard = "  assert.doesNotMatch(source, /if \\(moduleState\\.type === 'tv'\\) addTvScreenOverlay/);"
if needle in t and guard not in t:
    t = t.replace(needle, needle + "\n" + guard, 1)
test.write_text(t)
