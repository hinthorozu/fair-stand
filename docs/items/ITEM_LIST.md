# Item Yapılandırması — Item Envanteri ve Migration Listesi

Bu belge Item Contract migrationında izlenecek Item envanterini tutar.

Temel model:

- sistemde BOM, üretim veya maliyet hesabına giren her fiziksel öğe `Item`dır,
- başka Item bileşimi içermeyenler **Tekil Item**,
- başka Item'lardan oluşanlar **Bileşik Item**dır,
- "alt Item" ayrı bir sınıf değil, bir Item'ın parent/bileşik Item içindeki kullanım rolüdür,
- migration bottom-up ilerler; ilk pilot `connector_start`tır,
- ilk pilot dışındaki kesin sıra mevcut kod zinciri incelendikçe belirlenir; bu liste tahmini sıra dayatmaz.

## A. Production / alt Item envanteri

Aşağıdaki Item'lar bugün `src/productionParts.js` içinde canonical production metadata olarak bulunan ve bileşik Item reçetelerinde kullanılabilen fiziksel Item'lardır.

| Item key | Type / rol | Migration notu |
|---|---|---|
| `connector_start` | `connector` | **Tamam — ilk pilot** |
| `connector_single` | `connector` | **Tamam — 27 aktif recipe canonical `itemKey`** |
| `connector_double` | `connector` | **Tamam — canonical `itemKey` + explicit connector BOM resolver; fixed parent recipe kullanımı bugün uygulanmıyor, quantity uydurulmaz** |
| `connector_corner` | `connector` | **Tamam — canonical `itemKey` + explicit connector BOM resolver; fixed parent recipe kullanımı bugün uygulanmıyor, quantity uydurulmaz** |
| `upright_346_5` | `upright` | **Tamam — canonical `itemKey`; 18 aktif recipe içinde ×2** |
| `upright_99` | `upright` | **Tamam — canonical `itemKey`; 3 düz bankoda ×4, 3 L bankoda ×5** |
| `upright_49_5` | `upright` | **Tamam — canonical `itemKey`; 3 base-wall içinde ×2, 3 base içinde ×4** |
| `profile_41_5` | `profile` | **Tamam — canonical `itemKey`; 14 doğrulanmış parent recipe quantity parity korunur; `lengthCm=41.5`, `thicknessCm=8`** |
| `profile_91` | `profile` | **Tamam — canonical `itemKey`; 12 doğrulanmış parent recipe quantity parity korunur; `lengthCm=91`, `thicknessCm=8`** |
| `profile_140_5` | `profile` | **Tamam — canonical `itemKey`; 8 doğrulanmış parent recipe quantity parity korunur; `lengthCm=140.5`, `thicknessCm=8`** |
| `profile_190` | `profile` | **Tamam — canonical `itemKey`; 7 aktif 200 cm recipe içinde doğrulanmış miktarlar korunur; `190 × 8 cm` üretim ölçüsü** |
| `panel_48_5` | `panel` | **Tamam — canonical `itemKey`; 13 doğrulanmış parent recipe quantity parity korunur** |
| `panel_98` | `panel` | **Tamam — canonical `itemKey`; 10 doğrulanmış parent recipe quantity parity korunur** |
| `panel_147_5` | `panel` | **Tamam — canonical `itemKey`; 7 doğrulanmış parent recipe quantity parity korunur** |
| `panel_197` | `panel` | **Tamam — canonical `itemKey`; 7 aktif 200 cm recipe içinde doğrulanmış miktarlar korunur** |
| `panel_corner_42_5` | `panel` | **Tamam — canonical `itemKey`; 1 doğrulanmış 50 cm recipe variant referansı; `panel_48_5` miktarı 1:1 replacement** |
| `panel_corner_92` | `panel` | **Tamam — canonical `itemKey`; 7 doğrulanmış 100 cm recipe variant referansı; `panel_98` miktarı 1:1 replacement** |
| `panel_corner_142_5` | `panel` | **Tamam — canonical `itemKey`; 4 doğrulanmış 150 cm recipe variant referansı; `panel_147_5` miktarı 1:1 replacement** |
| `panel_corner_192` | `panel` | **Tamam — canonical `itemKey`; 4 doğrulanmış 200 cm recipe variant referansı; inner-corner BOM'da `panel_197` miktarı 1:1 korunarak replacement** |
| `separator_panel_48_5` | `separator-panel` | Bekliyor |
| `separator_panel_98` | `separator-panel` | Bekliyor |
| `door_100` | `door` | Bekliyor |
| `shelf_100` | `shelf` | Bekliyor |
| `shelf_150` | `shelf` | Bekliyor |
| `shelf_200` | `shelf` | Bekliyor |
| `shelf_leg` | `shelf-accessory` | Bekliyor |
| `showcase_2_100` | `showcase` | Bekliyor |
| `showcase_3_100` | `showcase` | Bekliyor |
| `glass_shelf` | `showcase-accessory` | Bekliyor |
| `counter_top_110_60` | `counter-top` | Bekliyor |
| `counter_top_52_60` | `counter-top` | Bekliyor |
| `counter_top_160_60` | `counter-top` | Bekliyor |
| `counter_top_102_60` | `counter-top` | Bekliyor |
| `counter_top_210_60` | `counter-top` | Bekliyor |
| `counter_top_150_60` | `counter-top` | Bekliyor |
| `base_top_107_50` | `base-top` | **Tamam — canonical `itemKey`; `107 × 50 × 1.8 cm`; BASE_100 + wall_base_100 içinde ×1 quantity parity** |
| `base_top_157_50` | `base-top` | **Tamam — canonical `itemKey`; `157 × 50 × 1.8 cm`; BASE_150 + wall_base_150 içinde ×1 quantity parity** |
| `base_top_206_50` | `base-top` | **Tamam — canonical `itemKey`; `206 × 50 × 1.8 cm`; BASE_200 + wall_base_200 içinde ×1 quantity parity** |

