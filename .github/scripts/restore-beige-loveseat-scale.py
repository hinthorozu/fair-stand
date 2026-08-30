from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')
old = "const sizeCorrection = isLoveseat ? 1 : 1.25;"
new = "const sizeCorrection = isLoveseat ? 1.50 : 1.25;"
if old not in s:
    raise SystemExit('loveseat scale source not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')
