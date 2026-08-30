from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()

old_scale = """      const orientedBox = new THREE.Box3().setFromObject(oriented);\n      const orientedSize = orientedBox.getSize(new THREE.Vector3());\n      const fitted = new THREE.Group();\n      fitted.scale.set(\n        orientedSize.x > 0 ? placement.targetWidthM / orientedSize.x : 1,\n        orientedSize.y > 0 ? placement.targetHeightM / orientedSize.y : 1,\n        orientedSize.z > 0 ? placement.targetDepthM / orientedSize.z : 1,\n      );\n      fitted.position.set(placement.x, placement.targetHeightM / 2, placement.z);\n"""
new_scale = """      const orientedBox = new THREE.Box3().setFromObject(oriented);\n      const orientedSize = orientedBox.getSize(new THREE.Vector3());\n      const fitted = new THREE.Group();\n      // GLB'nin doğal en-boy-yükseklik oranını bozma. Sadece hedef genişliğe\n      // göre tek katsayıyla ölçekle; derinlik ve yükseklik modelden doğal gelir.\n      const uniformScale = orientedSize.x > 0\n        ? placement.targetWidthM / orientedSize.x\n        : 1;\n      fitted.scale.setScalar(uniformScale);\n      fitted.position.set(\n        placement.x,\n        (orientedSize.y * uniformScale) / 2,\n        placement.z,\n      );\n"""
if old_scale not in text:
    raise SystemExit('scale block not found')
text = text.replace(old_scale, new_scale, 1)

text = text.replace(
    "meshName: 'beigechair1_tripo_mat_0691346e_0', targetWidthM: chairWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: -chairCenterOffsetM, z: frontRowZ, rotationYDeg: 35.1154498349714",
    "meshName: 'beigechair1_tripo_mat_0691346e_0', targetWidthM: chairWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: -chairCenterOffsetM, z: frontRowZ, rotationYDeg: 215.1154498349714",
    1,
)
text = text.replace(
    "meshName: 'beigechair3_tripo_mat_0691346e_0', targetWidthM: chairWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: chairCenterOffsetM, z: frontRowZ, rotationYDeg: -136.13688181359935",
    "meshName: 'beigechair3_tripo_mat_0691346e_0', targetWidthM: chairWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: chairCenterOffsetM, z: frontRowZ, rotationYDeg: 43.86311818640065",
    1,
)

path.write_text(text)
