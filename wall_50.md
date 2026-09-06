# wall_50 — Mevcut Sistem Profili

Bu belge `wall_50` için mevcut çalışan sistemdeki kimlik, state, davranış, placement, context menu, panel işlemleri, görünüm özellikleri, BOM ve bilinen açık noktaları tek yerde toplar.

> Bu dosya yeni davranış tanımlamaz. Bilgiler `item-yapilandirmasi` branch'indeki mevcut koddan çıkarılmıştır.

## 1. Kimlik

| Alan | Mevcut değer |
|---|---|
| Catalog key | `wall_50` |
| Label | `Düz Panel 50` |
| Type | `flat-panel` |
| Nominal genişlik | `50 cm` |
| Stand yüksekliği | `350 cm` |
| Duvar derinliği | `10 cm` |
| Panel sırası | `7` |
| Her sıra yüksekliği | `50 cm` |

Katalog tanımı:

```js
wall_50: { type: 'flat-panel', widthCm: 50, label: 'Düz Panel 50' }
```

Item diliyle mevcut karşılığı:

```text
itemKey: wall_50
type: flat-panel
class: composite Item
```

Aktif kaynaklar:

- `src/catalog.js`
- `src/moduleContracts.js`
- `src/moduleBehavior.js`
- `src/designState.js`
- `src/moduleRecipes.js`
- `src/productionParts.js`
- `src/moduleContextMenu.js`
- `src/scene3d.js`

---

## 2. Proje instance state'i

`wall_50`, `flat-panel` factory'si üzerinden oluşturulur.

Instance kabaca:

```text
id
catalogKey = wall_50
type = flat-panel
widthCm = 50
placement
strips[0..6]
```

`createFlatPanelModuleState(widthCm)` 7 adet editable panel state'i oluşturur.

Her panel:

```text
id
stripIndex
color
imageAssetId
imageTransform
```

taşır.

Default state:

- 7 panel
- panel rengi `#ffffff`
- `imageAssetId = null`
- default image transform `single`

Catalog descriptor çözümünde `catalogKey = wall_50` state'e yazılır.

---

## 3. Contract

`moduleContracts.js` içinde:

```text
wall_50 → wall-editable
BOM → recipe
source → src/moduleRecipes.js
```

`wall-editable` profili:

```text
state.owner = src/designState.js
state.persistence = project-state
appearance.color = editable
appearance.image = editable
renderer.mode = procedural-or-specialized
runtime.mode = static
composition.mode = standalone
```

---

## 4. Canonical davranış

`wall_50`, `type = flat-panel` olduğu için `WALL_BEHAVIOR` kullanır.

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

`wall_50` adına özel behavior override bulunmaz.

---

## 5. Rotation

Rotation step:

```text
90°
```

Akış:

```text
0° → 90° → 180° → 270° → 0°
```

Interactive rotation merkezi `moduleBehavior.js` resolver'ı üzerinden çözülür.

Katalog sürükleme sırasında:

```text
Shift + R → saat yönünde döndür
```

Context menüde ayrı `Sağa Döndür` / `Sola Döndür` butonu yoktur.

---

## 6. Placement / wall ilişkisi

Placement state:

```text
xCm
yCm
zCm
rotationZDeg
wallId
```

`wall_50` wall-placement ailesindedir.

Mevcut wall sistemi üzerinden:

- back
- left
- right

duvarlarına yerleşebilir.

Sağ duvar canonical orientation değeri mevcut sistemde `270°`dır.

Continuous wall insertion / move sırasında reflow altyapısına katılır.

Nominal wall capacity tüketimi:

```text
50 cm
```

---

## 7. Hareket

```text
placement = wall
moveSnapCm = 50
```

Serbest zemin objesi değildir.

Placement validation ve continuous wall reflow altyapısını kullanır.

Silme sonrası tüm duvarı otomatik sıkıştıran global compact/reflow davranışı yoktur.

---

## 8. Selection / sol click

`wall_50` 7 editable flat-panel yüzeyi taşır.

