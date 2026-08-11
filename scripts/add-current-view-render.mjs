import fs from 'node:fs';

// scene3d.js: capture exactly the current camera view at 2x viewport resolution.
{
  const path = 'src/scene3d.js';
  let source = fs.readFileSync(path, 'utf8');

  const returnMarker = `  return {\n    createStage,`;
  const captureFn = `  async function captureCurrentViewPng({ scale = 2 } = {}) {\n    if (!stageLayout) return { ok: false, message: 'Önce stand sahnesini oluştur.' };\n\n    const cssWidth = Math.max(1, renderer.domElement.clientWidth || container.clientWidth || 1);\n    const cssHeight = Math.max(1, renderer.domElement.clientHeight || container.clientHeight || 1);\n    const safeScale = Math.min(3, Math.max(1, Number(scale) || 2));\n    const targetWidth = Math.round(cssWidth * safeScale);\n    const targetHeight = Math.round(cssHeight * safeScale);\n    const previousPixelRatio = renderer.getPixelRatio();\n    const previousAspect = camera.aspect;\n    const selectedFrames = [...selectedSurfaces]\n      .map((surface) => surface.userData?.selectionFrame)\n      .filter(Boolean);\n    const selectedVisibility = selectedFrames.map((frame) => frame.visible);\n    const guideVisibility = activeWallGuides.map((guide) => guide.visible);\n\n    try {\n      selectedFrames.forEach((frame) => { frame.visible = false; });\n      activeWallGuides.forEach((guide) => { guide.visible = false; });\n\n      renderer.setPixelRatio(1);\n      renderer.setSize(targetWidth, targetHeight, false);\n      camera.aspect = targetWidth / targetHeight;\n      camera.updateProjectionMatrix();\n      controls.update();\n      renderer.render(scene, camera);\n\n      const blob = await new Promise((resolve) => {\n        renderer.domElement.toBlob(resolve, 'image/png');\n      });\n      if (!blob) return { ok: false, message: 'Render görüntüsü oluşturulamadı.' };\n      return { ok: true, blob, width: targetWidth, height: targetHeight };\n    } finally {\n      selectedFrames.forEach((frame, index) => { frame.visible = selectedVisibility[index]; });\n      activeWallGuides.forEach((guide, index) => { guide.visible = guideVisibility[index]; });\n      renderer.setPixelRatio(previousPixelRatio);\n      renderer.setSize(cssWidth, cssHeight, false);\n      camera.aspect = previousAspect;\n      camera.updateProjectionMatrix();\n      controls.update();\n      renderer.render(scene, camera);\n    }\n  }\n\n`;

  if (!source.includes('async function captureCurrentViewPng')) {
    if (!source.includes(returnMarker)) throw new Error('scene3d return marker not found');
    source = source.replace(returnMarker, captureFn + returnMarker);
  }

  if (!source.includes('    captureCurrentViewPng,')) {
    source = source.replace(
      `  return {\n    createStage,`,
      `  return {\n    captureCurrentViewPng,\n    createStage,`,
    );
  }
  fs.writeFileSync(path, source);
}

// index.html: render button in the viewport toolbar.
{
  const path = 'index.html';
  let source = fs.readFileSync(path, 'utf8');
  const marker = `        <div id="viewport-toolbar" class="viewport-toolbar" hidden>`;
  if (!source.includes('id="render-current-view"')) {
    source = source.replace(
      marker,
      marker + `\n          <button id="render-current-view" type="button" class="viewport-render-button">Render Al</button>`,
    );
  }
  fs.writeFileSync(path, source);
}

// style.css: compact render button.
{
  const path = 'src/style.css';
  let source = fs.readFileSync(path, 'utf8');
  if (!source.includes('.viewport-render-button')) {
    source += `\n.viewport-render-button { margin-left: auto; white-space: nowrap; font-weight: 700; }\n`;
  }
  fs.writeFileSync(path, source);
}

// main.js: download the current camera view as PNG.
{
  const path = 'src/main.js';
  let source = fs.readFileSync(path, 'utf8');
  source = source.replace(
    `const viewportToolbar = document.querySelector('#viewport-toolbar');`,
    `const viewportToolbar = document.querySelector('#viewport-toolbar');\nconst renderCurrentViewButton = document.querySelector('#render-current-view');`,
  );

  const marker = `standTypeButtons.forEach((button) => {`;
  const handler = `renderCurrentViewButton?.addEventListener('click', async () => {\n  if (!currentStand) {\n    renderWallResult('Önce stand sahnesini oluştur.', true);\n    return;\n  }\n\n  const previousText = renderCurrentViewButton.textContent;\n  renderCurrentViewButton.disabled = true;\n  renderCurrentViewButton.textContent = 'Render alınıyor…';\n  try {\n    const result = await scene3d.captureCurrentViewPng({ scale: 2 });\n    if (!result.ok || !result.blob) {\n      renderWallResult(result.message || 'Render alınamadı.', true);\n      return;\n    }\n    const projectName = (projectNameInput.value.trim() || 'fair-stand')\n      .replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ_-]+/g, '-')\n      .replace(/^-+|-+$/g, '') || 'fair-stand';\n    const url = URL.createObjectURL(result.blob);\n    const link = document.createElement('a');\n    link.href = url;\n    link.download = projectName + '-render.png';\n    document.body.appendChild(link);\n    link.click();\n    link.remove();\n    setTimeout(() => URL.revokeObjectURL(url), 1000);\n    renderWallResult('Render hazır · ' + result.width + ' × ' + result.height + ' px PNG.');\n  } catch (error) {\n    console.warn('Render alınamadı:', error);\n    renderWallResult('Render alınamadı.', true);\n  } finally {\n    renderCurrentViewButton.disabled = false;\n    renderCurrentViewButton.textContent = previousText;\n  }\n});\n\n`;
  if (!source.includes("renderCurrentViewButton?.addEventListener('click'")) {
    if (!source.includes(marker)) throw new Error('main handler marker not found');
    source = source.replace(marker, handler + marker);
  }
  fs.writeFileSync(path, source);
}
