from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text()

s = s.replace('rotationYDeg: -135.26002361732807', 'rotationYDeg: -45.26002361732807', 1)

old = """      const uniformScale = orientedSize.x > 0
        ? (placement.targetWidthM / orientedSize.x)
        : 1;
"""
new = """      const isLoveseat = placement.meshName === 'beigechair2seatsofa_tripo_mat_0691346e_0';
      const loveseatSizeCorrection = isLoveseat ? 1.50 : 1;
      const uniformScale = orientedSize.x > 0
        ? (placement.targetWidthM / orientedSize.x) * loveseatSizeCorrection
        : loveseatSizeCorrection;
"""

if old not in s:
    raise SystemExit('uniform scale block not found')

p.write_text(s.replace(old, new, 1))
