# FAIR-STAND — 104 Item Gerçek Özellik Grupları

Bu rapor, mevcut audit çıktıları ve gerçek runtime davranışları temel alınarak hazırlanmıştır.

**Kritik kural:** Generic fallback, type default veya sistem geneli davranış bir Item'da gerçekten kullanılmıyorsa o Item'ın gerçek özelliği sayılmaz.

Örnek: `panel_197` için audit tablosunda görünen `rotation=90`, `moveSnap=50`, `placement=wall` değerleri gerçek standalone Item davranışı değildir; `DEFAULT_BEHAVIOR` fallback'inden gelir. `panel_197` sahneye tek başına çıkan bir modül değildir.

---

## 1. Recipe-only dikmeler

**Item'lar**
- `upright_99`
- `upright_49_5`

**Gerçek özellikler**
- uzunluk / ölçüler
- malzeme
- üretim/BOM bilgileri

**Sahnede**
- standalone move yok
- standalone rotate yok
- standalone color/image yok
- parent recipe içinde kullanılır

---

## 2. Recipe-only düz paneller

**Item'lar**
- `panel_48_5`
- `panel_98`
- `panel_147_5`
- `panel_197`

**Gerçek özellikler**
- width
- height
- thickness
- material
- `panelRole=straight`

**Sahnede**
- standalone move yok
- standalone rotate yok
- standalone image yok
- standalone color yok
- parent Item'ın fiziksel bileşeni olarak kullanılır

---

## 3. Recipe-only köşe panelleri

**Item'lar**
- `panel_corner_42_5`
- `panel_corner_92`
- `panel_corner_142_5`
- `panel_corner_192`

**Gerçek özellikler**
- width
- height
- thickness
- material
- inner-corner panel rolü

**Sahnede**
- standalone davranış yok
- parent recipe içinde kullanılır

---

## 4. Separatör leaf panelleri

**Item'lar**
- `separator_panel_48_5`
- `separator_panel_98`

**Gerçek özellikler**
- ölçüler
- malzeme
- default color

**Sahnede**
- standalone placement/rotate yok
- parent separatör Item'larında kullanılır

---

## 5. Connector leaf Item'ları

**Item'lar**
- `connector_start`
- `connector_single`
- `connector_double`
- `connector_corner`

**Gerçek özellikler**
- `connectorType`
- unit
- BOM/relation bilgileri

**Sahnede**
- standalone renderer/factory yok
- parent recipe içinde kullanılır

---

## 6. Diğer recipe-only fiziksel parçalar

**Item'lar**
- `door_leaf_100`
- `shelf_100`
- `shelf_150`
- `shelf_200`
- `shelf_leg`
- `showcase_side_94_6_30`
- `showcase_side_143_5_30`
- `showcase_horizontal_87_4_30`
- `glass_shelf`
- `counter_top_110_60`
- `counter_top_52_60`
- `counter_top_160_60`
- `counter_top_102_60`
- `counter_top_210_60`
- `counter_top_150_60`
- `base_top_107_50`
- `base_top_157_50`
- `base_top_206_50`

**Gerçek özellikler**
- kendi ölçüleri
- malzeme
- gerektiğinde defaultColor / model / rol

**Sahnede**
- parent Item içinde kullanılır
- standalone move/rotate yok

**Özel durum**
- `door_leaf_100`, parent kapı içinde editable surface state'e dönüşür ve renk/image taşıyabilir.

---

## 7. Standalone dikme / profil Item'ları

**Item'lar**
- `upright_346_5`
- `profile_41_5`
- `profile_91`
- `profile_140_5`
- `profile_190`

**Gerçek özellikler**
- length / dimensions
- material
- defaultColor
- catalog/renderer bilgileri

**Sahnede**
- move
- rotate
- color
- mevcut sistemde image

**Placement**
- `upright_346_5`: free
- `profile_*`: wall

**Not**
- Mevcut sistemde `free-editable` contract nedeniyle image açık. Hedef modelde bunun kalıp kalmayacağı ayrıca kararlaştırılmalı.

---

## 8. Sabit ticari GLB Item'ları

