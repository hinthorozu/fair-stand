import fs from 'node:fs';

const indexPath = 'index.html';
const stylePath = 'src/style.css';
const mainPath = 'src/main.js';

let index = fs.readFileSync(indexPath, 'utf8');
let style = fs.readFileSync(stylePath, 'utf8');
let main = fs.readFileSync(mainPath, 'utf8');

// Give the loading overlay stable hooks so each async project action can explain itself.
index = index.replace(
  '<strong>Proje yükleniyor…</strong>\n        <span>Görseller ve sahne hazırlanıyor.</span>',
  '<strong id="project-loading-title">Proje yükleniyor…</strong>\n        <span id="project-loading-detail">Görseller ve sahne hazırlanıyor.</span>',
);

const css = `

/* Phase 3: unified buttons, async feedback and compact-screen behaviour */
button {
  min-height: 38px;
  border-color: #cbd2da;
  background: #ffffff;
  color: #263244;
  font-weight: 700;
  line-height: 1.15;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.035);
  transition: border-color 120ms ease, background 120ms ease, color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
}

button:hover:not(:disabled) {
  border-color: #9ca8b7;
  background: #f8fafc;
  box-shadow: 0 3px 8px rgba(15, 23, 42, 0.07);
}

button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.22);
  outline-offset: 2px;
}

button.primary {
  border-color: #111827;
  background: #111827;
  color: #ffffff;
  box-shadow: 0 2px 5px rgba(17, 24, 39, 0.18);
}

button.primary:hover:not(:disabled) {
  border-color: #273244;
  background: #273244;
}

button.danger:not(.ghost) {
  border-color: #efb8b4;
  background: #fff7f6;
  color: #b42318;
}

button.danger:not(.ghost):hover:not(:disabled),
button.danger.ghost:hover:not(:disabled) {
  border-color: #e29b95;
  background: #fff1f0;
  color: #912018;
}

button.ghost {
  background: transparent;
  box-shadow: none;
}

button:disabled,
button[aria-busy="true"] {
  opacity: 0.5;
  cursor: wait;
  box-shadow: none;
  transform: none;
}

button[aria-busy="true"] {
  position: relative;
}

button[aria-busy="true"]::after {
  content: '';
  width: 12px;
  height: 12px;
  margin-left: 8px;
  display: inline-block;
  vertical-align: -2px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: fair-stand-button-spin 650ms linear infinite;
}

@keyframes fair-stand-button-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 980px) {
  #app {
    grid-template-columns: 290px minmax(0, 1fr);
  }

  .sidebar {
    padding: 14px;
    gap: 9px;
  }

  .panel-card {
    padding: 11px;
  }

  .viewport-toolbar span {
    display: none;
  }

  .viewport-toolbar {
    gap: 6px;
    padding: 7px;
  }
}

@media (max-width: 680px) {
  #app {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(230px, 46vh) minmax(0, 1fr);
    height: 100dvh;
  }

  .sidebar {
    border-right: 0;
    border-bottom: 1px solid #d9dee5;
    box-shadow: 0 6px 18px rgba(17, 24, 39, 0.05);
  }

  .sidebar-intro h1 {
    font-size: 20px;
  }

  .stand-type-thumb {
    height: 46px;
  }

  .view-cube {
    top: 12px;
    right: 12px;
    transform: scale(0.84);
    transform-origin: top right;
  }
}

@media (max-height: 700px) and (min-width: 681px) {
  .sidebar {
    padding-top: 12px;
    padding-bottom: 12px;
    gap: 8px;
  }

  .sidebar-intro .muted {
    display: none;
  }

  .panel-card {
    padding: 10px 12px;
  }
}
`;

if (!style.includes('Phase 3: unified buttons, async feedback')) style += css;

