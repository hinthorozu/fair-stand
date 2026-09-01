import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SHELF_DIMENSIONS, STAND_DIMENSIONS } from './catalog.js';
import { ALUMINUM_PROFILE_COLOR } from './theme.js';
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
  getModulePlacementSnapCm,
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
import { getModuleGhostBehavior, getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule, isWallOverlayModule } from './moduleBehavior.js';
import { TV_SCREEN_DATA_URL } from './tvScreenImage.js';

const FRAME_COLOR = ALUMINUM_PROFILE_COLOR;
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
const GRID_COLOR = 0x7f8994;
const STAND_BORDER_COLOR = 0x6f7a87;
const ACTIVE_WALL_GUIDE_COLOR = 0xf97316;
const ACTIVE_WALL_GUIDE_THICKNESS_M = 0.045;
const ACTIVE_WALL_GUIDE_HEIGHT_M = 0.018;
const STAGE_SURROUND_M = 1;
// Aktif stand zemini fuar salonu zemininden 5 cm yukarıda duran platformdur.
const ACTIVE_PLATFORM_HEIGHT_M = 0.05;
const FLOOR_TYPES = Object.freeze(['karolaj', 'hali', 'parke-acik', 'parke-sari', 'parke-beton']);
const PARQUET_TYPES = new Set(['parke-acik', 'parke-sari', 'parke-beton']);
const PARQUET_COLORS = Object.freeze({
  'parke-acik': '#e8dfd1',
  'parke-sari': '#ddb24f',
  'parke-beton': '#625f58',
});
const FLOOR_TOP_EPSILON_M = 0.006;
const SELECTION_COLOR = 0x2563eb;
const PLACEMENT_VALID_COLOR = 0x16a34a;
const PLACEMENT_INVALID_COLOR = 0xdc2626;
const PLACEMENT_GHOST_OPACITY = 0.3;
const DRAG_THRESHOLD_PX = 5;
const DEFAULT_VIEW_MIN_DISTANCE = 9;
const DEFAULT_VIEW_DISTANCE_FACTOR = 1.32;
const HOME_DIRECTION = new THREE.Vector3(1, 0.72, 1).normalize();
const STAGE_HOME_DIRECTION = new THREE.Vector3(1, 1.05, 1).normalize();

const EAMES_CHAIR_TARGET_HEIGHT_M = 0.82;
let eamesChairModelPromise = null;

function loadEamesChairModel() {
  if (!eamesChairModelPromise) {
    const loader = new GLTFLoader();
    eamesChairModelPromise = loader
      .loadAsync(import.meta.env.BASE_URL + 'models/eames_chair.glb')
      .then((gltf) => gltf.scene);
  }
  return eamesChairModelPromise;
}

let tvScreenBlob = null;

function getTvScreenBlob() {
  if (tvScreenBlob) return tvScreenBlob;
  const marker = 'base64,';
  const markerIndex = TV_SCREEN_DATA_URL.indexOf(marker);
  if (markerIndex < 0) throw new Error('TV screen image is not a base64 data URL.');
  const payload = TV_SCREEN_DATA_URL.slice(markerIndex + marker.length);
  const binary = window.atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  tvScreenBlob = new Blob([bytes], { type: 'image/jpeg' });
  return tvScreenBlob;
}

function createTvScreenTexture() {
  const objectUrl = URL.createObjectURL(getTvScreenBlob());
  const texture = new THREE.TextureLoader().load(
    objectUrl,
    () => URL.revokeObjectURL(objectUrl),
    undefined,
    () => URL.revokeObjectURL(objectUrl),
  );
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}


let barStoolModelPromise = null;

function loadBarStoolModel() {
  if (!barStoolModelPromise) {
    const loader = new GLTFLoader();
    barStoolModelPromise = loader
      .loadAsync(import.meta.env.BASE_URL + 'models/bar_chair.glb')
      .then((gltf) => gltf.scene);
  }
  return barStoolModelPromise;
}

let beigeSofaModelPromise = null;

function loadBeigeSofaModel() {
  if (!beigeSofaModelPromise) {
    const loader = new GLTFLoader();
    beigeSofaModelPromise = loader
      .loadAsync(import.meta.env.BASE_URL + 'models/bej_koltuk_1_ciftli_2_tekli.glb')
      .then((gltf) => gltf.scene);
  }
  return beigeSofaModelPromise;
}

function isFloorFixtureType(type) {
  return isFreePlacementModule(type);
}

function isTopFixtureType(type) {
  return isTopPlacementModule(type);
}

