from pathlib import Path
p=Path('src/scene3d.js')
s=p.read_text()
old="rotationYDeg: 54.62452654764247"
new="rotationYDeg: 45"
if old not in s: raise SystemExit('chair1 angle not found')
p.write_text(s.replace(old,new,1))
