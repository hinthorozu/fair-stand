# wall_200 — Mevcut Sistem Profili

Bu belge `wall_200` için mevcut çalışan sistemdeki kimlik, state, davranış, placement, context menu, panel işlemleri, görünüm özellikleri, BOM ve bilinen açık noktaları tek yerde toplar.

> Bu dosya yeni davranış tanımlamaz. Mevcut sistemin güncel profilidir.

## 1. Kimlik

| Alan | Mevcut değer |
|---|---|
| Catalog key | `wall_200` |
| Label | `Düz Panel 200` |
| Type | `flat-panel` |
| Nominal genişlik | `200 cm` |
| Stand yüksekliği | `350 cm` |
| Duvar derinliği | `10 cm` |
| Panel sırası | `7` |
| Her sıra yüksekliği | `50 cm` |

Katalog tanımı:

```js
wall_200: { type: 'flat-panel', widthCm: 200, label: 'Düz Panel 200' }
```

Item diliyle mevcut karşılığı:

```text
itemKey: wall_200
type: flat-panel
class: composite Item
```

Canonical kaynaklar:

- `src/catalog.js`
- `src/moduleContracts.js`
- `src/moduleBehavior.js`
- `src/designState.js`
- `src/moduleRecipes.js`

---

## 2. Proje instance state'i

Bir `wall_200` instance'ı kabaca şu bilgileri taşır:

```text
id
catalogKey = wall_200
type = flat-panel
widthCm = 200
placement
strips[0..6]
```

Her panel/strip bağımsız state taşır:

```text
surface id
stripIndex
color
imageAssetId
imageTransform
```

Mevcut varsayılanlar:

- 7 düzenlenebilir panel vardır.
- Default panel rengi beyazdır.
- Default görsel yoktur.
- Her panel bağımsız düzenlenebilir.
- Modül çoğaltıldığında tasarım state'i korunur.
- Yeni modül ID'si ve yeni panel ID'leri üretilir.

`moduleContracts.js` açısından `wall_200`:

```text
profile = wall-editable
state.owner = src/designState.js
state.persistence = project-state
appearance.color = editable
appearance.image = editable
renderer.mode = procedural-or-specialized
runtime.mode = static
composition.mode = standalone
bom.mode = recipe
bom.source = src/moduleRecipes.js
```

---

## 3. Canonical davranış

`wall_200`, `flat-panel` olduğu için `WALL_BEHAVIOR` kullanır.

| Davranış | Değer |
|---|---|
| Placement | `wall` |
| Hareket snap | `50 cm` |
| Rotation step | `90°` |
| Default rotation | `0°` |
| Side insert | `true` |
| Collision | `segment` |
| Magnetic snap | `standard` |
| Connection endpoint | `segment` |
| Collision depth | `physical` |
| Endpoint contact | `standard` |
| Boundary snap | `stand-edge` |
| Side insert rotation | `inherit` |
| Overlap izinleri | Yok |
| Wall overlay mount | `true` |
| Wall capacity | `include` |
| Ghost | `silhouette` |
| Ghost renderer | `module-silhouette` |
| Ghost opacity | `0.38` |

Canonical sahibi:

- `src/moduleBehavior.js`

---

## 4. Rotation

`wall_200` 90° adımlarla döner:

```text
0° → 90° → 180° → 270° → 0°
```

Ters yönde de aynı 90° adımı kullanılır.

Interactive rotation yolları rotation delta değerini `moduleBehavior.js` üzerinden çözer.

Katalogdan sürükleme sırasında mevcut klavye davranışı:

```text
Shift + R → saat yönünde döndür
```

Context menüde şu anda ayrı bir `Sağa Döndür` / `Sola Döndür` butonu yoktur.

İlgili kaynaklar:

- `src/moduleBehavior.js`
- `src/moduleDragSidebar.js`
- `src/scene3d.js`
- `test/moduleRotationPolicy.test.js`
- `test/moduleRotationSingleSourceIntegration.test.js`
- `test/catalogDragKeyboardIntegration.test.js`