export function createStandScene(
  container,
  onSurfaceSelected,
  getAssetUrl = () => null,
  onModuleContextMenu = () => {},
  onFloorSelected = () => {},
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x5f6265);
  scene.fog = new THREE.Fog(0x5f6265, 55, 90);

  // Keep atmospheric depth outside the editable stand. Fog distances are updated only
  // when the stage size changes, so this adds no per-frame CPU work or extra draw calls.
  function updateStageFog(widthM, depthM) {
    const diagonalM = Math.hypot(Number(widthM) || 0, Number(depthM) || 0);
    const near = Math.max(55, diagonalM * 1.25 + 18);
    const far = Math.max(90, near + Math.max(35, diagonalM * 0.8));
    scene.fog.near = near;
    scene.fog.far = far;
  }

  const perspectiveCamera = new THREE.PerspectiveCamera(42, 1, 0.05, 2000);
  perspectiveCamera.position.set(4.8, 3.4, 6.2);
  const orthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.05, 2000);
  orthographicCamera.position.copy(perspectiveCamera.position);
  let camera = perspectiveCamera;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
  const editorPixelRatio = coarsePointer
    ? Math.min(window.devicePixelRatio, 1)
    : Math.min(window.devicePixelRatio, 1.5);
  renderer.setPixelRatio(editorPixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
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

  function getViewCubeFit(direction = HOME_DIRECTION) {
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
    // Do not add the full projected scene depth to the fit distance. That conservative
    // term made isometric/home presets pull far away even though the stand already fit.
    // A small depth allowance keeps near corners safe while letting the stand actually
    // occupy the intended ~82% of the viewport.
    const depthAllowance = depthHalf * 0.16;
    const distance = THREE.MathUtils.clamp(
      perspectiveFit + depthAllowance,
      controls.minDistance,
      controls.maxDistance,
    );

    const verticalSpan = Math.max(
      projectedHalfHeight * 2,
      (projectedHalfWidth * 2) / Math.max(aspect, 0.1),
    ) / occupancy;

    return { target, distance, verticalSpan };
  }

  const viewCube = createViewCube(container, camera, controls, getViewCubeFit);

  let cameraMode = 'perspective';
  const projectionControl = document.createElement('div');
  projectionControl.className = 'projection-control';
  projectionControl.setAttribute('aria-label', 'Kamera projeksiyonu');
  projectionControl.style.cssText = [
    'position:absolute',
    'right:18px',
    'bottom:18px',
    'z-index:35',
    'display:flex',
    'gap:4px',
    'padding:4px',
    'border:1px solid rgba(148,163,184,.55)',
    'border-radius:9px',
    'background:rgba(255,255,255,.9)',
    'box-shadow:0 5px 16px rgba(15,23,42,.12)',
    'backdrop-filter:blur(5px)',
  ].join(';');

  const projectionButtons = new Map();
  [['perspective', 'Persp'], ['orthographic', 'Ortho']].forEach(([mode, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.title = mode === 'perspective' ? 'Perspektif görünüş' : 'Ortografik görünüş';
    button.style.cssText = [
      'height:28px',
      'padding:0 9px',
      'border:0',
      'border-radius:6px',
      'font:700 11px/1 system-ui,sans-serif',
      'cursor:pointer',
      'transition:background .15s,color .15s',
    ].join(';');
    projectionControl.appendChild(button);
    projectionButtons.set(mode, button);
  });
  container.appendChild(projectionControl);

  function styleProjectionButtons() {
    projectionButtons.forEach((button, mode) => {
      const active = mode === cameraMode;
      button.style.background = active ? '#2563eb' : 'transparent';
      button.style.color = active ? '#ffffff' : '#475569';
    });
  }

  function setOrthographicSpan(verticalSpan, aspect) {
    const safeSpan = Math.max(0.25, Number(verticalSpan) || 10);
    const safeAspect = Math.max(0.1, Number(aspect) || 1);
    orthographicCamera.top = safeSpan / 2;
    orthographicCamera.bottom = -safeSpan / 2;
    orthographicCamera.right = (safeSpan * safeAspect) / 2;
    orthographicCamera.left = -(safeSpan * safeAspect) / 2;
    orthographicCamera.updateProjectionMatrix();
  }

  function updateCameraProjection(width, height) {
    const aspect = Math.max(1, width) / Math.max(1, height);
    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();
    if (cameraMode === 'orthographic') {
      const span = Math.max(0.25, (orthographicCamera.top - orthographicCamera.bottom));
      setOrthographicSpan(span, aspect);
    }
  }

  function setCameraMode(nextMode) {
    const resolved = nextMode === 'orthographic' ? 'orthographic' : 'perspective';
    if (resolved === cameraMode) return cameraMode;

    const source = camera;
    const target = resolved === 'orthographic' ? orthographicCamera : perspectiveCamera;
    const targetPoint = controls.target.clone();
    const direction = source.position.clone().sub(targetPoint);
    if (direction.lengthSq() === 0) direction.copy(HOME_DIRECTION);
    direction.normalize();

    if (resolved === 'orthographic') {
      const distance = source.position.distanceTo(targetPoint);
      const verticalSpan = 2 * distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2);
      const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);
      orthographicCamera.zoom = 1;
      setOrthographicSpan(verticalSpan, aspect);
      target.position.copy(source.position);
    } else {
      const visibleSpan = (orthographicCamera.top - orthographicCamera.bottom) / Math.max(orthographicCamera.zoom, 0.0001);
      const distance = visibleSpan / (2 * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2));
      target.position.copy(targetPoint).addScaledVector(direction, distance);
    }

    target.quaternion.copy(source.quaternion);
    target.up.copy(source.up);
    camera = target;
    cameraMode = resolved;
    controls.object = camera;
    controls.update();
    viewCube.setCamera(camera);
    styleProjectionButtons();
    return cameraMode;
  }

  projectionButtons.get('perspective').addEventListener('click', () => setCameraMode('perspective'));
  projectionButtons.get('orthographic').addEventListener('click', () => setCameraMode('orthographic'));
  styleProjectionButtons();

  scene.add(new THREE.HemisphereLight(0xffffff, 0x7f8790, 2.1));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(5, 8, 6);
  keyLight.castShadow = true;
  // 2K is visually sufficient for the editor and cuts the directional shadow map
  // memory/fill cost to one quarter of the previous 4K allocation.
  keyLight.shadow.mapSize.set(2048, 2048);
  scene.add(keyLight);

  // Fixed exhibition-hall ground: 4K CC0 Damaged Concrete Floor 02 from Poly Haven.
  // The source is seamless and repeated at a large physical scale so the hall reads as
  // one continuous floor instead of one stretched image or visible square tiles.
  // It is intentionally not user-configurable; the stand platform remains independent.
  const exhibitionHall = new THREE.Group();
  exhibitionHall.name = 'exhibition-hall-environment';

  const hallFloorTexture = new THREE.TextureLoader().load(
    import.meta.env.BASE_URL + 'textures/exhibition-floor-optimized.jpg',
  );
  hallFloorTexture.colorSpace = THREE.SRGBColorSpace;
  hallFloorTexture.wrapS = THREE.RepeatWrapping;
  hallFloorTexture.wrapT = THREE.RepeatWrapping;
  hallFloorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const hallFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0xa9abad,
    map: hallFloorTexture,
    roughness: 0.96,
    metalness: 0,
  });

  function rebuildExhibitionHall(standWidthM, standDepthM) {
    while (exhibitionHall.children.length) {
      const child = exhibitionHall.children.pop();
      child.geometry?.dispose?.();
    }

    // Keep the physical floor well beyond the fog end distance so its rectangular edge
    // never becomes visible while orbiting or zooming around the stand.
    const hallSizeM = Math.max(standWidthM, standDepthM, 20) + 180;
    // One texture repeat represents roughly an 8 m square of real floor.
    // Large repeats prevent the checkerboard look while preserving detail near the stand.
    const textureRepeat = Math.max(1, hallSizeM / 8);
    hallFloorTexture.repeat.set(textureRepeat, textureRepeat);
    hallFloorTexture.offset.set(0.173, 0.287);
    hallFloorTexture.needsUpdate = true;

    const hallFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(hallSizeM, hallSizeM),
      hallFloorMaterial,
    );
    hallFloor.rotation.x = -Math.PI / 2;
    hallFloor.position.y = -0.014;
    hallFloor.receiveShadow = true;
    exhibitionHall.add(hallFloor);
  }

  scene.add(exhibitionHall);

  const outerFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({ color: OUTER_FLOOR_COLOR, roughness: 0.94 }),
  );
  outerFloor.rotation.x = -Math.PI / 2;
  outerFloor.receiveShadow = true;
  outerFloor.visible = false;
  scene.add(outerFloor);

  const activeFloor = new THREE.Mesh(
    new THREE.BoxGeometry(1, ACTIVE_PLATFORM_HEIGHT_M, 1),
    new THREE.MeshStandardMaterial({ color: FLOOR_COLOR, roughness: 0.92 }),
  );
  activeFloor.receiveShadow = true;
  activeFloor.castShadow = true;
  activeFloor.visible = false;
  scene.add(activeFloor);

  // Lightweight procedural carpet texture: neutral fibers multiplied by the chosen
  // carpet color, plus a subtle bump map so grazing light reads as real textile.
  // Generated in-browser to avoid another heavy image asset or network request.
  function createCarpetTexturePair() {
    const size = 256;
    const colorCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    colorCanvas.width = colorCanvas.height = size;
    bumpCanvas.width = bumpCanvas.height = size;

    const colorCtx = colorCanvas.getContext('2d');
    const bumpCtx = bumpCanvas.getContext('2d');
    const colorImage = colorCtx.createImageData(size, size);
    const bumpImage = bumpCtx.createImageData(size, size);

    // Deterministic pseudo-random field keeps the texture stable across rebuilds.
    let seed = 0x5f3759df;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 0xffffffff;
    };

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const i = (y * size + x) * 4;
        const fine = (random() - 0.5) * 34;
        const fiber = Math.sin((x * 0.72) + (y * 0.18)) * 5;
        const value = Math.max(72, Math.min(184, 128 + fine + fiber));
        const bump = Math.max(88, Math.min(168, 128 + fine * 0.9 + fiber * 1.5));

        colorImage.data[i] = value;
        colorImage.data[i + 1] = value;
        colorImage.data[i + 2] = value;
        colorImage.data[i + 3] = 255;
        bumpImage.data[i] = bump;
        bumpImage.data[i + 1] = bump;
        bumpImage.data[i + 2] = bump;
        bumpImage.data[i + 3] = 255;
      }
    }

    colorCtx.putImageData(colorImage, 0, 0);
    bumpCtx.putImageData(bumpImage, 0, 0);

    const colorMap = new THREE.CanvasTexture(colorCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    [colorMap, bumpMap].forEach((texture) => {
      texture.wrapS = THREE.MirroredRepeatWrapping;
      texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.needsUpdate = true;
    });
    colorMap.colorSpace = THREE.SRGBColorSpace;
    return { colorMap, bumpMap };
  }

  const carpetTextures = createCarpetTexturePair();

  let grid = null;
  let standOutline = null;
  let activeWallGuides = [];
  let floorPattern = null;
  let stageLayout = null;
  let currentFloorType = 'karolaj';
  const floorColors = {
    karolaj: '#e9edf1',
    hali: '#8b8f94',
  };
  let floorSelected = false;

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
    disposeGroundObject(floorPattern);
    activeWallGuides.forEach(disposeGroundObject);
    grid = null;
    standOutline = null;
    floorPattern = null;
    activeWallGuides = [];
  }

  function collectSurfaceCuts(lengthM, stepM) {
    const cuts = [0];
    for (let value = stepM; value < lengthM; value += stepM) cuts.push(value);
    cuts.push(lengthM);
    return [...new Set(cuts.map((value) => Number(value.toFixed(6))))];
  }

  function createFloorPattern(widthM, depthM, floorType) {
    const positions = [];
    const topY = ACTIVE_PLATFORM_HEIGHT_M + FLOOR_TOP_EPSILON_M;

    if (floorType === 'karolaj') {
      collectSurfaceCuts(widthM, 1).forEach((x) => {
        positions.push(x, topY, 0, x, topY, depthM);
      });
      collectSurfaceCuts(depthM, 1).forEach((z) => {
        positions.push(0, topY, z, widthM, topY, z);
      });
    } else if (PARQUET_TYPES.has(floorType)) {
      // Ahşap parkeler ince lamel kalır; beton parke daha geniş ve kısa plakalar kullanır.
      const isConcreteParquet = floorType === 'parke-beton';
      const plankDepthM = isConcreteParquet ? 0.28 : 0.16;
      const plankLengthM = isConcreteParquet ? 1.12 : 1.40;
      collectSurfaceCuts(depthM, plankDepthM).forEach((z) => {
        positions.push(0, topY, z, widthM, topY, z);
      });
      let row = 0;
      for (let z = 0; z < depthM - 0.000001; z += plankDepthM, row += 1) {
        const rowEnd = Math.min(depthM, z + plankDepthM);
        const offset = (row % 3) * (plankLengthM / 3);
        for (let x = -offset; x < widthM; x += plankLengthM) {
          const seamX = x + plankLengthM;
          if (seamX <= 0.000001 || seamX >= widthM - 0.000001) continue;
          positions.push(seamX, topY, z, seamX, topY, rowEnd);
        }
      }
    }

    if (!positions.length) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const isConcreteParquetPattern = floorType === 'parke-beton';
    const material = new THREE.LineBasicMaterial({
      // Beton parke derzleri sahne ışığından bağımsız, daha koyu ve net kalsın.
      color: isConcreteParquetPattern
        ? 0x3f3d39
        : (PARQUET_TYPES.has(floorType) ? 0x746f68 : 0x9aa0a6),
      transparent: true,
      opacity: isConcreteParquetPattern
        ? 0.62
        : (PARQUET_TYPES.has(floorType) ? 0.34 : 0.68),
      toneMapped: !isConcreteParquetPattern,
    });
    const lines = new THREE.LineSegments(geometry, material);
    lines.renderOrder = 8;
    return lines;
  }

  function setFloorType(floorType = 'karolaj') {
    const resolved = FLOOR_TYPES.includes(floorType) ? floorType : 'karolaj';
    currentFloorType = resolved;

    const material = activeFloor.material;
    if (resolved === 'hali') {
      material.color.set(floorColors.hali);
      material.roughness = 1;
      material.metalness = 0;
      material.emissive.set('#000000');
      material.emissiveIntensity = 0;
      material.map = carpetTextures.colorMap;
      material.bumpMap = carpetTextures.bumpMap;
      material.bumpScale = 0.018;
      if (stageLayout) {
        // Restore the earlier compact carpet-tile scale the editor used before the RIP pass.
        const repeatX = Math.max(2, stageLayout.widthM / 0.7);
        const repeatY = Math.max(2, stageLayout.depthM / 0.7);
        carpetTextures.colorMap.repeat.set(repeatX, repeatY);
        carpetTextures.bumpMap.repeat.set(repeatX, repeatY);
      }
    } else if (PARQUET_TYPES.has(resolved)) {
      material.map = null;
      material.bumpMap = null;
      material.bumpScale = 0;
      material.color.set(PARQUET_COLORS[resolved]);
      material.roughness = resolved === 'parke-beton' ? 0.98 : 0.78;
      material.metalness = 0;
      // Beton parke, güçlü sahne ışığında rengini yıkamadan daha mat ve dengeli kalsın.
      material.emissive.set(resolved === 'parke-beton' ? PARQUET_COLORS[resolved] : '#000000');
      material.emissiveIntensity = resolved === 'parke-beton' ? 0.06 : 0;
    } else {
      material.color.set(floorColors.karolaj);
      material.roughness = 0.92;
      material.metalness = 0;
      material.emissive.set('#000000');
      material.emissiveIntensity = 0;
      material.map = null;
      material.bumpMap = null;
      material.bumpScale = 0;
    }
    material.needsUpdate = true;

    disposeGroundObject(floorPattern);
    floorPattern = null;
    if (stageLayout) {
      floorPattern = createFloorPattern(stageLayout.widthM, stageLayout.depthM, resolved);
      if (floorPattern) scene.add(floorPattern);
    }
    if (stageLayout) stageLayout.floorType = resolved;
    return resolved;
  }

  function setFloorColor(color) {
    if (currentFloorType !== 'karolaj' && currentFloorType !== 'hali') return null;
    const normalized = String(color ?? '').trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return floorColors[currentFloorType];
    const resolved = normalized.toLowerCase();
    floorColors[currentFloorType] = resolved;
    if (stageLayout) stageLayout.floorColor = resolved;
    activeFloor.material.color.set(resolved);
    activeFloor.material.needsUpdate = true;
    return resolved;
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
    const boldOffsetM = 0.006;

    const pushVertical = (x) => {
      [-boldOffsetM, 0, boldOffsetM].forEach((offset) => {
        positions.push(x + offset, 0.006, backZ, x + offset, 0.006, frontZ);
      });
    };
    const pushHorizontal = (z) => {
      [-boldOffsetM, 0, boldOffsetM].forEach((offset) => {
        positions.push(leftX, 0.006, z + offset, rightX, 0.006, z + offset);
      });
    };

    collectGridValues(widthM).forEach(pushVertical);
    collectGridValues(depthM).forEach(pushHorizontal);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const lines = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({
        color: GRID_COLOR,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    lines.renderOrder = 7;
    return lines;
  }

  function createStandOutline(widthM, depthM) {
    const positions = [
      0, ACTIVE_PLATFORM_HEIGHT_M + 0.008, 0, widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.008, 0,
      widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.008, 0, widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.008, depthM,
      widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.008, depthM, 0, ACTIVE_PLATFORM_HEIGHT_M + 0.008, depthM,
      0, ACTIVE_PLATFORM_HEIGHT_M + 0.008, depthM, 0, ACTIVE_PLATFORM_HEIGHT_M + 0.008, 0,
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
        guide.position.set(widthM / 2, ACTIVE_PLATFORM_HEIGHT_M + 0.02, 0);
      } else if (wallId === 'left') {
        guide.position.set(0, ACTIVE_PLATFORM_HEIGHT_M + 0.02, depthM / 2);
      } else {
        guide.position.set(widthM, ACTIVE_PLATFORM_HEIGHT_M + 0.02, depthM / 2);
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

    updateStageFog(widthM, depthM);

    disposeWall();
    disposeGroundGuides();
    clearPlacementDrag();

    const sceneWidthM = widthM + STAGE_SURROUND_M * 2;
    const sceneDepthM = depthM + STAGE_SURROUND_M * 2;
    const centerX = widthM / 2;
    const centerZ = depthM / 2;

    // Rebuild the venue around the current stand so large layouts keep realistic clearance.
    rebuildExhibitionHall(widthM, depthM);
    exhibitionHall.position.set(centerX, 0, centerZ);

    outerFloor.scale.set(sceneWidthM, sceneDepthM, 1);
    outerFloor.position.set(centerX, 0, centerZ);
    outerFloor.visible = false;

    activeFloor.scale.set(widthM, 1, depthM);
    activeFloor.position.set(centerX, ACTIVE_PLATFORM_HEIGHT_M / 2, centerZ);
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
      platformHeightM: ACTIVE_PLATFORM_HEIGHT_M,
      floorType: currentFloorType,
      floorColor: floorColors[currentFloorType] ?? null,
    };

    setFloorType(currentFloorType);
    if (resetView) resetStageView();
    return { ok: true, ...stageLayout };
  }

  const wallRoot = new THREE.Group();
  // Duvarlar ve tüm stand modülleri platformun üst kotundan başlar.
  wallRoot.position.set(0, ACTIVE_PLATFORM_HEIGHT_M, 0);
  scene.add(wallRoot);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  // Shared loader for normal editable surface images. TV uses its own Blob/object-URL path.
  const textureLoader = new THREE.TextureLoader();
  
  let surfaceMeshes = [];
  const selectedSurfaces = new Set();
  let selectionAnchorSurfaceId = null;
  let selectedModuleId = null;
  let placementGhost = null;
  let dragSession = null;
  let dragBadge = null;
  let placementFeedback = null;
  let placementFeedbackTimer = null;
  // Structural wall rebuilds (insert/delete/reorder) reuse the already uploaded GPU
  // textures. This prevents branded panels from flashing blank while TextureLoader
  // reloads the same assets after every catalog operation. Keys prefer the persistent
  // surface-state object, so inserting a module before another does not depend on index.
  let rebuildTextureTransfer = null;

  function getRebuildTextureKey(mesh) {
    const surfaceState = mesh?.userData?.surfaceState;
    if (surfaceState && typeof surfaceState === 'object') return surfaceState;
    return mesh?.userData?.surfaceId ?? null;
  }

  function retainWallTexturesForRebuild() {
    const retained = new Map();
    surfaceMeshes.forEach((surface) => {
      const texture = surface?.material?.map;
      const key = getRebuildTextureKey(surface);
      if (!texture || !key) return;
      retained.set(key, texture);
      // disposeWall() owns the old materials. Detach maps first so disposing the old
      // material does not also destroy a texture that the replacement mesh will reuse.
      surface.material.map = null;
    });
    rebuildTextureTransfer = retained;
  }

  function disposeUnusedRebuildTextures() {
    if (!rebuildTextureTransfer) return;
    rebuildTextureTransfer.forEach((texture) => texture?.dispose?.());
    rebuildTextureTransfer = null;
  }

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

  function notifyFloorSelection() {
    onFloorSelected?.({
      selected: floorSelected,
      floorType: currentFloorType,
      paintable: currentFloorType === 'karolaj' || currentFloorType === 'hali',
      color: floorColors[currentFloorType] ?? null,
    });
  }

  function clearSelection({ notify = true, keepAnchor = false } = {}) {
    selectedSurfaces.forEach((mesh) => setSelectionVisual(mesh, false));
    selectedSurfaces.clear();
    floorSelected = false;
    if (!keepAnchor) selectionAnchorSurfaceId = null;
    if (notify) notifySelection();
  }

  function selectOnly(mesh) {
    clearSelection({ notify: false });
    if (mesh) {
      selectedSurfaces.add(mesh);
      selectedModuleId = mesh.userData.moduleId ?? null;
      selectionAnchorSurfaceId = mesh.userData.surfaceId ?? null;
      setSelectionVisual(mesh, true);
    }
    notifySelection();
  }

  function selectModuleOnly(moduleId) {
    selectedSurfaces.forEach((mesh) => setSelectionVisual(mesh, false));
    selectedSurfaces.clear();
    selectionAnchorSurfaceId = null;
    floorSelected = false;
    selectedModuleId = moduleId ?? null;
    notifySelection();
  }

  function toggleCounterSurface(mesh) {
    if (!mesh || mesh.userData?.moduleType !== 'counter') return false;

    const moduleId = mesh.userData.moduleId ?? null;
    const hasForeignSelection = [...selectedSurfaces].some(
      (surface) => surface.userData?.moduleType !== 'counter'
        || surface.userData?.moduleId !== moduleId,
    );

    if (hasForeignSelection) clearSelection({ notify: false });

    if (selectedSurfaces.has(mesh)) {
      selectedSurfaces.delete(mesh);
      setSelectionVisual(mesh, false);
    } else {
      selectedSurfaces.add(mesh);
      setSelectionVisual(mesh, true);
    }

    floorSelected = false;
    selectedModuleId = selectedSurfaces.size ? moduleId : null;
    selectionAnchorSurfaceId = [...selectedSurfaces][0]?.userData.surfaceId ?? null;
    notifySelection();
    return true;
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
    const selectedModuleIds = new Set(
      result.entries.map((entry) => entry.mesh.userData?.moduleId).filter(Boolean),
    );
    selectedModuleId = selectedModuleIds.size === 1 ? [...selectedModuleIds][0] : null;
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

  function createBaseWallModule(moduleState, moduleIndex, applyStoredImage) {
    const wallState = { ...moduleState, type: 'flat-panel' };
    const baseState = {
      ...moduleState,
      id: `${moduleState.id}-base-layer`,
      type: 'base',
      depthCm: 50,
      heightCm: 50,
    };

    const wall = createFlatPanelModule(wallState, moduleIndex, applyStoredImage);
    const base = createBaseModule(baseState, moduleIndex, applyStoredImage);
    const group = new THREE.Group();
    group.userData.kind = 'module';
    group.userData.moduleId = moduleState.id;
    group.userData.moduleType = 'base-wall';
    group.userData.moduleIndex = moduleIndex;

    while (wall.group.children.length) group.add(wall.group.children[0]);
    // Panel Bazalı'da duvar paneli baza derinliğinin ortasında değil arka kenarında kalır.
    // Duvar düzlemi z=0; 50 cm baza gövdesi standın içine doğru z=0..0.50 uzanır.
    while (base.group.children.length) {
      const child = base.group.children[0];
      child.position.z += 0.25;
      group.add(child);
    }

    const surfaces = [...wall.surfaces, ...base.surfaces];
    surfaces.forEach((surface) => {
      surface.userData.moduleId = moduleState.id;
      surface.userData.moduleType = 'base-wall';
      surface.userData.moduleIndex = moduleIndex;
    });
    return { group, surfaces };
  }

  function buildWall(modules, { resetView = true } = {}) {
    const selectedSurfaceIds = new Set(
      [...selectedSurfaces].map((mesh) => mesh.userData.surfaceId).filter(Boolean),
    );
    const previousAnchorSurfaceId = selectionAnchorSurfaceId;

    clearPlacementDrag();
    retainWallTexturesForRebuild();
    disposeWall({ notify: false, keepAnchor: true });

    const totalWidth = modules.reduce((sum, module) => sum + module.widthCm / 100, 0);
    let cursorX = 0;
    let hasMultiEdgePlacement = false;

    modules.forEach((moduleState, moduleIndex) => {
      let module;
      if (moduleState.type === 'separator') {
        module = createSeparatorModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'base-wall') {
        module = createBaseWallModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
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
      } else if (moduleState.type === 'sofa-set-classic') {
        module = createBeigeSofaSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'table-chair-set-eames') {
        module = createEamesTableChairSetModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'bar-stool') {
        module = createBarStoolModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'tv') {
        module = createTvModule(moduleState, moduleIndex);
      } else if (moduleState.type === 'led-floodlight') {
        module = createLedFloodlightModule(moduleState, moduleIndex);
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
      } else if (moduleState.type === 'flat-panel') {
        module = createFlatPanelModule(
          moduleState,
          moduleIndex,
          (surface) => applyStoredImage(surface),
        );
      } else {
        console.warn('Desteklenmeyen modül tipi atlandı:', moduleState.type, moduleState.id);
        return;
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
    // Any retained texture left here belonged to a deleted surface/module. Reused
    // textures are removed from the transfer map by applyStoredImage().
    disposeUnusedRebuildTextures();
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
    if (camera.isOrthographicCamera) {
      camera.zoom = 1;
      const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);
      const span = 2 * distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2);
      setOrthographicSpan(span, aspect);
    }
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
    if (camera.isOrthographicCamera) {
      camera.zoom = 1;
      const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);
      const span = 2 * distance * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov) / 2);
      setOrthographicSpan(span, aspect);
    }
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

  function getTopFixtureDragPoint(clientX, clientY, preferredWallId = 'back') {
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
    if (placementGhost.ownsGeometry) placementGhost.mesh?.geometry?.dispose?.();
    placementGhost.mesh?.material?.dispose?.();
    placementGhost.tintMaterials?.forEach((material) => material?.dispose?.());
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
    const ghostBehavior = getModuleGhostBehavior(moduleOrWidthCm);
    const dimensions = getPlacementGhostDimensions(moduleOrWidthCm);
    const key = [moduleOrWidthCm?.type ?? 'generic', dimensions.widthCm, dimensions.depthM, dimensions.heightM].join(':');
    if (placementGhost?.key === key) return placementGhost;
    disposePlacementGhost();

    const root = new THREE.Group();

    // Koltuk Takımı uses its actual GLB sofa geometry plus the real coffee-table geometry.
    if (ghostBehavior.renderer === 'sofa-set-classic') {
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

    // Eames Masa Sandalye Takımı uses the real table geometry plus the actual chair GLB geometry.
    if (ghostBehavior.renderer === 'table-chair-set-eames') {
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

      const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.375, 0.375, 0.018, 64), makeGhostMaterial());
      tableTop.position.set(0, 0.74, 0);
      tableTop.renderOrder = 10000;
      root.add(tableTop);

      const tableStem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.70, 20), makeGhostMaterial());
      tableStem.position.set(0, 0.37, 0);
      tableStem.renderOrder = 10000;
      root.add(tableStem);

      const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32), makeGhostMaterial());
      tableBase.position.set(0, 0.018, 0);
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

      const chairPlacements = [
        [-0.33, -0.33, Math.PI / 4],
        [0.33, -0.33, -Math.PI / 4],
        [-0.33, 0.33, Math.PI * 3 / 4],
        [0.33, 0.33, -Math.PI * 3 / 4],
      ];

      loadEamesChairModel().then((template) => {
        if (placementGhost?.key !== key || placementGhost.root !== root) return;
        chairPlacements.forEach(([x, z, rotationY]) => {
          const chair = template.clone(true);
          chair.traverse((object) => {
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

          chair.updateMatrixWorld(true);
          let box = new THREE.Box3().setFromObject(chair);
          const size = box.getSize(new THREE.Vector3());
          const scale = size.y > 0 ? EAMES_CHAIR_TARGET_HEIGHT_M / size.y : 1;
          chair.scale.multiplyScalar(scale);
          chair.updateMatrixWorld(true);
          box = new THREE.Box3().setFromObject(chair);
          const center = box.getCenter(new THREE.Vector3());
          chair.position.x -= center.x;
          chair.position.z -= center.z;
          chair.position.y -= box.min.y;

          const holder = new THREE.Group();
          holder.position.set(x, 0, z);
          holder.rotation.y = rotationY;
          holder.add(chair);
          root.add(holder);
        });
      }).catch((error) => {
        console.warn('Eames ghost GLB modeli yüklenemedi:', error);
      });

      return placementGhost;
    }

    if (ghostBehavior.renderer === 'tv') {
    const root = new THREE.Group();
    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: PLACEMENT_VALID_COLOR,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.93, 0.523, 0.05),
      ghostMaterial,
    );
    mesh.position.set(0, 1.75, 0.025);
    mesh.renderOrder = 10000;
    root.add(mesh);
    scene.add(root);

    placementGhost = {
      root,
      mesh,
      tintMaterials: [ghostMaterial],
      key,
      widthCm: dimensions.widthCm,
      ownsGeometry: true,
      colorHex: PLACEMENT_VALID_COLOR,
    };
    return placementGhost;
  }

    // Bar Taburesi uses the actual GLB geometry as its placement ghost.
    if (ghostBehavior.renderer === 'bar-stool') {
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
      placementGhost = {
        root,
        mesh: proxy,
        tintMaterials,
        key,
        widthCm: dimensions.widthCm,
        ownsGeometry: true,
        colorHex: PLACEMENT_VALID_COLOR,
      };

      loadBarStoolModel().then((template) => {
        if (placementGhost?.key !== key || placementGhost.root !== root) return;
        const chair = template.clone(true);
        chair.traverse((object) => {
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

        chair.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(chair);
        const center = box.getCenter(new THREE.Vector3());
        chair.position.x -= center.x;
        chair.position.z -= center.z;
        chair.position.y -= box.min.y;
        root.add(chair);
      }).catch((error) => {
        console.warn('Bar Taburesi ghost GLB modeli yüklenemedi:', error);
      });

      return placementGhost;
    }

    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(dimensions.widthCm / 100, 0.02),
        dimensions.heightM,
        dimensions.depthM,
      ),
      new THREE.MeshBasicMaterial({
        color: PLACEMENT_VALID_COLOR,
        transparent: true,
        opacity: Number(ghostBehavior.opacity) || PLACEMENT_GHOST_OPACITY,
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
    const colorHex = valid ? PLACEMENT_VALID_COLOR : PLACEMENT_INVALID_COLOR;
    ghost.colorHex = colorHex;
    if (ghost.tintMaterials?.length) {
      ghost.tintMaterials.forEach((material) => material.color?.setHex(colorHex));
    } else if (ghost.mesh?.material?.color) {
      ghost.mesh.material.color.setHex(colorHex);
    }
    applyPlacementToGroup(ghost.root, placement, ghost.widthCm);
    ghost.root.visible = true;
  }

  function getDragModuleLabel(moduleState) {
    const widthCm = Number(moduleState?.widthCm) || 0;
    if (moduleState?.type === 'shelf') return 'Raf ' + widthCm + ' · ' + (Number(moduleState.shelfCount) || 2) + ' Raf';
    if (moduleState?.type === 'sofa-set-classic') return 'Bej Koltuk Takımı';
    if (moduleState?.type === 'table-chair-set-eames') return 'Eames Masa Sandalye Takımı';
    if (moduleState?.type === 'led-floodlight') return 'LED Projektör';
    if (moduleState?.type === 'base') return `Baza ${widthCm}`;
    if (moduleState?.type === 'counter') return moduleState.shape === 'L' ? ('Köşe Banko ' + widthCm + '×' + (Number(moduleState.depthCm) || widthCm)) : `Banko ${widthCm}`;
    if (moduleState?.type === 'separator') return `Separatör ${widthCm}`;
    if (moduleState?.type === 'door') return `Kapı ${widthCm}`;
    if (moduleState?.type === 'showcase-3') return `3 Gözlü Vitrin ${widthCm}`;
    if (moduleState?.type === 'showcase-2') return `2 Gözlü Vitrin ${widthCm}`;
    if (moduleState?.type === 'bar-stool') return 'Bar Taburesi';
    if (moduleState?.type === 'tv') return 'TV 42"';
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
      preview.innerHTML = '';
      preview.style.width = '24px';
      preview.style.height = (moduleState?.type === 'sofa-set-classic') ? '34px' : (moduleState?.type === 'base' ? '22px' : (moduleState?.type === 'counter' ? '28px' : '48px'));
      preview.style.position = 'relative';
      preview.style.border = '2px solid #8a929a';
      preview.style.background = 'repeating-linear-gradient(to bottom,#f7f7f5 0 5px,#c4c9ce 5px 6px)';

      if (moduleState?.type === 'bar-stool') {
        preview.style.width = '44px';
        preview.style.height = '58px';
        preview.style.border = '0';
        preview.style.background = 'transparent';
        const seat = document.createElement('span');
        seat.style.cssText = 'position:absolute;left:8px;top:4px;width:28px;height:20px;box-sizing:border-box;border:2px solid #8a929a;border-radius:10px 10px 5px 5px;background:#f8fafc';
        const frame = document.createElement('span');
        frame.style.cssText = 'position:absolute;left:11px;top:24px;width:22px;height:27px;box-sizing:border-box;border-left:3px solid #8a929a;border-right:3px solid #8a929a;border-bottom:3px solid #8a929a;border-radius:0 0 10px 10px';
        preview.append(seat, frame);
      } else if (moduleState?.type === 'sofa-set-classic') {
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

  function snapTopFixturePlacement(basePlacement, ground, widthCm) {
    const placement = {
      ...basePlacement,
      zCm: Math.round(STAND_DIMENSIONS.height * 100),
    };
    if (!stageLayout || !ground) return placement;

    const stepCm = 20;
    const width = Math.max(0, Number(widthCm) || 0);
    const snap20 = (value) => Math.round(Number(value) / stepCm) * stepCm;

    if (placement.wallId === 'back') {
      placement.xCm = Math.min(
        Math.max(0, Number(stageLayout.widthCm) - width),
        Math.max(0, snap20(ground.xCm)),
      );
      placement.yCm = 0;
    } else if (placement.wallId === 'left') {
      placement.xCm = 0;
      placement.yCm = Math.min(
        Math.max(0, Number(stageLayout.depthCm) - width),
        Math.max(0, snap20(ground.yCm)),
      );
    } else if (placement.wallId === 'right') {
      placement.xCm = Number(stageLayout.widthCm);
      placement.yCm = Math.min(
        Math.max(0, Number(stageLayout.depthCm) - width),
        Math.max(0, snap20(ground.yCm)),
      );
    }

    return placement;
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
    let moduleId = selectedModuleId;
    if (!moduleId) {
      const moduleIds = new Set(
        [...selectedSurfaces].map((surface) => surface.userData?.moduleId).filter(Boolean),
      );
      if (moduleIds.size !== 1) return null;
      [moduleId] = moduleIds;
    }
    return wallRoot.children.find((group) => (
      group.userData?.moduleState?.id === moduleId || group.userData?.moduleId === moduleId
    )) ?? null;
  }

  function rotateSelectedModule(deltaDeg) {
    if (!stageLayout || dragSession?.dragging) return { handled: false, ok: false };
    const moduleGroup = getSingleSelectedModuleGroup();
    const moduleState = moduleGroup?.userData?.moduleState;
    if (!moduleGroup || !moduleState?.placement) return { handled: false, ok: false };

    const stepDeg = getModuleRotationStepDeg(moduleState);
    const effectiveDeltaDeg = deltaDeg < 0 ? -stepDeg : stepDeg;
    const nextPlacement = rotateModulePlacementAroundCenter(
      moduleState.placement,
      moduleState.widthCm,
      effectiveDeltaDeg,
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
      shape: moduleState.shape,
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

  function getFreeTvPlacement(clientX, clientY, moduleState, preferredRotationZDeg = 0) {
    if (!stageLayout || !moduleState) return null;
    const ground = getGroundPoint(clientX, clientY);
    if (!ground) return null;
    const snapped = snapPlacementToStand({
      standType: stageLayout.standType,
      moduleType: moduleState.type,
      shape: moduleState.shape,
      widthCm: moduleState.widthCm,
      depthCm: moduleState.depthCm,
      forceFree: true,
      pointerXCm: ground.xCm,
      pointerYCm: ground.yCm,
      standXCm: stageLayout.widthCm,
      standYCm: stageLayout.depthCm,
      preferredRotationZDeg,
      rotationLocked: true,
    });
    if (!snapped.ok || !snapped.placement) return null;
    return {
      ...snapped.placement,
      wallId: 'free',
      zCm: Number(moduleState.placement?.zCm ?? 0),
    };
  }

  function getWallOverlayDragPoint(clientX, clientY, preferredWallId = null, moduleState = null) {
    if (!stageLayout) return null;
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    const overlayRaycaster = new THREE.Raycaster();
    overlayRaycaster.setFromCamera(ndc, camera);

    const allowedWalls = getAllowedWallIds(stageLayout.standType)
      .filter((wallId) => wallId === 'back' || wallId === 'left' || wallId === 'right');
    const pointedModule = pickModuleAt(clientX, clientY)?.moduleGroup?.userData?.moduleState;
    const pointedWallId = pointedModule?.placement?.wallId;
    const targetWallId = allowedWalls.includes(pointedWallId) ? pointedWallId : null;
    const candidateWalls = targetWallId ? [targetWallId] : allowedWalls;
    const intersections = [];

    candidateWalls.forEach((wallId) => {
      let plane;
      if (wallId === 'back') {
        plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      } else if (wallId === 'left') {
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
      } else {
        plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -stageLayout.widthM);
      }

      const hit = new THREE.Vector3();
      if (!overlayRaycaster.ray.intersectPlane(plane, hit)) return;
      const relativeY = hit.y - ACTIVE_PLATFORM_HEIGHT_M;
      if (relativeY < 0 || relativeY > STAND_DIMENSIONS.height) return;
      if (wallId === 'back' && (hit.x < 0 || hit.x > stageLayout.widthM)) return;
      if ((wallId === 'left' || wallId === 'right') && (hit.z < 0 || hit.z > stageLayout.depthM)) return;

      intersections.push({ wallId, hit, distance: hit.distanceTo(overlayRaycaster.ray.origin) });
    });

    if (!intersections.length) return null;
    intersections.sort((a, b) => a.distance - b.distance);
    const { wallId, hit } = intersections[0];
    const rotationZDeg = wallId === 'left' ? 90 : (wallId === 'right' ? 270 : 0);
    const pointerXCm = wallId === 'right' ? stageLayout.widthCm : Math.max(0, hit.x * 100);
    const pointerYCm = wallId === 'back' ? 0 : Math.max(0, hit.z * 100);

    const heightCm = Math.max(1, Number(moduleState?.screenHeightCm ?? moduleState?.heightCm ?? 52.3));
    const halfHeightM = heightCm / 200;
    const defaultCenterM = 1.75;
    const minOffsetCm = Math.ceil(((halfHeightM - defaultCenterM) * 100) / 10) * 10;
    const maxOffsetCm = Math.floor(((STAND_DIMENSIONS.height - halfHeightM - defaultCenterM) * 100) / 10) * 10;
    const rawOffsetCm = (hit.y - ACTIVE_PLATFORM_HEIGHT_M - defaultCenterM) * 100;
    const zCm = THREE.MathUtils.clamp(Math.round(rawOffsetCm / 10) * 10, minOffsetCm, maxOffsetCm);

    return { wallId, pointerXCm, pointerYCm, rotationZDeg, zCm };
  }

  function previewCatalogModuleDrag(
    moduleState,
    clientX,
    clientY,
    preferredRotationZDeg = 0,
    rotationLocked = false,
  ) {
    if (isWallOverlayModule(moduleState.type)) {
      const pointedModule = pickModuleAt(clientX, clientY)?.moduleGroup?.userData?.moduleState;
      const pointedOnWall = ['back', 'left', 'right'].includes(pointedModule?.placement?.wallId);
      if (!pointedOnWall) {
        const placement = getFreeTvPlacement(clientX, clientY, moduleState, preferredRotationZDeg);
        if (!placement) {
          disposePlacementGhost();
          const message = 'TV\'yi aktif stand alanına bırak.';
          showPlacementFeedback(message, { clientX, clientY });
          return { ok: false, message };
        }
        const plan = {
          ok: true,
          message: null,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        };
        showPlacementGhost(moduleState, placement, true);
        clearPlacementFeedback();
        return {
          ok: true,
          placement: { ...placement },
          message: null,
          plan,
          snap: { mode: 'free' },
        };
      }
      const wallPoint = getWallOverlayDragPoint(clientX, clientY, pointedModule.placement.wallId, moduleState);
      if (!wallPoint) {
        disposePlacementGhost();
        const message = 'TV bu yüzeye yerleştirilemedi.';
        showPlacementFeedback(message, { clientX, clientY });
        return { ok: false, message };
      }
      const snapped = snapPlacementToStand({
        standType: stageLayout.standType,
        moduleType: moduleState.type,
        shape: moduleState.shape,
        widthCm: moduleState.widthCm,
        depthCm: moduleState.depthCm,
        pointerXCm: wallPoint.pointerXCm,
        pointerYCm: wallPoint.pointerYCm,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
        preferredRotationZDeg: wallPoint.rotationZDeg,
        rotationLocked: true,
      });
      if (!snapped.ok || !snapped.placement) {
        disposePlacementGhost();
        const message = snapped.message ?? 'TV bu duvar konumuna yerleştirilemedi.';
        showPlacementFeedback(message, { clientX, clientY });
        return { ok: false, message };
      }
      const placement = { ...snapped.placement, zCm: wallPoint.zCm };
      const plan = {
        ok: true,
        message: null,
        movingPlacement: { ...placement },
        placements: new Map([[moduleState.id, { ...placement }]]),
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return {
        ok: true,
        placement: { ...placement },
        message: null,
        plan,
        snap: { mode: 'wall-overlay', wallId: wallPoint.wallId },
      };
    }
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
      moduleType: moduleState.type,
      shape: moduleState.shape,
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

    if (isWallOverlayModule(moduleState.type)) {
      const placement = { ...snapped.placement };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return {
        ok: true,
        placement,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'wall-overlay' },
      };
    }

    if (isTopFixtureType(moduleState.type)) {
      const isFreeTopFixture = snapped.placement.wallId === 'free';
      const placement = snapTopFixturePlacement(
        snapped.placement,
        ground,
        moduleState.widthCm,
      );
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return {
        ok: true,
        placement: { ...placement },
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: isFreeTopFixture ? 'top-free' : 'top-wall' },
      };
    }

    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
      moduleId: moduleState.id,
      moduleType: moduleState.type,
      shape: moduleState.shape,
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
      shape: moduleState.shape,
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

    const moduleState = dragSession.moduleState;

    if (isWallOverlayModule(moduleState.type)) {
      const pointedModule = pickModuleAt(event.clientX, event.clientY)?.moduleGroup?.userData?.moduleState;
      const pointedOnWall = ['back', 'left', 'right'].includes(pointedModule?.placement?.wallId);
      if (!pointedOnWall) {
        const placement = getFreeTvPlacement(
          event.clientX,
          event.clientY,
          moduleState,
          dragSession.preferredRotationZDeg,
        );
        if (!placement) {
          disposePlacementGhost();
          dragSession.preview = null;
          showPlacementFeedback('TV\'yi aktif stand alanında sürükle.', {
            clientX: event.clientX,
            clientY: event.clientY,
          });
          return;
        }
        dragSession.preview = {
          placement,
          valid: true,
          message: null,
          plan: {
            ok: true,
            movingPlacement: { ...placement },
            placements: new Map([[moduleState.id, { ...placement }]]),
          },
          snap: { mode: 'free' },
        };
        showPlacementGhost(moduleState, placement, true);
        clearPlacementFeedback();
        return;
      }
      const wallPoint = getWallOverlayDragPoint(
        event.clientX,
        event.clientY,
        pointedModule.placement.wallId,
        moduleState,
      );
      if (!wallPoint) {
        disposePlacementGhost();
        dragSession.preview = null;
        showPlacementFeedback('TV bu yüzeye taşınamadı.', {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        return;
      }
      const snapped = snapPlacementToStand({
        standType: stageLayout.standType,
        moduleType: moduleState.type,
        shape: moduleState.shape,
        widthCm: moduleState.widthCm,
        depthCm: moduleState.depthCm,
        pointerXCm: wallPoint.pointerXCm,
        pointerYCm: wallPoint.pointerYCm,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
        preferredRotationZDeg: wallPoint.rotationZDeg,
        rotationLocked: true,
      });
      if (!snapped.ok || !snapped.placement) {
        dragSession.preview = null;
        disposePlacementGhost();
        showPlacementFeedback(snapped.message ?? 'TV bu duvar konumuna taşınamadı.', {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        return;
      }
      const placement = { ...snapped.placement, zCm: wallPoint.zCm };
      dragSession.preview = {
        placement,
        valid: true,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'wall-overlay', wallId: wallPoint.wallId },
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return;
    }

    if (isTopFixtureType(moduleState.type)) {
      const currentWallId = dragSession.preview?.placement?.wallId
        ?? moduleState.placement?.wallId
        ?? 'back';
      const wallPoint = getTopFixtureDragPoint(event.clientX, event.clientY, currentWallId);
      if (!wallPoint) {
        disposePlacementGhost();
        dragSession.preview = null;
        showPlacementFeedback('Projektörü üst profil boyunca sürükle.', {
          clientX: event.clientX,
          clientY: event.clientY,
        });
        return;
      }

      const isFreeTopFixture = wallPoint.wallId === 'free';
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
      }
      dragSession.preview = {
        placement,
        valid: true,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'top-wall' },
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return;
    }

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

    const snapped = snapPlacementToStand({
      standType: stageLayout.standType,
      moduleType: moduleState.type,
      shape: moduleState.shape,
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

    if (isWallOverlayModule(moduleState.type)) {
      const placement = { ...snapped.placement };
      dragSession.preview = {
        placement,
        valid: true,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'wall-overlay' },
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return;
    }

    if (isTopFixtureType(moduleState.type)) {
      const placement = snapTopFixturePlacement(
        snapped.placement,
        ground,
        moduleState.widthCm,
      );
      dragSession.preview = {
        placement,
        valid: true,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'top-wall' },
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return;
    }

    const renderedModules = getRenderedModuleStates();
    const magneticSnap = snapPlacementToModules({
      moduleId: moduleState.id,
      moduleType: moduleState.type,
      shape: moduleState.shape,
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
      shape: moduleState.shape,
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

      if (mesh.userData.moduleType === 'sofa-set-classic') {
        colorTargets.forEach((target) => applyBeigeSofaBodyColor(target, hexColor));
        return;
      }

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

    const transferKey = getRebuildTextureKey(mesh);
    const retainedTexture = transferKey ? rebuildTextureTransfer?.get(transferKey) : null;
    if (retainedTexture && mesh.material) {
      mesh.material.map = retainedTexture;
      mesh.material.color.set(0xffffff);
      mesh.material.needsUpdate = true;
      rebuildTextureTransfer.delete(transferKey);
      return;
    }

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

  function handleSurfaceSelectionAt(clientX, clientY, rectangleSelect, fallbackModuleId = null) {
    setPointerFromClient(clientX, clientY);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(surfaceMeshes, false)[0];

    if (hit) {
      if (rectangleSelect && hit.object.userData.moduleType === 'counter') {
        toggleCounterSurface(hit.object);
        return;
      }

      const anchorMesh = surfaceMeshes.find(
        (surface) => surface.userData.surfaceId === selectionAnchorSurfaceId,
      );
      const canRectangleSelect = rectangleSelect
        && hit.object.userData.selectionMode !== 'module'
        && anchorMesh?.userData.selectionMode !== 'module';

      if (canRectangleSelect) selectRectangleTo(hit.object);
      else selectOnly(hit.object);
      return;
    }

    if (!rectangleSelect && fallbackModuleId) {
      selectModuleOnly(fallbackModuleId);
      return;
    }

    if (!rectangleSelect && activeFloor.visible) {
      const floorHit = raycaster.intersectObject(activeFloor, false)[0];
      if (floorHit) {
        clearSelection({ notify: false });
        selectedModuleId = null;
        floorSelected = true;
        notifyFloorSelection();
        return;
      }
    }

    if (!rectangleSelect) {
      selectedModuleId = null;
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
    if (moduleState) selectedModuleId = moduleState.id;
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
    const pressedKey = String(event.key).toLowerCase();

    const arrowDelta = {
      arrowleft: [-1, 0],
      arrowright: [1, 0],
      arrowup: [0, -1],
      arrowdown: [0, 1],
    }[pressedKey];
    if (arrowDelta) {
      const target = event.target;
      const tagName = String(target?.tagName ?? '').toLowerCase();
      const isEditing = tagName === 'input'
        || tagName === 'textarea'
        || tagName === 'select'
        || Boolean(target?.isContentEditable);
      if (isEditing || dragSession?.dragging) return;

      const moduleGroup = getSingleSelectedModuleGroup();
      const moduleState = moduleGroup?.userData?.moduleState;
      if (!moduleGroup || !moduleState?.placement || !stageLayout) return;

      event.preventDefault();
      const stepCm = isTopFixtureType(moduleState.type)
        ? 20
        : getModulePlacementSnapCm(moduleState.type);
      const desiredPlacement = createModulePlacement({
        ...moduleState.placement,
        xCm: Number(moduleState.placement.xCm || 0) + arrowDelta[0] * stepCm,
        yCm: Number(moduleState.placement.yCm || 0) + arrowDelta[1] * stepCm,
        wallId: 'free',
      });
      desiredPlacement.zCm = Number(moduleState.placement.zCm || 0);

      const renderedModules = getRenderedModuleStates();
      const validation = validatePlacementAgainstModules({
        placement: desiredPlacement,
        widthCm: moduleState.widthCm,
        depthCm: moduleState.depthCm,
        moduleId: moduleState.id,
        moduleType: moduleState.type,
        shape: moduleState.shape,
        modules: renderedModules,
        standType: stageLayout.standType,
        standXCm: stageLayout.widthCm,
        standYCm: stageLayout.depthCm,
      });
      if (!validation.ok) {
        showPlacementFeedback(validation.message ?? 'Bu yöne hareket edemez.', { durationMs: 900 });
        return;
      }

      moduleState.placement = { ...desiredPlacement };
      moduleGroup.userData.placement = { ...desiredPlacement };
      applyPlacementToGroup(moduleGroup, desiredPlacement, moduleState.widthCm);
      clearPlacementFeedback();
      return;
    }
    if (pressedKey === 'delete') {
      const target = event.target;
      const tagName = String(target?.tagName ?? '').toLowerCase();
      const isEditing = tagName === 'input'
        || tagName === 'textarea'
        || tagName === 'select'
        || Boolean(target?.isContentEditable);
      if (isEditing) return;

      const moduleGroup = getSingleSelectedModuleGroup();
      if (!moduleGroup) return;
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('fair-stand:delete-selected-module', {
        detail: {
          moduleId: moduleGroup.userData?.moduleId ?? null,
          moduleIndex: moduleGroup.userData?.moduleIndex ?? null,
        },
      }));
      return;
    }

    if (pressedKey !== 'r') return;

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
    const clickedModuleId = dragSession.moduleState?.id ?? null;
    const wasDragging = finishPlacementDrag(event);
    if (!wasDragging) {
      handleSurfaceSelectionAt(startClientX, startClientY, false, clickedModuleId);
    }
  });

  renderer.domElement.addEventListener('pointercancel', (event) => {
    if (!dragSession || event.pointerId !== dragSession.pointerId) return;
    clearPlacementDrag();
  });

  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    updateCameraProjection(width, height);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  // Keep interaction smooth, but do not burn the GPU rendering a static editor at
  // monitor refresh rate. OrbitControls reports camera movement; while idle we only
  // refresh occasionally so asynchronous texture/material updates still appear quickly.
  const activeFrameIntervalMs = coarsePointer ? (1000 / 30) : (1000 / 50);
  const idleFrameIntervalMs = 250;
  let lastRenderAt = -Infinity;
  const lastCubePosition = new THREE.Vector3(Number.NaN, Number.NaN, Number.NaN);
  const lastCubeQuaternion = new THREE.Quaternion(Number.NaN, Number.NaN, Number.NaN, Number.NaN);

  renderer.setAnimationLoop((now) => {
    const controlsChanged = Boolean(controls.update());
    const activelyDragging = Boolean(dragSession?.dragging);
    const frameInterval = (controlsChanged || activelyDragging)
      ? activeFrameIntervalMs
      : idleFrameIntervalMs;
    if (now - lastRenderAt < frameInterval) return;
    lastRenderAt = now;

    const cameraChanged = !camera.position.equals(lastCubePosition)
      || !camera.quaternion.equals(lastCubeQuaternion);
    if (cameraChanged) {
      viewCube.update();
      lastCubePosition.copy(camera.position);
      lastCubeQuaternion.copy(camera.quaternion);
    }
    renderer.render(scene, camera);
  });

  async function captureCurrentViewPng({ scale = 3 } = {}) {
    if (!stageLayout) return { ok: false, message: 'Önce stand sahnesini oluştur.' };

    const cssWidth = Math.max(1, renderer.domElement.clientWidth || container.clientWidth || 1);
    const cssHeight = Math.max(1, renderer.domElement.clientHeight || container.clientHeight || 1);
    const safeScale = Math.min(3, Math.max(1, Number(scale) || 3));
    const targetWidth = Math.round(cssWidth * safeScale);
    const targetHeight = Math.round(cssHeight * safeScale);
    const previousPixelRatio = renderer.getPixelRatio();
    const selectedFrames = [...selectedSurfaces]
      .map((surface) => surface.userData?.selectionFrame)
      .filter(Boolean);
    const selectedVisibility = selectedFrames.map((frame) => frame.visible);
    const guideVisibility = activeWallGuides.map((guide) => guide.visible);

    try {
      selectedFrames.forEach((frame) => { frame.visible = false; });
      activeWallGuides.forEach((guide) => { guide.visible = false; });

      renderer.setPixelRatio(1);
      renderer.setSize(targetWidth, targetHeight, false);
      updateCameraProjection(targetWidth, targetHeight);
      controls.update();
      renderer.render(scene, camera);

      const blob = await new Promise((resolve) => {
        renderer.domElement.toBlob(resolve, 'image/png');
      });
      if (!blob) return { ok: false, message: 'Render görüntüsü oluşturulamadı.' };
      return { ok: true, blob, width: targetWidth, height: targetHeight };
    } finally {
      selectedFrames.forEach((frame, index) => { frame.visible = selectedVisibility[index]; });
      activeWallGuides.forEach((guide, index) => { guide.visible = guideVisibility[index]; });
      renderer.setPixelRatio(previousPixelRatio);
      renderer.setSize(cssWidth, cssHeight, false);
      updateCameraProjection(cssWidth, cssHeight);
      controls.update();
      renderer.render(scene, camera);
    }
  }

  return {
    captureCurrentViewPng,
    setCameraMode,
    getCameraMode: () => cameraMode,
    createStage,
    setFloorType,
    setFloorColor,
    buildWall,
    clearWall,
    clearSelection: (...args) => {
      selectedModuleId = null;
      return clearSelection(...args);
    },
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
    isFloorSelected: () => floorSelected,
    getSelectedFloorType: () => (floorSelected ? currentFloorType : null),
  };
}

function createTvModule(moduleState, moduleIndex) {
  const widthM = Number(moduleState.screenWidthCm || 93) / 100;
  const heightM = Number(moduleState.screenHeightCm || 52.3) / 100;
  const depthM = 0.05;
  const centerYM = 1.75;
  // Each rendered TV owns a real TextureLoader result. Cloning the cached texture
  // before its async image load completes leaves clone.image empty and WebGL warns
  // "Texture marked for update but no image data found".
  const screenTexture = createTvScreenTexture();

  const group = new THREE.Group();
  group.userData.kind = 'module';
  group.userData.moduleId = moduleState.id;
  group.userData.moduleIndex = moduleIndex;
  group.userData.moduleType = 'tv';
  group.userData.type = 'tv';
  group.userData.widthCm = Number(moduleState.widthCm || 100);
  group.userData.depthCm = 5;
  group.userData.heightCm = Number(moduleState.screenHeightCm || 52.3);

  const blackMaterial = () => new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.72,
    metalness: 0.05,
  });

  // BoxGeometry face material order:
  // +X, -X, +Y, -Y, +Z(front), -Z(back).
  // The TV is ONE 93 x 52.3 x 5 cm solid. No extra screen plane exists.
  const materials = [
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    blackMaterial(),
    new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    }),
    blackMaterial(),
  ];

  const tv = new THREE.Mesh(
    new THREE.BoxGeometry(widthM, heightM, depthM),
    materials,
  );
  tv.position.set(0, centerYM, 0);
  tv.castShadow = true;
  tv.receiveShadow = true;

  // TV uses an array of six face materials, so emissive-based selection cannot mark it.
  // Give it the same explicit selection frame used by selectable panel surfaces.
  const selectionFrame = createSelectionFrame(widthM, heightM);
  selectionFrame.position.z = depthM / 2 + 0.006;
  selectionFrame.visible = false;
  tv.add(selectionFrame);

  tv.userData.kind = 'surface';
  tv.userData.surfaceId = `${moduleState.id}:tv`;
  tv.userData.moduleId = moduleState.id;
  tv.userData.moduleType = 'tv';
  tv.userData.moduleIndex = moduleIndex;
  tv.userData.acceptsImage = false;
  tv.userData.selectionMode = 'module';
  tv.userData.selectionFrame = selectionFrame;
  group.add(tv);

  return { group, surfaces: [tv] };
}

function createLedFloodlightModule(moduleState, moduleIndex) {
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'led-floodlight',
    widthCm: 50,
    depthCm: 20,
    heightCm: 35,
  };

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x101216,
    roughness: 0.3,
    metalness: 0.72,
  });
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x24282d,
    roughness: 0.34,
    metalness: 0.7,
  });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf8fff4,
    emissive: 0xf2ffe8,
    emissiveIntensity: 1.65,
    roughness: 0.08,
    metalness: 0,
    transmission: 0.08,
    clearcoat: 0.75,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide,
  });
  const ledMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff8d8,
    emissive: 0xfff2b8,
    emissiveIntensity: 2.5,
    roughness: 0.22,
    metalness: 0,
  });

  function roundedRectShape(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const r = Math.min(radius, width / 2, height / 2);
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  }

  function roundedBoxGeometry(width, height, depth, radius, bevel = 0.008) {
    const geometry = new THREE.ExtrudeGeometry(
      roundedRectShape(width, height, radius),
      {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 3,
        curveSegments: 8,
        steps: 1,
      },
    );
    geometry.translate(0, 0, -depth / 2);
    geometry.computeVertexNormals();
    return geometry;
  }

  // Profile oturan alçak bağlantı pabucu.
  const mount = new THREE.Mesh(
    roundedBoxGeometry(0.13, 0.026, 0.075, 0.012, 0.004),
    bodyMaterial.clone(),
  );
  mount.position.set(0, 0.014, 0.012);
  mount.castShadow = true;
  group.add(mount);

  // Gerçek floodlight tipi kalın U braket.
  const bracket = new THREE.Group();
  bracket.position.set(0, 0.045, 0.045);
  group.add(bracket);

  const bracketBase = new THREE.Mesh(
    roundedBoxGeometry(0.235, 0.026, 0.035, 0.01, 0.003),
    edgeMaterial.clone(),
  );
  bracketBase.castShadow = true;
  bracket.add(bracketBase);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(
      roundedBoxGeometry(0.026, 0.105, 0.034, 0.01, 0.003),
      edgeMaterial.clone(),
    );
    ear.position.set(side * 0.106, 0.057, 0.018);
    ear.castShadow = true;
    bracket.add(ear);
  });

  // Projektör kafa grubu: ince, yuvarlatılmış metal kasa.
  const head = new THREE.Group();
  head.position.set(0, 0.145, 0.108);
  head.rotation.x = THREE.MathUtils.degToRad(38);
  group.add(head);

  const body = new THREE.Mesh(
    roundedBoxGeometry(0.305, 0.178, 0.052, 0.018, 0.007),
    bodyMaterial.clone(),
  );
  body.castShadow = true;
  body.receiveShadow = true;
  head.add(body);

  // Ön yüzde hafif yükseltilmiş çerçeve + gömülü cam.
  const bezel = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRectShape(0.272, 0.145, 0.012), 8),
    edgeMaterial.clone(),
  );
  bezel.position.z = 0.032;
  head.add(bezel);

  const lens = new THREE.Mesh(
    new THREE.ShapeGeometry(roundedRectShape(0.246, 0.119, 0.009), 8),
    glassMaterial,
  );
  lens.position.z = 0.0335;
  head.add(lens);

  // LED dizisi: camın arkasında küçük ışık noktaları.
  const ledGroup = new THREE.Group();
  ledGroup.position.z = 0.0342;
  for (let row = -2; row <= 2; row += 1) {
    for (let col = -4; col <= 4; col += 1) {
      const led = new THREE.Mesh(new THREE.CircleGeometry(0.0042, 10), ledMaterial);
      led.position.set(col * 0.023, row * 0.021, 0);
      ledGroup.add(led);
    }
  }
  head.add(ledGroup);

  // Arka soğutucu kanatlar, silüeti gerçek projektöre yaklaştırır.
  for (let index = -4; index <= 4; index += 1) {
    const fin = new THREE.Mesh(
      roundedBoxGeometry(0.012, 0.128, 0.018, 0.004, 0.002),
      edgeMaterial.clone(),
    );
    fin.position.set(index * 0.027, 0, -0.039);
    fin.castShadow = true;
    head.add(fin);
  }

  // Braket pivot vidaları.
  [-1, 1].forEach((side) => {
    const screw = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.014, 20),
      edgeMaterial.clone(),
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(side * 0.157, 0.01, 0);
    screw.castShadow = true;
    head.add(screw);

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.009, 0.009, 0.016, 20),
      new THREE.MeshStandardMaterial({ color: 0x70757b, roughness: 0.3, metalness: 0.82 }),
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.set(side * 0.166, 0.01, 0);
    head.add(cap);
  });

  // Panel yüzüne gerçek aydınlatma.
  const spot = new THREE.SpotLight(0xfffbed, 44, 5.6, 0.48, 0.62, 1.35);
  spot.position.set(0, 0.16, 0.13);
  spot.castShadow = false;
  spot.target.position.set(0, -1.5, 1.15);
  group.add(spot, spot.target);

  const selectionFrame = createSelectionFrame(0.305, 0.178);
  selectionFrame.visible = false;
  lens.add(selectionFrame);
  lens.userData = {
    kind: 'surface',
    moduleType: 'led-floodlight',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm: 50,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'light',
    surfaceId: moduleState.surface?.id,
    surfaceState: moduleState.surface,
    selectionFrame,
    colorTargets: [],
  };

  return { group, surfaces: [lens] };
}

