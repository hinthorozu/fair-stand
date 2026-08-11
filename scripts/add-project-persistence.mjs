import fs from 'node:fs';

// index.html: add project controls at the top of the sidebar.
{
  const path = 'index.html';
  let source = fs.readFileSync(path, 'utf8');
  const marker = '        <section class="panel-card stand-setup-card">';
  const block = `        <section class="panel-card project-card">\n          <h2>Proje</h2>\n          <label for="project-name">Proje adı</label>\n          <input id="project-name" type="text" value="Adsız Proje" maxlength="120" autocomplete="off" />\n          <label for="project-select">Kayıtlı projeler</label>\n          <select id="project-select"><option value="">Kayıtlı proje yok</option></select>\n          <div class="project-actions">\n            <button id="new-project" type="button">Yeni</button>\n            <button id="save-project" type="button" class="primary">Kaydet</button>\n            <button id="open-project" type="button">Aç</button>\n            <button id="delete-project" type="button" class="danger ghost">Sil</button>\n          </div>\n          <p id="project-status" class="status">Aktif proje henüz kaydedilmedi.</p>\n        </section>\n\n`;
  if (!source.includes('id="project-name"')) source = source.replace(marker, block + marker);
  fs.writeFileSync(path, source);
}

// style.css: small project control layout.
{
  const path = 'src/style.css';
  let source = fs.readFileSync(path, 'utf8');
  if (!source.includes('.project-actions')) {
    source += `\n.project-card input, .project-card select { width: 100%; }\n.project-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }\n.project-actions button { width: 100%; }\n`;
  }
  fs.writeFileSync(path, source);
}

