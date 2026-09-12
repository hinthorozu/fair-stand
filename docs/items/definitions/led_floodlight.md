# led_floodlight — Kanonik Item

Migration öncesi tam envanter: [current-system/LED_FLOODLIGHT](../current-system/LED_FLOODLIGHT.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > TOP_LIGHT_ITEMS.led_floodlight` kanonik itemKey/name/type/dimensions sahibidir. Tekil Item; `itemKey = led_floodlight`. Type `led-floodlight`. Footprint `50 × 20 × 35 cm`; `mountHeightCm=350`. Eski katalog anahtarı `LED_FLOODLIGHT` idi; ürün kararı ile küçük harfe alındı. Unit / BOM uydurulmadı (`decision-required`).

## Oluşturma, state ve kalıcılık
`createLedFloodlightModuleState` Item’dan default üretir; `itemKey` damgalar; `surface.color=#17191c` korunur. Yüklemede `normalizeModuleItemState` type `led-floodlight` için doldurur. Recipe yok.

## Davranış ve renderer sınırı
`moduleBehavior.js > led-floodlight`: yerleşim `top`, snap `20 cm`, rotation `90°`, `collision: none`, `wallCapacity: exclude`. Prosedürel gövde/45 LED noktası/spotlight renderer temsilidir; BOM değildir. Mesh metre ölçüleri değiştirilmedi.

## Regresyon
`test/lightingItemsContract.test.js`; `test/ledFloodlightModule.test.js`; E2E `e2e/lighting-items-contract.spec.mjs`.
