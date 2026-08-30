from pathlib import Path
import re

# 1) Restore the exact historical Bar Taburesi catalog icon.
p = Path('src/moduleDragSidebar.js')
s = p.read_text()
old_css = re.search(r"    \.module-drag-bar-stool \{.*?\n    \.module-drag-bar-stool::after \{.*?\n", s, flags=re.S)
if not old_css:
    raise SystemExit('current bar stool icon css not found')
historical_css = """    .module-drag-bar-stool { position:relative; width:44px; height:58px; }\n    .module-drag-bar-stool::before { content:''; position:absolute; left:8px; top:4px; width:28px; height:20px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:10px 10px 5px 5px; background:#f8fafc; }\n    .module-drag-bar-stool::after { content:''; position:absolute; left:11px; top:24px; width:22px; height:27px; border-left:3px solid ${ALUMINUM_PROFILE_COLOR}; border-right:3px solid ${ALUMINUM_PROFILE_COLOR}; border-bottom:3px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:0 0 10px 10px; }\n"""
s = s[:old_css.start()] + historical_css + s[old_css.end():]
p.write_text(s)

# 2) Replace procedural stool placement ghost with the actual GLB geometry.
p = Path('src/scene3d.js')
s = p.read_text()

old_dispose = """  function disposePlacementGhost() {\n    if (!placementGhost) return;\n    scene.remove(placementGhost.root);\n    placementGhost.mesh.geometry?.dispose?.();\n    placementGhost.mesh.material?.dispose?.();\n    placementGhost = null;\n  }\n"""
new_dispose = """  function disposePlacementGhost() {\n    if (!placementGhost) return;\n    scene.remove(placementGhost.root);\n    if (placementGhost.ownsGeometry) placementGhost.mesh?.geometry?.dispose?.();\n    placementGhost.mesh?.material?.dispose?.();\n    placementGhost.tintMaterials?.forEach((material) => material?.dispose?.());\n    placementGhost = null;\n  }\n"""
if old_dispose not in s:
    raise SystemExit('disposePlacementGhost block not found')
s = s.replace(old_dispose, new_dispose, 1)

pattern = re.compile(r"    // Bar Taburesi uses a chair-shaped placement ghost so drag feedback matches the GLB module\.\n    if \(moduleOrWidthCm\?\.type === 'bar-stool'\) \{.*?\n      return placementGhost;\n    \}\n", re.S)
match = pattern.search(s)
if not match:
    raise SystemExit('procedural bar stool ghost block not found')
new_block = """    // Bar Taburesi uses the actual GLB geometry as its placement ghost.\n    if (moduleOrWidthCm?.type === 'bar-stool') {\n      const proxy = new THREE.Mesh(\n        new THREE.BoxGeometry(\n          Math.max(dimensions.widthCm / 100, 0.02),\n          dimensions.heightM,\n          dimensions.depthM,\n        ),\n        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),\n      );\n      proxy.position.y = dimensions.heightM / 2;\n      root.add(proxy);\n      scene.add(root);\n\n      const tintMaterials = [];\n      placementGhost = {\n        root,\n        mesh: proxy,\n        tintMaterials,\n        key,\n        widthCm: dimensions.widthCm,\n        ownsGeometry: true,\n        colorHex: PLACEMENT_VALID_COLOR,\n      };\n\n      loadBarStoolModel().then((template) => {\n        if (placementGhost?.key !== key || placementGhost.root !== root) return;\n        const chair = template.clone(true);\n        chair.traverse((object) => {\n          if (!object.isMesh) return;\n          const material = new THREE.MeshBasicMaterial({\n            color: placementGhost.colorHex ?? PLACEMENT_VALID_COLOR,\n            transparent: true,\n            opacity: 0.38,\n            depthWrite: false,\n            depthTest: false,\n            side: THREE.DoubleSide,\n          });\n          object.material = material;\n          object.renderOrder = 10000;\n          tintMaterials.push(material);\n        });\n\n        chair.updateMatrixWorld(true);\n        const box = new THREE.Box3().setFromObject(chair);\n        const center = box.getCenter(new THREE.Vector3());\n        chair.position.x -= center.x;\n        chair.position.z -= center.z;\n        chair.position.y -= box.min.y;\n        root.add(chair);\n      }).catch((error) => {\n        console.warn('Bar Taburesi ghost GLB modeli yüklenemedi:', error);\n      });\n\n      return placementGhost;\n    }\n"""
s = s[:match.start()] + new_block + s[match.end():]

old_show = """  function showPlacementGhost(moduleOrWidthCm, placement, valid) {\n    const ghost = ensurePlacementGhost(moduleOrWidthCm);\n    ghost.mesh.material.color.setHex(valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR);\n    applyPlacementToGroup(ghost.root, placement, ghost.widthCm);\n    ghost.root.visible = true;\n  }\n"""
new_show = """  function showPlacementGhost(moduleOrWidthCm, placement, valid) {\n    const ghost = ensurePlacementGhost(moduleOrWidthCm);\n    const colorHex = valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR;\n    ghost.colorHex = colorHex;\n    if (ghost.tintMaterials?.length) {\n      ghost.tintMaterials.forEach((material) => material.color?.setHex(colorHex));\n    } else if (ghost.mesh?.material?.color) {\n      ghost.mesh.material.color.setHex(colorHex);\n    }\n    applyPlacementToGroup(ghost.root, placement, ghost.widthCm);\n    ghost.root.visible = true;\n  }\n"""
if old_show not in s:
    raise SystemExit('showPlacementGhost block not found')
s = s.replace(old_show, new_show, 1)

# 3) Floating drag badge: use the same historical icon instead of a panel thumbnail.
needle = """    if (preview) {\n      preview.style.height = (moduleState?.type === 'sofa-set-classic') ? '34px' : (moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px'));\n      if (moduleState?.type === 'sofa-set-classic') {\n"""
replacement = """    if (preview) {\n      preview.innerHTML = '';\n      preview.style.width = '24px';\n      preview.style.height = (moduleState?.type === 'sofa-set-classic') ? '34px' : (moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px'));\n      preview.style.position = 'relative';\n      preview.style.border = '2px solid #8a929a';\n      preview.style.background = 'repeating-linear-gradient(to bottom,#f7f7f5 0 5px,#c4c9ce 5px 6px)';\n\n      if (moduleState?.type === 'bar-stool') {\n        preview.style.width = '44px';\n        preview.style.height = '58px';\n        preview.style.border = '0';\n        preview.style.background = 'transparent';\n        const seat = document.createElement('span');\n        seat.style.cssText = 'position:absolute;left:8px;top:4px;width:28px;height:20px;box-sizing:border-box;border:2px solid #8a929a;border-radius:10px 10px 5px 5px;background:#f8fafc';\n        const frame = document.createElement('span');\n        frame.style.cssText = 'position:absolute;left:11px;top:24px;width:22px;height:27px;box-sizing:border-box;border-left:3px solid #8a929a;border-right:3px solid #8a929a;border-bottom:3px solid #8a929a;border-radius:0 0 10px 10px';\n        preview.append(seat, frame);\n      } else if (moduleState?.type === 'sofa-set-classic') {\n"""
if needle not in s:
    raise SystemExit('drag badge preview branch not found')
s = s.replace(needle, replacement, 1)

p.write_text(s)
print('Restored historical stool icon and enabled actual GLB placement ghost.')
