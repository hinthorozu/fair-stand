import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { colorIntToCss, readItemBoxCm } from './itemAssembly.js';
import {
  ASSEMBLY_CORNERS,
  localCornerOffsetMeters,
  snapMeshCornerToCorner,
} from './itemAdminCornerSnap.js';

function cmToM(cm) {
  return Number(cm) / 100;
}

function applyLocalPose(mesh, part) {
  const widthM = cmToM(part.widthCm);
  const depthM = cmToM(part.depthCm);
  const heightM = cmToM(part.heightCm);
  // zCm = taban yüksekliği; zeminin altına inmez (zCm >= 0).
  const zCm = Math.max(0, Number(part.zCm) || 0);
  mesh.position.set(
    cmToM(part.xCm),
    cmToM(zCm) + heightM / 2,
    cmToM(part.yCm),
  );
  // Ürün: rotX→W, rotY→D, rotZ→H. Three Y-up: X=W, Y=H, Z=D.
  mesh.rotation.set(
    THREE.MathUtils.degToRad(Number(part.rotationXDeg) || 0),
    THREE.MathUtils.degToRad(Number(part.rotationZDeg) || 0),
    THREE.MathUtils.degToRad(Number(part.rotationYDeg) || 0),
  );
  mesh.userData.partSize = { widthM, depthM, heightM };
  clampMeshAboveGround(mesh);
}

/** Kutunun kendi geometrisi y=0 altına düşmesin (köşe marker child’ları AABB’ye girmez). */
function clampMeshAboveGround(mesh) {
  if (!mesh?.geometry) return;
  mesh.updateMatrixWorld(true);
  if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
  const local = mesh.geometry.boundingBox;
  if (!local) return;
  const box = local.clone().applyMatrix4(mesh.matrixWorld);
  if (Number.isFinite(box.min.y) && box.min.y < 0) {
    mesh.position.y += -box.min.y;
  }
}

function readPoseFromMesh(mesh) {
  const size = mesh.userData.partSize || { widthM: 0.1, depthM: 0.1, heightM: 0.1 };
  const zCm = Math.max(0, (mesh.position.y - size.heightM / 2) * 100);
  return {
    xCm: mesh.position.x * 100,
    yCm: mesh.position.z * 100,
    zCm,
    rotationXDeg: THREE.MathUtils.radToDeg(mesh.rotation.x),
    rotationYDeg: THREE.MathUtils.radToDeg(mesh.rotation.z),
    rotationZDeg: THREE.MathUtils.radToDeg(mesh.rotation.y),
  };
}

/** Canvas sprite: W / D / H etiketi (orbit ile döner). */
function makeAxisLabel(text, colorCss) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.strokeText(text, 64, 32);
  ctx.fillStyle = colorCss;
  ctx.fillText(text, 64, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.28, 0.14, 1);
  sprite.renderOrder = 10;
  return sprite;
}

/**
 * SCENE_POSE: X=W, Y=D (+öne), Z=H (yukarı).
 * Three Y-up: W→+X, H→+Y dünya, D→+Z dünya.
 */
function createWdHAxes(lengthM = 0.85) {
  const group = new THREE.Group();
  group.name = 'wdh-axes';

  const axes = [
    { key: 'W', dir: new THREE.Vector3(1, 0, 0), color: 0xdc2626, css: '#dc2626' },
    { key: 'H', dir: new THREE.Vector3(0, 1, 0), color: 0x16a34a, css: '#16a34a' },
    { key: 'D', dir: new THREE.Vector3(0, 0, 1), color: 0x2563eb, css: '#2563eb' },
  ];

  for (const axis of axes) {
    const arrow = new THREE.ArrowHelper(
      axis.dir,
      new THREE.Vector3(0, 0.002, 0),
      lengthM,
      axis.color,
      lengthM * 0.18,
      lengthM * 0.1,
    );
    arrow.line.material.depthTest = false;
    arrow.cone.material.depthTest = false;
    arrow.renderOrder = 9;
    group.add(arrow);

    const label = makeAxisLabel(axis.key, axis.css);
    label.position.copy(axis.dir).multiplyScalar(lengthM + 0.12);
    label.position.y += 0.02;
    group.add(label);
  }

  return group;
}

