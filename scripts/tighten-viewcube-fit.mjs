import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

const oldBlock = `  function getViewCubeFit() {
    if (!stageLayout) return null;

    const widthM = stageLayout.widthM + STAGE_SURROUND_M * 2;
    const depthM = stageLayout.depthM + STAGE_SURROUND_M * 2;
    const heightM = Math.max(STAND_DIMENSIONS.height + ACTIVE_PLATFORM_HEIGHT_M, 1);
    const target = new THREE.Vector3(
      stageLayout.widthM / 2,
      heightM * 0.48,
      stageLayout.depthM / 2,
    );

    // Fit a conservative bounding sphere so every ViewCube preset shows the complete
    // stand, including the 1 m reference surround, regardless of the previous zoom.
    const radius = Math.sqrt((widthM ** 2) + (depthM ** 2) + (heightM ** 2)) * 0.5 * 1.08;
    const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);
    const verticalFov = THREE.MathUtils.degToRad(perspectiveCamera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
    const fitFov = Math.max(THREE.MathUtils.degToRad(12), Math.min(verticalFov, horizontalFov));
    const distance = THREE.MathUtils.clamp(
      (radius / Math.sin(fitFov / 2)) * 1.04,
      controls.minDistance,
      controls.maxDistance,
    );
    const verticalSpan = (radius * 2 * 1.08) / Math.min(1, aspect);

    return { target, distance, verticalSpan };
  }`;

const newBlock = `  function getViewCubeFit(direction = HOME_DIRECTION) {
    if (!stageLayout) return null;

    const widthM = stageLayout.widthM + STAGE_SURROUND_M * 2;
    const depthM = stageLayout.depthM + STAGE_SURROUND_M * 2;
    const heightM = Math.max(STAND_DIMENSIONS.height + ACTIVE_PLATFORM_HEIGHT_M, 1);
    const target = new THREE.Vector3(
      stageLayout.widthM / 2,
      heightM * 0.48,
      stageLayout.depthM / 2,
    );

    // ViewCube presets should frame the complete stand without shrinking it into the
    // middle of the viewport. Project the stage box onto the requested camera axes and
    // target roughly 82% viewport occupancy, leaving a small, consistent safe margin.
    const occupancy = 0.82;
    const half = new THREE.Vector3(widthM / 2, heightM / 2, depthM / 2);
    const viewDirection = direction.clone();
    if (viewDirection.lengthSq() === 0) viewDirection.copy(HOME_DIRECTION);
    viewDirection.normalize();

    const referenceUp = Math.abs(viewDirection.y) > 0.98
      ? new THREE.Vector3(0, 0, 1)
      : new THREE.Vector3(0, 1, 0);
    const right = referenceUp.clone().cross(viewDirection).normalize();
    const screenUp = viewDirection.clone().cross(right).normalize();

    const projectedHalfWidth = Math.abs(right.x) * half.x
      + Math.abs(right.y) * half.y
      + Math.abs(right.z) * half.z;
    const projectedHalfHeight = Math.abs(screenUp.x) * half.x
      + Math.abs(screenUp.y) * half.y
      + Math.abs(screenUp.z) * half.z;
    const depthHalf = Math.abs(viewDirection.x) * half.x
      + Math.abs(viewDirection.y) * half.y
      + Math.abs(viewDirection.z) * half.z;

    const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);
    const verticalFov = THREE.MathUtils.degToRad(perspectiveCamera.fov);
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);
    const perspectiveFit = Math.max(
      projectedHalfHeight / Math.tan(verticalFov / 2),
      projectedHalfWidth / Math.tan(horizontalFov / 2),
    ) / occupancy;
    const distance = THREE.MathUtils.clamp(
      depthHalf + perspectiveFit,
      controls.minDistance,
      controls.maxDistance,
    );

    const verticalSpan = Math.max(
      projectedHalfHeight * 2,
      (projectedHalfWidth * 2) / Math.max(aspect, 0.1),
    ) / occupancy;

    return { target, distance, verticalSpan };
  }`;

if (!scene.includes(oldBlock)) {
  if (scene.includes('const occupancy = 0.82;')) {
    console.log('ViewCube framing already tightened.');
    process.exit(0);
  }
  throw new Error('ViewCube fit block not found');
}

scene = scene.replace(oldBlock, newBlock);
fs.writeFileSync(scenePath, scene);
