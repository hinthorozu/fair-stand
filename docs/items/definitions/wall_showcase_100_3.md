# wall_showcase_100_3 — Mevcut Sistem Profili

Bu belge `wall_showcase_100_3` için `Version2` runtime kodunda bulunan state, renderer, behavior, interaction, persistence ve BOM akışlarını toplar.

## Kimlik / factory

| Alan | Kod değeri |
|---|---|
| Catalog key | `wall_showcase_100_3` |
| Label | `3 Gözlü Vitrin 100` |
| Type | `showcase-3` |
| Width | `100 cm` |
| Eye count | `3` |

Factory `createShowcaseModuleState('showcase-3', 100)` ile **7 strip state** oluşturur. Her strip default beyaz, `imageAssetId=null`, default single image transform taşır.

## Contract

| Alan | Kod değeri |
|---|---|
| Profile | `wall-editable` |
| State owner | `src/designState.js` |
| Persistence | `project-state` |
| Color | `editable` |
| Image | `editable` |
| Renderer policy | `procedural-or-specialized` |
| Runtime | `static` |
| Composition | `standalone` |
| BOM mode | `recipe` |
| BOM source | `src/moduleRecipes.js` |

## Behavior / placement

| Alan | Kod değeri |
|---|---|
| Placement contract | `wall` |
| Move snap | `50 cm` |
| Rotation step | `90°` |
| Default rotation | `0°` |
| Side insert flag | `true` |
| Collision contract | `segment` |
| Magnetic snap | `standard` |
| Connection endpoint | `segment` |
| Collision depth | `physical` |
| Endpoint contact | `standard` |
| Boundary snap | `stand-edge` |
| Side-insert rotation | `inherit` |
| Overlap izinleri | `[]` |
| Wall-overlay host | `true` |
| Wall capacity | `include` |
| Ghost | `silhouette / module-silhouette / opacity 0.38` |

Showcase WALL behavior kullanır. Runtime placement wall veya `free` olabilir; move snap `50 cm`, rotation `90°`, wall snap `50 cm`, neighbor snap `30 cm`dir. Continuous-wall / free-side insertion ayrımı diğer wall ailesi modüllerindekiyle aynı placement motorundan gelir.

## Renderer

`createShowcaseModule()` 350 cm wall frame'i procedural oluşturur ve vitrin açıklığını strip aralığında boş bırakır.

```text
state strip count = 7
opening skipped strip indices = [1, 2, 3]
rendered editable panel strip indices = [0, 4, 5, 6]
rendered editable panel count = 4
showcase depth = 30 cm
```

Render edilen panel yüzeyleri `selectionMode = panel`, `acceptsImage = true`; color/image/glass/fabric yollarına girer. Vitrin açıklığında side/cap/front-post geometrileri eklenir.

Renderer'da yatay glass-shelf mesh döngüsü `index=1; index<eyeCount` çalışır; bu `3` gözlü varyant için **2 adet** glass-shelf mesh üretir.

Recipe tarafında `glass_shelf` adedi **3** olarak kayıtlıdır. Renderer mesh adedi ile recipe quantity kodda bu iki ayrı değerdir.

## Selection / image / cover modes

Render edilen panel yüzeylerinde tekli/range/rectangle selection, color, image, glass, Lightbox ve Mesh akışları kullanılabilir. Açıklıkta render edilmeyen strip state'leri surface olarak selection listesine girmez.

Lightbox/Mesh için tam rectangle gerekir; multi-module fabric owner grubu move/rotation kilidi oluşturabilir.

## Context menu

`moduleContextMenu.js` içindeki modül menüsü şu temel aksiyonları içerir:

```text
Sil
Çoğalt Sağ Tarafa
Çoğalt Sol Tarafa
Ekle Sağ Tarafa…
Ekle Sol Tarafa…
```

Right-click edilen yüzey `selectionMode = panel` ise ayrıca:

```text
Cam Panele Çevir / Normal Panele Çevir
Lightbox Kumaşa Çevir / Lightbox Kumaştan Çıkar
Mesh (Delikli) Brandaya Çevir / Mesh Brandadan Çıkar
Lightbox aydınlatmayı aç / kapat
```

Picker `MODULE_CATALOG_KEYS` listesinin tamamını gösterir; aynı katalog kaydı birden fazla kez seçilebilir, seçim chip'leri drag ile sıralanabilir. Sağ ekleme isteğinde picker gönderim sırasını ters çevirir; `main.js` placement yoluna göre continuous-wall veya free-side insertion planını kullanır.

