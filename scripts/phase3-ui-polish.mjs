import fs from 'node:fs';

const indexPath = 'index.html';
const stylePath = 'src/style.css';
const mainPath = 'src/main.js';

let index = fs.readFileSync(indexPath, 'utf8');
let style = fs.readFileSync(stylePath, 'utf8');
let main = fs.readFileSync(mainPath, 'utf8');

// 1) Left sidebar hierarchy: stronger section rhythm, clearer open state and compact intro.
index = index.replace('<aside class="sidebar">\n        <div>', '<aside class="sidebar">\n        <div class="sidebar-intro">');
index = index.replace('id="selection-info" class="status"', 'id="selection-info" class="status selection-status"');

const polishCss = `

/* Phase 3 final polish: sidebar hierarchy, selection feedback and status tones */
.sidebar-intro {
  padding: 2px 2px 6px;
}

.sidebar-intro .muted {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.45;
}

.sidebar {
  gap: 11px;
  padding: 18px;
}

.panel-card {
  gap: 8px;
  padding: 13px;
  border-color: #d9dee5;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.025);
  transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
}

.panel-card[open] {
  border-color: #c8d0da;
  box-shadow: 0 5px 16px rgba(15, 23, 42, 0.055);
}

.panel-summary {
  min-height: 24px;
  margin-bottom: 0;
  border-radius: 8px;
  color: #2d3748;
  letter-spacing: -0.01em;
}

.panel-summary:hover {
  color: #111827;
}

.panel-card[open] > .panel-summary {
  color: #111827;
}

.panel-card[open] > .panel-summary::before {
  content: '';
  width: 3px;
  height: 16px;
  flex: 0 0 3px;
  margin-right: -4px;
  border-radius: 999px;
  background: #f97316;
}

.panel-card-content {
  gap: 8px;
  padding-top: 3px;
}

.project-card[open],
.stand-setup-card[open] {
  background: #fdfefe;
}

/* 2) Selection feedback: make active selection unmistakable without shouting. */
.selection-status {
  min-height: 0;
  padding: 9px 10px;
  border: 1px solid #dfe4ea;
  border-radius: 9px;
  background: #f7f9fb;
  color: #667085;
  transition: 140ms ease;
}

.selection-status.has-selection {
  border-color: #9bb9ef;
  background: #eff6ff;
  color: #1e3a5f;
  box-shadow: inset 3px 0 0 #2563eb;
  font-weight: 650;
}

/* 3) One visual language for info / success / warning / error messages. */
.status.status-info,
.status.status-success,
.status.status-warning,
.status.status-error {
  min-height: 0;
  padding: 7px 9px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.status.status-info {
  color: #526172;
  background: #f6f8fa;
  border-color: #e5e9ee;
}

.status.status-success {
  color: #166534;
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.status.status-warning {
  color: #92400e;
  background: #fffbeb;
  border-color: #fde68a;
}

.status.status-error,
.status.error {
  color: #b42318;
  background: #fff5f4;
  border-color: #fecaca;
}
`;

if (!style.includes('Phase 3 final polish: sidebar hierarchy')) {
  style += polishCss;
}

// Selection feedback is derived from the existing selection message, so all module types
// automatically participate without duplicating the selection logic.
const selectionAnchor = "const projectLoadingOverlay = document.querySelector('#project-loading-overlay');";
const selectionLogic = `\n\nconst DEFAULT_SELECTION_HINT = 'Bir panel seç; Ctrl/Cmd + tık ile karşı köşeyi seçip dikdörtgen blok oluştur.';\n\nfunction syncSelectionFeedback() {\n  const message = selectionInfo.textContent.trim();\n  selectionInfo.classList.toggle('has-selection', Boolean(message) && message !== DEFAULT_SELECTION_HINT);\n}\n\nnew MutationObserver(syncSelectionFeedback).observe(selectionInfo, {\n  childList: true,\n  subtree: true,\n  characterData: true,\n});\nsyncSelectionFeedback();\n`;
if (!main.includes('function syncSelectionFeedback()')) {
  if (!main.includes(selectionAnchor)) throw new Error('selection anchor not found');
  main = main.replace(selectionAnchor, selectionAnchor + selectionLogic);
}

// Status tone observer standardizes the existing stage/project/asset channels without
// rewriting their business logic. Explicit .error always wins; other tones are inferred
// from the human-readable message and remain purely presentational.
const statusLogic = `\nconst STATUS_ELEMENTS = [stageResult, projectStatus, assetStatus].filter(Boolean);\n\nfunction inferStatusTone(element) {\n  if (element.classList.contains('error')) return 'error';\n  const text = element.textContent.toLocaleLowerCase('tr-TR');\n  if (/hata|başarısız|geçersiz|aşılamaz|bulunamadı|yüklenemedi|kaydedilemedi/.test(text)) return 'error';\n  if (/uyarı|dikkat|seçilmedi|henüz|bekliyor/.test(text)) return 'warning';\n  if (/kaydedildi|yüklendi|oluşturuldu|hazır|tamamlandı|eklendi|aktarıldı|silindi/.test(text)) return 'success';\n  return 'info';\n}\n\nfunction syncStatusTone(element) {\n  element.classList.remove('status-info', 'status-success', 'status-warning', 'status-error');\n  element.classList.add('status-' + inferStatusTone(element));\n}\n\nSTATUS_ELEMENTS.forEach((element) => {\n  new MutationObserver(() => syncStatusTone(element)).observe(element, {\n    childList: true,\n    subtree: true,\n    characterData: true,\n    attributes: true,\n    attributeFilter: ['class'],\n  });\n  syncStatusTone(element);\n});\n`;

if (!main.includes('const STATUS_ELEMENTS = [stageResult, projectStatus, assetStatus]')) {
  const wallLabelsAnchor = 'const WALL_LABELS = Object.freeze({';
  if (!main.includes(wallLabelsAnchor)) throw new Error('status anchor not found');
  main = main.replace(wallLabelsAnchor, statusLogic + '\n' + wallLabelsAnchor);
}

fs.writeFileSync(indexPath, index);
fs.writeFileSync(stylePath, style);
fs.writeFileSync(mainPath, main);

// Workflow trigger marker: phase3-polish-v1
