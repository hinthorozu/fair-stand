# karolaj — Canonical Item

Migration öncesi tam envanter: [current-system/karolaj](../current-system/karolaj.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > FLOOR_ITEMS.karolaj` canonical itemKey/name/type sahibidir. Tekil Item. `itemKey = floorType = karolaj`. Type `floor`. Katalog kartı yoktur. Karo ızgarası `100 × 100 cm` (UI + 1 m grid). `defaultColor=#e9edf1`. `paintable=true`. Unit / BOM uydurulmadı.

## Factory, state ve persistence
Zemin `currentModules` içinde değildir. `currentStand.floorType` Item `itemKey` taşır; varsa `floorColor` instance override’dır. Load’da bilinmeyen `floorType` `karolaj`e düşer.

## Behavior ve renderer sınırı
Floor selection / `setFloorColor` Item `paintable` alanını kullanır. Material roughness ve grid çizgi rengi renderer temsilidir.

## Regression
`test/floorItemsContract.test.js`; E2E `e2e/floor-items-contract.spec.mjs`.
