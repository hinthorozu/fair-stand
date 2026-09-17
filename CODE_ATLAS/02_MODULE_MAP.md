# Module Map

Kapsam: production `src/` JavaScript. CSS ayrıca not edilir.  
**Kanıt:** GitNexus File IMPORTS, `export` grep, `context`/`impact` seçilmiş semboller.

Sütun anlamı:

- **Callers (prod):** `src/` importer veya HTML/dinamik bağ.
- **Callees:** o dosyanın `src/` import’ları.
- **Flow:** GitNexus process girişleriyle örtüşen gerçek feature.

`createStandScene` impact upstream = 1 (`main.js`). Bu, dosyanın küçük olduğu anlamına gelmez.

---

## A. Orkestrasyon / sahne

### `src/main.js`

- **Sorumluluk:** DOM bağlama, sahne oluşturma, katalog ekleme, proje kaydet/aç/sil/import/export, kapasite, otomatik duvar/depo, context-menu aksiyonları.
- **Exports:** uygulama-level named export yok; entry script. `exportProjectButton` addEventListener gibi DOM bağları var.
- **Imports (önemli):** `createStandScene`, `createModuleStateFromDescriptor`, `items` floor accessors, `projectStore`, `assetStore`, `modulePlacement`, `moduleBehavior`, `autoDepot`, `automaticWall`, `projectImportValidation` (archive/asset), `validateStandAxisCapacity`.
- **Callers:** HTML `/src/main.js`.
- **Flow:** `restoreProject`, `openStoredProject`, `validateCatalogAddBatch`, `flushCatalogModuleAdds`, `onPreview`/`onPointerMove`/`onDrop`, `changeContextShelfLighting`, `initializeAssetLibrary`.

### `src/scene3d.js`

- **Sorumluluk:** Three.js sahne, zemin, duvar mesh, modül renderer’ları, drag/ghost, seçim, kumaş/cam/görsel, view cube/keyboard bağları.
- **Exports:** `createStandScene`.
- **Return API (kanıt, ~4790):** `captureCurrentViewPng`, `createStage`, `buildWall`, `clearWall`, `applyColor`, `applyGlassMode`, `applyFabricMode`, `applyImageAsset`, `previewCatalogModuleDrag`, `dropCatalogModuleDrag`, `getSelectedSurfaces`, `setFloorType`, … (büyük façade).
- **Callers (prod):** `main.js`.
- **Callees:** catalog, designState, items, moduleBehavior, modulePlacement, moduleMove, stripOccupancy, theme, viewCube, viewKeyboardShortcuts, imageFit, rect/horizontal image layout, itemCapabilities, surfaceStateBinding, placementFeedback, rectSelection, sceneDimensions, standDimensions.
- **Flow:** `createStandScene`, `createPlacementGhost`, `finishPlacementDrag`, `applyRectImageAsset`, `captureCurrentViewPng`.
- **Yorum:** GitNexus “zero callers” listesindeki `clearSelection`, `getCameraMode` vb. return-object method’larıdır; event/façade. `PROVEN_UNUSED` değil.

### `src/viewCube.js`

- **Sorumluluk:** viewport view cube.
- **Exports:** cube factory (dosya `createStandScene` içinden kullanılır).
- **Callers:** `scene3d.js`.
- **Flow:** kamera/görünüm.

### `src/viewKeyboardShortcuts.js`

- **Sorumluluk:** görünüm kısayol çözümleme.
- **Exports:** `isEditableKeyboardTarget`, `resolveViewKeyboardShortcut`.
- **Callers:** `scene3d.js` + unit test.
- **Flow:** klavye → kamera.

---

## B. Item / katalog / state

### `src/items.js`

- **Sorumluluk:** kanonik `ITEMS` registry; accessor’lar.
- **Exports:** `ITEMS`, `getItem`, `listRegisteredItems`, `resolveItemKey`, `resolveSceneDimensions`, `requireSceneDimension`, floor/commercial/furniture/showcase/connector yardımcıları, `SCENE_DIMENSION_FIELDS`.
- **Callers (prod):** catalog, designState, scene3d, main, moduleRecipes, itemBom, moduleBehavior, modulePlacement, moduleContracts, autoDepot, itemCapabilities, stripOccupancy, selectionFeedback, standStandardsCopy, projectImportValidation, moduleDragSidebar.
- **Flow:** hemen her process’in terminal adımı `GetItem`.
- **Kanıt:** 96 kayıt; `catalogVisible=true` 58.

### `src/catalog.js`

- **Sorumluluk:** `catalogVisible` Item → UI kart (`itemKey`, `label`, `catalogPreview`).
- **Exports:** `CATALOG_CATEGORIES`, `CATALOG_PREVIEWS`, `listCatalogItems`, `getCatalogItem`, `listCatalogGroups`, `getModuleCatalogItem`, `getModuleCatalogLabel`.
- **Callers (prod):** `scene3d.js`, `moduleDragSidebar.js`, `moduleContextMenu.js`. **main.js catalog.js import etmez.**
- **Flow:** `CreateModuleDragSidebar → GetItem`, `RenderPickerCatalog → GetItem`.

