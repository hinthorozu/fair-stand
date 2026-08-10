import './style.css';
import { createStandScene } from './scene3d.js';
import { composeStraightWall } from './wall.js';

const viewport = document.querySelector('#viewport');
const wallLengthInput = document.querySelector('#wall-length');
const buildWallButton = document.querySelector('#build-wall');
const clearWallButton = document.querySelector('#clear-wall');
const wallResult = document.querySelector('#wall-result');
const selectionInfo = document.querySelector('#selection-info');
const colorInput = document.querySelector('#surface-color');
const applyColorButton = document.querySelector('#apply-color');
const imageInput = document.querySelector('#surface-image');
const clearTextureButton = document.querySelector('#clear-texture');

let currentModules = [];

const scene3d = createStandScene(viewport, (surface) => {
  if (!surface) {
    selectionInfo.textContent = '3D sahnede bir yatay panele tıkla.';
    return;
  }

  const { moduleIndex, widthCm, stripNumber } = surface.userData;
  selectionInfo.textContent = `Modül ${moduleIndex + 1} · ${widthCm} cm · alttan ${stripNumber}. panel`;
  colorInput.value = `#${surface.material.color.getHexString()}`;
});

function renderWallResult(message, isError = false) {
  wallResult.textContent = message;
  wallResult.classList.toggle('error', isError);
}

function rebuildWall() {
  scene3d.buildWall(currentModules);
  const total = currentModules.reduce((sum, width) => sum + width, 0);
  renderWallResult(
    currentModules.length
      ? `${total} cm = ${currentModules.join(' + ')} · ${currentModules.length} modül`
      : 'Duvar boş.',
  );
}

function buildAutomaticWall() {
  const lengthCm = Number(wallLengthInput.value);
  const result = composeStraightWall(lengthCm);

  if (!result.ok) {
    renderWallResult(result.message, true);
    return;
  }

  currentModules = result.modules;
  rebuildWall();
}

buildWallButton.addEventListener('click', buildAutomaticWall);
wallLengthInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') buildAutomaticWall();
});

document.querySelectorAll('[data-add-module]').forEach((button) => {
  button.addEventListener('click', () => {
    currentModules.push(Number(button.dataset.addModule));
    rebuildWall();
  });
});

clearWallButton.addEventListener('click', () => {
  currentModules = [];
  scene3d.clearWall();
  renderWallResult('Duvar boş.');
});

applyColorButton.addEventListener('click', () => {
  const selected = scene3d.getSelectedSurface();
  if (!selected) {
    selectionInfo.textContent = 'Önce 3D sahnede boyamak istediğin paneli seç.';
    return;
  }
  scene3d.applyColor(selected, colorInput.value);
});

colorInput.addEventListener('input', () => {
  const selected = scene3d.getSelectedSurface();
  if (selected) scene3d.applyColor(selected, colorInput.value);
});

imageInput.addEventListener('change', () => {
  const selected = scene3d.getSelectedSurface();
  const file = imageInput.files?.[0];

  if (!selected) {
    selectionInfo.textContent = 'Görsel uygulamak için önce bir panel seç.';
    imageInput.value = '';
    return;
  }

  if (file) scene3d.applyImage(selected, file);
  imageInput.value = '';
});

clearTextureButton.addEventListener('click', () => {
  const selected = scene3d.getSelectedSurface();
  if (!selected) {
    selectionInfo.textContent = 'Önce bir panel seç.';
    return;
  }
  scene3d.clearImage(selected);
});

// Konuştuğumuz ilk demo: 350 cm => 200 + 150.
buildAutomaticWall();
