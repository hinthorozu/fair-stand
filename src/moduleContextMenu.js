import { MODULE_CATALOG } from './catalog.js';

const MODULE_LABELS = {
  'flat-panel': 'Düz Panel',
  'showcase-2': '2 Gözlü Vitrin',
  'showcase-3': '3 Gözlü Vitrin',
  separator: 'Separatör',
  door: 'Depo Kapısı',
  counter: 'Banko',
};

const PICKER_MODULE_KEYS = [
  'PANEL_200',
  'PANEL_150',
  'PANEL_100',
  'PANEL_50',
  'SEPARATOR_100',
  'SEPARATOR_50',
  'DOOR_100',
  'SHOWCASE_3_100',
  'SHOWCASE_2_100',
];

// Kullanıcı komutları kameraya göre değil, modülün ön yüzündeki görsel
// sol/sağa göre verilir. Sürekli duvar zincirinde sağ yan duvarın ilerleme
// yönü görsel sol/sağın tersidir. Sol yan duvarın zincir terslemesi main.js
// tarafındaki mevcut normalizasyonda bir kez uygulanır; burada tekrar edilmez.
export function resolveModuleSidePlacement(context, visualSide) {
  if (visualSide !== 'left' && visualSide !== 'right') return visualSide;
  const wallId = context?.placement?.wallId ?? 'back';
  if (wallId !== 'right') return visualSide;
  return visualSide === 'left' ? 'right' : 'left';
}

