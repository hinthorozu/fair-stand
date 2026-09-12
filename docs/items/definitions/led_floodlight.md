# led_floodlight — Canonical Item

Migration öncesi tam envanter: [current-system/LED_FLOODLIGHT](../current-system/LED_FLOODLIGHT.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > TOP_LIGHT_ITEMS.led_floodlight` canonical itemKey/name/type/dimensions sahibidir. Tekil Item; `catalogKey = itemKey = led_floodlight`. Type `led-floodlight`. Footprint `50 × 20 × 35 cm`; `mountHeightCm=350`. Eski katalog anahtarı `LED_FLOODLIGHT` idi; ürün kararı ile küçük harfe alındı. Unit / BOM uydurulmadı (`decision-required`).

## Factory, state ve persistence
`createLedFloodlightModuleState` Item’dan default üretir; `itemKey`/`catalogKey` damgalar; `surface.color=#17191c` korunur. Load’da `normalizeModuleItemState` type `led-floodlight` için hydrate eder. Eski `catalogKey: LED_FLOODLIGHT` kayıtları katalogda tek aday type olduğu için `resolveModuleCatalogKey` ile `led_floodlight` olur. Recipe yok.

## Behavior ve renderer sınırı
`moduleBehavior.js > led-floodlight`: placement `top`, snap `20 cm`, rotation `90°`, `collision: none`, `wallCapacity: exclude`. Prosedürel gövde/45 LED noktası/spotlight renderer temsilidir; BOM değildir. Mesh metre ölçüleri değiştirilmedi.

## Regression
`test/lightingItemsContract.test.js`; `test/ledFloodlightModule.test.js`; E2E `e2e/lighting-items-contract.spec.mjs`.
