# `static.videoWall.cols`

**Özellik ID:** `static.videoWall.cols`
**İnsan tarafından anlaşılır adı:** Video wall kanonik: cols
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `2` · `3`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :462 [read]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :472 [write-or-literal]
- `src/designState.js` `createTvModuleState` :612 [write-or-literal]
- `src/catalog.js` `if` :186 [read]
- `src/catalog.js` `if` :191 [write-or-literal]

## Okuyan yerler

- `src/items.js` `if` :462 [read]
- `src/catalog.js` `if` :186 [read]
- `src/moduleDragSidebar.js` `if` :272 [read]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :13 [test]
- `test/wallMediaItemsContract.test.js` `for` :75 [test]
- `e2e/wall-media-items-contract.spec.mjs` `saveAndReadProject` :43 [test]

## Yazan / değiştiren yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :472 [write-or-literal]
- `src/designState.js` `createTvModuleState` :612 [write-or-literal]
- `src/catalog.js` `if` :191 [write-or-literal]
- `src/scene3d.js` `createTvModule` :4827 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **2** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `tv`
- itemKey: `VIDEO_WALL_2X2`, `VIDEO_WALL_3X3`

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

- src dosya sayısı (unique): **5**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/moduleDragSidebar.js`

- `src/items.js` `WALL_MEDIA_ITEMS` :444 [define]
- `src/items.js` `if` :462 [read]
- `src/items.js` `if` :463 [write]
- `src/items.js` `if` :472 [write-or-literal]
- `src/designState.js` `createTvModuleState` :612 [write-or-literal]
- `src/catalog.js` `if` :186 [read]
- `src/catalog.js` `if` :191 [write-or-literal]
- `src/scene3d.js` `createTvModule` :4827 [write]
- `src/moduleDragSidebar.js` `if` :272 [read]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :13 [test]
- `test/wallMediaItemsContract.test.js` `for` :75 [test]
- `e2e/wall-media-items-contract.spec.mjs` `saveAndReadProject` :43 [test]

- indeks: 42 / 188
