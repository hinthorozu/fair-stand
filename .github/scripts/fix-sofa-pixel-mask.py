from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text()
old = """    const isWood = (\n      r < 185\n      && g < 150\n      && b < 120\n      && r > g * 1.08\n      && g > b * 1.05\n      && r - b > 34\n    );"""
new = """    const isWood = (\n      r < 145\n      && g < 105\n      && b < 80\n      && r - g > 24\n      && g - b > 14\n      && r - b > 44\n    );"""
if old not in s:
    raise SystemExit('sofa wood mask block not found')
s = s.replace(old, new, 1)
p.write_text(s)
