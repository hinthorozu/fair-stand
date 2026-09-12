> **TARİHÎ ENVANTER.** Güncel sistem değildir. Aktif kanonik tanım `docs/items/definitions/` (veya `src/items.js`). Gövdedeki `catalogKey` / `DEPOT_*` / `floorType` tarihî örnektir; runtime kimliği `itemKey`.

# glass_shelf — Tarihî envanter

Fresh `Version2` runtime doğrulaması ve kullanıcı ürün kararı sonrası güncel durum.

## Checklist

| # | Alan | Durum | Güncel gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=glass_shelf`, `type=showcase-accessory`, `unit=adet`; kanonik owner `src/productionParts.js`. |
| 2 | Intrinsic properties | VAR | `87.3 × 28.5 × 0.6 cm` (`length × depth × thickness`), `material=cam`; ölçüler ve material kullanıcı ürün kararıdır. `0.6 cm = 6 mm`. |
| 3 | Default state | UYGULANMIYOR | Leaf production Item ayrı project state/default state taşımaz. Cam appearance product state'i değildir; renderer standardıdır. |
| 4 | Oluşturma | PARENT-OWNED | Ayrı leaf project factory yok. `createShowcaseModuleState()` parent showcase instance'ını üretir; BOM expansion kanonik Item'ı `itemKey` ile çözer. |
| 5 | Placement | PARENT-OWNED | Parent `showcase-2` / `showcase-3` wall module placement contract'ını kullanır. |
| 6 | Move | PARENT-OWNED | Parent showcase module move/continuous-wall akışı üzerinden taşınır; leaf cam raf ayrı taşınmaz. |
| 7 | Rotation | PARENT-OWNED | Rotation parent showcase module behavior contract'ıdır. |
| 8 | Snap / collision / connection | PARENT-OWNED | Wall placement/snap/collision parent showcase module'a aittir; leaf cam raf için ayrı spatial rule yoktur. |
| 9 | Selection / drag | PARENT-OWNED | Leaf glass shelf ayrı selectable/drag entity değildir; parent showcase module/surface akışı kullanılır. |
| 10 | Context menu | PARENT-OWNED | Leaf cam raf için ayrı context menu yoktur; parent module işlemleri geçerlidir. |
| 11 | Delete / duplicate / keyboard | PARENT-OWNED | Parent showcase module üzerinde uygulanır. |
| 12 | Kalıcılık | PARENT-OWNED | Parent showcase state persist/restore edilir; `glass_shelf` ayrı persisted entity değildir. |
| 13 | Relationships / reflow | PARENT-OWNED | Parent showcase continuous wall relationship/reflow zincirine katılır; leaf cam rafın ayrı persisted relationship'i yoktur. |
| 14 | BOM / composition | VAR | Tekil production Item. `showcase-2:100` recipe'de ×2, `showcase-3:100` recipe'de ×3; quantity parent recipe sahibidir ve migrationda korunur. |
| 15 | Renderer / asset / override boundary | VAR | `createShowcaseModule()` artık kanonik `lengthCm=87.3`, `depthCm=28.5`, `thicknessCm=0.6` ve `material=cam` tüketir. `material=cam` ortak normal glass appearance standardına çözülür. Masa camı specialized override, panel backing panel-only efekt, projektör lensi specialized optical override'dır. |
| 16 | Runtime owners | VAR | Product: `productionParts.js`; BOM: `moduleRecipes.js`; parent state: `designState.js`; behavior/placement: module behavior/placement zinciri; persistence: `main.js` + `projectStore.js`; renderer: `scene3d.js`; shared glass appearance: `theme.js`. |
| 17 | Regression | VAR | `test/glassShelfItemContract.test.js`, `test/showcaseRecipes.test.js`, `test/showcaseDepthDirection.test.js`, `test/materialAppearance.test.js` + full suite/E2E. |
| 18 | Open decisions / completion | KAPALI / CI BEKLİYOR | Kanonik ürün ölçü/material kararı kapalıdır. Existing BOM ×1/×2 korunur; renderer'ın `eyeCount-1` iç divider mesh sayısı BOM kaynağı değildir. Operational completion PR checks + squash merge + post-merge `Version2` CI FULL GREEN sonrası verilir. |

## Kanonik cutover

Eski `partId=glass_shelf` kimliği kanonik `itemKey=glass_shelf` kimliğine taşındı. Showcase recipe entry'leri kanonik `itemKey` kullanır. Renderer'daki eski implicit `87.3 cm` (`innerWidth - 3.5 cm`), `26.5 cm` (`showcaseDepth - 3.5 cm`) ve `1.8 cm` glass-shelf geometry sabitleri kaldırıldı; gerçek `87.3 × 28.5 × 0.6 cm` Item ölçüleri tüketilir.

Cam görünümü tekleştirildi: normal cam `GLASS_APPEARANCE`, masa camı explicit `TABLE_GLASS_APPEARANCE`, panel arka okunabilirlik efekti `PANEL_GLASS_BACKING_APPEARANCE` kullanır. Projektör lensi bu standardizasyonun dışındadır. Mesh kumaş cam opacity sabitini kullanmaz.