**Item'lar**
- `COAT_RACK`
- `KETTLE`
- `MINI_FRIDGE_AVANTI`
- `PLASTIC_TRASH_BIN`

**Gerçek özellikler**
- dimensions
- modelFile
- model/renderer parametreleri

**Sahnede**
- free move
- move snap: 10 cm
- rotate
- rotation step: 90°
- color yok
- image yok

---

## 9. Renklenebilir mobilyalar

**Item'lar**
- `furniture_sofa_set_classic`
- `furniture_sofa_single_classic`
- `furniture_sofa_double_classic`
- `furniture_table_chair_set_eames`
- `chair_eames`
- `furniture_bar_stool_classic`

**Sahnede**
- free move
- color
- rotate
- image yok

**Rotation**
- `furniture_sofa_single_classic`: 45°
- `furniture_bar_stool_classic`: 45°
- diğerleri: 90°

---

## 10. Sabit mobilyalar

**Item'lar**
- `furniture_coffee_table_classic`
- `glass_table`

**Sahnede**
- free move
- rotate
- color yok
- image yok

---

## 11. Bitki / saksı Item'ları

**Item'lar**
- `EXTRA_INDOOR_PLANT_1`
- `EXTRA_LONG_PLANTER_100`
- `EXTRA_LONG_PLANTER_150`
- `EXTRA_LONG_PLANTER_200`

**Sahnede**
- free move
- rotate
- uzun saksılar color alır
- `EXTRA_INDOOR_PLANT_1` color almaz
- image yok

---

## 12. TV / Video Wall

**Item'lar**
- `TV_42`
- `TV_55`
- `TV_65`
- `VIDEO_WALL_2X2`
- `VIDEO_WALL_3X3`

**Gerçek özellikler**
- ekran ölçüleri
- sizeInch
- video-wall rows/cols gibi ürün verileri

**Sahnede**
- wall-overlay placement
- move snap: 10 cm
- rotate
- kullanıcı color atamaz
- kullanıcı image atamaz
- ekran görünümünü renderer yönetir

---

## 13. LED Projektör

**Item**
- `led_floodlight`

**Sahnede**
- top placement
- move snap: 20 cm
- rotate
- rotation step: 90°
- state-backed color/light görünümü

---

## 14. Işıklı Strafor

**Item**
- `illuminated-foam`

**Sahnede**
- wall-overlay placement
- move
- rotate
- zorunlu image
- `haloColor`
- resize

---

## 15. Zemin Item'ları

**Item'lar**
- `karolaj`
- `hali`
- `parke-acik`
- `parke-sari`
- `parke-beton`

**Gerçek özellikler**
- floor kimliği
- görünüm/defaultColor/paintable gibi zemin verileri

**Sahnede**
- modül değildir
- floor seçimi vardır
- `karolaj` ve `hali` renklenebilir
- parke seçenekleri sabittir
- move/rotate yok

---

## 16. Wall / Short-Up paneller

**Item'lar**
- `wall_50`
- `wall_100`
- `wall_150`
- `wall_200`
- `wall_50_short_up_1`
- `wall_100_short_up_1`
- `wall_150_short_up_1`
- `wall_200_short_up_1`
- `wall_50_short_up_2`
- `wall_100_short_up_2`
- `wall_150_short_up_2`
- `wall_200_short_up_2`

**Gerçek özellikler**
- width
- composition / recipe
- child Item ilişkileri

**Sahnede**
- wall placement
- move snap: 50 cm
- rotate 90°
- color
- image
- panel seçiminde glass
- panel seçiminde lightbox fabric
- panel seçiminde mesh fabric

---

## 17. Bazalı Wall

**Item'lar**
- `wall_base_100`
- `wall_base_150`
- `wall_base_200`

**Sahnede**
- wall placement
- move/rotate
- color
- image
- panel seçiminde glass/lightbox/mesh

---

## 18. Raflı Wall

**Item'lar**
- `wall_shelf_2_100`
- `wall_shelf_2_150`
- `wall_shelf_2_200`
- `wall_shelf_3_100`
- `wall_shelf_3_150`
- `wall_shelf_3_200`