### `src/designState.js`

- **Sorumluluk:** modül runtime state factory (`MODULE_STATE_FACTORIES`), duplicate/normalize, yüzey renk.
- **Exports:** `create*ModuleState`, `createModuleStateFromDescriptor`, `MODULE_STATE_TYPES`, `normalizeModuleItemState`, `duplicateModuleState`, `applyColorOverride`, `reconcileWallModules`, …
- **Callers (prod):** `main.js`, `scene3d.js`, `projectImportValidation.js` (`MODULE_STATE_TYPES`).
- **Flow:** `Create*ModuleState → GetItem`, `NormalizeModuleItemState → GetItem`.
- **Yorum:** GitNexus zero-caller `bar-stool` vb. factory **map key**’leridir, bağımsız fonksiyon değil.

### `src/itemCapabilities.js`

- **Sorumluluk:** yüzey yetenekleri (renk/görsel).
- **Exports:** `getItemSurfaceCapabilities`.
- **Callers (prod):** `scene3d.js`, `designState.js`.

### `src/moduleRecipes.js`

- **Sorumluluk:** `composition.mode === 'recipe'` genişletme; inner-corner panel varyantı.
- **Exports:** `getRecipeItemKey`, `expandRecipe`.
- **Callers (prod):** yalnız `itemBom.js`. Testler doğrudan import eder.
- **Flow:** `RenderItemBom → GetRecipeItemKey` (DEV debug + test).

### `src/itemBom.js`

- **Sorumluluk:** terminal BOM satırları (`unit` zorunlu).
- **Exports:** `resolveItemBom`.
- **Callers (prod):** `rawBomDebug.js`. Testler doğrudan.
- **Yorum:** production bundle’a yalnızca DEV `?rawBom` yolundan girer.

### `src/rawBomDebug.js`

- **Sorumluluk:** seçim metninden BOM paneli.
- **Exports:** `parseLCounterSelection` (+ panel).
- **Callers:** `main.js` dinamik DEV import; unit test.

---

## C. Davranış / yerleşim

### `src/moduleBehavior.js`

- **Sorumluluk:** type/itemKey → placement/collision/ghost/overlay.
- **Exports:** `getModuleBehavior`, `hasExplicitModuleBehavior`, rotation/collision/overlay sorguları.
- **Callers (prod):** main, scene3d, modulePlacement, moduleDragSidebar, moduleContextMenu, moduleContracts, wallReflow.
- **Impact:** CRITICAL, 21 doğrudan, 44 process.

### `src/modulePlacement.js`

- **Sorumluluk:** snap, wall overlay Z, çarpışma, free-side insert, stand edge wallId.
- **Callers (prod):** main, scene3d, moduleMove, wallReflow, cornerPlacement, autoDepot.
- **Flow:** `SnapPlacementToModules → GetItem`, `ValidatePlacementAgainstModules`.

### `src/moduleMove.js`

- **Sorumluluk:** sürekli duvarda insert/move planı.
- **Callers (prod):** `scene3d.js`.
- **Flow:** `PlanContinuousModuleInsert/Move → GetItem`.

### `src/wallReflow.js`

- **Sorumluluk:** sürekli duvar segmentleri ve layout/insert planı.
- **Callers (prod):** main, automaticWall, moduleMove.

### `src/wall.js`

- **Sorumluluk:** düz duvar uzunluk doğrulama + compose.
- **Callers (prod):** `automaticWall.js`.

### `src/automaticWall.js`

- **Sorumluluk:** stand tipine göre otomatik duvar dizisi.
- **Callers (prod):** `main.js`.
- **Not:** `featureContracts.js` runtime’da import edilmez.

### `src/autoDepot.js`

- **Sorumluluk:** depo yerleşim planı + içerik Item’ları.
- **Callers (prod):** `main.js`.

### `src/stripOccupancy.js`

- **Sorumluluk:** stand şerit metrikleri; Item `stripOccupancy` → görünür şerit.
- **Callers (prod):** scene3d, designState, moduleBehavior, modulePlacement, moduleDragSidebar.

### `src/standCapacity.js`

- **Sorumluluk:** X/Y eksen kapasite.
- **Exports:** `STAND_AXES`, `validateStandAxisCapacity`.
- **Callers (prod):** `main.js` (`validateStandAxisCapacity`).
- **Flow:** katalog ekleme kapasite kontrolü.

### `src/standSetup.js`

- **Sorumluluk:** stand tipi/ölçü doğrulama.
- **Callers (prod):** main, projectImportValidation, standStandardsCopy.

### `src/standDimensions.js`

