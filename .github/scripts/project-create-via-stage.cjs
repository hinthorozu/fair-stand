const fs = require('fs');

function replaceOnce(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`${label} not found`);
  return source.replace(from, to);
}

// index.html: remove the standalone New button.
{
  const path = 'index.html';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(
    source,
    '            <button id="new-project" type="button">Yeni</button>\n',
    '',
    'new project button',
  );
  fs.writeFileSync(path, source);
}

// main.js: Sahneyi Oluştur becomes the new-project entry point and asks for project name.
{
  const path = 'src/main.js';
  let source = fs.readFileSync(path, 'utf8');

  source = replaceOnce(
    source,
    "const newProjectButton = document.querySelector('#new-project');\n",
    '',
    'new project const',
  );

  const createStageAnchor = "createStageButton.addEventListener('click', () => {";
  const modalFunction = [
    "function requestNewProjectName(defaultName = '') {",
    "  return new Promise((resolve) => {",
    "    const overlay = document.createElement('div');",
    "    overlay.style.cssText = 'position:fixed;inset:0;z-index:12000;background:rgba(15,23,42,.48);display:grid;place-items:center;padding:20px';",
    "    const form = document.createElement('form');",
    "    form.style.cssText = 'width:min(380px,100%);background:#fff;border-radius:14px;padding:18px;box-shadow:0 20px 60px rgba(15,23,42,.28);display:grid;gap:12px;font:500 13px/1.35 system-ui,sans-serif;color:#111827';",
    "    const title = document.createElement('strong');",
    "    title.textContent = 'Yeni Proje';",
    "    title.style.fontSize = '16px';",
    "    const description = document.createElement('span');",
    "    description.textContent = 'Sahne oluşturulmadan önce proje adını gir.';",
    "    description.style.color = '#64748b';",
    "    const label = document.createElement('label');",
    "    label.style.cssText = 'display:grid;gap:5px';",
    "    label.textContent = 'Proje adı';",
    "    const input = document.createElement('input');",
    "    input.type = 'text';",
    "    input.name = 'projectName';",
    "    input.maxLength = 120;",
    "    input.autocomplete = 'off';",
    "    input.required = true;",
    "    input.value = defaultName && defaultName !== 'Adsız Proje' ? defaultName : '';",
    "    input.placeholder = 'Örn. İstanbul Fuar Standı';",
    "    input.style.cssText = 'height:40px;padding:0 10px;border:1px solid #cbd5e1;border-radius:8px';",
    "    label.appendChild(input);",
    "    const actions = document.createElement('div');",
    "    actions.style.cssText = 'display:flex;justify-content:flex-end;gap:8px';",
    "    const cancelButton = document.createElement('button');",
    "    cancelButton.type = 'button';",
    "    cancelButton.textContent = 'İptal';",
    "    const submitButton = document.createElement('button');",
    "    submitButton.type = 'submit';",
    "    submitButton.className = 'primary';",
    "    submitButton.textContent = 'Projeyi Oluştur';",
    "    actions.append(cancelButton, submitButton);",
    "    form.append(title, description, label, actions);",
    "    overlay.appendChild(form);",
    "    document.body.appendChild(overlay);",
    "    const finish = (value) => { overlay.remove(); resolve(value); };",
    "    cancelButton.addEventListener('click', () => finish(null));",
    "    overlay.addEventListener('pointerdown', (event) => { if (event.target === overlay) finish(null); });",
    "    form.addEventListener('submit', (event) => {",
    "      event.preventDefault();",
    "      const name = input.value.trim();",
    "      if (!name) { input.focus(); return; }",
    "      finish(name);",
    "    });",
    "    input.focus();",
    "    input.select();",
    "  });",
    "}",
    "",
  ].join('\n');
  if (!source.includes(createStageAnchor)) throw new Error('create stage anchor not found');
  source = source.replace(createStageAnchor, modalFunction + createStageAnchor.replace("() => {", "async () => {"));

  const oldProjectHandling = `  // Rebuilding the stage while a stored/opened project is active must never mutate that
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
`;

  const newProjectHandling = `  if (currentStand || currentModules.length || autosaveEnabled) {
    const currentProjectName = projectNameInput.value.trim() || 'Adsız Proje';
    const confirmed = window.confirm(
      'Yeni proje oluşturulacak.\\n\\n'
        + (autosaveEnabled
          ? '• Açık kayıtlı proje: "' + currentProjectName + '" korunacak.\\n'
          : '• Mevcut kaydedilmemiş sahne ve düzenlemeler temizlenecek.\\n')
        + '• Mevcut modüller, renkler ve görseller yeni projeye taşınmayacak.\\n\\n'
        + 'Devam edilsin mi?',
    );
    if (!confirmed) return;
  }

  const projectName = await requestNewProjectName('');
  if (!projectName) return;

  disableAutosave();
  activeProjectId = createProjectId();
  activeProjectCreatedAt = Date.now();
  projectNameInput.value = projectName;
  projectSelect.selectedIndex = -1;
  clearRegisteredAssets();
  projectStatus.textContent = 'Yeni proje hazır: ' + projectName + ' · henüz kaydedilmedi.';
`;
  source = replaceOnce(source, oldProjectHandling, newProjectHandling, 'create stage project handling');

  const oldNewListener = `newProjectButton.addEventListener('click', () => {
  const confirmed = window.confirm('Yeni projeye geçilsin mi? Kaydedilmemiş değişiklikler kaybolabilir.');
  if (!confirmed) return;
  window.location.reload();
});

`;
  source = replaceOnce(source, oldNewListener, '', 'new project listener');

  fs.writeFileSync(path, source);
}

// helpGuide.js: keep user documentation aligned with the new flow.
{
  const path = 'src/helpGuide.js';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(
    source,
    '<p>Stand tipini seç, X ve Y ölçülerini gir ve <strong>Sahneyi Oluştur</strong> ile çalışmaya başla. Sonra katalogdan modül ekleyebilir, sahnedeki modülleri taşıyabilir ve panel yüzeylerini özelleştirebilirsin.</p>',
    '<p>Stand tipini seç, X ve Y ölçülerini gir ve <strong>Sahneyi Oluştur</strong> butonuna bas. Açılan küçük pencerede proje adını girdikten sonra sistem yeni ve bağımsız projeyi oluşturur. Sonra katalogdan modül ekleyebilir, sahnedeki modülleri taşıyabilir ve panel yüzeylerini özelleştirebilirsin.</p>',
    'help quick start',
  );
  source = replaceOnce(
    source,
    '<li><strong>Yeni:</strong> Yeni çalışma başlatır; kaydedilmemiş değişiklikler için uyarı verir.</li>\n',
    '<li><strong>Yeni proje:</strong> Ayrı bir “Yeni” butonu yoktur. Stand Tipi bölümündeki <strong>Sahneyi Oluştur</strong> yeni proje başlatır ve önce proje adını sorar.</li>\n',
    'help project new flow',
  );
  fs.writeFileSync(path, source);
}
