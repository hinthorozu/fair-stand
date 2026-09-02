const fs = require('fs');

function replaceOnce(s, from, to, label) {
  if (!s.includes(from)) throw new Error(`${label} not found`);
  return s.replace(from, to);
}

// designState.js
{
  const p = 'src/designState.js';
  let s = fs.readFileSync(p, 'utf8');
  s = replaceOnce(
    s,
    "    wallGapCm: 1.5,\n  };\n}\n\nexport function createTvModuleState",
    "    wallGapCm: 1.5,\n    haloColor: /^#[0-9a-fA-F]{6}$/.test(String(descriptor.haloColor ?? ''))\n      ? String(descriptor.haloColor).toLowerCase()\n      : '#ffffff',\n  };\n}\n\nexport function createTvModuleState",
    'foam halo state',
  );
  fs.writeFileSync(p, s);
}

// index.html
{
  const p = 'index.html';
  let s = fs.readFileSync(p, 'utf8');
  s = replaceOnce(
    s,
    '          <div class="section-divider"></div>\n          <label for="surface-image">Görsel arşivine ekle</label>',
    '          <div id="foam-light-controls" hidden>\n            <div class="section-divider"></div>\n            <label for="foam-light-color">Işıklı Strafor · Işık rengi</label>\n            <div class="row"><input id="foam-light-color" type="color" value="#ffffff" /><span class="muted">Sadece arka halo</span></div>\n          </div>\n          <div class="section-divider"></div>\n          <label for="surface-image">Görsel arşivine ekle</label>',
    'foam light controls html',
  );
  fs.writeFileSync(p, s);
}

// scene3d.js
{
  const p = 'src/scene3d.js';
  let s = fs.readFileSync(p, 'utf8');
  s = replaceOnce(
    s,
    '      const scale = Math.min(widthM / size.x, heightM / size.y);\n      raw.scale.set(scale, -scale, 1);\n      raw.position.set(-center.x * scale, center.y * scale, 0);',
    '      const scaleX = widthM / size.x;\n      const scaleY = heightM / size.y;\n      raw.scale.set(scaleX, -scaleY, 1);\n      raw.position.set(-center.x * scaleX, center.y * scaleY, 0);',
    'exact foam XY scale',
  );
  s = replaceOnce(
    s,
    "        const halo = new THREE.Mesh(new THREE.PlaneGeometry(widthM * 1.10, heightM * 1.18), new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:0.72,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));\n        halo.position.set(0,0,-Math.max(0.004,wallGapM*0.68));\n        halo.raycast=()=>{};\n        visualRoot.add(halo);",
    "        const haloMaterial = new THREE.MeshBasicMaterial({map:texture,color:new THREE.Color(moduleState.haloColor || '#ffffff'),transparent:true,opacity:0.72,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});\n        const halo = new THREE.Mesh(new THREE.PlaneGeometry(widthM * 1.10, heightM * 1.18), haloMaterial);\n        halo.position.set(0,0,-Math.max(0.004,wallGapM*0.68));\n        halo.raycast=()=>{};\n        halo.userData.role = 'illuminated-foam-halo';\n        halo.userData.moduleId = moduleState.id;\n        visualRoot.add(halo);",
    'foam halo material',
  );
  const returnNeedle = "    getSelectedFloorType: () => (floorSelected ? currentFloorType : null),\n  };";
  s = replaceOnce(
    s,
    returnNeedle,
    "    getSelectedFloorType: () => (floorSelected ? currentFloorType : null),\n    setIlluminatedFoamHaloColor: (moduleId, color) => {\n      const normalized = String(color ?? '').trim().toLowerCase();\n      if (!/^#[0-9a-f]{6}$/.test(normalized)) return false;\n      let changed = false;\n      wallRoot.traverse((object) => {\n        if (object.userData?.role !== 'illuminated-foam-halo') return;\n        if (object.userData?.moduleId !== moduleId) return;\n        if (object.material?.color) {\n          object.material.color.set(normalized);\n          object.material.needsUpdate = true;\n          changed = true;\n        }\n      });\n      return changed;\n    },\n  };",
    'scene return halo setter',
  );
  fs.writeFileSync(p, s);
}

