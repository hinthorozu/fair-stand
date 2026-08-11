import { MODULE_CATALOG } from './catalog.js';

const DRAGGABLE_MODULE_KEYS = [
  'PANEL_200',
  'PANEL_150',
  'PANEL_100',
  'PANEL_50',
  'SEPARATOR_100',
  'SEPARATOR_50',
  'SHOWCASE_3_100',
  'SHOWCASE_2_100',
];

function ensureStyles() {
  if (document.querySelector('#module-drag-sidebar-styles')) return;
  const style = document.createElement('style');
  style.id = 'module-drag-sidebar-styles';
  style.textContent = `
    .module-drag-catalog { display:flex; flex-direction:column; gap:8px; }
    .module-drag-hint { margin:0; color:#7a8494; font-size:10px; line-height:1.45; }
    .module-drag-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; }
    .module-drag-card { display:flex; min-width:0; min-height:116px; flex-direction:column; align-items:stretch; justify-content:space-between; gap:7px; padding:8px; border:1px solid #d9dee5; border-radius:10px; background:#f8fafc; color:#364152; cursor:grab; user-select:none; }
    .module-drag-card:hover { border-color:#f97316; background:#fff8f2; }
    .module-drag-card.is-disabled { opacity:.45; cursor:not-allowed; }
    .module-drag-card.is-dragging { opacity:.55; border-color:#f97316; box-shadow:0 0 0 2px rgba(249,115,22,.14); }
    .module-drag-card strong { overflow:hidden; font-size:10px; line-height:1.25; text-overflow:ellipsis; white-space:nowrap; }
    .module-drag-preview { display:flex; height:78px; align-items:center; justify-content:center; overflow:hidden; border-radius:7px; background:#fff; }
    .module-drag-panel { display:flex; height:68px; flex-direction:column; border:3px solid #8a929a; background:#f7f7f5; box-shadow:0 2px 5px rgba(15,23,42,.08); }
    .module-drag-panel span { flex:1; border-bottom:1px solid #c4c9ce; }
    .module-drag-panel span:last-child { border-bottom:0; }
    .module-drag-separator { height:68px; border:3px solid #747b82; background:repeating-linear-gradient(to bottom,#c79b63 0 2px,#eef2f6 2px 4px); box-shadow:0 2px 5px rgba(15,23,42,.08); }
    .module-drag-showcase { position:relative; height:68px; border:3px solid #8a929a; background:#f7f7f5; box-shadow:0 2px 5px rgba(15,23,42,.08); }
    .module-drag-showcase::before { content:''; position:absolute; left:3px; right:3px; top:21px; bottom:10px; border:1px solid #9fbfa5; background:rgba(205,232,209,.5); }
    .module-drag-showcase[data-eyes='3']::after { content:''; position:absolute; left:4px; right:4px; top:42px; height:1px; background:#9fbfa5; }
    .viewport-wrap.catalog-drag-active { outline:2px solid rgba(249,115,22,.2); outline-offset:-2px; }
  `;
  document.head.appendChild(style);
}

function previewWidthPx(widthCm) {
  const width = Number(widthCm);
  if (!Number.isFinite(width) || width <= 0) return 24;
  return Math.max(12, Math.round((width / 350) * 68));
}

function createPreview(module) {
  const preview = document.createElement('div');
  preview.className = 'module-drag-preview';

  if (module.type === 'separator') {
    const body = document.createElement('div');
    body.className = 'module-drag-separator';
    body.style.width = `${previewWidthPx(module.widthCm)}px`;
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'showcase-2' || module.type === 'showcase-3') {
    const body = document.createElement('div');
    body.className = 'module-drag-showcase';
    body.dataset.eyes = module.type === 'showcase-3' ? '3' : '2';
    body.style.width = `${previewWidthPx(module.widthCm)}px`;
    preview.appendChild(body);
    return preview;
  }

  const body = document.createElement('div');
  body.className = 'module-drag-panel';
  body.style.width = `${previewWidthPx(module.widthCm)}px`;
  for (let index = 0; index < 7; index += 1) body.appendChild(document.createElement('span'));
  preview.appendChild(body);
  return preview;
}

