# DOOR_100 — Mevcut Sistem Profili

Bu belge `DOOR_100` için `Version2` runtime kodunda bulunan bütün ana akışları toplar.

## Kimlik / state

| Alan | Kod değeri |
|---|---|
| Catalog key | `DOOR_100` |
| Label | `Depo Kapısı 100` |
| Type | `door` |
| Width | `100 cm` |
| Total wall height | `350 cm` |
| Door leaf height | `200 cm` |

Factory state:

```text
id = generated
type = door
widthCm = 100
strips = 3 editable states with stripIndex 4,5,6
surface = independent editable door-leaf state
catalogKey = DOOR_100
```

Door leaf ve üç üst panel default beyaz, imageAssetId null ve default single transform taşır.

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

Door WALL behavior kullanır; runtime wall/free placement mümkündür. Move snap 50 cm, rotation 90°; continuous-wall/free-side insertion akışlarına dahildir.

## Renderer

`createDoorModule()` 350 cm frame oluşturur. Alt `4 × 50 cm = 200 cm` bölüm kapalı kapı kanadıdır; sahne düzleminden açılan animasyon/hinge hareketi yoktur.

Renderer alt + üst rail oluşturur; ara yatay rail oluşturmaz. Kapı kolu procedural geometri olarak eklenir.

Selection:

- door leaf `surface`: `selectionMode=module`, `acceptsImage=true`; color/image alabilir, glass/fabric context'i açmaz.
- üst üç panel: state stripIndex `4,5,6`; renderer context'te bunları panel 1/2/3 olarak sunar, `selectionMode=panel`; color/image/glass/Lightbox/Mesh akışına girebilir.

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

`duplicateModuleState()` state'i JSON clone eder, yeni module `id` üretir ve varsa strip/face/surface kimliklerini yeniler. `DOOR_100` için clone edilen normal nested state alanları korunur.

Lightbox/Mesh ownership için scene rebuild sırasında `fabricGroupId` normalizasyonu yapılır. Duplicate'ın eski fabric grubuna yanlış owner olarak katılması engellenir; beklenmeyen clone yüzeylerinde fabric state temizlenebilir.

`Sil` aksiyonu hedef modülü `currentModules` listesinden çıkarıp scene'i yeniden kurar. Delete sonrası bütün duvarı otomatik compact eden genel bir çağrı yapılmaz.

Silinen modül multi-module Lightbox/Mesh owner grubunun parçasıysa rebuild sırasında eksik owner yüzey algılandığında kalan fabric ownership de çözülebilir.

## Persistence / save / load

`buildProjectSnapshot()` bütün `currentModules` dizisini JSON clone ile proje snapshot'ındaki `modules` alanına yazar. `DOOR_100` state'i placement ve nested state alanlarıyla birlikte burada saklanır.

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
recipeId = door-100
moduleType = door
nominalWidthCm = 100
connectionMode = straight
```

| Part ID | Kod adı | Adet | Birim |
|---|---|---:|---|
| `profile_91` | Profil 91 cm | 1 | adet |
| `upright_346_5` | Dikme 346,5 cm | 2 | adet |
| `panel_98` | Panel 98 × 47 cm | 3 | adet |
| `connector_start` | Başlangıç Aparatı | 2 | adet |
| `connector_single` | Tekli Aparat | 5 | adet |
| `door_100` | Kapı 100 cm | 1 | adet |

Recipe metadata'sında ayrıca:

```text
variants.innerCornerPanelPartId = panel_corner_92
```

`panel_corner_92` production registry kaydı: `İç Köşe Paneli 92 × 47 cm` (widthCm=92, heightCm=47, thicknessCm=0.8). Bu part normal `recipe.items` satırlarında yer almaz.

`rawBomDebug.js` seçili modül için `getExpandedModuleRecipe()` çağırıp `recipe.items` satırlarını gösterir. Bu ekranda placement ilişkilerinden ayrıca part dönüşümü yapan bir çağrı yoktur.

## Automatic depot ilişkisi

`autoDepot.js` depo ön yüzü için 100 cm kapı gerektiğinde `kind='door'` spec üretir. 150 cm depo önünde door + wall50, 200 cm depo önünde door + wall100 kombinasyonu oluşturulur; L-left yönünde sıra kodda ters kurulabilir.

## Catalog sidebar / selection feedback

`moduleDragSidebar.js` içinde `DOOR_100` katalog grubu **Panel & Duvar** altında yer alır. Catalog card drag akışı `Shift+R` ile behavior rotation step'ini kullanır; ghost/placement preview `scene3d.previewCatalogModuleDrag()` yoluna gider.

`selectionFeedback.js` bu Item için kullanıcıya şu bilgi sınıfını üretir: `Kapı 100 cm · kapı yüzeyi veya üst panel · renk + görsel uygulanabilir.`

## Kod kaynakları

- `src/catalog.js`
- `src/designState.js`
- `src/moduleContracts.js`
- `src/moduleBehavior.js`
- `src/modulePlacement.js`
- `src/autoDepot.js`
- `src/scene3d.js`
- `src/moduleContextMenu.js`
- `src/main.js`
- `src/moduleRecipes.js`
- `src/productionParts.js`
