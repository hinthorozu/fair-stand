from pathlib import Path
import re

# Remove the old procedural Bar Taburesi implementation while keeping Tabure 2 intact.

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

# main.js: remove import and catalog factory branch.
p = Path('src/main.js')
s = p.read_text()
s = re.sub(r"^\s*createBarStoolModuleState,\n", "", s, flags=re.M)
s = s.replace("  else if (module.type === 'bar-stool') state = createBarStoolModuleState();\n", "")
s = re.sub(r"\n\s*if \(catalogEntry\.type === 'bar-stool'\) return createBarStoolModuleState\(\);", "", s)
s = re.sub(r"\n\s*case 'bar-stool':\n\s*return createBarStoolModuleState\(\);", "", s)
p.write_text(s)

# scene3d.js: remove floor-fixture old type, label, dispatcher and whole renderer function.
p = Path('src/scene3d.js')
s = p.read_text()
s = s.replace("    || type === 'bar-stool'\n", "")
s = s.replace("    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';\n", "")
s = s.replace("      } else if (moduleState.type === 'bar-stool') {\n        module = createBarStoolModule(moduleState, moduleIndex);\n", "")
s, n = re.subn(r"\nfunction createBarStoolModule\(moduleState, moduleIndex\) \{.*?\n\}\n+(?=function createBarStool2Module\()", "\n", s, count=1, flags=re.S)
if n != 1: raise SystemExit('old bar stool renderer block not found')
p.write_text(s)

# modulePlacement.js: old stool no longer participates in 10cm snap special-case.
p = Path('src/modulePlacement.js')
s = p.read_text().replace(" || moduleType === 'bar-stool'", "")
p.write_text(s)

# moduleDragSidebar.js: remove old stool-specific preview CSS and preview branch.
p = Path('src/moduleDragSidebar.js')
s = p.read_text()
s = ''.join(line for line in s.splitlines(keepends=True) if 'module-drag-bar-stool' not in line)
s, n = re.subn(r"\n  if \(module\.type === 'bar-stool'\) \{\n    const body = document\.createElement\('div'\);\n    preview\.appendChild\(body\);\n    return preview;\n  \}\n", "\n", s, count=1)
if n != 1: raise SystemExit('old bar stool sidebar preview branch not found')
p.write_text(s)

# Remove old-stool-only test references; keep Tabure 2 tests.
for path in Path('test').rglob('*.js'):
    text = path.read_text()
    original = text
    text = re.sub(r"^.*furniture_bar_stool_classic.*\n", "", text, flags=re.M)
    text = re.sub(r"^.*createBarStoolModuleState.*\n", "", text, flags=re.M)
    text = re.sub(r"^.*['\"]bar-stool['\"].*\n", "", text, flags=re.M)
    text = re.sub(r"^.*Bar Taburesi.*\n", "", text, flags=re.M)
    if text != original:
        path.write_text(text)

# Ensure no production/test reference to the old stool remains.
needles = ['furniture_bar_stool_classic', "'bar-stool'", '"bar-stool"', 'createBarStoolModuleState', 'createBarStoolModule(', 'Bar Taburesi', 'module-drag-bar-stool']
for root in ['src', 'test']:
    for path in Path(root).rglob('*.js'):
        text = path.read_text()
        for needle in needles:
            if needle in text:
                raise SystemExit(f'leftover old bar stool reference: {path}: {needle}')

print('Old Bar Taburesi removed; Tabure 2 retained.')
