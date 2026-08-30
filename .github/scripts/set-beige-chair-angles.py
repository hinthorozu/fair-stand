from pathlib import Path
p = Path('src/scene3d.js')
s = p.read_text()
repls = {
    'rotationYDeg: 50': 'rotationYDeg: 40',
    'rotationYDeg: 225.87685819627142': 'rotationYDeg: 225',
}
for old,new in repls.items():
    if old not in s:
        raise SystemExit(f'Expected source not found: {old}')
    s = s.replace(old,new,1)
p.write_text(s)
