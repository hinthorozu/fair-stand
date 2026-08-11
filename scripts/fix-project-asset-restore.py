from pathlib import Path

path = Path('src/main.js')
text = path.read_text(encoding='utf-8')

old_start = """  currentModules = cloneProjectState(project.modules) || [];
  currentStand = cloneProjectState(project.stand);
  moduleContextMenu.close();
  moduleContextMenu.closePicker();

  if (currentStand) {
"""
new_start = """  currentModules = cloneProjectState(project.modules) || [];
  currentStand = cloneProjectState(project.stand);
  moduleContextMenu.close();
  moduleContextMenu.closePicker();

  // Project image URLs must exist before the scene is rebuilt.
  // Otherwise stored imageAssetId values cannot resolve on the first open.
  await loadAssetsForActiveProject();

  if (currentStand) {
"""

if old_start not in text:
    raise SystemExit('restoreProject start anchor not found')
text = text.replace(old_start, new_start, 1)

old_end = """  await loadAssetsForActiveProject();
  await refreshProjectList(activeProjectId);
"""
new_end = """  await refreshProjectList(activeProjectId);
"""

if old_end not in text:
    raise SystemExit('restoreProject end anchor not found')
text = text.replace(old_end, new_end, 1)

path.write_text(text, encoding='utf-8')