---

## 5. Placement / duvar / köşe davranışı

Placement state şu alanları taşır:

```text
xCm
yCm
zCm
rotationZDeg
wallId
```

`wall_200`:

- arka duvara,
- sol duvara,
- sağ duvara

yerleşebilir.

Continuous wall sistemi gerektiğinde bağlı modülleri reflow eder.

Canonical sağ duvar orientation değeri:

```text
270°
```

Bu değer aktif wall reflow ve corner placement testlerinde aynı olacak şekilde doğrulanmıştır.

İlgili kaynaklar:

- `src/modulePlacement.js`
- `src/wallReflow.js`
- `src/cornerPlacement.js`
- `test/rightWallOrientation.test.js`

---

## 6. Hareket

`wall_200` serbest mobilya değildir:

```text
placement = wall
```

Hareket snap değeri:

```text
50 cm
```

Continuous wall hareket akışı kabaca:

```text
istenen yeni konum
↓
placement validation
↓
uygunsa direkt taşı
↓
çakışma varsa continuous wall insertion/reflow
↓
gerekli komşu modülleri kaydır
```

Önemli mevcut davranış:

- Bir modül silindiğinde kalan duvar otomatik sıkıştırılmaz.
- Silme sonrası boşluğu otomatik kapatan global reflow yoktur.

İlgili kaynaklar:

- `src/moduleMove.js`
- `src/modulePlacement.js`
- `src/wallReflow.js`

---

## 7. Sol click / selection

`wall_200` 7 seçilebilir panel yüzeyi taşır.

Panel yüzeyleri:

```text
selectionMode = panel
```

olarak oluşturulur.

Normal click davranışı drag çözümünden sonra selection'a dönüşür. Pointer-down anında doğrudan `selectedModuleId` yazılmaz.

### Ctrl/Cmd + sol click

Panel çoklu seçim sistemi vardır.

Desteklenen davranışlar:

- Aynı `wall_200` içindeki birden fazla panel seçilebilir.
- Aynı modül içinde dikey panel range seçilebilir.
- Bağlı duvar/modül yüzeylerinde panel selection genişletilebilir.
- Rectangle/range selection panel varlığına göre çalışır.

İlgili kaynaklar:

- `src/scene3d.js`
- `src/rectSelection.js`
- `test/panelMultiSelectRule.test.js`
- `test/ctrlMultiSelect.test.js`
- `test/moduleSelectionState.test.js`

---

## 8. Mouse / kamera davranışı

Scene genel mouse mapping:

```text
Sol mouse drag  → kamera rotate
Orta mouse      → pan
Sağ mouse       → OrbitControls'a verilmez
```

Sağ mouse modül/panel context-menu interaction akışı için kullanılabilir.

Kaynak:

- `src/scene3d.js`

---

## 9. Context menu

`wall_200` üzerinde mevcut context menu aksiyonları:

### Modül seviyesi

```text
Sil
Çoğalt Sağ Tarafa
Çoğalt Sol Tarafa
Ekle Sağ Tarafa…
Ekle Sol Tarafa…
```

### Panel seviyesi / uygun selection durumunda

```text
Cam Panele Çevir
Normal Panele Çevir

Lightbox Kumaşa Çevir
Lightbox Kumaştan Çıkar

Mesh (Delikli) Brandaya Çevir
Mesh Brandadan Çıkar

Lightbox aydınlatmayı aç
Lightbox aydınlatmayı kapat
```

`wall_200` için geçerli olmayan context komutları:

```text
Boyutlandır…             → illuminated-foam
Raf altı aydınlatma      → shelf
```

Canonical kaynak:

- `src/moduleContextMenu.js`

---

## 10. Sağ / sol tarafa Item ekleme

`wall_200` için:

```text
allowSideInsert = true
```

Context menu üzerinden:

