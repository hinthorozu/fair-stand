import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STAND_DIMENSIONS } from './catalog.js';

const FRAME_COLOR = 0x9aa0a6;
const PANEL_BACK_COLOR = 0xf4f4f4;
const FLOOR_COLOR = 0xe9edf1;
const SELECTION_COLOR = 0x2563eb;

export function createStandScene(container, onSurfaceSelected, getAssetUrl = () => null) {
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

  // 30 metre alan / 30 bölme = her kare 1 m × 1 m.
  const grid = new THREE.GridHelper(30, 30, 0x7f8b99, 0xd0d6dc);
  grid.position.y = 0.002;
  scene.add(grid);

  const wallRoot = new THREE.Group();
  wallRoot.position.set(0, 0, 0);
  scene.add(wallRoot);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const textureLoader = new THREE.TextureLoader();
  let surfaceMeshes = [];
  const selectedSurfaces = new Set();

  function setSelectionVisual(mesh, selected) {
    if (!mesh) return;
    const frame = mesh.userData.selectionFrame;
    if (frame) frame.visible = selected;
    if (mesh.material?.emissive) {
      mesh.material.emissive.setHex(selected ? SELECTION_COLOR : 0x000000);
      mesh.material.emissiveIntensity = selected ? 0.08 : 0;
    }
  }

  function notifySelection() {
    onSurfaceSelected?.([...selectedSurfaces]);
  }

  function clearSelection({ notify = true } = {}) {
    selectedSurfaces.forEach((mesh) => setSelectionVisual(mesh, false));
    selectedSurfaces.clear();
    if (notify) notifySelection();
  }

  function selectOnly(mesh) {
    clearSelection({ notify: false });
    if (mesh) {
      selectedSurfaces.add(mesh);
      setSelectionVisual(mesh, true);
    }
    notifySelection();
  }

  function toggleSurface(mesh) {
    if (!mesh) return;
    if (selectedSurfaces.has(mesh)) {
      selectedSurfaces.delete(mesh);
      setSelectionVisual(mesh, false);
    } else {
      selectedSurfaces.add(mesh);
      setSelectionVisual(mesh, true);
    }
    notifySelection();
  }

  function disposeObject(object) {
    object.traverse((child) => {
      if (!child.isMesh && !child.isLineSegments) return;
      child.geometry?.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        material?.map?.dispose?.();
        material?.dispose?.();
      });
    });
  }

  function disposeWall({ notify = true } = {}) {
    clearSelection({ notify: false });
    surfaceMeshes = [];
    while (wallRoot.children.length) {
      const child = wallRoot.children.pop();
      disposeObject(child);
    }
    if (notify) notifySelection();
  }

  function clearWall() {
    disposeWall();
  }

  function buildWall(modules) {
    const selectedSurfaceIds = new Set(
      [...selectedSurfaces].map((mesh) => mesh.userData.surfaceId).filter(Boolean),
    );

    disposeWall({ notify: false });

    const totalWidth = modules.reduce((sum, module) => sum + module.widthCm / 100, 0);
    let cursorX = 0;

    modules.forEach((moduleState, moduleIndex) => {
      const module = createFlatPanelModule(
        moduleState,
        moduleIndex,
        (surface) => applyStoredImage(surface),
      );
      const widthM = moduleState.widthCm / 100;
      module.group.position.x = cursorX + widthM / 2;
      cursorX += widthM;
      wallRoot.add(module.group);
      surfaceMeshes.push(...module.surfaces);
    });

    surfaceMeshes.forEach((surface) => {
      if (selectedSurfaceIds.has(surface.userData.surfaceId)) {
        selectedSurfaces.add(surface);
        setSelectionVisual(surface, true);
      }
    });

    focusWall(totalWidth);
    notifySelection();
    return { totalWidth, surfaceCount: surfaceMeshes.length };
  }

  function focusWall(totalWidthM) {
    const centerX = totalWidthM / 2;
    const distance = Math.max(5.2, totalWidthM * 1.05);
    camera.position.set(centerX + totalWidthM * 0.28, 3.1, distance);
    controls.target.set(centerX, STAND_DIMENSIONS.height * 0.47, 0);
    controls.update();
  }

  function normalizeMeshes(meshOrMeshes) {
    if (!meshOrMeshes) return [];
    if (Array.isArray(meshOrMeshes)) return meshOrMeshes;
    if (meshOrMeshes instanceof Set) return [...meshOrMeshes];
    return [meshOrMeshes];
  }

  function applyColor(meshOrMeshes, hexColor) {
    normalizeMeshes(meshOrMeshes).forEach((mesh) => {
      if (!mesh?.material) return;
      const surfaceState = mesh.userData.surfaceState;
      if (surfaceState) surfaceState.color = hexColor;

      // Görsel varsa rengi alttaki panel state'inde sakla; görseli tint etme.
      if (!mesh.material.map) {
        mesh.material.color.set(hexColor);
        mesh.material.needsUpdate = true;
      }
    });
  }

  function configureTexture(texture, surfaceState) {
    const transform = surfaceState?.imageTransform ?? {};
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.center.set(0.5, 0.5);
    texture.offset.set(transform.offsetX ?? 0, transform.offsetY ?? 0);
    texture.repeat.set(transform.repeatX ?? 1, transform.repeatY ?? 1);
    texture.rotation = transform.rotation ?? 0;
    texture.needsUpdate = true;
  }

  function loadImageOnSurface(mesh, assetId) {
    const assetUrl = getAssetUrl(assetId);
    if (!mesh?.material || !assetUrl) return;

    textureLoader.load(
      assetUrl,
      (texture) => {
        if (!mesh.material) {
          texture.dispose();
          return;
        }
        configureTexture(texture, mesh.userData.surfaceState);
        mesh.material.map?.dispose?.();
        mesh.material.map = texture;
        mesh.material.color.set(0xffffff);
        mesh.material.needsUpdate = true;
      },
      undefined,
      () => {
        const stateColor = mesh.userData.surfaceState?.color ?? '#ffffff';
        if (mesh.material) mesh.material.color.set(stateColor);
      },
    );
  }

  function applyStoredImage(mesh) {
    const assetId = mesh.userData.surfaceState?.imageAssetId;
    if (assetId) loadImageOnSurface(mesh, assetId);
  }

  function applyImageAsset(meshOrMeshes, assetId) {
    if (!assetId) return;
    normalizeMeshes(meshOrMeshes).forEach((mesh) => {
      if (!mesh?.material) return;
      const surfaceState = mesh.userData.surfaceState;
      if (surfaceState) surfaceState.imageAssetId = assetId;
      loadImageOnSurface(mesh, assetId);
    });
  }

  function clearImage(meshOrMeshes) {
    normalizeMeshes(meshOrMeshes).forEach((mesh) => {
      if (!mesh?.material) return;
      const surfaceState = mesh.userData.surfaceState;
      if (surfaceState) surfaceState.imageAssetId = null;
      mesh.material.map?.dispose?.();
      mesh.material.map = null;
      mesh.material.color.set(surfaceState?.color ?? '#ffffff');
      mesh.material.needsUpdate = true;
    });
  }

  renderer.domElement.addEventListener('pointerdown', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(surfaceMeshes, false)[0];
    const multiSelect = event.ctrlKey || event.metaKey;

    if (hit) {
      if (multiSelect) toggleSurface(hit.object);
      else selectOnly(hit.object);
    } else if (!multiSelect) {
      clearSelection();
    }
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
    clearSelection,
    applyColor,
    applyImageAsset,
    clearImage,
    getSelectedSurface: () => [...selectedSurfaces][0] ?? null,
    getSelectedSurfaces: () => [...selectedSurfaces],
  };
}

function createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady) {
  const {
    height,
    depth,
    stripCount,
    stripHeight,
    frameWidth,
    frameDepth,
  } = STAND_DIMENSIONS;

  const widthCm = moduleState.widthCm;
  const widthM = widthCm / 100;
  const group = new THREE.Group();
  group.userData = { kind: 'module', moduleIndex, moduleId: moduleState.id, widthCm };

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
    const surfaceState = moduleState.strips[stripIndex];

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(innerWidth, panelHeight, panelDepth),
      new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.74 }),
    );
    backing.position.set(0, centerY, 0);
    backing.castShadow = true;
    backing.receiveShadow = true;
    group.add(backing);

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(innerWidth, panelHeight),
      new THREE.MeshStandardMaterial({
        color: surfaceState.imageAssetId ? 0xffffff : surfaceState.color,
        roughness: 0.72,
        metalness: 0,
        side: THREE.DoubleSide,
        emissive: 0x000000,
        emissiveIntensity: 0,
      }),
    );
    surface.position.set(0, centerY, depth / 2 + 0.0015);

    const selectionFrame = createSelectionFrame(innerWidth, panelHeight);
    selectionFrame.visible = false;
    surface.add(selectionFrame);

    surface.userData = {
      kind: 'surface',
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex,
      stripNumber: stripIndex + 1,
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  }

  return { group, surfaces };
}

function createSelectionFrame(width, height) {
  const group = new THREE.Group();
  group.position.z = 0.006;
  group.renderOrder = 100;

  const material = new THREE.MeshBasicMaterial({
    color: SELECTION_COLOR,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
  const thickness = 0.022;
  const extra = 0.03;

  const horizontalGeometry = new THREE.BoxGeometry(width + extra, thickness, 0.004);
  const verticalGeometry = new THREE.BoxGeometry(thickness, height + extra, 0.004);

  const top = new THREE.Mesh(horizontalGeometry.clone(), material.clone());
  top.position.y = height / 2 + thickness / 2;
  const bottom = new THREE.Mesh(horizontalGeometry.clone(), material.clone());
  bottom.position.y = -height / 2 - thickness / 2;
  const left = new THREE.Mesh(verticalGeometry.clone(), material.clone());
  left.position.x = -width / 2 - thickness / 2;
  const right = new THREE.Mesh(verticalGeometry.clone(), material.clone());
  right.position.x = width / 2 + thickness / 2;

  [top, bottom, left, right].forEach((part) => {
    part.renderOrder = 100;
    group.add(part);
  });

  return group;
}
