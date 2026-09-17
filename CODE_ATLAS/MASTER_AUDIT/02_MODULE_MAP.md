# 02 — Module map

Kapsam: `src/*.js` (56 dosya).  
**Kanıt:** Cypher `main.js` IMPORTS (29 hedef), `scene3d` `createStandScene` context, `impact` seçilmiş semboller.

Sütun: görev / callers / callees / flow / test.

`createStandScene` impact upstream = 1 (`main.js`). Dosya ~154–4834 satır façade; impact LOW yalnız caller sayısıdır.

## A. Orkestrasyon

| Dosya | Görev | Prod callers | Callees (özet) | Flow | Test |
| --- | --- | --- | --- | --- | --- |
| `main.js` | DOM, sahne, katalog drop, proje CRUD, kapasite, auto wall/depot | HTML | 29 src (cypher) | restore/open/save, catalog add, pointer/drop | integration `*MainIntegration.test.js` |
| `scene3d.js` | Three.js sahne + renderer + drag/ghost | `main.js` `createStandScene` | catalog, designState, items, behavior, placement, move, theme, viewCube, imageFit, itemCapabilities, … | CreateStandScene, ghost, drop, image/fabric | PARTIAL e2e; dosya unit yok |
| `projectActionSaveGuard.js` | kaydetmeden proje aksiyonu | HTML script | DOM | onClick/onChange | unit + e2e f020 |
| `viewCube.js` | view cube | scene3d | — | kamera | PARTIAL |
| `viewKeyboardShortcuts.js` | görünüm kısayol | scene3d | — | klavye | unit |

## B. Item / katalog / state

| Dosya | Görev | Prod callers | Flow | Test |
| --- | --- | --- | --- | --- |
| `items.js` | `ITEMS` + accessor | catalog, designState, scene3d, main, recipes, bom, behavior, placement, … | hemen her process `GetItem` | onlarca contract |
| `catalog.js` | catalogVisible → kart | scene3d, moduleDragSidebar, moduleContextMenu | picker/sidebar | catalog* tests |
| `designState.js` | factories | main, scene3d, import validation | createModuleStateFromDescriptor CRITICAL | construction registry |
| `itemCapabilities.js` | yüzey yetenek | scene3d, designState | door-leaf color/image | PARTIAL |
| `moduleRecipes.js` | expandRecipe | **yalnız itemBom** | RenderItemBom | moduleRecipes + recipe contracts |
| `itemBom.js` | resolveItemBom | rawBomDebug | DEV ?rawBom | recipeComposition, BOM tests |
| `rawBomDebug.js` | BOM paneli | main dinamik DEV | RenderItemBom | parser test |

## C. Behavior / placement

| Dosya | Görev | Prod | Flow | Test |
| --- | --- | --- | --- | --- |
| `moduleBehavior.js` | type policy | main, scene3d, placement, move, context menu | getModuleBehavior CRITICAL 21/45 | moduleBehavior* |
| `modulePlacement.js` | snap/collision | main, scene3d, move | snapPlacementToModules | modulePlacement.test.js |
| `moduleMove.js` | continuous insert/move | scene3d | planContinuous* | moduleMove.test.js |
| `wallReflow.js` | duvar reflow | main | planContinuousWallLayout | wallReflow.test.js |
| `stripOccupancy.js` | şerit occupancy | scene3d, behavior | overlay snap | stripOccupancy.test.js |
| `standCapacity.js` | eksen kapasite | main | validateStandAxisCapacity | unit |
| `standDimensions.js` | stand şerit 7×0.5m | scene3d | renderer | — |
| `standSetup.js` | stand tipi/ölçü | main | sahne kurulumu | — |
| `cornerPlacement.js` | komşu duvar helper | **0 src** | process [] | 2 test — TEST_SUPPORT |
| `groundLayout.js` | zemin grid | **0 src** | process [] | 1 test — TEST_SUPPORT |

## D. Feature planners (runtime)

| Dosya | Görev | Prod | Not |
| --- | --- | --- | --- |
| `autoDepot.js` | depo composition | main | runtime planner; featureContracts okumaz |
| `automaticWall.js` | otomatik duvar | main | aynı |
| `wall.js` | duvar helper | scene3d/main ailesi | — |

## E. Persist / asset

| Dosya | Görev | Prod | Flow |
| --- | --- | --- | --- |
| `configuratorDb.js` | IndexedDB open | projectStore, assetStore | RestoreProject → OpenConfiguratorDb |
| `projectStore.js` | proje CRUD | main | Save/Load/Delete |
| `assetStore.js` | görsel blob | main | SaveImageAsset |
| `imageAssetReferences.js` | referans sayım | main | — |
| `autosaveController.js` | autosave | main | — |
| `projectImportValidation.js` | zip validate | main | import |
| `projectSwitch.js` / `projectUi.js` / `projectNaming.js` | proje UI | main | — |

## F. UI

moduleContextMenu, moduleDragSidebar, colorEditor*, helpGuide, sidebarController, selectionFeedback, placementFeedback, stageFeedback, uiFeedback, rectSelection, surfaceStateBinding, theme, colorUtils, imageFit, rect/horizontalImageLayout, sceneDimensions, standStandardsCopy.

## G. Governance (src ama production import 0)

| Dosya | Rol | Callers |
| --- | --- | --- |
| `featureContracts.js` | GOVERNANCE SoT | 1 test (`getFeatureContract` incoming exact) |
| `moduleContracts.js` | GOVERNANCE SoT | 19 test, process 0, impact HIGH (test fan-in) |
| `systemChangeContract.js` | gate registry | verify script + gate tests |

## CSS

`style.css`, `colorEditor.css`, `imageActions.css`, `helpGuide.css` — `main.js` static import.
