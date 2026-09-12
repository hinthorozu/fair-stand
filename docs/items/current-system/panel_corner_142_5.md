> **TARİHÎ ENVANTER.** Güncel sistem değildir. Aktif kanonik tanım `docs/items/definitions/` (veya `src/items.js`). Gövdedeki `catalogKey` / `DEPOT_*` / `floorType` tarihî örnektir; runtime kimliği `itemKey`.

# panel_corner_142_5 — Tarihî envanter

Fresh `Version2` doğrulaması ve ürün kararı sonrası güncel durum.

## 18-point checklist

| # | Alan | Durum | Güncel gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=panel_corner_142_5`, `type=panel`, `unit=adet` |
| 2 | Intrinsic properties | VAR | `142.5 × 47 × 0.8 cm`, `material=sunta`, `panelRole=inner-corner`, nominal `150` |
| 3 | Default state | UYGULANMIYOR | Ayrı leaf project state yok. |
| 4 | Oluşturma | UYGULANMIYOR | Ayrı scene/project factory yok. |
| 5 | Placement | PARENT-OWNED | Corner kararı parent relationship/configuration üzerinden gelir. |
| 6 | Move | PARENT-OWNED | Parent module/reflow zinciri. |
| 7 | Rotation | PARENT-OWNED | Parent module behavior family. |
| 8 | Snap | PARENT-OWNED | Parent module behavior family. |
| 9 | Collision | PARENT-OWNED | Parent module placement/collision motoru. |
| 10 | Selection | PARENT-OWNED | Leaf production identity ayrı seçilmez. |
| 11 | Context menu | PARENT-OWNED | Parent module/surface context-menu zinciri. |
| 12 | Delete / duplicate | PARENT-OWNED | Parent module işlemleri. |
| 13 | Kalıcılık | PARENT-OWNED | Relationship/module state üzerinden; leaf ayrı entity değildir. |
| 14 | Relationships / reflow | VAR | `innerCornerPanelItemKey`; matching straight paneli 1:1 değiştirir. |
| 15 | BOM / composition | VAR | Tekil Item; quantity matching parent recipe satırından korunur. |
| 16 | Renderer / asset | OVERRIDE | Renderer product material source-of-truth değildir. |
| 17 | Runtime owners | VAR | `productionParts.js`, `moduleRecipes.js` + parent relationship/behavior zinciri. |
| 18 | Regression | VAR | Corner panel contract testleri + `boardMaterialItemContract.test.js`. |

Kanonik üretim malzemesi `material: 'sunta'`dır.
