import { getModuleCatalogLabel, MODULE_CATALOG, MODULE_CATALOG_KEYS } from './catalog.js';
import { createModuleCatalogPreview } from './moduleDragSidebar.js';


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
  onFabricModeChange,
  onFabricLightingChange,
  getShelfLightingState,
  onShelfLightingChange,
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
    <button type="button" data-module-action="toggle-fabric" hidden>Beze çevir</button>
    <button type="button" data-module-action="toggle-fabric-light" hidden>Lightbox aydınlatmayı aç</button>
    <button type="button" data-module-action="toggle-shelf-light" hidden>Raf altı aydınlatmayı aç</button>
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
  const fabricModeButton = menu.querySelector('[data-module-action="toggle-fabric"]');
  const fabricLightingButton = menu.querySelector('[data-module-action="toggle-fabric-light"]');
  const shelfLightingButton = menu.querySelector('[data-module-action="toggle-shelf-light"]');
  const pickerTitle = pickerBackdrop.querySelector('#module-picker-title');
  const pickerContext = pickerBackdrop.querySelector('.module-picker-context');
  const pickerGrid = pickerBackdrop.querySelector('.module-catalog-grid');
  const pickerAddButton = pickerBackdrop.querySelector('.module-picker-add');
  const pickerSelectionList = pickerBackdrop.querySelector('.module-picker-selection-list');
  const pickerSelectionEmpty = pickerBackdrop.querySelector('.module-picker-selection-empty');
  const pickerSelectionClear = pickerBackdrop.querySelector('.module-picker-selection-clear');

  function describeModule(context) {
    return getModuleCatalogLabel(context);
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

    MODULE_CATALOG_KEYS.forEach((moduleKey) => {
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
      card.append(titleRow, createModuleCatalogPreview(module));
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

    fabricModeButton.hidden = !context.supportsFabric;
    fabricModeButton.textContent = context.isFabric
      ? 'Bezden çıkar'
      : 'Beze çevir';

    fabricLightingButton.hidden = !context.isFabric;
    fabricLightingButton.textContent = context.fabricLightingOn
      ? 'Lightbox aydınlatmayı kapat'
      : 'Lightbox aydınlatmayı aç';

    const isShelf = (context.moduleType ?? context.type) === 'shelf';
    const shelfLightingOn = isShelf ? Boolean(getShelfLightingState?.(context)) : false;
    shelfLightingButton.hidden = !isShelf;
    shelfLightingButton.textContent = shelfLightingOn
      ? 'Raf altı aydınlatmayı kapat'
      : 'Raf altı aydınlatmayı aç';
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

    if (action === 'toggle-fabric' && context.supportsFabric) {
      close();
      onFabricModeChange?.(context, !context.isFabric);
      return;
    }

    if (action === 'toggle-fabric-light' && context.isFabric) {
      close();
      onFabricLightingChange?.(context, !context.fabricLightingOn);
      return;
    }

    if (action === 'toggle-shelf-light' && (context.moduleType ?? context.type) === 'shelf') {
      const nextState = !Boolean(getShelfLightingState?.(context));
      close();
      onShelfLightingChange?.(context, nextState);
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