**Gerçek özellikler**
- width
- shelfCount
- recipe/composition

**Sahnede**
- wall placement
- move/rotate
- color
- image
- glass/lightbox/mesh
- raf altı ışık aç/kapat

---

## 19. Vitrin

**Item'lar**
- `wall_showcase_100_2`
- `wall_showcase_100_3`

**Gerçek özellikler**
- width
- eyeCount
- bodyItems
- recipe/composition

**Sahnede**
- wall placement
- move/rotate
- color
- image
- glass/lightbox/mesh

**Not**
- Mevcut sistemde ayrıca vitrin spot-light özelliği yok.

---

## 20. Kapı

**Item**
- `door_100`

**Gerçek özellikler**
- width
- recipe/composition
- `door_leaf_100` ilişkisi

**Sahnede**
- wall placement
- move/rotate
- üst paneller ve kapı kanadında color/image
- panel seçiminde glass/lightbox/mesh

---

## 21. Separatör Parent Item'ları

**Item'lar**
- `wall_separator_50`
- `wall_separator_100`
- `wall_separator_50_sarmasik`
- `wall_separator_100_sarmasik`

**Sahnede**
- wall placement
- move/rotate
- color
- image yok
- glass/fabric yok

---

## 22. Baza

**Item'lar**
- `BASE_100`
- `BASE_150`
- `BASE_200`

**Sahnede**
- free placement
- move
- rotate 90°
- color
- image

---

## 23. Düz Banko

**Item'lar**
- `desk_banko_100`
- `desk_banko_150`
- `desk_banko_200`

**Sahnede**
- free placement
- move
- rotation step: 45°
- color
- image

---

## 24. L Banko

**Item'lar**
- `desk_banko_100_L`
- `desk_banko_150_L`
- `desk_banko_200_L`

**Gerçek özellikler**
- shape = L
- width/depth/height
- recipe/composition

**Sahnede**
- free placement
- move
- rotation step: 90°
- default rotation: 270°
- color
- image

---

# Ortak gerçek mekanizmalar

104 Item'ın farklı kombinasyonlarla kullandığı temel mekanizmalar yaklaşık olarak şu ailelerde toplanıyor:

- placement
- move / snap
- rotation
- color
- image
- glass mode
- fabric / lightbox mode
- mesh mode
- fabric lighting
- shelf lighting
- resize
- delete
- duplicate
- side insert
- composition / BOM
- model rendering
- procedural rendering
- overlay rendering
- floor selection / floor color
- persistence / project instance override
- selection / multi-selection

Bu mekanizmalar Item'a özel ayrı ayrı implement edilmemeli; hedef yapıda her mekanizma için tek canonical method/engine olmalı, Item ise hangi mekanizmayı hangi parametrelerle kullanacağını tanımlamalıdır.

---

# Context Menu hardcode notu

Mevcut sistemde context menu tarafında bazı davranışlar Item config yerine kod koşullarıyla yönetiliyor.

Örnekler:
- `Sil` ve `Çoğalt Sağ/Sol` butonları genel olarak oluşturuluyor.
- glass/lightbox/mesh `supportsGlass` / `supportsFabric` üzerinden koşullu.
- raf ışığı doğrudan `moduleType === 'shelf'`.
- strafor resize doğrudan `moduleType === 'illuminated-foam'`.
- sağ/sol ekleme `allowSideInsert` behavior'ına bağlı.

Hedefte bu tür Item'a özgü kullanılabilirlik kararları Item config/DB tarafından belirlenmeli; frontend yalnız generic methodu çalıştırmalıdır.

---

# DB öncesi hedef mimari

Önce mevcut sistem tekil mekanizmalara dönüştürülmeli:

```text
Item / Instance Config
        ↓
Canonical Method
        ↓
Runtime / Renderer / State
```

Örnek:

```text
rotation.enabled = true
rotation.stepDeg = 45
        ↓
rotate(...)
```

```text
color.enabled = true
defaultColor = "#ffffff"
        ↓
applyColor(...)
```

Son aşamada Item'a özgü parametreler DB'ye taşınır; method/algoritma kodda kalır.
