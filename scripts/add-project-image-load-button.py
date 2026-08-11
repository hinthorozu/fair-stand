from pathlib import Path

html_path = Path('index.html')
html = html_path.read_text(encoding='utf-8')
old_html = '''            <button id="open-project" type="button">Aç</button>
            <button id="delete-project" type="button" class="danger ghost">Sil</button>
'''
new_html = '''            <button id="open-project" type="button">Aç</button>
            <button id="reload-project-images" type="button">Görselleri Yükle</button>
            <button id="delete-project" type="button" class="danger ghost">Sil</button>
'''
if old_html not in html:
    raise SystemExit('index project action anchor not found')
html = html.replace(old_html, new_html, 1)
html_path.write_text(html, encoding='utf-8')

main_path = Path('src/main.js')
main = main_path.read_text(encoding='utf-8')
old_const = '''const openProjectButton = document.querySelector('#open-project');
const deleteProjectButton = document.querySelector('#delete-project');
'''
new_const = '''const openProjectButton = document.querySelector('#open-project');
const reloadProjectImagesButton = document.querySelector('#reload-project-images');
const deleteProjectButton = document.querySelector('#delete-project');
'''
if old_const not in main:
    raise SystemExit('main project button anchor not found')
main = main.replace(old_const, new_const, 1)

old_handler = '''openProjectButton.addEventListener('click', async () => {
  const projectId = projectSelect.value;
  if (!projectId) { projectStatus.textContent = 'Açılacak kayıtlı proje yok.'; return; }
  try {
    const project = await loadProject(projectId);
    if (!project) { projectStatus.textContent = 'Proje bulunamadı.'; return; }
    await restoreProject(project);
  } catch (error) { console.warn('Proje açılamadı:', error); projectStatus.textContent = 'Proje açılamadı.'; }
});

newProjectButton.addEventListener('click', () => {
'''
new_handler = '''openProjectButton.addEventListener('click', async () => {
  const projectId = projectSelect.value;
  if (!projectId) { projectStatus.textContent = 'Açılacak kayıtlı proje yok.'; return; }
  try {
    const project = await loadProject(projectId);
    if (!project) { projectStatus.textContent = 'Proje bulunamadı.'; return; }
    await restoreProject(project);
  } catch (error) { console.warn('Proje açılamadı:', error); projectStatus.textContent = 'Proje açılamadı.'; }
});

reloadProjectImagesButton.addEventListener('click', async () => {
  if (!currentStand) {
    projectStatus.textContent = 'Önce projeyi aç.';
    return;
  }

  reloadProjectImagesButton.disabled = true;
  projectStatus.textContent = 'Görseller yükleniyor…';
  try {
    await loadAssetsForActiveProject();
    rebuildWall({ resetView: false });
    projectStatus.textContent = imageAssets.size
      ? `Görseller yüklendi · ${imageAssets.size} dosya`
      : 'Bu projede kayıtlı görsel yok.';
  } catch (error) {
    console.warn('Proje görselleri yüklenemedi:', error);
    projectStatus.textContent = 'Görseller yüklenemedi.';
  } finally {
    reloadProjectImagesButton.disabled = false;
  }
});

newProjectButton.addEventListener('click', () => {
'''
if old_handler not in main:
    raise SystemExit('open project handler anchor not found')
main = main.replace(old_handler, new_handler, 1)
main_path.write_text(main, encoding='utf-8')