```text
Ekle Sağ Tarafa…
Ekle Sol Tarafa…
```

kullanılabilir.

Picker davranışı:

- Birden fazla modül seçilebilir.
- Aynı modül birden fazla kez seçilebilir.
- Seçim sırası değiştirilebilir.
- Toplu insertion validation yapılır.
- Sağ insertion sırasında sıra gerekli şekilde ters çevrilebilir.

Görsel sağ/sol yönü wall orientation'a göre continuous-chain yönüne normalize edilir.

İlgili kaynaklar:

- `src/moduleContextMenu.js`
- `src/main.js`
- `src/wallReflow.js`
- `test/moduleContextDirection.test.js`

---

## 11. Çoğaltma

Context menu:

```text
Çoğalt Sağ Tarafa
Çoğalt Sol Tarafa
```

sunmaktadır.

Duplicate sırasında korunur:

- panel renkleri,
- panel görselleri,
- image transform bilgileri,
- modülün tasarım state'i.

Yenilenir:

- module ID,
- surface/panel ID'leri.

Kaynaklar:

- `src/designState.js`
- `src/moduleContextMenu.js`
- `test/designState.test.js`

---

## 12. Silme

`Sil` komutu mevcuttur.

Silmeden önce kullanıcı confirmation görür. Mesajda modüldeki renk ve görsel düzenlemelerinin de kaybolacağı belirtilir.

Onay sonrası temel akış:

```text
currentModules.splice(...)
rebuildWall(...)
```

Mevcut davranış:

- Yalnız hedef modül silinir.
- Silme sonrası global compact/reflow yapılmaz.

Kaynak:

- `src/main.js`

---

## 13. Panel rengi

`wall_200` için:

```text
appearance.color = editable
```

Yedi panel ayrı ayrı renk state'i taşır.

Mevcut önemli davranış:

Bir panelin rengi `applyColorOverride()` ile değiştirildiğinde o hedef paneldeki görsel state'i temizlenir:

```text
color = yeni renk
imageAssetId = null
imageTransform.mode = single
```

Diğer paneller etkilenmez.

Kaynaklar:

- `src/designState.js`
- `test/designState.test.js`

---

## 14. Panel görseli

`wall_200` için:

```text
appearance.image = editable
```

Panel state'i:

```text
imageAssetId
imageTransform
```

taşır.

Mevcut UI/scene tarafında desteklenen görsel işlemleri:

- görsel ekleme,
- `cover`,
- `contain`,
- texture/görsel temizleme.

İlgili kaynaklar:

- `src/main.js`
- `src/scene3d.js`
- `src/imageFit.js`
- `src/horizontalImageLayout.js`
- `src/rectImageLayout.js`

---

## 15. Cam panel

Panel context menüsünden:

```text
Cam Panele Çevir
```

yapılabilir.

Cam aktifken seçenek:

```text
Normal Panele Çevir
```

olur.

Mevcut sistemde görsel + cam birlikte bulunabilir. Cam yapmak görseli zorunlu olarak silmez.

Kaynaklar:

- `src/moduleContextMenu.js`
- `src/scene3d.js`
- `test/coverModeExclusivity.test.js`

---

## 16. Lightbox kumaş

Birden fazla panel uygun dikdörtgen blok olarak seçildiğinde:

```text
Lightbox Kumaşa Çevir
```

özelliği kullanılabilir.

Mevcut kurallar:

- En az 2 panel gerekir.
- Seçim geçerli rectangular block olmalıdır.
- Seçili blok için tek bir continuous overlay oluşturulur.
- Lightbox aktifken aydınlatma açılıp kapatılabilir.

Context seçenekleri:

```text
Lightbox Kumaşa Çevir
Lightbox Kumaştan Çıkar
Lightbox aydınlatmayı aç
Lightbox aydınlatmayı kapat
```

Kaynaklar:

- `src/moduleContextMenu.js`
- `src/scene3d.js`
- `test/lightboxFabric.test.js`

---

