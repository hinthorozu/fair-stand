import fs from 'node:fs';

const path = 'src/scene3d.js';
let text = fs.readFileSync(path, 'utf8');

function replaceOnce(from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing pattern: ${label}`);
  text = text.replace(from, to);
}

replaceOnce(
`  function getTopFixtureDragPoint(clientX, clientY, preferredWallId = 'back') {
    if (!stageLayout) return null;
    setPointerFromClient(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);

    const allowedWalls = getAllowedWallIds(stageLayout.standType)
      .filter((wallId) => wallId !== 'free');
    const wallOrder = [preferredWallId, ...allowedWalls.filter((wallId) => wallId !== preferredWallId)];
    const candidates = [];
    const epsilonCm = 4;

    wallOrder.forEach((wallId, order) => {
      let plane;
      if (wallId === 'left') {
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
      } else if (wallId === 'right') {
        plane = new THREE.Plane(
          new THREE.Vector3(1, 0, 0),
          -Number(stageLayout.widthM),
        );
      } else if (wallId === 'back') {
        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      } else {
        return;
      }

      const point = new THREE.Vector3();
      const hit = raycaster.ray.intersectPlane(plane, point);
      if (!hit) return;

      const xCm = point.x * 100;
      const yCm = point.z * 100;
      const inBounds = wallId === 'back'
        ? xCm >= -epsilonCm && xCm <= Number(stageLayout.widthCm) + epsilonCm
        : yCm >= -epsilonCm && yCm <= Number(stageLayout.depthCm) + epsilonCm;
      if (!inBounds) return;

      candidates.push({
        wallId,
        xCm,
        yCm,
        distance: raycaster.ray.origin.distanceTo(point),
        order,
      });
    });

    if (!candidates.length) return null;
    candidates.sort((a, b) => (a.distance - b.distance) || (a.order - b.order));
    return candidates[0];
  }`,
`  function getTopFixtureDragPoint(clientX, clientY, preferredWallId = 'back') {
    if (!stageLayout) return null;
    setPointerFromClient(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);

    // Projektörü 350 cm üst kotunda serbestçe gezdir. Duvara yaklaşınca üst profile snap et.
    const topPlane = new THREE.Plane(
      new THREE.Vector3(0, 1, 0),
      -Number(STAND_DIMENSIONS.height),
    );
    const topPoint = new THREE.Vector3();
    const topHit = raycaster.ray.intersectPlane(topPlane, topPoint);
    if (topHit) {
      const xCm = topPoint.x * 100;
      const yCm = topPoint.z * 100;
      const widthCm = Number(stageLayout.widthCm);
      const depthCm = Number(stageLayout.depthCm);
      const outerMarginCm = 60;

      if (
        xCm >= -outerMarginCm && xCm <= widthCm + outerMarginCm
        && yCm >= -outerMarginCm && yCm <= depthCm + outerMarginCm
      ) {
        const allowedWalls = getAllowedWallIds(stageLayout.standType)
          .filter((wallId) => wallId !== 'free');
        const wallDistances = [];
        if (allowedWalls.includes('back')) wallDistances.push({ wallId: 'back', distanceCm: Math.abs(yCm) });
        if (allowedWalls.includes('left')) wallDistances.push({ wallId: 'left', distanceCm: Math.abs(xCm) });
        if (allowedWalls.includes('right')) wallDistances.push({ wallId: 'right', distanceCm: Math.abs(widthCm - xCm) });

        wallDistances.sort((a, b) => {
          const distanceDelta = a.distanceCm - b.distanceCm;
          if (Math.abs(distanceDelta) > 0.001) return distanceDelta;
          if (a.wallId === preferredWallId) return -1;
          if (b.wallId === preferredWallId) return 1;
          return 0;
        });

        const nearestWall = wallDistances[0];
        const wallSnapDistanceCm = 30;
        if (nearestWall && nearestWall.distanceCm <= wallSnapDistanceCm) {
          return { wallId: nearestWall.wallId, xCm, yCm, mode: 'wall' };
        }

        return { wallId: 'free', xCm, yCm, mode: 'free' };
      }
    }

    // Çok yatık kamera açılarında üst düzlem kesişmezse mevcut duvar düzlemi hesabını fallback olarak kullan.
    const allowedWalls = getAllowedWallIds(stageLayout.standType)
      .filter((wallId) => wallId !== 'free');
    const wallOrder = [preferredWallId, ...allowedWalls.filter((wallId) => wallId !== preferredWallId)];
    const candidates = [];
    const epsilonCm = 4;

    wallOrder.forEach((wallId, order) => {
      let plane;
      if (wallId === 'left') {
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
      } else if (wallId === 'right') {
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -Number(stageLayout.widthM));
      } else if (wallId === 'back') {
        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      } else {
        return;
      }

      const point = new THREE.Vector3();
      const hit = raycaster.ray.intersectPlane(plane, point);
      if (!hit) return;
      const xCm = point.x * 100;
      const yCm = point.z * 100;
      const inBounds = wallId === 'back'
        ? xCm >= -epsilonCm && xCm <= Number(stageLayout.widthCm) + epsilonCm
        : yCm >= -epsilonCm && yCm <= Number(stageLayout.depthCm) + epsilonCm;
      if (!inBounds) return;
      candidates.push({ wallId, xCm, yCm, distance: raycaster.ray.origin.distanceTo(point), order, mode: 'wall' });
    });

    if (!candidates.length) return null;
    candidates.sort((a, b) => (a.distance - b.distance) || (a.order - b.order));
    return candidates[0];
  }`,
'free aerial top fixture point',
);

replaceOnce(
`      const wallRotationZDeg = wallPoint.wallId === 'left'
        ? 90
        : (wallPoint.wallId === 'right' ? 270 : 0);
      const basePlacement = {
        ...(moduleState.placement ?? {}),
        wallId: wallPoint.wallId,
        rotationZDeg: wallRotationZDeg,
      };
      dragSession.preferredRotationZDeg = wallRotationZDeg;
      const placement = snapTopFixturePlacement(
        basePlacement,
        wallPoint,
        moduleState.widthCm,
      );`,
`      const isFreeTopFixture = wallPoint.wallId === 'free';
      const wallRotationZDeg = wallPoint.wallId === 'left'
        ? 90
        : (wallPoint.wallId === 'right' ? 270 : dragSession.preferredRotationZDeg);
      const basePlacement = {
        ...(moduleState.placement ?? {}),
        wallId: wallPoint.wallId,
        rotationZDeg: wallRotationZDeg,
      };

      let placement;
      if (isFreeTopFixture) {
        const stepCm = 20;
        const widthCm = Math.max(0, Number(moduleState.widthCm) || 0);
        const vertical = isVerticalModuleRotation(wallRotationZDeg);
        const snap20 = (value) => Math.round(Number(value) / stepCm) * stepCm;
        const maxX = Math.max(0, Number(stageLayout.widthCm) - (vertical ? 0 : widthCm));
        const maxY = Math.max(0, Number(stageLayout.depthCm) - (vertical ? widthCm : 0));
        placement = {
          ...basePlacement,
          xCm: Math.min(maxX, Math.max(0, snap20(wallPoint.xCm))),
          yCm: Math.min(maxY, Math.max(0, snap20(wallPoint.yCm))),
          zCm: Math.round(STAND_DIMENSIONS.height * 100),
          wallId: 'free',
        };
      } else {
        dragSession.preferredRotationZDeg = wallRotationZDeg;
        placement = snapTopFixturePlacement(
          basePlacement,
          wallPoint,
          moduleState.widthCm,
        );
      }`,
'free or wall top fixture placement',
);

replaceOnce(
`        snap: { mode: 'top-wall' },`,
`        snap: { mode: isFreeTopFixture ? 'top-free' : 'top-wall' },`,
'preview snap mode',
);

fs.writeFileSync(path, text);
