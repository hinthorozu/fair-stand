# `static.visualRotationYDeg`

**Özellik ID:** `static.visualRotationYDeg`
**İnsan tarafından anlaşılır adı:** static.visualRotationYDeg
**Kategori:** kanonik-kayit
**Veri tipi:** number (derece)
**Birim:** derece
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `-90` · `-135` · `-45`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `COMMERCIAL_ITEMS` :139 [write-or-literal]
- `src/items.js` `FURNITURE_ITEMS` :176 [write-or-literal]
- `src/designState.js` `if` :411 [read]
- `src/designState.js` `if` :412 [write]
- `src/designState.js` `createCommercialModuleState` :460 [write]

## Okuyan yerler

- `src/designState.js` `if` :411 [read]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :65 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :53 [test]
- `test/furnitureItemsContract.test.js` `if` :181 [test]
- `test/plasticTrashBinTopLabel.test.js` (dosya düzeyi) :17 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :30 [test]

## Yazan / değiştiren yerler

- `src/items.js` `COMMERCIAL_ITEMS` :139 [write-or-literal]
- `src/items.js` `FURNITURE_ITEMS` :176 [write-or-literal]
- `src/designState.js` `if` :412 [write]
- `src/designState.js` `createCommercialModuleState` :460 [write]
- `src/scene3d.js` `if` :5080 [write]
- `src/scene3d.js` `createSofaPieceClassicModule` :6379 [write-or-literal]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **3** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `plastic-trash-bin`, `sofa-single-classic`, `sofa-double-classic`
- itemKey: `PLASTIC_TRASH_BIN`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **3**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

Model Y rotasyonu (çöp kutusu, koltuk).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

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

- src dosya sayısı (unique): **3**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/scene3d.js`

- `src/items.js` `COMMERCIAL_ITEMS` :139 [write-or-literal]
- `src/items.js` `FURNITURE_ITEMS` :176 [write-or-literal]
- `src/designState.js` `if` :411 [read]
- `src/designState.js` `if` :412 [write]
- `src/designState.js` `createCommercialModuleState` :460 [write]
- `src/scene3d.js` `if` :5080 [write]
- `src/scene3d.js` `createSofaPieceClassicModule` :6379 [write-or-literal]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :65 [test]
- `test/furnitureItemsContract.test.js` (dosya düzeyi) :53 [test]
- `test/furnitureItemsContract.test.js` `if` :181 [test]
- `test/plasticTrashBinTopLabel.test.js` (dosya düzeyi) :17 [test]
- `test/sofaClassicPiecesContract.test.js` (dosya düzeyi) :30 [test]

- indeks: 46 / 188
