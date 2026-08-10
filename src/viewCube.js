import * as THREE from 'three';

const CUBE_SIZE = 1.35;
const HALF_CUBE = CUBE_SIZE / 2;
const VIEW_SIZE = 126;
const CLICK_DRAG_THRESHOLD = 5;
const ROTATE_SPEED = 0.01;
const VIEW_ANIMATION_MS = 280;
const INITIAL_MIN_DISTANCE = 9;
const INITIAL_DISTANCE_FACTOR = 1.22;
const HOME_DIRECTION = new THREE.Vector3(1, 0.72, 1).normalize();

const FACE_LABELS = [
  { label: 'RIGHT', accent: '#ef4444' },
  { label: 'LEFT', accent: '#ef4444' },
  { label: 'TOP', accent: '#3b82f6' },
  { label: 'BOTTOM', accent: '#3b82f6' },
  { label: 'FRONT', accent: '#64748b' },
  { label: 'BACK', accent: '#64748b' },
];

export function createViewCube(container, camera, controls) {
  const root = document.createElement('div');
  root.className = 'view-cube';
  root.setAttribute('aria-label', 'Kamera yön küpü');

  const canvasWrap = document.createElement('div');
  canvasWrap.className = 'view-cube-canvas';
  root.appendChild(canvasWrap);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(VIEW_SIZE, VIEW_SIZE, false);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-label', 'ViewCube');
  canvasWrap.appendChild(renderer.domElement);

  const homeButton = document.createElement('button');
  homeButton.type = 'button';
  homeButton.className = 'view-cube-home';
  homeButton.title = 'İzometrik görünüş';
  homeButton.setAttribute('aria-label', 'İzometrik görünüş');
  homeButton.textContent = '⌂';
  root.appendChild(homeButton);

  container.appendChild(root);

  const scene = new THREE.Scene();
  const miniCamera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  miniCamera.position.set(3, 2.4, 3);
  miniCamera.lookAt(0, 0, 0);

  const faceTextures = FACE_LABELS.map(({ label, accent }) => createFaceTexture(label, accent));
  const materials = faceTextures.map((texture) => new THREE.MeshBasicMaterial({ map: texture }));
  const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0x6b7280, transparent: true, opacity: 0.9 }),
  );
  scene.add(edges);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let activePointerId = null;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let dragged = false;
  let animationId = 0;
  let initialHomeApplied = false;

  function cancelAnimation() {
    animationId += 1;
    controls.enabled = true;
  }

  function applyInitialHomeView() {
    if (initialHomeApplied) return;
    initialHomeApplied = true;

    const target = controls.target.clone();
    const currentDistance = camera.position.distanceTo(target);
    const distance = THREE.MathUtils.clamp(
      Math.max(INITIAL_MIN_DISTANCE, currentDistance * INITIAL_DISTANCE_FACTOR),
      controls.minDistance,
      controls.maxDistance,
    );

    camera.position.copy(target).addScaledVector(HOME_DIRECTION, distance);
    camera.lookAt(target);
    controls.update();
  }

  function animateToDirection(direction) {
    cancelAnimation();

    const safeDirection = direction.clone();
    if (safeDirection.lengthSq() === 0) safeDirection.copy(HOME_DIRECTION);

    // Stand zemininin altına geçmeyi engelle.
    if (safeDirection.y < 0.04) safeDirection.y = 0.04;
    if (Math.abs(safeDirection.x) < 1e-5 && Math.abs(safeDirection.z) < 1e-5) {
      safeDirection.z = 0.0001;
    }
    safeDirection.normalize();

    const target = controls.target.clone();
    const distance = THREE.MathUtils.clamp(
      camera.position.distanceTo(target),
      controls.minDistance,
      controls.maxDistance,
    );
    const startPosition = camera.position.clone();
    const endPosition = target.clone().addScaledVector(safeDirection, distance);
    const startedAt = performance.now();
    const ownAnimationId = ++animationId;
    controls.enabled = false;

    function frame(now) {
      if (ownAnimationId !== animationId) return;
      const progress = Math.min((now - startedAt) / VIEW_ANIMATION_MS, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - ((-2 * progress + 2) ** 3) / 2;

      camera.position.lerpVectors(startPosition, endPosition, eased);
      camera.lookAt(target);

      if (progress < 1) {
        requestAnimationFrame(frame);
        return;
      }

      controls.enabled = true;
      controls.update();
    }

    requestAnimationFrame(frame);
  }

  function rotateMainCamera(deltaX, deltaY) {
    cancelAnimation();

    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta -= deltaX * ROTATE_SPEED;
    spherical.phi = THREE.MathUtils.clamp(
      spherical.phi - deltaY * ROTATE_SPEED,
      Math.max(controls.minPolarAngle ?? 0, 0.025),
      Math.min(controls.maxPolarAngle ?? Math.PI, Math.PI - 0.025),
    );
    spherical.makeSafe();

    offset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(offset);
    camera.lookAt(controls.target);
    controls.update();
  }

  function directionFromIntersection(hit) {
    const point = cube.worldToLocal(hit.point.clone());
    const threshold = HALF_CUBE * 0.72;
    const direction = new THREE.Vector3(
      Math.abs(point.x) >= threshold ? Math.sign(point.x) : 0,
      Math.abs(point.y) >= threshold ? Math.sign(point.y) : 0,
      Math.abs(point.z) >= threshold ? Math.sign(point.z) : 0,
    );

    if (direction.lengthSq() > 0) return direction;

    switch (hit.face?.materialIndex) {
      case 0: return new THREE.Vector3(1, 0, 0);
      case 1: return new THREE.Vector3(-1, 0, 0);
      case 2: return new THREE.Vector3(0, 1, 0);
      case 3: return new THREE.Vector3(0, -1, 0);
      case 4: return new THREE.Vector3(0, 0, 1);
      case 5: return new THREE.Vector3(0, 0, -1);
      default: return HOME_DIRECTION.clone();
    }
  }

  function pickDirection(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, miniCamera);
    const hit = raycaster.intersectObject(cube, false)[0];
    return hit ? directionFromIntersection(hit) : null;
  }

  renderer.domElement.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    activePointerId = event.pointerId;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    dragged = false;
    renderer.domElement.setPointerCapture(event.pointerId);
    cancelAnimation();
    event.stopPropagation();
  });

  renderer.domElement.addEventListener('pointermove', (event) => {
    if (event.pointerId !== activePointerId) return;

    const totalX = event.clientX - pointerStartX;
    const totalY = event.clientY - pointerStartY;
    if (Math.hypot(totalX, totalY) >= CLICK_DRAG_THRESHOLD) dragged = true;

    if (dragged) {
      rotateMainCamera(event.clientX - lastPointerX, event.clientY - lastPointerY);
    }

    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    event.stopPropagation();
  });

  renderer.domElement.addEventListener('pointerup', (event) => {
    if (event.pointerId !== activePointerId) return;
    renderer.domElement.releasePointerCapture(event.pointerId);
    activePointerId = null;

    if (!dragged) {
      const direction = pickDirection(event);
      if (direction) animateToDirection(direction);
    }

    event.stopPropagation();
  });

  renderer.domElement.addEventListener('pointercancel', () => {
    activePointerId = null;
    dragged = false;
  });

  renderer.domElement.addEventListener('wheel', (event) => {
    event.preventDefault();
    event.stopPropagation();

    const target = controls.target;
    const offset = camera.position.clone().sub(target);
    const currentDistance = offset.length();
    const factor = event.deltaY > 0 ? 1.12 : 0.88;
    const nextDistance = THREE.MathUtils.clamp(
      currentDistance * factor,
      controls.minDistance,
      controls.maxDistance,
    );
    if (currentDistance > 0) offset.setLength(nextDistance);
    camera.position.copy(target).add(offset);
    controls.update();
  }, { passive: false });

  homeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    animateToDirection(HOME_DIRECTION);
  });

  function update({ applyInitial = true } = {}) {
    if (applyInitial) applyInitialHomeView();

    const offset = camera.position.clone().sub(controls.target);
    if (offset.lengthSq() === 0) offset.copy(HOME_DIRECTION);
    miniCamera.position.copy(offset.normalize().multiplyScalar(4.2));
    miniCamera.quaternion.copy(camera.quaternion);
    renderer.render(scene, miniCamera);
  }

  function dispose() {
    cancelAnimation();
    faceTextures.forEach((texture) => texture.dispose());
    materials.forEach((material) => material.dispose());
    geometry.dispose();
    edges.geometry.dispose();
    edges.material.dispose();
    renderer.dispose();
    root.remove();
  }

  // İlk senkron çizimde ana kameraya dokunma; main.js aynı çağrı akışında duvarı kuruyor.
  // İlk animation frame'de update() Home kadrajını duvar oluştuktan sonra uygular.
  update({ applyInitial: false });

  return {
    update,
    dispose,
    setViewDirection: animateToDirection,
  };
}

function createFaceTexture(label, accent) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  context.fillStyle = '#f8fafc';
  context.fillRect(0, 0, 256, 256);

  context.strokeStyle = '#94a3b8';
  context.lineWidth = 10;
  context.strokeRect(5, 5, 246, 246);

  context.fillStyle = accent;
  context.fillRect(0, 0, 256, 18);

  context.fillStyle = '#475569';
  context.font = '700 34px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, 128, 132);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
