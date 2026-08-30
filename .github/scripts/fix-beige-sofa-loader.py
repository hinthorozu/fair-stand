from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text(encoding='utf-8')
start_marker = "      const mesh = source.clone(true);\n"
end_marker = "      group.add(fitted);\n"
start = text.find(start_marker, text.find('function createBeigeSofaSetModule'))
end = text.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit('beige sofa mesh fitting block not found')
end += len(end_marker)

replacement = """      // Preserve the complete GLB node transform chain. Cloning only the mesh and
      // detaching it from its parents can lose scale/rotation authored above the mesh.
      source.updateWorldMatrix(true, false);
      const mesh = source.clone(true);
      mesh.matrixAutoUpdate = true;
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.quaternion.identity();
      mesh.scale.set(1, 1, 1);
      mesh.updateMatrix();
      mesh.applyMatrix4(source.matrixWorld);

      mesh.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = true;
        object.receiveShadow = true;
        if (Array.isArray(object.material)) {
          object.material = object.material.map((material) => material?.clone?.() ?? material);
        } else if (object.material) {
          object.material = object.material.clone();
        }
        colorTargets.push(object);
      });

      // Normalize around the object's real physical footprint and put its feet on y=0.
      mesh.updateMatrixWorld(true);
      let sourceBox = new THREE.Box3().setFromObject(mesh);
      const sourceCenter = sourceBox.getCenter(new THREE.Vector3());
      mesh.position.x -= sourceCenter.x;
      mesh.position.z -= sourceCenter.z;
      mesh.position.y -= sourceBox.min.y;
      mesh.updateMatrixWorld(true);
      sourceBox = new THREE.Box3().setFromObject(mesh);

      const oriented = new THREE.Group();
      oriented.rotation.y = THREE.MathUtils.degToRad(placement.rotationYDeg);
      oriented.add(mesh);
      oriented.updateMatrixWorld(true);

      const orientedBox = new THREE.Box3().setFromObject(oriented);
      const orientedSize = orientedBox.getSize(new THREE.Vector3());
      const sourceSize = sourceBox.getSize(new THREE.Vector3());
      const isLoveseat = placement.meshName === 'beigechair2seatsofa_tripo_mat_0691346e_0';

      // Loveseat is exactly 150 cm wide. Singles keep the requested +25% visual size,
      // while every axis still uses one uniform scale so the GLB proportions stay intact.
      const sizeCorrection = isLoveseat ? 1 : 1.25;
      const physicalWidthM = isLoveseat
        ? orientedSize.x
        : Math.max(sourceSize.x, sourceSize.z);
      const uniformScale = physicalWidthM > 0
        ? (placement.targetWidthM / physicalWidthM) * sizeCorrection
        : sizeCorrection;

      const fitted = new THREE.Group();
      fitted.scale.setScalar(uniformScale);
      fitted.position.set(placement.x, 0, placement.z);
      fitted.add(oriented);
      group.add(fitted);
"""

path.write_text(text[:start] + replacement + text[end:], encoding='utf-8')
print('Beige sofa GLB fitting fixed')
