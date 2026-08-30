from pathlib import Path
import re

# Exact, structural cleanup only. Beige GLB sofa must remain intact.
def replace_all(path, old, new, minimum=1):
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count < minimum:
        raise SystemExit(f'{path}: expected at least {minimum} exact match, found {count}: {old[:90]!r}')
    p.write_text(text.replace(old, new))

# catalog.js
p = Path('src/catalog.js')
text = p.read_text()
text, n = re.subn(
    r"\nexport const furniture_sofa_set_classic_DIMENSIONS = Object\.freeze\(\{\n(?:.*\n)*?\}\);\n",
    "\n", text, count=1,
)
if n != 1: raise SystemExit(f'src/catalog.js: classic dimensions removals={n}')
text, n = re.subn(r"^\s*furniture_sofa_set_classic:\s*\{[^\n]*\},\n", "", text, count=1, flags=re.M)
if n != 1: raise SystemExit(f'src/catalog.js: classic catalog item removals={n}')
text, n = re.subn(r"^\s*'furniture_sofa_set_classic',\s*\n", "", text, count=1, flags=re.M)
if n != 1: raise SystemExit(f'src/catalog.js: classic catalog key removals={n}')
p.write_text(text)

# designState.js
p = Path('src/designState.js')
text = p.read_text()
start = text.find('export function createSofaSetModuleState() {')
end = text.find('export function createBeigeSofaSetModuleState() {', start)
if start < 0 or end < 0: raise SystemExit('src/designState.js: legacy sofa state boundaries not found')
p.write_text(text[:start] + text[end:])

# Placement/sidebar shared furniture behavior.
replace_all('src/modulePlacement.js', "moduleType === 'sofa-set' || moduleType === 'sofa-set-beige'", "moduleType === 'sofa-set-beige'")
replace_all('src/moduleDragSidebar.js', "module.type === 'sofa-set' || module.type === 'sofa-set-beige'", "module.type === 'sofa-set-beige'")

# Context menu label.
replace_all('src/moduleContextMenu.js', "  'sofa-set': 'Koltuk Takımı',\n", '')

# main.js: import, selection info, catalog factory branch.
p = Path('src/main.js')
text = p.read_text()
for old in [
    '  createSofaSetModuleState,\n',
    "      if (moduleType === 'sofa-set') {\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Koltuk Takımı · koltuk döşeme rengi değiştirilebilir · cam sehpa sabittir.';\n        return;\n      }\n\n",
    "  else if (module.type === 'sofa-set') state = createSofaSetModuleState();\n",
]:
    if old not in text: raise SystemExit(f'src/main.js: exact legacy block not found: {old[:80]!r}')
    text = text.replace(old, '', 1)
p.write_text(text)

# scene3d.js: floor fixture term, procedural renderer, dispatcher, labels/previews.
p = Path('src/scene3d.js')
text = p.read_text()
old = "    || type === 'sofa-set'\n    || type === 'sofa-set-beige'"
if old not in text: raise SystemExit('src/scene3d.js: floor fixture legacy term not found')
text = text.replace(old, "    || type === 'sofa-set-beige'", 1)
start = text.find('function createSofaSetModule(moduleState, moduleIndex) {')
end = text.find('function createBaseModule(moduleState, moduleIndex, onSurfaceReady) {', start)
if start < 0 or end < 0: raise SystemExit('src/scene3d.js: legacy renderer boundaries not found')
text = text[:start] + text[end:]
old = "      } else if (moduleState.type === 'sofa-set') {\n        module = createSofaSetModule(moduleState, moduleIndex);\n"
if old not in text: raise SystemExit('src/scene3d.js: legacy dispatcher branch not found')
text = text.replace(old, '', 1)
old = "    if (moduleState?.type === 'sofa-set') return 'Koltuk Takımı';\n"
if old not in text: raise SystemExit('src/scene3d.js: legacy drag label not found')
text = text.replace(old, '', 1)
old = "(moduleState?.type === 'sofa-set' || moduleState?.type === 'sofa-set-beige')"
count = text.count(old)
if count != 2: raise SystemExit(f'src/scene3d.js: expected 2 legacy preview conditions, found {count}')
text = text.replace(old, "moduleState?.type === 'sofa-set-beige'")
p.write_text(text)

