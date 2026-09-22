import { resolveItemBom } from './itemBom.js';
import { DEFAULT_SELECTION_HINT } from './selectionFeedback.js';

const selectionInfo = typeof document !== 'undefined' ? document.querySelector('#selection-info') : null;
const sidebar = typeof document !== 'undefined' ? document.querySelector('.sidebar') : null;

const SUPPORTED_L_COUNTER_WIDTHS = new Set([100, 150, 200]);

const L_COUNTER_ITEM_KEYS = Object.freeze({
  100: 'desk_banko_100_l',
  150: 'desk_banko_150_l',
  200: 'desk_banko_200_l',
});

const SHOWCASE_ITEM_KEYS = Object.freeze({
  2: 'wall_showcase_100_2',
  3: 'wall_showcase_100_3',
});

const SEPARATOR_ITEM_KEYS = Object.freeze({
  50: 'wall_separator_50',
  100: 'wall_separator_100',
});

const COUNTER_ITEM_KEYS = Object.freeze({
  100: 'desk_banko_100',
  150: 'desk_banko_150',
  200: 'desk_banko_200',
});

const BASE_ITEM_KEYS = Object.freeze({
  100: 'base_100',
  150: 'base_150',
  200: 'base_200',
});

const WALL_ITEM_KEYS = Object.freeze({
  50: 'wall_50',
  100: 'wall_100',
  150: 'wall_150',
  200: 'wall_200',
});

export function parseLCounterSelection(text) {
  const match = String(text ?? '').match(/Köşe\s+Banko\s+(100|150|200)\s*[×x]\s*(100|150|200)/i);
  if (!match) return null;

  const widthCm = Number(match[1]);
  const depthCm = Number(match[2]);
  if (!SUPPORTED_L_COUNTER_WIDTHS.has(widthCm) || depthCm !== widthCm) return null;

  return {
    moduleType: 'counter',
    widthCm,
    label: `Köşe Banko ${widthCm}×${depthCm}`,
    options: { shape: 'L' },
  };
}

function createPanel() {
  if (!sidebar || document.querySelector('#raw-bom-debug')) return null;
  const details = document.createElement('details');
  details.id = 'raw-bom-debug';
  details.className = 'panel-card compact collapsible-panel';
  details.open = true;
  details.innerHTML = `
    <summary class="panel-summary"><span>Üretim Listesi · Debug</span><span class="panel-chevron" aria-hidden="true"></span></summary>
    <div class="panel-card-content">
      <p data-role="bom-status" class="status">Reçetesi olan bir modül seç.</p>
      <div data-role="bom-content"></div>
    </div>
  `;
  const standards = [...sidebar.querySelectorAll('details')].find((item) =>
    item.querySelector('.panel-summary span')?.textContent?.trim() === 'Standartlar'
  );
  if (standards) sidebar.insertBefore(details, standards);
  else sidebar.appendChild(details);
  return details;
}

const panel = createPanel();
const status = panel?.querySelector('[data-role="bom-status"]');
const content = panel?.querySelector('[data-role="bom-content"]');

function formatNumber(value) {
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(Number(value));
}

function renderItemBom(itemKey, label) {
  if (!status || !content) return;

  let lines;
  try {
    lines = resolveItemBom(itemKey);
  } catch (error) {
    status.textContent = error?.message || 'Bu Item için üretim reçetesi çözülemedi.';
    content.innerHTML = '';
    return;
  }

  status.textContent = `${label} · Raw BOM`;
  content.innerHTML = '';

  const list = document.createElement('ul');
  list.style.cssText = 'margin:8px 0 0;padding-left:18px;display:grid;gap:5px';
  lines.forEach((line) => {
    const li = document.createElement('li');
    li.textContent = `${formatNumber(line.quantity)} × ${line.item?.name ?? line.itemKey}`;
    list.appendChild(li);
  });
  content.appendChild(list);
}

function syncFromSelection() {
  if (!selectionInfo || !status || !content) return;
  const text = selectionInfo.textContent?.trim() ?? '';

  const doorMatch = text.match(/Kapı\s+(100)\s*cm/i);
  if (doorMatch) {
    renderItemBom('door_100', `Depo Kapısı ${doorMatch[1]} cm`);
    return;
  }

  const showcaseMatch = text.match(/(2|3)\s*Gözlü\s+Vitrin\s+(100)\s*cm/i);
  if (showcaseMatch) {
    const eyeCount = Number(showcaseMatch[1]);
    const widthCm = Number(showcaseMatch[2]);
    renderItemBom(SHOWCASE_ITEM_KEYS[eyeCount], `${eyeCount} Gözlü Vitrin ${widthCm} cm`);
    return;
  }

  const separatorMatch = text.match(/Separatör\s+(50|100)\s*cm/i);
  if (separatorMatch) {
    const widthCm = Number(separatorMatch[1]);
    renderItemBom(SEPARATOR_ITEM_KEYS[widthCm], `Separatör ${widthCm} cm`);
    return;
  }

  const cornerCounterSelection = parseLCounterSelection(text);
  if (cornerCounterSelection) {
    renderItemBom(
      L_COUNTER_ITEM_KEYS[cornerCounterSelection.widthCm],
      cornerCounterSelection.label,
    );
    return;
  }

  const counterMatch = text.match(/Banko\s+(100|150|200)\s*cm/i);
  if (counterMatch) {
    const widthCm = Number(counterMatch[1]);
    renderItemBom(COUNTER_ITEM_KEYS[widthCm], `Banko ${widthCm} cm`);
    return;
  }

  const baseMatch = text.match(/Baza\s+(100|150|200)\s*cm/i);
  if (baseMatch) {
    const widthCm = Number(baseMatch[1]);
    renderItemBom(BASE_ITEM_KEYS[widthCm], `Baza ${widthCm} cm`);
    return;
  }

  // Düz duvar yüzeyi için mevcut seçim metni: "Modül N · 100 cm · alttan ...".
  const specialModule = /Banko|Baza|Bazalı|Raf|Vitrin|Kapı|Separatör|Koltuk|Projektör|panel seçili/i.test(text);
  const widthMatch = text.match(/·\s*(50|100|150|200)\s*cm\s*·/i);

  if (!widthMatch || specialModule) {
    status.textContent = text && text !== DEFAULT_SELECTION_HINT
      ? 'Bu modül için üretim reçetesi henüz tanımlı değil.'
      : 'Reçetesi olan bir modül seç.';
    content.innerHTML = '';
    return;
  }

  const widthCm = Number(widthMatch[1]);
  renderItemBom(WALL_ITEM_KEYS[widthCm], `${widthCm} cm düz duvar`);
}

if (selectionInfo && panel) {
  new MutationObserver(syncFromSelection).observe(selectionInfo, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  syncFromSelection();
}
