# 08 — Duplicate logic

| ID | Kopyalar | Semantik | Risk |
| --- | --- | --- | --- |
| DUP1 | `expandRecipe` inline inner-corner vs (silinmiş) src `getRecipeInnerCornerPanelKey` | aynı path | cleanup sonrası tek production |
| DUP2 | test `getRecipeInnerCornerPanelKey` vs expandRecipe | helper Item composition; expandRecipe aynı + swap | hizalı (cleanup) |
| DUP3 | `recipeView.variants.innerCornerPanelItemKey` vs composition.innerCorner.panelItemKey | kopya değer, farklı path | test view |
| DUP4 | `resolveAdjacentPlacement` vs `planContinuousWallLayout` | 270° sağ duvar testte eşitlenir | prod yalnız reflow |
| DUP5 | `moduleContracts` bom.mode vs `composition.mode` + itemBom | test vs runtime | ikinci SoT |
| DUP6 | `featureContracts` vs autoDepot/automaticWall gövdesi | docs SoT vs çalışan kod | drift |
| DUP7 | `resolveItemKey` identity vs catalog itemKey | ikisi de Item | kasıtlı katman |
| DUP8 | `getConnectorItemKey` map vs composition.items connector satırları | API test-only; data recipe’de | ölü API / canlı data |
| DUP9 | CATALOG_PREVIEWS whitelist vs Item.catalogPreview | çift kontrol | throw unknown preview |
| DUP10 | sceneDimensions vs dimensions aynı field adları | fallback zinciri | kasıtlı |

Copy-paste helpers: `test/recipeParentItemKey.js` production recipe tablosu değil; type+width → itemKey string birleştirme. Production kimlik `ITEMS` satırı.
