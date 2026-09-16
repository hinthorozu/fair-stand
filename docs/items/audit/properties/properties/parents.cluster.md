# `parents.cluster`

**Özellik ID:** `parents.cluster`
**İnsan tarafından anlaşılır adı:** Mobilya küme composition.items parent
**Kategori:** ters-indeks
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `furniture_sofa_set_classic ×2` · `furniture_sofa_set_classic ×1` · `furniture_table_chair_set_eames ×4` · `furniture_table_chair_set_eames ×1`

## Ne işe yarar

Ters indeks: bu itemKey hangi parent recipe/küme/body içinde child.

## Canonical owner

- katman: kanonik küme
- dosya: `src/items.js`
- sembol: `FURNITURE_ITEMS.composition.items`

## Tanımlandığı yerler

- `src/items.js` `getFurnitureClusterQuantity` :372 [read]
- `src/designState.js` (dosya düzeyi) :5 [read]
- `src/designState.js` `if` :414 [write]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]

## Okuyan yerler

- `src/items.js` `getFurnitureClusterQuantity` :372 [read]
- `src/designState.js` (dosya düzeyi) :5 [read]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/selectionFeedback.js` (dosya düzeyi) :1 [read]
- `test/chairEamesContract.test.js` (dosya düzeyi) :46 [test]
- `test/furnitureItemsContract.test.js` `if` :158 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :76 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `if` :414 [write]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]
- `src/selectionFeedback.js` `if` :76 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **5** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `sofa-single-classic`, `sofa-double-classic`, `coffee-table-classic`, `chair`, `table-glass`
- itemKey: `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_coffee_table_classic`, `chair_eames`, `glass_table`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **5**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Runtime-only / derived audit. Ayrı persist alanı yok.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `parents`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **4**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/selectionFeedback.js`

- `src/items.js` `getFurnitureClusterQuantity` :372 [read]
- `src/designState.js` (dosya düzeyi) :5 [read]
- `src/designState.js` `if` :414 [write]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]
- `src/selectionFeedback.js` (dosya düzeyi) :1 [read]
- `src/selectionFeedback.js` `if` :76 [write]
- `test/chairEamesContract.test.js` (dosya düzeyi) :46 [test]
- `test/furnitureItemsContract.test.js` `if` :158 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :76 [test]

- indeks: 159 / 188
