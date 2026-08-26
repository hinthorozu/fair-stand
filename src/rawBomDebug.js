import { getExpandedStraightWallRecipe } from './moduleRecipes.js';

const selectionInfo = document.querySelector('#selection-info');
const sidebar = document.querySelector('.sidebar');

function createPanel() {
  if (!sidebar || document.querySelector('#raw-bom-debug')) return null;
  const details = document.createElement('details');
  details.id = 'raw-bom-debug';
  details.className = 'panel-card compact collapsible-panel';
  details.open = true;
  details.innerHTML = `
    <summary class="panel-summary"><span>Üretim Listesi · Debug</span><span class="panel-chevron" aria-hidden="true"></span></summary>
    <div class="panel-card-content">
      <p data-role="bom-status" class="status">Reçetesi olan bir düz duvar modülü seç.</p>
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

function renderRecipe(widthCm) {
  const recipe = getExpandedStraightWallRecipe(widthCm);
  if (!status || !content) return;

  if (!recipe) {
    status.textContent = 'Bu modül için üretim reçetesi henüz tanımlı değil.';
    content.innerHTML = '';
    return;
  }

  status.textContent = `${widthCm} cm düz duvar · Raw BOM`;
  content.innerHTML = '';

  const list = document.createElement('ul');
  list.style.cssText = 'margin:8px 0 0;padding-left:18px;display:grid;gap:5px';
  recipe.items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${formatNumber(item.quantity)} × ${item.part?.name ?? item.partId}`;
    list.appendChild(li);
  });
  content.appendChild(list);
}

function syncFromSelection() {
  if (!selectionInfo || !status || !content) return;
  const text = selectionInfo.textContent?.trim() ?? '';

  // Düz duvar yüzeyi için mevcut seçim metni: "Modül N · 100 cm · alttan ...".
  // Banko/Baza/Raf/Vitrin/Kapı/Separatör gibi özel modüller aynı genişliği taşıyabilir;
  // bunları düz duvar reçetesiyle yanlış eşleştirmemek için açıkça hariç tutuyoruz.
  const specialModule = /Banko|Baza|Raf|Vitrin|Kapı|Separatör|Koltuk|Projektör|panel seçili/i.test(text);
  const widthMatch = text.match(/·\s*(50|100|150|200)\s*cm\s*·/i);

  if (!widthMatch || specialModule) {
    status.textContent = text && text !== 'Bir panel seç; Ctrl/Cmd + tık ile karşı köşeyi seçip dikdörtgen blok oluştur.'
      ? 'Bu modül için üretim reçetesi henüz tanımlı değil.'
      : 'Reçetesi olan bir düz duvar modülü seç.';
    content.innerHTML = '';
    return;
  }

  renderRecipe(Number(widthMatch[1]));
}

if (selectionInfo && panel) {
  new MutationObserver(syncFromSelection).observe(selectionInfo, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  syncFromSelection();
}
