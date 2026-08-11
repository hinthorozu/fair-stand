import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SHELF_DIMENSIONS, STAND_DIMENSIONS } from './catalog.js';
import { createHorizontalImageLayout } from './horizontalImageLayout.js';
import { createRectImageLayout } from './rectImageLayout.js';
import { createRectSelection } from './rectSelection.js';
import { applyColorOverride, createDefaultImageTransform } from './designState.js';
import { createViewCube } from './viewCube.js';
import { computeImageFit } from './imageFit.js';
import { formatPlacementFeedbackMessage, hasPlacementFeedbackPointer } from './placementFeedback.js';
import {
  createModulePlacement,
  getAllowedWallIds,
  isVerticalModuleRotation,
  normalizeModuleRotationZDeg,
  rotateModuleRotationZDeg,
  rotateModulePlacementAroundCenter,
  snapPlacementToStand,
  snapPlacementToModules,
  validatePlacementAgainstModules,
} from './modulePlacement.js';
import {
  planContinuousModuleInsert,
  planContinuousModuleMove,
} from './moduleMove.js';

const FRAME_COLOR = 0x9aa0a6;
const PANEL_BACK_COLOR = 0x4b5563;
const PANEL_RAIL_HEIGHT_M = 0.004;
const PANEL_VERTICAL_CLEARANCE_M = 0;
const PANEL_VERTICAL_PROFILE_WIDTH_M = 0.040;
const GLASS_SURFACE_COLOR = 0xd7e9ed;
const GLASS_BACK_COLOR = 0xc9dce1;
const GLASS_SURFACE_OPACITY = 0.48;
const GLASS_BACK_OPACITY = 0.18;
const FLOOR_COLOR = 0xe9edf1;
const OUTER_FLOOR_COLOR = 0xd2d8df;
const GRID_COLOR = 0xb8c1cb;
const STAND_BORDER_COLOR = 0x6f7a87;
const ACTIVE_WALL_GUIDE_COLOR = 0xf97316;
const ACTIVE_WALL_GUIDE_THICKNESS_M = 0.045;
const ACTIVE_WALL_GUIDE_HEIGHT_M = 0.018;
const STAGE_SURROUND_M = 1;
const SELECTION_COLOR = 0x2563eb;
const PLACEMENT_VALID_COLOR = 0x16a34a;
const PLACEMENT_INVALID_COLOR = 0xdc2626;
const PLACEMENT_GHOST_OPACITY = 0.3;
const DRAG_THRESHOLD_PX = 5;
const DEFAULT_VIEW_MIN_DISTANCE = 9;
const DEFAULT_VIEW_DISTANCE_FACTOR = 1.32;
const HOME_DIRECTION = new THREE.Vector3(1, 0.72, 1).normalize();
const STAGE_HOME_DIRECTION = new THREE.Vector3(1, 1.05, 1).normalize();

function isFloorFixtureType(type) {
  return type === 'counter' || type === 'base' || type === 'sofa-set';
}

