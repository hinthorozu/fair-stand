from pathlib import Path

source_path = Path('src/rectSelection.js')
test_path = Path('test/rectSelection.test.js')

source = source_path.read_text(encoding='utf-8')
tests = test_path.read_text(encoding='utf-8')

old = "export function createConnectedPanelModulePath(modules, anchorModuleId, targetModuleId, toleranceCm = 0.5) {"
new = "export function createConnectedPanelModulePath(modules, anchorModuleId, targetModuleId, toleranceCm = 10.5) {"
if old not in source:
    raise SystemExit('connected panel path signature not found')
source = source.replace(old, new, 1)

marker = "test('does not bridge separate free-panel rows', () => {"
if marker not in tests:
    raise SystemExit('rect selection tests marker not found')

extra = r'''

test('connects a visually joined free-panel corner within panel-depth tolerance', () => {
  const result = createConnectedPanelModulePath([
    { moduleId: 'front-a', axis: 'x', startCm: 100, endCm: 200, crossCm: 300 },
    { moduleId: 'front-b', axis: 'x', startCm: 200, endCm: 300, crossCm: 300 },
    // The perpendicular row is physically touching the 10 cm wall body, but its
    // logical center line is offset by 10 cm from the horizontal endpoint.
    { moduleId: 'right-a', axis: 'y', startCm: 310, endCm: 410, crossCm: 300 },
  ], 'front-a', 'right-a');

  assert.equal(result.ok, true);
  assert.deepEqual(result.moduleIds, ['front-a', 'front-b', 'right-a']);
});

test('does not bridge free-panel rows farther apart than panel depth', () => {
  const result = createConnectedPanelModulePath([
    { moduleId: 'front', axis: 'x', startCm: 0, endCm: 100, crossCm: 300 },
    { moduleId: 'separate', axis: 'x', startCm: 100, endCm: 200, crossCm: 312 },
  ], 'front', 'separate');

  assert.equal(result.ok, false);
  assert.deepEqual(result.moduleIds, []);
});
'''

if "connects a visually joined free-panel corner within panel-depth tolerance" not in tests:
    tests = tests.rstrip() + extra + "\n"

source_path.write_text(source, encoding='utf-8')
test_path.write_text(tests, encoding='utf-8')
