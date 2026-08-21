import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');

const cameraAnchor = `  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 2000);\n  camera.position.set(4.8, 3.4, 6.2);`;
const cameraReplacement = `  const perspectiveCamera = new THREE.PerspectiveCamera(42, 1, 0.05, 2000);\n  perspectiveCamera.position.set(4.8, 3.4, 6.2);\n  const orthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.05, 2000);\n  orthographicCamera.position.copy(perspectiveCamera.position);\n  let camera = perspectiveCamera;`;
if (!scene.includes('const perspectiveCamera = new THREE.PerspectiveCamera')) {
  if (!scene.includes(cameraAnchor)) throw new Error('camera anchor not found');
  scene = scene.replace(cameraAnchor, cameraReplacement);
}

const viewCubeAnchor = `  const viewCube = createViewCube(container, camera, controls);`;
const viewCubeReplacement = `  const viewCube = createViewCube(container, camera, controls);\n\n  let cameraMode = 'perspective';\n  const projectionControl = document.createElement('div');\n  projectionControl.setAttribute('aria-label', 'Kamera projeksiyonu');\n  projectionControl.style.cssText = [\n    'position:absolute',\n    'right:18px',\n    'bottom:18px',\n    'z-index:35',\n    'display:flex',\n    'gap:4px',\n    'padding:4px',\n    'border:1px solid rgba(148,163,184,.55)',\n    'border-radius:9px',\n    'background:rgba(255,255,255,.9)',\n    'box-shadow:0 5px 16px rgba(15,23,42,.12)',\n    'backdrop-filter:blur(5px)',\n  ].join(';');\n\n  const projectionButtons = new Map();\n  [['perspective', 'Persp'], ['orthographic', 'Ortho']].forEach(([mode, label]) => {\n    const button = document.createElement('button');\n    button.type = 'button';\n    button.textContent = label;\n    button.title = mode === 'perspective' ? 'Perspektif görünüş' : 'Ortografik görünüş';\n    button.style.cssText = [\n      'height:28px',\n      'padding:0 9px',\n      'border:0',\n      'border-radius:6px',\n      'font:700 11px/1 system-ui,sans-serif',\n      'cursor:pointer',\n      'transition:background .15s,color .15s',\n    ].join(';');\n    projectionControl.appendChild(button);\n    projectionButtons.set(mode, button);\n  });\n  container.appendChild(projectionControl);\n\n  function styleProjectionButtons() {\n    projectionButtons.forEach((button, mode) => {\n      const active = mode === cameraMode;\n      button.style.background = active ? '#2563eb' : 'transparent';\n      button.style.color = active ? '#ffffff' : '#475569';\n    });\n  }\n\n  function setOrthographicSpan(verticalSpan, aspect) {\n    const safeSpan = Math.max(0.25, Number(verticalSpan) || 10);\n    const safeAspect = Math.max(0.1, Number(aspect) || 1);\n    orthographicCamera.top = safeSpan / 2;\n    orthographicCamera.bottom = -safeSpan / 2;\n    orthographicCamera.right = (safeSpan * safeAspect) / 2;\n    orthographicCamera.left = -(safeSpan * safeAspect) / 2;\n    orthographicCamera.updateProjectionMatrix();\n  }\n\n  function updateCameraProjection(width, height) {\n    const aspect = Math.max(1, width) / Math.max(1, height);\n    perspectiveCamera.aspect = aspect;\n    perspectiveCamera.updateProjectionMatrix();\n    if (cameraMode === 'orthographic') {\n      const span = Math.max(0.25, (orthographicCamera.top - orthographicCamera.bottom));\n      setOrthographicSpan(span, aspect);\n    }\n  }\n\n  function setCameraMode(nextMode) {\n    const resolved = nextMode === 'orthographic' ? 'orthographic' : 'perspective';\n    if (resolved === cameraMode) return cameraMode;\n\n    const source = camera;\n    const target = resolved === 'orthographic' ? orthographicCamera : perspectiveCamera;\n    const targetPoint = controls.target.clone();\n    const direction = source.position.clone().sub(targetPoint);\n    if (direction.lengthSq() === 0) direction.copy(HOME_DIRECTION);\n    direction.normalize();\n\n    if (resolved === 'orthographic') {\n      const distance = source.position.distanceTo(targetPoint);\n      const verticalSpan = 2 * distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2);\n      const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);\n      orthographicCamera.zoom = 1;\n      setOrthographicSpan(verticalSpan, aspect);\n      target.position.copy(source.position);\n    } else {\n      const visibleSpan = (orthographicCamera.top - orthographicCamera.bottom) / Math.max(orthographicCamera.zoom, 0.0001);\n      const distance = visibleSpan / (2 * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2));\n      target.position.copy(targetPoint).addScaledVector(direction, distance);\n    }\n\n    target.quaternion.copy(source.quaternion);\n    target.up.copy(source.up);\n    camera = target;\n    cameraMode = resolved;\n    controls.object = camera;\n    controls.update();\n    viewCube.setCamera(camera);\n    styleProjectionButtons();\n    return cameraMode;\n  }\n\n  projectionButtons.get('perspective').addEventListener('click', () => setCameraMode('perspective'));\n  projectionButtons.get('orthographic').addEventListener('click', () => setCameraMode('orthographic'));\n  styleProjectionButtons();`;
if (!scene.includes("let cameraMode = 'perspective'")) {
  if (!scene.includes(viewCubeAnchor)) throw new Error('viewCube anchor not found');
  scene = scene.replace(viewCubeAnchor, viewCubeReplacement);
}

