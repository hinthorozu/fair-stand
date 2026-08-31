from pathlib import Path

# Drag catalog: Bar Taburesi starts facing forward (same orientation as one R turn / 90 deg).
p = Path('src/moduleDragSidebar.js')
s = p.read_text()
old = """        activeCard = card;\n        activeModuleState = state;\n        activeRotationZDeg = 0;\n        rotationLocked = false;\n"""
new = """        activeCard = card;\n        activeModuleState = state;\n        activeRotationZDeg = state.type === 'bar-stool' ? 90 : 0;\n        rotationLocked = false;\n"""
if old not in s:
    raise SystemExit('dragstart rotation block not found')
s = s.replace(old, new, 1)
p.write_text(s)

# Catalog append/add path: keep the same default orientation when not dragged.
p = Path('src/main.js')
s = p.read_text()
old = """      rotationZDeg: 0,\n      wallId: 'back',\n"""
new = """      rotationZDeg: moduleState.type === 'bar-stool' ? 90 : 0,\n      wallId: 'back',\n"""
if old not in s:
    raise SystemExit('catalog append placement rotation block not found')
s = s.replace(old, new, 1)
p.write_text(s)

print('Bar Taburesi default rotation set to 90 degrees (front-facing).')
