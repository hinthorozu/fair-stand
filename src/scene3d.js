import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STAND_DIMENSIONS } from './catalog.js';

const FRAME_COLOR = 0x9aa0a6;
const PANEL_COLOR = 0xd9dde2;
const FLOOR_COLOR = 0xe9edf1;

export function createStandScene(container, onSurfaceSelected) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f6f8);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
  camera.position.set(4.8, 3.4, 6.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1.65, 0);
  controls.minDistance = 2;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI * 0.49;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x7f8790, 2.1));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(5, 8, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  scene.add(keyLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: FLOOR_COLOR, roughness: 0.92 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(30, 60, 0xbcc3ca, 0xd9dee3);
  grid.position.y = 0.002;
  scene.add(grid);

  const wallRoot = new THREE.Group();
  scene.add(wallRoot);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let surfaceMeshes = [];
  let selectedSurface = null;

  function clearSelection() {
    if (selectedSurface?.material?.emissive) {
      selectedSurface.material.emissive.setHex(0x000000);
      selectedSurface.material.emissiveIntensity = 0;
    }
    selectedSurface = null;
  }

  function selectSurface(mesh) {
    clearSelection();
    selectedSurface = mesh;
    if (mesh?.material?.emissive) {
      mesh.material.emissive.setHex(0x1d4ed8);
      mesh.material.emissiveIntensity = 0.16;
    }
    onSurfaceSelected?.(mesh);
  }

  function disposeObject(object) {
    object.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry?.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        material?.map?.dispose?.();
        material?.dispose?.();
      });
    });
  }

  function clearWall() {
    clearSelection();
    onSurfaceSelected?.(null);
    surfaceMeshes = [];
    while (wallRoot.children.length) {
      const child = wallRoot.children.pop();
      disposeObject(child);
    }
  }

  function buildWall(widthsCm) {
    clearWall();

    const totalWidth = widthsCm.reduce((sum, widthCm) => sum + widthCm / 100, 0);
    let cursorX = -totalWidth / 2;

    widthsCm.forEach((widthCm, moduleIndex) => {
      const module = createFlatPanelModule(widthCm, moduleIndex);
      const widthM = widthCm / 100;
      module.group.position.x = cursorX + widthM / 2;
      cursorX += widthM;
      wallRoot.add(module.group);
      surfaceMeshes.push(...module.surfaces);
    });

    focusWall(totalWidth);
    return { totalWidth, surfaceCount: surfaceMeshes.length };
  }

  function focusWall(totalWidthM) {
    const distance = Math.max(5.2, totalWidthM * 1.05);
    camera.position.set(totalWidthM * 0.28, 3.1, distance);
    controls.target.set(0, STAND_DIMENSIONS.height * 0.47, 0);
    controls.update();
  }

  function applyColor(mesh, hexColor) {
    if (!mesh?.material) return;
    mesh.material.color.set(hexColor);
    mesh.material.needsUpdate = true;
  }

  function applyImage(mesh, file) {
    if (!mesh?.material || !file) return;

    const objectUrl = URL.createObjectURL(file);
    const loader = new THREE.TextureLoader();
    loader.load(
      objectUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        mesh.material.map?.dispose?.();
        mesh.material.map = texture;
        mesh.material.color.set(0xffffff);
        mesh.material.needsUpdate = true;
        URL.revokeObjectURL(objectUrl);
      },
      undefined,
      () => URL.revokeObjectURL(objectUrl),
    );
  }

  function clearImage(mesh) {
    if (!mesh?.material) return;
    mesh.material.map?.dispose?.();
    mesh.material.map = null;
    mesh.material.needsUpdate = true;
  }

  renderer.domElement.addEventListener('pointerdown', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(surfaceMeshes, false)[0];
    if (hit) selectSurface(hit.object);
  });

  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  return {
    buildWall,
    clearWall,
    applyColor,
    applyImage,
    clearImage,
    getSelectedSurface: () => selectedSurface,
  };
}

function createFlatPanelModule(widthCm, moduleIndex) {
  const {
    height,
    depth,
    stripCount,
    stripHeight,
    frameWidth,
    frameDepth,
  } = STAND_DIMENSIONS;

  const widthM = widthCm / 100;
  const group = new THREE.Group();
  group.userData = { kind: 'module', moduleIndex, widthCm };

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });

  const profileGeometry = new THREE.BoxGeometry(frameWidth, height, frameDepth);
  for (const side of [-1, 1]) {
    const profile = new THREE.Mesh(profileGeometry.clone(), frameMaterial.clone());
    profile.position.set(side * (widthM / 2 - frameWidth / 2), height / 2, 0);
    profile.castShadow = true;
    group.add(profile);
  }

  const railHeight = 0.026;
  const railGeometry = new THREE.BoxGeometry(
    Math.max(widthM - frameWidth * 2, 0.02),
    railHeight,
    frameDepth,
  );

  for (let i = 0; i <= stripCount; i += 1) {
    const rail = new THREE.Mesh(railGeometry.clone(), frameMaterial.clone());
    rail.position.set(0, i * stripHeight, 0);
    rail.castShadow = true;
    group.add(rail);
  }

  const surfaces = [];
  const innerWidth = Math.max(widthM - frameWidth * 2 - 0.012, 0.02);
  const panelHeight = stripHeight - railHeight - 0.012;
  const panelDepth = Math.max(depth - 0.026, 0.035);

  for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
    const centerY = stripIndex * stripHeight + stripHeight / 2;

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(innerWidth, panelHeight, panelDepth),
      new THREE.MeshStandardMaterial({ color: 0xcfd4d9, roughness: 0.74 }),
    );
    backing.position.set(0, centerY, 0);
    backing.castShadow = true;
    backing.receiveShadow = true;
    group.add(backing);

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(innerWidth, panelHeight),
      new THREE.MeshStandardMaterial({
        color: PANEL_COLOR,
        roughness: 0.72,
        metalness: 0,
        side: THREE.DoubleSide,
        emissive: 0x000000,
        emissiveIntensity: 0,
      }),
    );
    surface.position.set(0, centerY, depth / 2 + 0.0015);
    surface.userData = {
      kind: 'surface',
      moduleIndex,
      widthCm,
      stripIndex,
      stripNumber: stripIndex + 1,
    };
    group.add(surface);
    surfaces.push(surface);
  }

  return { group, surfaces };
}