# Delete dedicated old-sofa test.
legacy_test = Path('test/sofaSet.test.js')
if not legacy_test.exists(): raise SystemExit('test/sofaSet.test.js: expected legacy test file not found')
legacy_test.unlink()

# Existing generic furniture placement test should now exercise beige sofa.
replace_all('test/modulePlacement.test.js', "getModulePlacementSnapCm('sofa-set')", "getModulePlacementSnapCm('sofa-set-beige')")
replace_all('test/modulePlacement.test.js', "['sofa-set', 'table-chair-set-eames']", "['sofa-set-beige', 'table-chair-set-eames']")

# Documentation: remove the whole legacy sofa section including its old constants.
p = Path('SYSTEM_MODULE_CATALOG.md')
text = p.read_text()
start = text.find('## `furniture_sofa_set_classic`')
end = text.find('## `furniture_table_chair_set_minyon`', start)
if start < 0 or end < 0: raise SystemExit('SYSTEM_MODULE_CATALOG.md: legacy sofa section boundaries not found')
text = text[:start] + text[end:]
p.write_text(text)

# Historical one-shot workflows must not preserve/reintroduce the deleted ID.
replace_all('.github/workflows/fix-furniture-ids.yml', "              'moble_sofa_set_classic': 'furniture_sofa_set_classic',\n", '')
replace_all('.github/workflows/unify-module-catalog.yml', "              'furniture_sofa_set_classic',\n", '')
replace_all('.github/workflows/unify-module-catalog.yml', "          for obsolete in ['moble_sofa_set_classic','moble_table_chair_set_minyon','moble_bar_stool_classic']:\n", "          for obsolete in ['moble_table_chair_set_minyon','moble_bar_stool_classic']:\n")
replace_all('.github/workflows/rename-counter-ids.yml', "              'SOFA_SET': 'moble_sofa_set_classic',\n", '')

# Hard guard across the whole repo (temporary cleanup helper/workflow excluded because
# they necessarily contain the search terms and are deleted before final commit).
forbidden = [
    re.compile(r'sofa_set_classic'),
    re.compile(r'createSofaSetModule(?:State)?'),
    re.compile(r"(?<![A-Za-z0-9_-])['\"]sofa-set['\"](?![A-Za-z0-9_-])"),
]
exclude = {'.github/scripts/remove-classic-sofa.py', '.github/workflows/remove-classic-sofa.yml'}
residuals = []
for path in Path('.').rglob('*'):
    if not path.is_file() or '.git' in path.parts or str(path) in exclude:
        continue
    try: data = path.read_text()
    except (UnicodeDecodeError, OSError): continue
    for rx in forbidden:
        for match in rx.finditer(data):
            line = data.count('\n', 0, match.start()) + 1
            residuals.append(f'{path}:{line}: {match.group(0)}')
if residuals:
    print('LEGACY SOFA RESIDUALS:')
    print('\n'.join(residuals))
    raise SystemExit(2)

# Beige GLB contract must survive the purge.
required = {
    'src/catalog.js': ['furniture_sofa_set_beige', "type: 'sofa-set-beige'"],
    'src/designState.js': ['createBeigeSofaSetModuleState', "type: 'sofa-set-beige'"],
    'src/scene3d.js': ['createBeigeSofaSetModule', 'bej_koltuk_1_ciftli_2_tekli.glb'],
}
for filename, needles in required.items():
    data = Path(filename).read_text()
    for needle in needles:
        if needle not in data: raise SystemExit(f'{filename}: beige sofa contract missing: {needle}')

print('Legacy sofa purge guard: clean')
