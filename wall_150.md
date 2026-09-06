# wall_150 — Mevcut Sistem Profili

Bu belge `wall_150` için mevcut çalışan sistemdeki kimlik, state, davranış, placement, context menu, panel işlemleri, görünüm özellikleri, BOM ve bilinen açık noktaları tek yerde toplar.

> Bu dosya yeni davranış tanımlamaz. Mevcut sistemin güncel profilidir. Bilgiler `item-yapilandirmasi` branch'indeki mevcut koddan çıkarılmıştır.

## 1. Kimlik

| Alan | Mevcut değer |
|---|---|
| Catalog key | `wall_150` |
| Label | `Düz Panel 150` |
| Type | `flat-panel` |
| Nominal genişlik | `150 cm` |
| Stand yüksekliği | `350 cm` |
| Duvar derinliği | `10 cm` |
| Panel sırası | `7` |
| Her sıra yüksekliği | `50 cm` |

Katalog tanımı:

```js
wall_150: { type: 'flat-panel', widthCm: 150, label: 'Düz Panel 150' }
```

Item diliyle mevcut karşılığı:

```text
itemKey: wall_150
type: flat-panel
class: composite Item
```

Canonical / aktif kaynaklar:

- `src/catalog.js`
- `src/moduleContracts.js`
- `src/moduleBehavior.js`
- `src/designState.js`
- `src/moduleRecipes.js`
- `src/productionParts.js`

---

## 2. Proje instance state'i

Bir `wall_150` katalogdan oluşturulduğunda `flat-panel` factory'si kullanılır.

Instance kabaca şu bilgileri taşır:

```text
id
catalogKey = wall_150
type = flat-panel
widthCm = 150
placement
strips[0..6]
```

`createFlatPanelModuleState(widthCm)` doğrudan genişliği state'e yazar ve 7 adet editable panel state'i oluşturur.

Her panel/strip bağımsız olarak şunları taşır:

```text
id
stripIndex
color
imageAssetId
imageTransform
```

Mevcut varsayılanlar:

- 7 düzenlenebilir panel vardır.
- Default panel rengi `#ffffff` (beyaz)dır.
- Default `imageAssetId = null`.
- Default image transform `single` modundadır.
- Her panel bağımsız state taşır.
- Catalog descriptor çözümünde `catalogKey = wall_150` instance state'e eklenir.

`moduleContracts.js` açısından `wall_150`:

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

`wall_150`, `type = flat-panel` olduğu için doğrudan `WALL_BEHAVIOR` kullanır.

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

`wall_150` için ayrı bir behavior override yoktur. Davranışı `flat-panel -> WALL_BEHAVIOR` üzerinden gelir.

Canonical sahibi:

- `src/moduleBehavior.js`

---

## 4. Rotation

`wall_150` 90° adımlarla döner:

```text
0° → 90° → 180° → 270° → 0°
```

Ters yöndeki dönüş de aynı 90° step üzerinden çözülür.

Interactive rotation yolları merkezi `moduleBehavior.js` rotation resolver'ını kullanır.

Katalogdan sürükleme sırasında mevcut klavye davranışı:

```text
Shift + R → saat yönünde döndür
```

Context menüde ayrı bir `Sağa Döndür` / `Sola Döndür` butonu yoktur.

İlgili kaynaklar:

- `src/moduleBehavior.js`
- `src/moduleDragSidebar.js`
- `src/scene3d.js`
- `test/moduleRotationPolicy.test.js`
- `test/moduleRotationSingleSourceIntegration.test.js`
- `test/catalogDragKeyboardIntegration.test.js`

---

## 5. Placement / duvar / köşe davranışı

Placement state şu alanları kullanır:

```text
xCm
yCm
zCm
rotationZDeg
wallId
```

`wall_150` wall-placement ailesindedir ve continuous wall akışına katılır.

Yerleşebildiği wall alanları mevcut wall sistemi üzerinden:

- arka duvar,
- sol duvar,
- sağ duvar.

Canonical sağ duvar orientation değeri mevcut sistemde `270°` olarak doğrulanmıştır.

Continuous wall sistemi insertion / move sırasında gerekli komşu modülleri reflow edebilir.