Mevcut panel selection sistemi üzerinden:

- tek panel selection
- Ctrl/Cmd + sol click multi-selection
- panel range / rectangular selection
- bağlı panel yüzeylerinde selection genişletme

davranışlarına katılır.

Bu interaction `wall_50` için özel değildir; flat-panel ailesinin ortak davranışıdır.

---

## 9. Mouse / kamera

Scene genel mouse mapping:

```text
Sol mouse drag → kamera rotate
Orta mouse     → pan
Sağ mouse      → context interaction için OrbitControls dışı
```

---

## 10. Context menu

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

`wall_50` için olmayan özel seçenekler:

```text
Boyutlandır…        → illuminated-foam
Raf altı aydınlatma → shelf
```

`wall_50` için ayrı width-specific context-menu override bulunmaz.

---

## 11. Sağ / sol tarafa ekleme

```text
allowSideInsert = true
```

Desteklenen context aksiyonları:

```text
Ekle Sağ Tarafa…
Ekle Sol Tarafa…
```

Picker:

- birden çok katalog Item'ı seçebilir,
- aynı Item'ı tekrar seçebilir,
- selection sırasını değiştirebilir,
- batch validation uygular.

---

## 12. Çoğaltma

```text
Çoğalt Sağ Tarafa
Çoğalt Sol Tarafa
```

Flat-panel duplicate akışı tasarım state'ini korur.

Korunanlar:

- panel renkleri
- panel image state
- image transform

Yenilenenler:

- module ID
- surface/panel ID'leri

---

## 13. Silme

`Sil` aksiyonu vardır.

Hedef module project module listesinden çıkarılır ve scene yeniden kurulur.

Silme sonrasında global compact/reflow yapılmaz.

---

## 14. Panel rengi

```text
appearance.color = editable
```

7 panel ayrı renk state'i taşır.

Renk override hedef paneldeki image state'i temizleyebilir; diğer paneller etkilenmez.

---

## 15. Panel görseli

```text
appearance.image = editable
```

Panel:

```text
imageAssetId
imageTransform
```

taşır.

Flat-panel image düzenleme altyapısını kullanır.

---

## 16. Cam / Lightbox / Mesh

`wall_50` flat-panel olduğu için mevcut panel cover-mode sistemine katılır.

Desteklenen işlemler:

```text
Cam Panele Çevir
Normal Panele Çevir
Lightbox Kumaşa Çevir
Lightbox Kumaştan Çıkar
Lightbox aydınlatmayı aç/kapat
Mesh (Delikli) Brandaya Çevir
Mesh Brandadan Çıkar
```

Mevcut exclusivity:

```text
Cam açılırsa       → Lightbox/Mesh kaldırılır
Lightbox açılırsa  → cam kaldırılır
Mesh açılırsa      → cam kaldırılır
```

Lightbox / Mesh rectangular multi-panel selection altyapısını kullanır.

---

## 17. Wall-overlay taşıyıcılığı

```text
supportsWallOverlayMount = true
```

TV / illuminated-foam benzeri wall-overlay Item'lar bu wall ailesi üzerine mount edilebilir.

Overlay ayrı Item/state olarak tutulur; `wall_50` BOM'una otomatik dahil olmaz.

---

## 18. Collision / ghost

```text
collision = segment
magneticSnap = standard
connectionEndpoint = segment
collisionDepth = physical
endpointContact = standard
boundarySnap = stand-edge
overlapWithTypes = []
```

Ghost:

```text
kind = silhouette
renderer = module-silhouette
opacity = 0.38
```

---

## 19. BOM / üretim reçetesi

Canonical recipe:

```text
recipeId = wall-straight-50
moduleType = wall
nominalWidthCm = 50
connectionMode = straight
```

### Normal Raw BOM

| Part ID | Sistem adı | Miktar | Birim |
|---|---|---:|---|
| `profile_41_5` | Profil 41,5 cm | 2 | adet |
| `upright_346_5` | Dikme 346,5 cm | 2 | adet |
| `panel_48_5` | Panel 48,5 × 47 cm | 7 | adet |
| `connector_start` | Başlangıç Aparatı | 2 | adet |
| `connector_single` | Tekli Aparat | 13 | adet |