## B. Üst seviye / catalog Item envanteri

Aşağıdaki mevcut liste korunur. Bu Item'ların Tekil/Bileşik ve parametrik durumu her Item incelenirken mevcut koddan doğrulanır; isim veya catalog konumundan tahmin edilmez.

| # | Item key | Adı | Type / Not |
|---:|---|---|---|
| 1 | `wall_200` | Düz Panel 200 | `flat-panel` |
| 2 | `wall_150` | Düz Panel 150 | `flat-panel` |
| 3 | `wall_100` | Düz Panel 100 | `flat-panel` |
| 4 | `wall_50` | Düz Panel 50 | `flat-panel` |
| 5 | `wall_separator_100` | Separatör 100 | `separator` |
| 6 | `wall_separator_50` | Separatör 50 | `separator` |
| 7 | `wall_separator_100_sarmasik` | Separatör 100 Sarmaşık | `separator` |
| 8 | `wall_separator_50_sarmasik` | Separatör 50 Sarmaşık | `separator` |
| 9 | `wall_showcase_100_3` | 3 Gözlü Vitrin 100 | `showcase-3` |
| 10 | `wall_showcase_100_2` | 2 Gözlü Vitrin 100 | `showcase-2` |
| 11 | `wall_shelf_3_200` | Raf 200 · 3 Raf | `shelf` |
| 12 | `wall_shelf_3_150` | Raf 150 · 3 Raf | `shelf` |
| 13 | `wall_shelf_3_100` | Raf 100 · 3 Raf | `shelf` |
| 14 | `wall_shelf_2_200` | Raf 200 · 2 Raf | `shelf` |
| 15 | `wall_shelf_2_150` | Raf 150 · 2 Raf | `shelf` |
| 16 | `wall_shelf_2_100` | Raf 100 · 2 Raf | `shelf` |
| 17 | `wall_base_200` | Panel Bazalı 200 | `base-wall` |
| 18 | `wall_base_150` | Panel Bazalı 150 | `base-wall` |
| 19 | `wall_base_100` | Panel Bazalı 100 | `base-wall` |
| 20 | `DOOR_100` | Depo Kapısı 100 | `door` |
| 21 | `desk_banko_200` | Banko 200 | `counter` |
| 22 | `desk_banko_150` | Banko 150 | `counter` |
| 23 | `desk_banko_100` | Banko 100 | `counter` |
| 24 | `desk_banko_200_L` | Köşe Banko 200×200 | `counter` |
| 25 | `desk_banko_150_L` | Köşe Banko 150×150 | `counter` |
| 26 | `desk_banko_100_L` | Köşe Banko 100×100 | `counter` |
| 27 | `BASE_200` | Baza 200 | `base` |
| 28 | `BASE_150` | Baza 150 | `base` |
| 29 | `BASE_100` | Baza 100 | `base` |
| 30 | `furniture_sofa_set_classic` | Koltuk Takımı | `sofa-set-classic` |
| 31 | `furniture_table_chair_set_eames` | Eames Masa Sandalye Takımı | `table-chair-set-eames` |
| 32 | `furniture_bar_stool_classic` | Bar Taburesi | `bar-stool` |
| 33 | `DEPOT_MINI_FRIDGE_AVANTI` | Mini Buzdolabı | `mini-fridge` |
| 34 | `DEPOT_KETTLE` | Kettle | `kettle` |
| 35 | `DEPOT_COAT_RACK` | Askılık | `coat-rack` |
| 36 | `DEPOT_PLASTIC_TRASH_BIN` | Çöp Kutusu | `plastic-trash-bin` |
| 37 | `EXTRA_INDOOR_PLANT_1` | Yapay Çiçek 1 | `indoor-plant-1` |
| 38 | `EXTRA_LONG_PLANTER_100` | Uzun Saksı 100 | `indoor-plant-1` |
| 39 | `EXTRA_LONG_PLANTER_150` | Uzun Saksı 150 | `indoor-plant-1` |
| 40 | `EXTRA_LONG_PLANTER_200` | Uzun Saksı 200 | `indoor-plant-1` |
| 41 | `TV_42` | TV 42" | `tv` |
| 42 | `TV_55` | TV 55" | `tv` |
| 43 | `VIDEO_WALL_2X2` | Video Wall 2×2 | `tv` |
| 44 | `VIDEO_WALL_3X3` | Video Wall 3×3 | `tv` |
| 45 | `TV_65` | TV 65" | `tv` |
| 46 | `LED_FLOODLIGHT` | LED Projektör | `led-floodlight` |
| 47 | `illuminated-foam` | Işıklı Strafor / Logo | `illuminated-foam` |
| 48 | — | Parke | — |
| 49 | — | Halı | — |
| 50 | — | Karolaj | — |
