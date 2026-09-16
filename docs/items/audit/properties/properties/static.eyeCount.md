# `static.eyeCount`

**Özellik ID:** `static.eyeCount`
**İnsan tarafından anlaşılır adı:** Vitrin göz sayısı
**Kategori:** kanonik-kayit
**Veri tipi:** number
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `2` · `3`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :935 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :180 [write-or-literal]
- `src/designState.js` `if` :846 [write]
- `src/catalog.js` `MODULE_CATALOG` :283 [write-or-literal]

## Okuyan yerler

- `src/scene3d.js` `if` :7453 [read]
- `src/rawBomDebug.js` `if` :125 [read]
- `src/selectionFeedback.js` `if` :60 [read]
- `test/showcaseBodyColorRegression.test.js` (dosya düzeyi) :13 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :22 [test]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/wallShowcaseItemContract.test.js` `for` :24 [test]
- `e2e/wall-showcase-item-contract.spec.mjs` `for` :80 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :935 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :180 [write-or-literal]
- `src/designState.js` `if` :846 [write]
- `src/catalog.js` `MODULE_CATALOG` :283 [write-or-literal]
- `src/scene3d.js` `if` :7452 [write]
- `src/scene3d.js` `for` :7599 [write]
- `src/rawBomDebug.js` `if` :123 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **2** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `showcase-2`, `showcase-3`
- itemKey: `wall_showcase_100_2`, `wall_showcase_100_3`

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

- src dosya sayısı (unique): **6**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/rawBomDebug.js`, `src/selectionFeedback.js`

- `src/items.js` (dosya düzeyi) :935 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :180 [write-or-literal]
- `src/designState.js` `if` :846 [write]
- `src/catalog.js` `MODULE_CATALOG` :283 [write-or-literal]
- `src/scene3d.js` `if` :7452 [write]
- `src/scene3d.js` `if` :7453 [read]
- `src/scene3d.js` `for` :7599 [write]
- `src/rawBomDebug.js` `if` :123 [write]
- `src/rawBomDebug.js` `if` :125 [read]
- `src/selectionFeedback.js` `if` :60 [read]
- `test/showcaseBodyColorRegression.test.js` (dosya düzeyi) :13 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :22 [test]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/wallShowcaseItemContract.test.js` `for` :24 [test]
- `e2e/wall-showcase-item-contract.spec.mjs` `for` :80 [test]

- indeks: 27 / 188