`wall_150` nominal genişliği `150 cm` olduğu için wall capacity / segment hesabında 150 cm yer tüketir.

İlgili kaynaklar:

- `src/modulePlacement.js`
- `src/moduleMove.js`
- `src/wallReflow.js`
- `src/cornerPlacement.js`
- `test/rightWallOrientation.test.js`

---

## 6. Hareket

`wall_150` serbest zemin objesi değildir:

```text
placement = wall
```

Hareket snap değeri:

```text
50 cm
```

Continuous wall hareket akışı mevcut placement / move / reflow altyapısını kullanır.

Kabaca:

```text
istenen yeni konum
↓
placement validation
↓
uygunsa direkt taşı
↓
çakışma / zincir etkisi varsa continuous wall insertion/reflow
↓
gerekli komşu modülleri kaydır
```

Mevcut önemli davranış:

- Bir modül silindiğinde kalan duvar otomatik sıkıştırılmaz.
- Silme sonrası tüm duvarı boşluksuz hale getiren global compact/reflow yoktur.

---

## 7. Sol click / selection

`wall_150` 7 editable panel state'i taşıdığı için flat-panel selection sistemine girer.

Panel yüzeyleri scene tarafında panel selection davranışına katılır.

### Ctrl/Cmd + sol click

Mevcut multi-panel selection altyapısı flat-panel yüzeylerinde kullanılabilir.

Desteklenen sistem davranışları:

- aynı modül içindeki birden fazla paneli seçme,
- panel range / dikdörtgen selection,
- bağlı panel yüzeylerinde seçimi genişletme.

Bu davranış genişliğe özel değildir; `wall_150` ve `wall_200` aynı flat-panel selection yolunu kullanır.

İlgili kaynaklar:

- `src/scene3d.js`
- `src/rectSelection.js`
- `test/panelMultiSelectRule.test.js`
- `test/ctrlMultiSelect.test.js`

---

## 8. Mouse / kamera davranışı

Scene genel mouse mapping'i modül genişliğinden bağımsızdır:

```text
Sol mouse drag  → kamera rotate
Orta mouse      → pan
Sağ mouse       → OrbitControls'a verilmez
```

Panel / modül hit-testing ve context menu bunun üzerinde kendi interaction akışını kullanır.

Kaynak:

- `src/scene3d.js`

---

## 9. Context menu

`wall_150` flat-panel olarak `wall_200` ile aynı context-menu altyapısına girer.

### Modül seviyesi mevcut aksiyonlar

```text
Sil
Çoğalt Sağ Tarafa
Çoğalt Sol Tarafa
Ekle Sağ Tarafa…
Ekle Sol Tarafa…
```

### Panel seviyesi / uygun selection context'inde

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

`wall_150` için geçerli olmayan özel context komutları:

```text
Boyutlandır…        → yalnız illuminated-foam
Raf altı aydınlatma → yalnız shelf
```

Context menu butonları `wall_150` adına özel ayrı bir tabloyla tanımlanmamıştır; context/type/capability bilgilerine göre açılıp kapanır.

Canonical kaynak:

- `src/moduleContextMenu.js`

---

## 10. Sağ / sol tarafa Item ekleme

`wall_150` behavior:

```text
allowSideInsert = true
```

Context menu üzerinden:

```text
Ekle Sağ Tarafa…
Ekle Sol Tarafa…
```

kullanılabilir.

Mevcut picker davranışı:

- birden fazla katalog elemanı seçilebilir,
- aynı eleman birden fazla kez seçilebilir,
- seçim sırası değiştirilebilir,
- toplu insertion validation yapılır,
- sağ tarafa insertion sırasında sıra gerekli şekilde ters çevrilir.

Görsel sağ/sol yönü wall orientation'a göre continuous-chain yönüne normalize edilir.

Kaynaklar:

- `src/moduleContextMenu.js`
- `src/main.js`
- `src/wallReflow.js`

---

## 11. Çoğaltma

Context menu:

```text
Çoğalt Sağ Tarafa
Çoğalt Sol Tarafa
```

sunmaktadır.

