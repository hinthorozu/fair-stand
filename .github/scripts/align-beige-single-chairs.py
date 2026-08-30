from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()
old = "rotationYDeg: 35.1154498349714"
new = "rotationYDeg: 12.07168744937095"
if old not in text:
    raise SystemExit('Expected chair1 rotation not found')
text = text.replace(old, new, 1)
path.write_text(text)
