# `static.paintable`

**Özellik ID:** `static.paintable`
**İnsan tarafından anlaşılır adı:** Zemin boyanabilir mi
**Kategori:** kanonik-kayit
**Veri tipi:** boolean
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `true` · `false`

## Ne işe yarar

Zemin boya UI: `applyActiveColorToSelection` parke için false ise boyamaz.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `FLOOR_ITEMS` :294 [write-or-literal]
- `src/items.js` `getFloorSelectLabel` :341 [read]
- `src/items.js` `isGridTileFloorItem` :351 [read]
- `src/items.js` `isCarpetFloorItem` :359 [read]

## Okuyan yerler

- `src/items.js` `getFloorSelectLabel` :341 [read]
- `src/items.js` `isGridTileFloorItem` :351 [read]
- `src/items.js` `isCarpetFloorItem` :359 [read]
- `src/scene3d.js` (dosya düzeyi) :14 [read]
- `src/scene3d.js` `createFloorPattern` :562 [read]
- `src/scene3d.js` `setFloorType` :616 [read]
- `src/scene3d.js` `setFloorColor` :665 [read]
- `src/main.js` `if` :1238 [read]
- `src/selectionFeedback.js` `describeFloorSelection` :176 [read]
- `test/floorItemsContract.test.js` (dosya düzeyi) :9 [test]
- `test/floorItemsContract.test.js` `for` :42 [test]
- `test/selectionFeedback.test.js` `surface` :81 [test]

## Yazan / değiştiren yerler

- `src/items.js` `FLOOR_ITEMS` :294 [write-or-literal]
- `src/scene3d.js` `fine` :519 [write]
- `src/scene3d.js` `notifyFloorSelection` :1045 [write-or-literal]
- `src/selectionFeedback.js` `describeFloorSelection` :173 [write]

## Default değeri

Item default: yalnız `FLOOR_ITEMS`. `karolaj`/`hali` true; parke false. Global default yok.

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **5** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `floor`
- itemKey: `karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **5**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok (bayrak kodda). Boya UI bayrağı okur.

## Persistence

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

Zemin material boyası / parke texture yolu `scene3d.setFloorType`.

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

- src dosya sayısı (unique): **4**
- src dosyaları: `src/items.js`, `src/scene3d.js`, `src/main.js`, `src/selectionFeedback.js`

- `src/items.js` `FLOOR_ITEMS` :294 [write-or-literal]
- `src/items.js` `getFloorSelectLabel` :341 [read]
- `src/items.js` `isGridTileFloorItem` :351 [read]
- `src/items.js` `isCarpetFloorItem` :359 [read]
- `src/scene3d.js` (dosya düzeyi) :14 [read]
- `src/scene3d.js` `fine` :519 [write]
- `src/scene3d.js` `createFloorPattern` :562 [read]
- `src/scene3d.js` `setFloorType` :616 [read]
- `src/scene3d.js` `setFloorColor` :665 [read]
- `src/scene3d.js` `notifyFloorSelection` :1045 [write-or-literal]
- `src/main.js` `if` :1238 [read]
- `src/selectionFeedback.js` `describeFloorSelection` :173 [write]
- `src/selectionFeedback.js` `describeFloorSelection` :176 [read]
- `test/floorItemsContract.test.js` (dosya düzeyi) :9 [test]
- `test/floorItemsContract.test.js` `for` :42 [test]
- `test/selectionFeedback.test.js` `surface` :81 [test]

- **Hardcoded / sapma:** Zemin kimliği persist `stand.itemKey`; legacy `floorType` silindi. Boya rengi `stand.floorColor` 188 sütunda ayrı id değil.

- indeks: 32 / 188
