from pathlib import Path
import re

# Remove the old procedural Bar Taburesi implementation while keeping Tabure 2 intact.

def replace(path, old, new, count=None):
    p = Path(path)
    text = p.read_text()
    n = text.count(old)
    if n == 0:
        raise SystemExit(f'pattern not found in {path}: {old[:80]!r}')
    if count is not None and n != count:
        raise SystemExit(f'unexpected occurrence count in {path}: {n} != {count}')
    p.write_text(text.replace(old, new))

# catalog.js: dimensions, catalog entry and key.
p = Path('src/catalog.js')
s = p.read_text()
s, n = re.subn(r"\nexport const furniture_bar_stool_classic_DIMENSIONS = Object\.freeze\(\{\n  widthCm: 50,\n  depthCm: 50,\n  heightCm: 80,\n\}\);\n", "\n", s, count=1)
if n != 1: raise SystemExit('old bar stool dimensions block not found')
s = s.replace("  furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 50, depthCm: 50, heightCm: 80, label: 'Bar Taburesi' },\n", "")
s = s.replace("  'furniture_bar_stool_classic',\n", "")
p.write_text(s)

# designState.js: state factory.
p = Path('src/designState.js')
s = p.read_text()
s, n = re.subn(r"\nexport function createBarStoolModuleState\(\) \{\n  return \{\n    id: createId\('module'\),\n    type: 'bar-stool',\n    widthCm: 50,\n    depthCm: 50,\n    heightCm: 80,\n    surface: \{\n      id: createId\('surface'\),\n      color: DEFAULT_PANEL_COLOR,\n    \},\n  \};\n\}\n", "\n", s, count=1)
if n != 1: raise SystemExit('old bar stool state factory not found')
p.write_text(s)

# main.js: remove import and catalog factory branch if present.
p = Path('src/main.js')
s = p.read_text()
s = re.sub(r"\s*createBarStoolModuleState,\n", "", s)
s = re.sub(r"\n\s*if \(catalogEntry\.type === 'bar-stool'\) return createBarStoolModuleState\(\);", "", s)
s = re.sub(r"\n\s*case 'bar-stool':\n\s*return createBarStoolModuleState\(\);", "", s)
p.write_text(s)

# scene3d.js: remove floor-fixture old type, label, dispatcher and whole renderer function.
p = Path('src/scene3d.js')
s = p.read_text()
s = s.replace("    || type === 'bar-stool'\n", "")
s = s.replace("    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';\n", "")
s = s.replace("      } else if (moduleState.type === 'bar-stool') {\n        module = createBarStoolModule(moduleState, moduleIndex);\n", "")
# Renderer lies immediately before createBarStool2Module in current source.
s, n = re.subn(r"\nfunction createBarStoolModule\(moduleState, moduleIndex\) \{.*?\n\}\n\n(?=function createBarStool2Module\()", "\n", s, count=1, flags=re.S)
if n != 1: raise SystemExit('old bar stool renderer block not found')
p.write_text(s)

# modulePlacement.js: old stool no longer participates in 10cm snap special-case.
p = Path('src/modulePlacement.js')
s = p.read_text()
s = s.replace(" || moduleType === 'bar-stool'", "")
p.write_text(s)

# Remove exact old-stool references from tests; keep Tabure 2 tests.
for path in Path('test').rglob('*.js'):
    text = path.read_text()
    original = text
    # Remove simple imports/spec entries/fixture cases that mention only the old id/type/factory.
    text = re.sub(r"^.*furniture_bar_stool_classic.*\n", "", text, flags=re.M)
    text = re.sub(r"^.*createBarStoolModuleState.*\n", "", text, flags=re.M)
    # Old bar-stool-only assertions/cases are obsolete; remove single lines. Multi-line leftovers are caught below.
    text = re.sub(r"^.*['\"]bar-stool['\"].*\n", "", text, flags=re.M)
    text = re.sub(r"^.*Bar Taburesi.*\n", "", text, flags=re.M)
    if text != original:
        path.write_text(text)

# Ensure no production reference to the old stool remains.
needles = ['furniture_bar_stool_classic', "'bar-stool'", '"bar-stool"', 'createBarStoolModuleState', 'createBarStoolModule(', 'Bar Taburesi']
for root in ['src']:
    for path in Path(root).rglob('*.js'):
        text = path.read_text()
        for needle in needles:
            if needle in text:
                raise SystemExit(f'leftover old bar stool reference: {path}: {needle}')

print('Old Bar Taburesi removed; Tabure 2 retained.')