const resetStageAnchor = `    camera.position.copy(target).addScaledVector(STAGE_HOME_DIRECTION, distance);\n    camera.lookAt(target);\n    controls.update();`;
const resetStageReplacement = `    camera.position.copy(target).addScaledVector(STAGE_HOME_DIRECTION, distance);\n    if (camera.isOrthographicCamera) {\n      camera.zoom = 1;\n      const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);\n      const span = 2 * distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2);\n      setOrthographicSpan(span, aspect);\n    }\n    camera.lookAt(target);\n    controls.update();`;
if (!scene.includes('const span = 2 * distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2);')) {
  if (!scene.includes(resetStageAnchor)) throw new Error('reset stage anchor not found');
  scene = scene.replace(resetStageAnchor, resetStageReplacement);
}

const resetDefaultAnchor = `    camera.position.copy(target).addScaledVector(HOME_DIRECTION, distance);\n    camera.lookAt(target);\n    controls.update();`;
const resetDefaultReplacement = `    camera.position.copy(target).addScaledVector(HOME_DIRECTION, distance);\n    if (camera.isOrthographicCamera) {\n      camera.zoom = 1;\n      const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);\n      const span = 2 * distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2);\n      setOrthographicSpan(span, aspect);\n    }\n    camera.lookAt(target);\n    controls.update();`;
if (!scene.includes(resetDefaultReplacement)) {
  if (!scene.includes(resetDefaultAnchor)) throw new Error('reset default anchor not found');
  scene = scene.replace(resetDefaultAnchor, resetDefaultReplacement);
}

const resizeAnchor = `    renderer.setSize(width, height, false);\n    camera.aspect = width / height;\n    camera.updateProjectionMatrix();`;
const resizeReplacement = `    renderer.setSize(width, height, false);\n    updateCameraProjection(width, height);`;
if (scene.includes(resizeAnchor)) scene = scene.replace(resizeAnchor, resizeReplacement);

scene = scene.replace(`    const previousAspect = camera.aspect;\n`, '');
scene = scene.replace(
  `      camera.aspect = targetWidth / targetHeight;\n      camera.updateProjectionMatrix();`,
  `      updateCameraProjection(targetWidth, targetHeight);`,
);
scene = scene.replace(
  `      camera.aspect = previousAspect;\n      camera.updateProjectionMatrix();`,
  `      updateCameraProjection(cssWidth, cssHeight);`,
);

const returnAnchor = `    captureCurrentViewPng,\n    createStage,`;
const returnReplacement = `    captureCurrentViewPng,\n    setCameraMode,\n    getCameraMode: () => cameraMode,\n    createStage,`;
if (!scene.includes('getCameraMode: () => cameraMode')) {
  if (!scene.includes(returnAnchor)) throw new Error('return anchor not found');
  scene = scene.replace(returnAnchor, returnReplacement);
}

fs.writeFileSync(scenePath, scene);

const cubePath = 'src/viewCube.js';
let cube = fs.readFileSync(cubePath, 'utf8');

const wheelAnchor = `    const target = controls.target;\n    const offset = camera.position.clone().sub(target);\n    const currentDistance = offset.length();\n    const factor = event.deltaY > 0 ? 1.12 : 0.88;\n    const nextDistance = THREE.MathUtils.clamp(\n      currentDistance * factor,\n      controls.minDistance,\n      controls.maxDistance,\n    );\n    if (currentDistance > 0) offset.setLength(nextDistance);\n    camera.position.copy(target).add(offset);\n    controls.update();`;
const wheelReplacement = `    if (camera.isOrthographicCamera) {\n      const factor = event.deltaY > 0 ? 0.88 : 1.12;\n      camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, 0.08, 24);\n      camera.updateProjectionMatrix();\n      controls.update();\n      return;\n    }\n\n    const target = controls.target;\n    const offset = camera.position.clone().sub(target);\n    const currentDistance = offset.length();\n    const factor = event.deltaY > 0 ? 1.12 : 0.88;\n    const nextDistance = THREE.MathUtils.clamp(\n      currentDistance * factor,\n      controls.minDistance,\n      controls.maxDistance,\n    );\n    if (currentDistance > 0) offset.setLength(nextDistance);\n    camera.position.copy(target).add(offset);\n    controls.update();`;
if (!cube.includes('camera.isOrthographicCamera')) {
  if (!cube.includes(wheelAnchor)) throw new Error('viewCube wheel anchor not found');
  cube = cube.replace(wheelAnchor, wheelReplacement);
}

const cubeReturnAnchor = `  return {\n    update,\n    dispose,\n    setViewDirection: animateToDirection,\n  };`;
const cubeReturnReplacement = `  return {\n    update,\n    dispose,\n    setCamera(nextCamera) {\n      if (nextCamera) camera = nextCamera;\n    },\n    setViewDirection: animateToDirection,\n  };`;
if (!cube.includes('setCamera(nextCamera)')) {
  if (!cube.includes(cubeReturnAnchor)) throw new Error('viewCube return anchor not found');
  cube = cube.replace(cubeReturnAnchor, cubeReturnReplacement);
}

fs.writeFileSync(cubePath, cube);
