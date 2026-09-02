from pathlib import Path

scene_path = Path('src/scene3d.js')
with scene_path.open('r', encoding='utf-8', newline='') as handle:
    raw = handle.read()
newline = '\r\n' if '\r\n' in raw else '\n'
scene = raw.replace('\r\n', '\n')

old = """  const backPanel = new THREE.Mesh(\n    new THREE.BoxGeometry(innerWidth, openingHeight, 0.018),\n    showcaseWhiteMaterial.clone(),\n  );\n  // Arka kapak modulun eski arka duzleminde degil, vitrinin 30 cm kasasinin\n  // en arka ucunda durur. 9 mm ofset panel kalinliginin merkezidir.\n  backPanel.position.set(0, openingCenterY, caseFrontZ - showcaseDepth + 0.009);\n  backPanel.receiveShadow = true;\n  group.add(backPanel);\n\n"""

count = scene.count(old)
if count != 1:
    raise SystemExit(f'expected exactly one showcase backPanel block, found {count}')
scene = scene.replace(old, '', 1)

with scene_path.open('w', encoding='utf-8', newline='') as handle:
    handle.write(scene.replace('\n', newline))

print('showcase rear panel removed; case remains open-backed')