export function createStandScene(
  container,
  onSurfaceSelected,
  getAssetUrl = () => null,
  onModuleContextMenu = () => {},
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f6f8);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 2000);
  camera.position.set(4.8, 3.4, 6.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.panSpeed = 1.15;
  controls.target.set(0, 1.65, 0);
  controls.minDistance = 2;
  controls.maxDistance = 1000;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
  controls.mouseButtons.MIDDLE = THREE.MOUSE.PAN;
  controls.mouseButtons.RIGHT = null;

  const viewCube = createViewCube(container, camera, controls);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x7f8790, 2.1));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(5, 8, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  scene.add(keyLight);

  const outerFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({ color: OUTER_FLOOR_COLOR, roughness: 0.94 }),
  );
  outerFloor.rotation.x = -Math.PI / 2;
  outerFloor.receiveShadow = true;
  outerFloor.visible = false;
  scene.add(outerFloor);

  const activeFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({ color: FLOOR_COLOR, roughness: 0.92 }),
  );
  activeFloor.rotation.x = -Math.PI / 2;
  activeFloor.receiveShadow = true;
  activeFloor.visible = false;
  scene.add(activeFloor);

  let grid = null;
  let standOutline = null;
  let activeWallGuides = [];
  let stageLayout = null;

  function disposeGroundObject(object) {
    if (!object) return;
    scene.remove(object);
    object.geometry?.dispose?.();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => material?.dispose?.());
  }

  function disposeGroundGuides() {
    disposeGroundObject(grid);
    disposeGroundObject(standOutline);
    activeWallGuides.forEach(disposeGroundObject);
    grid = null;
    standOutline = null;
    activeWallGuides = [];
  }

  function collectGridValues(lengthM) {
    const values = [-STAGE_SURROUND_M, 0, lengthM, lengthM + STAGE_SURROUND_M];
    for (let value = 1; value < lengthM; value += 1) values.push(value);
    return [...new Set(values.map((value) => Number(value.toFixed(6))))]
      .sort((a, b) => a - b);
  }

  function createRectangularGrid(widthM, depthM) {
    const leftX = -STAGE_SURROUND_M;
    const rightX = widthM + STAGE_SURROUND_M;
    const backZ = -STAGE_SURROUND_M;
    const frontZ = depthM + STAGE_SURROUND_M;
    const positions = [];

    collectGridValues(widthM).forEach((x) => {
      positions.push(x, 0.004, backZ, x, 0.004, frontZ);
    });
    collectGridValues(depthM).forEach((z) => {
      positions.push(leftX, 0.004, z, rightX, 0.004, z);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({ color: GRID_COLOR }),
    );
  }

  function createStandOutline(widthM, depthM) {
    const positions = [
      0, 0.008, 0, widthM, 0.008, 0,
      widthM, 0.008, 0, widthM, 0.008, depthM,
      widthM, 0.008, depthM, 0, 0.008, depthM,
      0, 0.008, depthM, 0, 0.008, 0,
    ];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({ color: STAND_BORDER_COLOR }),
    );
  }

  function createActiveWallGuides(standType, widthM, depthM) {
    const wallIds = getAllowedWallIds(standType).filter(
      (wallId) => wallId === 'back' || wallId === 'left' || wallId === 'right',
    );

    return wallIds.map((wallId) => {
      const alongX = wallId === 'back';
      const lengthM = alongX ? widthM : depthM;
      const guide = new THREE.Mesh(
        new THREE.BoxGeometry(
          alongX ? lengthM : ACTIVE_WALL_GUIDE_THICKNESS_M,
          ACTIVE_WALL_GUIDE_HEIGHT_M,
          alongX ? ACTIVE_WALL_GUIDE_THICKNESS_M : lengthM,
        ),
        new THREE.MeshBasicMaterial({
          color: ACTIVE_WALL_GUIDE_COLOR,
          depthWrite: false,
          toneMapped: false,
        }),
      );

      if (wallId === 'back') {
        guide.position.set(widthM / 2, 0.02, 0);
      } else if (wallId === 'left') {
        guide.position.set(0, 0.02, depthM / 2);
      } else {
        guide.position.set(widthM, 0.02, depthM / 2);
      }

      guide.renderOrder = 20;
      return guide;
    });
  }

  function createStage({ widthCm, depthCm, standType = null, resetView = true } = {}) {
    const widthM = Number(widthCm) / 100;
    const depthM = Number(depthCm) / 100;
    if (!Number.isFinite(widthM) || !Number.isFinite(depthM) || widthM <= 0 || depthM <= 0) {
      return { ok: false, message: 'Geçerli bir X ve Y ölçüsü gerekli.' };
    }

    disposeWall();
    disposeGroundGuides();
    clearPlacementDrag();

    const sceneWidthM = widthM + STAGE_SURROUND_M * 2;
    const sceneDepthM = depthM + STAGE_SURROUND_M * 2;
    const centerX = widthM / 2;
    const centerZ = depthM / 2;

    outerFloor.scale.set(sceneWidthM, sceneDepthM, 1);
    outerFloor.position.set(centerX, 0, centerZ);
    outerFloor.visible = true;

    activeFloor.scale.set(widthM, depthM, 1);
    activeFloor.position.set(centerX, 0.002, centerZ);
    activeFloor.visible = true;

    grid = createRectangularGrid(widthM, depthM);
    standOutline = createStandOutline(widthM, depthM);
    activeWallGuides = createActiveWallGuides(standType, widthM, depthM);
    scene.add(grid, standOutline, ...activeWallGuides);

    stageLayout = {
      standType,
      widthM,
      depthM,
      widthCm: Math.round(widthM * 100),
      depthCm: Math.round(depthM * 100),
      sceneWidthM,
      sceneDepthM,
      surroundM: STAGE_SURROUND_M,
    };

    if (resetView) resetStageView();
    return { ok: true, ...stageLayout };
  }

  const wallRoot = new THREE.Group();
  wallRoot.position.set(0, 0, 0);
  scene.add(wallRoot);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const textureLoader = new THREE.TextureLoader();
  let surfaceMeshes = [];
  const selectedSurfaces = new Set();
  let selectionAnchorSurfaceId = null;
  let placementGhost = null;
  let dragSession = null;
  let dragBadge = null;
  let placementFeedback = null;
  let placementFeedbackTimer = null;

  function clearPlacementFeedback() {
    if (placementFeedbackTimer) {
      window.clearTimeout(placementFeedbackTimer);
      placementFeedbackTimer = null;
    }
    placementFeedback?.remove?.();
    placementFeedback = null;
  }

  function showPlacementFeedback(message, { clientX = null, clientY = null, durationMs = 1800 } = {}) {
    const text = formatPlacementFeedbackMessage(message);
    if (!text) {
      clearPlacementFeedback();
      return;
    }

    if (placementFeedbackTimer) {
      window.clearTimeout(placementFeedbackTimer);
      placementFeedbackTimer = null;
    }

    if (!placementFeedback) {
      placementFeedback = document.createElement('div');
      placementFeedback.style.cssText = [
        'position:fixed',
        'z-index:10002',
        'max-width:320px',
        'padding:8px 11px',
        'border:1px solid rgba(220,38,38,.35)',
        'border-radius:9px',
        'background:rgba(127,29,29,.94)',
        'box-shadow:0 8px 24px rgba(15,23,42,.2)',
        'color:#fff',
        'font:600 12px/1.35 system-ui,sans-serif',
        'pointer-events:none',
        'user-select:none',
      ].join(';');
      document.body.appendChild(placementFeedback);
    }

    placementFeedback.textContent = text;
    const rect = renderer.domElement.getBoundingClientRect();
    const hasPointer = hasPlacementFeedbackPointer(clientX, clientY);
    const rawX = hasPointer ? Number(clientX) + 18 : rect.left + rect.width / 2;
    const rawY = hasPointer ? Number(clientY) + 18 : rect.top + 72;
    const x = Math.min(window.innerWidth - 20, Math.max(20, rawX));
    const y = Math.min(window.innerHeight - 52, Math.max(12, rawY));
    placementFeedback.style.left = `${x}px`;
    placementFeedback.style.top = `${y}px`;
    placementFeedback.style.transform = hasPointer ? 'none' : 'translateX(-50%)';

    if (durationMs > 0) {
      placementFeedbackTimer = window.setTimeout(() => {
        clearPlacementFeedback();
      }, durationMs);
    }
  }

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

  function clearSelection({ notify = true, keepAnchor = false } = {}) {
    selectedSurfaces.forEach((mesh) => setSelectionVisual(mesh, false));
    selectedSurfaces.clear();
    if (!keepAnchor) selectionAnchorSurfaceId = null;
    if (notify) notifySelection();
  }

  function selectOnly(mesh) {
    clearSelection({ notify: false });
    if (mesh) {
      selectedSurfaces.add(mesh);
      selectionAnchorSurfaceId = mesh.userData.surfaceId ?? null;
      setSelectionVisual(mesh, true);
    }
    notifySelection();
  }

  function selectRectangleTo(mesh) {
    if (!mesh) return;

    const anchorMesh = surfaceMeshes.find(
      (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,
    ) ?? [...selectedSurfaces][0] ?? mesh;

    if (!selectionAnchorSurfaceId) {
      selectionAnchorSurfaceId = anchorMesh.userData.surfaceId ?? null;
    }

    const result = createRectSelection(
      surfaceMeshes
        .filter((surface) => surface.userData.selectionMode !== 'module')
        .map((surface) => ({
          mesh: surface,
          moduleIndex: surface.userData.moduleIndex,
          stripIndex: surface.userData.stripIndex,
        })),
      anchorMesh.userData,
      mesh.userData,
    );

    if (!result.ok) return;

    clearSelection({ notify: false, keepAnchor: true });
    result.entries.forEach((entry) => {
      selectedSurfaces.add(entry.mesh);
      setSelectionVisual(entry.mesh, true);
    });
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

  function disposeWall({ notify = true, keepAnchor = false } = {}) {
    clearSelection({ notify: false, keepAnchor });
    surfaceMeshes = [];
    while (wallRoot.children.length) {
      const child = wallRoot.children.pop();
      disposeObject(child);
    }
    if (notify) notifySelection();
  }

  function clearWall({ resetView = true } = {}) {
    clearPlacementDrag();
    disposeWall();
    if (resetView) {
      if (stageLayout) resetStageView();
      else resetDefaultView(0);
    }
  }

  function applyPlacementToGroup(group, placement, widthCm) {
    if (!group || !placement) return;
    const widthM = Number(widthCm) / 100;
    const xM = Number(placement.xCm) / 100;
    const logicalYM = Number(placement.yCm) / 100;
    const logicalZM = Number(placement.zCm ?? 0) / 100;
    const rotationZDeg = normalizeModuleRotationZDeg(placement.rotationZDeg);
    const vertical = isVerticalModuleRotation(rotationZDeg);

    // Logical Z etrafındaki plan dönüşü Three.js world-Y yaw olarak uygulanır.
    // 0=ön, 90=sağ, 180=arka, 270=sol. Ön yüz artık wallId hilesiyle değil
    // doğrudan rotationZDeg state'iyle belirlenir.
    group.rotation.set(0, THREE.MathUtils.degToRad(rotationZDeg), 0);

    if (vertical) {
      group.position.set(xM, logicalZM, logicalYM + widthM / 2);
    } else {
      group.position.set(xM + widthM / 2, logicalZM, logicalYM);
    }

  }

  function buildWall(modules, { resetView = true } = {}) {
    const selectedSurfaceIds = new Set(
      [...selectedSurfaces].map((mesh) => mesh.userData.surfaceId).filter(Boolean),
    );
    const previousAnchorSurfaceId = selectionAnchorSurfaceId;

    clearPlacementDrag();
    disposeWall({ notify: false, keepAnchor: true });

    const totalWidth = modules.reduce((sum, module) => sum + module.widthCm / 100, 0);
    let cursorX = 0;
    let hasMultiEdgePlacement = false;

    modules.forEach((moduleState, moduleIndex) => {
      let module;
      if (moduleState.type === 'separator') {
        module = createSeparatorModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'base') {
        module = createBaseModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else if (moduleState.type === 'counter') {
        module = createCounterModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else if (moduleState.type === 'sofa-set') {
        module = createSofaSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'shelf') {
        module = createShelfModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else if (moduleState.type === 'door') {
        module = createDoorModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else if (moduleState.type === 'showcase-2' || moduleState.type === 'showcase-3') {
        module = createShowcaseModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else {
        module = createFlatPanelModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      }

      const widthCm = Number(moduleState.widthCm);
      let placement = moduleState.placement;
      if (!placement) {
        placement = createModulePlacement({
          xCm: Math.round(cursorX * 100),
          yCm: 0,
          zCm: 0,
          rotationZDeg: 0,
          wallId: 'back',
        });
        moduleState.placement = placement;
      }

      if (placement.wallId === 'back' && !isVerticalModuleRotation(placement.rotationZDeg)) {
        cursorX = Math.max(cursorX, (Number(placement.xCm) + widthCm) / 100);
      } else {
        hasMultiEdgePlacement = true;
      }

      module.group.userData.moduleState = moduleState;
      module.group.userData.placement = { ...placement };
      applyPlacementToGroup(module.group, placement, widthCm);
      wallRoot.add(module.group);
      surfaceMeshes.push(...module.surfaces);
    });

    surfaceMeshes.forEach((surface) => {
      if (selectedSurfaceIds.has(surface.userData.surfaceId)) {
        selectedSurfaces.add(surface);
        setSelectionVisual(surface, true);
      }
    });

    selectionAnchorSurfaceId = surfaceMeshes.some(
      (surface) => surface.userData.surfaceId === previousAnchorSurfaceId,
    )
      ? previousAnchorSurfaceId
      : ([...selectedSurfaces][0]?.userData.surfaceId ?? null);

    if (resetView) {
      if (hasMultiEdgePlacement && stageLayout) resetStageView();
      else resetDefaultView(totalWidth);
    }
    notifySelection();
    return { totalWidth, surfaceCount: surfaceMeshes.length };
  }

  function resetStageView() {
    if (!stageLayout) return;
    const target = new THREE.Vector3(
      stageLayout.widthM / 2,
      0.12,
      stageLayout.depthM / 2,
    );
    const span = Math.hypot(stageLayout.sceneWidthM, stageLayout.sceneDepthM);
    const distance = Math.max(7, span * 0.92);

    controls.target.copy(target);
    camera.position.copy(target).addScaledVector(STAGE_HOME_DIRECTION, distance);
    camera.lookAt(target);
    controls.update();
  }

  function resetDefaultView(totalWidthM = 0) {
    const centerX = totalWidthM / 2;
    const target = new THREE.Vector3(
      centerX,
      STAND_DIMENSIONS.height * 0.47,
      0,
    );
    const distance = Math.max(
      DEFAULT_VIEW_MIN_DISTANCE,
      totalWidthM * DEFAULT_VIEW_DISTANCE_FACTOR,
    );

    controls.target.copy(target);
    camera.position.copy(target).addScaledVector(HOME_DIRECTION, distance);
    camera.lookAt(target);
    controls.update();
  }

  function setPointerFromClient(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  function findModuleGroup(object) {
    let current = object;
    while (current && current !== wallRoot) {
      if (current.userData?.kind === 'module') return current;
      current = current.parent;
    }
    return null;
  }

  function pickModuleAt(clientX, clientY) {
    setPointerFromClient(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(wallRoot.children, true);
    for (const hit of hits) {
      const moduleGroup = findModuleGroup(hit.object);
      if (moduleGroup) return { moduleGroup, hit };
    }
    return null;
  }

  function getGroundPoint(clientX, clientY) {
    if (!activeFloor.visible) return null;
    setPointerFromClient(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(activeFloor, false)[0];
    if (!hit) return null;
    return {
      xCm: hit.point.x * 100,
      yCm: hit.point.z * 100,
    };
  }

  function pickModuleContext(event) {
    const picked = pickModuleAt(event.clientX, event.clientY);
    if (!picked) return null;

    const { moduleGroup, hit } = picked;
    const surface = hit.object.userData?.kind === 'surface' ? hit.object : null;
    const supportsGlass = surface?.userData.selectionMode === 'panel';
    return {
      moduleIndex: moduleGroup.userData.moduleIndex,
      moduleId: moduleGroup.userData.moduleId,
      type: moduleGroup.userData.type,
      widthCm: moduleGroup.userData.widthCm,
      placement: moduleGroup.userData.moduleState?.placement
        ? { ...moduleGroup.userData.moduleState.placement }
        : null,
      surfaceId: supportsGlass ? surface.userData.surfaceId : null,
      stripIndex: supportsGlass ? surface.userData.stripIndex : null,
      stripNumber: supportsGlass ? surface.userData.stripNumber : null,
      supportsGlass,
      isGlass: supportsGlass ? Boolean(surface.userData.surfaceState?.isGlass) : false,
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }

  function disposePlacementGhost() {
    if (!placementGhost) return;
    scene.remove(placementGhost.root);
    placementGhost.mesh.geometry?.dispose?.();
    placementGhost.mesh.material?.dispose?.();
    placementGhost = null;
  }

  function getPlacementGhostDimensions(moduleOrWidthCm) {
    if (typeof moduleOrWidthCm === 'object' && moduleOrWidthCm) {
      return {
        widthCm: Number(moduleOrWidthCm.widthCm),
        depthM: Math.max(Number(moduleOrWidthCm.depthCm ?? (STAND_DIMENSIONS.depth * 100)) / 100, 0.02),
        heightM: Math.max(Number(moduleOrWidthCm.heightCm ?? (STAND_DIMENSIONS.height * 100)) / 100, 0.02),
      };
    }
    return {
      widthCm: Number(moduleOrWidthCm),
      depthM: Math.max(STAND_DIMENSIONS.depth, 0.08),
      heightM: STAND_DIMENSIONS.height,
    };
  }

  function ensurePlacementGhost(moduleOrWidthCm) {
    const dimensions = getPlacementGhostDimensions(moduleOrWidthCm);
    const key = [dimensions.widthCm, dimensions.depthM, dimensions.heightM].join(':');
    if (placementGhost?.key === key) return placementGhost;
    disposePlacementGhost();

    const root = new THREE.Group();
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(dimensions.widthCm / 100, 0.02),
        dimensions.heightM,
        dimensions.depthM,
      ),
      new THREE.MeshBasicMaterial({
        color: PLACEMENT_VALID_COLOR,
        transparent: true,
        opacity: PLACEMENT_GHOST_OPACITY,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      }),
    );
    mesh.renderOrder = 10000;
    mesh.position.y = dimensions.heightM / 2;
    root.add(mesh);
    scene.add(root);
    placementGhost = { root, mesh, key, widthCm: dimensions.widthCm };
    return placementGhost;
  }

  function showPlacementGhost(moduleOrWidthCm, placement, valid) {
    const ghost = ensurePlacementGhost(moduleOrWidthCm);
    ghost.mesh.material.color.setHex(valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR);
    applyPlacementToGroup(ghost.root, placement, ghost.widthCm);
    ghost.root.visible = true;
  }

  function getDragModuleLabel(moduleState) {
    const widthCm = Number(moduleState?.widthCm) || 0;
    if (moduleState?.type === 'shelf') return 'Raf ' + widthCm + ' · ' + (Number(moduleState.shelfCount) || 2) + ' Raf';
    if (moduleState?.type === 'sofa-set') return 'Koltuk Takımı';
    if (moduleState?.type === 'base') return `Baza ${widthCm}`;
    if (moduleState?.type === 'counter') return `Banko ${widthCm}`;
    if (moduleState?.type === 'separator') return `Separatör ${widthCm}`;
    if (moduleState?.type === 'door') return `Kapı ${widthCm}`;
    if (moduleState?.type === 'showcase-3') return `3 Gözlü Vitrin ${widthCm}`;
    if (moduleState?.type === 'showcase-2') return `2 Gözlü Vitrin ${widthCm}`;
    return `Düz Panel ${widthCm}`;
  }

  function disposeDragBadge() {
    dragBadge?.remove?.();
    dragBadge = null;
  }

  function updateDragBadge(moduleState, clientX, clientY) {
    if (!dragBadge) {
      dragBadge = document.createElement('div');
      dragBadge.style.cssText = [
        'position:fixed',
        'z-index:10000',
        'display:flex',
        'align-items:center',
        'gap:8px',
        'padding:7px 9px',
        'border:1px solid #d9dee5',
        'border-radius:9px',
        'background:rgba(255,255,255,.94)',
        'box-shadow:0 8px 24px rgba(15,23,42,.16)',
        'color:#364152',
        'font:600 11px/1.2 system-ui,sans-serif',
        'pointer-events:none',
        'user-select:none',
      ].join(';');

      const preview = document.createElement('div');
      preview.dataset.role = 'preview';
      preview.style.cssText = [
        'width:24px',
        'height:48px',
        'box-sizing:border-box',
        'border:2px solid #8a929a',
        'background:repeating-linear-gradient(to bottom,#f7f7f5 0 5px,#c4c9ce 5px 6px)',
      ].join(';');

      const label = document.createElement('span');
      label.dataset.role = 'label';
      dragBadge.append(preview, label);
      document.body.appendChild(dragBadge);
    }

    const preview = dragBadge.querySelector('[data-role="preview"]');
    const label = dragBadge.querySelector('[data-role="label"]');
    if (label) label.textContent = getDragModuleLabel(moduleState);
    if (preview) {
      preview.style.height = moduleState?.type === 'sofa-set' ? '34px' : (moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px'));
      if (moduleState?.type === 'sofa-set') {
        preview.style.background = 'linear-gradient(to bottom,#f8fafc 0 45%,#9aa0a6 45% 52%,#f8fafc 52% 100%)';
      } else if (moduleState?.type === 'shelf') {
        preview.style.background = moduleState.shelfCount === 3
          ? 'linear-gradient(to bottom,#f7f7f5 0 40%,#ffffff 40% 45%,#c4c9ce 45% 46%,#f7f7f5 46% 55%,#ffffff 55% 60%,#c4c9ce 60% 61%,#f7f7f5 61% 70%,#ffffff 70% 75%,#c4c9ce 75% 76%,#f7f7f5 76% 100%)'
          : 'linear-gradient(to bottom,#f7f7f5 0 55%,#ffffff 55% 60%,#c4c9ce 60% 61%,#f7f7f5 61% 70%,#ffffff 70% 75%,#c4c9ce 75% 76%,#f7f7f5 76% 100%)';
      } else if (moduleState?.type === 'base') {
        preview.style.background = 'linear-gradient(to bottom,#ffffff 0 20%,#9aa0a6 20% 29%,#f8fafc 29% 86%,#9aa0a6 86% 100%)';
      } else if (moduleState?.type === 'counter') {
        preview.style.background = 'linear-gradient(to bottom,#eef2f6 0 16%,#d1d5db 16% 20%,#f8fafc 20% 100%)';
      } else if (moduleState?.type === 'separator') {
        preview.style.background = 'repeating-linear-gradient(to bottom,#c79b63 0 2px,#eef2f6 2px 4px)';
      } else if (moduleState?.type === 'door') {
        preview.style.background = 'linear-gradient(to bottom,#f7f7f5 0 40%,#8a929a 40% 44%,#e5e7eb 44% 100%)';
      } else if (moduleState?.type === 'showcase-2' || moduleState?.type === 'showcase-3') {
        preview.style.background = 'linear-gradient(to bottom,#f7f7f5 0 32%,#d8eadb 32% 72%,#f7f7f5 72% 100%)';
      } else {
        preview.style.background = 'repeating-linear-gradient(to bottom,#f7f7f5 0 5px,#c4c9ce 5px 6px)';
      }
    }

    dragBadge.style.left = `${clientX + 18}px`;
    dragBadge.style.top = `${clientY + 18}px`;
  }

  function clearPlacementDrag() {
    if (dragSession?.moduleGroup) dragSession.moduleGroup.visible = true;
    dragSession = null;
    controls.enabled = true;
    disposePlacementGhost();
    disposeDragBadge();
    clearPlacementFeedback();
  }

  function getRenderedModuleStates() {
    return wallRoot.children
      .map((group) => group.userData?.moduleState)
      .filter(Boolean);
  }

  function inferWallIdForRotation(placement, rotationZDeg) {
    if (!stageLayout || !placement) return 'free';
    const allowedWalls = getAllowedWallIds(stageLayout.standType);
    const vertical = isVerticalModuleRotation(rotationZDeg);
    const xCm = Number(placement.xCm);
    const yCm = Number(placement.yCm);
    const epsilonCm = 0.001;

    if (!vertical && Math.abs(yCm) <= epsilonCm && allowedWalls.includes('back')) {
      return 'back';
    }
    if (vertical && Math.abs(xCm) <= epsilonCm && allowedWalls.includes('left')) {
      return 'left';
    }
    if (
      vertical
      && Math.abs(xCm - Number(stageLayout.widthCm)) <= epsilonCm
      && allowedWalls.includes('right')
    ) {
      return 'right';
    }
    return 'free';
  }

  function getSingleSelectedModuleGroup() {
    const moduleIds = new Set(
      [...selectedSurfaces].map((surface) => surface.userData?.moduleId).filter(Boolean),
    );
    if (moduleIds.size !== 1) return null;
    const [moduleId] = moduleIds;
    return wallRoot.children.find((group) => (
      group.userData?.moduleState?.id === moduleId || group.userData?.moduleId === moduleId
    )) ?? null;
  }

  function rotateSelectedModule(deltaDeg) {
    if (!stageLayout || dragSession?.dragging) return { handled: false, ok: false };
    const moduleGroup = getSingleSelectedModuleGroup();
    const moduleState = moduleGroup?.userData?.moduleState;
    if (!moduleGroup || !moduleState?.placement) return { handled: false, ok: false };

    const nextPlacement = rotateModulePlacementAroundCenter(
      moduleState.placement,
      moduleState.widthCm,
      deltaDeg,
      moduleState.depthCm,
    );
    if (!nextPlacement) return { handled: false, ok: false };
    nextPlacement.wallId = isFloorFixtureType(moduleState.type)
      ? 'free'
      : inferWallIdForRotation(
          nextPlacement,
          nextPlacement.rotationZDeg,
        );

    const validation = validatePlacementAgainstModules({
      placement: nextPlacement,
      widthCm: moduleState.widthCm,
      depthCm: moduleState.depthCm,
      moduleId: moduleState.id,
      moduleType: moduleState.type,
      modules: getRenderedModuleStates(),
      standType: stageLayout.standType,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
    });
    if (!validation.ok) {
      const message = validation.message ?? 'Modül bu yönde döndürülemez.';
      showPlacementGhost(moduleState, nextPlacement, false);
      showPlacementFeedback(message, { durationMs: 1800 });
      window.setTimeout(() => {
        if (!dragSession?.dragging) disposePlacementGhost();
      }, 850);
      return { handled: true, ok: false, message };
    }

    clearPlacementFeedback();
    disposePlacementGhost();
    moduleState.placement = { ...nextPlacement };
    moduleGroup.userData.placement = { ...nextPlacement };
    applyPlacementToGroup(moduleGroup, nextPlacement, moduleState.widthCm);
    return { handled: true, ok: true };
  }

  function previewCatalogModuleDrag(
    moduleState,
    clientX,
    clientY,
    preferredRotationZDeg = 0,
    rotationLocked = false,
  ) {
    if (!stageLayout || !moduleState) {
      disposePlacementGhost();
      const message = 'Önce stand alanını oluştur.';
      showPlacementFeedback(message, { clientX, clientY });
      return { ok: false, message };
    }

    const ground = getGroundPoint(clientX, clientY);
    if (!ground) {
      disposePlacementGhost();
      const message = 'Modülü aktif stand alanına bırak.';
      showPlacementFeedback(message, { clientX, clientY });
      return { ok: false, message };
    }

    const snapped = snapPlacementToStand({
      standType: stageLayout.standType,
      widthCm: moduleState.widthCm,
      depthCm: moduleState.depthCm,
      forceFree: isFloorFixtureType(moduleState.type),
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
      preferredRotationZDeg,
      rotationLocked,
    });

    if (!snapped.ok || !snapped.placement) {
      disposePlacementGhost();
      const message = snapped.message ?? 'Bu konuma modül yerleştirilemedi.';
      showPlacementFeedback(message, { clientX, clientY });
      return {
        ok: false,
        message,
      };
    }

    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
      moduleId: moduleState.id,
      moduleType: moduleState.type,
      widthCm: moduleState.widthCm,
      depthCm: moduleState.depthCm,
      forceFree: isFloorFixtureType(moduleState.type),
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      rotationZDeg: preferredRotationZDeg,
      modules: renderedModules,
      standType: stageLayout.standType,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
    });
    const desiredPlacement = magneticSnap?.placement ?? snapped.placement;

    let plan;
    if (desiredPlacement.wallId === 'free') {
      const validation = validatePlacementAgainstModules({
        placement: desiredPlacement,
        widthCm: moduleState.widthCm,
        depthCm: moduleState.depthCm,
        moduleId: moduleState.id,
        moduleType: moduleState.type,
        modules: renderedModules,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
      plan = {
        ok: validation.ok,
        message: validation.message ?? null,
        movingPlacement: { ...desiredPlacement },
        placements: validation.ok
          ? new Map([[moduleState.id, { ...desiredPlacement }]])
          : new Map(),
      };
    } else {
      plan = planContinuousModuleInsert({
        modules: renderedModules,
        insertedModule: moduleState,
        desiredPlacement,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
    }

    const previewPlacement = plan.ok && plan.movingPlacement
      ? plan.movingPlacement
      : desiredPlacement;
    showPlacementGhost(moduleState, previewPlacement, plan.ok);
    if (plan.ok) clearPlacementFeedback();
    else showPlacementFeedback(plan.message ?? 'Bu konuma modül yerleştirilemez.', { clientX, clientY });
    return {
      ok: plan.ok,
      placement: { ...previewPlacement },
      message: plan.message ?? null,
      plan,
      snap: magneticSnap ? {
        mode: magneticSnap.mode,
        targetModuleId: magneticSnap.targetModuleId,
        snapKind: magneticSnap.snapKind,
      } : null,
    };
  }

  function dropCatalogModuleDrag(
    moduleState,
    clientX,
    clientY,
    preferredRotationZDeg = 0,
    rotationLocked = false,
  ) {
    const result = previewCatalogModuleDrag(
      moduleState,
      clientX,
      clientY,
      preferredRotationZDeg,
      rotationLocked,
    );
    disposePlacementGhost();
    if (result.ok) clearPlacementFeedback();
    else showPlacementFeedback(result.message ?? 'Bu konuma modül yerleştirilemez.', {
      clientX,
      clientY,
      durationMs: 1800,
    });
    return result;
  }

  function clearCatalogModuleDrag() {
    disposePlacementGhost();
    clearPlacementFeedback();
  }

  function updatePlacementDrag(event) {
    if (!dragSession || !stageLayout) return;
    const distance = Math.hypot(
      event.clientX - dragSession.startClientX,
      event.clientY - dragSession.startClientY,
    );
    if (!dragSession.dragging && distance < DRAG_THRESHOLD_PX) return;

    dragSession.dragging = true;
    dragSession.lastClientX = event.clientX;
    dragSession.lastClientY = event.clientY;
    dragSession.moduleGroup.visible = false;
    updateDragBadge(dragSession.moduleState, event.clientX, event.clientY);

    const ground = getGroundPoint(event.clientX, event.clientY);
    if (!ground) {
      disposePlacementGhost();
      dragSession.preview = null;
      showPlacementFeedback('Modülü aktif stand alanına bırak.', {
        clientX: event.clientX,
        clientY: event.clientY,
      });
      return;
    }

    const moduleState = dragSession.moduleState;
    const snapped = snapPlacementToStand({
      standType: stageLayout.standType,
      widthCm: moduleState.widthCm,
      depthCm: moduleState.depthCm,
      forceFree: isFloorFixtureType(moduleState.type),
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
      preferredRotationZDeg: dragSession.preferredRotationZDeg,
      rotationLocked: dragSession.rotationLocked,
    });

    if (!snapped.ok || !snapped.placement) {
      dragSession.preview = null;
      disposePlacementGhost();
      showPlacementFeedback(snapped.message ?? 'Bu konuma modül yerleştirilemez.', {
        clientX: event.clientX,
        clientY: event.clientY,
      });
      return;
    }

    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
      moduleId: moduleState.id,
      moduleType: moduleState.type,
      widthCm: moduleState.widthCm,
      depthCm: moduleState.depthCm,
      forceFree: isFloorFixtureType(moduleState.type),
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      rotationZDeg: dragSession.preferredRotationZDeg,
      modules: renderedModules,
      standType: stageLayout.standType,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
    });
    const desiredPlacement = magneticSnap?.placement ?? snapped.placement;

    let plan;
    if (desiredPlacement.wallId === 'free') {
      const validation = validatePlacementAgainstModules({
        placement: desiredPlacement,
        widthCm: moduleState.widthCm,
        depthCm: moduleState.depthCm,
        moduleId: moduleState.id,
        moduleType: moduleState.type,
        modules: renderedModules,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
      plan = {
        ok: validation.ok,
        message: validation.message ?? null,
        movingPlacement: { ...desiredPlacement },
        placements: validation.ok
          ? new Map([[moduleState.id, { ...desiredPlacement }]])
          : new Map(),
      };
    } else {
      plan = planContinuousModuleMove({
        modules: renderedModules,
        movingModuleId: moduleState.id,
        desiredPlacement,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
    }

    const previewPlacement = plan.ok && plan.movingPlacement
      ? plan.movingPlacement
      : desiredPlacement;
    dragSession.preview = {
      placement: previewPlacement,
      valid: plan.ok,
      message: plan.message ?? null,
      plan,
      snap: magneticSnap ? {
        mode: magneticSnap.mode,
        targetModuleId: magneticSnap.targetModuleId,
        snapKind: magneticSnap.snapKind,
      } : null,
    };
    showPlacementGhost(moduleState, previewPlacement, plan.ok);
    if (plan.ok) clearPlacementFeedback();
    else showPlacementFeedback(plan.message ?? 'Bu konuma modül yerleştirilemez.', {
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  function finishPlacementDrag(event) {
    if (!dragSession) return false;

    const session = dragSession;
    const wasDragging = session.dragging;
    const preview = session.preview;
    session.moduleGroup.visible = true;

    if (wasDragging && preview?.valid) {
      clearPlacementFeedback();
      const plannedPlacements = preview.plan?.placements instanceof Map
        ? preview.plan.placements
        : new Map([[session.moduleState.id, { ...preview.placement }]]);

      plannedPlacements.forEach((placement, moduleId) => {
        const moduleGroup = wallRoot.children.find((group) => (
          group.userData?.moduleState?.id === moduleId
          || group.userData?.moduleId === moduleId
        ));
        const moduleState = moduleGroup?.userData?.moduleState;
        if (!moduleGroup || !moduleState) return;

        moduleState.placement = { ...placement };
        moduleGroup.userData.placement = { ...placement };
        applyPlacementToGroup(moduleGroup, placement, moduleState.widthCm);
      });
      clearSelection();
    } else if (wasDragging && preview && !preview.valid) {
      showPlacementFeedback(preview.message ?? 'Bu konuma modül yerleştirilemez.', {
        clientX: event.clientX,
        clientY: event.clientY,
        durationMs: 1800,
      });
    }

    dragSession = null;
    controls.enabled = true;
    disposePlacementGhost();
    disposeDragBadge();

    try {
      renderer.domElement.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }

    return wasDragging;
  }

  function normalizeMeshes(meshOrMeshes) {
    if (!meshOrMeshes) return [];
    if (Array.isArray(meshOrMeshes)) return meshOrMeshes;
    if (meshOrMeshes instanceof Set) return [...meshOrMeshes];
    return [meshOrMeshes];
  }

  function resetImageTransform(surfaceState) {
    if (!surfaceState) return;
    surfaceState.imageTransform = createDefaultImageTransform();
  }

  function applyColor(meshOrMeshes, hexColor) {
    normalizeMeshes(meshOrMeshes).forEach((mesh) => {
      if (!mesh?.material) return;
      const surfaceState = mesh.userData.surfaceState;
      applyColorOverride(surfaceState, hexColor);

      const colorTargets = mesh.userData.colorTargets?.length
        ? mesh.userData.colorTargets
        : [mesh];

      colorTargets.forEach((target) => {
        if (!target?.material) return;
        target.material.map?.dispose?.();
        target.material.map = null;
        target.material.color.set(surfaceState?.isGlass ? GLASS_SURFACE_COLOR : hexColor);
        target.material.needsUpdate = true;
      });
    });
  }

  function applyGlassMode(meshOrMeshes, isGlass) {
    const glass = Boolean(isGlass);

    normalizeMeshes(meshOrMeshes).forEach((mesh) => {
      if (!mesh?.material || mesh.userData.selectionMode !== 'panel') return;
      const surfaceState = mesh.userData.surfaceState;
      if (!surfaceState) return;

      surfaceState.isGlass = glass;
      const hasImage = Boolean(mesh.material.map);
      mesh.material.transparent = glass;
      mesh.material.opacity = glass ? GLASS_SURFACE_OPACITY : 1;
      mesh.material.depthWrite = !glass;
      mesh.material.roughness = glass ? 0.16 : 0.72;
      mesh.material.metalness = 0;
      mesh.material.color.set(
        glass
          ? (hasImage ? 0xffffff : GLASS_SURFACE_COLOR)
          : (hasImage ? 0xffffff : (surfaceState.color ?? '#ffffff')),
      );
      mesh.material.needsUpdate = true;

      const backing = mesh.userData.backing;
      if (backing?.material) {
        backing.material.transparent = glass;
        backing.material.opacity = glass ? GLASS_BACK_OPACITY : 1;
        backing.material.depthWrite = !glass;
        backing.material.roughness = glass ? 0.22 : 0.74;
        backing.material.color.set(glass ? GLASS_BACK_COLOR : PANEL_BACK_COLOR);
        backing.material.needsUpdate = true;
        backing.castShadow = !glass;
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

  function createFittedCanvas(image, targetAspect, fit = 'contain') {
    const maxSide = 2048;
    let width;
    let height;

    if (targetAspect >= 1) {
      width = maxSide;
      height = Math.max(128, Math.round(maxSide / targetAspect));
    } else {
      height = maxSide;
      width = Math.max(128, Math.round(maxSide * targetAspect));
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    const imageWidth = image.naturalWidth ?? image.width;
    const imageHeight = image.naturalHeight ?? image.height;
    const placement = computeImageFit(imageWidth, imageHeight, width, height, fit);
    if (!placement) return canvas;

    context.drawImage(
      image,
      placement.drawX,
      placement.drawY,
      placement.drawWidth,
      placement.drawHeight,
    );

    return canvas;
  }

  function assignTexture(mesh, texture) {
    if (!mesh?.material) {
      texture.dispose();
      return;
    }
    mesh.material.map?.dispose?.();
    mesh.material.map = texture;
    mesh.material.color.set(0xffffff);
    mesh.material.needsUpdate = true;
  }

  function loadSingleImageOnSurface(mesh, assetId) {
    const assetUrl = getAssetUrl(assetId);
    if (!mesh?.material || !assetUrl || mesh.userData.acceptsImage === false) return;

    textureLoader.load(
      assetUrl,
      (sourceTexture) => {
        const surfaceState = mesh.userData.surfaceState;
        if (surfaceState?.imageAssetId !== assetId) {
          sourceTexture.dispose();
          return;
        }

        const fit = surfaceState.imageTransform?.fit;
        if (fit === 'cover' || fit === 'contain') {
          const targetAspect = mesh.geometry.parameters.width / mesh.geometry.parameters.height;
          const canvas = createFittedCanvas(sourceTexture.image, targetAspect, fit);
          sourceTexture.dispose();
          const fittedTexture = new THREE.CanvasTexture(canvas);
          configureTexture(fittedTexture, surfaceState);
          assignTexture(mesh, fittedTexture);
          return;
        }

        configureTexture(sourceTexture, surfaceState);
        assignTexture(mesh, sourceTexture);
      },
      undefined,
      () => {
        const surfaceState = mesh.userData.surfaceState;
        const stateColor = surfaceState?.isGlass
          ? GLASS_SURFACE_COLOR
          : (surfaceState?.color ?? '#ffffff');
        if (mesh.material) mesh.material.color.set(stateColor);
      },
    );
  }

  function loadGroupedImageOnSurface(mesh, assetId, expectedMode) {
    const assetUrl = getAssetUrl(assetId);
    if (!mesh?.material || !assetUrl || mesh.userData.acceptsImage === false) return;

    textureLoader.load(
      assetUrl,
      (sourceTexture) => {
        const surfaceState = mesh.userData.surfaceState;
        const transform = surfaceState?.imageTransform;
        if (
          surfaceState?.imageAssetId !== assetId
          || transform?.mode !== expectedMode
        ) {
          sourceTexture.dispose();
          return;
        }

        const canvas = createFittedCanvas(
          sourceTexture.image,
          transform.groupAspect,
          transform.fit ?? 'contain',
        );
        sourceTexture.dispose();

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        if (expectedMode === 'rect-group') {
          texture.offset.set(transform.regionStartX, transform.regionStartY);
          texture.repeat.set(transform.regionWidth, transform.regionHeight);
        } else {
          texture.offset.set(transform.regionStart, 0);
          texture.repeat.set(transform.regionWidth, 1);
        }

        texture.needsUpdate = true;
        assignTexture(mesh, texture);
      },
      undefined,
      () => {
        const surfaceState = mesh.userData.surfaceState;
        const stateColor = surfaceState?.isGlass
          ? GLASS_SURFACE_COLOR
          : (surfaceState?.color ?? '#ffffff');
        if (mesh.material) mesh.material.color.set(stateColor);
      },
    );
  }

  function loadImageOnSurface(mesh, assetId) {
    if (mesh.userData.acceptsImage === false) return;
    const mode = mesh.userData.surfaceState?.imageTransform?.mode;
    if (mode === 'rect-group') {
      loadGroupedImageOnSurface(mesh, assetId, 'rect-group');
      return;
    }
    if (mode === 'horizontal-group') {
      loadGroupedImageOnSurface(mesh, assetId, 'horizontal-group');
      return;
    }
    loadSingleImageOnSurface(mesh, assetId);
  }

  function applyStoredImage(mesh) {
    if (mesh.userData.acceptsImage === false) return;
    const assetId = mesh.userData.surfaceState?.imageAssetId;
    if (assetId) loadImageOnSurface(mesh, assetId);
  }

  function applyImageAsset(meshOrMeshes, assetId, fit = null) {
    if (!assetId) return;
    normalizeMeshes(meshOrMeshes).forEach((mesh) => {
      if (!mesh?.material || mesh.userData.acceptsImage === false) return;
      const surfaceState = mesh.userData.surfaceState;
      if (surfaceState) {
        surfaceState.imageAssetId = assetId;
        resetImageTransform(surfaceState);
        if (fit === 'cover' || fit === 'contain') {
          surfaceState.imageTransform.fit = fit;
        }
      }
      loadSingleImageOnSurface(mesh, assetId);
    });
  }

  function applyHorizontalImageAsset(meshOrMeshes, assetId) {
    const meshes = normalizeMeshes(meshOrMeshes);
    if (!assetId) return { ok: false, message: 'Önce bir görsel seç.' };
    if (meshes.some((mesh) => mesh.userData.acceptsImage === false)) {
      return { ok: false, message: 'Bu modüle görsel uygulanamaz; yalnızca renk uygulanabilir.' };
    }

    if (meshes.length === 1) {
      applyImageAsset(meshes, assetId);
      return { ok: true, mode: 'single' };
    }

    const layout = createHorizontalImageLayout(
      meshes.map((mesh) => ({
        mesh,
        moduleIndex: mesh.userData.moduleIndex,
        stripIndex: mesh.userData.stripIndex,
        width: mesh.geometry.parameters.width,
        height: mesh.geometry.parameters.height,
      })),
    );

    if (!layout.ok) return layout;

    layout.entries.forEach((entry) => {
      const surfaceState = entry.mesh.userData.surfaceState;
      surfaceState.imageAssetId = assetId;
      surfaceState.imageTransform = {
        mode: 'horizontal-group',
        groupAspect: layout.groupAspect,
        regionStart: entry.regionStart,
        regionWidth: entry.regionWidth,
      };
      loadGroupedImageOnSurface(entry.mesh, assetId, 'horizontal-group');
    });

    return {
      ok: true,
      mode: 'horizontal-group',
      panelCount: layout.entries.length,
    };
  }

  function applyRectImageAsset(meshOrMeshes, assetId, fit = 'contain') {
    const meshes = normalizeMeshes(meshOrMeshes);
    if (!assetId) return { ok: false, message: 'Önce bir görsel seç.' };
    if (meshes.some((mesh) => mesh.userData.acceptsImage === false)) {
      return { ok: false, message: 'Bu modüle görsel uygulanamaz; yalnızca renk uygulanabilir.' };
    }

    const normalizedFit = fit === 'cover' ? 'cover' : 'contain';

    if (meshes.length === 1) {
      applyImageAsset(meshes, assetId, normalizedFit);
      return {
        ok: true,
        mode: 'single',
        columnCount: 1,
        rowCount: 1,
        panelCount: 1,
      };
    }

    const layout = createRectImageLayout(
      meshes.map((mesh) => ({
        mesh,
        moduleIndex: mesh.userData.moduleIndex,
        stripIndex: mesh.userData.stripIndex,
        width: mesh.geometry.parameters.width,
        height: mesh.geometry.parameters.height,
      })),
    );

    if (!layout.ok) return layout;

    layout.entries.forEach((entry) => {
      const surfaceState = entry.mesh.userData.surfaceState;
      surfaceState.imageAssetId = assetId;
      surfaceState.imageTransform = {
        mode: 'rect-group',
        fit: normalizedFit,
        groupAspect: layout.groupAspect,
        regionStartX: entry.regionStartX,
        regionStartY: entry.regionStartY,
        regionWidth: entry.regionWidth,
        regionHeight: entry.regionHeight,
      };
      loadGroupedImageOnSurface(entry.mesh, assetId, 'rect-group');
    });

    return {
      ok: true,
      mode: 'rect-group',
      fit: normalizedFit,
      columnCount: layout.columnCount,
      rowCount: layout.rowCount,
      panelCount: layout.entries.length,
    };
  }

  function clearImage(meshOrMeshes) {
    normalizeMeshes(meshOrMeshes).forEach((mesh) => {
      if (!mesh?.material || mesh.userData.acceptsImage === false) return;
      const surfaceState = mesh.userData.surfaceState;
      if (surfaceState) {
        surfaceState.imageAssetId = null;
        resetImageTransform(surfaceState);
      }
      mesh.material.map?.dispose?.();
      mesh.material.map = null;
      mesh.material.color.set(
        surfaceState?.isGlass ? GLASS_SURFACE_COLOR : (surfaceState?.color ?? '#ffffff'),
      );
      mesh.material.needsUpdate = true;
    });
  }

  renderer.domElement.addEventListener('contextmenu', (event) => {
    const context = pickModuleContext(event);
    if (!context) {
      onModuleContextMenu?.(null);
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (context.surfaceId) {
      const contextSurface = surfaceMeshes.find(
        (surface) => surface.userData.surfaceId === context.surfaceId,
      );
      if (contextSurface && !selectedSurfaces.has(contextSurface)) {
        selectOnly(contextSurface);
      }
    }

    onModuleContextMenu?.(context);
  });

  function handleSurfaceSelectionAt(clientX, clientY, rectangleSelect) {
    setPointerFromClient(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(surfaceMeshes, false)[0];

    if (hit) {
      const anchorMesh = surfaceMeshes.find(
        (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,
      );
      const canRectangleSelect = rectangleSelect
        && hit.object.userData.selectionMode !== 'module'
        && anchorMesh?.userData.selectionMode !== 'module';

      if (canRectangleSelect) selectRectangleTo(hit.object);
      else selectOnly(hit.object);
    } else if (!rectangleSelect) {
      clearSelection();
    }
  }

  renderer.domElement.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;

    const rectangleSelect = event.ctrlKey || event.metaKey;
    if (rectangleSelect) {
      handleSurfaceSelectionAt(event.clientX, event.clientY, true);
      return;
    }

    const picked = stageLayout ? pickModuleAt(event.clientX, event.clientY) : null;
    if (!picked) {
      handleSurfaceSelectionAt(event.clientX, event.clientY, false);
      return;
    }

    const moduleState = picked.moduleGroup.userData.moduleState;
    if (!moduleState) {
      handleSurfaceSelectionAt(event.clientX, event.clientY, false);
      return;
    }

    controls.enabled = false;
    dragSession = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      moduleGroup: picked.moduleGroup,
      moduleState,
      dragging: false,
      preview: null,
      preferredRotationZDeg: normalizeModuleRotationZDeg(moduleState.placement?.rotationZDeg),
      rotationLocked: false,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
    };

    renderer.domElement.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  renderer.domElement.addEventListener('pointermove', (event) => {
    if (!dragSession || event.pointerId !== dragSession.pointerId) return;
    updatePlacementDrag(event);
  });

  window.addEventListener('keydown', (event) => {
    if (String(event.key).toLowerCase() !== 'r') return;

    const target = event.target;
    const tagName = String(target?.tagName ?? '').toLowerCase();
    const isEditing = tagName === 'input'
      || tagName === 'textarea'
      || tagName === 'select'
      || Boolean(target?.isContentEditable);
    if (isEditing && !dragSession?.dragging) return;

    const deltaDeg = event.shiftKey ? -90 : 90;

    if (dragSession?.dragging) {
      event.preventDefault();
      dragSession.preferredRotationZDeg = rotateModuleRotationZDeg(
        dragSession.preferredRotationZDeg,
        deltaDeg,
      );
      dragSession.rotationLocked = true;
      updatePlacementDrag({
        clientX: dragSession.lastClientX,
        clientY: dragSession.lastClientY,
      });
      return;
    }

    const rotationResult = rotateSelectedModule(deltaDeg);
    if (rotationResult.handled) event.preventDefault();
  });

  renderer.domElement.addEventListener('pointerup', (event) => {
    if (!dragSession || event.pointerId !== dragSession.pointerId) return;
    const startClientX = dragSession.startClientX;
    const startClientY = dragSession.startClientY;
    const wasDragging = finishPlacementDrag(event);
    if (!wasDragging) handleSurfaceSelectionAt(startClientX, startClientY, false);
  });

  renderer.domElement.addEventListener('pointercancel', (event) => {
    if (!dragSession || event.pointerId !== dragSession.pointerId) return;
    clearPlacementDrag();
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
    viewCube.update();
    renderer.render(scene, camera);
  });

  return {
    createStage,
    buildWall,
    clearWall,
    clearSelection,
    resetStageView,
    resetDefaultView,
    applyColor,
    applyGlassMode,
    applyImageAsset,
    applyHorizontalImageAsset,
    applyRectImageAsset,
    clearImage,
    previewCatalogModuleDrag,
    dropCatalogModuleDrag,
    clearCatalogModuleDrag,
    getStageLayout: () => (stageLayout ? { ...stageLayout } : null),
    getSelectedSurface: () => [...selectedSurfaces][0] ?? null,
    getSelectedSurfaces: () => [...selectedSurfaces],
  };
}

function createSofaSetModule(moduleState, moduleIndex) {
  const widthM = Number(moduleState.widthCm || 250) / 100;
  const depthM = Number(moduleState.depthCm || 250) / 100;
  const group = new THREE.Group();
  group.userData = { kind: 'module', moduleIndex, moduleId: moduleState.id, type: 'sofa-set', widthCm: Number(moduleState.widthCm || 250), depthCm: Number(moduleState.depthCm || 250), heightCm: Number(moduleState.heightCm || 80) };

  const upholstery = [];
  const material = new THREE.MeshStandardMaterial({ color: moduleState.surface?.color ?? '#ffffff', roughness: 0.68, metalness: 0, emissive: 0x000000, emissiveIntensity: 0 });
  const addUpholsteredBox = (w, h, d, x, y, z, radiusHint = false) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material.clone());
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (radiusHint) mesh.scale.set(0.98, 1, 0.98);
    group.add(mesh);
    upholstery.push(mesh);
    return mesh;
  };

  const addSofa = ({ x, z, seatWidth, seatDepth, twoSeat = false, facing = 'front' }) => {
    const seatY = 0.29;
    const seatH = 0.18;
    const armW = 0.12;
    const backH = 0.62;
    const backT = 0.13;
    const dir = facing === 'front' ? 1 : -1;
    const backZ = z - dir * (seatDepth / 2 - backT / 2);
    addUpholsteredBox(seatWidth - armW * 2, seatH, seatDepth - 0.16, x, seatY, z + dir * 0.04, true);
    addUpholsteredBox(seatWidth, backH, backT, x, backH / 2, backZ, true);
    addUpholsteredBox(armW, 0.52, seatDepth, x - seatWidth / 2 + armW / 2, 0.26, z, true);
    addUpholsteredBox(armW, 0.52, seatDepth, x + seatWidth / 2 - armW / 2, 0.26, z, true);
    if (twoSeat) {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.185, seatDepth - 0.2), new THREE.MeshStandardMaterial({ color: 0xcfd4da, roughness: 0.7 }));
      seam.position.set(x, seatY + 0.004, z + dir * 0.04);
      group.add(seam);
    }
  };

  addSofa({ x: 0, z: -depthM / 2 + 0.48, seatWidth: 1.60, seatDepth: 0.78, twoSeat: true, facing: 'front' });
  addSofa({ x: -0.78, z: depthM / 2 - 0.50, seatWidth: 0.65, seatDepth: 0.75, facing: 'back' });
  addSofa({ x: 0.78, z: depthM / 2 - 0.50, seatWidth: 0.65, seatDepth: 0.75, facing: 'back' });

  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.30, 0.018, 48), new THREE.MeshPhysicalMaterial({ color: 0xd7e9ed, transparent: true, opacity: 0.42, roughness: 0.12, metalness: 0, transmission: 0.28, depthWrite: false }));
  glass.position.set(0, 0.42, 0.10);
  glass.castShadow = false;
  glass.receiveShadow = true;
  group.add(glass);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.40, 20), new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.28 }));
  stem.position.set(0, 0.21, 0.10);
  group.add(stem);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32), new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.3 }));
  base.position.set(0, 0.018, 0.10);
  group.add(base);

  const selectable = upholstery[0];
  const selectionFrame = createSelectionFrame(1.36, 0.18);
  selectionFrame.visible = false;
  selectable.add(selectionFrame);
  selectable.userData = { kind: 'surface', moduleType: 'sofa-set', selectionMode: 'module', acceptsImage: false, moduleIndex, moduleId: moduleState.id, widthCm: Number(moduleState.widthCm || 250), stripIndex: null, stripNumber: null, surfaceRole: 'upholstery', surfaceId: moduleState.surface?.id, surfaceState: moduleState.surface, selectionFrame, colorTargets: upholstery };
  upholstery.forEach((mesh, index) => {
    if (index === 0) return;
    mesh.userData = { ...selectable.userData, surfaceId: `${moduleState.surface?.id}-${index}`, selectionFrame: null };
  });

  return { group, surfaces: upholstery };
}

function createBaseModule(moduleState, moduleIndex, onSurfaceReady) {
  const widthCm = Number(moduleState.widthCm);
  const depthCm = Number(moduleState.depthCm) || 50;
  const heightCm = Number(moduleState.heightCm) || 50;
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const heightM = heightCm / 100;
  const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;
  const topThicknessM = 0.035;
  const topOverhangM = 0.02;
  const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);
  const panelHeightM = Math.max(frameHeightM - profileM * 2, 0.05);
  const frontPanelWidthM = Math.max(widthM - profileM * 2, 0.05);
  const sidePanelWidthM = Math.max(depthM - profileM * 2, 0.05);
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: moduleState.type,
    widthCm,
    depthCm,
    heightCm,
  };

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });
  const addProfile = (geometry, position) => {
    const mesh = new THREE.Mesh(geometry, frameMaterial.clone());
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  // Four visible Maxima corner profiles. Rear remains open; only front/left/right are paneled.
  const cornerPostGeometry = new THREE.BoxGeometry(profileM, frameHeightM, profileM);
  [-1, 1].forEach((xSide) => {
    [-1, 1].forEach((zSide) => {
      addProfile(
        cornerPostGeometry.clone(),
        new THREE.Vector3(
          xSide * (widthM / 2 - profileM / 2),
          frameHeightM / 2,
          zSide * (depthM / 2 - profileM / 2),
        ),
      );
    });
  });

  const frontRailGeometry = new THREE.BoxGeometry(frontPanelWidthM, profileM, profileM);
  [profileM / 2, frameHeightM - profileM / 2].forEach((y) => {
    addProfile(
      frontRailGeometry.clone(),
      new THREE.Vector3(0, y, depthM / 2 - profileM / 2),
    );
  });

  const sideRailGeometry = new THREE.BoxGeometry(profileM, profileM, sidePanelWidthM);
  [-1, 1].forEach((xSide) => {
    [profileM / 2, frameHeightM - profileM / 2].forEach((y) => {
      addProfile(
        sideRailGeometry.clone(),
        new THREE.Vector3(xSide * (widthM / 2 - profileM / 2), y, 0),
      );
    });
  });

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(
      widthM + topOverhangM * 2,
      topThicknessM,
      depthM + topOverhangM * 2,
    ),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.74, metalness: 0 }),
  );
  top.position.set(0, frameHeightM + topThicknessM / 2, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const surfaces = [];
  const addPanelFace = (surfaceRole, surfaceState, faceWidthM, position, rotationY = 0) => {
    if (!surfaceState) return;

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(faceWidthM, panelHeightM, 0.012),
      new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.74, metalness: 0 }),
    );
    backing.position.copy(position);
    backing.rotation.y = rotationY;
    backing.castShadow = true;
    backing.receiveShadow = true;
    group.add(backing);

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(faceWidthM, panelHeightM),
      new THREE.MeshStandardMaterial({
        color: surfaceState.imageAssetId ? 0xffffff : surfaceState.color,
        roughness: 0.72,
        metalness: 0,
        side: THREE.DoubleSide,
        emissive: 0x000000,
        emissiveIntensity: 0,
      }),
    );
    surface.position.copy(position);
    surface.rotation.y = rotationY;
    if (surfaceRole === 'front') surface.position.z += 0.0065;
    else if (surfaceRole === 'left') surface.position.x -= 0.0065;
    else surface.position.x += 0.0065;

    const selectionFrame = createSelectionFrame(faceWidthM, panelHeightM);
    selectionFrame.visible = false;
    surface.add(selectionFrame);
    surface.userData = {
      kind: 'surface',
      moduleType: 'base',
      selectionMode: 'module',
      acceptsImage: true,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex: null,
      stripNumber: null,
      surfaceRole,
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
      backing,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  };

  const panelCenterY = profileM + panelHeightM / 2;
  addPanelFace(
    'front',
    moduleState.faces?.front,
    frontPanelWidthM,
    new THREE.Vector3(0, panelCenterY, depthM / 2 - profileM - 0.006),
  );
  addPanelFace(
    'left',
    moduleState.faces?.left,
    sidePanelWidthM,
    new THREE.Vector3(-widthM / 2 + profileM + 0.006, panelCenterY, 0),
    -Math.PI / 2,
  );
  addPanelFace(
    'right',
    moduleState.faces?.right,
    sidePanelWidthM,
    new THREE.Vector3(widthM / 2 - profileM - 0.006, panelCenterY, 0),
    Math.PI / 2,
  );

  return { group, surfaces };
}

function createCounterModule(moduleState, moduleIndex, onSurfaceReady) {
  const widthCm = Number(moduleState.widthCm);
  const depthCm = Number(moduleState.depthCm) || 50;
  const heightCm = Number(moduleState.heightCm) || 100;
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const heightM = heightCm / 100;
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: moduleState.type,
    widthCm,
    depthCm,
    heightCm,
  };

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.76, metalness: 0 }),
  );
  body.position.set(0, heightM / 2, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const top = new THREE.Mesh(
    new THREE.PlaneGeometry(widthM, depthM),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.58, metalness: 0 }),
  );
  top.rotation.x = -Math.PI / 2;
  top.position.set(0, heightM + 0.0015, 0);
  top.receiveShadow = true;
  group.add(top);

  const surfaces = [];
  const addFace = (surfaceRole, surfaceState, faceWidthM, position, rotationY = 0) => {
    if (!surfaceState) return;
    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(faceWidthM, heightM),
      new THREE.MeshStandardMaterial({
        color: surfaceState.imageAssetId ? 0xffffff : surfaceState.color,
        roughness: 0.72,
        metalness: 0,
        side: THREE.DoubleSide,
        emissive: 0x000000,
        emissiveIntensity: 0,
      }),
    );
    surface.position.copy(position);
    surface.rotation.y = rotationY;

    const selectionFrame = createSelectionFrame(faceWidthM, heightM);
    selectionFrame.visible = false;
    surface.add(selectionFrame);

    surface.userData = {
      kind: 'surface',
      moduleType: 'counter',
      selectionMode: 'module',
      acceptsImage: true,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex: null,
      stripNumber: null,
      surfaceRole,
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  };

  addFace(
    'front',
    moduleState.faces?.front,
    widthM,
    new THREE.Vector3(0, heightM / 2, depthM / 2 + 0.0015),
  );
  addFace(
    'left',
    moduleState.faces?.left,
    depthM,
    new THREE.Vector3(-widthM / 2 - 0.0015, heightM / 2, 0),
    -Math.PI / 2,
  );
  addFace(
    'right',
    moduleState.faces?.right,
    depthM,
    new THREE.Vector3(widthM / 2 + 0.0015, heightM / 2, 0),
    Math.PI / 2,
  );

  return { group, surfaces };
}

