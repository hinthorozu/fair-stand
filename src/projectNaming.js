export function normalizeProjectName(name) {
  return String(name || '').trim() || 'Adsız Proje';
}

export function buildAutomaticProjectNameSuffix(standType, xCm, yCm) {
  const typePrefix = {
    'l-left': 'L_Sol',
    'l-right': 'L_Sag',
    'u-stand': 'U',
    island: 'Ada',
    'back-wall': 'Sirt',
  }[standType] || 'Stand';
  return `${typePrefix}_${Math.round(Number(xCm) || 0)}_${Math.round(Number(yCm) || 0)}`;
}

export function getEditableProjectName(fullName, suffix = '') {
  const name = String(fullName || '').trim();
  if (!suffix) return name;
  for (const separator of ['-', '_']) {
    const tail = separator + suffix;
    if (name.endsWith(tail)) return name.slice(0, -tail.length);
  }
  return name;
}

export function createProjectNamingController({
  documentRef = globalThis.document,
  projectNameInput,
  projectNameDisplay,
} = {}) {
  function setProjectName(name) {
    const normalized = normalizeProjectName(name);
    if (projectNameInput) projectNameInput.value = normalized;
    if (projectNameDisplay) projectNameDisplay.textContent = normalized;
    return normalized;
  }

  function requestProjectName({ defaultName = '', mode = 'create', suffix = '' } = {}) {
    if (!documentRef?.createElement || !documentRef?.body) {
      throw new Error('Project naming dialog requires a DOM document.');
    }

    return new Promise((resolve) => {
      const overlay = documentRef.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:12000;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px';
      const form = documentRef.createElement('form');
      form.style.cssText = 'width:min(380px,100%);background:#fff;border-radius:14px;padding:18px;box-shadow:0 20px 60px rgba(15,23,42,.28);display:grid;gap:12px;font:500 13px/1.35 system-ui,sans-serif;color:#111827';
      const title = documentRef.createElement('strong');
      const isRename = mode === 'rename';
      title.textContent = isRename ? 'Proje Adını Değiştir' : 'Yeni Proje';
      title.style.fontSize = '16px';
      const description = documentRef.createElement('span');
      description.textContent = isRename
        ? 'Mevcut proje için yeni adı gir.'
        : 'Stand adını gir; proje adı stand tipi ve ölçülerle otomatik oluşturulacak.';
      description.style.color = '#64748b';
      const label = documentRef.createElement('label');
      label.style.cssText = 'display:grid;gap:5px';
      label.textContent = isRename ? 'Proje adı' : 'Stand adı';
      const input = documentRef.createElement('input');
      input.type = 'text';
      input.name = 'projectName';
      input.maxLength = 120;
      input.autocomplete = 'off';
      input.required = true;
      input.value = defaultName && defaultName !== 'Adsız Proje' ? defaultName : '';
      input.placeholder = isRename ? 'Örn. İstanbul Fuar Standı' : 'Örn. Ferromet';
      const preview = documentRef.createElement('span');
      if (suffix) {
        preview.style.cssText = 'font-weight:700;color:#334155;word-break:break-word';
        const updatePreview = () => {
          const standName = input.value.trim().replace(/\s+/g, '_');
          preview.textContent = 'Proje adı: ' + (standName || '[Proje_adi]') + '-' + suffix;
        };
        input.addEventListener('input', updatePreview);
        updatePreview();
        label.appendChild(preview);
      }
      input.style.cssText = 'height:40px;padding:0 10px;border:1px solid #cbd5e1;border-radius:8px';
      label.appendChild(input);
      const actions = documentRef.createElement('div');
      actions.style.cssText = 'display:flex;justify-content:flex-end;gap:8px';
      const cancelButton = documentRef.createElement('button');
      cancelButton.type = 'button';
      cancelButton.textContent = 'İptal';
      const submitButton = documentRef.createElement('button');
      submitButton.type = 'submit';
      submitButton.className = 'primary';
      submitButton.textContent = isRename ? 'Kaydet' : 'Projeyi Oluştur';
      actions.append(cancelButton, submitButton);
      form.append(title, description, label, actions);
      overlay.appendChild(form);
      documentRef.body.appendChild(overlay);
      const finish = (value) => { overlay.remove(); resolve(value); };
      cancelButton.addEventListener('click', () => finish(null));
      overlay.addEventListener('pointerdown', (event) => { if (event.target === overlay) finish(null); });
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = input.value.trim();
        if (!name) { input.focus(); return; }
        const normalizedName = name.replace(/\s+/g, '_');
        const finalName = suffix ? normalizedName + '-' + suffix : normalizedName;
        finish(finalName);
      });
      input.focus();
      input.select();
    });
  }

  return Object.freeze({ setProjectName, requestProjectName });
}
