from pathlib import Path

p = Path('src/scene3d.js')
s = p.read_text()
marker = "    // Eames Masa Sandalye Takımı uses the real table geometry plus the actual chair GLB geometry.\n"
if marker not in s:
    raise SystemExit('Eames ghost marker not found')

block = r'''    // Koltuk Takımı uses its actual GLB sofa geometry plus the real coffee-table geometry.
    if (moduleOrWidthCm?.type === 'sofa-set-classic') {
      const proxy = new THREE.Mesh(
        new THREE.BoxGeometry(
          Math.max(dimensions.widthCm / 100, 0.02),
          dimensions.heightM,
          dimensions.depthM,
        ),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
      );
      proxy.position.y = dimensions.heightM / 2;
      root.add(proxy);
      scene.add(root);

      const tintMaterials = [];
      const makeGhostMaterial = () => {
        const material = new THREE.MeshBasicMaterial({
          color: PLACEMENT_VALID_COLOR,
          transparent: true,
          opacity: 0.38,
          depthWrite: false,
          depthTest: false,
          side: THREE.DoubleSide,
        });
        tintMaterials.push(material);
        return material;
      };

      // Same coffee table dimensions and +10 cm Z offset as the rendered module.
      const tableTop = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.018, 0.42), makeGhostMaterial());
      tableTop.position.set(0, 0.38, 0.10);
      tableTop.renderOrder = 10000;
      root.add(tableTop);

      const tableStem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.35, 20), makeGhostMaterial());
      tableStem.position.set(0, 0.19, 0.10);
      tableStem.renderOrder = 10000;
      root.add(tableStem);

      const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32), makeGhostMaterial());
      tableBase.position.set(0, 0.018, 0.10);
      tableBase.renderOrder = 10000;
      root.add(tableBase);

      placementGhost = {
        root,
        mesh: proxy,
        tintMaterials,
        key,
        widthCm: dimensions.widthCm,
        ownsGeometry: true,
        colorHex: PLACEMENT_VALID_COLOR,
      };

      const widthM = dimensions.widthCm / 100;
      const depthM = dimensions.depthM;
      const heightM = dimensions.heightM;
      const loveseatWidthM = 1.50;
      const chairWidthM = 0.65;
      const sofaDepthM = 0.45;
      const chairGapM = 0.20;
      const chairCenterOffsetM = (chairWidthM + chairGapM) / 2;
      const backRowZ = -depthM / 2 + sofaDepthM / 2;
      const frontRowZ = depthM / 2 - sofaDepthM / 2;
      const placements = [
        { meshName: 'beigechair2seatsofa_tripo_mat_0691346e_0', targetWidthM: loveseatWidthM, x: 0, z: backRowZ, rotationYDeg: -45 },
        { meshName: 'beigechair1_tripo_mat_0691346e_0', targetWidthM: chairWidthM, x: -chairCenterOffsetM, z: frontRowZ, rotationYDeg: 40 },
        { meshName: 'beigechair3_tripo_mat_0691346e_0', targetWidthM: chairWidthM, x: chairCenterOffsetM, z: frontRowZ, rotationYDeg: 225 },
      ];

      loadBeigeSofaModel().then((template) => {
        if (placementGhost?.key !== key || placementGhost.root !== root) return;

        placements.forEach((placement) => {
          const source = template.getObjectByName(placement.meshName);
          if (!source) return;

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
            const material = new THREE.MeshBasicMaterial({
              color: placementGhost.colorHex ?? PLACEMENT_VALID_COLOR,
              transparent: true,
              opacity: 0.38,
              depthWrite: false,
              depthTest: false,
              side: THREE.DoubleSide,
            });
            object.material = material;
            object.renderOrder = 10000;
            tintMaterials.push(material);
          });

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
          const sizeCorrection = isLoveseat ? 1.40 : 1.25;
          const physicalWidthM = isLoveseat ? orientedSize.x : Math.max(sourceSize.x, sourceSize.z);
          const uniformScale = physicalWidthM > 0
            ? (placement.targetWidthM / physicalWidthM) * sizeCorrection
            : sizeCorrection;

          const fitted = new THREE.Group();
          fitted.scale.setScalar(uniformScale);
          fitted.position.set(placement.x, 0, placement.z);
          fitted.add(oriented);
          root.add(fitted);
        });
      }).catch((error) => {
        console.warn('Koltuk Takımı ghost GLB modeli yüklenemedi:', error);
      });

      return placementGhost;
    }

'''
s = s.replace(marker, block + marker, 1)
p.write_text(s)
print('Koltuk Takımı real GLB placement ghost added.')
