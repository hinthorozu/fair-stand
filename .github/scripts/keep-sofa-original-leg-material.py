from pathlib import Path
p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')
old = "  const woodMaterial = sourceMaterial.clone();\n  woodMaterial.color?.set('#ffffff');\n  woodMaterial.userData = { ...(woodMaterial.userData || {}), sofaFixedWood: true };"
new = "  // Wooden legs must keep the GLB's original material exactly as authored.\n  // Do not change color, texture map, roughness, metalness or any other property.\n  const woodMaterial = sourceMaterial.clone();\n  woodMaterial.userData = { ...(woodMaterial.userData || {}), sofaFixedWood: true };"
if old not in s:
    raise SystemExit('wood material block not found')
s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')
