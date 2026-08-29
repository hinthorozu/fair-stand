from pathlib import Path

scene_path = Path('src/scene3d.js')
s = scene_path.read_text()

fn_start = s.find('function createBeigeSofaSetModule(')
next_fn = s.find('function createSofaSetModule(', fn_start)
if fn_start < 0 or next_fn < 0:
    raise SystemExit('beige renderer block not found')

renderer = r"""function createBeigeSofaSetModule(moduleState, moduleIndex) {
  const widthCm = Number(moduleState.widthCm || 150);
  const depthCm = Number(moduleState.depthCm || 150);
  const heightCm = Number(moduleState.heightCm || 78);
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const heightM = heightCm / 100;
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'sofa-set-beige',
    widthCm,
    depthCm,
    heightCm,
  };

  // Bej takım mevcut klasik koltuk takımının doğrulanmış 150 x 150 yerleşimini kullanır:
  // 150 cm ikili koltuk bir tarafta, 65 + 65 cm iki tekli karşı tarafta, sehpa ortada.
  const loveseatWidthM = 1.50;
  const chairWidthM = 0.65;
  const sofaDepthM = 0.45;
  const chairGapM = 0.20;
  const chairCenterOffsetM = (chairWidthM + chairGapM) / 2;
  const backRowZ = -depthM / 2 + sofaDepthM / 2;
  const frontRowZ = depthM / 2 - sofaDepthM / 2;

  const colorTargets = [];
  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      colorWrite: false,
    }),
  );
  proxy.position.set(0, heightM / 2, 0);
  group.add(proxy);

  const selectionFrame = createSelectionFrame(widthM, heightM);
  selectionFrame.visible = false;
  proxy.add(selectionFrame);
  proxy.userData = {
    kind: 'surface',
    moduleType: 'sofa-set-beige',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'furniture',
    surfaceId: moduleState.surface?.id,
    surfaceState: moduleState.surface,
    selectionFrame,
    colorTargets,
  };

  // Yüklenen bej GLB'deki üç gerçek mesh'in kaynak yönleri ölçülerek çıkarıldı.
  // Bu dönüşler mesh'leri plan eksenine getirir; ikili merkeze, iki tekli de karşısına bakar.
  const placements = Object.freeze([
    Object.freeze({
      meshName: 'beigechair2seatsofa_tripo_mat_0691346e_0',
      targetWidthM: loveseatWidthM,
      targetDepthM: sofaDepthM,
      targetHeightM: heightM,
      x: 0,
      z: backRowZ,
      rotationYDeg: -45.26002361732807,
    }),
    Object.freeze({
      meshName: 'beigechair1_tripo_mat_0691346e_0',
      targetWidthM: chairWidthM,
      targetDepthM: sofaDepthM,
      targetHeightM: heightM,
      x: -chairCenterOffsetM,
      z: frontRowZ,
      rotationYDeg: 35.1154498349714,
    }),
    Object.freeze({
      meshName: 'beigechair3_tripo_mat_0691346e_0',
      targetWidthM: chairWidthM,
      targetDepthM: sofaDepthM,
      targetHeightM: heightM,
      x: chairCenterOffsetM,
      z: frontRowZ,
      rotationYDeg: -136.13688181359935,
    }),
  ]);

  loadBeigeSofaMeshPayload().then((buffer) => {
    if (!group.parent) return;

    const material = new THREE.MeshStandardMaterial({
      color: moduleState.surface?.color ?? '#e7ddca',
      roughness: 0.60,
      metalness: 0,
    });
    const metaByName = new Map(BEIGE_SOFA_MESH_META.map((meta) => [meta.name, meta]));

    const createSourceMesh = (meta) => {
      const positionCount = meta.vertexCount * 3;
      const indexCount = meta.faceCount * 3;
      const positions = new Float32Array(
        buffer.slice(meta.positionOffset, meta.positionOffset + positionCount * 4),
      );
      const indices = new Uint16Array(
        buffer.slice(meta.indexOffset, meta.indexOffset + indexCount * 2),
      );
      const expandedPositions = new Float32Array(indices.length * 3);

      for (let i = 0; i < indices.length; i += 1) {
        const sourceIndex = indices[i] * 3;
        const targetIndex = i * 3;
        expandedPositions[targetIndex] = positions[sourceIndex];
        expandedPositions[targetIndex + 1] = positions[sourceIndex + 1];
        expandedPositions[targetIndex + 2] = positions[sourceIndex + 2];
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(expandedPositions, 3));
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.name = meta.name;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      colorTargets.push(mesh);
      return mesh;
    };

    placements.forEach((placement) => {
      const meta = metaByName.get(placement.meshName);
      if (!meta) return;

      const mesh = createSourceMesh(meta);
      const sourceBox = new THREE.Box3().setFromObject(mesh);
      const sourceCenter = sourceBox.getCenter(new THREE.Vector3());
      mesh.position.sub(sourceCenter);

      const oriented = new THREE.Group();
      oriented.rotation.y = THREE.MathUtils.degToRad(placement.rotationYDeg);
      oriented.add(mesh);
      oriented.updateMatrixWorld(true);

      const orientedBox = new THREE.Box3().setFromObject(oriented);
      const orientedSize = orientedBox.getSize(new THREE.Vector3());
      const fitted = new THREE.Group();
      fitted.scale.set(
        orientedSize.x > 0 ? placement.targetWidthM / orientedSize.x : 1,
        orientedSize.y > 0 ? placement.targetHeightM / orientedSize.y : 1,
        orientedSize.z > 0 ? placement.targetDepthM / orientedSize.z : 1,
      );
      fitted.position.set(placement.x, placement.targetHeightM / 2, placement.z);
      fitted.add(oriented);
      group.add(fitted);
    });
  }).catch((error) => {
    console.warn('Bej koltuk takımı kaynak modeli yüklenemedi:', error);
  });

  // Bej katalog ölçüsü: 60 x 42 x 38 cm. Klasik takımdaki cam sehpa dili korunur.
  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.60, 0.018, 0.42),
    new THREE.MeshPhysicalMaterial({
      color: 0xd7e9ed,
      transparent: true,
      opacity: 0.42,
      roughness: 0.12,
      metalness: 0,
      transmission: 0.28,
      depthWrite: false,
    }),
  );
  tableTop.position.set(0, 0.38, 0);
  tableTop.receiveShadow = true;
  group.add(tableTop);

  const tableStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.35, 20),
    new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.28 }),
  );
  tableStem.position.set(0, 0.19, 0);
  tableStem.castShadow = true;
  group.add(tableStem);

  const tableBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32),
    new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.30 }),
  );
  tableBase.position.set(0, 0.018, 0);
  tableBase.castShadow = true;
  tableBase.receiveShadow = true;
  group.add(tableBase);

  return { group, surfaces: [proxy] };
}

"""

s = s[:fn_start] + renderer + s[next_fn:]
scene_path.write_text(s)
print('scene3d.js beige sofa set arranged as opposing seating with center table')