`allowSideInsert` behavior alanı context menu butonlarını gizlemek için kullanılmıyor; menü HTML'inde ekleme/çoğaltma aksiyonları genel olarak bulunuyor.

## Duplicate / delete

`duplicateModuleState()` state'i JSON clone eder, yeni module `id` üretir ve varsa strip/face/surface kimliklerini yeniler. `wall_showcase_100_3` için clone edilen normal nested state alanları korunur.

Lightbox/Mesh ownership için scene rebuild sırasında `fabricGroupId` normalizasyonu yapılır. Duplicate'ın eski fabric grubuna yanlış owner olarak katılması engellenir; beklenmeyen clone yüzeylerinde fabric state temizlenebilir.

`Sil` aksiyonu hedef modülü `currentModules` listesinden çıkarıp scene'i yeniden kurar. Delete sonrası bütün duvarı otomatik compact eden genel bir çağrı yapılmaz.

Silinen modül multi-module Lightbox/Mesh owner grubunun parçasıysa rebuild sırasında eksik owner yüzey algılandığında kalan fabric ownership de çözülebilir.

## Persistence / save / load

`buildProjectSnapshot()` bütün `currentModules` dizisini JSON clone ile proje snapshot'ındaki `modules` alanına yazar. `wall_showcase_100_3` state'i placement ve nested state alanlarıyla birlikte burada saklanır.

Proje restore sırasında modüller clone edilir ve `resolveModuleCatalogKey(moduleState)` tekrar çalıştırılır. Asset'ler scene rebuild edilmeden önce yüklenir. Autosave signature `stand` ve `modules` state'ini kapsar.

ZIP export yapısı:

```text
project.json
assets/*
```

ZIP import sırasında recursive asset remap özel olarak `imageAssetId` key'ini dönüştürür. Kodun asset-reference temizleme walker'ı ise `imageAssetId` ve `fabricImageAssetId` alanlarını tanır. Bu iki akışın anahtar listesi aynı değildir.

`Tüm Özellikleri Kaldır` akışında katalog modülleri `createCatalogModuleState(module, { preservePlacement: true })` ile default state'ten yeniden oluşturulur; placement korunur, instance/surface kimlikleri ve düzenlenebilir state defaultlara döner.

## BOM / production recipe

```text
recipeId = showcase-3-100
moduleType = showcase-3
nominalWidthCm = 100
connectionMode = straight
```

| Part ID | Kod adı | Adet | Birim |
|---|---|---:|---|
| `profile_91` | Profil 91 cm | 4 | adet |
| `upright_346_5` | Dikme 346,5 cm | 2 | adet |
| `panel_98` | Panel 98 × 47 cm | 4 | adet |
| `connector_start` | Başlangıç Aparatı | 4 | adet |
| `connector_single` | Tekli Aparat | 7 | adet |
| `showcase_3_100` | 3 Gözlü Vitrin 100 cm | 1 | adet |
| `glass_shelf` | Cam Raf | 3 | adet |

Recipe metadata'sında ayrıca:

```text
variants.innerCornerPanelPartId = panel_corner_92
```

`panel_corner_92` production registry kaydı: `İç Köşe Paneli 92 × 47 cm` (widthCm=92, heightCm=47, thicknessCm=0.8). Bu part normal `recipe.items` satırlarında yer almaz.

`rawBomDebug.js` seçili modül için `getExpandedModuleRecipe()` çağırıp `recipe.items` satırlarını gösterir. Bu ekranda placement ilişkilerinden ayrıca part dönüşümü yapan bir çağrı yoktur.

## Catalog sidebar / selection feedback

`moduleDragSidebar.js` içinde `wall_showcase_100_3` katalog grubu **Raf & Vitrin** altında yer alır. Catalog card drag akışı `Shift+R` ile behavior rotation step'ini kullanır; ghost/placement preview `scene3d.previewCatalogModuleDrag()` yoluna gider.

`selectionFeedback.js` bu Item için kullanıcıya şu bilgi sınıfını üretir: `3 Gözlü Vitrin 100 cm · alttan <strip>. panel · renk + görsel uygulanabilir.`

## Kod kaynakları

- `src/catalog.js`
- `src/designState.js`
- `src/moduleContracts.js`
- `src/moduleBehavior.js`
- `src/modulePlacement.js`
- `src/scene3d.js`
- `src/rectSelection.js`
- `src/moduleContextMenu.js`
- `src/main.js`
- `src/moduleRecipes.js`
- `src/productionParts.js`