// main.js: wire project-scoped assets and project lifecycle.
{
  const path = 'src/main.js';
  let source = fs.readFileSync(path, 'utf8');
  source = source.replace(
    "import { loadImageAssets, saveImageAsset } from './assetStore.js';",
    "import { deleteProjectImageAssets, loadImageAssets, saveImageAsset } from './assetStore.js';\nimport { createProjectId, deleteProject, listProjects, loadProject, saveProject } from './projectStore.js';",
  );

  source = source.replace(
    "const assetStatus = document.querySelector('#asset-status');",
    "const assetStatus = document.querySelector('#asset-status');\nconst projectNameInput = document.querySelector('#project-name');\nconst projectSelect = document.querySelector('#project-select');\nconst newProjectButton = document.querySelector('#new-project');\nconst saveProjectButton = document.querySelector('#save-project');\nconst openProjectButton = document.querySelector('#open-project');\nconst deleteProjectButton = document.querySelector('#delete-project');\nconst projectStatus = document.querySelector('#project-status');",
  );

  source = source.replace(
    "let moduleDragSidebar = null;\nconst imageAssets = new Map();",
    "let moduleDragSidebar = null;\nlet activeProjectId = createProjectId();\nlet activeProjectCreatedAt = Date.now();\nconst imageAssets = new Map();",
  );

  const beforeAsset = 'function registerAsset(asset) {';
  const projectFns = `function cloneProjectState(value) {\n  return value == null ? value : JSON.parse(JSON.stringify(value));\n}\n\nfunction clearRegisteredAssets() {\n  imageAssets.forEach((asset) => { if (asset.url) URL.revokeObjectURL(asset.url); });\n  imageAssets.clear();\n  activeAssetId = null;\n  renderAssetLibrary();\n  assetStatus.textContent = 'Görsel seçilmedi.';\n}\n\nfunction buildProjectSnapshot() {\n  return {\n    id: activeProjectId,\n    name: projectNameInput.value.trim() || 'Adsız Proje',\n    version: 1,\n    createdAt: activeProjectCreatedAt,\n    stand: cloneProjectState(currentStand),\n    modules: cloneProjectState(currentModules),\n  };\n}\n\nasync function refreshProjectList(selectedId = activeProjectId) {\n  const projects = await listProjects();\n  projectSelect.innerHTML = '';\n  if (!projects.length) {\n    const option = document.createElement('option');\n    option.value = '';\n    option.textContent = 'Kayıtlı proje yok';\n    projectSelect.appendChild(option);\n    return projects;\n  }\n  projects.forEach((project) => {\n    const option = document.createElement('option');\n    option.value = project.id;\n    option.textContent = project.name || 'Adsız Proje';\n    projectSelect.appendChild(option);\n  });\n  if (projects.some((project) => project.id === selectedId)) projectSelect.value = selectedId;\n  return projects;\n}\n\nasync function loadAssetsForActiveProject() {\n  clearRegisteredAssets();\n  const assets = await loadImageAssets(activeProjectId);\n  assets.forEach(registerAsset);\n  if (assets.length) setActiveAsset(assets.at(-1).id);\n  else renderAssetLibrary();\n}\n\nasync function persistActiveProject({ quiet = false } = {}) {\n  const stored = await saveProject(buildProjectSnapshot());\n  activeProjectCreatedAt = stored.createdAt;\n  await refreshProjectList(stored.id);\n  if (!quiet) projectStatus.textContent = 'Kaydedildi: ' + stored.name;\n  return stored;\n}\n\nasync function restoreProject(project) {\n  if (!project) return;\n  activeProjectId = project.id;\n  activeProjectCreatedAt = Number(project.createdAt) || Date.now();\n  projectNameInput.value = project.name || 'Adsız Proje';\n  currentModules = cloneProjectState(project.modules) || [];\n  currentStand = cloneProjectState(project.stand);\n  moduleContextMenu.close();\n  moduleContextMenu.closePicker();\n\n  if (currentStand) {\n    selectedStandType = currentStand.standType;\n    standTypeButtons.forEach((button) => {\n      button.setAttribute('aria-pressed', String(button.dataset.standType === selectedStandType));\n    });\n    standSizeXInput.value = String(currentStand.xCm);\n    standSizeYInput.value = String(currentStand.yCm);\n    floorTypeSelect.value = currentStand.floorType || 'karolaj';\n    const stage = scene3d.createStage({\n      widthCm: currentStand.xCm,\n      depthCm: currentStand.yCm,\n      standType: currentStand.standType,\n      resetView: true,\n    });\n    if (!stage.ok) throw new Error(stage.message || 'Proje sahnesi oluşturulamadı.');\n    scene3d.setFloorType(currentStand.floorType || 'karolaj');\n    if (currentStand.floorColor) scene3d.setFloorColor(currentStand.floorColor);\n    syncWallLengthFromSetup(currentStand);\n    viewportEmpty.hidden = true;\n    viewportToolbar.hidden = false;\n    setStandEditingEnabled(true);\n    rebuildWall({ resetView: true });\n    updateStageCreateState();\n  } else {\n    currentModules = [];\n    selectedStandType = null;\n    standTypeButtons.forEach((button) => button.setAttribute('aria-pressed', 'false'));\n    standSizeXInput.value = '';\n    standSizeYInput.value = '';\n    setStandEditingEnabled(false);\n    updateStageCreateState();\n  }\n\n  await loadAssetsForActiveProject();\n  await refreshProjectList(activeProjectId);\n  projectStatus.textContent = 'Açıldı: ' + (project.name || 'Adsız Proje');\n}\n\n`;
  if (!source.includes('function buildProjectSnapshot()')) source = source.replace(beforeAsset, projectFns + beforeAsset);

  source = source.replace('const assets = await loadImageAssets();', 'const assets = await loadImageAssets(activeProjectId);');
  source = source.replace('const asset = await saveImageAsset(file);', 'const asset = await saveImageAsset(activeProjectId, file);');

  const listenerMarker = "fillImageButton.addEventListener('click', () => {";
  const projectListeners = `saveProjectButton.addEventListener('click', async () => {\n  try { await persistActiveProject(); }\n  catch (error) { console.warn('Proje kaydedilemedi:', error); projectStatus.textContent = 'Proje kaydedilemedi.'; }\n});\n\nopenProjectButton.addEventListener('click', async () => {\n  const projectId = projectSelect.value;\n  if (!projectId) { projectStatus.textContent = 'Açılacak kayıtlı proje yok.'; return; }\n  try {\n    const project = await loadProject(projectId);\n    if (!project) { projectStatus.textContent = 'Proje bulunamadı.'; return; }\n    await restoreProject(project);\n  } catch (error) { console.warn('Proje açılamadı:', error); projectStatus.textContent = 'Proje açılamadı.'; }\n});\n\nnewProjectButton.addEventListener('click', () => {\n  const confirmed = window.confirm('Yeni projeye geçilsin mi? Kaydedilmemiş değişiklikler kaybolabilir.');\n  if (!confirmed) return;\n  window.location.reload();\n});\n\ndeleteProjectButton.addEventListener('click', async () => {\n  const projectId = projectSelect.value;\n  if (!projectId) return;\n  const projects = await listProjects();\n  const project = projects.find((item) => item.id === projectId);\n  const confirmed = window.confirm((project?.name || 'Proje') + ' ve bu projeye ait tüm görseller silinecek. Devam edilsin mi?');\n  if (!confirmed) return;\n  try {\n    await deleteProjectImageAssets(projectId);\n    await deleteProject(projectId);\n    if (projectId === activeProjectId) { window.location.reload(); return; }\n    await refreshProjectList();\n    projectStatus.textContent = 'Proje silindi.';\n  } catch (error) { console.warn('Proje silinemedi:', error); projectStatus.textContent = 'Proje silinemedi.'; }\n});\n\nprojectNameInput.addEventListener('keydown', (event) => {\n  if (event.key === 'Enter') saveProjectButton.click();\n});\n\n`;
  if (!source.includes("saveProjectButton.addEventListener('click'")) source = source.replace(listenerMarker, projectListeners + listenerMarker);

  source = source.replace(
    'initializeAssetLibrary();',
    "initializeAssetLibrary();\nrefreshProjectList().catch((error) => console.warn('Proje listesi açılamadı:', error));",
  );

  fs.writeFileSync(path, source);
}
