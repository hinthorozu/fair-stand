import { MODULE_CATALOG } from './catalog.js';

const MODULE_LABELS = {
  'flat-panel': 'Düz Panel',
  'showcase-2': '2 Gözlü Vitrin',
  'showcase-3': '3 Gözlü Vitrin',
  separator: 'Separatör',
  door: 'Depo Kapısı',
};

const PICKER_MODULE_KEYS = [
  'PANEL_200',
  'PANEL_150',
  'PANEL_100',
  'PANEL_50',
  'SEPARATOR_100',
  'SEPARATOR_50',
  'SHOWCASE_3_100',
  'SHOWCASE_2_100',
];

export function createModuleContextMenu({ onDelete, onDuplicate, onAdd }) {
  let activeContext = null;
  let pickerRequest = null;
  let selectedModuleKey = null;

  const menu = document.createElement('div');
  menu.className = 'module-context-menu';
  menu.hidden = true;
  menu.innerHTML = `
    <div class="module-context-title"></div>
    <button type="button" data-module-action="delete" class="danger">Sil</button>
    <button type="button" data-module-action="duplicate-right">Çoğalt Sağ Tarafa</button>
    <button type="button" data-module-action="duplicate-left">Çoğalt Sol Tarafa</button>
    <div class="module-context-separator"></div>
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
      <div class="module-picker-footer">
        <button type="button" class="module-picker-cancel ghost">Vazgeç</button>
        <button type="button" class="module-picker-add primary" disabled>Ekle</button>
      </div>
    </div>
  `;
  document.body.appendChild(pickerBackdrop);

  const title = menu.querySelector('.module-context-title');
  const pickerTitle = pickerBackdrop.querySelector('#module-picker-title');
  const pickerContext = pickerBackdrop.querySelector('.module-picker-context');
  const pickerGrid = pickerBackdrop.querySelector('.module-catalog-grid');
  const pickerAddButton = pickerBackdrop.querySelector('.module-picker-add');

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
    frame.style.position = 'relative';
    frame.style.width = '62px';
    frame.style.height = '132px';
    frame.style.border = '5px solid #6f767d';
    frame.style.background = '#565a5e';
    frame.style.boxShadow = '5px 7px 12px rgba(15, 23, 42, 0.12)';

    const opening = document.createElement('div');
    opening.style.position = 'absolute';
    opening.style.left = '3px';
    opening.style.right = '3px';
    opening.style.top = module.type === 'showcase-3' ? '52px' : '57px';
    opening.style.height = module.type === 'showcase-3' ? '55px' : '40px';
    opening.style.border = '3px solid #8b9197';
    opening.style.background = '#eef1f3';

    const shelfCount = module.type === 'showcase-3' ? 2 : 1;
    for (let index = 1; index <= shelfCount; index += 1) {
      const shelf = document.createElement('span');
      shelf.style.position = 'absolute';
      shelf.style.left = '0';
      shelf.style.right = '0';
      shelf.style.top = `${(index / (shelfCount + 1)) * 100}%`;
      shelf.style.height = '3px';
      shelf.style.background = 'rgba(151, 190, 153, 0.9)';
      opening.appendChild(shelf);
    }

    frame.appendChild(opening);
    preview.appendChild(frame);
    return preview;
  }

  function createModulePreview(module) {
    if (module.type === 'separator') return createSeparatorPreview(module.widthCm);
    if (module.type === 'showcase-2' || module.type === 'showcase-3') {
      return createShowcasePreview(module);
    }
    return createPanelPreview(module.widthCm);
  }

  function syncPickerSelection() {
    pickerGrid.querySelectorAll('[data-module-key]').forEach((card) => {
      const selected = card.dataset.moduleKey === selectedModuleKey;
      card.classList.toggle('selected', selected);
      card.setAttribute('aria-selected', String(selected));
    });
    pickerAddButton.disabled = !selectedModuleKey;
  }

  function submitPickerSelection() {
    if (!selectedModuleKey || !pickerRequest) return;

    const module = MODULE_CATALOG[selectedModuleKey];
    if (!module) return;

    const request = {
      ...pickerRequest,
      moduleKey: selectedModuleKey,
      module,
    };

    closePicker();
    onAdd?.(request);
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

      const cardTitle = document.createElement('strong');
      cardTitle.className = 'module-catalog-card-title';
      cardTitle.textContent = module.label;

      card.append(cardTitle, createModulePreview(module));
      card.addEventListener('click', () => {
        selectedModuleKey = moduleKey;
        syncPickerSelection();
      });
      card.addEventListener('dblclick', () => {
        selectedModuleKey = moduleKey;
        syncPickerSelection();
        submitPickerSelection();
      });

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
    selectedModuleKey = null;
    syncPickerSelection();
  }

  function openPicker({ placement = 'append', context = null } = {}) {
    pickerRequest = { placement, context };
    selectedModuleKey = null;

    if (placement === 'left') {
      pickerTitle.textContent = 'Sol Tarafa Modül Ekle';
    } else if (placement === 'right') {
      pickerTitle.textContent = 'Sağ Tarafa Modül Ekle';
    } else {
      pickerTitle.textContent = 'Modül Ekle';
    }

    pickerContext.textContent = context
      ? `Hedef: Modül ${context.moduleIndex + 1} · ${describeModule(context)}`
      : 'Seçilen modül duvarın sonuna eklenecek.';

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
    title.textContent = `Modül ${context.moduleIndex + 1} · ${describeModule(context)}`;
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
      close();
      onDuplicate?.(context, action === 'duplicate-left' ? 'left' : 'right');
      return;
    }

    if (action === 'add-right') {
      openPicker({ placement: 'right', context });
      return;
    }

    if (action === 'add-left') {
      openPicker({ placement: 'left', context });
    }
  });

  pickerAddButton.addEventListener('click', submitPickerSelection);

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

  return {
    open,
    close,
    openPicker,
    closePicker,
  };
}