function createBarStoolModule(moduleState, moduleIndex) {
  const widthCm = Number(moduleState.widthCm || 60);
  const depthCm = Number(moduleState.depthCm || 55);
  const heightCm = Number(moduleState.heightCm || 121);
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'bar-stool',
    widthCm,
    depthCm,
    heightCm,
  };

  // Selection proxy only. The GLB frame/legs stay untouched; only the seat is color-editable.
  const colorTargets = [];
  const proxy = new THREE.Mesh(
    new THREE.BoxGeometry(widthCm / 100, heightCm / 100, depthCm / 100),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  );
  proxy.position.set(0, heightCm / 200, 0);
  group.add(proxy);

  const selectionFrame = createSelectionFrame(widthCm / 100, heightCm / 100);
  selectionFrame.visible = false;
  proxy.add(selectionFrame);
  proxy.userData = {
    kind: 'surface',
    moduleType: 'bar-stool',
    selectionMode: 'module',
    acceptsImage: false,
    moduleIndex,
    moduleId: moduleState.id,
    widthCm,
    stripIndex: null,
    stripNumber: null,
    surfaceRole: 'chair',
    surfaceId: moduleState.surface?.id,
    surfaceState: moduleState.surface,
    selectionFrame,
    colorTargets,
  };

  loadBarStoolModel().then((template) => {
    if (!group.parent) return;
    const chair = template.clone(true);
    chair.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;

      const isSeat = object.name === 'Cube.001_Burlington Leather_0'
        || object.material?.name === 'Burlington_Leather';
      if (!isSeat || !object.material) return;

      // The seat starts white and follows the module surface color. Remove only the
      // base-color texture so the original frame/legs and every other GLB material stay intact.
      object.material = object.material.clone();
      object.material.map = null;
      object.material.color?.set(moduleState.surface?.color ?? '#ffffff');
      object.material.needsUpdate = true;
      colorTargets.push(object);
    });

    chair.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(chair);
    const center = box.getCenter(new THREE.Vector3());
    chair.position.x -= center.x;
    chair.position.z -= center.z;
    chair.position.y -= box.min.y;
    group.add(chair);
  }).catch((error) => {
    console.warn('Bar Taburesi GLB modeli yüklenemedi:', error);
  });

  return { group, surfaces: [proxy] };
}


