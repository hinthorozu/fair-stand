from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text()
old = "  tv.position.set(0, centerYM, 0);"
new = """  // Keep the TV fully in front of the wall panel. Flat-panel surfaces sit at roughly
  // wallDepth/2 + 1.5 mm, so a TV centered at local z=0 is mostly buried/occluded.
  // Local +Z is the module front and rotates correctly with left/right wall placement.
  const wallFrontM = STAND_DIMENSIONS.depth / 2 + 0.0015;
  tv.position.set(0, centerYM, wallFrontM + depthM / 2 + 0.003);"""
if old not in s:
    raise SystemExit('TV position anchor not found')
s = s.replace(old, new, 1)
scene.write_text(s)

test = Path('test/tv42Module.test.js')
t = test.read_text()
anchor = "  assert.match(tvSource, /createSelectionFrame\\(widthM, heightM\\)/);\n"
insert = "  assert.match(tvSource, /wallFrontM = STAND_DIMENSIONS\\.depth \\/ 2 \\+ 0\\.0015/);\n  assert.match(tvSource, /wallFrontM \\+ depthM \\/ 2 \\+ 0\\.003/);\n"
if insert not in t:
    if anchor not in t:
        raise SystemExit('TV test anchor not found')
    t = t.replace(anchor, anchor + insert, 1)
test.write_text(t)