function createAxisLegend(host) {
  const legend = document.createElement('div');
  legend.className = 'fair-stand-item-3d-preview-legend';
  legend.setAttribute('aria-hidden', 'true');
  Object.assign(legend.style, {
    position: 'absolute',
    left: '10px',
    bottom: '10px',
    zIndex: '2',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '8px 10px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(148,163,184,0.7)',
    font: '12px/1.35 system-ui, sans-serif',
    color: '#334155',
    pointerEvents: 'none',
    boxShadow: '0 1px 4px rgba(15,23,42,0.08)',
  });
  legend.innerHTML = [
    '<strong style="margin-bottom:2px">Eksen (ürün)</strong>',
    '<span><span style="color:#dc2626;font-weight:700">W</span> kırmızı · genişlik +X</span>',
    '<span><span style="color:#2563eb;font-weight:700">D</span> mavi · derinlik +öne</span>',
    '<span><span style="color:#16a34a;font-weight:700">H</span> yeşil · yükseklik yukarı</span>',
  ].join('');
  host.appendChild(legend);
  return legend;
}

/**
 * Admin Item 3D önizleme (ince Three sahne; scene3d kopyası değil).
 * @returns {{ setState: Function, getParts: Function, dispose: Function }}
 */
export function mountItemAdminPreview(host, options = {}) {
  if (!host) throw new TypeError('mountItemAdminPreview requires a host element.');

  const state = {
    isRender: options.isRender !== false,
    mode: options.mode === 'assembly' ? 'assembly' : 'envelope',
    envelope: options.envelope || null,
    parts: Array.isArray(options.parts) ? options.parts.map((part) => ({ ...part })) : [],
    message: options.message || null,
    onPartsChange: typeof options.onPartsChange === 'function' ? options.onPartsChange : null,
    onSelectionChange: typeof options.onSelectionChange === 'function' ? options.onSelectionChange : null,
    onSnapModeChange: typeof options.onSnapModeChange === 'function' ? options.onSnapModeChange : null,
    onSnapSessionChange: typeof options.onSnapSessionChange === 'function' ? options.onSnapSessionChange : null,
    snapMode: false,
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe8eef4);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.05, 200);
  camera.position.set(2.4, 1.8, 2.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  host.replaceChildren();
  host.appendChild(renderer.domElement);
  Object.assign(renderer.domElement.style, {
    width: '100%',
    height: '100%',
    display: 'block',
    borderRadius: '8px',
  });

  const messageEl = document.createElement('p');
  messageEl.className = 'fair-stand-item-3d-preview-message';
  Object.assign(messageEl.style, {
    position: 'absolute',
    inset: '0',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0',
    padding: '16px',
    textAlign: 'center',
    color: '#4b5563',
    background: 'rgba(232,238,244,0.92)',
    borderRadius: '8px',
    pointerEvents: 'none',
  });
  host.style.position = host.style.position || 'relative';
  host.appendChild(messageEl);
  const legendEl = createAxisLegend(host);

  const hemi = new THREE.HemisphereLight(0xffffff, 0xb0b8c0, 0.85);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.75);
  dir.position.set(3, 6, 2);
  dir.castShadow = true;
  scene.add(dir);

  const grid = new THREE.GridHelper(8, 16, 0x94a3b8, 0xcbd5e1);
  scene.add(grid);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({ color: 0xdbe3ec, roughness: 1, metalness: 0 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.001;
  ground.receiveShadow = true;
  scene.add(ground);

  // Sabit ürün eksenleri (rebuild content'i temizlerken silinmez).
  const axes = createWdHAxes(0.9);
  scene.add(axes);

  const content = new THREE.Group();
  scene.add(content);

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.target.set(0, 0.6, 0);

  const transform = new TransformControls(camera, renderer.domElement);
  transform.setMode('translate');
  transform.setSpace('world');
  transform.showX = true;
  transform.showY = true;
  transform.showZ = true;
  transform.addEventListener('dragging-changed', (event) => {
    orbit.enabled = !event.value;
    // Sürükleme bittiğinde açıları bir kez senkronla (her frame React setState → donma).
    if (!event.value && selected) {
      clampMeshAboveGround(selected);
      emitPartsChange();
      emitSelectionChange(selected);
    }
  });
  transform.addEventListener('objectChange', () => {
    if (selected) clampMeshAboveGround(selected);
    // Pose’u canlı tut; UI seçimini sürüklerken spam etme.
    if (!transform.dragging) {
      emitPartsChange();
      if (selected) emitSelectionChange(selected);
    }
  });
  scene.add(transform.getHelper());

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let selected = null;
  let snapSource = null;
  let disposed = false;
  let frame = 0;
  const cornerMarkerGeo = new THREE.SphereGeometry(0.04, 12, 12);

  function disposeObjectTree(root) {
    root.traverse((node) => {
      if (node.geometry && node.geometry !== cornerMarkerGeo) node.geometry.dispose?.();
      if (node.material) {
        if (Array.isArray(node.material)) node.material.forEach((m) => m.dispose());
        else node.material.dispose();
      }
    });
  }

  function clearSnapSource() {
    if (snapSource?.marker?.material?.color) {
      snapSource.marker.material.color.setHex(0xf59e0b);
    }
    snapSource = null;
    emitSnapSessionChange();
  }

  function setCornerMarkersVisible(visible) {
    content.traverse((node) => {
      if (node.userData?.isCornerMarker) node.visible = Boolean(visible);
    });
  }

  function attachCornerMarkers(mesh) {
    const size = mesh.userData.partSize;
    if (!size) return;
    for (const corner of ASSEMBLY_CORNERS) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        depthTest: false,
        transparent: true,
        opacity: 0.95,
      });
      const marker = new THREE.Mesh(cornerMarkerGeo, material);
      const offset = localCornerOffsetMeters(size, corner);
      marker.position.set(offset.x, offset.y, offset.z);
      marker.renderOrder = 20;
      marker.visible = state.snapMode;
      marker.userData.isCornerMarker = true;
      marker.userData.cornerKey = corner.key;
      marker.userData.cornerLabel = corner.label;
      marker.userData.partMesh = mesh;
      mesh.add(marker);
    }
  }

  function emitSnapModeChange() {
    if (typeof state.onSnapModeChange === 'function') {
      state.onSnapModeChange(Boolean(state.snapMode));
    }
  }

  function emitSnapSessionChange() {
    if (typeof state.onSnapSessionChange !== 'function') return;
    if (!snapSource) {
      state.onSnapSessionChange(null);
      return;
    }
    const part = snapSource.mesh?.userData?.part;
    state.onSnapSessionChange({
      childItemKey: String(part?.childItemKey || ''),
      instanceIndex: Number.isInteger(Number(part?.instanceIndex)) ? Number(part.instanceIndex) : 0,
      cornerKey: snapSource.cornerKey,
      cornerLabel: snapSource.marker?.userData?.cornerLabel || snapSource.cornerKey,
    });
  }

  function setSnapMode(enabled) {
    const next = Boolean(enabled) && state.mode === 'assembly';
    state.snapMode = next;
    clearSnapSource();
    if (next) {
      transform.detach();
      setCornerMarkersVisible(true);
    } else {
      setCornerMarkersVisible(false);
    }
    emitSnapModeChange();
    return state.snapMode;
  }

  function clearContent() {
    transform.detach();
    selected = null;
    clearSnapSource();
    emitSelectionChange(null);
    while (content.children.length) {
      const child = content.children[0];
      content.remove(child);
      disposeObjectTree(child);
    }
  }

  function emitSelectionChange(mesh) {
    if (typeof state.onSelectionChange !== 'function') return;
    if (!mesh?.userData?.part) {
      state.onSelectionChange(null);
      return;
    }
    const part = mesh.userData.part;
    const pose = readPoseFromMesh(mesh);
    state.onSelectionChange({
      childItemKey: String(part.childItemKey || ''),
      instanceIndex: Number.isInteger(Number(part.instanceIndex)) ? Number(part.instanceIndex) : 0,
      rotationXDeg: Number(pose.rotationXDeg) || 0,
      rotationYDeg: Number(pose.rotationYDeg) || 0,
      rotationZDeg: Number(pose.rotationZDeg) || 0,
    });
  }

  function emitPartsChange() {
    if (!state.onPartsChange || state.mode !== 'assembly') return;
    state.onPartsChange(getParts());
  }

  function makeBoxMesh(part, { wire = false } = {}) {
    const widthM = Math.max(cmToM(part.widthCm), 0.01);
    const depthM = Math.max(cmToM(part.depthCm), 0.01);
    const heightM = Math.max(cmToM(part.heightCm), 0.01);
    const geometry = new THREE.BoxGeometry(widthM, heightM, depthM);
    const material = new THREE.MeshStandardMaterial({
      color: part.colorCss || '#9ca3af',
      roughness: 0.72,
      metalness: 0.08,
      transparent: wire,
      opacity: wire ? 0.22 : 1,
      depthWrite: !wire,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = !wire;
    mesh.receiveShadow = true;
    mesh.userData.part = { ...part };
    applyLocalPose(mesh, {
      ...part,
      widthCm: widthM * 100,
      depthCm: depthM * 100,
      heightCm: heightM * 100,
    });
    if (wire) {
      mesh.position.set(0, heightM / 2, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.userData.isEnvelope = true;
    } else {
      attachCornerMarkers(mesh);
    }
    return mesh;
  }

  function getParts() {
    return content.children
      .filter((child) => child.isMesh && child.userData.part && !child.userData.isEnvelope)
      .map((mesh) => {
        const pose = readPoseFromMesh(mesh);
        return {
          ...mesh.userData.part,
          ...pose,
        };
      });
  }

  /** Ön-sağ izometrik: W sağa, H yukarı, D öne. */
  function fitCamera() {
    const box = new THREE.Box3().setFromObject(content);
    if (box.isEmpty()) {
      camera.position.set(2.2, 1.6, 2.6);
      orbit.target.set(0, 0.45, 0);
      orbit.update();
      return;
    }
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z, 0.4);
    camera.position.set(
      center.x + radius * 1.55,
      center.y + radius * 1.05,
      center.z + radius * 1.55,
    );
    orbit.target.copy(center);
    orbit.update();
  }

  function showMessage(text) {
    messageEl.textContent = text || '';
    messageEl.style.display = text ? 'flex' : 'none';
    renderer.domElement.style.visibility = text ? 'hidden' : 'visible';
    legendEl.style.display = text ? 'none' : 'flex';
    axes.visible = !text;
  }

  function rebuild() {
    clearContent();
    if (state.message) {
      showMessage(state.message);
      return;
    }
    if (!state.isRender) {
      showMessage('isRender kapalı — bu Item sahnede çizilmez.');
      return;
    }
    showMessage(null);

    if (state.mode === 'assembly' && state.parts.length) {
      if (state.envelope) {
        const ghost = makeBoxMesh(
          {
            ...state.envelope,
            colorCss: state.envelope.colorCss || '#64748b',
            xCm: 0,
            yCm: 0,
            zCm: 0,
            rotationXDeg: 0,
            rotationYDeg: 0,
            rotationZDeg: 0,
          },
          { wire: true },
        );
        content.add(ghost);
      }
      for (const part of state.parts) {
        content.add(makeBoxMesh(part));
      }
    } else if (state.envelope) {
      content.add(
        makeBoxMesh({
          ...state.envelope,
          xCm: 0,
          yCm: 0,
          zCm: 0,
          rotationXDeg: 0,
          rotationYDeg: 0,
          rotationZDeg: 0,
        }),
      );
    } else {
      showMessage('Ölçü yok — width / depth / height girin.');
      return;
    }
    fitCamera();
  }

  function resize() {
    const width = Math.max(host.clientWidth || 320, 1);
    const height = Math.max(host.clientHeight || 320, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function onPointerDown(event) {
    if (state.mode !== 'assembly' || transform.dragging) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    if (state.snapMode) {
      const markers = [];
      content.traverse((node) => {
        if (node.userData?.isCornerMarker && node.visible) markers.push(node);
      });
      const markerHits = raycaster.intersectObjects(markers, false);
      if (!markerHits.length) return;
      const marker = markerHits[0].object;
      const partMesh = marker.userData.partMesh;
      const cornerKey = marker.userData.cornerKey;
      if (!partMesh || !cornerKey) return;

      if (!snapSource) {
        snapSource = { mesh: partMesh, cornerKey, marker };
        marker.material.color.setHex(0x2563eb);
        selected = partMesh;
        emitSelectionChange(selected);
        emitSnapSessionChange();
        return;
      }

      if (snapSource.mesh === partMesh && snapSource.cornerKey === cornerKey) {
        clearSnapSource();
        return;
      }

      if (snapSource.mesh === partMesh) {
        clearSnapSource();
        snapSource = { mesh: partMesh, cornerKey, marker };
        marker.material.color.setHex(0x2563eb);
        emitSnapSessionChange();
        return;
      }

      const moved = snapMeshCornerToCorner(
        snapSource.mesh,
        snapSource.cornerKey,
        partMesh,
        cornerKey,
      );
      if (moved) {
        clampMeshAboveGround(snapSource.mesh);
        selected = snapSource.mesh;
        emitPartsChange();
        emitSelectionChange(selected);
      }
      clearSnapSource();
      return;
    }

    const hits = raycaster.intersectObjects(
      content.children.filter((child) => child.isMesh && !child.userData.isEnvelope),
      false,
    );
    if (!hits.length) {
      transform.detach();
      selected = null;
      emitSelectionChange(null);
      return;
    }
    selected = hits[0].object;
    transform.attach(selected);
    emitSelectionChange(selected);
  }

  function onKeyDown(event) {
    if (state.mode !== 'assembly') return;
    if (event.target && /^(INPUT|TEXTAREA|SELECT)$/i.test(event.target.tagName)) return;
    if (event.key === 'Escape') {
      if (snapSource) {
        clearSnapSource();
        event.preventDefault();
        return;
      }
      if (state.snapMode) {
        setSnapMode(false);
        event.preventDefault();
      }
      return;
    }
    if (event.key === 'c' || event.key === 'C') {
      setSnapMode(!state.snapMode);
      return;
    }
    if (!selected || state.snapMode) return;
    if (event.key === 'g' || event.key === 'G') transform.setMode('translate');
    if (event.key === 'r' || event.key === 'R') transform.setMode('rotate');
  }

  function setSelectedEuler(next) {
    if (!selected || selected.userData.isEnvelope) return false;
    if (!next || typeof next !== 'object') return false;
    const pose = readPoseFromMesh(selected);
    const rotationXDeg = Number.isFinite(Number(next.rotationXDeg))
      ? Number(next.rotationXDeg)
      : pose.rotationXDeg;
    const rotationYDeg = Number.isFinite(Number(next.rotationYDeg))
      ? Number(next.rotationYDeg)
      : pose.rotationYDeg;
    const rotationZDeg = Number.isFinite(Number(next.rotationZDeg))
      ? Number(next.rotationZDeg)
      : pose.rotationZDeg;
    selected.rotation.set(
      THREE.MathUtils.degToRad(rotationXDeg),
      THREE.MathUtils.degToRad(rotationZDeg),
      THREE.MathUtils.degToRad(rotationYDeg),
    );
    clampMeshAboveGround(selected);
    emitPartsChange();
    emitSelectionChange(selected);
    return true;
  }

  function tick() {
    if (disposed) return;
    frame = requestAnimationFrame(tick);
    orbit.update();
    renderer.render(scene, camera);
  }

  const ro = typeof ResizeObserver === 'function'
    ? new ResizeObserver(() => resize())
    : null;
  ro?.observe(host);
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('keydown', onKeyDown);
  resize();
  rebuild();
  tick();

  return {
    setState(next) {
      if (!next || typeof next !== 'object') return;
      if ('isRender' in next) state.isRender = next.isRender !== false;
      if ('mode' in next) {
        state.mode = next.mode === 'assembly' ? 'assembly' : 'envelope';
        if (state.mode !== 'assembly' && state.snapMode) {
          state.snapMode = false;
          clearSnapSource();
          emitSnapModeChange();
        }
      }
      if ('envelope' in next) state.envelope = next.envelope;
      if ('parts' in next) state.parts = Array.isArray(next.parts) ? next.parts.map((p) => ({ ...p })) : [];
      if ('message' in next) state.message = next.message;
      if ('onPartsChange' in next) {
        state.onPartsChange = typeof next.onPartsChange === 'function' ? next.onPartsChange : null;
      }
      if ('onSelectionChange' in next) {
        state.onSelectionChange = typeof next.onSelectionChange === 'function'
          ? next.onSelectionChange
          : null;
      }
      if ('onSnapModeChange' in next) {
        state.onSnapModeChange = typeof next.onSnapModeChange === 'function'
          ? next.onSnapModeChange
          : null;
      }
      if ('onSnapSessionChange' in next) {
        state.onSnapSessionChange = typeof next.onSnapSessionChange === 'function'
          ? next.onSnapSessionChange
          : null;
      }
      rebuild();
      if (state.snapMode) setCornerMarkersVisible(true);
    },
    getParts,
    setSelectedEuler,
    setSnapMode,
    getSnapMode: () => Boolean(state.snapMode),
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      ro?.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      clearContent();
      cornerMarkerGeo.dispose();
      transform.dispose();
      orbit.dispose();
      renderer.dispose();
      host.replaceChildren();
    },
  };
}

export function envelopeFromForm({
  widthCm,
  depthCm,
  heightCm,
  sceneWidthCm,
  sceneDepthCm,
  sceneHeightCm,
  defaultColor,
}) {
  const width = Number(sceneWidthCm || widthCm);
  const depth = Number(sceneDepthCm || depthCm);
  const height = Number(sceneHeightCm || heightCm);
  if (![width, depth, height].every((n) => Number.isFinite(n) && n > 0)) return null;
  const colorNumber = Number(defaultColor);
  return {
    widthCm: width,
    depthCm: depth,
    heightCm: height,
    colorCss: Number.isInteger(colorNumber) ? colorIntToCss(colorNumber) : '#9ca3af',
  };
}

export function partFromChildRecord(child, instanceIndex, pose = {}) {
  const box = readItemBoxCm({
    dimensions: child?.dimensions,
    sceneDimensions: child?.sceneDimensions,
  });
  return {
    childItemKey: child.itemKey,
    instanceIndex,
    widthCm: box.widthCm,
    depthCm: box.depthCm,
    heightCm: box.heightCm,
    colorCss: Number.isInteger(child?.defaultColor)
      ? colorIntToCss(child.defaultColor)
      : '#9ca3af',
    xCm: Number.isFinite(Number(pose.xCm)) ? Number(pose.xCm) : 0,
    yCm: Number.isFinite(Number(pose.yCm)) ? Number(pose.yCm) : 0,
    zCm: Number.isFinite(Number(pose.zCm)) ? Number(pose.zCm) : instanceIndex * box.heightCm,
    rotationXDeg: Number.isFinite(Number(pose.rotationXDeg)) ? Number(pose.rotationXDeg) : 0,
    rotationYDeg: Number.isFinite(Number(pose.rotationYDeg)) ? Number(pose.rotationYDeg) : 0,
    rotationZDeg: Number.isFinite(Number(pose.rotationZDeg)) ? Number(pose.rotationZDeg) : 0,
  };
}
