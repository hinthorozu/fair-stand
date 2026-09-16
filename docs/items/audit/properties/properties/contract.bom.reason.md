# `contract.bom.reason`

**Özellik ID:** `contract.bom.reason`
**İnsan tarafından anlaşılır adı:** BOM decision-required gerekçesi
**Kategori:** sozlesme
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `Existing module has no canonical BOM policy yet; decide recipe, commercial-item, or explicit exclusion before Final BOM integration.`

## Ne işe yarar

Modül sözleşme profil/assignment alanı. Runtime UI yetkisi ve BOM politikası.

## Canonical owner

- katman: modül sözleşmesi
- dosya: `src/moduleContracts.js`
- sembol: `MODULE_CONTRACT_ASSIGNMENTS + MODULE_CONTRACT_PROFILES`

## Tanımlandığı yerler

- `src/moduleContracts.js` (dosya düzeyi) :14 [define]
- `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` :147 [write-or-literal]
- `src/moduleContracts.js` `NON_CATALOG_MODULE_CONTRACTS` :175 [write-or-literal]

## Okuyan yerler

- `src/moduleContracts.js` (dosya düzeyi) :14 [define]
- `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` :147 [write-or-literal]
- `src/moduleContracts.js` `NON_CATALOG_MODULE_CONTRACTS` :175 [write-or-literal]

## Yazan / değiştiren yerler

- `src/moduleContracts.js` (dosya düzeyi) :14 [define]
- `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` :147 [write-or-literal]
- `src/moduleContracts.js` `NON_CATALOG_MODULE_CONTRACTS` :175 [write-or-literal]

## Default değeri

Kod tablosu default: `MODULE_CONTRACT_ASSIGNMENTS[itemKey].profile` → `MODULE_CONTRACT_PROFILES`. Assignment yoksa `hasExplicitModuleContract` false.

## Override zinciri

Kod tablosu. Runtime override yok.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **19** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `table-chair-set-eames`, `chair`, `table-glass`, `bar-stool`, `indoor-plant-1`, `tv`, `led-floodlight`, `illuminated-foam`
- itemKey: `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `glass_table`, `furniture_bar_stool_classic`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `led_floodlight`, `illuminated-foam`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **19**
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

yok.

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

- `src/moduleContracts.js` (dosya düzeyi) :14 [define]
- `src/moduleContracts.js` `MODULE_CONTRACT_ASSIGNMENTS` :147 [write-or-literal]
- `src/moduleContracts.js` `NON_CATALOG_MODULE_CONTRACTS` :175 [write-or-literal]

- indeks: 83 / 188
