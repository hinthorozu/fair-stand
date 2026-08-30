from pathlib import Path
p=Path('src/scene3d.js')
s=p.read_text()
old="const loveseatSizeCorrection = isLoveseat ? 1.50 : 1;"
new="const loveseatSizeCorrection = isLoveseat ? 1.50 : 1.25;"
if old not in s: raise SystemExit('scale correction source not found')
p.write_text(s.replace(old,new,1))
