# Özel durumlar raporu

Yalnız kodda kanıtlanan sapmalar. Mimari öneri yok.

## Type adı çakışması: `shelf`

- Leaf: `shelf_100` / `shelf_150` / `shelf_200` type `shelf`.
- Parent: `wall_shelf_*` type `shelf` + `composition.mode==='recipe'`.
- `createShelfModuleState` yalnız parent'ı kabul eder (`isWallShelfCompositeItem`).
- `TYPE_BEHAVIORS.shelf` = `WALL_BEHAVIOR` — leaf tahta için factory yok, davranış kullanılmaz.

## `createUprightModuleState` tek itemKey

- Fonksiyon `getItem('upright_346_5')` sabit. `upright_99` ve `upright_49_5` katalogda yok, factory üretmez.

## Profil katalog genişliği ≠ production widthCm (BOM span)

- `createProfileCatalogItem` `widthCm = getStraightWallNominalWidthForProfileItem(itemKey)` (50/100/150/200).
- Item `dimensions.widthCm` 41.5/91/140.5/190. İkisi farklı alanlar.

## `createIndoorPlantModule` çöp kutusunu da çizer

- `createRenderableModule`: `indoor-plant-1` **veya** `plastic-trash-bin` → `createIndoorPlantModule`.
- Fonksiyon `getCommercialItemForType(type)` çağırır; indoor-plant commercial map'te yoktur, state `modelFile` kullanılır.

## VIDEO_WALL sizeInch = 55, TV_55 ile aynı

- `createTvModuleState` sizeInch map'i yalnız 42/55/65 → TV_*. Video wall için `descriptor.itemKey` gerekir. Katalog kartı itemKey taşır.

## Glass/fabric yetkisi itemKey tablosunda değil

- `supportsGlass = selectionMode === 'panel'` (`scene3d.js` getModuleContext ~1801).
- `itemCapabilities` glass/lightbox/mesh her type için false; kapı kanadı yalnız color+image true.

## Persistence şemasız

- `saveProject` `{...project}` put. Item-alan whitelist yok.
- Zemin: `assignStandFloorItem` `stand.itemKey` yazar, `floorType` siler.

## connector_double / connector_corner

- `resolveConnectorBom` var. Düz recipe `connector_start` + `connector_single` kullanır.
- `connector_corner` inner-corner replacement ile gelir (door/showcase variants).
- `connector_double` varsayılan recipe items[] içinde yok — kullanım `resolveConnectorBom` çağıranına bağlı.

## Katalog 64 vs kayıt 104

- Katalog: 64 (`MODULE_CATALOG_KEYS`).
- Kayıt: 104 (`listRegisteredItems`).
- Katalog dışı: upright_99, upright_49_5, panel_48_5, panel_98, panel_147_5, panel_197, panel_corner_42_5, panel_corner_92, panel_corner_142_5, panel_corner_192, separator_panel_48_5, separator_panel_98, connector_start, connector_single, connector_double, connector_corner, door_leaf_100, shelf_100, shelf_150, shelf_200, shelf_leg, showcase_side_94_6_30, showcase_side_143_5_30, showcase_horizontal_87_4_30, glass_shelf, counter_top_110_60, counter_top_52_60, counter_top_160_60, counter_top_102_60, counter_top_210_60, counter_top_150_60, base_top_107_50, base_top_157_50, base_top_206_50, illuminated-foam, karolaj, hali, parke-acik, parke-sari, parke-beton

## Definition dosyası olmayan item'lar

- `wall_200_short_up_2`
- `wall_150_short_up_2`
- `wall_100_short_up_2`
- `wall_50_short_up_2`
- `wall_200_short_up_1`
- `wall_150_short_up_1`
- `wall_100_short_up_1`
- `wall_50_short_up_1`

## itemKey'i test/ altında geçmeyenler


## itemKey'i e2e/ altında geçmeyenler

Adet: 41 / 104

## İkinci tur kontrol özeti

- listRegisteredItems uzunluk 104; yazılan kayıt 104; unique 104. TAMAM
- 9 map Object.keys toplamı 104; kayıt 104. TAMAM
- MODULE_CATALOG object keys 64; MODULE_CATALOG_KEYS 64. TAMAM
- katalog object − keys listesi: eksik yok; fazla yok
- MODULE_CATALOG_GROUPS yassı 64; unique 64
- katalog item 64; MODULE_CONTRACT_ASSIGNMENTS 64
- katalogda olup assignment yok: yok
- assignment olup katalog yok: yok
- yerleşebilir type factory eksiği: yok
- per-item dosya 104; kayıt 104. TAMAM
- dosyası olmayan item: yok
- kayıtsız dosya: yok
- matris TSV satır (header+data) 105; beklenen 105. TAMAM
- matris TSV sütun 189; beklenen 189. TAMAM
- hiç dolu olmayan sütun: 0 (0 olmalı; aksi halde sütun keşfi fazla)
- recipe child getItem miss: yok
- LEAF unit eksik: yok
- definition dosyası olan item: 96 / 104
- definition eksiği (kanıtlı): wall_200_short_up_2, wall_150_short_up_2, wall_100_short_up_2, wall_50_short_up_2, wall_200_short_up_1, wall_150_short_up_1, wall_100_short_up_1, wall_50_short_up_1
- unique type sayısı: 37 → bar-stool, base, base-top, base-wall, chair, coat-rack, coffee-table-classic, connector, counter, counter-top, door, door-leaf, flat-panel, floor, illuminated-foam, indoor-plant-1, kettle, led-floodlight, mini-fridge, panel, plastic-trash-bin, profile, separator, separator-panel, shelf, shelf-accessory, showcase-2, showcase-3, showcase-accessory, showcase-board, sofa-double-classic, sofa-set-classic, sofa-single-classic, table-chair-set-eames, table-glass, tv, upright
- TYPE_BEHAVIORS dışı type (DEFAULT_BEHAVIOR fallback): base-top, connector, counter-top, door-leaf, floor, panel, separator-panel, shelf-accessory, showcase-accessory, showcase-board
- ITEM_LIST.md içinde geçen kayıtlı itemKey unique: 104 / 104
- ITEM_LIST.md'te olmayan kayıtlı item: yok
- connector_double recipe parent adedi: 0 (0 beklenir; ITEM_LIST: fixed parent recipe kullanımı bugün uygulanmıyor)
