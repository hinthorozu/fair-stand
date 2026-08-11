import fs from 'node:fs';

function replaceOrFail(text, before, after, label) {
  if (!text.includes(before)) throw new Error(`Missing patch target: ${label}`);
  return text.replace(before, after);
}

// index.html — remove the separate floor color picker.
{
  const path = 'index.html';
  let text = fs.readFileSync(path, 'utf8');
  text = replaceOrFail(text,
`          <label id="floor-color-field" class="stand-size-field" for="floor-color">
            <span>Karolaj Rengi</span>
            <input id="floor-color" type="color" value="#e9edf1" />
          </label>

`, '', 'remove separate floor color picker');
  fs.writeFileSync(path, text);
}

// scene3d.js — floor becomes a selectable paint target; karolaj + hali accept color, parke does not.
{
  const path = 'src/scene3d.js';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOrFail(text,
`export function createStandScene(
  container,
  onSurfaceSelected,
  getAssetUrl = () => null,
  onModuleContextMenu = () => {},
) {`,
`export function createStandScene(
  container,
  onSurfaceSelected,
  getAssetUrl = () => null,
  onModuleContextMenu = () => {},
  onFloorSelected = () => {},
) {`, 'add floor selection callback');

  text = replaceOrFail(text,
`  let currentFloorType = 'karolaj';
  let currentFloorColor = '#e9edf1';`,
`  let currentFloorType = 'karolaj';
  const floorColors = {
    karolaj: '#e9edf1',
    hali: '#8b8f94',
  };
  let floorSelected = false;`, 'floor color state');

  text = replaceOrFail(text,
`    if (resolved === 'hali') {
      material.color.set(0x8b8f94);
      material.roughness = 1;
      material.metalness = 0;
    } else if (resolved === 'parke') {`,
`    if (resolved === 'hali') {
      material.color.set(floorColors.hali);
      material.roughness = 1;
      material.metalness = 0;
    } else if (resolved === 'parke') {`, 'hali uses editable color');

  text = replaceOrFail(text,
`    } else {
      material.color.set(currentFloorColor);
      material.roughness = 0.92;`,
`    } else {
      material.color.set(floorColors.karolaj);
      material.roughness = 0.92;`, 'karolaj uses editable color');

  text = replaceOrFail(text,
`  function setFloorColor(color) {
    const normalized = String(color ?? '').trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return currentFloorColor;
    currentFloorColor = normalized.toLowerCase();
    if (stageLayout) stageLayout.floorColor = currentFloorColor;
    if (currentFloorType === 'karolaj') {
      activeFloor.material.color.set(currentFloorColor);
      activeFloor.material.needsUpdate = true;
    }
    return currentFloorColor;
  }`,
`  function setFloorColor(color) {
    if (currentFloorType !== 'karolaj' && currentFloorType !== 'hali') return null;
    const normalized = String(color ?? '').trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return floorColors[currentFloorType];
    const resolved = normalized.toLowerCase();
    floorColors[currentFloorType] = resolved;
    if (stageLayout) stageLayout.floorColor = resolved;
    activeFloor.material.color.set(resolved);
    activeFloor.material.needsUpdate = true;
    return resolved;
  }`, 'allow karolaj and hali color');

  text = replaceOrFail(text,
`  function notifySelection() {
    onSurfaceSelected?.([...selectedSurfaces]);
  }

  function clearSelection({ notify = true, keepAnchor = false } = {}) {
    selectedSurfaces.forEach((mesh) => setSelectionVisual(mesh, false));
    selectedSurfaces.clear();
    if (!keepAnchor) selectionAnchorSurfaceId = null;
    if (notify) notifySelection();
  }

  function selectOnly(mesh) {
    clearSelection({ notify: false });`,
`  function notifySelection() {
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
    clearSelection({ notify: false });`, 'floor selection state');

  text = replaceOrFail(text,
`  function handleSurfaceSelectionAt(clientX, clientY, rectangleSelect) {
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
  }`,
`  function handleSurfaceSelectionAt(clientX, clientY, rectangleSelect) {
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
      return;
    }

    if (!rectangleSelect && activeFloor.visible) {
      const floorHit = raycaster.intersectObject(activeFloor, false)[0];
      if (floorHit) {
        clearSelection({ notify: false });
        floorSelected = true;
        notifyFloorSelection();
        return;
      }
    }

    if (!rectangleSelect) clearSelection();
  }`, 'select floor on click');

  text = replaceOrFail(text,
`    getSelectedSurface: () => [...selectedSurfaces][0] ?? null,
    getSelectedSurfaces: () => [...selectedSurfaces],`,
`    getSelectedSurface: () => [...selectedSurfaces][0] ?? null,
    getSelectedSurfaces: () => [...selectedSurfaces],
    isFloorSelected: () => floorSelected,
    getSelectedFloorType: () => (floorSelected ? currentFloorType : null),`, 'expose floor selection');

  fs.writeFileSync(path, text);
}

