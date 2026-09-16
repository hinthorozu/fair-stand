# `contract.bom.mode`

**Özellik ID:** `contract.bom.mode`
**İnsan tarafından anlaşılır adı:** BOM politika kipi
**Kategori:** sozlesme
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** `recipe` | `self` | `decision-required`

## Ne işe yarar

recipe | self | decision-required. Final BOM entegrasyon politikası; renderer geometrisinden türetmez.

## Canonical owner

- katman: modül sözleşmesi
- dosya: `src/moduleContracts.js`
- sembol: `MODULE_CONTRACT_ASSIGNMENTS + MODULE_CONTRACT_PROFILES`

## Tanımlandığı yerler

- `src/moduleContracts.js` (dosya düzeyi) :4 [define]
- `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` :99 [write-or-literal]
- `src/moduleContracts.js` `NON_CATALOG_MODULE_CONTRACTS` :175 [write-or-literal]

## Okuyan yerler

- `src/moduleContracts.js` (dosya düzeyi) :4 [define]
- `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` :99 [write-or-literal]
- `src/moduleContracts.js` `NON_CATALOG_MODULE_CONTRACTS` :175 [write-or-literal]

## Yazan / değiştiren yerler

- `src/moduleContracts.js` (dosya düzeyi) :4 [define]
- `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` :99 [write-or-literal]
- `src/moduleContracts.js` `NON_CATALOG_MODULE_CONTRACTS` :175 [write-or-literal]

## Default değeri

Kod tablosu default: `MODULE_CONTRACT_ASSIGNMENTS[itemKey].profile` → `MODULE_CONTRACT_PROFILES`. Assignment yoksa `hasExplicitModuleContract` false.

## Override zinciri

Kod tablosu. Runtime override yok.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **65** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `shelf`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **65**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod tablosu. Persist yok (her load'da type/itemKey ile yeniden çözülür).

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

validation yok (tablo/audit).

## Bağımlılıklar

- kök katman: `contract`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

SYSTEM_INTERNAL

## CRUD gerekçesi

`MODULE_CONTRACT_ASSIGNMENTS` / `MODULE_CONTRACT_PROFILES` dondurulmuş politika tablosu. Kullanıcı değiştirmez.

## Kanıt

- src dosya sayısı (unique): **1**
- src dosyaları: `src/moduleContracts.js`

- `src/moduleContracts.js` (dosya düzeyi) :4 [define]
- `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` :99 [write-or-literal]
- `src/moduleContracts.js` `NON_CATALOG_MODULE_CONTRACTS` :175 [write-or-literal]

- indeks: 81 / 188
