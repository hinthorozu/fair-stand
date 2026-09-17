# 06 — Contract ↔ runtime mismatch

Kanıt: ITEM_CONTRACT / SYSTEM_DEVELOPMENT_CONTRACT SoT tablosu, `src/items.js` envanter, docs `static.*` / `catalog.sizeInch`, moduleContracts vs itemBom.

| ID | Docs/contract | Runtime | Tür |
| --- | --- | --- | --- |
| M1 | `static.*` property MD | `item.static` yok | notation; JS path değil |
| M2 | `static.shelfCount` / catalog.shelfCount | Item’da 0 alan | stale field |
| M3 | `catalog.sizeInch` / state.sizeInch audit | `src/` `sizeInch` 0 | stale field; TV `dimensions` |
| M4 | `recipe.innerCornerPanelItemKey` | `composition.innerCorner.panelItemKey` | farklı ad; test view `variants.innerCornerPanelItemKey` |
| M5 | `SYSTEM_DEVELOPMENT_CONTRACT` feature contract = `featureContracts.js` | autoDepot/automaticWall bu dosyayı import etmez | SoT runtime’da okunmuyor |
| M6 | aynı belge module contract = `moduleContracts.js` | BOM `itemBom`+`composition.mode`; behavior `moduleBehavior` | ikinci SoT |
| M7 | A21/F-045 yama betikleri | 2 cjs silindi; py hâlâ var | kısmi cleanup |
| M8 | `tvConfig.js` A02/current-system TV MD | `src/tvConfig.js` yok | ghost path |
| M9 | `groundLayout` renderer yardımcısı (gate map) | scene3d import 0 | contract/map vs runtime |
| M10 | `recipeView.variants` test helper | production view yok; expandRecipe Item alır | test projeksiyonu |
| M11 | itemCapabilities type map | yalnız `door-leaf` true; diğer NO_SURFACE | docs “capabilities.*” geniş; runtime dar |
| M12 | `composition.moduleType` / `composition.options` Item’da var | itemBom/expandRecipe okumaz | defined, P consumer yok |

Helper semantiği (cleanup sonrası): `test/recipeParentItemKey.js` `getRecipeInnerCornerPanelKey` artık yalnız `composition.innerCorner.panelItemKey`. `recipeView.variants` duruyor (bağımsız test view). Src export yok.

Producer yok: shelfCount, sizeInch.  
Consumer yok (P): composition.moduleType, composition.options.