function createEamesTableChairSetModule(moduleState, moduleIndex) {
  const widthCm = Number(moduleState.widthCm || 150);
  const depthCm = Number(moduleState.depthCm || 150);
  const heightCm = Number(moduleState.heightCm || 82);
  const group = new THREE.Group();
  group.userData = {
    kind: 'module',
    moduleIndex,
    moduleId: moduleState.id,
    type: 'table-chair-set-eames',
    widthCm,
    depthCm,
    heightCm,
  };

  const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x30343a, roughness: 0.32, metalness: 0.74 });
  const tabletopMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd7e9ed,
    transparent: true,
    opacity: 0.42,
    roughness: 0.10,
    metalness: 0,
    transmission: 0.32,
    clearcoat: 0.65,
    clearcoatRoughness: 0.08,
    depthWrite: false,
  });

  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.375, 0.375, 0.018, 64), tabletopMaterial);
  top.position.set(0, 0.74, 0);
  top.receiveShadow = true;
  group.add(top);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.70, 20), metalMaterial.clone());
  stem.position.set(0, 0.37, 0);
  stem.castShadow = true;
  group.add(stem);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32), metalMaterial.clone());
  base.position.set(0, 0.018, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const colorTargets = [];
  const surfaces = [];
  const chairPlacements = [
    [-0.33, -0.33, Math.PI / 4],
    [0.33, -0.33, -Math.PI / 4],
    [-0.33, 0.33, Math.PI * 3 / 4],
    [0.33, 0.33, -Math.PI * 3 / 4],
  ];

  chairPlacements.forEach(([x, z, rotationY], index) => {
    const proxy = new THREE.Mesh(
      new THREE.BoxGeometry(0.50, 0.82, 0.56),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
    );
    proxy.position.set(x, 0.41, z);
    proxy.rotation.y = rotationY;
    group.add(proxy);

    const selectionFrame = index === 0 ? createSelectionFrame(0.50, 0.82) : null;
    if (selectionFrame) {
      selectionFrame.visible = false;
      proxy.add(selectionFrame);
    }

    proxy.userData = {
      kind: 'surface',
      moduleType: 'table-chair-set-eames',
      selectionMode: 'module',
      acceptsImage: false,
      moduleIndex,
      moduleId: moduleState.id,
      widthCm,
      stripIndex: null,
      stripNumber: null,
      surfaceRole: 'chair',
      surfaceId: index === 0 ? moduleState.surface?.id : moduleState.surface?.id + '-' + index,
      surfaceState: moduleState.surface,
      selectionFrame,
      colorTargets,
    };
    surfaces.push(proxy);
  });

  loadEamesChairModel().then((template) => {
    if (!group.parent) return;

    chairPlacements.forEach(([x, z, rotationY]) => {
      const chair = template.clone(true);
      chair.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = true;
        object.receiveShadow = true;
        if (object.material) object.material = object.material.clone();
        if (object.material?.name === 'plastic_wit') {
          object.material.color.set(moduleState.surface?.color ?? '#ffffff');
          colorTargets.push(object);
        } else if (object.material?.name === 'Material1') {
          // Eames GLB: Material1 is the four wooden chair legs.
          object.material.color.set('#a66b3d');
          object.material.metalness = 0;
          object.material.roughness = 0.58;
        }
      });

      chair.updateMatrixWorld(true);
      let box = new THREE.Box3().setFromObject(chair);
      const size = box.getSize(new THREE.Vector3());
      const scale = size.y > 0 ? EAMES_CHAIR_TARGET_HEIGHT_M / size.y : 1;
      chair.scale.multiplyScalar(scale);
      chair.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(chair);
      const center = box.getCenter(new THREE.Vector3());
      chair.position.x -= center.x;
      chair.position.z -= center.z;
      chair.position.y -= box.min.y;

      const holder = new THREE.Group();
      holder.position.set(x, 0, z);
      holder.rotation.y = rotationY;
      holder.add(chair);
      group.add(holder);
    });
  }).catch((error) => {
    console.warn('Eames GLB modeli yüklenemedi:', error);
  });

  return { group, surfaces };
}



