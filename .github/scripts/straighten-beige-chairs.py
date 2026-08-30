from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()

replacements = {
    'rotationYDeg: 27.626697776198': 'rotationYDeg: -35.1154498349714',
    'rotationYDeg: 239.4181285132277': 'rotationYDeg: 136.13688181359935',
}

for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Expected source not found: {old}')
    text = text.replace(old, new, 1)

path.write_text(text)