- **Sorumluluk:** stand zarfı metre (`height`, `stripCount`, …) + `MODULE_WIDTHS_CM`.
- **Callers (prod):** wall, stripOccupancy, scene3d, modulePlacement, moduleBehavior, standStandardsCopy.

### `src/sceneDimensions.js`

- **Sorumluluk:** `SCENE_SURROUND_M`.
- **Callers (prod):** scene3d, standSetup, standStandardsCopy.

### `src/cornerPlacement.js`

- **Sorumluluk:** duvar köşesinde bitişik yerleşim.
- **Exports:** `resolveAdjacentPlacement`.
- **Callers (prod):** yok. Test: `cornerPlacement.test.js`, `rightWallOrientation.test.js`.
- **GitNexus process:** `ResolveAdjacentPlacement → GetWallAxis` (test/graph; production `main`/`scene3d` import yok).
- **Durum:** `TEST_ONLY`.

---

## D. UI

| Dosya | Sorumluluk | Prod callers |
| --- | --- | --- |
| `moduleDragSidebar.js` | katalog sürükle kartları / preview | main, scene3d, moduleContextMenu |
| `moduleContextMenu.js` | sağ tık menü, picker | main |
| `sidebarController.js` | sidebar aç/kapa | main |
| `colorEditorController.js` | HEX/RGB/CMYK | main |
| `colorEditorInputs.js` | input parse | colorEditorController |
| `colorUtils.js` | renk dönüşüm | colorEditorController |
| `helpGuide.js` | yardım kılavuzu | main |
| `projectUi.js` | loading overlay, busy button | main |
| `projectNaming.js` | proje adı | main |
| `projectSwitch.js` | proje değiştir onay | main |
| `selectionFeedback.js` | seçim metni | main, rawBomDebug |
| `stageFeedback.js` | sahne/kapasite mesajı | main |
| `placementFeedback.js` | ghost/placement UI | scene3d |
| `uiFeedback.js` | status tone observer | main |
| `standStandardsCopy.js` | standartlar listesi | main, helpGuide |
| `rectSelection.js` | dikdörtgen/panel range seçim | main, scene3d |
| `theme.js` | malzeme görünüm sabitleri | scene3d, moduleDragSidebar |

---

## E. Kalıcılık / import

| Dosya | Sorumluluk | Prod callers |
| --- | --- | --- |
| `configuratorDb.js` | IndexedDB aç | projectStore, assetStore |
| `projectStore.js` | proje CRUD | main |
| `assetStore.js` | görsel blob CRUD | main |
| `imageAssetReferences.js` | state içinde asset id remap/count/clear | main |
| `autosaveController.js` | autosave | main, projectActionSaveGuard |
| `projectActionSaveGuard.js` | kaydetmeden proje aksiyonu | HTML entry |
| `projectImportValidation.js` | zip/manifest/modül/stand doğrulama | main (manifest/asset/zip); test tam API |

---

## F. Görsel / layout yardımcıları

| Dosya | Sorumluluk | Prod callers |
| --- | --- | --- |
| `imageFit.js` | cover/contain | scene3d |
| `rectImageLayout.js` | dikdörtgen görsel yerleşim | scene3d |
| `horizontalImageLayout.js` | yatay görsel | scene3d |
| `surfaceStateBinding.js` | renderer ↔ surface state | scene3d |

---

## G. Production runtime’a bağlı olmayan `src/` (yine `src/` altında)

| Dosya | Prod import | Kullanım | Durum |
| --- | --- | --- | --- |
| `groundLayout.js` | yok | `test/groundLayout.test.js`; change-gate path map | `TEST_ONLY` |
| `featureContracts.js` | yok | `test/systemDevelopmentContract.test.js`; MD sözleşmesi | `TEST_ONLY` (governance) |
| `moduleContracts.js` | yok | çok sayıda contract test | `TEST_ONLY` (governance) |
| `systemChangeContract.js` | yok | `scripts/verify-change-contract.mjs` + gate testleri | `SCRIPT_ONLY` |
| `cornerPlacement.js` | yok | 2 unit test | `TEST_ONLY` |

`moduleContracts.js` `resolveModuleContract` GitNexus 19 caller — hepsi test dosyası (IMPORTS grafı). Runtime davranış `moduleBehavior.js` + `items.js`.

---

## H. CSS

| Dosya | Bind |
| --- | --- |
| `style.css` | `main.js` import |
| `colorEditor.css` | `main.js` import |
| `imageActions.css` | `main.js` import |
| `helpGuide.css` | `main.js` import |

---

## I. Community etiketleri (GitNexus)

Leiden community adları çoğunlukla `Cluster_N` / `Test` / `E2e` / `Scripts`. İnsan okunur domain adı değildir. Sembol sayısına göre büyük kümeler: Cluster_48 (68), Cluster_76 (53), Cluster_110 (51), Cluster_91 (49). `getItem` impact Cluster_48’i “direct” vurur.