Flat-panel duplicate akışında mevcut tasarım state'i korunur, yeni kimlikler oluşturulur.

Korunan bilgiler arasında panel state'leri bulunur:

- renk,
- görsel,
- image transform.

Yenilenenler:

- module ID,
- panel / surface ID'leri.

Kaynaklar:

- `src/designState.js`
- `src/moduleContextMenu.js`
- `test/designState.test.js`

---

## 12. Silme

`Sil` context komutu mevcuttur.

Mevcut ana akış hedef modülü project module listesinden çıkarır ve scene'i yeniden kurar.

Mevcut davranış:

- hedef modül silinir,
- modüldeki editable state onunla birlikte kaybolur,
- silme sonrası global compact/reflow yapılmaz.

Kaynak:

- `src/main.js`

---

## 13. Panel rengi

Contract:

```text
appearance.color = editable
```

Yedi panel ayrı ayrı renk state'i taşır.

Default:

```text
#ffffff
```

Mevcut `applyColorOverride()` davranışında bir panelin rengi değiştirildiğinde hedef paneldeki image state temizlenir; diğer paneller etkilenmez.

Kaynaklar:

- `src/designState.js`
- `test/designState.test.js`

---

## 14. Panel görseli

Contract:

```text
appearance.image = editable
```

Her editable panel:

```text
imageAssetId
imageTransform
```

taşır.

Mevcut image düzenleme altyapısı flat-panel yüzeyleri üzerinde çalışır.

Kaynaklar:

- `src/main.js`
- `src/scene3d.js`
- `src/imageFit.js`
- `src/horizontalImageLayout.js`
- `src/rectImageLayout.js`

---

## 15. Cam panel

Panel context'inde sistem desteklediğinde:

```text
Cam Panele Çevir
Normal Panele Çevir
```

aksiyonları kullanılır.

Cam / görsel davranışı flat-panel sistemine aittir; `wall_150` için ayrı bir width-specific kural yoktur.

Kaynaklar:

- `src/moduleContextMenu.js`
- `src/scene3d.js`
- `test/coverModeExclusivity.test.js`

---

## 16. Lightbox kumaş

Flat-panel multi-selection üzerinde mevcut Lightbox sistemi kullanılabilir.

Mevcut kurallar:

- birden fazla panel gerekir,
- selection geçerli dikdörtgen blok olmalıdır,
- seçili alan için continuous overlay oluşturulur,
- Lightbox aydınlatması açılıp kapatılabilir.

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

Flat-panel selection üzerinde mevcut Mesh sistemi kullanılabilir.

Context seçenekleri:

```text
Mesh (Delikli) Brandaya Çevir
Mesh Brandadan Çıkar
```

Mevcut sistemde Mesh ve Lightbox/cam ilişkisi ortak cover-mode kuralları üzerinden yönetilir.

Kaynaklar:

- `src/moduleContextMenu.js`
- `src/scene3d.js`
- `test/lightboxFabric.test.js`
- `test/coverModeExclusivity.test.js`

---

## 18. Cam / Lightbox / Mesh exclusivity

Mevcut flat-panel cover-mode kuralı:

```text
Cam açılırsa       → aktif Lightbox/Mesh kaldırılır
Lightbox açılırsa  → cam kaldırılır
Mesh açılırsa      → cam kaldırılır
```

Bu kural `wall_150` genişliğine özel değildir.

---

## 19. Wall-overlay taşıyıcılığı

`wall_150` behavior:

```text
supportsWallOverlayMount = true
```

Dolayısıyla wall-overlay Item'ların bağlanabildiği wall ailesindedir.

Overlay Item bu nedenle `wall_150` BOM'una otomatik olarak dahil olmaz; ayrı module/item state'i olarak kalır.

Kaynak:

- `src/moduleBehavior.js`

---

## 20. Collision / snap

Mevcut behavior:

```text
collision = segment
magneticSnap = standard
connectionEndpoint = segment
collisionDepth = physical
endpointContact = standard
boundarySnap = stand-edge
overlapWithTypes = []
```

`wall_150` için ayrı collision veya snap override bulunmaz.

