# `media.screenHeightCm`

**Özellik ID:** `media.screenHeightCm`
**İnsan tarafından anlaşılır adı:** resolveWallMediaMetrics: screenHeightCm
**Kategori:** turetilmis-tv
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `52.3` · `68.5` · `80.9` · `122` · `183`

## Ne işe yarar

`resolveWallMediaMetrics` türevi; video wall panel×ızgara, TV ekran ölçüsü.

## Canonical owner

- katman: türetim
- dosya: `src/items.js`
- sembol: `resolveWallMediaMetrics`

## Tanımlandığı yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :426 [write-or-literal]
- `src/items.js` `resolveWallMediaMetrics` :455 [read]
- `src/items.js` `if` :465 [write]
- `src/items.js` `if` :469 [write-or-literal]
- `src/items.js` `if` :471 [read]
- `src/designState.js` (dosya düzeyi) :12 [read]
- `src/designState.js` `createTvModuleState` :600 [write]
- `src/designState.js` `createTvModuleState` :608 [write-or-literal]
- `src/designState.js` `if` :705 [write]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/catalog.js` `createWallMediaCatalogItem` :174 [write]
- `src/catalog.js` `createWallMediaCatalogItem` :182 [write-or-literal]
- `src/catalog.js` `if` :198 [write]
- `src/catalog.js` `TV_42_DIMENSIONS` :202 [write-or-literal]

## Okuyan yerler

- `src/items.js` `resolveWallMediaMetrics` :455 [read]
- `src/items.js` `if` :471 [read]
- `src/designState.js` (dosya düzeyi) :12 [read]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/scene3d.js` `if` :1897 [read]
- `src/selectionFeedback.js` `if` :138 [read]
- `test/tv42Module.test.js` (dosya düzeyi) :13 [test]
- `test/tv42Module.test.js` `for` :53 [test]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/wallMediaItemsContract.test.js` `for` :74 [test]

## Yazan / değiştiren yerler

- `src/items.js` `WALL_MEDIA_ITEMS` :426 [write-or-literal]
- `src/items.js` `if` :465 [write]
- `src/items.js` `if` :469 [write-or-literal]
- `src/designState.js` `createTvModuleState` :600 [write]
- `src/designState.js` `createTvModuleState` :608 [write-or-literal]
- `src/designState.js` `if` :705 [write]
- `src/catalog.js` `createWallMediaCatalogItem` :174 [write]
- `src/catalog.js` `createWallMediaCatalogItem` :182 [write-or-literal]
- `src/catalog.js` `if` :198 [write]
- `src/catalog.js` `TV_42_DIMENSIONS` :202 [write-or-literal]
- `src/scene3d.js` `getWallOverlayDragPoint` :2346 [write]
- `src/scene3d.js` `if` :2407 [write]
- `src/scene3d.js` `createTvModule` :4830 [write]
- `src/selectionFeedback.js` `if` :137 [write]

## Default değeri

Türetim: `resolveWallMediaMetrics(item)`. TV ekran Item.dimensions.screen*; video wall panel×ızgara. Fallback yok (item yoksa metrik yok).

## Override zinciri

Item dimensions / videoWall → resolveWallMediaMetrics → factory TV state alanları. Kullanıcı inç değiştirmez; ayrı itemKey yerleştirir.

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

Runtime-only / derived audit. Ayrı persist alanı yok.

## Renderer etkisi

TV/video wall ekran boyutu / texture `createTvScreenTexture`.

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `media`
- `static.videoWall.*` veya `static.dimensions.screen*`.

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **5**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/selectionFeedback.js`

- `src/items.js` `WALL_MEDIA_ITEMS` :426 [write-or-literal]
- `src/items.js` `resolveWallMediaMetrics` :455 [read]
- `src/items.js` `if` :465 [write]
- `src/items.js` `if` :469 [write-or-literal]
- `src/items.js` `if` :471 [read]
- `src/designState.js` (dosya düzeyi) :12 [read]
- `src/designState.js` `createTvModuleState` :600 [write]
- `src/designState.js` `createTvModuleState` :608 [write-or-literal]
- `src/designState.js` `if` :705 [write]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/catalog.js` `createWallMediaCatalogItem` :174 [write]
- `src/catalog.js` `createWallMediaCatalogItem` :182 [write-or-literal]
- `src/catalog.js` `if` :198 [write]
- `src/catalog.js` `TV_42_DIMENSIONS` :202 [write-or-literal]
- `src/scene3d.js` `if` :1897 [read]
- `src/scene3d.js` `getWallOverlayDragPoint` :2346 [write]
- `src/scene3d.js` `if` :2407 [write]
- `src/scene3d.js` `createTvModule` :4830 [write]
- `src/selectionFeedback.js` `if` :137 [write]
- `src/selectionFeedback.js` `if` :138 [read]
- `test/tv42Module.test.js` (dosya düzeyi) :13 [test]
- `test/tv42Module.test.js` `for` :53 [test]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/wallMediaItemsContract.test.js` `for` :74 [test]

- indeks: 163 / 188
