# Item birleştirme planı

Kanonik Item kimliği tek runtime dosyadadır: `src/items.js`.

`src/productionParts.js` ve `src/leafItems.js` sahip değildir. Reçeteler `src/moduleRecipes.js` içinde kalır. Katalog kartları `src/catalog.js` içinde kalır.

## `src/items.js` içindeki registry grupları

| Grup | Rol | `getItem()` |
|---|---|---|
| `LEAF_ITEMS` | Üretim / BOM leaf kayıtları | evet |
| `COMMERCIAL_ITEMS` | Bağımsız ticari ürünler | evet |
| `FURNITURE_ITEMS` | Mobilya / mobilya kümeleri | evet |
| `INDOOR_PLANT_ITEMS` | Bitki ailesi | evet |
| `WALL_MEDIA_ITEMS` | TV / video-wall ailesi | evet |
| `TOP_LIGHT_ITEMS` | Üst ışıklar | evet |
| `NON_CATALOG_ITEMS` | Yalnız runtime (illuminated-foam) | evet |
| `FLOOR_ITEMS` | Zemin kaplamaları | evet |
| `COMPOSITE_ITEMS` | Reçete parent'ları (duvar, banko, baza, raf, short-up, …) | evet |

Tek lookup `getItem()`dır. Raf kimliği exact `itemKey` + `getItem()`; width helper `getShelfLeafItem` yoktur. Kapı kanadı `getDoorLeafItem` kalır. `LEAF_ITEMS` map'i leaf kimliğini tutar; bileşik parent orada durmaz.

`listRegisteredItems()` beyan edilen her kaydı döner.

## Faz 2 — tek lookup API

- `getProductionItem`, `getProductionPart`, `listProductionParts` ve `PRODUCTION_PARTS` export'ları kaldırıldı.
- Tek kayıt lookup `getItem()`dır. Leaf ve bileşik aynı fonksiyondan döner.
- `getRecipeItemKey()` yalnız `item.itemKey` okur; `partId` düşümü yoktur.
- Raf width helper `getShelfLeafItem` kaldırıldı; çözüm `getItem(itemKey)`. Kapı `getDoorLeafItem` `getItem` / `LEAF_ITEMS` üzerinden çözülür.
- `LEAF_ITEMS.door_100` yoktur; `getItem('door_100')` bileşik parent döner.

## Faz 3 — tanım metinleri

`docs/items/definitions`, `docs/items/current-system` ve `docs/items/door_100_full_system_audit.md` runtime ile hizalandı:

- Kanonik sahip `src/items.js`; lookup `getItem()`.
- Leaf map adı `LEAF_ITEMS`.
- Raf lookup `getItem(itemKey)`. Kapı width helper `getDoorLeafItem`.
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
