const fs = require('fs');

function replaceOnce(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`${label} not found`);
  return source.replace(from, to);
}

{
  const path = 'src/main.js';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(
    source,
    "  clearRegisteredAssets();\n  projectStatus.textContent = 'Yeni proje hazır: ' + projectName + ' · henüz kaydedilmedi.';\n\n  currentModules = [];",
    "  clearRegisteredAssets();\n  projectStatus.textContent = 'Yeni proje hazırlanıyor: ' + projectName + '…';\n\n  currentModules = [];",
    'new project pre-save status',
  );
  source = replaceOnce(
    source,
    "  renderStageResult(\n    `${label} · ${setup.xCm} × ${setup.yCm} cm aktif alan · ${setup.sceneWidthM} × ${setup.sceneDepthM} m toplam sahne`,\n  );\n});",
    "  renderStageResult(\n    `${label} · ${setup.xCm} × ${setup.yCm} cm aktif alan · ${setup.sceneWidthM} × ${setup.sceneDepthM} m toplam sahne`,\n  );\n\n  try {\n    await persistActiveProject({ quiet: true });\n    enableAutosaveFromCurrentState();\n    projectStatus.textContent = 'Oluşturuldu ve kaydedildi: ' + projectName;\n  } catch (error) {\n    console.warn('Yeni proje ilk kayıt sırasında kaydedilemedi:', error);\n    disableAutosave();\n    projectStatus.textContent = 'Proje oluşturuldu ancak kaydedilemedi.';\n  }\n});",
    'stage initial project save',
  );
  fs.writeFileSync(path, source);
}

{
  const path = 'src/helpGuide.js';
  let source = fs.readFileSync(path, 'utf8');
  source = replaceOnce(
    source,
    '<p>Stand tipini seç, X ve Y ölçülerini gir ve <strong>Sahneyi Oluştur</strong> butonuna bas. Açılan küçük pencerede proje adını girdikten sonra sistem yeni ve bağımsız projeyi oluşturur. Sonra katalogdan modül ekleyebilir, sahnedeki modülleri taşıyabilir ve panel yüzeylerini özelleştirebilirsin.</p>',
    '<p>Stand tipini seç, X ve Y ölçülerini gir ve <strong>Sahneyi Oluştur</strong> butonuna bas. Açılan küçük pencerede proje adını girdikten sonra sistem yeni ve bağımsız projeyi oluşturur ve ilk kaydı otomatik olarak yapar. Sonra katalogdan modül ekleyebilir, sahnedeki modülleri taşıyabilir ve panel yüzeylerini özelleştirebilirsin.</p>',
    'quick start auto save help',
  );
  source = replaceOnce(
    source,
    '<div class="help-guide-callout"><strong>Temel akış:</strong> Sahne oluştur → Modül ekle → Yerleştir → Panel seç → Renk / görsel / cam / Lightbox / Mesh uygula → Kaydet veya Render Al.</div>',
    '<div class="help-guide-callout"><strong>Temel akış:</strong> Sahne oluştur + proje adını gir → Proje otomatik kaydedilir → Modül ekle → Yerleştir → Panel seç → Renk / görsel / cam / Lightbox / Mesh uygula → Render Al.</div>',
    'quick flow auto save help',
  );
  fs.writeFileSync(path, source);
}