function createShelfModule(moduleState, moduleIndex, onSurfaceReady) {
  const built = createFlatPanelModule(moduleState, moduleIndex, onSurfaceReady);
  const widthM = Number(moduleState.widthCm) / 100;
  const shelfCount = Number(moduleState.shelfCount) === 3 ? 3 : 2;
  const shelfDepthM = Number(SHELF_DIMENSIONS.projectionCm) / 100;
  const shelfThicknessM = Number(SHELF_DIMENSIONS.thicknessCm) / 100;
  const wallDepthM = Number(STAND_DIMENSIONS.depth);
  const innerWidthM = Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2 - 0.012, 0.02);
  const shelfHeightsCm = SHELF_DIMENSIONS.heightsByCountCm[shelfCount] ?? [];

  built.group.userData.type = 'shelf';
  built.group.userData.shelfCount = shelfCount;
  built.surfaces.forEach((surface) => {
    surface.userData.moduleType = 'shelf';
    surface.userData.shelfCount = shelfCount;
  });

  const shelfMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.72,
    metalness: 0,
  });
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });

  shelfHeightsCm.forEach((heightCm) => {
    const seamHeightM = Number(heightCm) / 100;
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(innerWidthM, shelfThicknessM, shelfDepthM),
      shelfMaterial.clone(),
    );
    shelf.position.set(
      0,
      seamHeightM + shelfThicknessM / 2,
      wallDepthM / 2 + shelfDepthM / 2,
    );
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    built.group.add(shelf);

    const frontProfile = new THREE.Mesh(
      new THREE.BoxGeometry(innerWidthM, 0.025, 0.025),
      frameMaterial.clone(),
    );
    frontProfile.position.set(
      0,
      seamHeightM + 0.0125,
      wallDepthM / 2 + shelfDepthM - 0.0125,
    );
    frontProfile.castShadow = true;
    built.group.add(frontProfile);
  });

  return built;
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
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: moduleState.type,
    widthCm,
  };

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });

  const profileGeometry = new THREE.BoxGeometry(PANEL_VERTICAL_PROFILE_WIDTH_M, height, frameDepth);
  for (const side of [-1, 1]) {
    const profile = new THREE.Mesh(profileGeometry.clone(), frameMaterial.clone());
    profile.position.set(side * (widthM / 2 - PANEL_VERTICAL_PROFILE_WIDTH_M / 2), height / 2, 0);
    profile.castShadow = true;
    group.add(profile);
  }

  const railHeight = PANEL_RAIL_HEIGHT_M;
  const railGeometry = new THREE.BoxGeometry(
    Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2, 0.02),
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
  const innerWidth = Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2 - 0.012, 0.02);
  const panelHeight = stripHeight - railHeight - PANEL_VERTICAL_CLEARANCE_M;
  const panelDepth = Math.max(depth - 0.026, 0.035);

  for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
    const centerY = stripIndex * stripHeight + stripHeight / 2;
    const surfaceState = moduleState.strips[stripIndex];
    const isGlass = Boolean(surfaceState.isGlass);

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(innerWidth, panelHeight, panelDepth),
      new THREE.MeshStandardMaterial({
        color: isGlass ? GLASS_BACK_COLOR : PANEL_BACK_COLOR,
        roughness: isGlass ? 0.22 : 0.74,
        transparent: isGlass,
        opacity: isGlass ? GLASS_BACK_OPACITY : 1,
        depthWrite: !isGlass,
      }),
    );
    backing.position.set(0, centerY, 0);
    backing.castShadow = !isGlass;
    backing.receiveShadow = true;
    group.add(backing);

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(innerWidth, panelHeight),
      new THREE.MeshStandardMaterial({
        color: surfaceState.imageAssetId
          ? 0xffffff
          : (isGlass ? GLASS_SURFACE_COLOR : surfaceState.color),
        roughness: isGlass ? 0.16 : 0.72,
        metalness: 0,
        transparent: isGlass,
        opacity: isGlass ? GLASS_SURFACE_OPACITY : 1,
        depthWrite: !isGlass,
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
      moduleType: 'flat-panel',
      selectionMode: 'panel',
      acceptsImage: true,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex,
      stripNumber: stripIndex + 1,
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
      backing,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  }

  return { group, surfaces };
}