// main.js
{
  const p = 'src/main.js';
  let s = fs.readFileSync(p, 'utf8');
  s = replaceOnce(
    s,
    "const colorCmykInputs = {\n  c: document.querySelector('#color-c'),\n  m: document.querySelector('#color-m'),\n  y: document.querySelector('#color-y'),\n  k: document.querySelector('#color-k'),\n};",
    "const colorCmykInputs = {\n  c: document.querySelector('#color-c'),\n  m: document.querySelector('#color-m'),\n  y: document.querySelector('#color-y'),\n  k: document.querySelector('#color-k'),\n};\nconst foamLightControls = document.querySelector('#foam-light-controls');\nconst foamLightColorInput = document.querySelector('#foam-light-color');",
    'foam main dom constants',
  );
  s = replaceOnce(
    s,
    'let assetContextAssetId = null;\n',
    'let assetContextAssetId = null;\nlet selectedFoamModuleId = null;\n',
    'selected foam state',
  );
  // Reset foam controls at every selection callback before branching.
  s = replaceOnce(
    s,
    "  (surfaces) => {\n    if (!surfaces?.length) {",
    "  (surfaces) => {\n    selectedFoamModuleId = null;\n    if (foamLightControls) foamLightControls.hidden = true;\n    if (!surfaces?.length) {",
    'selection reset foam controls',
  );
  s = replaceOnce(
    s,
    "      if (moduleType === 'illuminated-foam') {\n        const foamState = currentModules[moduleIndex];\n        selectionInfo.textContent = `Modül ${moduleIndex + 1} · Işıklı Strafor · ${Number(foamState?.depthCm) || 3.5} cm kalınlık · duvardan ${Number(foamState?.wallGapCm) || 1.5} cm boşluk.`;\n        return;\n      }",
    "      if (moduleType === 'illuminated-foam') {\n        const foamState = currentModules[moduleIndex];\n        selectedFoamModuleId = foamState?.id ?? null;\n        if (foamLightControls) foamLightControls.hidden = false;\n        if (foamLightColorInput) foamLightColorInput.value = foamState?.haloColor || '#ffffff';\n        selectionInfo.textContent = `Modül ${moduleIndex + 1} · Işıklı Strafor · ${Number(foamState?.widthCm) || 0} × ${Number(foamState?.heightCm) || 0} cm · ${Number(foamState?.depthCm) || 3.5} cm kalınlık · ışık ${foamState?.haloColor || '#ffffff'}.`;\n        return;\n      }",
    'foam selection info',
  );

  const beginNeedle = "async function beginIlluminatedFoamAssetDrag(assetId) {";
  const modalFn = `function requestIlluminatedFoamDimensions(defaultWidthCm, defaultHeightCm) {\n  return new Promise((resolve) => {\n    const overlay = document.createElement('div');\n    overlay.style.cssText = 'position:fixed;inset:0;z-index:12000;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px';\n    const form = document.createElement('form');\n    form.style.cssText = 'width:min(360px,100%);background:#fff;border-radius:14px;padding:18px;box-shadow:0 20px 60px rgba(15,23,42,.28);display:grid;gap:12px;font:500 13px/1.35 system-ui,sans-serif;color:#111827';\n    form.innerHTML = \\`<strong style="font-size:16px">Işıklı Strafor Ölçüsü</strong><span style="color:#64748b">Gerçek dış ölçüyü cm olarak gir.</span><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label style="display:grid;gap:5px">X · Genişlik (cm)<input name="width" type="number" min="10" max="5000" step="1" value="\${Math.round(defaultWidthCm)}" required style="height:38px;padding:0 9px;border:1px solid #cbd5e1;border-radius:8px"></label><label style="display:grid;gap:5px">Y · Yükseklik (cm)<input name="height" type="number" min="5" max="350" step="1" value="\${Math.round(defaultHeightCm)}" required style="height:38px;padding:0 9px;border:1px solid #cbd5e1;border-radius:8px"></label></div><span style="color:#64748b">Gövde: 3,5 cm · Duvar boşluğu: 1,5 cm</span><div style="display:flex;justify-content:flex-end;gap:8px"><button type="button" data-cancel>İptal</button><button type="submit" class="primary">Yerleştir</button></div>\\`;\n    overlay.appendChild(form);\n    document.body.appendChild(overlay);\n    const finish = (value) => { overlay.remove(); resolve(value); };\n    form.querySelector('[data-cancel]').addEventListener('click', () => finish(null));\n    overlay.addEventListener('pointerdown', (event) => { if (event.target === overlay) finish(null); });\n    form.addEventListener('submit', (event) => {\n      event.preventDefault();\n      const data = new FormData(form);\n      const widthCm = Number(data.get('width'));\n      const heightCm = Number(data.get('height'));\n      if (!(widthCm >= 10 && widthCm <= 5000 && heightCm >= 5 && heightCm <= 350)) return;\n      finish({ widthCm, heightCm });\n    });\n    form.querySelector('input[name="width"]')?.focus();\n  });\n}\n\n`;
  if (!s.includes(beginNeedle)) throw new Error('begin foam drag function not found');
  s = s.replace(beginNeedle, modalFn + beginNeedle);

  s = replaceOnce(
    s,
    "  const aspect = Math.max(0.1, getSvgAspectRatioFromText(svgText));\n  const widthCm = 200;\n  const heightCm = Math.max(10, widthCm / aspect);\n  const moduleState = createIlluminatedFoamModuleState(asset.id, { widthCm, heightCm });",
    "  const aspect = Math.max(0.1, getSvgAspectRatioFromText(svgText));\n  const defaultWidthCm = 200;\n  const defaultHeightCm = Math.max(10, defaultWidthCm / aspect);\n  const dimensions = await requestIlluminatedFoamDimensions(defaultWidthCm, defaultHeightCm);\n  if (!dimensions) {\n    assetStatus.textContent = 'Işıklı Strafor oluşturma iptal edildi.';\n    return false;\n  }\n  const moduleState = createIlluminatedFoamModuleState(asset.id, {\n    widthCm: dimensions.widthCm,\n    heightCm: dimensions.heightCm,\n    haloColor: '#ffffff',\n  });",
    'foam dimensions conversion',
  );
  s = replaceOnce(
    s,
    "    assetStatus.textContent = 'Işıklı Strafor sahneye eklendi · 3,5 cm kalınlık · 1,5 cm ışık boşluğu.';",
    "    assetStatus.textContent = `Işıklı Strafor sahneye eklendi · ${moduleState.widthCm} × ${moduleState.heightCm} cm · 3,5 cm kalınlık · 1,5 cm ışık boşluğu.`;",
    'foam add status',
  );

  const listenerAnchor = "assetContextMenu.querySelector('[data-asset-action=\"illuminated-foam\"]').addEventListener('click', () => {";
  const colorListener = `foamLightColorInput?.addEventListener('input', () => {\n  if (!selectedFoamModuleId) return;\n  const moduleState = currentModules.find((module) => module.id === selectedFoamModuleId);\n  if (!moduleState || moduleState.type !== 'illuminated-foam') return;\n  const color = String(foamLightColorInput.value || '#ffffff').toLowerCase();\n  moduleState.haloColor = color;\n  scene3d.setIlluminatedFoamHaloColor?.(moduleState.id, color);\n  const moduleIndex = currentModules.indexOf(moduleState);\n  selectionInfo.textContent = \\`Modül \${moduleIndex + 1} · Işıklı Strafor · \${moduleState.widthCm} × \${moduleState.heightCm} cm · \${moduleState.depthCm || 3.5} cm kalınlık · ışık \${color}.\\`;\n});\n\n`;
  if (!s.includes(listenerAnchor)) throw new Error('asset foam listener anchor not found');
  s = s.replace(listenerAnchor, colorListener + listenerAnchor);

  fs.writeFileSync(p, s);
}
