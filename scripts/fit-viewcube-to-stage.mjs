import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

const viewCubeAnchor = `  const viewCube = createViewCube(container, camera, controls);`;
const viewCubeReplacement = `  function getViewCubeFit() {\n    if (!stageLayout) return null;\n\n    const widthM = stageLayout.widthM + STAGE_SURROUND_M * 2;\n    const depthM = stageLayout.depthM + STAGE_SURROUND_M * 2;\n    const heightM = Math.max(STAND_DIMENSIONS.height + ACTIVE_PLATFORM_HEIGHT_M, 1);\n    const target = new THREE.Vector3(\n      stageLayout.widthM / 2,\n      heightM * 0.48,\n      stageLayout.depthM / 2,\n    );\n\n    // Fit a conservative bounding sphere so every ViewCube preset shows the complete\n    // stand, including the 1 m reference surround, regardless of the previous zoom.\n    const radius = Math.sqrt((widthM ** 2) + (depthM ** 2) + (heightM ** 2)) * 0.5 * 1.08;\n    const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);\n    const verticalFov = THREE.MathUtils.degToRad(perspectiveCamera.fov);\n    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);\n    const fitFov = Math.max(THREE.MathUtils.degToRad(12), Math.min(verticalFov, horizontalFov));\n    const distance = THREE.MathUtils.clamp(\n      (radius / Math.sin(fitFov / 2)) * 1.04,\n      controls.minDistance,\n      controls.maxDistance,\n    );\n    const verticalSpan = (radius * 2 * 1.08) / Math.min(1, aspect);\n\n    return { target, distance, verticalSpan };\n  }\n\n  const viewCube = createViewCube(container, camera, controls, getViewCubeFit);`;

if (!scene.includes('function getViewCubeFit()')) {
  if (!scene.includes(viewCubeAnchor)) throw new Error('scene ViewCube anchor not found');
  scene = scene.replace(viewCubeAnchor, viewCubeReplacement);
}

fs.writeFileSync(scenePath, scene);

const cubePath = 'src/viewCube.js';
let cube = fs.readFileSync(cubePath, 'utf8');

const signatureAnchor = `export function createViewCube(container, camera, controls) {`;
if (!cube.includes('getFitView = () => null')) {
  if (!cube.includes(signatureAnchor)) throw new Error('ViewCube signature anchor not found');
  cube = cube.replace(
    signatureAnchor,
    `export function createViewCube(container, camera, controls, getFitView = () => null) {`,
  );
}

const animateAnchor = `    const target = controls.target.clone();\n    const distance = THREE.MathUtils.clamp(\n      camera.position.distanceTo(target),\n      controls.minDistance,\n      controls.maxDistance,\n    );\n    const startPosition = camera.position.clone();\n    const endPosition = target.clone().addScaledVector(safeDirection, distance);\n    const startedAt = performance.now();`;

const animateReplacement = `    const fit = getFitView?.(safeDirection) ?? null;\n    const startTarget = controls.target.clone();\n    const target = fit?.target?.isVector3 ? fit.target.clone() : startTarget.clone();\n    const distance = THREE.MathUtils.clamp(\n      Number(fit?.distance) || camera.position.distanceTo(startTarget),\n      controls.minDistance,\n      controls.maxDistance,\n    );\n    const startPosition = camera.position.clone();\n    const endPosition = target.clone().addScaledVector(safeDirection, distance);\n\n    if (camera.isOrthographicCamera && Number.isFinite(fit?.verticalSpan)) {\n      const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);\n      const span = Math.max(0.25, fit.verticalSpan);\n      camera.zoom = 1;\n      camera.top = span / 2;\n      camera.bottom = -span / 2;\n      camera.right = (span * aspect) / 2;\n      camera.left = -(span * aspect) / 2;\n      camera.updateProjectionMatrix();\n    }\n\n    const startedAt = performance.now();`;

if (!cube.includes('const fit = getFitView?.(safeDirection)')) {
  if (!cube.includes(animateAnchor)) throw new Error('ViewCube animate anchor not found');
  cube = cube.replace(animateAnchor, animateReplacement);
}

const frameAnchor = `      camera.position.lerpVectors(startPosition, endPosition, eased);\n      camera.lookAt(target);`;
const frameReplacement = `      camera.position.lerpVectors(startPosition, endPosition, eased);\n      controls.target.lerpVectors(startTarget, target, eased);\n      camera.lookAt(controls.target);`;
if (!cube.includes('controls.target.lerpVectors(startTarget, target, eased)')) {
  if (!cube.includes(frameAnchor)) throw new Error('ViewCube frame anchor not found');
  cube = cube.replace(frameAnchor, frameReplacement);
}

fs.writeFileSync(cubePath, cube);
