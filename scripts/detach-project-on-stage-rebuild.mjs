import fs from 'node:fs';

const path = 'src/main.js';
let source = fs.readFileSync(path, 'utf8');

const oldBlock = `createStageButton.addEventListener('click', () => {
  const setup = readStandSetup();
  if (!setup.ok) {
    renderStageResult(setup.message, true);
    return;
  }

  if (currentModules.length) {
    const confirmed = window.confirm(
      'Stand alanı yeniden oluşturulursa mevcut duvar, panel renkleri, görselleri ve düzenlemeleri silinecek. Devam edilsin mi?',
    );
    if (!confirmed) return;
  }

  currentModules = [];
  moduleContextMenu.close();
  moduleContextMenu.closePicker();`;

const newBlock = `createStageButton.addEventListener('click', () => {
  const setup = readStandSetup();
  if (!setup.ok) {
    renderStageResult(setup.message, true);
    return;
  }

  // Rebuilding the stage while a stored/opened project is active must never mutate that
  // project's identity through autosave. Treat the rebuild as the start of a new project.
  const rebuildingStoredProject = Boolean(currentStand && autosaveEnabled);
  if (rebuildingStoredProject) {
    const currentProjectName = projectNameInput.value.trim() || 'Adsız Proje';
    const confirmed = window.confirm(
      'Sahne ve proje değiştirilecek.\\n\\n'
        + '• Açık proje: "' + currentProjectName + '" korunacak ve değiştirilmeyecek.\\n'
        + '• Mevcut duvarlar, modüller, renkler ve görsel düzenlemeleri yeni sahneye taşınmayacak.\\n'
        + '• Yeni sahne bağımsız, kaydedilmemiş bir proje olarak başlayacak.\\n\\n'
        + 'Devam edilsin mi?',
    );
    if (!confirmed) return;

    disableAutosave();
    activeProjectId = createProjectId();
    activeProjectCreatedAt = Date.now();
    projectNameInput.value = 'Adsız Proje';
    projectSelect.selectedIndex = -1;
    clearRegisteredAssets();
    projectStatus.textContent = 'Yeni proje başladı · önceki proje korunuyor.';
  } else if (currentModules.length) {
    const confirmed = window.confirm(
      'Stand alanı yeniden oluşturulursa mevcut duvar, panel renkleri, görselleri ve düzenlemeleri silinecek. Devam edilsin mi?',
    );
    if (!confirmed) return;
  }

  currentModules = [];
  moduleContextMenu.close();
  moduleContextMenu.closePicker();`;

if (!source.includes('const rebuildingStoredProject = Boolean(currentStand && autosaveEnabled);')) {
  if (!source.includes(oldBlock)) throw new Error('createStageButton block anchor not found');
  source = source.replace(oldBlock, newBlock);
  fs.writeFileSync(path, source);
}
