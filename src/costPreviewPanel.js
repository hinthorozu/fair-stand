import { listCostProducts } from './costCatalogClient.js';
import { buildCostSnapshot, isFixedCostProduct, normalizeCostProduct } from './costSnapshot.js';
import { getFairStandHostDocument } from './hostDocument.js';
import { resolveProjectBom } from './projectBom.js';

const PANEL_ID = 'cost-preview-panel';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const STATUS_LABEL = Object.freeze({
  priced: 'fiyatlı',
  unmapped: 'eşleşmedi',
  unpriced: 'fiyatsız',
  unit_mismatch: 'birim uyuşmadı',
  ambiguous: 'birden fazla eşleşme',
  quantity_required: 'miktar gerekli',
});

function moneyCell(line) {
  if (line.status !== 'priced') return STATUS_LABEL[line.status] || line.status;
  return `${line.lineTotal} ${line.currency}`;
}

function renderLines(lines) {
  if (!lines.length) return '<p class="cost-preview-panel__hint">BOM satırı yok.</p>';
  const rows = lines.map((line) => `
    <tr>
      <td>${escapeHtml(line.name || line.itemKey || '')}</td>
      <td>${escapeHtml(line.quantity ?? '')} ${escapeHtml(line.bomUnit || line.costUnit || '')}</td>
      <td>${escapeHtml(moneyCell(line))}</td>
    </tr>
  `).join('');
  return `<table><thead><tr><th>Kalem</th><th>Miktar</th><th>Tutar</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderFixed(products, selected) {
  if (!products.length) {
    return '<p class="cost-preview-panel__hint">Seçilebilir sabit kalem yok. Nakliye ve işçilik, itemKey olmayan maliyet kataloğu satırıdır; tutar katalogda durur.</p>';
  }
  return `<div class="cost-preview-panel__fixed">${products.map((product) => {
    const selectedLine = selected.get(product.id);
    const checked = selectedLine ? ' checked' : '';
    const quantity = selectedLine?.quantity ?? '';
    return `<label>
      <input type="checkbox" data-fixed-id="${escapeHtml(product.id)}"${checked} />
      <span>${escapeHtml(product.name)} · ${escapeHtml(product.unitPrice ?? 'fiyatsız')} ${escapeHtml(product.currency ?? '')} / ${escapeHtml(product.unit ?? '')}</span>
      <input type="number" min="0" step="any" data-fixed-qty="${escapeHtml(product.id)}" value="${escapeHtml(quantity)}" aria-label="${escapeHtml(product.name)} miktarı" />
    </label>`;
  }).join('')}</div>`;
}

function renderTotal(snapshot) {
  if (snapshot.mixedCurrency) {
    const parts = Object.entries(snapshot.totalsByCurrency)
      .map(([currency, amount]) => `${amount} ${currency}`)
      .join(', ');
    return `<p class="cost-preview-panel__hint">Karışık para birimi; tek toplam yok. ${escapeHtml(parts)}</p>`;
  }
  if (!snapshot.total) return '<p class="cost-preview-panel__hint">Toplanan fiyatlı satır yok.</p>';
  return `<p><strong>Toplam ${escapeHtml(snapshot.total.amount)} ${escapeHtml(snapshot.total.currency)}</strong></p>`;
}

export function createCostPreviewPanel() {
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
    panel.className = 'cost-preview-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Maliyet');
    panel.style.width = '460px';
    panel.style.height = '560px';
    panel.style.right = '24px';
    panel.style.top = '72px';
    panel.innerHTML = `
      <div class="cost-preview-panel__header" data-role="cost-drag">
        <span class="cost-preview-panel__title">Maliyet</span>
        <button type="button" class="cost-preview-panel__close" data-role="cost-close" aria-label="Kapat">×</button>
      </div>
      <div class="cost-preview-panel__body" data-role="cost-body"></div>
    `;
    host.body.appendChild(panel);
  }

  const body = panel.querySelector('[data-role="cost-body"]');
  const dragHandle = panel.querySelector('[data-role="cost-drag"]');
  const closeButton = panel.querySelector('[data-role="cost-close"]');
  let getModules = () => [];
  let getStand = () => null;
  let getProject = () => ({ id: null, version: 1 });
  let onVisibilityChange = null;
  let onPrepareQuote = null;
  let dragState = null;
  let products = [];
  let catalogMessage = '';
  const selected = new Map();

  function readSelectionFromDom() {
    body?.querySelectorAll('[data-fixed-id]').forEach((input) => {
      const id = input.getAttribute('data-fixed-id');
      const qty = body.querySelector(`[data-fixed-qty="${CSS.escape(id)}"]`);
      if (input.checked) selected.set(id, { productId: id, quantity: qty?.value ?? '' });
      else selected.delete(id);
    });
  }

  function selectedLines() {
    return Array.from(selected.values());
  }

  function currentSnapshot() {
    const bom = resolveProjectBom(getModules(), getStand());
    const project = getProject() || {};
    return buildCostSnapshot({
      bomLines: bom.lines,
      costProducts: products,
      selectedFixedLines: selectedLines(),
      projectId: project.id ?? null,
      projectVersion: project.version ?? 1,
      pricedAt: new Date().toISOString(),
      unresolved: bom.unresolved,
      printAreas: bom.printAreas,
    });
  }

  function paint() {
    if (!body) return;
    const snapshot = currentSnapshot();
    const fixed = products.filter((product) => isFixedCostProduct(product));
    body.innerHTML = `
      <p class="cost-preview-panel__hint">Fiyat reçeteye yazılmaz. Eşleşmeyen ve fiyatsız satır toplama girmez.</p>
      ${catalogMessage ? `<p class="cost-preview-panel__status${catalogMessage.startsWith('Katalog') ? ' cost-preview-panel__status--error' : ''}">${escapeHtml(catalogMessage)}</p>` : ''}
      <h4>Stand kalemleri</h4>
      ${renderLines(snapshot.lines.filter((line) => line.source === 'bom'))}
      <h4>Sabit kalemler</h4>
      ${renderFixed(fixed, selected)}
      ${renderTotal(snapshot)}
      <p class="cost-preview-panel__status" data-role="cost-prepare-status"></p>
      <button type="button" class="cost-preview-panel__prepare" data-role="cost-prepare">Teklife kaydet</button>
    `;
  }

  async function loadCatalog() {
    catalogMessage = '';
    try {
      const items = await listCostProducts();
      products = items.map((item) => normalizeCostProduct(item)).filter(Boolean);
      if (!items.length) catalogMessage = 'Maliyet kataloğu boş veya giriş yok.';
    } catch (error) {
      products = [];
      catalogMessage = 'Katalog okunamadı.';
      console.warn('Maliyet kataloğu okunamadı:', error);
    }
  }

  async function refresh() {
    readSelectionFromDom();
    if (panel.hidden) return;
    await loadCatalog();
    paint();
  }

  function open() {
    panel.hidden = false;
    refresh();
    onVisibilityChange?.(true);
  }

  function close() {
    readSelectionFromDom();
    panel.hidden = true;
    onVisibilityChange?.(false);
  }

  function onPrepareClick(event) {
    const button = event.target?.closest?.('[data-role="cost-prepare"]');
    if (!button) return;
    readSelectionFromDom();
    const snapshot = currentSnapshot();
    const status = body.querySelector('[data-role="cost-prepare-status"]');
    if (status) status.textContent = 'Kaydediliyor…';
    Promise.resolve(onPrepareQuote?.({
      snapshot,
      selectedFixedLines: selectedLines(),
    })).then((message) => {
      if (status) status.textContent = message || 'Maliyet anlık görüntüsü hazır.';
    }).catch((error) => {
      console.warn('Teklif paketi kaydedilemedi:', error);
      if (status) status.textContent = 'Teklif paketi kaydedilemedi.';
    });
  }

  function onBodyChange(event) {
    if (!event.target?.matches?.('[data-fixed-id], [data-fixed-qty]')) return;
    readSelectionFromDom();
    const snapshot = currentSnapshot();
    const totalHost = body.querySelector('strong')?.parentElement;
    if (totalHost) {
      const next = document.createElement('div');
      next.innerHTML = renderTotal(snapshot);
      totalHost.replaceWith(next.firstElementChild);
    }
  }

  function onCloseClick(event) {
    event.preventDefault();
    close();
  }

  function onDragStart(event) {
    if (event.button !== 0) return;
    if (event.target?.closest?.('[data-role="cost-close"]')) return;
    dragState = {
      startX: event.clientX,
      startY: event.clientY,
      left: panel.offsetLeft,
      top: panel.offsetTop,
    };
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!dragState) return;
    panel.style.left = `${Math.max(0, dragState.left + (event.clientX - dragState.startX))}px`;
    panel.style.top = `${Math.max(0, dragState.top + (event.clientY - dragState.startY))}px`;
    panel.style.right = 'auto';
  }

  function onPointerUp() {
    dragState = null;
  }

  closeButton?.addEventListener('click', onCloseClick);
  dragHandle?.addEventListener('mousedown', onDragStart);
  body?.addEventListener('change', onBodyChange);
  body?.addEventListener('click', onPrepareClick);
  host.defaultView?.addEventListener('mousemove', onPointerMove);
  host.defaultView?.addEventListener('mouseup', onPointerUp);

  return {
    open,
    close,
    isOpen() { return !panel.hidden; },
    refresh,
    setModulesSource(fn) { getModules = typeof fn === 'function' ? fn : () => []; },
    setStandSource(fn) { getStand = typeof fn === 'function' ? fn : () => null; },
    setProjectSource(fn) { getProject = typeof fn === 'function' ? fn : () => ({ id: null, version: 1 }); },
    setOnVisibilityChange(fn) { onVisibilityChange = typeof fn === 'function' ? fn : null; },
    setOnPrepareQuote(fn) { onPrepareQuote = typeof fn === 'function' ? fn : null; },
    destroy() {
      closeButton?.removeEventListener('click', onCloseClick);
      dragHandle?.removeEventListener('mousedown', onDragStart);
      body?.removeEventListener('change', onBodyChange);
      body?.removeEventListener('click', onPrepareClick);
      host.defaultView?.removeEventListener('mousemove', onPointerMove);
      host.defaultView?.removeEventListener('mouseup', onPointerUp);
      panel.remove();
    },
  };
}