function createDoorModule(moduleState, moduleIndex, onSurfaceReady) {
  const {
    height,
    depth,
    stripHeight,
    frameWidth,
    frameDepth,
  } = STAND_DIMENSIONS;

  const widthCm = Number(moduleState.widthCm) || 100;
  const widthM = widthCm / 100;
  const doorHeight = stripHeight * 4;
  const upperPanelCount = 3;
  const railHeight = PANEL_RAIL_HEIGHT_M;
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: moduleState.type,
    widthCm,
  };

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });

  const profileGeometry = new THREE.BoxGeometry(PANEL_VERTICAL_PROFILE_WIDTH_M, height, frameDepth);
  for (const side of [-1, 1]) {
    const profile = new THREE.Mesh(profileGeometry.clone(), frameMaterial.clone());
    profile.position.set(side * (widthM / 2 - PANEL_VERTICAL_PROFILE_WIDTH_M / 2), height / 2, 0);
    profile.castShadow = true;
    group.add(profile);
  }

  const railGeometry = new THREE.BoxGeometry(
    Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2, 0.02),
    railHeight,
    frameDepth,
  );
  const railYs = [
    0,
    doorHeight,
    doorHeight + stripHeight,
    doorHeight + stripHeight * 2,
    height,
  ];
  railYs.forEach((y) => {
    const rail = new THREE.Mesh(railGeometry.clone(), frameMaterial.clone());
    rail.position.set(0, y, 0);
    rail.castShadow = true;
    group.add(rail);
  });

  const surfaces = [];
  const innerWidth = Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2 - 0.012, 0.02);
  const panelDepth = Math.max(depth - 0.026, 0.035);

  // Alt bölüm: kapalı kapı kanadı. Sahne düzleminden dışarı açılmaz.
  const doorState = moduleState.surface;
  const doorPanelHeight = Math.max(doorHeight - railHeight - 0.018, 0.1);
  const doorBacking = new THREE.Mesh(
    new THREE.BoxGeometry(innerWidth, doorPanelHeight, panelDepth),
    new THREE.MeshStandardMaterial({
      color: PANEL_BACK_COLOR,
      roughness: 0.74,
    }),
  );
  doorBacking.position.set(0, doorHeight / 2, 0);
  doorBacking.castShadow = true;
  doorBacking.receiveShadow = true;
  group.add(doorBacking);

  const doorSurface = new THREE.Mesh(
    new THREE.PlaneGeometry(innerWidth, doorPanelHeight),
    new THREE.MeshStandardMaterial({
      color: doorState?.imageAssetId ? 0xffffff : (doorState?.color ?? '#ffffff'),
      roughness: 0.72,
      metalness: 0,
      side: THREE.DoubleSide,
      emissive: 0x000000,
      emissiveIntensity: 0,
    }),
  );
  doorSurface.position.set(0, doorHeight / 2, depth / 2 + 0.0015);
  const doorSelectionFrame = createSelectionFrame(innerWidth, doorPanelHeight);
  doorSelectionFrame.visible = false;
  doorSurface.add(doorSelectionFrame);
  doorSurface.userData = {
    kind: 'surface',
    moduleType: 'door',
    selectionMode: 'module',
    acceptsImage: true,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'door',
    surfaceId: doorState.id,
    surfaceState: doorState,
    selectionFrame: doorSelectionFrame,
    backing: doorBacking,
  };
  group.add(doorSurface);
  surfaces.push(doorSurface);
  onSurfaceReady?.(doorSurface);

  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.032, 0.032),
    new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.55, roughness: 0.3 }),
  );
  handle.position.set(innerWidth / 2 - 0.13, doorHeight * 0.52, depth / 2 + 0.025);
  handle.castShadow = true;
  group.add(handle);

  // Üst bölüm: fiziksel olarak 4., 5. ve 6. strip indexlerine denk gelen 3 panel.
  for (let index = 0; index < upperPanelCount; index += 1) {
    const surfaceState = moduleState.strips[index];
    if (!surfaceState) continue;
    const centerY = doorHeight + index * stripHeight + stripHeight / 2;
    const panelHeight = stripHeight - railHeight - PANEL_VERTICAL_CLEARANCE_M;

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(innerWidth, panelHeight, panelDepth),
      new THREE.MeshStandardMaterial({
        color: surfaceState.isGlass ? GLASS_BACK_COLOR : PANEL_BACK_COLOR,
        roughness: surfaceState.isGlass ? 0.22 : 0.74,
        transparent: Boolean(surfaceState.isGlass),
        opacity: surfaceState.isGlass ? GLASS_BACK_OPACITY : 1,
        depthWrite: !surfaceState.isGlass,
      }),
    );
    backing.position.set(0, centerY, 0);
    backing.castShadow = !surfaceState.isGlass;
    backing.receiveShadow = true;
    group.add(backing);

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(innerWidth, panelHeight),
      new THREE.MeshStandardMaterial({
        color: surfaceState.imageAssetId
          ? 0xffffff
          : (surfaceState.isGlass ? GLASS_SURFACE_COLOR : surfaceState.color),
        roughness: surfaceState.isGlass ? 0.16 : 0.72,
        metalness: 0,
        transparent: Boolean(surfaceState.isGlass),
        opacity: surfaceState.isGlass ? GLASS_SURFACE_OPACITY : 1,
        depthWrite: !surfaceState.isGlass,
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
      moduleType: 'door',
      selectionMode: 'panel',
      acceptsImage: true,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex: surfaceState.stripIndex,
      stripNumber: index + 1,
      surfaceRole: 'upper-panel',
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
      backing,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  }

  return { group, surfaces };
}

