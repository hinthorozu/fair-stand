# `featureContracts`

**Özellik ID:** `featureContracts`
**İnsan tarafından anlaşılır adı:** Otomatik sahne feature sözleşmesi eşleşmesi
**Kategori:** sahne-feature
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `automatic-depot via contentCatalogKeys` · `automatic-depot via creates.kinds` · `automatic-wall via creates.kinds`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: feature contract
- dosya: `src/featureContracts.js`
- sembol: `FEATURE_CONTRACTS`

## Tanımlandığı yerler

- `src/featureContracts.js` `FEATURE_CONTRACTS` :1 [define]
- `src/featureContracts.js` `FEATURE_CONTRACTS` :2 [write-or-literal]
- `src/featureContracts.js` `getFeatureContract` :74 [read]

## Okuyan yerler

- `src/main.js` (dosya düzeyi) :13 [read]
- `src/main.js` `if` :1074 [read]
- `src/featureContracts.js` `getFeatureContract` :74 [read]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :77 [read]
- `test/automaticWall.test.js` (dosya düzeyi) :6 [test]
- `test/depotBackWallRecipe.test.js` (dosya düzeyi) :3 [test]
- `test/systemDevelopmentContract.test.js` (dosya düzeyi) :14 [test]
- `test/systemDevelopmentContract.test.js` `for` :87 [test]

## Yazan / değiştiren yerler

- `src/main.js` `if` :1064 [write]
- `src/featureContracts.js` `FEATURE_CONTRACTS` :1 [define]
- `src/featureContracts.js` `FEATURE_CONTRACTS` :2 [write-or-literal]

## Default değeri

Owner katmanındaki tanım; ayrı default sabiti bu id için yok.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **17** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `door`, `flat-panel`
- itemKey: `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `door_100`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **17**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

BELIRSIZ

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `featureContracts`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

SYSTEM_INTERNAL

## CRUD gerekçesi

`FEATURE_CONTRACTS` sahne-composition kaydı. Stage seçenekleri tetikler; item form alanı değil.

## Kanıt

- src dosya sayısı (unique): **3**
- src dosyaları: `src/main.js`, `src/featureContracts.js`, `src/systemChangeContract.js`

- `src/main.js` (dosya düzeyi) :13 [read]
- `src/main.js` `if` :1064 [write]
- `src/main.js` `if` :1074 [read]
- `src/featureContracts.js` `FEATURE_CONTRACTS` :1 [define]
- `src/featureContracts.js` `FEATURE_CONTRACTS` :2 [write-or-literal]
- `src/featureContracts.js` `getFeatureContract` :74 [read]
- `src/systemChangeContract.js` `SOURCE_FILE_REQUIRED_DOMAINS` :77 [read]
- `test/automaticWall.test.js` (dosya düzeyi) :6 [test]
- `test/depotBackWallRecipe.test.js` (dosya düzeyi) :3 [test]
- `test/systemDevelopmentContract.test.js` (dosya düzeyi) :14 [test]
- `test/systemDevelopmentContract.test.js` `for` :87 [test]

- indeks: 183 / 188
