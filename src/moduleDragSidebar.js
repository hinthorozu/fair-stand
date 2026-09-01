import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from './catalog.js';
import { ALUMINUM_PROFILE_COLOR } from './theme.js';
import { getModuleDefaultRotationDeg, getModuleRotationStepDeg } from './moduleBehavior.js';


function ensureStyles() {
  if (document.querySelector('#module-drag-sidebar-styles')) return;
  const style = document.createElement('style');
  style.id = 'module-drag-sidebar-styles';
  style.textContent = `
    .module-drag-catalog { display:flex; flex-direction:column; gap:8px; }
    .module-drag-hint { margin:0; color:#7a8494; font-size:10px; line-height:1.45; }
    .module-drag-groups { display:flex; flex-direction:column; gap:7px; }
    .module-drag-group { overflow:hidden; border:1px solid #d9dee5; border-radius:10px; background:#fff; }
    .module-drag-group > summary { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:9px 10px; color:#364152; font-size:11px; font-weight:700; cursor:pointer; user-select:none; list-style:none; }
    .module-drag-group > summary::-webkit-details-marker { display:none; }
    .module-drag-group > summary::after { content:'▸'; color:#7a8494; font-size:12px; transition:transform .15s ease; }
    .module-drag-group[open] > summary::after { transform:rotate(90deg); }
    .module-drag-group[open] > summary { border-bottom:1px solid #e6eaf0; }
    .module-drag-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; padding:7px; }
    .module-drag-card { display:flex; min-width:0; min-height:116px; flex-direction:column; align-items:stretch; justify-content:space-between; gap:7px; padding:8px; border:1px solid #d9dee5; border-radius:10px; background:#f8fafc; color:#364152; cursor:grab; user-select:none; }
    .module-drag-card:hover { border-color:#f97316; background:#fff8f2; }
    .module-drag-card.is-disabled { opacity:.45; cursor:not-allowed; }
    .module-drag-card.is-dragging { opacity:.55; border-color:#f97316; box-shadow:0 0 0 2px rgba(249,115,22,.14); }
    .module-drag-card strong { overflow:hidden; font-size:10px; line-height:1.25; text-overflow:ellipsis; white-space:nowrap; }
    .module-drag-preview { display:flex; height:78px; align-items:center; justify-content:center; overflow:hidden; border-radius:7px; background:#fff; }
    .module-drag-panel { display:flex; height:68px; flex-direction:column; border:3px solid ${ALUMINUM_PROFILE_COLOR}; background:#f7f7f5; box-shadow:0 2px 5px rgba(15,23,42,.08); }
    .module-drag-panel span { flex:1; border-bottom:1px solid #c4c9ce; }
    .module-drag-panel span:last-child { border-bottom:0; }
    .module-drag-separator { height:68px; border:3px solid ${ALUMINUM_PROFILE_COLOR}; background:repeating-linear-gradient(to bottom,#c79b63 0 2px,#eef2f6 2px 4px); box-shadow:0 2px 5px rgba(15,23,42,.08); }
    .module-drag-showcase { position:relative; height:68px; border:3px solid ${ALUMINUM_PROFILE_COLOR}; background:#f7f7f5; box-shadow:0 2px 5px rgba(15,23,42,.08); }
    .module-drag-showcase::before { content:''; position:absolute; left:3px; right:3px; top:21px; bottom:10px; border:1px solid #9fbfa5; background:rgba(205,232,209,.5); }
    .module-drag-showcase[data-eyes='3']::after { content:''; position:absolute; left:4px; right:4px; top:42px; height:1px; background:#9fbfa5; }
    .module-drag-shelf { position:relative; }
    .module-drag-shelf i { position:absolute; left:-3px; right:-9px; height:4px; border:1px solid ${ALUMINUM_PROFILE_COLOR}; background:#fff; box-shadow:2px 2px 2px rgba(15,23,42,.14); pointer-events:none; }
    .module-drag-door { position:relative; height:68px; border:3px solid ${ALUMINUM_PROFILE_COLOR}; background:linear-gradient(to bottom,#f7f7f5 0 13%,#c4c9ce 13% 14%,#f7f7f5 14% 27%,#c4c9ce 27% 28%,#f7f7f5 28% 42%,${ALUMINUM_PROFILE_COLOR} 42% 45%,#e5e7eb 45% 100%); box-shadow:0 2px 5px rgba(15,23,42,.08); }
    .module-drag-door::after { content:''; position:absolute; right:3px; bottom:19px; width:3px; height:3px; border-radius:50%; background:#4b5563; }
    .module-drag-sofa { position:relative; width:58px; height:58px; }
    .module-drag-sofa::before { content:''; position:absolute; left:6px; top:4px; width:46px; height:18px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:5px; background:#f8fafc; box-shadow:0 2px 4px rgba(15,23,42,.08); }
    .module-drag-sofa::after { content:''; position:absolute; left:7px; bottom:4px; width:18px; height:25px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:5px; background:#f8fafc; box-shadow:28px 0 0 -2px #f8fafc,28px 0 0 0 ${ALUMINUM_PROFILE_COLOR}; }
    .module-drag-table-chair { position:relative; width:58px; height:58px; }
    .module-drag-table-chair::before { content:''; position:absolute; left:19px; top:19px; width:20px; height:20px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:50%; background:#fff; }
    .module-drag-table-chair::after { content:''; position:absolute; left:4px; top:4px; width:13px; height:13px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:4px; background:#f8fafc; box-shadow:37px 0 0 -2px #f8fafc,37px 0 0 0 ${ALUMINUM_PROFILE_COLOR},0 37px 0 -2px #f8fafc,0 37px 0 0 ${ALUMINUM_PROFILE_COLOR},37px 37px 0 -2px #f8fafc,37px 37px 0 0 ${ALUMINUM_PROFILE_COLOR}; }
    .module-drag-bar-stool { position:relative; width:44px; height:58px; }
    .module-drag-bar-stool::before { content:''; position:absolute; left:8px; top:4px; width:28px; height:20px; border:2px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:10px 10px 5px 5px; background:#f8fafc; }
    .module-drag-bar-stool::after { content:''; position:absolute; left:11px; top:24px; width:22px; height:27px; border-left:3px solid ${ALUMINUM_PROFILE_COLOR}; border-right:3px solid ${ALUMINUM_PROFILE_COLOR}; border-bottom:3px solid ${ALUMINUM_PROFILE_COLOR}; border-radius:0 0 10px 10px; }
    .module-drag-mini-fridge { position:relative; width:38px; height:58px; border:3px solid #6b7280; border-radius:5px; background:#e7e5df; box-shadow:3px 3px 0 #cbd5e1; box-sizing:border-box; }
    .module-drag-mini-fridge::before { content:''; position:absolute; left:2px; right:2px; top:18px; height:2px; background:#8b8f94; }
    .module-drag-mini-fridge::after { content:''; position:absolute; right:4px; top:7px; width:2px; height:8px; border-radius:2px; background:#555b61; box-shadow:0 21px 0 #555b61; }
    .module-drag-tv { position:relative; width:66px; height:54px; }
    .module-drag-tv::before { content:''; position:absolute; left:4px; top:3px; width:58px; height:36px; box-sizing:border-box; border:4px solid #26292d; border-radius:2px; background:#f8fafc; box-shadow:0 2px 5px rgba(15,23,42,.12); }
    .module-drag-tv::after { content:''; position:absolute; left:22px; top:39px; width:22px; height:5px; background:#30343a; box-shadow:0 7px 0 -1px #30343a; clip-path:polygon(27% 0,73% 0,86% 100%,100% 100%,100% 100%,0 100%,14% 100%); }
    .module-drag-floodlight { position:relative; width:52px; height:52px; }
    .module-drag-floodlight::before { content:''; position:absolute; left:10px; top:7px; width:32px; height:22px; border:4px solid #17191c; border-radius:3px; background:#f5fff2; box-shadow:inset 0 0 0 2px #c7ead0; transform:rotate(-8deg); }
    .module-drag-floodlight::after { content:''; position:absolute; left:23px; top:29px; width:6px; height:16px; border-left:3px solid #292c31; border-bottom:3px solid #292c31; }
    .module-drag-base { position:relative; height:24px; border:3px solid ${ALUMINUM_PROFILE_COLOR}; background:#ffffff; box-shadow:4px 4px 0 #d7dde4,0 2px 5px rgba(15,23,42,.08); }
    .module-drag-base::before { content:''; position:absolute; inset:3px; border:1px solid #cbd5e1; background:#f8fafc; }
    .module-drag-base::after { content:''; position:absolute; left:-5px; right:-5px; top:-7px; height:5px; border:1px solid ${ALUMINUM_PROFILE_COLOR}; background:#ffffff; }
    .module-drag-base-wall { position:relative; display:flex; height:68px; flex-direction:column; border:3px solid ${ALUMINUM_PROFILE_COLOR}; background:#f7f7f5; box-shadow:0 2px 5px rgba(15,23,42,.08); }
    .module-drag-base-wall span { flex:1; border-bottom:1px solid #c4c9ce; }
    .module-drag-base-wall span:last-of-type { border-bottom:0; }
    .module-drag-base-wall::after { content:''; position:absolute; left:-5px; right:-5px; bottom:-3px; height:13px; border:3px solid ${ALUMINUM_PROFILE_COLOR}; background:#f8fafc; box-shadow:3px 3px 0 #d7dde4; }
    .module-drag-counter { position:relative; height:34px; border:3px solid ${ALUMINUM_PROFILE_COLOR}; background:#f8fafc; box-shadow:5px 5px 0 #d7dde4,0 2px 5px rgba(15,23,42,.08); }
    .module-drag-counter::after { content:''; position:absolute; left:-3px; right:-3px; top:-6px; height:5px; border:1px solid ${ALUMINUM_PROFILE_COLOR}; background:#eef2f6; }
    .viewport-wrap.catalog-drag-active { outline:2px solid rgba(249,115,22,.2); outline-offset:-2px; }
  `;
  document.head.appendChild(style);
}

