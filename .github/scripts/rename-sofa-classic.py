from pathlib import Path

replacements = {
    'furniture_sofa_set_beige': 'furniture_sofa_set_classic',
    'sofa-set-beige': 'sofa-set-classic',
}

changed = []
for root in (Path('src'), Path('test')):
    if not root.exists():
        continue
    for path in root.rglob('*'):
        if not path.is_file() or path.suffix not in {'.js', '.ts', '.json', '.html', '.css'}:
            continue
        text = path.read_text(encoding='utf-8')
        original = text
        for old, new in replacements.items():
            text = text.replace(old, new)
        if text != original:
            path.write_text(text, encoding='utf-8')
            changed.append(str(path))

if not changed:
    raise SystemExit('no sofa id occurrences changed')

for root in (Path('src'), Path('test')):
    if not root.exists():
        continue
    for path in root.rglob('*'):
        if not path.is_file() or path.suffix not in {'.js', '.ts', '.json', '.html', '.css'}:
            continue
        text = path.read_text(encoding='utf-8')
        if 'furniture_sofa_set_beige' in text or 'sofa-set-beige' in text:
            raise SystemExit(f'old sofa id remains in {path}')

print('changed files:')
for path in changed:
    print(path)
