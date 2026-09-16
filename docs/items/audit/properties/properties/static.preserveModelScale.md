# `static.preserveModelScale`

**Özellik ID:** `static.preserveModelScale`
**İnsan tarafından anlaşılır adı:** static.preserveModelScale
**Kategori:** kanonik-kayit
**Veri tipi:** boolean
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `false` · `true`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `COMMERCIAL_ITEMS` :138 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :388 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :457 [read]
- `src/designState.js` `createCommercialModuleState` :461 [write]
- `src/designState.js` `createIndoorPlantModuleState` :563 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :242 [write-or-literal]

## Okuyan yerler

- `src/designState.js` `createCommercialModuleState` :457 [read]
- `src/scene3d.js` `if` :5197 [read]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :66 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :29 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :17 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :51 [test]

## Yazan / değiştiren yerler

- `src/items.js` `COMMERCIAL_ITEMS` :138 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :388 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :461 [write]
- `src/designState.js` `createIndoorPlantModuleState` :563 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :242 [write-or-literal]
- `src/autoDepot.js` `if` :122 [write-or-literal]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **5** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `plastic-trash-bin`, `indoor-plant-1`
- itemKey: `PLASTIC_TRASH_BIN`, `EXTRA_INDOOR_PLANT_1`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`

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
- src dosyaları: `src/items.js`, `src/designState.js`, `src/catalog.js`, `src/scene3d.js`, `src/autoDepot.js`

- `src/items.js` `COMMERCIAL_ITEMS` :138 [write-or-literal]
- `src/items.js` `INDOOR_PLANT_ITEMS` :388 [write-or-literal]
- `src/designState.js` `createCommercialModuleState` :457 [read]
- `src/designState.js` `createCommercialModuleState` :461 [write]
- `src/designState.js` `createIndoorPlantModuleState` :563 [write-or-literal]
- `src/catalog.js` `createIndoorPlantCatalogItem` :242 [write-or-literal]
- `src/scene3d.js` `if` :5197 [read]
- `src/autoDepot.js` `if` :122 [write-or-literal]
- `test/commercialItemsContract.test.js` (dosya düzeyi) :66 [test]
- `test/indoorPlantItemsContract.test.js` (dosya düzeyi) :29 [test]
- `test/indoorPlants.test.js` (dosya düzeyi) :17 [test]
- `test/plasticTrashBinModule.test.js` `overlaps` :51 [test]

- indeks: 34 / 188
