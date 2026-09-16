# `static.sizeInch`

**Özellik ID:** `static.sizeInch`
**İnsan tarafından anlaşılır adı:** Ekran inç
**Kategori:** kanonik-kayit
**Veri tipi:** number
**Birim:** inç
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `42` · `55` · `65`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :424 [write-or-literal]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :590 [define]
- `src/designState.js` `resolveWallMediaItemKey` :592 [read]
- `src/designState.js` `createTvModuleState` :598 [write]
- `src/designState.js` `createTvModuleState` :609 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :657 [write]
- `src/catalog.js` `createWallMediaCatalogItem` :183 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :492 [write-or-literal]
- `src/catalog.js` `if` :520 [read]

## Okuyan yerler

- `src/designState.js` `resolveWallMediaItemKey` :592 [read]
- `src/catalog.js` `if` :520 [read]
- `src/scene3d.js` `if` :1895 [read]
- `src/selectionFeedback.js` `if` :138 [read]
- `test/tv42Module.test.js` `for` :30 [test]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :19 [test]
- `e2e/wall-media-items-contract.spec.mjs` `saveAndReadProject` :43 [test]

## Yazan / değiştiren yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :424 [write-or-literal]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :590 [define]
- `src/designState.js` `createTvModuleState` :598 [write]
- `src/designState.js` `createTvModuleState` :609 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :657 [write]
- `src/catalog.js` `createWallMediaCatalogItem` :183 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :492 [write-or-literal]
- `src/scene3d.js` `pickModuleContext` :1812 [write-or-literal]
- `src/scene3d.js` `if` :2090 [write]
- `src/selectionFeedback.js` `if` :135 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **5** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `tv`
- itemKey: `TV_42`, `TV_55`, `TV_65`, `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **5**
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

- src dosya sayısı (unique): **5**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/selectionFeedback.js`

- `src/items.js` `WALL_MEDIA_ITEMS` :424 [write-or-literal]
- `src/items.js` `resolveWallMediaMetrics` :460 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :590 [define]
- `src/designState.js` `resolveWallMediaItemKey` :592 [read]
- `src/designState.js` `createTvModuleState` :598 [write]
- `src/designState.js` `createTvModuleState` :609 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :657 [write]
- `src/catalog.js` `createWallMediaCatalogItem` :183 [write-or-literal]
- `src/catalog.js` `normalizeCatalogDescriptor` :492 [write-or-literal]
- `src/catalog.js` `if` :520 [read]
- `src/scene3d.js` `pickModuleContext` :1812 [write-or-literal]
- `src/scene3d.js` `if` :1895 [read]
- `src/scene3d.js` `if` :2090 [write]
- `src/selectionFeedback.js` `if` :135 [write]
- `src/selectionFeedback.js` `if` :138 [read]
- `test/tv42Module.test.js` `for` :30 [test]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :19 [test]
- `e2e/wall-media-items-contract.spec.mjs` `saveAndReadProject` :43 [test]

- indeks: 37 / 188
