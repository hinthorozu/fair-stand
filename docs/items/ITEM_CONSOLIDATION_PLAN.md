# Item birleştirme planı

Kanonik Item kimliği tek runtime dosyadadır: `src/items.js`.

`src/productionParts.js` ve `src/leafItems.js` sahip değildir. Reçeteler `src/moduleRecipes.js` içinde kalır. Katalog kartları `src/catalog.js` içinde kalır.

## `src/items.js` içindeki registry grupları

| Grup | Rol | `getItem()` |
|---|---|---|
| `LEAF_ITEMS` | Üretim / BOM leaf kayıtları | evet, `getProductionItem()` üzerinden |
| `COMMERCIAL_ITEMS` | Bağımsız ticari ürünler | evet |
| `FURNITURE_ITEMS` | Mobilya / mobilya kümeleri | evet |
| `INDOOR_PLANT_ITEMS` | Bitki ailesi | evet |
| `WALL_MEDIA_ITEMS` | TV / video-wall ailesi | evet |
| `TOP_LIGHT_ITEMS` | Üst ışıklar | evet |
| `NON_CATALOG_ITEMS` | Yalnız runtime (illuminated-foam) | evet |
| `FLOOR_ITEMS` | Zemin kaplamaları | evet |
| `COMPOSITE_ITEMS` | Reçete parent'ları (duvar, banko, baza, raf, short-up, …) | evet |

`getProductionItem()` yalnız leaf döner; bileşik parent üretim leaf'i gibi görünmez.

`listRegisteredItems()` beyan edilen her kaydı döner.

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
