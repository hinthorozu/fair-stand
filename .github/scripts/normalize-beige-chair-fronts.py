from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()
replacements = {
    'rotationYDeg: 45': 'rotationYDeg: 54.62452654764247',
    'rotationYDeg: 225': 'rotationYDeg: 225.87685819627142',
}
for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Expected source not found: {old}')
    text = text.replace(old, new, 1)
path.write_text(text)