function createSeparatorModule(moduleState, moduleIndex) {
  const {
    height,
    depth,
    frameWidth,
    frameDepth,
  } = STAND_DIMENSIONS;

  const widthCm = moduleState.widthCm;
  const widthM = widthCm / 100;
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: moduleState.type,
    widthCm,
  };

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

  const crossRailGeometry = new THREE.BoxGeometry(
    Math.max(widthM - frameWidth * 2, 0.02),
    frameWidth,
    frameDepth,
  );
  for (const y of [frameWidth / 2, height - frameWidth / 2]) {
    const rail = new THREE.Mesh(crossRailGeometry.clone(), frameMaterial.clone());
    rail.position.set(0, y, 0);
    rail.castShadow = true;
    group.add(rail);
  }

  const surfaceState = moduleState.surface;
  const innerWidth = Math.max(widthM - frameWidth * 2 - 0.012, 0.02);
  const innerHeight = height - frameWidth * 2;
  const slatCount = 36;
  const slatHeight = 0.035;
  const slatGap = 0.06;
  const usedHeight = slatCount * slatHeight + (slatCount - 1) * slatGap;
  const freeHeight = Math.max(innerHeight - usedHeight, 0);
  const firstSlatY = frameWidth + freeHeight / 2 + slatHeight / 2;
  const slatGeometry = new THREE.BoxGeometry(innerWidth, slatHeight, depth);
  const slatMaterial = new THREE.MeshStandardMaterial({
    color: surfaceState.color,
    roughness: 0.62,
    metalness: 0,
  });
  const colorTargets = [];

  for (let index = 0; index < slatCount; index += 1) {
    const slat = new THREE.Mesh(slatGeometry.clone(), slatMaterial.clone());
    slat.position.set(0, firstSlatY + index * (slatHeight + slatGap), 0);
    slat.castShadow = true;
    slat.receiveShadow = true;
    group.add(slat);
    colorTargets.push(slat);
  }

  const selector = new THREE.Mesh(
    new THREE.PlaneGeometry(innerWidth, innerHeight),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  selector.position.set(0, height / 2, depth / 2 + 0.0015);

  const selectionFrame = createSelectionFrame(innerWidth, innerHeight);
  selectionFrame.visible = false;
  selector.add(selectionFrame);

  selector.userData = {
    kind: 'surface',
    moduleType: 'separator',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm,
    stripIndex: null,
    stripNumber: null,
    surfaceId: surfaceState.id,
    surfaceState,
    selectionFrame,
    colorTargets,
  };
  group.add(selector);

  return { group, surfaces: [selector] };
}