const loadingHook = "const projectLoadingOverlay = document.querySelector('#project-loading-overlay');";
const loadingHelpers = `\nconst projectLoadingTitle = document.querySelector('#project-loading-title');\nconst projectLoadingDetail = document.querySelector('#project-loading-detail');\n\nfunction setButtonBusy(button, busy, busyLabel = null) {\n  if (!button) return;\n  if (busy) {\n    if (!button.dataset.idleLabel) button.dataset.idleLabel = button.textContent;\n    button.disabled = true;\n    button.setAttribute('aria-busy', 'true');\n    if (busyLabel) button.textContent = busyLabel;\n  } else {\n    button.disabled = false;\n    button.removeAttribute('aria-busy');\n    if (button.dataset.idleLabel) button.textContent = button.dataset.idleLabel;\n  }\n}\n\nfunction showProjectLoading(title, detail = 'Lütfen bekleyin…') {\n  if (projectLoadingTitle) projectLoadingTitle.textContent = title;\n  if (projectLoadingDetail) projectLoadingDetail.textContent = detail;\n  projectLoadingOverlay.hidden = false;\n}\n\nfunction hideProjectLoading() {\n  projectLoadingOverlay.hidden = true;\n}\n`;
if (!main.includes('function setButtonBusy(')) {
  if (!main.includes(loadingHook)) throw new Error('loading hook not found');
  main = main.replace(loadingHook, loadingHook + loadingHelpers);
}

main = main.replace(
`saveProjectButton.addEventListener('click', async () => {\n  try {\n    clearAutosaveTimer();\n    await persistActiveProject();\n    enableAutosaveFromCurrentState();\n  }\n  catch (error) { console.warn('Proje kaydedilemedi:', error); projectStatus.textContent = 'Proje kaydedilemedi.'; }\n});`,
`saveProjectButton.addEventListener('click', async () => {\n  setButtonBusy(saveProjectButton, true, 'Kaydediliyor');\n  projectStatus.textContent = 'Proje kaydediliyor…';\n  try {\n    clearAutosaveTimer();\n    await persistActiveProject();\n    enableAutosaveFromCurrentState();\n  } catch (error) {\n    console.warn('Proje kaydedilemedi:', error);\n    projectStatus.textContent = 'Proje kaydedilemedi.';\n  } finally {\n    setButtonBusy(saveProjectButton, false);\n  }\n});`);

main = main.replace(
`  importProjectButton.disabled = true;\n  projectLoadingOverlay.hidden = false;\n  projectStatus.textContent = 'Proje içe aktarılıyor…';`,
`  setButtonBusy(importProjectButton, true, 'Aktarılıyor');\n  showProjectLoading('Proje içe aktarılıyor…', 'ZIP paketi ve görseller hazırlanıyor.');\n  projectStatus.textContent = 'Proje içe aktarılıyor…';`);
main = main.replace(
`    projectLoadingOverlay.hidden = true;\n    importProjectButton.disabled = false;`,
`    hideProjectLoading();\n    setButtonBusy(importProjectButton, false);`);

main = main.replace(
`  projectLoadingOverlay.hidden = false;\n  openProjectButton.disabled = true;\n  projectStatus.textContent = 'Proje yükleniyor…';`,
`  showProjectLoading('Proje yükleniyor…', 'Görseller ve sahne hazırlanıyor.');\n  setButtonBusy(openProjectButton, true, 'Açılıyor');\n  projectStatus.textContent = 'Proje yükleniyor…';`);
main = main.replace(
`    projectLoadingOverlay.hidden = true;\n    openProjectButton.disabled = false;`,
`    hideProjectLoading();\n    setButtonBusy(openProjectButton, false);`);

main = main.replace(
`  exportProjectButton.disabled = true;\n  projectStatus.textContent = 'Proje ZIP hazırlanıyor…';`,
`  setButtonBusy(exportProjectButton, true, 'Hazırlanıyor');\n  projectStatus.textContent = 'Proje ZIP hazırlanıyor…';`);
main = main.replace(
`    exportProjectButton.disabled = false;`,
`    setButtonBusy(exportProjectButton, false);`);

fs.writeFileSync(indexPath, index);
fs.writeFileSync(stylePath, style);
fs.writeFileSync(mainPath, main);
