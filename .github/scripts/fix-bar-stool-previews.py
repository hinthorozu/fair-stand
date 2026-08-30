from pathlib import Path

# 1) Sidebar catalog card: render a chair/stool silhouette instead of the generic wall panel.
p = Path('src/moduleDragSidebar.js')
s = p.read_text()
css_anchor = "    .module-drag-table-chair::after { content:''; position:absolute; left:4px; top:4px; width:13px; height:13px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:4px; background:#f8fafc; box-shadow:37px 0 0 -2px #f8fafc,37px 0 0 0 ${ALUMINUM_PROFILE_COLOR},0 37px 0 -2px #f8fafc,0 37px 0 0 ${ALUMINUM_PROFILE_COLOR},37px 37px 0 -2px #f8fafc,37px 37px 0 0 ${ALUMINUM_PROFILE_COLOR}; }\n"
css_insert = css_anchor + "    .module-drag-bar-stool { position:relative; width:46px; height:62px; }\n    .module-drag-bar-stool::before { content:''; position:absolute; left:8px; top:5px; width:30px; height:25px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:9px 9px 5px 5px; background:#ffffff; box-shadow:0 2px 4px rgba(15,23,42,.08); }\n    .module-drag-bar-stool::after { content:''; position:absolute; left:10px; top:31px; width:26px; height:6px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:3px; background:#ffffff; box-shadow:-2px 9px 0 -2px ${ALUMINUM_PROFILE_COLOR},20px 9px 0 -2px ${ALUMINUM_PROFILE_COLOR},-4px 20px 0 -2px ${ALUMINUM_PROFILE_COLOR},22px 20px 0 -2px ${ALUMINUM_PROFILE_COLOR}; }\n"
if '.module-drag-bar-stool {' not in s:
    if css_anchor not in s: raise SystemExit('sidebar css anchor not found')
    s = s.replace(css_anchor, css_insert, 1)
branch_anchor = "  if (module.type === 'table-chair-set-eames') {\n    const body = document.createElement('div');\n    body.className = 'module-drag-table-chair';\n    preview.appendChild(body);\n    return preview;\n  }\n\n"
branch_insert = branch_anchor + "  if (module.type === 'bar-stool') {\n    const body = document.createElement('div');\n    body.className = 'module-drag-bar-stool';\n    preview.appendChild(body);\n    return preview;\n  }\n\n"
if "body.className = 'module-drag-bar-stool';" not in s:
    if branch_anchor not in s: raise SystemExit('sidebar preview anchor not found')
    s = s.replace(branch_anchor, branch_insert, 1)
p.write_text(s)

# 2) Scene drag badge: never call the GLB stool a Düz Panel.
p = Path('src/scene3d.js')
s = p.read_text()
label_anchor = "    if (moduleState?.type === 'showcase-2') return `2 Gözlü Vitrin ${widthCm}`;\n    return `Düz Panel ${widthCm}`;"
label_replace = "    if (moduleState?.type === 'showcase-2') return `2 Gözlü Vitrin ${widthCm}`;\n    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';\n    return `Düz Panel ${widthCm}`;"
if "if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';" not in s:
    if label_anchor not in s: raise SystemExit('drag label anchor not found')
    s = s.replace(label_anchor, label_replace, 1)

# 3) Scene placement ghost: for bar-stool show a simple chair silhouette instead of a full green cuboid.
key_old = "    const key = [dimensions.widthCm, dimensions.depthM, dimensions.heightM].join(':');"
key_new = "    const key = [moduleOrWidthCm?.type ?? 'generic', dimensions.widthCm, dimensions.depthM, dimensions.heightM].join(':');"
if key_old in s:
    s = s.replace(key_old, key_new, 1)

root_anchor = "    const root = new THREE.Group();\n    const mesh = new THREE.Mesh(\n      new THREE.BoxGeometry("
if "// Bar Taburesi uses a chair-shaped placement ghost" not in s:
    if root_anchor not in s: raise SystemExit('placement ghost anchor not found')
    special = "    const root = new THREE.Group();\n\n    // Bar Taburesi uses a chair-shaped placement ghost so drag feedback matches the GLB module.\n    if (moduleOrWidthCm?.type === 'bar-stool') {\n      const material = new THREE.MeshBasicMaterial({\n        color: PLACEMENT_VALID_COLOR,\n        transparent: true,\n        opacity: PLACEMENT_GHOST_OPACITY,\n        depthWrite: false,\n        depthTest: false,\n        side: THREE.DoubleSide,\n      });\n      const parts = [];\n      const addBox = (w, h, d, x, y, z) => {\n        const part = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);\n        part.position.set(x, y, z);\n        part.renderOrder = 10000;\n        root.add(part);\n        parts.push(part);\n        return part;\n      };\n      const widthM = Math.max(dimensions.widthCm / 100, 0.60);\n      const depthM = Math.max(dimensions.depthM, 0.55);\n      const heightM = Math.max(dimensions.heightM, 1.21);\n      const seatY = Math.min(heightM * 0.66, 0.80);\n      const seat = addBox(widthM * 0.72, 0.09, depthM * 0.66, 0, seatY, 0.02);\n      addBox(widthM * 0.70, Math.max(heightM - seatY - 0.08, 0.28), 0.08, 0, seatY + (heightM - seatY) / 2, -depthM * 0.28);\n      const legH = Math.max(seatY - 0.06, 0.45);\n      const legX = widthM * 0.26;\n      const legZ = depthM * 0.23;\n      [[-legX,-legZ],[legX,-legZ],[-legX,legZ],[legX,legZ]].forEach(([x,z]) => addBox(0.045, legH, 0.045, x, legH / 2, z));\n      scene.add(root);\n      placementGhost = { root, mesh: seat, key, widthCm: dimensions.widthCm };\n      return placementGhost;\n    }\n\n    const mesh = new THREE.Mesh(\n      new THREE.BoxGeometry("
    s = s.replace(root_anchor, special, 1)

p.write_text(s)

print('Bar stool catalog and drag previews fixed.')