Production dimensions:

```text
profile_41_5
length = 41.5 cm

upright_346_5
length = 346.5 cm
thickness = 8 cm

panel_48_5
width = 48.5 cm
height = 47 cm
thickness = 0.8 cm
```

---

## 20. İç köşe panel varyantı

Recipe variant:

```text
innerCornerPanelPartId = panel_corner_42_5
```

Production part:

```text
partId = panel_corner_42_5
name = İç Köşe Paneli 42,5 × 47 cm
unit = adet
panelRole = inner-corner
nominalModuleWidthCm = 50
width = 42.5 cm
height = 47 cm
thickness = 0.8 cm
```

---

## 21. Connector Item'ları

Sistemde tanımlı connector Item'ları:

```text
connector_start   = Başlangıç Aparatı
connector_single  = Tekli Aparat
connector_double  = Çiftli Aparat
connector_corner  = Köşe Aparatı
```

Normal `wall_50` straight recipe:

```text
2 × connector_start
13 × connector_single
```

`connector_double` ve `connector_corner` production sisteminde vardır ancak straight recipe satırında kullanılmaz.

---

## 22. Raw BOM Debug

`rawBomDebug.js` düz duvar genişlikleri arasında `50` değerini tanır ve:

```text
renderRecipe('wall', 50, '50 cm düz duvar')
```

akışıyla Raw BOM gösterir.

Bu Final Project BOM değildir.

---

## 23. Project relationship / Final BOM durumu

Mevcut sistemde:

- straight recipe var,
- inner-corner panel part var,
- double/corner connector Item'ları var,
- wall relationship / placement altyapısı var.

Ancak project-level gerçek komşuluk/köşe ilişkilerinden terminal BOM değişimini canonical şekilde türeten Final BOM çözümü tamamlanmış değildir.

İlgili açık audit alanları:

```text
F-030 — No canonical project-level Final BOM generator
F-031 — Relationship/corner connector parts not derived from project relationships
```

---

# wall_50 vs wall_100 / wall_150 / wall_200 — Sistemden doğrulanmış farklar

## 24. Gerçek farklar

| Alan | `wall_50` | `wall_100` | `wall_150` | `wall_200` |
|---|---|---|---|---|
| Genişlik | 50 cm | 100 cm | 150 cm | 200 cm |
| Recipe | `wall-straight-50` | `wall-straight-100` | `wall-straight-150` | `wall-straight-200` |
| Profil | `profile_41_5` | `profile_91` | `profile_140_5` | `profile_190` |
| Normal panel | `panel_48_5` | `panel_98` | `panel_147_5` | `panel_197` |
| İç köşe panel | `panel_corner_42_5` | `panel_corner_92` | `panel_corner_142_5` | `panel_corner_192` |

## 25. Aynı olanlar

Aşağıdakiler mevcut sistemde tüm dört düz duvarda aynıdır:

- `type = flat-panel`
- `profile = wall-editable`
- 7 panel
- 350 cm yükseklik
- 10 cm duvar derinliği
- 50 cm move snap
- 90° rotation step
- 0° default rotation
- side insert true
- segment collision
- standard magnetic snap
- stand-edge boundary snap
- wall-overlay host true
- aynı context menu
- aynı panel selection sistemi
- aynı color/image sistemi
- aynı Cam/Lightbox/Mesh sistemi
- aynı ghost
- 2 adet profil
- 2 adet `upright_346_5`
- 7 adet normal panel
- 2 adet başlangıç aparatı
- 13 adet tekli aparat
- BOM policy = recipe

## 26. Sonuç

Mevcut kodda `wall_50` için `wall_100`, `wall_150` veya `wall_200`den farklı özel rotation, click, context menu, collision, side-insert, ghost veya appearance davranışı bulunmamaktadır.

Farklar width-specific geometry ve production Item kimlikleridir.