const BEIGE_SOFA_LEG_MASKS = Object.freeze({
  beigechair2seatsofa_tripo_mat_0691346e_0: Object.freeze({
    radius: 0.00175,
    maxYRatio: 0.245,
    centers: Object.freeze([
      Object.freeze([-0.00284, -0.03336]),
      Object.freeze([-0.03125, -0.00507]),
      Object.freeze([-0.01806, -0.04668]),
      Object.freeze([-0.04541, -0.01885]),
    ]),
  }),
  beigechair1_tripo_mat_0691346e_0: Object.freeze({
    radius: 0.00165,
    maxYRatio: 0.245,
    centers: Object.freeze([
      Object.freeze([-0.03313, 0.03660]),
      Object.freeze([-0.01031, 0.03512]),
      Object.freeze([-0.02506, 0.02244]),
      Object.freeze([-0.02182, 0.04626]),
    ]),
  }),
  beigechair3_tripo_mat_0691346e_0: Object.freeze({
    radius: 0.00165,
    maxYRatio: 0.245,
    centers: Object.freeze([
      Object.freeze([0.03456, -0.03568]),
      Object.freeze([0.03415, -0.01213]),
      Object.freeze([0.02072, -0.02595]),
      Object.freeze([0.04524, -0.02491]),
    ]),
  }),
});

