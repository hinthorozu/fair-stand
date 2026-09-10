# showcase_3_100 — Current System Inventory

Fresh `Version2` runtime doğrulaması ve kullanıcı ürün kararları sonrası güncel durum.

## Checklist

| Alan | Durum | Güncel gerçek / owner |
|---|---|---|
| Identity / type | VAR | `itemKey=showcase_3_100`, `type=showcase-3`, `unit=adet`; canonical parent owner `src/items.js`. |
| Intrinsic | VAR | `widthCm=100`, `eyeCount=3`. Parent material/defaultColor taşımaz; farklı child Item'ların bileşimidir. |
| Default / override state | VAR | Factory canonical parent identity üretir. `bodySurface.color` dört showcase-board için tek project override'dır; default canonical child board beyazından gelir. |
| Factory | VAR | `createShowcaseModuleState('showcase-3', 100)` canonical parent Item + 7 wall-panel strip + tek grouped body surface üretir. |
| Placement/move/rotation/snap/collision | VAR | Existing shared `WALL_BEHAVIOR`, placement/move/reflow motorları kullanılır; showcase'e özel ikinci engine yoktur. |
| Selection / context | VAR | Çevre wall panelleri panel surface olarak kalır. Showcase gövdesi tek `showcase-body` color surface'tir; image/glass/lightbox/mesh açılmaz. |
| Delete/duplicate/keyboard | VAR | Existing parent module akışı. Duplicate grouped body color'ı korur ama yeni surface id üretir. |
| Persistence | VAR | `itemKey`, `catalogKey=showcase_3_100`, `eyeCount`, strips, `bodySurface` ve placement project state içinde saklanır. Legacy `wall_showcase_100_3` catalogKey restore sırasında canonical key'e alias edilir. |
| Relationships / reflow | VAR / SHARED FINAL BOM BEKLİYOR | Parent continuous wall reflow'a katılır. Inner-corner recipe variant canonical olarak hazırdır; gerçek relationship → recipe context otomatik Final BOM entegrasyonu shared sonraki katmandır. |
| BOM / composition | VAR | Parent composite Item `composition.mode=recipe`; base ve inner-corner recipe `src/moduleRecipes.js` sahibidir. |
| Renderer | VAR | Side/horizontal board ölçü, thickness, depth, material/default ilişkisi canonical child resolver'dan gelir; dört board `bodySurface.color` ile birlikte boyanır. `glass_shelf` canonical ölçü/material kullanır. |
| Regression | VAR | `test/showcaseCompositeItemContract.test.js`, `test/showcaseRecipes.test.js`, `test/showcaseAppearance.test.js`, `test/showcaseDepthDirection.test.js`, `test/glassShelfItemContract.test.js`, `e2e/showcase-item-contract.spec.mjs` + full suite. |

## Base BOM

```text
profile_91                     ×4
upright_346_5                  ×2
panel_98                       ×4
connector_start                ×4
connector_single               ×7
showcase_side_143_5_30         ×2
showcase_horizontal_87_4_30    ×2
glass_shelf                    ×2
```

## Inner-corner BOM

```text
profile_91                     ×4
upright_346_5                  ×2
panel_corner_92                ×4
connector_start                ×4
connector_single               ×5
connector_corner               ×4
showcase_side_143_5_30         ×2
showcase_horizontal_87_4_30    ×2
glass_shelf                    ×2
```

`panel_98` → `panel_corner_92` miktarı 1:1 korunur. `connector_start ×4` değişmez. İnce ön renderer çerçeve detayları doğrulanmış production Item/BOM kalemi değildir ve bu recipe'ye sokulmaz.
