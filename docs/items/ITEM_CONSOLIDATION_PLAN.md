# Item birleştirme planı

Kanonik Item kimliği tek runtime dosyadadır: `src/items.js`.

`src/productionParts.js` ve `src/leafItems.js` sahip değildir. Reçeteler `src/moduleRecipes.js` içinde kalır. Katalog kartları `src/catalog.js` içinde kalır.

## `src/items.js` kaydı

Tek tablo `ITEMS`. Bütün Item satırları `export const ITEMS` içindedir. Lookup `getItem(itemKey)`. `listRegisteredItems()` bütün satırları döner. Kova map yoktur.

Raf kimliği exact `itemKey` + `getItem()`; width helper `getShelfLeafItem` yoktur. Kapı kanadı da exact `itemKey` + `getItem('door_leaf_100')`; width helper `getDoorLeafItem` yoktur. `door_100` recipe parent’tır; child listesi `composition.items` içindedir (`door_leaf_100` ayrı Item’dır).

## Faz 2 — tek lookup API

- `getProductionItem`, `getProductionPart`, `listProductionParts` ve `PRODUCTION_PARTS` export'ları kaldırıldı.
- Tek kayıt lookup `getItem()`dır. Leaf ve bileşik aynı fonksiyondan döner.
- `getRecipeItemKey()` yalnız `item.itemKey` okur; `partId` düşümü yoktur.
- Raf width helper `getShelfLeafItem` kaldırıldı; çözüm `getItem(itemKey)`. Kapı width helper `getDoorLeafItem` kaldırıldı; çözüm `getItem('door_leaf_100')`.
- `door_100` recipe parent’tır; `getItem('door_100')` onu döner.

## Faz 3 — tanım metinleri

`docs/items/definitions`, `docs/items/current-system` ve `docs/items/door_100_full_system_audit.md` runtime ile hizalandı:

- Kanonik sahip `src/items.js`; lookup `getItem()`.
- Public kayıt `ITEMS`.
- Raf lookup `getItem(itemKey)`. Kapı lookup `getItem('door_leaf_100')`.
- `getProductionPart` / `getProductionItem` compatibility cümleleri kaldırıldı; çözüm `getItem()`dır.
- `partId` yalnız migration öncesi kimlik olarak kalır; bugünkü kimlik `itemKey`dır.

Audit evidence ve migration kural metinleri tarihî kayıt olarak durur.

## Faz 0 — ölü kod temizliği

- Paralel leaf registry kaldırıldı (`src/productionParts.js`).
- Ara `src/leafItems.js` açılmadı.
- `src/moduleRecipes.js` içindeki ikinci `wall-short-up-1/*` ve `wall-short-up-2/*` recipe bloğu silindi. İkinci kopya, birincinin birebir ölü üzerine yazmasıydı.
- `src/moduleContracts.js` içindeki tekrar `wall_*_short_up_*` atamaları silindi.
- Sekiz short-up `itemKey` `docs/items/ITEM_LIST.md` envanterine yazıldı.

## Birleştirme sonrası sahipler

| Konu | Sahip |
|---|---|
| Item kimliği / leaf üstveri | `src/items.js` |
| Reçete miktarları / variant | `src/moduleRecipes.js` |
| Modül BOM politikası | `src/moduleContracts.js` |
| Katalog kartı / resolve key | `src/catalog.js` |