function makeBeigeSofaBodyWhite(object, upholsteryColor = '#ffffff') {
  if (!object?.isMesh || !object.geometry || !object.material) return;
  const mask = BEIGE_SOFA_LEG_MASKS[object.name];
  if (!mask) return;

  const sourceMaterial = Array.isArray(object.material) ? object.material[0] : object.material;
  if (!sourceMaterial) return;

  const geometry = object.geometry.clone();
  const position = geometry.getAttribute('position');
  if (!position || position.count < 3) return;

  let minY = Infinity;
  let maxY = -Infinity;
  for (let vertexIndex = 0; vertexIndex < position.count; vertexIndex += 1) {
    const y = position.getY(vertexIndex);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const legMaxY = minY + Math.max(maxY - minY, 1e-9) * mask.maxYRatio;
  const radiusSquared = mask.radius * mask.radius;
  const index = geometry.index;
  const triangleCount = Math.floor((index ? index.count : position.count) / 3);

  const triangleMaterial = new Uint8Array(triangleCount);
  for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex += 1) {
    const offset = triangleIndex * 3;
    const a = index ? index.getX(offset) : offset;
    const b = index ? index.getX(offset + 1) : offset + 1;
    const c = index ? index.getX(offset + 2) : offset + 2;
    const centerX = (position.getX(a) + position.getX(b) + position.getX(c)) / 3;
    const centerY = (position.getY(a) + position.getY(b) + position.getY(c)) / 3;
    const centerZ = (position.getZ(a) + position.getZ(b) + position.getZ(c)) / 3;

    if (centerY > legMaxY) continue;
    const isLeg = mask.centers.some(([legX, legZ]) => {
      const dx = centerX - legX;
      const dz = centerZ - legZ;
      return dx * dx + dz * dz <= radiusSquared;
    });
    if (isLeg) triangleMaterial[triangleIndex] = 1;
  }

  const whiteMaterial = sourceMaterial.clone();
  whiteMaterial.map = null;
  whiteMaterial.color?.set(upholsteryColor);
  whiteMaterial.userData = { ...(whiteMaterial.userData || {}), sofaUpholstery: true };
  whiteMaterial.needsUpdate = true;

  // Leg material is a plain clone of the original GLB material. No property is altered.
  const originalLegMaterial = sourceMaterial.clone();
  originalLegMaterial.userData = { ...(originalLegMaterial.userData || {}), sofaFixedWood: true };

  geometry.clearGroups();
  if (triangleCount > 0) {
    let runStart = 0;
    let runMaterial = triangleMaterial[0];
    for (let triangleIndex = 1; triangleIndex <= triangleCount; triangleIndex += 1) {
      const nextMaterial = triangleIndex < triangleCount ? triangleMaterial[triangleIndex] : 255;
      if (triangleIndex < triangleCount && nextMaterial === runMaterial) continue;
      geometry.addGroup(runStart * 3, (triangleIndex - runStart) * 3, runMaterial);
      runStart = triangleIndex;
      runMaterial = nextMaterial;
    }
  }

  object.geometry = geometry;
  object.material = [whiteMaterial, originalLegMaterial];
}

