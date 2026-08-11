import fs from 'node:fs';

const path = 'src/main.js';
let source = fs.readFileSync(path, 'utf8');

source = source.replace(
  "let activeProjectCreatedAt = Date.now();\nconst imageAssets = new Map();",
  "let activeProjectCreatedAt = Date.now();\nlet autosaveEnabled = false;\nlet autosaveTimer = null;\nlet autosaveObservedSignature = null;\nconst AUTOSAVE_DELAY_MS = 5000;\nconst AUTOSAVE_WATCH_INTERVAL_MS = 1000;\nconst imageAssets = new Map();",
);

const snapshotMarker = `function buildProjectSnapshot() {\n  return {\n    id: activeProjectId,\n    name: projectNameInput.value.trim() || 'Adsız Proje',\n    version: 1,\n    createdAt: activeProjectCreatedAt,\n    stand: cloneProjectState(currentStand),\n    modules: cloneProjectState(currentModules),\n  };\n}\n`;

const autosaveBlock = `${snapshotMarker}\nfunction getProjectStateSignature() {\n  const snapshot = buildProjectSnapshot();\n  return JSON.stringify({\n    name: snapshot.name,\n    stand: snapshot.stand,\n    modules: snapshot.modules,\n  });\n}\n\nfunction clearAutosaveTimer() {\n  if (autosaveTimer) clearTimeout(autosaveTimer);\n  autosaveTimer = null;\n}\n\nfunction scheduleAutosave() {\n  if (!autosaveEnabled) return;\n  clearAutosaveTimer();\n  projectStatus.textContent = 'Değişiklik var · 5 sn içinde otomatik kaydedilecek…';\n  autosaveTimer = setTimeout(async () => {\n    autosaveTimer = null;\n    if (!autosaveEnabled) return;\n    projectStatus.textContent = 'Kaydediliyor…';\n    try {\n      await persistActiveProject({ quiet: true });\n      autosaveObservedSignature = getProjectStateSignature();\n      projectStatus.textContent = 'Kaydedildi · Otomatik';\n    } catch (error) {\n      console.warn('Otomatik kayıt başarısız:', error);\n      projectStatus.textContent = 'Otomatik kayıt başarısız.';\n    }\n  }, AUTOSAVE_DELAY_MS);\n}\n\nfunction enableAutosaveFromCurrentState() {\n  clearAutosaveTimer();\n  autosaveObservedSignature = getProjectStateSignature();\n  autosaveEnabled = true;\n}\n\nfunction disableAutosave() {\n  autosaveEnabled = false;\n  clearAutosaveTimer();\n  autosaveObservedSignature = null;\n}\n\nsetInterval(() => {\n  if (!autosaveEnabled) return;\n  const signature = getProjectStateSignature();\n  if (signature === autosaveObservedSignature) return;\n  autosaveObservedSignature = signature;\n  scheduleAutosave();\n}, AUTOSAVE_WATCH_INTERVAL_MS);\n`;

if (!source.includes('function scheduleAutosave()')) {
  if (!source.includes(snapshotMarker)) throw new Error('buildProjectSnapshot marker not found');
  source = source.replace(snapshotMarker, autosaveBlock);
}

source = source.replace(
  "async function restoreProject(project) {\n  if (!project) return;",
  "async function restoreProject(project) {\n  if (!project) return;\n  disableAutosave();",
);

source = source.replace(
  "  await refreshProjectList(activeProjectId);\n  projectStatus.textContent = 'Açıldı: ' + (project.name || 'Adsız Proje');\n}",
  "  await refreshProjectList(activeProjectId);\n  enableAutosaveFromCurrentState();\n  projectStatus.textContent = 'Açıldı: ' + (project.name || 'Adsız Proje');\n}",
);

source = source.replace(
  "saveProjectButton.addEventListener('click', async () => {\n  try { await persistActiveProject(); }",
  "saveProjectButton.addEventListener('click', async () => {\n  try {\n    clearAutosaveTimer();\n    await persistActiveProject();\n    enableAutosaveFromCurrentState();\n  }",
);

source = source.replace(
  "window.addEventListener('beforeunload', () => {\n  imageAssets.forEach((asset) => {",
  "window.addEventListener('beforeunload', () => {\n  disableAutosave();\n  imageAssets.forEach((asset) => {",
);

fs.writeFileSync(path, source);
