# `media.widthCm`

**Özellik ID:** `media.widthCm`
**İnsan tarafından anlaşılır adı:** resolveWallMediaMetrics: widthCm
**Kategori:** turetilmis-tv
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `93` · `121.8` · `143.9` · `217` · `325.5`

## Ne işe yarar

`resolveWallMediaMetrics` türevi; video wall panel×ızgara, TV ekran ölçüsü.

## Canonical owner

- katman: türetim
- dosya: `src/items.js`
- sembol: `resolveWallMediaMetrics`

## Tanımlandığı yerler

- `src/items.js` `resolveWallMediaMetrics` :455 [read]
- `src/designState.js` (dosya düzeyi) :12 [read]
- `src/designState.js` `createTvModuleState` :600 [write]
- `src/designState.js` `if` :705 [write]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/catalog.js` `createWallMediaCatalogItem` :174 [write]
- `src/catalog.js` `if` :198 [write]

## Okuyan yerler

- `src/items.js` `resolveWallMediaMetrics` :455 [read]
- `src/designState.js` (dosya düzeyi) :12 [read]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/wallMediaItemsContract.test.js` `for` :74 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `createTvModuleState` :600 [write]
- `src/designState.js` `if` :705 [write]
- `src/catalog.js` `createWallMediaCatalogItem` :174 [write]
- `src/catalog.js` `if` :198 [write]

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

- src dosya sayısı (unique): **3**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`

- `src/items.js` `resolveWallMediaMetrics` :455 [read]
- `src/designState.js` (dosya düzeyi) :12 [read]
- `src/designState.js` `createTvModuleState` :600 [write]
- `src/designState.js` `if` :705 [write]
- `src/catalog.js` (dosya düzeyi) :1 [read]
- `src/catalog.js` `createWallMediaCatalogItem` :174 [write]
- `src/catalog.js` `if` :198 [write]
- `test/wallMediaItemsContract.test.js` (dosya düzeyi) :3 [test]
- `test/wallMediaItemsContract.test.js` `for` :74 [test]

- indeks: 161 / 188
