from pathlib import Path
p=Path('src/scene3d.js')
lines=p.read_text().splitlines()
for i,line in enumerate(lines):
    if 'colorTargets' in line or 'surfaceState.color' in line or 'applyColor' in line or 'setSurfaceColor' in line:
        lo=max(0,i-8); hi=min(len(lines),i+12)
        print(f'--- {lo+1}-{hi} ---')
        for j in range(lo,hi): print(f'{j+1}: {lines[j]}')