// main.js — route the existing active color button to the selected floor when appropriate.
{
  const path = 'src/main.js';
  let text = fs.readFileSync(path, 'utf8');

  text = replaceOrFail(text,
`const floorTypeSelect = document.querySelector('#floor-type');
const floorColorField = document.querySelector('#floor-color-field');
const floorColorInput = document.querySelector('#floor-color');`,
`const floorTypeSelect = document.querySelector('#floor-type');`, 'remove floor color DOM refs');

  text = replaceOrFail(text,
`  (context) => moduleContextMenu.open(context),
);`,
`  (context) => moduleContextMenu.open(context),
  ({ selected, floorType, paintable }) => {
    if (!selected) return;
    const label = floorType === 'karolaj' ? 'Karolaj' : (floorType === 'hali' ? 'Halı' : 'Parke');
    selectionInfo.textContent = paintable
      ? label + ' zemini seçili · mevcut Aktif renk ile boyanabilir.'
      : label + ' zemini seçili · bu zemin tipi boyanamaz.';
  },
);`, 'wire floor selection callback');

  text = replaceOrFail(text,
`  currentStand = { ...setup, floorType: floorTypeSelect.value, floorColor: floorColorInput.value };
  scene3d.setFloorType(floorTypeSelect.value);
  if (floorTypeSelect.value === 'karolaj') scene3d.setFloorColor(floorColorInput.value);`,
`  currentStand = { ...setup, floorType: floorTypeSelect.value };
  scene3d.setFloorType(floorTypeSelect.value);`, 'stage no separate floor color');

  text = replaceOrFail(text,
`function syncFloorColorVisibility() {
  floorColorField.hidden = floorTypeSelect.value !== 'karolaj';
}

syncFloorColorVisibility();

floorTypeSelect.addEventListener('change', () => {
  syncFloorColorVisibility();
  if (!currentStand) return;
  currentStand = { ...currentStand, floorType: floorTypeSelect.value };
  scene3d.setFloorType(floorTypeSelect.value);
  if (floorTypeSelect.value === 'karolaj') {
    scene3d.setFloorColor(floorColorInput.value);
    currentStand = { ...currentStand, floorColor: floorColorInput.value };
  }
});

floorColorInput.addEventListener('input', () => {
  if (floorTypeSelect.value !== 'karolaj') return;
  if (currentStand) currentStand = { ...currentStand, floorColor: floorColorInput.value };
  scene3d.setFloorColor(floorColorInput.value);
});`,
`floorTypeSelect.addEventListener('change', () => {
  if (!currentStand) return;
  currentStand = { ...currentStand, floorType: floorTypeSelect.value };
  scene3d.setFloorType(floorTypeSelect.value);
});`, 'remove separate floor color handlers');

  text = replaceOrFail(text,
`function applyActiveColorToSelection({ showMissingSelection = false } = {}) {
  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    if (showMissingSelection) {
      selectionInfo.textContent = 'Önce 3D sahnede boyamak istediğin panel, panel bloğu veya modülü seç.';
    }
    return false;
  }

  scene3d.applyColor(selected, colorInput.value);
  return true;
}`,
`function applyActiveColorToSelection({ showMissingSelection = false } = {}) {
  if (scene3d.isFloorSelected()) {
    const floorType = scene3d.getSelectedFloorType();
    if (floorType === 'parke') {
      selectionInfo.textContent = 'Parke zemini boyanamaz; hazır parke seçeneklerinden biri kullanılacak.';
      return false;
    }
    const applied = scene3d.setFloorColor(colorInput.value);
    if (applied) {
      const label = floorType === 'hali' ? 'Halı' : 'Karolaj';
      if (currentStand) currentStand = { ...currentStand, floorColor: applied };
      selectionInfo.textContent = label + ' zemini · renk ' + applied.toUpperCase() + ' uygulandı.';
      return true;
    }
  }

  const selected = scene3d.getSelectedSurfaces();
  if (!selected.length) {
    if (showMissingSelection) {
      selectionInfo.textContent = 'Önce 3D sahnede boyamak istediğin panel, panel bloğu, modül veya zemini seç.';
    }
    return false;
  }

  scene3d.applyColor(selected, colorInput.value);
  return true;
}`, 'route active color to floor');

  fs.writeFileSync(path, text);
}

console.log('Shared active color now paints selected karolaj/hali floor; parke remains non-paintable.');