function createShowcaseModule(moduleState, moduleIndex, onSurfaceReady) {
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
  const eyeCount = moduleState.type === 'showcase-3' ? 3 : 2;
  const openingStartStrip = eyeCount === 3 ? 1 : 2;
  const openingStripCount = eyeCount;
  const showcaseDepth = 0.36;
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: moduleState.type,
    widthCm,
  };

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: FRAME_COLOR,
    metalness: 0.68,
    roughness: 0.28,
  });

  const profileGeometry = new THREE.BoxGeometry(PANEL_VERTICAL_PROFILE_WIDTH_M, height, frameDepth);
  for (const side of [-1, 1]) {
    const profile = new THREE.Mesh(profileGeometry.clone(), frameMaterial.clone());
    profile.position.set(side * (widthM / 2 - PANEL_VERTICAL_PROFILE_WIDTH_M / 2), height / 2, 0);
    profile.castShadow = true;
    group.add(profile);
  }

  const railHeight = PANEL_RAIL_HEIGHT_M;
  const innerWidth = Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2 - 0.012, 0.02);
  const railGeometry = new THREE.BoxGeometry(
    Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2, 0.02),
    railHeight,
    frameDepth,
  );

  for (let index = 0; index <= stripCount; index += 1) {
    const rail = new THREE.Mesh(railGeometry.clone(), frameMaterial.clone());
    rail.position.set(0, index * stripHeight, 0);
    rail.castShadow = true;
    group.add(rail);
  }

  const surfaces = [];
  const panelHeight = stripHeight - railHeight - PANEL_VERTICAL_CLEARANCE_M;
  const panelDepth = Math.max(depth - 0.026, 0.035);

  for (let stripIndex = 0; stripIndex < stripCount; stripIndex += 1) {
    const isOpeningStrip = stripIndex >= openingStartStrip
      && stripIndex < openingStartStrip + openingStripCount;
    if (isOpeningStrip) continue;

    const centerY = stripIndex * stripHeight + stripHeight / 2;
    const surfaceState = moduleState.strips[stripIndex];
    if (!surfaceState) continue;
    const isGlass = Boolean(surfaceState.isGlass);

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(innerWidth, panelHeight, panelDepth),
      new THREE.MeshStandardMaterial({
        color: isGlass ? GLASS_BACK_COLOR : PANEL_BACK_COLOR,
        roughness: isGlass ? 0.22 : 0.74,
        transparent: isGlass,
        opacity: isGlass ? GLASS_BACK_OPACITY : 1,
        depthWrite: !isGlass,
      }),
    );
    backing.position.set(0, centerY, 0);
    backing.castShadow = !isGlass;
    backing.receiveShadow = true;
    group.add(backing);

    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(innerWidth, panelHeight),
      new THREE.MeshStandardMaterial({
        color: surfaceState.imageAssetId
          ? 0xffffff
          : (isGlass ? GLASS_SURFACE_COLOR : surfaceState.color),
        roughness: isGlass ? 0.16 : 0.72,
        metalness: 0,
        transparent: isGlass,
        opacity: isGlass ? GLASS_SURFACE_OPACITY : 1,
        depthWrite: !isGlass,
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
      moduleType: moduleState.type,
      selectionMode: 'panel',
      acceptsImage: true,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex,
      stripNumber: stripIndex + 1,
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
      backing,
    };

    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  }

  const openingBottom = openingStartStrip * stripHeight + railHeight / 2;
  const openingTop = (openingStartStrip + openingStripCount) * stripHeight - railHeight / 2;
  const openingHeight = openingTop - openingBottom;
  const openingCenterY = (openingBottom + openingTop) / 2;
  const caseCenterZ = (showcaseDepth - depth) / 2;
  const caseFrontZ = caseCenterZ + showcaseDepth / 2;

  const backPanel = new THREE.Mesh(
    new THREE.BoxGeometry(innerWidth, openingHeight, 0.018),
    new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.82 }),
  );
  backPanel.position.set(0, openingCenterY, -depth / 2 + 0.009);
  backPanel.receiveShadow = true;
  group.add(backPanel);

  const sideGlassMaterial = new THREE.MeshStandardMaterial({
    color: 0xdfe8e8,
    roughness: 0.18,
    metalness: 0,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const sideGlassGeometry = new THREE.BoxGeometry(0.018, openingHeight, showcaseDepth);
  for (const side of [-1, 1]) {
    const sideGlass = new THREE.Mesh(sideGlassGeometry.clone(), sideGlassMaterial.clone());
    sideGlass.position.set(
      side * (innerWidth / 2 - 0.009),
      openingCenterY,
      caseCenterZ,
    );
    group.add(sideGlass);
  }

  const frontPostGeometry = new THREE.BoxGeometry(0.028, openingHeight, 0.028);
  for (const side of [-1, 1]) {
    const post = new THREE.Mesh(frontPostGeometry.clone(), frameMaterial.clone());
    post.position.set(
      side * (innerWidth / 2 - 0.014),
      openingCenterY,
      caseFrontZ - 0.014,
    );
    post.castShadow = true;
    group.add(post);
  }

  const frontEdgeGeometry = new THREE.BoxGeometry(innerWidth, 0.028, 0.028);
  for (const y of [openingBottom, openingTop]) {
    const edge = new THREE.Mesh(frontEdgeGeometry.clone(), frameMaterial.clone());
    edge.position.set(0, y, caseFrontZ - 0.014);
    edge.castShadow = true;
    group.add(edge);
  }

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0xb7d5b5,
    roughness: 0.08,
    metalness: 0,
    transparent: true,
    opacity: 0.48,
    side: THREE.DoubleSide,
  });
  const shelfGeometry = new THREE.BoxGeometry(
    Math.max(innerWidth - 0.035, 0.02),
    0.018,
    Math.max(showcaseDepth - 0.035, 0.04),
  );
  const shelfFrontGeometry = new THREE.BoxGeometry(innerWidth, 0.018, 0.024);

  for (let index = 1; index < eyeCount; index += 1) {
    const shelfY = openingBottom + (openingHeight * index) / eyeCount;
    const shelf = new THREE.Mesh(shelfGeometry.clone(), glassMaterial.clone());
    shelf.position.set(0, shelfY, caseCenterZ);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    group.add(shelf);

    const shelfFront = new THREE.Mesh(shelfFrontGeometry.clone(), frameMaterial.clone());
    shelfFront.position.set(0, shelfY, caseFrontZ - 0.012);
    shelfFront.castShadow = true;
    group.add(shelfFront);
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