Nominal genişliği 150 cm olduğu için segment geometrisi / wall capacity etkisi `wall_200`den daha kısadır; collision politika türü ise aynıdır.

---

## 21. Ghost / placement preview

Canonical ghost davranışı:

```text
kind = silhouette
renderer = module-silhouette
opacity = 0.38
```

Bu behavior `flat-panel` ailesinin ortak `WALL_BEHAVIOR` değeridir.

---

## 22. BOM / üretim reçetesi

`wall_150` için canonical BOM policy mevcuttur:

```text
bom.mode = recipe
bom.source = src/moduleRecipes.js
```

Recipe:

```text
recipeId = wall-straight-150
moduleType = wall
nominalWidthCm = 150
connectionMode = straight
```

### Normal `wall_150` Raw BOM

| Part ID | Sistem adı | Miktar | Birim |
|---|---|---:|---|
| `profile_140_5` | Profil 140,5 cm | 2 | adet |
| `upright_346_5` | Dikme 346,5 cm | 2 | adet |
| `panel_147_5` | Panel 147,5 × 47 cm | 7 | adet |
| `connector_start` | Başlangıç Aparatı | 2 | adet |
| `connector_single` | Tekli Aparat | 13 | adet |

Üretim parçası ölçüleri:

```text
profile_140_5
length = 140.5 cm

upright_346_5
length = 346.5 cm
thickness = 8 cm

panel_147_5
width = 147.5 cm
height = 47 cm
thickness = 0.8 cm
```

Canonical kaynaklar:

- `src/moduleRecipes.js`
- `src/productionParts.js`

---

## 23. İç köşe panel varyantı

`wall_150` recipe'sinde şu variant kayıtlıdır:

```text
innerCornerPanelPartId = panel_corner_142_5
```

Production part:

```text
partId = panel_corner_142_5
name = İç Köşe Paneli 142,5 × 47 cm
type = panel
unit = adet
panelRole = inner-corner
nominalModuleWidthCm = 150
width = 142.5 cm
height = 47 cm
thickness = 0.8 cm
```

Bu, normal `panel_147_5` parçasından ayrı canonical production part'tır.

---

## 24. Connector Item'ları

Production system içinde aşağıdaki connector Item'ları ayrı ayrı tanımlıdır:

```text
connector_start   = Başlangıç Aparatı
connector_single  = Tekli Aparat
connector_double  = Çiftli Aparat
connector_corner  = Köşe Aparatı
```

Normal `wall_150` straight recipe şu anda doğrudan:

```text
2 × connector_start
13 × connector_single
```

üretir.

`connector_double` ve `connector_corner` production part olarak sistemde vardır fakat normal straight `wall_150` recipe satırlarında bulunmaz.

---

## 25. Raw BOM Debug UI

Mevcut `rawBomDebug.js`, düz duvar seçim metninde genişlik olarak şunları tanır:

```text
50 | 100 | 150 | 200
```

`wall_150` seçildiğinde düz duvar yolu:

```js
renderRecipe('wall', 150, '150 cm düz duvar')
```

mantığıyla expanded recipe gösterir.

Dolayısıyla `wall_150` için mevcut Raw BOM görüntülenebilir.

Bu ekran Final Project BOM değildir; mevcut debug üretim listesidir.

Kaynak:

- `src/rawBomDebug.js`

---

## 26. Project relationship / Final BOM durumu

Mevcut sistemde:

- straight `wall_150` recipe var,
- `panel_corner_142_5` inner-corner varyantı var,
- `connector_double` production part var,
- `connector_corner` production part var,
- placement / wall relationship sistemi var.

Fakat project-level Final BOM tarafında gerçek komşuluk / köşe ilişkilerinden connector ve panel dönüşümünü tek canonical resolver ile tamamlayan yapı henüz açık çalışma alanıdır.

Mevcut audit bulguları arasında:

```text
F-030 — No canonical project-level Final BOM generator
F-031 — Relationship/corner connector parts not derived from project relationships
```

bulunmaktadır.

Bu nedenle `wall_150` için normal straight Raw BOM tanımlıdır; ancak gerçek projedeki tüm köşe/bağlantı ilişkilerini otomatik Final BOM'a dönüştürme işi mevcut sistemde tamamlanmış değildir.