## 17. Mesh / delikli branda

Panel selection üzerinde:

```text
Mesh (Delikli) Brandaya Çevir
```

özelliği vardır.

Mevcut davranış:

- Seçili alan üzerinde tek continuous plane kullanılır.
- Yarı saydam görünür.
- Lightbox gibi aydınlatılmaz.
- Ayrı bir perforation alpha-mask uygulanmaz.

Context seçenekleri:

```text
Mesh (Delikli) Brandaya Çevir
Mesh Brandadan Çıkar
```

Kaynaklar:

- `src/moduleContextMenu.js`
- `src/scene3d.js`
- `test/lightboxFabric.test.js`
- `test/coverModeExclusivity.test.js`

---

## 18. Cam / Lightbox / Mesh exclusivity

Bu üç mod tamamen bağımsız şekilde üst üste yığılmaz.

Mevcut sistem kuralı:

```text
Cam açılırsa       → aktif Lightbox/Mesh kaldırılır
Lightbox açılırsa  → cam kaldırılır
Mesh açılırsa      → cam kaldırılır
```

Yani cover mode'ları birbirini dışlayan davranış taşır.

Kaynak:

- `src/scene3d.js`
- `test/coverModeExclusivity.test.js`

---

## 19. Wall-overlay taşıyıcılığı

`wall_200` behavior:

```text
supportsWallOverlayMount = true
```

Bu nedenle TV veya illuminated-foam gibi wall-overlay Item'ların bağlanabileceği wall ailesindedir.

Bu ilişki, overlay Item'ın `wall_200` BOM'una otomatik olarak dahil olduğu anlamına gelmez. Overlay ayrı Item/state olarak tutulur.

Kaynak:

- `src/moduleBehavior.js`

---

## 20. Collision

Mevcut collision contract:

```text
collision = segment
collisionDepth = physical
connectionEndpoint = segment
endpointContact = standard
overlapWithTypes = []
```

Yani `wall_200` placement validation içinde fiziksel duvar segmenti olarak değerlendirilir.

Kaynak:

- `src/moduleBehavior.js`
- `src/modulePlacement.js`

---

## 21. Ghost / sürükleme önizlemesi

Canonical ghost davranışı:

```text
kind = silhouette
renderer = module-silhouette
opacity = 0.38
```

Yeni `wall_200` yerleştirme/sürükleme akışında modül silhouette preview sistemi kullanılır.

Kaynak:

- `src/moduleBehavior.js`
- `src/scene3d.js`

---

## 22. BOM

`wall_200` için canonical recipe vardır.

Contract:

```text
bom.mode = recipe
bom.source = src/moduleRecipes.js
```

Normal düz `wall_200` reçetesi:

| Alt kalem | Miktar |
|---|---:|
| `profile_190` | 2 |
| `upright_346_5` | 2 |
| `panel_197` | 7 |
| `connector_start` | 2 |
| `connector_single` | 13 |

Recipe kimliği:

```text
recipeId = wall-straight-200
moduleType = wall
nominalWidthCm = 200
connectionMode = straight
```

Ayrıca inner-corner varyantı:

```text
innerCornerPanelPartId = panel_corner_192
```

olarak tanımlıdır.

Kaynaklar:

- `src/moduleRecipes.js`
- `src/productionParts.js`
- `src/moduleContracts.js`

---

## 23. Raw BOM debug görünümü

Sistemde `Üretim Listesi · Debug` paneli vardır.

Düz duvar selection algılanınca:

```js
getExpandedModuleRecipe('wall', 200)
```

üzerinden Raw BOM gösterilir.

Bu ekran mevcut module recipe'yi gösterir; canonical project-level Final BOM değildir.

Kaynak:

- `src/rawBomDebug.js`

---

## 24. Köşe / relationship BOM durumu

Mevcut sistemde şu parçalar/reçete bilgileri vardır:

- normal düz panel recipe,
- `panel_corner_192` inner-corner panel varyantı,
- production part registry'deki connector parçaları,
- gerçek placement/köşe ilişkisi.

Ancak proje seviyesinde gerçek Item ilişkilerini okuyup Final BOM'u tam türeten sistem henüz tamamlanmış değildir.

Özellikle açık audit bulguları:

```text
F-030 — No canonical project-level Final BOM generator
F-031 — Relationship/corner connector parts not derived from project relationships
```

Bu nedenle örneğin iki `wall_200` 90° köşe yaptığında:

```text
düz panel → köşe paneli varyantı
connector_single / connector_double / connector_corner → gerçek ilişkiye göre yeni adetler
```

şeklindeki nihai relationship-derived BOM dönüşümü henüz canonical Final BOM seviyesinde tamamlanmış değildir.

Kaynak:

- `audit/FINDINGS.md`

---

## 25. Mevcut yetenek özeti

| İşlem | Durum |
|---|---|
| Duvara yerleştir | ✅ |
| Taşı | ✅ |
| 50 cm snap | ✅ |
| 90° döndür | ✅ |
| Sağ/sol duvara geç | ✅ |
| Continuous wall reflow | ✅ |
| Yanına Item/modül ekle | ✅ |
| Sağ tarafa çoğalt | ✅ |
| Sol tarafa çoğalt | ✅ |
| Sil | ✅ |
| Panel tek tek seç | ✅ |
| Çoklu panel seç | ✅ |
| Panel rengini değiştir | ✅ |
| Panel görseli ekle | ✅ |
| Görsel cover/contain | ✅ |
| Görsel temizle | ✅ |
| Cam panele çevir | ✅ |
| Lightbox kumaş oluştur | ✅ |
| Lightbox aydınlat | ✅ |
| Mesh branda oluştur | ✅ |
| Wall-overlay taşı | ✅ |
| Boyutlandır context komutu | ❌ |
| Raf altı ışığı | ❌ |
| Context menüden rotate butonu | ❌ |
| Raw BOM recipe | ✅ |
| Köşe panel varyantı | ✅ |
| Relationship'tan otomatik tam connector BOM | ❌ |
| Canonical project Final BOM | ❌ |

---

## 26. Item mimarisi açısından toplu görünüm

```text
wall_200
│
├── IDENTITY
│   ├── itemKey: wall_200
│   └── type: flat-panel
│
├── GEOMETRY / STATE
│   ├── width: 200
│   ├── height: 350
│   └── 7 editable panel
│
├── BEHAVIOR
│   ├── wall placement
│   ├── 50 cm move snap
│   ├── 90° rotation
│   ├── collision
│   ├── magnetic snap
│   ├── side insertion
│   └── overlay host
│
├── INTERACTION
│   ├── select
│   ├── multi-select
│   ├── delete
│   ├── duplicate
│   ├── add left/right
│   └── context menu
│
├── APPEARANCE
│   ├── color
│   ├── image
│   ├── glass
│   ├── lightbox
│   └── mesh
│
├── BOM
│   ├── base recipe
│   ├── terminal production parts
│   └── corner panel variant
│
└── PROJECT RELATIONSHIPS
    ├── neighboring Items
    ├── wall/corner state
    ├── overlay Items
    └── relationship-derived Final BOM  ← henüz eksik
```

---

## 27. `wall_200` çevresindeki açık mimari bulgular

`wall_200` profilini Item mimarisine taşırken özellikle şu açık findings etkiler:

- `F-017` — Renderer directly mutates persistent editable state.
- `F-018` — Structural strip/panel count duplicated between catalog and state factories.
- `F-019` — Catalog/runtime dimensions duplicated/hard-coded in state factories.
- `F-030` — No canonical project-level Final BOM generator.
- `F-031` — Relationship/corner connector parts not derived from project relationships.

Bunlar `wall_200`ın mevcut yeteneklerini yok saymadan canonical Item modeline taşınırken korunması/temizlenmesi gereken alanlardır.
