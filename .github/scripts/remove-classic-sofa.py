from pathlib import Path
import re

# Remove only structurally known legacy-sofa blocks/references. Never delete arbitrary
# lines just because they contain "sofa-set"; beige uses the same prefix.

def replace_all(path, old, new, minimum=1):
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count < minimum:
        raise SystemExit(f'{path}: expected at least {minimum} exact match, found {count}: {old[:80]!r}')
    p.write_text(text.replace(old, new))

# catalog.js: dimensions, catalog item and exposed key.
p = Path('src/catalog.js')
text = p.read_text()
text, n = re.subn(
    r"\nexport const furniture_sofa_set_classic_DIMENSIONS = Object\.freeze\(\{\n(?:.*\n)*?\}\);\n",
    "\n",
    text,
    count=1,
)
if n != 1:
    raise SystemExit(f'src/catalog.js: classic dimensions removals={n}')
text, n = re.subn(r"^\s*furniture_sofa_set_classic:\s*\{[^\n]*\},\n", "", text, count=1, flags=re.M)
if n != 1:
    raise SystemExit(f'src/catalog.js: classic catalog item removals={n}')
text, n = re.subn(r"^\s*'furniture_sofa_set_classic',\s*\n", "", text, count=1, flags=re.M)
if n != 1:
    raise SystemExit(f'src/catalog.js: classic catalog key removals={n}')
p.write_text(text)

# designState.js: remove only the complete legacy state factory.
p = Path('src/designState.js')
text = p.read_text()
start = text.find('export function createSofaSetModuleState() {')
end = text.find('export function createBeigeSofaSetModuleState() {', start)
if start < 0 or end < 0:
    raise SystemExit('src/designState.js: legacy sofa state boundaries not found')
p.write_text(text[:start] + text[end:])

# Placement/sidebar: keep beige and other furniture behavior, remove only the legacy OR term.
replace_all(
    'src/modulePlacement.js',
    "moduleType === 'sofa-set' || moduleType === 'sofa-set-beige'",
    "moduleType === 'sofa-set-beige'",
)
replace_all(
    'src/moduleDragSidebar.js',
    "module.type === 'sofa-set' || module.type === 'sofa-set-beige'",
    "module.type === 'sofa-set-beige'",
)

# scene3d.js: remove the complete procedural legacy renderer.
p = Path('src/scene3d.js')
text = p.read_text()
start = text.find('function createSofaSetModule(moduleState, moduleIndex) {')
end = text.find('function createBaseModule(moduleState, moduleIndex, onSurfaceReady) {', start)
if start < 0 or end < 0:
    raise SystemExit('src/scene3d.js: legacy renderer boundaries not found')
text = text[:start] + text[end:]

# Remove only complete dispatcher branches that call the deleted renderer.
patterns = [
    r"\n\s*if \(moduleState\.type === ['\"]sofa-set['\"]\) \{\n\s*return createSofaSetModule\(moduleState, moduleIndex\);\n\s*\}\n",
    r"\n\s*else if \(moduleState\.type === ['\"]sofa-set['\"]\) \{\n\s*return createSofaSetModule\(moduleState, moduleIndex\);\n\s*\}\n",
    r"\n\s*if \(moduleState\.type === ['\"]sofa-set['\"]\) return createSofaSetModule\(moduleState, moduleIndex\);\n",
    r"\n\s*else if \(moduleState\.type === ['\"]sofa-set['\"]\) return createSofaSetModule\(moduleState, moduleIndex\);\n",
    r"\n\s*case ['\"]sofa-set['\"]:\s*return createSofaSetModule\(moduleState, moduleIndex\);\n",
]
for pattern in patterns:
    text = re.sub(pattern, '\n', text)
p.write_text(text)

# The old sofa contract test belongs to the deleted module, not the beige GLB module.
legacy_test = Path('test/sofaSet.test.js')
if not legacy_test.exists():
    raise SystemExit('test/sofaSet.test.js: expected legacy test file not found')
legacy_test.unlink()

# Hard guard across the whole tracked working tree (excluding this temporary cleanup helper).
# No legacy ID, state/renderer symbol, or exact legacy type may remain anywhere.
forbidden = [
    re.compile(r'furniture_sofa_set_classic'),
    re.compile(r'createSofaSetModule(?:State)?'),
    re.compile(r"(?<![A-Za-z0-9_-])['\"]sofa-set['\"](?![A-Za-z0-9_-])"),
]
exclude = {
    '.github/scripts/remove-classic-sofa.py',
    '.github/workflows/remove-classic-sofa.yml',
}
residuals = []
for path in Path('.').rglob('*'):
    if not path.is_file() or '.git' in path.parts or str(path) in exclude:
        continue
    try:
        data = path.read_text()
    except (UnicodeDecodeError, OSError):
        continue
    for rx in forbidden:
        for match in rx.finditer(data):
            line = data.count('\n', 0, match.start()) + 1
            residuals.append(f'{path}:{line}: {match.group(0)}')
if residuals:
    print('LEGACY SOFA RESIDUALS:')
    print('\n'.join(residuals))
    raise SystemExit(2)

# Beige GLB contract must still exist.
required = {
    'src/catalog.js': ['furniture_sofa_set_beige', "type: 'sofa-set-beige'"],
    'src/designState.js': ['createBeigeSofaSetModuleState', "type: 'sofa-set-beige'"],
    'src/scene3d.js': ['createBeigeSofaSetModule', 'bej_koltuk_1_ciftli_2_tekli.glb'],
}
for filename, needles in required.items():
    data = Path(filename).read_text()
    for needle in needles:
        if needle not in data:
            raise SystemExit(f'{filename}: beige sofa contract missing: {needle}')

print('Legacy sofa purge guard: clean')