---

# wall_150 vs wall_200 — Sistemden doğrulanmış karşılaştırma

## 27. Farklı olanlar

Aşağıdaki farklar mevcut kodda gerçekten vardır:

| Alan | `wall_150` | `wall_200` |
|---|---|---|
| Catalog key | `wall_150` | `wall_200` |
| Label | Düz Panel 150 | Düz Panel 200 |
| `widthCm` | 150 | 200 |
| Recipe ID | `wall-straight-150` | `wall-straight-200` |
| Profil Item | `profile_140_5` | `profile_190` |
| Profil ölçüsü | 140,5 cm | 190 cm |
| Normal panel Item | `panel_147_5` | `panel_197` |
| Normal panel ölçüsü | 147,5 × 47 × 0,8 cm | 197 × 47 × 0,8 cm |
| İç köşe panel Item | `panel_corner_142_5` | `panel_corner_192` |
| İç köşe panel ölçüsü | 142,5 × 47 × 0,8 cm | 192 × 47 × 0,8 cm |
| Wall üzerinde tükettiği nominal genişlik | 150 cm | 200 cm |

Bu genişlik farkı placement/capacity/segment geometrisinde doğal olarak farklı footprint oluşturur.

## 28. Aynı olanlar

Mevcut sistemde aşağıdakiler arasında `wall_150` / `wall_200` farkı yoktur:

| Alan | Durum |
|---|---|
| Type | İkisi de `flat-panel` |
| Contract profile | İkisi de `wall-editable` |
| Panel sıra sayısı | İkisi de 7 |
| Stand yüksekliği | İkisi de 350 cm |
| Duvar derinliği | İkisi de 10 cm |
| Panel default rengi | İkisi de beyaz |
| Color editing | Aynı |
| Image editing | Aynı |
| Placement family | İkisi de `wall` |
| Move snap | İkisi de 50 cm |
| Rotation step | İkisi de 90° |
| Default rotation | İkisi de 0° |
| Side insert | İkisi de `true` |
| Collision strategy | İkisi de `segment` |
| Magnetic snap | İkisi de `standard` |
| Boundary snap | İkisi de `stand-edge` |
| Wall overlay host | İkisi de `true` |
| Ghost davranışı | Aynı silhouette / 0.38 |
| Context menu | Aynı flat-panel akışı |
| Sağ/sol ekleme | Aynı |
| Sağ/sol çoğaltma | Aynı |
| Silme | Aynı |
| Panel selection | Aynı |
| Ctrl/Cmd multi-selection | Aynı |
| Cam | Aynı sistem |
| Lightbox | Aynı sistem |
| Mesh | Aynı sistem |
| Connector başlangıç adedi | İkisinde de 2 |
| Connector tekli adedi | İkisinde de 13 |
| Dikme | İkisinde de `2 × upright_346_5` |
| Normal panel adedi | İkisinde de 7 |
| Profil adedi | İkisinde de 2 |
| BOM policy | İkisinde de `recipe` |
| Project Final BOM eksikliği | İkisini de etkiler |

## 29. Sonuç

Mevcut sistemden çıkan sonuç:

```text
wall_150 ve wall_200 davranış olarak ayrı Item aileleri değildir.
İkisi de aynı flat-panel behavior ve wall-editable contract'ını kullanır.
```

Sistemsel fark **boyut / geometry / width-specific production parts** tarafındadır.

Özellikle BOM farkı:

```text
wall_150
2 × profile_140_5
2 × upright_346_5
7 × panel_147_5
2 × connector_start
13 × connector_single
variant: panel_corner_142_5

wall_200
2 × profile_190
2 × upright_346_5
7 × panel_197
2 × connector_start
13 × connector_single
variant: panel_corner_192
```

Adet yapısı aynıdır. Profil, normal panel ve iç-köşe panelinin ölçü/part kimliği değişir.

Mevcut kodda `wall_150` için `wall_200`den farklı özel rotation, context menu, click, collision, side-insert, ghost veya appearance behavior override'ı bulunmamaktadır.
