# İkinci tur kontrol

Bu dosya üreticinin ikinci geçişinde yazılır. Tahmin yok.

## Sayı doğrulaması

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

## Definition eksiği (8 short-up parent)

Runtime `COMPOSITE_ITEMS` kaydı var; `docs/items/definitions/<itemKey>.md` yok:

- `wall_200_short_up_2`
- `wall_150_short_up_2`
- `wall_100_short_up_2`
- `wall_50_short_up_2`
- `wall_200_short_up_1`
- `wall_150_short_up_1`
- `wall_100_short_up_1`
- `wall_50_short_up_1`

`docs/items/definitions/parke.md` family notu vardır; `itemKey` değildir (`listRegisteredItems` içinde yok).

## BOM resolveItemBom hata verenler

- `furniture_sofa_set_classic`: Missing canonical unit for leaf Item: furniture_sofa_set_classic.
- `furniture_sofa_single_classic`: Missing canonical unit for leaf Item: furniture_sofa_single_classic.
- `furniture_sofa_double_classic`: Missing canonical unit for leaf Item: furniture_sofa_double_classic.
- `furniture_coffee_table_classic`: Missing canonical unit for leaf Item: furniture_coffee_table_classic.
- `furniture_table_chair_set_eames`: Missing canonical unit for leaf Item: furniture_table_chair_set_eames.
- `chair_eames`: Missing canonical unit for leaf Item: chair_eames.
- `glass_table`: Missing canonical unit for leaf Item: glass_table.
- `furniture_bar_stool_classic`: Missing canonical unit for leaf Item: furniture_bar_stool_classic.
- `EXTRA_INDOOR_PLANT_1`: Missing canonical unit for leaf Item: EXTRA_INDOOR_PLANT_1.
- `EXTRA_LONG_PLANTER_100`: Missing canonical unit for leaf Item: EXTRA_LONG_PLANTER_100.
- `EXTRA_LONG_PLANTER_150`: Missing canonical unit for leaf Item: EXTRA_LONG_PLANTER_150.
- `EXTRA_LONG_PLANTER_200`: Missing canonical unit for leaf Item: EXTRA_LONG_PLANTER_200.
- `TV_42`: Missing canonical unit for leaf Item: TV_42.
- `TV_55`: Missing canonical unit for leaf Item: TV_55.
- `TV_65`: Missing canonical unit for leaf Item: TV_65.
- `VIDEO_WALL_2X2`: Missing canonical unit for leaf Item: VIDEO_WALL_2X2.
- `VIDEO_WALL_3X3`: Missing canonical unit for leaf Item: VIDEO_WALL_3X3.
- `led_floodlight`: Missing canonical unit for leaf Item: led_floodlight.
- `illuminated-foam`: Missing canonical unit for leaf Item: illuminated-foam.
- `karolaj`: Missing canonical unit for leaf Item: karolaj.
- `hali`: Missing canonical unit for leaf Item: hali.
- `parke-acik`: Missing canonical unit for leaf Item: parke-acik.
- `parke-sari`: Missing canonical unit for leaf Item: parke-sari.
- `parke-beton`: Missing canonical unit for leaf Item: parke-beton.

## itemKey test/ altında geçmeyenler

Adet: 0


## itemKey e2e/ altında geçmeyenler

Adet: 41 / 104

Tam liste özel durum raporunda. E2E çoğu aile sözleşmesiyle type/katalog üzerinden gider; itemKey string kilidi olmayabilir.

## Özellik sütunu

188 sütun. Matris TSV'de itemKey + bu sütunlar.
