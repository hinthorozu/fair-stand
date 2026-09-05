# Fair Stand — Sistem Modül Kataloğu Referansı

Bu dosya insan/AI için **okunabilir katalog indeksi**dir. Runtime source-of-truth değildir.

## Canonical sahipler

- Katalog kimliği, label, type ve nominal ölçüler: `src/catalog.js`
- Modül contract/profile/BOM politikası: `src/moduleContracts.js`
- Gerçek BOM reçeteleri: `src/moduleRecipes.js`
- Üretim parçaları ve gerçek üretim ölçüleri: `src/productionParts.js`
- State factory/defaultları: `src/designState.js`
- Placement/behavior: `src/moduleBehavior.js` + placement core

**Kural:** Bu dokümanda üretim reçetesi miktarları veya fiziksel parça ölçüleri ikinci bir canonical veri seti olarak tutulmaz. Böyle bir bilgi gerektiğinde yukarıdaki kod sahipleri okunur.

## Güncel katalog özeti

Bu snapshot `ROG` üzerindeki `MODULE_CATALOG_KEYS` ve `MODULE_CONTRACT_ASSIGNMENTS` ile eşleşmek zorundadır; `test/systemModuleCatalogDoc.test.js` drift olduğunda CI'yi kırar.

- Catalog entries: **46**
- BOM mode `recipe`: **29**
- BOM mode `decision-required`: **17**
- Katalog dışı explicit runtime module: **1** (`illuminated-foam`)
- Katalog dışı module BOM mode `decision-required`: **1**

> `decision-required` bir hata etiketi değildir. Recipe, commercial-item veya explicit exclusion ürün/üretim kararı verilmeden Final BOM politikası uydurulmayacağı anlamına gelir.

## Katalog anahtarları

Aşağıdaki blok test tarafından `MODULE_CATALOG_KEYS` ile **sıra dahil birebir** karşılaştırılır.

<!-- catalog-keys:start -->
- `wall_200`
- `wall_150`
- `wall_100`
- `wall_50`
- `wall_separator_100`
- `wall_separator_50`
- `wall_separator_100_sarmasik`
- `wall_separator_50_sarmasik`
- `wall_showcase_100_3`
- `wall_showcase_100_2`
- `wall_shelf_3_200`
- `wall_shelf_3_150`
- `wall_shelf_3_100`
- `wall_shelf_2_200`
- `wall_shelf_2_150`
- `wall_shelf_2_100`
- `wall_base_200`
- `wall_base_150`
- `wall_base_100`
- `DOOR_100`
- `desk_banko_200`
- `desk_banko_150`
- `desk_banko_100`
- `desk_banko_200_L`
- `desk_banko_150_L`
- `desk_banko_100_L`
- `BASE_200`
- `BASE_150`
- `BASE_100`
- `furniture_sofa_set_classic`
- `furniture_table_chair_set_eames`
- `furniture_bar_stool_classic`
- `DEPOT_MINI_FRIDGE_AVANTI`
- `DEPOT_KETTLE`
- `DEPOT_COAT_RACK`
- `DEPOT_PLASTIC_TRASH_BIN`
- `EXTRA_INDOOR_PLANT_1`
- `EXTRA_LONG_PLANTER_100`
- `EXTRA_LONG_PLANTER_150`
- `EXTRA_LONG_PLANTER_200`
- `TV_42`
- `TV_55`
- `VIDEO_WALL_2X2`
- `VIDEO_WALL_3X3`
- `TV_65`
- `LED_FLOODLIGHT`
<!-- catalog-keys:end -->

## Güncel aile görünümü

Bu bölüm navigasyon içindir; ölçü/recipe source-of-truth değildir.

### Panel & Duvar

`wall_200`, `wall_150`, `wall_100`, `wall_50`, `wall_separator_100`, `wall_separator_50`, `wall_separator_100_sarmasik`, `wall_separator_50_sarmasik`, `wall_base_200`, `wall_base_150`, `wall_base_100`, `DOOR_100`

### Raf & Vitrin

`wall_showcase_100_3`, `wall_showcase_100_2`, `wall_shelf_3_200`, `wall_shelf_3_150`, `wall_shelf_3_100`, `wall_shelf_2_200`, `wall_shelf_2_150`, `wall_shelf_2_100`

### Banko & Baza

`desk_banko_200`, `desk_banko_150`, `desk_banko_100`, `desk_banko_200_L`, `desk_banko_150_L`, `desk_banko_100_L`, `BASE_200`, `BASE_150`, `BASE_100`

### Mobilya / Depo / Bitki

`furniture_sofa_set_classic`, `furniture_table_chair_set_eames`, `furniture_bar_stool_classic`, `DEPOT_MINI_FRIDGE_AVANTI`, `DEPOT_KETTLE`, `DEPOT_COAT_RACK`, `DEPOT_PLASTIC_TRASH_BIN`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`

### Medya / Işık

`TV_42`, `TV_55`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`, `TV_65`, `LED_FLOODLIGHT`

## BOM politika özeti

### `recipe` — 29 katalog kaydı

Duvar/panel, separatör, vitrin, raf, panel bazalı duvar, depo kapısı, düz/L banko ve baza ailelerinin contract'ı `recipe` modundadır. Gerçek recipe çözümü `src/moduleRecipes.js` tarafından yapılır ve contract testleri recipe-backed kayıtların gerçekten resolve olduğunu doğrular.

### `decision-required` — 17 katalog kaydı

Şu katalog aileleri için Final BOM sınıflandırması henüz ürün/üretim kararı bekler:

- mobilya setleri / bar taburesi
- depo mini buzdolabı / kettle / askılık / çöp kutusu
- yapay bitki / uzun saksılar
- TV 42 / 55 / 65
- Video Wall 2×2 / 3×3
- LED projektör

Bu kayıtlar için bu doküman **commercial-item / recipe / excluded** kararı uydurmaz. Canonical mevcut durum `src/moduleContracts.js` içindeki `decision-required` politikasıdır.

## Katalog dışı runtime modülü

`illuminated-foam` katalog anahtarı değildir. `src/moduleContracts.js` içindeki `NON_CATALOG_MODULE_CONTRACTS` üzerinden explicit contract taşır ve BOM politikası şu anda `decision-required` durumundadır.

## Değişiklik kuralı

Yeni katalog modülü veya katalog kimliği değişikliği yapıldığında:

1. canonical değişiklik `src/catalog.js` ve ilgili contract sahiplerinde yapılır;
2. gerekli state/behavior/renderer/persistence/BOM etkileri change contract'ta beyan edilir;
3. bu dokümandaki katalog anahtarı snapshot'ı güncellenir;
4. `npm test` içindeki `systemModuleCatalogDoc` regresyonu snapshot ile runtime katalog arasında drift olmadığını doğrular;
5. full test + build yeşil olmadan değişiklik tamamlanmış sayılmaz.