function previewWidthPx(widthCm) {
  const width = Number(widthCm);
  if (!Number.isFinite(width) || width <= 0) return 24;
  return Math.max(12, Math.round((width / 350) * 68));
}

export function createModuleCatalogPreview(module) {
  ensureStyles();
  const preview = document.createElement('div');
  preview.className = 'module-drag-preview';

  if (module.type === 'shelf') {
    const body = document.createElement('div');
    body.className = 'module-drag-panel module-drag-shelf';
    body.style.width = previewWidthPx(module.widthCm) + 'px';
    for (let index = 0; index < 7; index += 1) body.appendChild(document.createElement('span'));
    const tops = Number(module.shelfCount) === 3 ? [47, 37, 27] : [47, 37];
    tops.forEach((top) => {
      const shelf = document.createElement('i');
      shelf.style.top = top + 'px';
      body.appendChild(shelf);
    });
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'sofa-set-classic') {
    const body = document.createElement('div');
    body.className = 'module-drag-sofa';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'table-chair-set-eames') {
    const body = document.createElement('div');
    body.className = 'module-drag-table-chair';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'bar-stool') {
    const body = document.createElement('div');
    body.className = 'module-drag-bar-stool';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'mini-fridge') {
    const body = document.createElement('div');
    body.className = 'module-drag-mini-fridge';
    preview.appendChild(body);
    return preview;
  }


  if (module.type === 'tv') {
    const body = document.createElement('div');
    body.className = 'module-drag-tv';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'led-floodlight') {
    const body = document.createElement('div');
    body.className = 'module-drag-floodlight';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'base-wall') {
    const body = document.createElement('div');
    body.className = 'module-drag-base-wall';
    body.style.width = Math.max(34, previewWidthPx(module.widthCm)) + 'px';
    for (let index = 0; index < 7; index += 1) body.appendChild(document.createElement('span'));
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'base') {
    const body = document.createElement('div');
    body.className = 'module-drag-base';
    body.style.width = Math.max(34, previewWidthPx(module.widthCm)) + 'px';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'counter') {
    const body = document.createElement('div');
    body.className = 'module-drag-counter';
    body.style.width = Math.max(34, previewWidthPx(module.widthCm)) + 'px';
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'separator') {
    const body = document.createElement('div');
    body.className = 'module-drag-separator';
    body.style.width = `${previewWidthPx(module.widthCm)}px`;
    preview.appendChild(body);
    return preview;
  }

  if (module.type === 'door') {
    const body = document.createElement('div');
    body.className = 'module-drag-door';
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
  hint.textContent = 'Kartı sahneye sürükle · R/Shift+R: modül standardına göre döndür · grid modüle göre';

  const groupsRoot = document.createElement('div');
  groupsRoot.className = 'module-drag-groups';
  root.append(hint, groupsRoot);
  anchorButton.parentElement.insertBefore(root, anchorButton);

  const groupDefinitions = [
    {
      label: 'Panel & Duvar',
      keys: ['wall_200', 'wall_150', 'wall_100', 'wall_50', 'wall_separator_100', 'wall_separator_50', 'wall_base_200', 'wall_base_150', 'wall_base_100', 'DOOR_100'],
    },
    {
      label: 'Raf & Vitrin',
      keys: ['wall_showcase_100_3', 'wall_showcase_100_2', 'wall_shelf_3_200', 'wall_shelf_3_150', 'wall_shelf_3_100', 'wall_shelf_2_200', 'wall_shelf_2_150', 'wall_shelf_2_100'],
    },
    {
      label: 'Banko & Baza',
      keys: ['desk_banko_200', 'desk_banko_150', 'desk_banko_100', 'desk_banko_200_L', 'desk_banko_150_L', 'desk_banko_100_L', 'BASE_200', 'BASE_150', 'BASE_100'],
    },
    {
      label: 'Mobilya',
      keys: ['furniture_sofa_set_classic', 'furniture_table_chair_set_eames', 'furniture_bar_stool_classic'],
    },
    {
      label: 'Depo',
      keys: ['DEPOT_MINI_FRIDGE_AVANTI', 'DEPOT_KETTLE'],
    },
    {
      label: 'Elektronik & Aydınlatma',
      keys: ['TV_42', 'TV_55', 'TV_65', 'LED_FLOODLIGHT'],
    },
  ];

  const groupGridByKey = new Map();
  groupDefinitions.forEach((group, index) => {
    const details = document.createElement('details');
    details.className = 'module-drag-group';
    details.open = index === 0;

    const summary = document.createElement('summary');
    summary.textContent = group.label;

    const grid = document.createElement('div');
    grid.className = 'module-drag-grid';
    details.append(summary, grid);
    groupsRoot.appendChild(details);
    group.keys.forEach((moduleKey) => groupGridByKey.set(moduleKey, grid));
  });

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

  const cards = MODULE_CATALOG_KEYS
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
      card.append(createModuleCatalogPreview(module), label);

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
        activeRotationZDeg = getModuleDefaultRotationDeg(state);
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

      const targetGrid = groupGridByKey.get(moduleKey);
      if (!targetGrid) {
        throw new Error(`Module catalog group missing for ${moduleKey}`);
      }
      targetGrid.appendChild(card);
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
    const rotationStepDeg = getModuleRotationStepDeg(activeModuleState);
    const deltaDeg = event.shiftKey ? -rotationStepDeg : rotationStepDeg;
    activeRotationZDeg = ((activeRotationZDeg + deltaDeg) % 360 + 360) % 360;
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
