from pathlib import Path

replacements = [
    ('furniture_bar_stool_2_DIMENSIONS', 'furniture_bar_stool_classic_DIMENSIONS'),
    ('furniture_bar_stool_2', 'furniture_bar_stool_classic'),
    ('createBarStool2ModuleState', 'createBarStoolModuleState'),
    ('createBarStool2Module', 'createBarStoolModule'),
    ('loadBarStool2Model', 'loadBarStoolModel'),
    ('barStool2ModelPromise', 'barStoolModelPromise'),
    ("'bar-stool-2'", "'bar-stool'"),
    ('"bar-stool-2"', '"bar-stool"'),
    ('Tabure 2', 'Bar Taburesi'),
]

changed = []
for root in ('src', 'test'):
    for path in Path(root).rglob('*.js'):
        text = path.read_text()
        new = text
        for old, replacement in replacements:
            new = new.replace(old, replacement)
        if new != text:
            path.write_text(new)
            changed.append(str(path))

attr_old = Path('public/models/TABURE_2_ATTRIBUTION.txt')
attr_new = Path('public/models/BAR_STOOL_ATTRIBUTION.txt')
if attr_old.exists():
    text = attr_old.read_text().replace('Tabure 2', 'Bar Taburesi')
    attr_new.write_text(text)
    attr_old.unlink()
    changed.extend([str(attr_old), str(attr_new)])

# Must keep the current GLB asset and fully remove the temporary Tabure 2 identity.
assert Path('public/models/bar_chair.glb').exists(), 'bar_chair.glb missing'
needles = ['furniture_bar_stool_2', 'bar-stool-2', 'createBarStool2ModuleState', 'createBarStool2Module', 'loadBarStool2Model', 'barStool2ModelPromise', 'Tabure 2']
for root in ('src', 'test'):
    for path in Path(root).rglob('*.js'):
        text = path.read_text()
        for needle in needles:
            if needle in text:
                raise SystemExit(f'leftover temporary stool identity: {path}: {needle}')

catalog = Path('src/catalog.js').read_text()
assert "furniture_bar_stool_classic: { type: 'bar-stool', widthCm: 60, depthCm: 55, heightCm: 121, label: 'Bar Taburesi' }" in catalog
assert "'furniture_bar_stool_classic'" in catalog
assert 'furniture_bar_stool_classic_DIMENSIONS' in catalog

scene = Path('src/scene3d.js').read_text()
assert "models/bar_chair.glb" in scene
assert "moduleState.type === 'bar-stool'" in scene

print('Renamed current GLB stool to classic identity:')
for path in changed:
    print(' -', path)
