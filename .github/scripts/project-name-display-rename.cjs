const fs = require('fs');
function rep(s,a,b,l){if(!s.includes(a)) throw new Error(l); return s.replace(a,b);}

let s=fs.readFileSync('index.html','utf8');
s=rep(s,
`          <label for="project-name">Proje adı</label>\n          <input id="project-name" type="text" value="Adsız Proje" maxlength="120" autocomplete="off" />\n          <label for="project-select">Kayıtlı projeler</label>`,
`          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">\n            <strong>Proje adı</strong>\n            <button id="rename-project" type="button" class="ghost" style="min-width:0;padding:7px 10px">Değiştir</button>\n          </div>\n          <strong id="project-name-display" style="display:block;font-size:16px;color:#1f2937;overflow-wrap:anywhere">Adsız Proje</strong>\n          <input id="project-name" type="hidden" value="Adsız Proje" />\n          <label for="project-select"><strong>Kayıtlı projeler</strong></label>`,
'index project name display');
fs.writeFileSync('index.html',s);

s=fs.readFileSync('src/main.js','utf8');
s=rep(s,
`const projectNameInput = document.querySelector('#project-name');\nconst projectSelect = document.querySelector('#project-select');`,
`const projectNameInput = document.querySelector('#project-name');\nconst projectNameDisplay = document.querySelector('#project-name-display');\nconst renameProjectButton = document.querySelector('#rename-project');\nconst projectSelect = document.querySelector('#project-select');`,
'main project dom');

const helper=`function setProjectName(name) {\n  const normalized = String(name || '').trim() || 'Adsız Proje';\n  projectNameInput.value = normalized;\n  if (projectNameDisplay) projectNameDisplay.textContent = normalized;\n  return normalized;\n}\n\n`;
const anchor=`function setSidebarCollapsed(collapsed) {`;
if(!s.includes(anchor)) throw new Error('setProjectName anchor');
s=s.replace(anchor,helper+anchor);

s=s.replaceAll(`projectNameInput.value = projectName;`,`setProjectName(projectName);`);
s=s.replaceAll(`projectNameInput.value = project.name || 'Adsız Proje';`,`setProjectName(project.name || 'Adsız Proje');`);

const renameListener=`renameProjectButton?.addEventListener('click', async () => {\n  const currentName = projectNameInput.value.trim() || 'Adsız Proje';\n  const nextName = await requestNewProjectName(currentName);\n  if (!nextName || nextName === currentName) return;\n  setProjectName(nextName);\n  if (currentStand || autosaveEnabled) {\n    try {\n      clearAutosaveTimer();\n      await persistActiveProject({ quiet: true });\n      enableAutosaveFromCurrentState();\n      projectStatus.textContent = 'Proje adı değiştirildi ve kaydedildi: ' + nextName;\n    } catch (error) {\n      console.warn('Proje adı değiştirilemedi:', error);\n      projectStatus.textContent = 'Proje adı değiştirildi ancak kaydedilemedi.';\n    }\n  } else {\n    projectStatus.textContent = 'Proje adı hazır: ' + nextName;\n  }\n});\n\n`;
const saveAnchor=`saveProjectButton.addEventListener('click', async () => {`;
if(!s.includes(saveAnchor)) throw new Error('rename listener anchor');
s=s.replace(saveAnchor,renameListener+saveAnchor);

// hidden field no longer has keyboard interaction
s=s.replace(`projectNameInput.addEventListener('keydown', (event) => {\n  if (event.key === 'Enter') saveProjectButton.click();\n});\n\n`,``);
fs.writeFileSync('src/main.js',s);

s=fs.readFileSync('src/helpGuide.js','utf8');
s=s.replace('proje adı alanında kaydetmeyi tetikler.','proje adı popupında onaylamayı tetikler.');
fs.writeFileSync('src/helpGuide.js',s);
