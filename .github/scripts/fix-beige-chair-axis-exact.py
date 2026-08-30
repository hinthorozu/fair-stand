from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()

replacements = {
    "rotationYDeg: -35.1154498349714": "rotationYDeg: 50.04262099354182",
    "rotationYDeg: 136.13688181359935": "rotationYDeg: 222.30991956271077",
}

for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Expected source not found: {old}')
    text = text.replace(old, new, 1)

path.write_text(text)