function applyBeigeSofaBodyColor(target, hexColor) {
  if (!target?.material) return;
  const materials = Array.isArray(target.material) ? target.material : [target.material];
  materials.forEach((material) => {
    if (!material?.userData?.sofaUpholstery) return;
    material.map = null;
    material.color?.set(hexColor);
    material.needsUpdate = true;
  });
}

function createBeigeSofaSetModule(moduleState, moduleIndex) {
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
    type: 'sofa-set-classic',
    widthCm,
    depthCm,
    heightCm,
  };

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
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  );
  proxy.position.set(0, heightM / 2, 0);
  group.add(proxy);

  const selectionFrame = createSelectionFrame(widthM, heightM);
  selectionFrame.visible = false;
  proxy.add(selectionFrame);
  proxy.userData = {
    kind: 'surface',
    moduleType: 'sofa-set-classic',
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

  const placements = Object.freeze([
    Object.freeze({ meshName: 'beigechair2seatsofa_tripo_mat_0691346e_0', targetWidthM: loveseatWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: 0, z: backRowZ, rotationYDeg: -45 }),
    Object.freeze({ meshName: 'beigechair1_tripo_mat_0691346e_0', targetWidthM: chairWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: -chairCenterOffsetM, z: frontRowZ, rotationYDeg: 40 }),
    Object.freeze({ meshName: 'beigechair3_tripo_mat_0691346e_0', targetWidthM: chairWidthM, targetDepthM: sofaDepthM, targetHeightM: heightM, x: chairCenterOffsetM, z: frontRowZ, rotationYDeg: 225 }),
  ]);

  loadBeigeSofaModel().then((template) => {
    if (!group.parent) return;

    placements.forEach((placement) => {
      const source = template.getObjectByName(placement.meshName);
      if (!source) {
        console.warn('Bej koltuk GLB mesh bulunamadı:', placement.meshName);
        return;
      }

      // Preserve the complete GLB node transform chain. Cloning only the mesh and
      // detaching it from its parents can lose scale/rotation authored above the mesh.
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
        object.castShadow = true;
        object.receiveShadow = true;
        makeBeigeSofaBodyWhite(object, moduleState.surface?.color ?? '#ffffff');
        colorTargets.push(object);
      });

      // Normalize around the object's real physical footprint and put its feet on y=0.
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

      // Loveseat is exactly 150 cm wide. Singles keep the requested +25% visual size,
      // while every axis still uses one uniform scale so the GLB proportions stay intact.
      const sizeCorrection = isLoveseat ? 1.40 : 1.25;
      const physicalWidthM = isLoveseat
        ? orientedSize.x
        : Math.max(sourceSize.x, sourceSize.z);
      const uniformScale = physicalWidthM > 0
        ? (placement.targetWidthM / physicalWidthM) * sizeCorrection
        : sizeCorrection;

      const fitted = new THREE.Group();
      fitted.scale.setScalar(uniformScale);
      fitted.position.set(placement.x, 0, placement.z);
      fitted.add(oriented);
      group.add(fitted);
    });
  }).catch((error) => {
    console.warn('Bej koltuk takımı GLB modeli yüklenemedi:', error);
  });

  const tableTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.60, 0.018, 0.42),
    new THREE.MeshPhysicalMaterial({ color: 0xd7e9ed, transparent: true, opacity: 0.42, roughness: 0.12, metalness: 0, transmission: 0.28, depthWrite: false }),
  );
  tableTop.position.set(0, 0.38, 0.10);
  tableTop.receiveShadow = true;
  group.add(tableTop);

  const tableStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.35, 20),
    new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.28 }),
  );
  tableStem.position.set(0, 0.19, 0.10);
  tableStem.castShadow = true;
  group.add(tableStem);

  const tableBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 0.035, 32),
    new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.72, roughness: 0.30 }),
  );
  tableBase.position.set(0, 0.018, 0.10);
  tableBase.castShadow = true;
  tableBase.receiveShadow = true;
  group.add(tableBase);

  return { group, surfaces: [proxy] };
}

