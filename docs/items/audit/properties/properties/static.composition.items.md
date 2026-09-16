# `static.composition.items`

**Özellik ID:** `static.composition.items`
**İnsan tarafından anlaşılır adı:** Kanonik composition: items
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `"[{""itemKey"":""furniture_sofa_double_classic"",""quantity"":1},{""itemKey"":""furniture_sofa_single_classic"",""quantity"":2},{""itemKey"":""furniture_coffee_table_classic"",""quantity"":1}]"` · `"[{""itemKey"":""glass_table"",""quantity"":1},{""itemKey"":""chair_eames"",""quantity"":4}]"`

## Ne işe yarar

Mobilya kümesi child listesi. `resolveItemBom` bunu okumaz (`mode` recipe değil).

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `FURNITURE_ITEMS` :159 [define]
- `src/items.js` `getFurnitureClusterQuantity` :372 [read]
- `src/items.js` `COMPOSITE_ITEMS` :500 [define]
- `src/items.js` (dosya düzeyi) :583 [define]
- `src/designState.js` (dosya düzeyi) :5 [read]
- `src/designState.js` `if` :414 [write]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]
- `src/moduleContracts.js` `MODULE_CONTRACT_PROFILES` :33 [write-or-literal]
- `src/moduleContracts.js` `mergeProfile` :186 [write-or-literal]

## Okuyan yerler

- `src/items.js` `getFurnitureClusterQuantity` :372 [read]
- `src/designState.js` (dosya düzeyi) :5 [read]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/selectionFeedback.js` (dosya düzeyi) :1 [read]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :34 [test]
- `test/systemChangeGateLocalDiff.test.js` `createFixtureContract` :70 [test]

## Yazan / değiştiren yerler

- `src/items.js` `FURNITURE_ITEMS` :159 [define]
- `src/items.js` `COMPOSITE_ITEMS` :500 [define]
- `src/items.js` (dosya düzeyi) :583 [define]
- `src/designState.js` `if` :414 [write]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]
- `src/moduleContracts.js` `MODULE_CONTRACT_PROFILES` :33 [write-or-literal]
- `src/moduleContracts.js` `mergeProfile` :186 [write-or-literal]
- `src/itemBom.js` `if` :44 [write-or-literal]
- `src/selectionFeedback.js` `if` :76 [write]

## Default değeri

Item default: yalnız COMPOSITE_ITEMS (recipe) veya FURNITURE cluster `items`. Global composition default yok.

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **2** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `sofa-set-classic`, `table-chair-set-eames`
- itemKey: `furniture_sofa_set_classic`, `furniture_table_chair_set_eames`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **2**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `static`

## Değiştirmenin yan etkileri

Kanonik kayıt değişirse catalog, factory, BOM, davranış çözümü ve test kilitleri birlikte etkilenir. Bu turda değiştirilmedi.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **6**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/moduleContracts.js`, `src/itemBom.js`, `src/selectionFeedback.js`

- `src/items.js` `FURNITURE_ITEMS` :159 [define]
- `src/items.js` `getFurnitureClusterQuantity` :372 [read]
- `src/items.js` `COMPOSITE_ITEMS` :500 [define]
- `src/items.js` (dosya düzeyi) :583 [define]
- `src/designState.js` (dosya düzeyi) :5 [read]
- `src/designState.js` `if` :414 [write]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/catalog.js` `furniture_table_chair_set_eames_DIMENSIONS` :152 [write-or-literal]
- `src/moduleContracts.js` `MODULE_CONTRACT_PROFILES` :33 [write-or-literal]
- `src/moduleContracts.js` `mergeProfile` :186 [write-or-literal]
- `src/itemBom.js` `if` :44 [write-or-literal]
- `src/selectionFeedback.js` (dosya düzeyi) :1 [read]
- `src/selectionFeedback.js` `if` :76 [write]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :34 [test]
- `test/systemChangeGateLocalDiff.test.js` `createFixtureContract` :70 [test]

- indeks: 8 / 188
