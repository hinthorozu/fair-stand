from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')

old_scale = "const sizeCorrection = isLoveseat ? 1.50 : 1.25;"
new_scale = "const sizeCorrection = isLoveseat ? 1.40 : 1.25;"
if old_scale not in s:
    raise SystemExit('loveseat scale source not found')
s = s.replace(old_scale, new_scale, 1)

old_top = "tableTop.position.set(0, 0.38, 0);"
new_top = "tableTop.position.set(0, 0.38, 0.10);"
old_stem = "tableStem.position.set(0, 0.19, 0);"
new_stem = "tableStem.position.set(0, 0.19, 0.10);"
old_base = "tableBase.position.set(0, 0.018, 0);"
new_base = "tableBase.position.set(0, 0.018, 0.10);"

for old, new, label in [
    (old_top, new_top, 'table top'),
    (old_stem, new_stem, 'table stem'),
    (old_base, new_base, 'table base'),
]:
    if old not in s:
        raise SystemExit(f'{label} source not found')
    s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')
