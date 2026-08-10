const MODULE_LABELS = {
  'flat-panel': 'Düz Panel',
  'showcase-2': '2 Raflı Vitrin',
  'showcase-3': '3 Raflı Vitrin',
  separator: 'Separatör',
  door: 'Depo Kapısı',
};

export function createModuleContextMenu({ onDelete, onDuplicate }) {
  let activeContext = null;

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
          <h3 id="module-picker-title"></h3>
        </div>
        <button type="button" class="module-picker-close" aria-label="Kapat">×</button>
      </div>
      <div class="module-picker-placeholder">
        <strong>Modül seçimi sonraki adımda burada olacak.</strong>
        <span>Düz panel, vitrin, separatör ve depo kapısı tek parça modül olarak listelenecek.</span>
      </div>
    </div>
  `;
  document.body.appendChild(pickerBackdrop);

  const title = menu.querySelector('.module-context-title');
  const pickerTitle = pickerBackdrop.querySelector('#module-picker-title');

  function describeModule(context) {
    const label = MODULE_LABELS[context?.type] ?? 'Modül';
    const width = Number.isFinite(context?.widthCm) ? ` · ${context.widthCm} cm` : '';
    return `${label}${width}`;
  }

  function close() {
    menu.hidden = true;
    activeContext = null;
  }

  function closePicker() {
    pickerBackdrop.hidden = true;
  }

  function openPicker(side) {
    if (!activeContext) return;
    const sideLabel = side === 'left' ? 'Sol Tarafa Modül Ekle' : 'Sağ Tarafa Modül Ekle';
    pickerTitle.textContent = `${sideLabel} · ${describeModule(activeContext)}`;
    menu.hidden = true;
    pickerBackdrop.hidden = false;
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
      openPicker('right');
      return;
    }

    if (action === 'add-left') openPicker('left');
  });

  pickerBackdrop.querySelector('.module-picker-close').addEventListener('click', closePicker);
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

  return {
    open,
    close,
    closePicker,
  };
}