export function createModuleDragSidebar({
  anchorButton,
  viewport,
  canDrag = () => false,
  createModuleState,
  onPreview,
  onDrop,
  onCancel,
} = {}) {
  if (!anchorButton?.parentElement || !viewport) return null;
  ensureStyles();

  const root = document.createElement('div');
  root.className = 'module-drag-catalog';

  const hint = document.createElement('p');
  hint.className = 'module-drag-hint';
  hint.textContent = 'Kartı sahneye sürükle · R: 0° / 90° yön değiştir · 50 cm grid';

  const grid = document.createElement('div');
  grid.className = 'module-drag-grid';
  root.append(hint, grid);
  anchorButton.parentElement.insertBefore(root, anchorButton);

  let enabled = false;
  let activeCard = null;
  let activeModuleState = null;
  let activeRotationZDeg = 0;
  let rotationLocked = false;
  let lastClientX = null;
  let lastClientY = null;

  function resetDragState() {
    activeCard?.classList.remove('is-dragging');
    viewport.closest('.viewport-wrap')?.classList.remove('catalog-drag-active');
    activeCard = null;
    activeModuleState = null;
    activeRotationZDeg = 0;
    rotationLocked = false;
    lastClientX = null;
    lastClientY = null;
  }

  const cards = DRAGGABLE_MODULE_KEYS
    .map((moduleKey) => ({ moduleKey, module: MODULE_CATALOG[moduleKey] }))
    .filter((entry) => entry.module)
    .map(({ moduleKey, module }) => {
      const card = document.createElement('div');
      card.className = 'module-drag-card is-disabled';
      card.dataset.moduleKey = moduleKey;
      card.draggable = false;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-disabled', 'true');
      card.title = `${module.label} · sahneye sürükle`;

      const label = document.createElement('strong');
      label.textContent = module.label;
      card.append(createPreview(module), label);

      card.addEventListener('dragstart', (event) => {
        if (!enabled || !canDrag()) {
          event.preventDefault();
          return;
        }

        const state = createModuleState?.(module);
        if (!state) {
          event.preventDefault();
          return;
        }

        activeCard = card;
        activeModuleState = state;
        activeRotationZDeg = 0;
        rotationLocked = false;
        card.classList.add('is-dragging');
        viewport.closest('.viewport-wrap')?.classList.add('catalog-drag-active');
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', moduleKey);
      });

      card.addEventListener('dragend', () => {
        resetDragState();
        onCancel?.();
      });

      grid.appendChild(card);
      return card;
    });

  viewport.addEventListener('dragover', (event) => {
    if (!activeModuleState) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    lastClientX = event.clientX;
    lastClientY = event.clientY;
    onPreview?.(
      activeModuleState,
      event.clientX,
      event.clientY,
      activeRotationZDeg,
      rotationLocked,
    );
  });

  viewport.addEventListener('drop', (event) => {
    if (!activeModuleState) return;
    event.preventDefault();
    const state = activeModuleState;
    const rotationZDeg = activeRotationZDeg;
    const isRotationLocked = rotationLocked;
    resetDragState();
    onDrop?.(state, event.clientX, event.clientY, rotationZDeg, isRotationLocked);
  });

  viewport.addEventListener('dragleave', (event) => {
    if (!activeModuleState) return;
    if (event.relatedTarget && viewport.contains(event.relatedTarget)) return;
    onCancel?.();
  });

  window.addEventListener('keydown', (event) => {
    if (!activeModuleState || String(event.key).toLowerCase() !== 'r') return;
    event.preventDefault();
    activeRotationZDeg = activeRotationZDeg === 90 ? 0 : 90;
    rotationLocked = true;
    if (Number.isFinite(lastClientX) && Number.isFinite(lastClientY)) {
      onPreview?.(
        activeModuleState,
        lastClientX,
        lastClientY,
        activeRotationZDeg,
        rotationLocked,
      );
    }
  });

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);
    cards.forEach((card) => {
      card.draggable = enabled;
      card.classList.toggle('is-disabled', !enabled);
      card.setAttribute('aria-disabled', String(!enabled));
    });
  }

  return { setEnabled };
}
