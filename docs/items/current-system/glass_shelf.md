# glass_shelf — Current System Inventory

Fresh `Version2` runtime doğrulaması ve kullanıcı ürün kararı sonrası güncel durum.

## Checklist

| # | Alan | Durum | Güncel gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=glass_shelf`, `type=showcase-accessory`, `unit=adet`; canonical owner `src/productionParts.js`. |
| 2 | Intrinsic properties | VAR | `87.3 × 28.5 × 0.6 cm` (`length × depth × thickness`), `material=cam`; ölçüler ve material kullanıcı ürün kararıdır. `0.6 cm = 6 mm`. |
| 3 | Default state | UYGULANMIYOR | Leaf production Item ayrı project state/default state taşımaz. Cam appearance product state'i değildir; renderer standardıdır. |
| 4 | Factory / creation | PARENT-OWNED | Ayrı leaf project factory yok. `createShowcaseModuleState()` parent showcase instance'ını üretir; BOM expansion canonical Item'ı `itemKey` ile çözer. |
| 5 | Placement | PARENT-OWNED | Parent `showcase-2` / `showcase-3` wall module placement contract'ını kullanır. |
| 6 | Move | PARENT-OWNED | Parent showcase module move/continuous-wall akışı üzerinden taşınır; leaf cam raf ayrı taşınmaz. |
| 7 | Rotation | PARENT-OWNED | Rotation parent showcase module behavior contract'ıdır. |
| 8 | Snap / collision / connection | PARENT-OWNED | Wall placement/snap/collision parent showcase module'a aittir; leaf cam raf için ayrı spatial rule yoktur. |
| 9 | Selection / drag | PARENT-OWNED | Leaf glass shelf ayrı selectable/drag entity değildir; parent showcase module/surface akışı kullanılır. |
| 10 | Context menu | PARENT-OWNED | Leaf cam raf için ayrı context menu yoktur; parent module işlemleri geçerlidir. |
| 11 | Delete / duplicate / keyboard | PARENT-OWNED | Parent showcase module üzerinde uygulanır. |
| 12 | Persistence | PARENT-OWNED | Parent showcase state persist/restore edilir; `glass_shelf` ayrı persisted entity değildir. |
| 13 | Relationships / reflow | PARENT-OWNED | Parent showcase continuous wall relationship/reflow zincirine katılır; leaf cam rafın ayrı persisted relationship'i yoktur. |
| 14 | BOM / composition | VAR | Tekil production Item. `showcase-2:100` recipe'de ×1, `showcase-3:100` recipe'de ×2; quantity parent recipe sahibidir ve migrationda korunur. |
| 15 | Renderer / asset / override boundary | VAR | `createShowcaseModule()` artık canonical `lengthCm=87.3`, `depthCm=28.5`, `thicknessCm=0.6` ve `material=cam` tüketir. `material=cam` ortak normal glass appearance standardına çözülür. Masa camı specialized override, panel backing panel-only efekt, projektör lensi specialized optical override'dır. |
| 16 | Runtime owners | VAR | Product: `productionParts.js`; BOM: `moduleRecipes.js`; parent state: `designState.js`; behavior/placement: module behavior/placement zinciri; persistence: `main.js` + `projectStore.js`; renderer: `scene3d.js`; shared glass appearance: `theme.js`. |
| 17 | Regression | VAR | `test/glassShelfItemContract.test.js`, `test/showcaseRecipes.test.js`, `test/showcaseDepthDirection.test.js`, `test/materialAppearance.test.js` + full suite/E2E. |
| 18 | Open decisions / completion | KAPALI / CI BEKLİYOR | Canonical ürün ölçü/material kararı kapalıdır. Doğrulanmış BOM miktarı renderer ile aynı fiziksel kuralı izler: `eyeCount-1`; 2 gözlüde ×1, 3 gözlüde ×2. Operational completion PR checks + squash merge + post-merge `Version2` CI FULL GREEN sonrası verilir. |

## Canonical cutover

Eski `partId=glass_shelf` kimliği canonical `itemKey=glass_shelf` kimliğine taşındı. Showcase recipe entry'leri canonical `itemKey` kullanır. Renderer'daki eski implicit `87.3 cm` (`innerWidth - 3.5 cm`), `26.5 cm` (`showcaseDepth - 3.5 cm`) ve `1.8 cm` glass-shelf geometry sabitleri kaldırıldı; gerçek `87.3 × 28.5 × 0.6 cm` Item ölçüleri tüketilir.

Cam görünümü tekleştirildi: normal cam `GLASS_APPEARANCE`, masa camı explicit `TABLE_GLASS_APPEARANCE`, panel arka okunabilirlik efekti `PANEL_GLASS_BACKING_APPEARANCE` kullanır. Projektör lensi bu standardizasyonun dışındadır. Mesh kumaş cam opacity sabitini kullanmaz.
