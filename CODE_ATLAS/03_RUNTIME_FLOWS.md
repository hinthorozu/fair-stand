# Runtime Flows

**Kanıt:** GitNexus 542 process. Resource `gitnexus://repo/fair-stand/processes` ilk 20’yi gösterir; tam liste Cypher `Process` + `STEP_IN_PROCESS` step=1.

**Yorum:** Process adları otomatik (`RestoreProject → GetItem`). Bir kullanıcı feature’ı birden fazla process üretir çünkü walk farklı terminallere dallanır. Aşağıda **entry sembol** bazında gruplandı.

İndeks: 542 process, çoğunluk `cross_community`.

## Entry’lere göre process yoğunluğu

Cypher: `STEP_IN_PROCESS` `step = 1`, `count(p)`:

| Entry | Dosya | Process sayısı |
| --- | --- | --- |
| `changeContextShelfLighting` | main.js | 10 |
| `duplicateContextModule` | main.js | 10 |
| `onDrop` | main.js | 10 |
| `onPointerUp` | main.js | 10 |
| `restoreProject` | main.js | 10 |
| `captureCurrentViewPng` | scene3d.js | 9 |
| `finishPlacementDrag` | scene3d.js | 9 |
| `initializeAssetLibrary` | main.js | 9 |
| `openStoredProject` | main.js | 9 |
| `requestDeleteImageAsset` | main.js | 9 |
| `resizeContextIlluminatedFoam` | main.js | 9 |
| `applyFabricCoverMode` | scene3d.js | 8 |
| `applyHorizontalImageAsset` | scene3d.js | 8 |
| `dropCatalogModuleDrag` | scene3d.js | 8 |
| `onPointerMove` / `onPreview` / `scene3d` | main.js | 8 |
| `createModuleContextMenu` | moduleContextMenu.js | 7 |
| `createPlacementGhost` / `createStandScene` | scene3d.js | 7 |
| `deleteImageAsset` / `saveImageAsset` / … | assetStore.js | 7 |
| `deleteProject` / `listProjects` | projectStore.js | 7 |
| `planContinuousModuleInsert/Move` | moduleMove.js | 7 |
| `onChange` / `onClick` | projectActionSaveGuard.js | 7 |

## Örnek izler (resource)

### RestoreProject → GetItem (10 adım)

```
restoreProject (main.js)
→ loadAssetsForActiveProject
→ loadImageAssets (assetStore.js)
→ openConfiguratorDb (configuratorDb.js)
→ open (moduleContextMenu.js)
→ describeModule
→ getModuleCatalogLabel (catalog.js)
→ getModuleCatalogItem
→ getCatalogItem
→ getItem (items.js)
```

**Yorum:** Proje geri yükleme, IndexedDB görselleri ve katalog label çözümlemesi aynı walk’ta `getItem`’a iner. Bu, Item registry’nin persist+UI ortak terminali olduğunu gösterir.

### RenderItemBom → GetItem / GetRecipeItemKey

query process_symbols:

`renderItemBom` → `resolveLines` / `resolveRecipe` → `expandRecipe` / `resolveRecipeItemsForPanelVariant` → `getItem`.

**Kanıt bağ:** `rawBomDebug.js` DEV `?rawBom`. Testler `resolveItemBom`’u doğrudan çağırır.

### Katalog sürükle / preview

`createModuleDragSidebar` → `getCatalogItem` / `projectCatalogItem` / `getItem`.  
`onPreview` / `dropCatalogModuleDrag` → `getWallOverlayZBoundsCm`, `snapCm`, `findModuleGroup`, `setPointerFromClient`.

### Context menu picker

`createModuleContextMenu` → `renderPickerCatalog` → `createPickerCard` → `getItem`.  
`submitPickerSelection` → `getItem`.

## Feature ailelerine göre process kümeleri

Aşağıdaki isimler GitNexus process önekleridir (uydurma değil).

### Proje / persist

`RestoreProject`, `OpenStoredProject`, `SaveProject`, `LoadProject`, `ListProjects`, `DeleteProject`, `DeleteProjectWithAssets`, `DeleteProjectImageAssets`, `LoadAssetsForActiveProject`.

Zincir: main controller → projectStore/assetStore → configuratorDb → (yan etki) catalog/getItem.

### Görsel asset

`InitializeAssetLibrary`, `SaveImageAsset`, `SaveImportedImageAsset`, `DeleteImageAsset`, `RequestDeleteImageAsset`, `ApplyRectImageAsset`, `ApplyHorizontalImageAsset`, `ClearImage`, `CaptureCurrentViewPng`.

Yan uçlar: `ComputeImageFit`, `CreateElement`, `Dispose`, `ReadDimensionField`.

### Yerleşim / drag

`OnPointerMove`, `OnPointerUp`, `OnPreview`, `OnDrop`, `DropCatalogModuleDrag`, `UpdatePlacementDrag`, `FinishPlacementDrag`, `CreatePlacementGhost`, `EnsurePlacementGhost`, `SnapPlacementToModules`, `PlanContinuousModuleInsert`, `PlanContinuousModuleMove`.

### Sahne composition

`FlushCatalogModuleAdds`, `ValidateCatalogAddBatch`, `Create*ModuleState` (flat-panel, base, counter, showcase, tv, door, …), `Scene3d`, `CreateStage`.

### Malzeme / kumaş

`ApplyFabricCoverMode`, `ApplyGlassMode`, `RebuildFabricOverlays`, `NormalizeFabricOwnership`.

### BOM debug

`RenderItemBom`.

## Process olmayan ama runtime olan yollar

GitNexus process listesi her HTML handler’ı ayrı isimle üretmez. Kanıtlı ek yollar:

| Yol | Kanıt |
| --- | --- |
| Stand kur / sahne oluştur | `main.js` + `validateStandSetup` + `createStandScene`/`createStage` |
| Zip import | `loadJSZip` dinamik `jszip` + `validateProjectArchiveManifest` |
| Kaydetme bekçisi | HTML ikinci entry `projectActionSaveGuard.js` (`onClick` process 7) |
| Yardım kılavuzu | `initHelpGuide` — process yoğunluğu düşük |
| Renk editörü | `createColorEditorController` |

## `groundLayout` / `featureContracts` process

`createGroundLayout` processes: `[]`.  
`getFeatureContract` processes: `[]`.

**Kanıt:** production execution flow’a bağlı değiller.
