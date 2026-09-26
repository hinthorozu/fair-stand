import { resolveProjectBom } from './projectBom.js';
import { getFairStandHostDocument } from './hostDocument.js';

const PANEL_ID = 'production-bom-panel';
const DEFAULT_WIDTH = 420;
const DEFAULT_HEIGHT = 520;

function formatNumber(value) {
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(Number(value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function lineLabel(line) {
  return `${formatNumber(line.quantity)} × ${line.name} · ${line.unit} · ${line.itemKey}`;
}

function moduleCollapseKey(entry) {
  return entry.moduleId || `idx:${entry.index}:${entry.itemKey ?? 'none'}`;
}

function renderModuleHtml(entry, { open = false } = {}) {
  const head = `Modül ${entry.index + 1} · ${escapeHtml(entry.name)}`;
  const keyAttr = escapeHtml(moduleCollapseKey(entry));
  const openAttr = open ? ' open' : '';
  const unresolvedClass = entry.status === 'unresolved' ? ' production-bom-module--unresolved' : '';
  const key = entry.itemKey
    ? `<div class="production-bom-module__key">${escapeHtml(entry.itemKey)}</div>`
    : '';

  let content;
  if (entry.status === 'unresolved') {
    content = `<p class="production-bom-module__error">${escapeHtml(entry.message)}</p>`;
  } else if (entry.lines.length) {
    content = `<ul class="production-bom-module__list">${entry.lines.map((line) => (
      `<li>${escapeHtml(lineLabel(line))}</li>`
    )).join('')}</ul>`;
  } else {
    content = '<p class="production-bom-panel__empty">Alt item yok.</p>';
  }

  return `
    <details class="panel-card compact collapsible-panel production-bom-module${unresolvedClass}" data-bom-collapse-key="${keyAttr}"${openAttr}>
      <summary class="panel-summary">
        <span>${head}</span>
        <span class="panel-chevron" aria-hidden="true"></span>
      </summary>
      <div class="panel-card-content">
        ${key}
        ${content}
      </div>
    </details>
  `;
}

function renderTotalsHtml(lines, { open = false } = {}) {
  const openAttr = open ? ' open' : '';
  const body = lines.length
    ? `<ul class="production-bom-module__list">${lines.map((line) => (
      `<li>${escapeHtml(lineLabel(line))}</li>`
    )).join('')}</ul>`
    : '<p class="production-bom-panel__empty">Birleşik leaf satır yok.</p>';

  return `
    <details class="panel-card compact collapsible-panel production-bom-module" data-bom-collapse-key="__totals__"${openAttr}>
      <summary class="panel-summary">
        <span>Birleşik leaf toplam</span>
        <span class="panel-chevron" aria-hidden="true"></span>
      </summary>
      <div class="panel-card-content">${body}</div>
    </details>
  `;
}

export function createProductionBomPanel() {
  const host = getFairStandHostDocument() || (typeof document !== 'undefined' ? document : null);
  if (!host?.body) {
    return {
      open() {},
      close() {},
      isOpen() { return false; },
      refresh() {},
      destroy() {},
    };
  }

  let panel = host.getElementById(PANEL_ID);
  if (!panel) {
    panel = host.createElement('div');
    panel.id = PANEL_ID;
    panel.className = 'production-bom-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Üretim listesi');
    panel.style.width = `${DEFAULT_WIDTH}px`;
    panel.style.height = `${DEFAULT_HEIGHT}px`;
    panel.style.left = '24px';
    panel.style.top = '72px';
    panel.innerHTML = `
      <div class="production-bom-panel__header" data-role="bom-drag">
        <span class="production-bom-panel__title">Üretim Listesi</span>
        <button type="button" class="production-bom-panel__close" data-role="bom-close" aria-label="Kapat">×</button>
      </div>
      <div class="production-bom-panel__body" data-role="bom-body"></div>
      <div class="production-bom-panel__resize" data-role="bom-resize" aria-hidden="true"></div>
    `;
    host.body.appendChild(panel);
  }

  const body = panel.querySelector('[data-role="bom-body"]');
  const dragHandle = panel.querySelector('[data-role="bom-drag"]');
  const closeButton = panel.querySelector('[data-role="bom-close"]');
  const resizeHandle = panel.querySelector('[data-role="bom-resize"]');

  let getModules = () => [];
  let onVisibilityChange = null;
  let dragState = null;
  let resizeState = null;
  const openCollapseKeys = new Set();

  function captureOpenCollapseKeys() {
    if (!body) return;
    openCollapseKeys.clear();
    body.querySelectorAll('details[data-bom-collapse-key]').forEach((details) => {
      if (details.open) openCollapseKeys.add(details.getAttribute('data-bom-collapse-key'));
    });
  }

  function refresh() {
    if (!body) return;
    captureOpenCollapseKeys();
    const bom = resolveProjectBom(getModules());
    const moduleHtml = bom.modules.length
      ? bom.modules.map((entry) => renderModuleHtml(entry, {
        open: openCollapseKeys.has(moduleCollapseKey(entry)),
      })).join('')
      : '<p class="production-bom-panel__empty">Sahnede modül yok.</p>';

    const unresolvedNote = bom.unresolved.length
      ? `<p class="production-bom-panel__hint">${bom.unresolved.length} modül çözülemedi (kırmızı).</p>`
      : '';

    body.innerHTML = `
      <p class="production-bom-panel__hint">Kaydetme yok · karşılaştırma için ekran listesi. Köşe/ilişki türevli parçalar bu listede yok.</p>
      ${unresolvedNote}
      <h3 class="production-bom-panel__section-title">Modüller</h3>
      ${moduleHtml}
      ${renderTotalsHtml(bom.lines, { open: openCollapseKeys.has('__totals__') })}
    `;
  }

  function open() {
    panel.hidden = false;
    refresh();
    onVisibilityChange?.(true);
  }

  function close() {
    panel.hidden = true;
    onVisibilityChange?.(false);
  }

  function isOpen() {
    return !panel.hidden;
  }

  function onCloseClick(event) {
    event.preventDefault();
    close();
  }

  function onDragStart(event) {
    if (event.button !== 0) return;
    if (event.target?.closest?.('[data-role="bom-close"]')) return;
    dragState = {
      startX: event.clientX,
      startY: event.clientY,
      left: panel.offsetLeft,
      top: panel.offsetTop,
    };
    event.preventDefault();
  }

  function onResizeStart(event) {
    if (event.button !== 0) return;
    resizeState = {
      startX: event.clientX,
      startY: event.clientY,
      width: panel.offsetWidth,
      height: panel.offsetHeight,
    };
    event.preventDefault();
    event.stopPropagation();
  }

  function onPointerMove(event) {
    if (dragState) {
      const nextLeft = dragState.left + (event.clientX - dragState.startX);
      const nextTop = dragState.top + (event.clientY - dragState.startY);
      panel.style.left = `${Math.max(0, nextLeft)}px`;
      panel.style.top = `${Math.max(0, nextTop)}px`;
    }
    if (resizeState) {
      const nextWidth = resizeState.width + (event.clientX - resizeState.startX);
      const nextHeight = resizeState.height + (event.clientY - resizeState.startY);
      panel.style.width = `${Math.max(280, nextWidth)}px`;
      panel.style.height = `${Math.max(200, nextHeight)}px`;
    }
  }

  function onPointerUp() {
    dragState = null;
    resizeState = null;
  }

  closeButton?.addEventListener('click', onCloseClick);
  dragHandle?.addEventListener('mousedown', onDragStart);
  resizeHandle?.addEventListener('mousedown', onResizeStart);
  host.defaultView?.addEventListener('mousemove', onPointerMove);
  host.defaultView?.addEventListener('mouseup', onPointerUp);

  return {
    open,
    close,
    isOpen,
    refresh,
    setModulesSource(fn) {
      getModules = typeof fn === 'function' ? fn : () => [];
    },
    setOnVisibilityChange(fn) {
      onVisibilityChange = typeof fn === 'function' ? fn : null;
    },
    destroy() {
      closeButton?.removeEventListener('click', onCloseClick);
      dragHandle?.removeEventListener('mousedown', onDragStart);
      resizeHandle?.removeEventListener('mousedown', onResizeStart);
      host.defaultView?.removeEventListener('mousemove', onPointerMove);
      host.defaultView?.removeEventListener('mouseup', onPointerUp);
      panel.remove();
    },
  };
}
