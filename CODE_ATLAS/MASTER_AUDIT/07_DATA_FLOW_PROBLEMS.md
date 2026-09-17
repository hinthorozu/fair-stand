# 07 — Data flow problems

| ID | Sorun | Kanıt | Etki |
| --- | --- | --- | --- |
| DF1 | BOM producer var, kullanıcı consumer yok | resolveItemBom → rawBomDebug; main yalnız DEV `?rawBom` | maliyet UX kopuk |
| DF2 | moduleContracts.bom vs itemBom | 19 test okur; 0 src import | test sözleşmesi ≠ runtime BOM |
| DF3 | featureContracts vs autoDepot/automaticWall | getFeatureContract incoming 1 test; process [] | planner contract’suz çalışır |
| DF4 | cornerPlacement vs wallReflow | 2 test 270° karşılaştırır; prod insert wallReflow | duplicate planner; sapma gizlenebilir |
| DF5 | inner-corner: inline vs eski export | production inline `item.composition.innerCorner?.panelItemKey`; src helper silindi | şu an tek production path |
| DF6 | test recipeView.variants vs Item composition | recipeView composition taşımaz; variants kopya | helper artık Item ister; view assert ayrı |
| DF7 | STAND_AXES graph incoming boş | validateStandAxisCapacity içeride okur | export dışarı ölü; değer live |
| DF8 | sceneDimensions ?? dimensions | items.js yorum + resolveSceneDimensions | kasıtlı fallback; remap yok (kanıtlı) |
| DF9 | stripOccupancy Item vs STAND_DIMENSIONS 7 şerit | iki ayrı kavram | karıştırılırsa yanlış overlay — bug kanıtlanmadı |
| DF10 | visualRotationYDeg vs modelRotationYDeg | ikisi de ITEMS’te | iki rotation SoT; renderer ikisini de okuyabilir |
| DF11 | getItemSurfaceCapabilities default false | yalnız door-leaf | panel image/color başka path (surface state) |
| DF12 | catalog projeksiyon 3 alan | Item’da onlarca alan | UI kasıtlı daraltma; mismatch değil |

Yanlış fallback (throw etmeyen sessiz yanlış): patch scriptler silindi. expandRecipe inner-corner panel yoksa items’i olduğu gibi döner (`if (!cornerPanelItemKey) return items`) — kasıtlı no-op, invalid panel throw.
