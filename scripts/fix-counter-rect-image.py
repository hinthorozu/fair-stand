from pathlib import Path

path = Path('src/main.js')
text = path.read_text(encoding='utf-8')

old = """  const allCounterPanels = selected.every(
    (surface) => surface.userData.moduleType === 'counter',
  );
  if (allCounterPanels) {
    scene3d.applyImageAsset(selected, activeAssetId, fit);
    const fitLabel = fit === 'cover' ? 'Doldur' : 'Sığdır';
    selectionInfo.textContent = `${selected.length} banko paneline görsel uygulandı · ${fitLabel}.`;
    return true;
  }

  const result = scene3d.applyRectImageAsset(selected, activeAssetId, fit);
"""

new = """  const allCounterPanels = selected.every(
    (surface) => surface.userData.moduleType === 'counter',
  );
  if (allCounterPanels) {
    const panelsByFace = new Map();
    selected.forEach((surface) => {
      const face = surface.userData.surfaceRole ?? 'front';
      if (!panelsByFace.has(face)) panelsByFace.set(face, []);
      panelsByFace.get(face).push(surface);
    });

    let appliedPanelCount = 0;
    for (const panels of panelsByFace.values()) {
      const faceResult = scene3d.applyRectImageAsset(panels, activeAssetId, fit);
      if (!faceResult.ok) {
        selectionInfo.textContent = faceResult.message;
        return false;
      }
      appliedPanelCount += faceResult.panelCount ?? panels.length;
    }

    const fitLabel = fit === 'cover' ? 'Doldur' : 'Sığdır';
    selectionInfo.textContent = `${panelsByFace.size} banko cephesinde ${appliedPanelCount} panele tek parça görsel · ${fitLabel}.`;
    return true;
  }

  const result = scene3d.applyRectImageAsset(selected, activeAssetId, fit);
"""

if old not in text:
    raise SystemExit('counter image special-case anchor not found')

path.write_text(text.replace(old, new, 1), encoding='utf-8')
