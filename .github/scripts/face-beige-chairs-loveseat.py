from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()
replacements = {
    'rotationYDeg: 50.04262099354182': 'rotationYDeg: 45',
    'rotationYDeg: 222.30991956271077': 'rotationYDeg: 225',
}
for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Expected source not found: {old}')
    text = text.replace(old, new, 1)
path.write_text(text)
