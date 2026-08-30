from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()
old = "rotationYDeg: -45.26002361732807"
new = "rotationYDeg: -45"
if old not in text:
    raise SystemExit('Expected loveseat rotation not found')
path.write_text(text.replace(old, new, 1))
