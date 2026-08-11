from pathlib import Path

# index.html
path = Path('index.html')
text = path.read_text(encoding='utf-8')
text = text.replace('            <button id="reload-project-images" type="button">Görselleri Yükle</button>\n', '')
if 'id="project-loading-overlay"' not in text:
    marker = '    <script type="module" src="/src/main.js"></script>\n'
    overlay = '''    <div id="project-loading-overlay" class="project-loading-overlay" hidden aria-live="polite" aria-busy="true">\n      <div class="project-loading-card">\n        <div class="project-loading-spinner" aria-hidden="true"></div>\n        <strong>Proje yükleniyor…</strong>\n        <span>Görseller ve sahne hazırlanıyor.</span>\n      </div>\n    </div>\n'''
    if marker not in text:
        raise SystemExit('index script marker not found')
    text = text.replace(marker, overlay + marker, 1)
path.write_text(text, encoding='utf-8')

# main.js
path = Path('src/main.js')
text = path.read_text(encoding='utf-8')
text = text.replace("const reloadProjectImagesButton = document.querySelector('#reload-project-images');\n", '')
if "const projectLoadingOverlay = document.querySelector('#project-loading-overlay');" not in text:
    marker = "const projectStatus = document.querySelector('#project-status');\n"
    if marker not in text:
        raise SystemExit('projectStatus marker not found')
    text = text.replace(marker, marker + "const projectLoadingOverlay = document.querySelector('#project-loading-overlay');\n", 1)

# Remove manual reload handler if present.
start = text.find("reloadProjectImagesButton?.addEventListener('click'")
if start != -1:
    end = text.find("\n});", start)
    if end == -1:
        raise SystemExit('reload handler end not found')
    text = text[:start] + text[end + len("\n});"):]

old_open = '''openProjectButton.addEventListener('click', async () => {\n  const projectId = projectSelect.value;\n  if (!projectId) { projectStatus.textContent = 'Açılacak kayıtlı proje yok.'; return; }\n  try {\n    const project = await loadProject(projectId);\n    if (!project) { projectStatus.textContent = 'Proje bulunamadı.'; return; }\n    await restoreProject(project);\n  } catch (error) { console.warn('Proje açılamadı:', error); projectStatus.textContent = 'Proje açılamadı.'; }\n});\n'''
new_open = '''openProjectButton.addEventListener('click', async () => {\n  const projectId = projectSelect.value;\n  if (!projectId) { projectStatus.textContent = 'Açılacak kayıtlı proje yok.'; return; }\n\n  projectLoadingOverlay.hidden = false;\n  openProjectButton.disabled = true;\n  projectStatus.textContent = 'Proje yükleniyor…';\n  try {\n    const project = await loadProject(projectId);\n    if (!project) { projectStatus.textContent = 'Proje bulunamadı.'; return; }\n    await restoreProject(project);\n  } catch (error) {\n    console.warn('Proje açılamadı:', error);\n    projectStatus.textContent = 'Proje açılamadı.';\n  } finally {\n    projectLoadingOverlay.hidden = true;\n    openProjectButton.disabled = false;\n  }\n});\n'''
if old_open not in text:
    raise SystemExit('openProject handler anchor not found')
text = text.replace(old_open, new_open, 1)
path.write_text(text, encoding='utf-8')

# style.css
path = Path('src/style.css')
text = path.read_text(encoding='utf-8')
if '.project-loading-overlay' not in text:
    text += '''\n.project-loading-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 10050;\n  display: grid;\n  place-items: center;\n  background: rgba(15, 23, 42, 0.42);\n  backdrop-filter: blur(3px);\n}\n\n.project-loading-overlay[hidden] {\n  display: none;\n}\n\n.project-loading-card {\n  min-width: 240px;\n  padding: 22px 26px;\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.97);\n  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.24);\n  display: grid;\n  justify-items: center;\n  gap: 8px;\n  color: #111827;\n}\n\n.project-loading-card span {\n  font-size: 12px;\n  color: #64748b;\n}\n\n.project-loading-spinner {\n  width: 30px;\n  height: 30px;\n  border: 3px solid #dbe3ee;\n  border-top-color: #111827;\n  border-radius: 50%;\n  animation: project-loading-spin 0.8s linear infinite;\n}\n\n@keyframes project-loading-spin {\n  to { transform: rotate(360deg); }\n}\n'''
path.write_text(text, encoding='utf-8')
