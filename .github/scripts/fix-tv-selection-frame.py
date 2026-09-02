from pathlib import Path


def replace_exact(path, old, new, count=1):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    found = text.count(old)
    if found != count:
        raise SystemExit(f'{path}: expected {count} occurrences, found {found}: {old!r}')
    p.write_text(text.replace(old, new, count), encoding='utf-8')


# The generic module selection frame normally assumes a floor-origin module whose
# bounding box is centered at y=height/2. Wall-overlay accessories such as TVs are
# intentionally rendered at another local center, so allow a renderer to publish
# exact local selection bounds without special-casing the module type here.
replace_exact(
    'src/scene3d.js',
    "    const widthM = Number(moduleGroup.userData?.widthCm) / 100;\n    const depthM = Number(moduleGroup.userData?.depthCm) / 100;\n    const heightM = Number(moduleGroup.userData?.heightCm) / 100;\n    if (!(widthM > 0) || !(depthM > 0) || !(heightM > 0)) return null;",
    "    const selectionBounds = moduleGroup.userData?.selectionBounds ?? null;\n    const widthM = Number(selectionBounds?.widthM ?? (Number(moduleGroup.userData?.widthCm) / 100));\n    const depthM = Number(selectionBounds?.depthM ?? (Number(moduleGroup.userData?.depthCm) / 100));\n    const heightM = Number(selectionBounds?.heightM ?? (Number(moduleGroup.userData?.heightCm) / 100));\n    if (!(widthM > 0) || !(depthM > 0) || !(heightM > 0)) return null;\n\n    const centerX = Number(selectionBounds?.centerX);\n    const centerY = Number(selectionBounds?.centerY);\n    const centerZ = Number(selectionBounds?.centerZ);",
)

replace_exact(
    'src/scene3d.js',
    "    frame.position.set(0, heightM / 2, 0);",
    "    frame.position.set(\n      Number.isFinite(centerX) ? centerX : 0,\n      Number.isFinite(centerY) ? centerY : heightM / 2,\n      Number.isFinite(centerZ) ? centerZ : 0,\n    );",
)

# Publish the TV's actual rendered box. This is driven by screenWidthCm and
# screenHeightCm, so 42/55/65 inch variants all get their own correct selection box.
replace_exact(
    'src/scene3d.js',
    "  tv.position.set(0, centerYM, wallFrontM + depthM / 2 + 0.003);\n  tv.castShadow = true;",
    "  tv.position.set(0, centerYM, wallFrontM + depthM / 2 + 0.003);\n  group.userData.selectionBounds = Object.freeze({\n    widthM,\n    heightM,\n    depthM,\n    centerX: tv.position.x,\n    centerY: tv.position.y,\n    centerZ: tv.position.z,\n  });\n  tv.castShadow = true;",
)

# Add regression coverage for both the generic custom-bounds contract and all TV sizes.
test_path = Path('test/tv42Module.test.js')
test_text = test_path.read_text(encoding='utf-8')
anchor = "test('scene keeps the shared textureLoader for normal panel images', () => {"
if test_text.count(anchor) != 1:
    raise SystemExit(f'test/tv42Module.test.js: expected one insertion anchor, found {test_text.count(anchor)}')

new_tests = r'''test('module selection frame honors renderer-provided local bounds', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function ensureModuleSelectionFrame');
  const finish = source.indexOf('\n  function setModuleSelectionVisual', start);
  assert.ok(start >= 0 && finish > start);
  const selectionSource = source.slice(start, finish);
  assert.match(selectionSource, /moduleGroup\.userData\?\.selectionBounds/);
  assert.match(selectionSource, /selectionBounds\?\.widthM/);
  assert.match(selectionSource, /selectionBounds\?\.heightM/);
  assert.match(selectionSource, /selectionBounds\?\.depthM/);
  assert.match(selectionSource, /Number\.isFinite\(centerY\) \? centerY : heightM \/ 2/);
});

test('TV 42 55 and 65 selection bounds follow the real rendered screen box', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  const start = source.indexOf('function createTvModule(');
  assert.ok(start >= 0);
  const finish = source.indexOf('\n}', start) + 2;
  const tvSource = source.slice(start, finish);

  assert.match(tvSource, /const widthM = Number\(moduleState\.screenWidthCm \|\| 93\) \/ 100/);
  assert.match(tvSource, /const heightM = Number\(moduleState\.screenHeightCm \|\| 52\.3\) \/ 100/);
  assert.match(tvSource, /group\.userData\.selectionBounds = Object\.freeze\(\{/);
  assert.match(tvSource, /widthM,\s+heightM,\s+depthM,/);
  assert.match(tvSource, /centerX: tv\.position\.x/);
  assert.match(tvSource, /centerY: tv\.position\.y/);
  assert.match(tvSource, /centerZ: tv\.position\.z/);

  const expected = {
    42: [0.93, 0.523],
    55: [1.218, 0.685],
    65: [1.439, 0.809],
  };
  for (const sizeInch of [42, 55, 65]) {
    const state = createTvModuleState(sizeInch);
    assert.deepEqual(
      [state.screenWidthCm / 100, state.screenHeightCm / 100],
      expected[sizeInch],
    );
  }
});

'''

test_path.write_text(test_text.replace(anchor, new_tests + anchor, 1), encoding='utf-8')