function createBaseModule(moduleState, moduleIndex, onSurfaceReady) {
  const widthCm = Number(moduleState.widthCm);
  const depthCm = Number(moduleState.depthCm) || 50;
  const heightCm = Number(moduleState.heightCm) || 50;
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const heightM = heightCm / 100;
  const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;
  const railHeightM = PANEL_RAIL_HEIGHT_M;
  const frameDepthM = Number(STAND_DIMENSIONS.frameDepth);
  const topThicknessM = 0.035;
  const topOverhangM = 0.02;
  const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);
  const panelHeightM = Math.max(
    frameHeightM - railHeightM - PANEL_VERTICAL_CLEARANCE_M,
    0.05,
  );
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

  // Baza keeps its verified outer dimensions. Only the render language changes:
  // banko-style thin Maxima rails, with no middle rail because each face is one panel.
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

  const railYs = [0, frameHeightM];
  const frontRailGeometry = new THREE.BoxGeometry(frontPanelWidthM, railHeightM, frameDepthM);
  railYs.forEach((y) => {
    addProfile(
      frontRailGeometry.clone(),
      new THREE.Vector3(0, y, depthM / 2 - frameDepthM / 2),
    );
  });

  const sideRailGeometry = new THREE.BoxGeometry(frameDepthM, railHeightM, sidePanelWidthM);
  [-1, 1].forEach((xSide) => {
    railYs.forEach((y) => {
      addProfile(
        sideRailGeometry.clone(),
        new THREE.Vector3(xSide * (widthM / 2 - frameDepthM / 2), y, 0),
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
    if (surfaceRole === 'front') backing.position.z -= 0.006;
    else if (surfaceRole === 'left') backing.position.x += 0.006;
    else backing.position.x -= 0.006;
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
    if (surfaceRole === 'front') surface.position.z += 0.006;
    else if (surfaceRole === 'left') surface.position.x -= 0.006;
    else surface.position.x += 0.006;

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

  const panelCenterY = frameHeightM / 2;
  const frontZ = depthM / 2 - 0.006;
  const leftX = -widthM / 2 + 0.006;
  const rightX = widthM / 2 - 0.006;

  addPanelFace('front', moduleState.faces?.front, frontPanelWidthM, new THREE.Vector3(0, panelCenterY, frontZ));
  addPanelFace('left', moduleState.faces?.left, sidePanelWidthM, new THREE.Vector3(leftX, panelCenterY, 0), -Math.PI / 2);
  addPanelFace('right', moduleState.faces?.right, sidePanelWidthM, new THREE.Vector3(rightX, panelCenterY, 0), Math.PI / 2);

  return { group, surfaces };
}

function createCounterModule(moduleState, moduleIndex, onSurfaceReady) {
  if (moduleState.shape === 'L') return createLCounterModule(moduleState, moduleIndex, onSurfaceReady);
  const widthCm = Number(moduleState.widthCm);
  const depthCm = Number(moduleState.depthCm) || 50;
  const heightCm = Number(moduleState.heightCm) || 100;
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const heightM = heightCm / 100;
  const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;
  const topThicknessM = 0.04;
  const topOverhangM = 0.02;
  const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);
  // Banko panel aralıkları duvar panel sistemiyle birebir aynı mantığı kullanır.
  const railHeightM = PANEL_RAIL_HEIGHT_M;
  const stripHeightM = frameHeightM / 2;
  const panelHeightM = Math.max(
    stripHeightM - railHeightM - PANEL_VERTICAL_CLEARANCE_M,
    0.05,
  );
  const frontPanelWidthM = Math.max(widthM - profileM * 2 - 0.012, 0.05);
  const sidePanelWidthM = Math.max(depthM - profileM * 2 - 0.012, 0.05);
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

  // 4 visible Maxima corner posts.
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

  // Duvar modülündeki gibi 4 mm yatay raylar: alt, orta ve üst.
  const railYs = [0, stripHeightM, frameHeightM];
  const frameDepthM = Number(STAND_DIMENSIONS.frameDepth);
  const frontRailGeometry = new THREE.BoxGeometry(frontPanelWidthM, railHeightM, frameDepthM);
  railYs.forEach((y) => {
    addProfile(
      frontRailGeometry.clone(),
      new THREE.Vector3(0, y, depthM / 2 - frameDepthM / 2),
    );
  });

  const sideRailGeometry = new THREE.BoxGeometry(frameDepthM, railHeightM, sidePanelWidthM);
  [-1, 1].forEach((xSide) => {
    railYs.forEach((y) => {
      addProfile(
        sideRailGeometry.clone(),
        new THREE.Vector3(xSide * (widthM / 2 - frameDepthM / 2), y, 0),
      );
    });
  });

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(
      widthM + topOverhangM * 2,
      topThicknessM,
      depthM + topOverhangM * 2,
    ),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.58, metalness: 0 }),
  );
  top.position.set(0, frameHeightM + topThicknessM / 2, 0);
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);

  const surfaces = [];
  const addFace = (
    surfaceRole,
    panelLevel,
    surfaceState,
    faceWidthM,
    position,
    rotationY = 0,
  ) => {
    if (!surfaceState) return;

    const backing = new THREE.Mesh(
      new THREE.BoxGeometry(faceWidthM, panelHeightM, 0.012),
      new THREE.MeshStandardMaterial({ color: PANEL_BACK_COLOR, roughness: 0.74, metalness: 0 }),
    );
    backing.position.copy(position);
    backing.rotation.y = rotationY;
    if (surfaceRole === 'front') backing.position.z -= 0.006;
    else if (surfaceRole === 'left') backing.position.x += 0.006;
    else backing.position.x -= 0.006;
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
    if (surfaceRole === 'front') surface.position.z += 0.006;
    else if (surfaceRole === 'left') surface.position.x -= 0.006;
    else surface.position.x += 0.006;

    const selectionFrame = createSelectionFrame(faceWidthM, panelHeightM);
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
      stripIndex: panelLevel === 'lower' ? 0 : 1,
      stripNumber: panelLevel === 'lower' ? 1 : 2,
      surfaceRole,
      panelLevel,
      surfaceId: surfaceState.id,
      surfaceState,
      selectionFrame,
      backing,
    };
    group.add(surface);
    surfaces.push(surface);
    onSurfaceReady?.(surface);
  };

  const lowerY = stripHeightM / 2;
  const upperY = stripHeightM + stripHeightM / 2;
  const frontZ = depthM / 2 - 0.006;
  const leftX = -widthM / 2 + 0.006;
  const rightX = widthM / 2 - 0.006;

  addFace('front', 'lower', moduleState.faces?.frontLower, frontPanelWidthM, new THREE.Vector3(0, lowerY, frontZ));
  addFace('front', 'upper', moduleState.faces?.frontUpper, frontPanelWidthM, new THREE.Vector3(0, upperY, frontZ));
  addFace('left', 'lower', moduleState.faces?.leftLower, sidePanelWidthM, new THREE.Vector3(leftX, lowerY, 0), -Math.PI / 2);
  addFace('left', 'upper', moduleState.faces?.leftUpper, sidePanelWidthM, new THREE.Vector3(leftX, upperY, 0), -Math.PI / 2);
  addFace('right', 'lower', moduleState.faces?.rightLower, sidePanelWidthM, new THREE.Vector3(rightX, lowerY, 0), Math.PI / 2);
  addFace('right', 'upper', moduleState.faces?.rightUpper, sidePanelWidthM, new THREE.Vector3(rightX, upperY, 0), Math.PI / 2);

  return { group, surfaces };
}

function createLCounterModule(moduleState, moduleIndex, onSurfaceReady) {
  const widthCm = Number(moduleState.widthCm) || 100;
  const depthCm = Number(moduleState.depthCm) || widthCm;
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const armM = 0.50;
  const heightM = Number(moduleState.heightCm || 100) / 100;
  const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;
  const frameDepthM = Number(STAND_DIMENSIONS.frameDepth);
  const railHeightM = PANEL_RAIL_HEIGHT_M;
  const topThicknessM = 0.04;
  const frameHeightM = heightM - topThicknessM;
  const stripHeightM = frameHeightM / 2;
  const panelHeightM = Math.max(stripHeightM - railHeightM - PANEL_VERTICAL_CLEARANCE_M, 0.05);
  const frontPanelM = Math.max(widthM - profileM * 2 - 0.012, 0.05);
  const rightPanelM = Math.max(depthM - profileM * 2 - 0.012, 0.05);
  const shortPanelM = Math.max(armM - profileM * 2 - 0.012, 0.05);
  const group = new THREE.Group();
  group.userData = { kind:'module', moduleIndex, moduleId:moduleState.id, type:'counter', widthCm, depthCm, heightCm:100, counterShape:'L' };
  const frameMaterial = new THREE.MeshStandardMaterial({ color:FRAME_COLOR, metalness:0.68, roughness:0.28 });
  const addProfile = (geometry, position) => { const mesh = new THREE.Mesh(geometry, frameMaterial.clone()); mesh.position.copy(position); mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh); return mesh; };
  const postGeometry = new THREE.BoxGeometry(profileM, frameHeightM, profileM);
  [
    [-widthM / 2 + profileM / 2, -depthM / 2 + profileM / 2],
    [widthM / 2 - profileM / 2, -depthM / 2 + profileM / 2],
    [widthM / 2 - profileM / 2, depthM / 2 - profileM / 2],
    [widthM / 2 - armM + profileM / 2, depthM / 2 - profileM / 2],
    [-widthM / 2 + profileM / 2, -depthM / 2 + armM - profileM / 2],
  ].forEach(([x, z]) => addProfile(
    postGeometry.clone(),
    new THREE.Vector3(x, frameHeightM / 2, z),
  ));
  const railYs=[0,stripHeightM,frameHeightM];
  const addRailX=(length,x,z)=>railYs.forEach(y=>addProfile(new THREE.BoxGeometry(length,railHeightM,frameDepthM),new THREE.Vector3(x,y,z)));
  const addRailZ=(length,x,z)=>railYs.forEach(y=>addProfile(new THREE.BoxGeometry(frameDepthM,railHeightM,length),new THREE.Vector3(x,y,z)));
  addRailX(frontPanelM,0,-depthM/2+frameDepthM/2);
  addRailZ(rightPanelM,widthM/2-frameDepthM/2,0);
  addRailZ(shortPanelM,-widthM/2+frameDepthM/2,-depthM/2+armM/2);
  addRailX(shortPanelM,widthM/2-armM/2,depthM/2-frameDepthM/2);

  const topMaterial = new THREE.MeshStandardMaterial({ color:0xf8fafc, roughness:0.58, metalness:0 });
  if (widthCm === 100 && depthCm === 100) {
    const topA=new THREE.Mesh(new THREE.BoxGeometry(1.10,topThicknessM,0.60),topMaterial.clone()); topA.position.set(0,frameHeightM+topThicknessM/2,-0.25); topA.castShadow=true; topA.receiveShadow=true; group.add(topA);
    const topB=new THREE.Mesh(new THREE.BoxGeometry(0.52,topThicknessM,0.60),topMaterial.clone()); topB.rotation.y=Math.PI/2; topB.position.set(0.25,frameHeightM+topThicknessM/2,0.29); topB.castShadow=true; topB.receiveShadow=true; group.add(topB);
  } else {
    // 150/200 L bankolar normal düz banko renderer mantığını kullanır: 2 cm tabla taşması.
    const topOverhangM = 0.02;
    const topA = new THREE.Mesh(
      new THREE.BoxGeometry(widthM + topOverhangM * 2, topThicknessM, armM + topOverhangM * 2),
      topMaterial.clone(),
    );
    topA.position.set(0, frameHeightM + topThicknessM / 2, -depthM / 2 + armM / 2);
    topA.castShadow = true;
    topA.receiveShadow = true;
    group.add(topA);

    const returnExtensionM = Math.max(depthM - armM, 0.02);
    const topB = new THREE.Mesh(
      new THREE.BoxGeometry(returnExtensionM + topOverhangM * 2, topThicknessM, armM + topOverhangM * 2),
      topMaterial.clone(),
    );
    topB.rotation.y = Math.PI / 2;
    topB.position.set(widthM / 2 - armM / 2, frameHeightM + topThicknessM / 2, armM / 2);
    topB.castShadow = true;
    topB.receiveShadow = true;
    group.add(topB);
  }

  const surfaces=[];
  const addFace=(surfaceRole,panelLevel,surfaceState,faceWidthM,position,rotationY=0,outward=1)=>{
    if(!surfaceState)return;
    const backing=new THREE.Mesh(new THREE.BoxGeometry(faceWidthM,panelHeightM,0.012),new THREE.MeshStandardMaterial({color:PANEL_BACK_COLOR,roughness:0.74,metalness:0})); backing.position.copy(position); backing.rotation.y=rotationY; backing.castShadow=true; backing.receiveShadow=true; group.add(backing);
    const surface=new THREE.Mesh(new THREE.PlaneGeometry(faceWidthM,panelHeightM),new THREE.MeshStandardMaterial({color:surfaceState.imageAssetId?0xffffff:surfaceState.color,roughness:0.72,metalness:0,side:THREE.DoubleSide,emissive:0x000000,emissiveIntensity:0})); surface.position.copy(position); surface.rotation.y=rotationY; if(Math.abs(rotationY)<0.01)surface.position.z+=0.007*outward;else surface.position.x+=0.007*outward;
    const selectionFrame=createSelectionFrame(faceWidthM,panelHeightM); selectionFrame.visible=false; surface.add(selectionFrame);
    surface.userData={kind:'surface',moduleType:'counter',counterShape:'L',selectionMode:'module',acceptsImage:true,moduleIndex,moduleId:moduleState.id,widthCm,depthCm,stripIndex:panelLevel==='lower'?0:1,stripNumber:panelLevel==='lower'?1:2,surfaceRole,panelLevel,surfaceId:surfaceState.id,surfaceState,selectionFrame,backing}; group.add(surface); surfaces.push(surface); onSurfaceReady?.(surface);
  };
  const lowerY=stripHeightM/2, upperY=stripHeightM+stripHeightM/2;
  addFace('front','lower',moduleState.faces?.frontLower,frontPanelM,new THREE.Vector3(0,lowerY,-depthM/2),0,-1); addFace('front','upper',moduleState.faces?.frontUpper,frontPanelM,new THREE.Vector3(0,upperY,-depthM/2),0,-1);
  addFace('right','lower',moduleState.faces?.rightLower,rightPanelM,new THREE.Vector3(widthM/2,lowerY,0),Math.PI/2,1); addFace('right','upper',moduleState.faces?.rightUpper,rightPanelM,new THREE.Vector3(widthM/2,upperY,0),Math.PI/2,1);
  addFace('left','lower',moduleState.faces?.leftLower,shortPanelM,new THREE.Vector3(-widthM/2,lowerY,-depthM/2+armM/2),-Math.PI/2,-1); addFace('left','upper',moduleState.faces?.leftUpper,shortPanelM,new THREE.Vector3(-widthM/2,upperY,-depthM/2+armM/2),-Math.PI/2,-1);
  addFace('return','lower',moduleState.faces?.returnLower,shortPanelM,new THREE.Vector3(widthM/2-armM/2,lowerY,depthM/2),0,1); addFace('return','upper',moduleState.faces?.returnUpper,shortPanelM,new THREE.Vector3(widthM/2-armM/2,upperY,depthM/2),0,1);
  return {group,surfaces};
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
    color: 0xb8bcc1,
    roughness: 0.78,
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
      wallDepthM / 2 + shelfDepthM + 0.0125,
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
    const surfaceState = moduleState.strips?.[stripIndex];
    if (!surfaceState) {
      console.warn('Eksik panel strip state atlandı:', moduleState.type, moduleState.id, stripIndex);
      continue;
    }
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
      shape: moduleState.shape,
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