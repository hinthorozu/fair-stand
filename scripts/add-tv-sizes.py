from pathlib import Path

# catalog.js
p = Path('src/catalog.js')
s = p.read_text()
s = s.replace("export const TV_42_DIMENSIONS = Object.freeze({\n  moduleWidthCm: 100,\n  screenWidthCm: 93.0,\n  screenHeightCm: 52.3,\n  heightCm: 350,\n});", """export const TV_DIMENSIONS = Object.freeze({
  42: Object.freeze({ moduleWidthCm: 100, screenWidthCm: 93.0, screenHeightCm: 52.3 }),
  55: Object.freeze({ moduleWidthCm: 130, screenWidthCm: 121.8, screenHeightCm: 68.5 }),
  65: Object.freeze({ moduleWidthCm: 150, screenWidthCm: 143.9, screenHeightCm: 80.9 }),
});

export const TV_42_DIMENSIONS = Object.freeze({
  ...TV_DIMENSIONS[42],
  heightCm: 350,
});

export const TV_55_DIMENSIONS = Object.freeze({
  ...TV_DIMENSIONS[55],
  heightCm: 350,
});

export const TV_65_DIMENSIONS = Object.freeze({
  ...TV_DIMENSIONS[65],
  heightCm: 350,
});""")
s = s.replace("  TV_42: { type: 'tv', widthCm: 100, heightCm: 350, screenWidthCm: 93.0, screenHeightCm: 52.3, sizeInch: 42, label: 'TV 42\\\"' },", """  TV_42: { type: 'tv', widthCm: 100, heightCm: 350, screenWidthCm: 93.0, screenHeightCm: 52.3, sizeInch: 42, label: 'TV 42\\"' },
  TV_55: { type: 'tv', widthCm: 130, heightCm: 350, screenWidthCm: 121.8, screenHeightCm: 68.5, sizeInch: 55, label: 'TV 55\\"' },
  TV_65: { type: 'tv', widthCm: 150, heightCm: 350, screenWidthCm: 143.9, screenHeightCm: 80.9, sizeInch: 65, label: 'TV 65\\"' },""")
s = s.replace("  'TV_42',\n  'LED_FLOODLIGHT',", "  'TV_42',\n  'TV_55',\n  'TV_65',\n  'LED_FLOODLIGHT',")
p.write_text(s)

# designState.js
p = Path('src/designState.js')
s = p.read_text()
old = """export function createTvModuleState(sizeInch = 42) {
  if (Number(sizeInch) !== 42) return null;
  return {
    id: createId('module'),
    type: 'tv',
    widthCm: 100,
    depthCm: 6,
    heightCm: 52.3,
    sizeInch: 42,
    screenWidthCm: 93.0,
    screenHeightCm: 52.3,
  };
}"""
new = """export function createTvModuleState(sizeInch = 42) {
  const size = Number(sizeInch);
  const dimensions = {
    42: { widthCm: 100, screenWidthCm: 93.0, screenHeightCm: 52.3 },
    55: { widthCm: 130, screenWidthCm: 121.8, screenHeightCm: 68.5 },
    65: { widthCm: 150, screenWidthCm: 143.9, screenHeightCm: 80.9 },
  }[size];
  if (!dimensions) return null;
  return {
    id: createId('module'),
    type: 'tv',
    widthCm: dimensions.widthCm,
    depthCm: 6,
    heightCm: dimensions.screenHeightCm,
    sizeInch: size,
    screenWidthCm: dimensions.screenWidthCm,
    screenHeightCm: dimensions.screenHeightCm,
  };
}"""
if old not in s:
    raise SystemExit('designState TV block not found')
s = s.replace(old, new)
p.write_text(s)

# scene3d.js: dynamic ghost size + dynamic drag label
p = Path('src/scene3d.js')
s = p.read_text()
s = s.replace("      new THREE.BoxGeometry(0.93, 0.523, 0.05),", "      new THREE.BoxGeometry(\n        Math.max(Number(moduleState?.screenWidthCm) || 93, 1) / 100,\n        Math.max(Number(moduleState?.screenHeightCm) || 52.3, 1) / 100,\n        0.05,\n      ),")
s = s.replace("    if (moduleState?.type === 'tv') return 'TV 42\\\"';", "    if (moduleState?.type === 'tv') return `TV ${Number(moduleState.sizeInch) || 42}\\\"`;" )
p.write_text(s)

# tests
p = Path('test/tv42Module.test.js')
s = p.read_text()
insert = """

test('TV 55 and 65 catalog/state dimensions are available', () => {
  const tv55 = MODULE_CATALOG.TV_55;
  const tv65 = MODULE_CATALOG.TV_65;
  assert.deepEqual(
    [tv55.widthCm, tv55.screenWidthCm, tv55.screenHeightCm, tv55.sizeInch],
    [130, 121.8, 68.5, 55],
  );
  assert.deepEqual(
    [tv65.widthCm, tv65.screenWidthCm, tv65.screenHeightCm, tv65.sizeInch],
    [150, 143.9, 80.9, 65],
  );

  const state55 = createTvModuleState(55);
  const state65 = createTvModuleState(65);
  assert.deepEqual(
    [state55.widthCm, state55.screenWidthCm, state55.screenHeightCm, state55.sizeInch],
    [130, 121.8, 68.5, 55],
  );
  assert.deepEqual(
    [state65.widthCm, state65.screenWidthCm, state65.screenHeightCm, state65.sizeInch],
    [150, 143.9, 80.9, 65],
  );
  assert.equal(createTvModuleState(50), null);
});

test('TV placement ghost scales from the selected TV screen dimensions', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /moduleState\?\.screenWidthCm/);
  assert.match(source, /moduleState\?\.screenHeightCm/);
  assert.doesNotMatch(source, /new THREE\.BoxGeometry\(0\.93, 0\.523, 0\.05\)/);
  assert.match(source, /TV \$\{Number\(moduleState\.sizeInch\) \|\| 42\}/);
});
"""
s += insert
p.write_text(s)
