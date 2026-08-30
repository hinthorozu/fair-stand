from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()

replacements = {
    "rotationYDeg: 215.1154498349714": "rotationYDeg: 35.1154498349714",
    "rotationYDeg: 43.86311818640065": "rotationYDeg: 223.86311818640065",
    "const uniformScale = orientedSize.x > 0\n        ? placement.targetWidthM / orientedSize.x\n        : 1;": "const uniformScale = orientedSize.x > 0\n        ? (placement.targetWidthM / orientedSize.x) * 1.25\n        : 1.25;",
}

for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f'Expected source not found: {old}')
    text = text.replace(old, new, 1)

path.write_text(text)