export function createModuleContextMenu({
  onDelete,
  onDuplicate,
  onAdd,
  onValidateAddBatch,
  onGlassModeChange,
}) {
  let activeContext = null;
  let pickerRequest = null;
  let selectedModuleKeys = [];
  let draggedSelectionIndex = null;
  let suppressChipClick = false;

  const menu = document.createElement('div');
  menu.className = 'module-context-menu';
  menu.hidden = true;
  menu.innerHTML = `
    <div class="module-context-title"></div>
    <button type="button" data-module-action="delete" class="danger">Sil</button>
    <button type="button" data-module-action="duplicate-right">Çoğalt Sağ Tarafa</button>
    <button type="button" data-module-action="duplicate-left">Çoğalt Sol Tarafa</button>
    <div class="module-context-separator"></div>
    <button type="button" data-module-action="toggle-glass" hidden>Cam panele çevir</button>
    <button type="button" data-module-action="add-right">Ekle Sağ Tarafa…</button>
    <button type="button" data-module-action="add-left">Ekle Sol Tarafa…</button>
  `;
  document.body.appendChild(menu);

  const pickerBackdrop = document.createElement('div');
  pickerBackdrop.className = 'module-picker-backdrop';
  pickerBackdrop.hidden = true;
  pickerBackdrop.innerHTML = `
    <div class="module-picker" role="dialog" aria-modal="true" aria-labelledby="module-picker-title">
      <div class="module-picker-header">
        <div>
          <p class="module-picker-eyebrow">MODÜL KATALOĞU</p>
          <h3 id="module-picker-title">Modül Ekle</h3>
          <p class="module-picker-context"></p>
        </div>
        <button type="button" class="module-picker-close" aria-label="Kapat">×</button>
      </div>
      <div class="module-catalog-grid" role="listbox" aria-label="Modül kataloğu"></div>
      <div class="module-picker-selection" style="margin-top:12px;padding:10px 12px;border:1px solid #e2e7ed;border-radius:12px;background:#f8fafc;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <strong style="font-size:12px;color:#374151;">Seçim sırası</strong>
          <button type="button" class="module-picker-selection-clear" style="min-width:0;padding:5px 8px;border:0;background:transparent;color:#667085;font-size:11px;">Temizle</button>
        </div>
        <p class="module-picker-selection-empty" style="margin:6px 0 0;color:#8a94a3;font-size:11px;">Kartlara tıklayarak modülleri sıraya ekle.</p>
        <div class="module-picker-selection-list" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:7px;"></div>
      </div>
      <div class="module-picker-footer">
        <button type="button" class="module-picker-cancel ghost">Vazgeç</button>
        <button type="button" class="module-picker-add primary" disabled>Ekle</button>
      </div>
    </div>
  `;
  document.body.appendChild(pickerBackdrop);

  const title = menu.querySelector('.module-context-title');
  const glassModeButton = menu.querySelector('[data-module-action="toggle-glass"]');
  const pickerTitle = pickerBackdrop.querySelector('#module-picker-title');
  const pickerContext = pickerBackdrop.querySelector('.module-picker-context');
  const pickerGrid = pickerBackdrop.querySelector('.module-catalog-grid');
  const pickerAddButton = pickerBackdrop.querySelector('.module-picker-add');
  const pickerSelectionList = pickerBackdrop.querySelector('.module-picker-selection-list');
  const pickerSelectionEmpty = pickerBackdrop.querySelector('.module-picker-selection-empty');
  const pickerSelectionClear = pickerBackdrop.querySelector('.module-picker-selection-clear');

  function describeModule(context) {
    const label = MODULE_LABELS[context?.type] ?? 'Modül';
    const width = Number.isFinite(context?.widthCm) ? ` · ${context.widthCm} cm` : '';
    return `${label}${width}`;
  }

  function createPanelPreview(widthCm) {
    const preview = document.createElement('div');
    preview.className = 'module-card-preview';

    const panel = document.createElement('div');
    panel.className = 'module-card-flat-panel';
    panel.style.width = `${Math.max(30, Math.round((widthCm / 200) * 118))}px`;

    for (let index = 0; index < 7; index += 1) {
      const strip = document.createElement('span');
      strip.className = 'module-card-strip';
      panel.appendChild(strip);
    }

    preview.appendChild(panel);
    return preview;
  }

  function createSeparatorPreview(widthCm) {
    const preview = document.createElement('div');
    preview.className = 'module-card-preview';

    const frame = document.createElement('div');
    frame.style.display = 'flex';
    frame.style.width = `${Math.max(30, Math.round((widthCm / 200) * 118))}px`;
    frame.style.height = '132px';
    frame.style.flexDirection = 'column';
    frame.style.justifyContent = 'space-between';
    frame.style.padding = '3px 2px';
    frame.style.border = '5px solid #6f767d';
    frame.style.background = '#eef2f6';
    frame.style.boxShadow = '5px 7px 12px rgba(15, 23, 42, 0.12)';

    for (let index = 0; index < 36; index += 1) {
      const slat = document.createElement('span');
      slat.style.display = 'block';
      slat.style.width = '100%';
      slat.style.height = '2px';
      slat.style.flex = '0 0 2px';
      slat.style.background = '#c79b63';
      frame.appendChild(slat);
    }

    preview.appendChild(frame);
    return preview;
  }

  function createShowcasePreview(module) {
    const preview = document.createElement('div');
    preview.className = 'module-card-preview';

    const frame = document.createElement('div');
    frame.className = 'module-card-flat-panel';
    frame.style.width = `${Math.round((100 / 200) * 118)}px`;

    const shelfCount = module.type === 'showcase-3' ? 2 : 1;
    const openingSlotCount = module.type === 'showcase-3' ? 3 : 2;
    const bottomPanelCount = module.type === 'showcase-3' ? 1 : 2;

    const createPanelSlot = () => {
      const strip = document.createElement('span');
      strip.className = 'module-card-strip';
      strip.style.flex = '1 1 0';
      return strip;
    };

    for (let index = 0; index < 3; index += 1) {
      frame.appendChild(createPanelSlot());
    }

    const opening = document.createElement('div');
    opening.style.position = 'relative';
    opening.style.flex = `${openingSlotCount} ${openingSlotCount} 0`;
    opening.style.minHeight = '0';
    opening.style.borderTop = '2px solid #747b82';
    opening.style.borderBottom = '2px solid #747b82';
    opening.style.background = '#eef1f3';

    for (let index = 1; index <= shelfCount; index += 1) {
      const shelf = document.createElement('span');
      shelf.style.position = 'absolute';
      shelf.style.left = '0';
      shelf.style.right = '0';
      shelf.style.top = `${(index / (shelfCount + 1)) * 100}%`;
      shelf.style.height = '3px';
      shelf.style.transform = 'translateY(-1.5px)';
      shelf.style.background = 'rgba(151, 190, 153, 0.9)';
      opening.appendChild(shelf);
    }

    frame.appendChild(opening);

    for (let index = 0; index < bottomPanelCount; index += 1) {
      const strip = createPanelSlot();
      if (index === bottomPanelCount - 1) strip.style.borderBottom = '0';
      frame.appendChild(strip);
    }

    preview.appendChild(frame);
    return preview;
  }

  function createDoorPreview(widthCm) {
    const preview = document.createElement('div');
    preview.className = 'module-card-preview';

    const frame = document.createElement('div');
    frame.className = 'module-card-flat-panel';
    frame.style.position = 'relative';
    frame.style.width = `${Math.max(30, Math.round((widthCm / 200) * 118))}px`;

    for (let index = 0; index < 3; index += 1) {
      const strip = document.createElement('span');
      strip.className = 'module-card-strip';
      strip.style.flex = '1 1 0';
      frame.appendChild(strip);
    }

    const door = document.createElement('div');
    door.style.position = 'relative';
    door.style.flex = '4 4 0';
    door.style.minHeight = '0';
    door.style.borderTop = '3px solid #747b82';
    door.style.background = '#e5e7eb';

    const handle = document.createElement('span');
    handle.style.position = 'absolute';
    handle.style.right = '6px';
    handle.style.top = '50%';
    handle.style.width = '4px';
    handle.style.height = '4px';
    handle.style.borderRadius = '50%';
    handle.style.background = '#4b5563';
    door.appendChild(handle);
    frame.appendChild(door);

    preview.appendChild(frame);
    return preview;
  }

  function createModulePreview(module) {
    if (module.type === 'separator') return createSeparatorPreview(module.widthCm);
    if (module.type === 'door') return createDoorPreview(module.widthCm);
    if (module.type === 'showcase-2' || module.type === 'showcase-3') {
      return createShowcasePreview(module);
    }
    return createPanelPreview(module.widthCm);
  }

  function getSelectionCounts() {
    const counts = new Map();
    selectedModuleKeys.forEach((moduleKey) => {
      counts.set(moduleKey, (counts.get(moduleKey) ?? 0) + 1);
    });
    return counts;
  }

  function reorderSelection(fromIndex, toIndex) {
    if (
      !Number.isInteger(fromIndex)
      || !Number.isInteger(toIndex)
      || fromIndex < 0
      || toIndex < 0
      || fromIndex >= selectedModuleKeys.length
      || toIndex >= selectedModuleKeys.length
      || fromIndex === toIndex
    ) {
      return;
    }

    const [movedModuleKey] = selectedModuleKeys.splice(fromIndex, 1);
    selectedModuleKeys.splice(toIndex, 0, movedModuleKey);
    syncPickerSelection();
  }

  function renderSelectionQueue() {
    pickerSelectionList.innerHTML = '';
    pickerSelectionEmpty.hidden = selectedModuleKeys.length > 0;
    pickerSelectionClear.disabled = selectedModuleKeys.length === 0;

    selectedModuleKeys.forEach((moduleKey, index) => {
      const module = MODULE_CATALOG[moduleKey];
      if (!module) return;

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.draggable = true;
      chip.dataset.selectionIndex = String(index);
      chip.title = 'Sürükleyerek sırala · tıklayarak çıkar';
      chip.textContent = `${index + 1}. ${module.label} ×`;
      chip.style.minWidth = '0';
      chip.style.maxWidth = '210px';
      chip.style.overflow = 'hidden';
      chip.style.padding = '6px 8px';
      chip.style.border = '1px solid #d7dee7';
      chip.style.borderRadius = '8px';
      chip.style.background = '#ffffff';
      chip.style.color = '#374151';
      chip.style.fontSize = '11px';
      chip.style.textOverflow = 'ellipsis';
      chip.style.whiteSpace = 'nowrap';
      chip.style.cursor = 'grab';
      chip.style.userSelect = 'none';

      chip.addEventListener('dragstart', (event) => {
        draggedSelectionIndex = index;
        suppressChipClick = true;
        chip.style.opacity = '0.45';
        chip.style.cursor = 'grabbing';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(index));
      });

      chip.addEventListener('dragover', (event) => {
        if (draggedSelectionIndex === null) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        chip.style.borderColor = '#f97316';
        chip.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.16)';
      });

      chip.addEventListener('dragleave', () => {
        chip.style.borderColor = '#d7dee7';
        chip.style.boxShadow = 'none';
      });

      chip.addEventListener('drop', (event) => {
        event.preventDefault();
        const targetIndex = Number(chip.dataset.selectionIndex);
        const fromIndex = draggedSelectionIndex;
        draggedSelectionIndex = null;
        reorderSelection(fromIndex, targetIndex);
      });

      chip.addEventListener('dragend', () => {
        draggedSelectionIndex = null;
        chip.style.opacity = '1';
        chip.style.cursor = 'grab';
        chip.style.borderColor = '#d7dee7';
        chip.style.boxShadow = 'none';
        window.setTimeout(() => {
          suppressChipClick = false;
        }, 0);
      });

      chip.addEventListener('click', () => {
        if (suppressChipClick) return;
        selectedModuleKeys.splice(index, 1);
        syncPickerSelection();
      });
      pickerSelectionList.appendChild(chip);
    });
  }

  function syncPickerSelection() {
    const counts = getSelectionCounts();

    pickerGrid.querySelectorAll('[data-module-key]').forEach((card) => {
      const count = counts.get(card.dataset.moduleKey) ?? 0;
      card.classList.toggle('selected', count > 0);
      card.setAttribute('aria-selected', String(count > 0));

      const badge = card.querySelector('.module-catalog-card-count');
      if (badge) {
        badge.hidden = count === 0;
        badge.textContent = `×${count}`;
      }
    });

    pickerAddButton.disabled = selectedModuleKeys.length === 0;
    pickerAddButton.textContent = selectedModuleKeys.length
      ? `Ekle (${selectedModuleKeys.length})`
      : 'Ekle';
    renderSelectionQueue();
  }

  function addModuleToSelection(moduleKey) {
    if (!MODULE_CATALOG[moduleKey]) return;
    selectedModuleKeys.push(moduleKey);
    syncPickerSelection();
  }

  function submitPickerSelection() {
    if (!selectedModuleKeys.length || !pickerRequest) return;

    const entries = selectedModuleKeys
      .map((moduleKey) => ({ moduleKey, module: MODULE_CATALOG[moduleKey] }))
      .filter((entry) => entry.module);
    if (!entries.length) return;

    const request = { ...pickerRequest };
    const insertionEntries = request.placement === 'right'
      ? [...entries].reverse()
      : entries;

    const validation = onValidateAddBatch?.({
      ...request,
      entries: insertionEntries,
    });
    if (validation === false || validation?.ok === false) return;

    closePicker();
    insertionEntries.forEach((entry) => {
      onAdd?.({
        ...request,
        moduleKey: entry.moduleKey,
        module: entry.module,
      });
    });
  }

  function renderPickerCatalog() {
    pickerGrid.innerHTML = '';

    PICKER_MODULE_KEYS.forEach((moduleKey) => {
      const module = MODULE_CATALOG[moduleKey];
      if (!module) return;

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'module-catalog-card';
      card.dataset.moduleKey = moduleKey;
      card.setAttribute('role', 'option');
      card.setAttribute('aria-selected', 'false');

      const titleRow = document.createElement('span');
      titleRow.style.display = 'flex';
      titleRow.style.alignItems = 'center';
      titleRow.style.justifyContent = 'space-between';
      titleRow.style.gap = '8px';

      const cardTitle = document.createElement('strong');
      cardTitle.className = 'module-catalog-card-title';
      cardTitle.textContent = module.label;

      const countBadge = document.createElement('span');
      countBadge.className = 'module-catalog-card-count';
      countBadge.hidden = true;
      countBadge.style.flex = '0 0 auto';
      countBadge.style.padding = '2px 6px';
      countBadge.style.borderRadius = '999px';
      countBadge.style.background = '#f97316';
      countBadge.style.color = '#ffffff';
      countBadge.style.fontSize = '10px';
      countBadge.style.fontWeight = '800';

      titleRow.append(cardTitle, countBadge);
      card.append(titleRow, createModulePreview(module));
      card.addEventListener('click', () => addModuleToSelection(moduleKey));

      pickerGrid.appendChild(card);
    });
  }

  function close() {
    menu.hidden = true;
    activeContext = null;
  }

  function closePicker() {
    pickerBackdrop.hidden = true;
    pickerRequest = null;
    selectedModuleKeys = [];
    draggedSelectionIndex = null;
    suppressChipClick = false;
    syncPickerSelection();
  }

  function openPicker({
    placement = 'append',
    context = null,
    displayPlacement = placement,
  } = {}) {
    pickerRequest = { placement, context, displayPlacement };
    selectedModuleKeys = [];
    draggedSelectionIndex = null;
    suppressChipClick = false;

    if (displayPlacement === 'left') {
      pickerTitle.textContent = 'Sol Tarafa Modül Ekle';
    } else if (displayPlacement === 'right') {
      pickerTitle.textContent = 'Sağ Tarafa Modül Ekle';
    } else {
      pickerTitle.textContent = 'Modül Ekle';
    }

    pickerContext.textContent = context
      ? `Hedef: Modül ${context.moduleIndex + 1} · ${describeModule(context)}`
      : 'Seçilen modüller sırayla duvarın sonuna eklenecek.';

    menu.hidden = true;
    pickerBackdrop.hidden = false;
    syncPickerSelection();
  }

  function open(context) {
    if (!context) {
      close();
      return;
    }

    activeContext = context;
    const panelSuffix = context.supportsGlass && Number.isInteger(context.stripNumber)
      ? ` · Panel ${context.stripNumber}`
      : '';
    title.textContent = `Modül ${context.moduleIndex + 1} · ${describeModule(context)}${panelSuffix}`;
    glassModeButton.hidden = !context.supportsGlass;
    glassModeButton.textContent = context.isGlass
      ? 'Normal panele çevir'
      : 'Cam panele çevir';
    menu.hidden = false;

    const margin = 8;
    const width = menu.offsetWidth || 220;
    const height = menu.offsetHeight || 250;
    const left = Math.min(context.clientX, window.innerWidth - width - margin);
    const top = Math.min(context.clientY, window.innerHeight - height - margin);
    menu.style.left = `${Math.max(margin, left)}px`;
    menu.style.top = `${Math.max(margin, top)}px`;
  }

  menu.addEventListener('click', (event) => {
    const button = event.target.closest('[data-module-action]');
    if (!button || !activeContext) return;

    const action = button.dataset.moduleAction;
    const context = activeContext;

    if (action === 'delete') {
      close();
      onDelete?.(context);
      return;
    }

    if (action === 'duplicate-right' || action === 'duplicate-left') {
      const visualSide = action === 'duplicate-left' ? 'left' : 'right';
      const placementSide = resolveModuleSidePlacement(context, visualSide);
      close();
      onDuplicate?.(context, placementSide);
      return;
    }

    if (action === 'toggle-glass' && context.supportsGlass) {
      close();
      onGlassModeChange?.(context, !context.isGlass);
      return;
    }

    if (action === 'add-right') {
      openPicker({
        placement: resolveModuleSidePlacement(context, 'right'),
        displayPlacement: 'right',
        context,
      });
      return;
    }

    if (action === 'add-left') {
      openPicker({
        placement: resolveModuleSidePlacement(context, 'left'),
        displayPlacement: 'left',
        context,
      });
    }
  });

  pickerAddButton.addEventListener('click', submitPickerSelection);
  pickerSelectionClear.addEventListener('click', () => {
    selectedModuleKeys = [];
    syncPickerSelection();
  });

  pickerBackdrop.querySelector('.module-picker-close').addEventListener('click', closePicker);
  pickerBackdrop.querySelector('.module-picker-cancel').addEventListener('click', closePicker);
  pickerBackdrop.addEventListener('pointerdown', (event) => {
    if (event.target === pickerBackdrop) closePicker();
  });

  document.addEventListener('pointerdown', (event) => {
    if (!menu.hidden && !menu.contains(event.target)) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    close();
    closePicker();
  });

  window.addEventListener('blur', close);

  renderPickerCatalog();
  syncPickerSelection();

  return {
    open,
    close,
    openPicker,
    closePicker,
  };
}