# 01 — Capability source of truth (MA-007)

**GitNexus:** repo `fair-stand` (`C:\Users\hinthorozu\Kyrox\fair-stand\fair-stand-atlas`), indeks `8e9950b` / `2026-09-17T20:06:24.591Z`.  
`getItemSurfaceCapabilities` upstream **CRITICAL** (12 process, 4 direct). `riskSharedAxes` LOW bu uyarıyı düşürmez. Davranış koruma + regression ile uygulandı.

## Semantik karşılaştırma (önce)

| | `getItemSurfaceCapabilities` | `userData.acceptsImage` |
| --- | --- | --- |
| Kapı kanadı | `door-leaf` image true | capabilities.image |
| Düz panel / baza / banko / kapı üst / vitrin panel | map false | hardcoded true |
| Vitrin gövde | `showcase-board` false | hardcoded false |
| TV / GLB / separatör | map false | hardcoded false |

Aynı kavram değildi. Duplicate SoT image izni için vardı.

## Compatibility mapping (sessiz davranış seçilmedi)

Mevcut production **true** aileleri map’e yazıldı: `door-leaf`, `flat-panel`, `base`, `counter`, `door`, `showcase-2`, `showcase-3`. Hepsi `color+image`; `glass`/`lightbox`/`mesh` false.

`itemSurfaceAcceptsImage` renderer-specific kural taşımaz; type map okur.

## scene3d consumer

True siteler `itemSurfaceAcceptsImage(moduleState.itemKey)`. Kapı kanadı `doorLeafCapabilities.image`. Vitrin gövde `itemSurfaceAcceptsImage(bodyDefinition.sideItem)` (`showcase-board` → false). TV ve separatör de türetilir (false).

Kalan hardcoded `acceptsImage: false` (GLB, hitbox, raf selector): type map’te yok = `NO_SURFACE_CAPABILITIES.image`. İkinci **true** kuralı yok.

## Korunan sonuç

`wall_100`, `BASE_100`, `desk_banko_100`, `door_100` üst panel, `wall_showcase_100_2` panel image true. `showcase_side_*` / `TV_42` / `wall_separator_100` false. `door_leaf_100` true.

`createEditableItemSurfaceState` hâlâ yalnız kapı kanadında çağrılır; panel state `createEditablePanelState`.

## Test

`test/itemSurfaceCapabilitySoT.test.js`. `scene3d` içinde `acceptsImage: true` kalmadı.
