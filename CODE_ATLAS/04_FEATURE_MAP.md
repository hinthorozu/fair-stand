# Feature Map

Kural: gerçek dosya/sembol. Olmayan katman uydurulmadı.

Biçim:

```
FEATURE
→ entry
→ controller/handler
→ service/helper
→ state/data
→ renderer/scene
→ output
```

---

## FEATURE: Sahne oluşturma (stand tipi + X/Y)

→ **entry:** `index.html` `#create-stage`, stand type cards, `#stand-size-x/y`, `#floor-type`  
→ **handler:** `main.js` create-stage click; `validateStandSetup` (`standSetup.js`); `validateStandAxisCapacity` sonraki eklemelerde  
→ **service:** `composeAutomaticStandWall` / `composeAutomaticBackWallWithDepot` (`automaticWall.js` → `wall.js` + `wallReflow.js`); `planAutomaticDepot` (`autoDepot.js`)  
→ **state:** `createModuleStateFromDescriptor` / wall module list; `stand` `{standType,xCm,yCm,itemKey}`  
→ **renderer:** `createStandScene` → `createStage` / `buildWall` / `setFloorType`  
→ **output:** viewport Three.js sahne; `#stage-result` (`stageFeedback.js`)

`FEATURE_CONTRACTS.automaticWall` / `automaticDepot` bu zinciri **çalıştırmaz**; yalnız test/docs kaydı.

---

## FEATURE: Katalogdan modül ekleme (sürükle-bırak)

→ **entry:** `#open-module-catalog` → `createModuleDragSidebar`  
→ **handler:** `previewCatalogModuleDrag` / `dropCatalogModuleDrag` (`scene3d.js`); `onPreview`/`onDrop` (`main.js`)  
→ **service:** `getCatalogItem`/`listCatalogItems`; `getModuleBehavior`; `snapPlacementToModules` / overlay snap; `validateCatalogAddBatch` + `validateStandAxisCapacity`  
→ **state:** `createModuleStateFromDescriptor`  
→ **renderer:** `createPlacementGhost` / `createRenderableModule*`  
→ **output:** `currentModules` + sahne mesh

---

## FEATURE: Seçim, renk, görsel

→ **entry:** `#viewport` pointer; `#surface-color`, color editor inputs; `#surface-image`, fit/clear  
→ **handler:** `scene3d` selection; `createColorEditorController`; `applyColor` / `applyImageAsset` / `applyRectImageAsset` / `clearImage`  
→ **service:** `getItemSurfaceCapabilities`; `computeImageFit`; `createRectImageLayout` / `createHorizontalImageLayout`; `bindRendererSurfaceState`  
→ **state:** `moduleState.surface` (color, image transform, asset id)  
→ **renderer:** mesh material / texture  
→ **output:** seçim metni `describeSurfaceSelection` / `describeFloorSelection`

---

## FEATURE: Context menu (raf ışık, kumaş, cam, duplicate, foam boyut)

→ **entry:** sağ tık → `createModuleContextMenu`  
→ **handler:** `main.js` `changeContextShelfLighting`, `changeContextFabricMode`, `changeContextMeshMode`, `changeContextPanelGlassMode`, `duplicateContextModule`, `resizeContextIlluminatedFoam`  
→ **service:** `getModuleBehavior`; catalog picker `submitPickerSelection`  
→ **state:** ilgili moduleState alanları  
→ **renderer:** `setShelfLightingVisible`, `applyFabricMode`, `applyGlassMode`, `applyMeshMode`  
→ **output:** sahne + menü kapanışı

---

## FEATURE: Proje kaydet / aç / sil / değiştir

→ **entry:** `#save-project`, `#open-project`, `#delete-project`, `#project-select`, `#rename-project`  
→ **handler:** `main.js` `saveProject`/`openStoredProject`/`restoreProject`; `shouldConfirmProjectSwitch`  
→ **service:** `projectStore.js` ↔ `openConfiguratorDb`; `autosaveController.js`; `bindProjectActionSaveGuard` (HTML entry)  
→ **state:** project blob (modules + stand + assets meta)  
→ **renderer:** restore sonrası `buildWall` / asset replay  
→ **output:** `#project-status`, loading overlay (`projectUi.js`)

---

## FEATURE: Proje zip import/export

→ **entry:** `#export-project`, `#import-project`, `#import-project-file`  
→ **handler:** `main.js` export click; import file  
→ **service:** dinamik `jszip`; `isAllowedImportZipFile` / `validateProjectArchiveManifest` / `validateImportedAssetRecord` / `isAllowedImportImageType`; `remapImageAssetReferences`  
→ **state:** `PROJECT_ARCHIVE_VERSION = 1` (iç kullanım)  
→ **renderer:** restore ile aynı  
→ **output:** zip dosyası / yüklenmiş proje

İç yardımcılar: `validateImportedProjectState` → `validateImportedModuleState` + `validateImportedStandState`. Dışarıdan `main` bunları import etmez.

---

## FEATURE: Zemin tipi ve boya

→ **entry:** `#floor-type`; zemin seçimi  
→ **handler:** `setFloorType` / `setFloorColor`  
→ **service:** `listFloorItems`, `getFloorItem`, `resolveStandFloorItemKey`, `paintable`  
→ **state:** `stand.itemKey` (eski: `floorType`)  
→ **renderer:** zemin mesh/texture  
→ **output:** `describeFloorSelection`

---

## FEATURE: Sürekli duvar move/insert

→ **entry:** pointer drag (duvara bağlı modül)  
→ **handler:** `scene3d` pointer; `planContinuousModuleMove` / `planContinuousModuleInsert` (`moduleMove.js`)  
→ **service:** `getContinuousWallSegments` / `planContinuousWallInsertion` (`wallReflow.js`); `getModuleBehavior`  
→ **state:** `placement.wallId`, `startCm`  
→ **renderer:** ghost + rebuild  
→ **output:** güncellenmiş modules

---

## FEATURE: Render al (PNG)

→ **entry:** `#render-current-view`  
→ **handler:** `captureCurrentViewPng`  
→ **service:** `computeImageFit`  
→ **output:** PNG indirme (`CreateElement` process ucu)

---

## FEATURE: Raw BOM debug (DEV)

→ **entry:** `?rawBom` query (yalnız `import.meta.env.DEV`)  
→ **handler:** dinamik `rawBomDebug.js`  
→ **service:** `resolveItemBom` → `expandRecipe` → `getItem`  
→ **output:** DOM BOM listesi

Kullanıcıya açık maliyet ekranı yok.

---

## FEATURE: Change-gate (CI, runtime değil)

→ **entry:** `npm run contract:verify`  
→ **handler:** `scripts/verify-change-contract.mjs`  
→ **service:** `src/systemChangeContract.js`, `scripts/change-impact-analysis.mjs`  
→ **output:** CI fail/pass

---

## FEATURE: Yardım / standart metin

→ **entry:** help UI (`initHelpGuide`)  
→ **service:** `standStandardsCopy.js` (`STAND_DIMENSIONS`, stand setup copy)  
→ **output:** `#stand-standards-list` + kılavuz overlay
