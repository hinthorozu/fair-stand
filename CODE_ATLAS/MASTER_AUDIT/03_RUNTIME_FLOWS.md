# 03 — Runtime flows

**Kanıt:** GitNexus 543 process. Resource ilk 20 otomatik isim (`RestoreProject → GetItem`). `query` BOM: `RenderItemBom → GetRecipeItemKey`. `getItem` impact 79 process.

Process adı ≠ ürün feature adı. Aşağıda **kullanıcı akışı** olarak gruplandı; her zincir kaynak + graph ile doğrulandı.

## 1. Stand kur / sahne

```
index.html
→ main.js (stand tipi / X / Y)
→ standSetup + standCapacity
→ createStandScene (scene3d.js)   [context incoming: main.js]
→ getFloorItem / listFloorItems
→ zemin + duvar mesh (STAND_DIMENSIONS)
```

Test: PARTIAL (stand setup unit; sahne e2e smoke).

## 2. Katalog → state → renderer

```
listCatalogItems (catalog.js)  [catalogVisible]
→ moduleDragSidebar CATALOG_PREVIEW_RENDERERS[catalogPreview]
→ drop / flushCatalogModuleAdds (main)
→ createModuleStateFromDescriptor (designState)  [impact CRITICAL, 4 direct]
→ resolveItemKey + MODULE_STATE_FACTORIES[type]
→ createStandScene.buildWall / create*Module (scene3d)
```

`catalogPreview` object-key lookup — GitNexus CALLS kaçırabilir; **UNCERTAIN_DYNAMIC değil** (sabit `CATALOG_PREVIEWS` whitelist).

## 3. Taşı / snap / collision / ghost

```
onPointerMove / onPreview / dropCatalogModuleDrag
→ getModuleBehavior  [CRITICAL 21 direct / 45 process]
→ modulePlacement snap/validate
→ moduleMove planContinuous*
→ scene3d ghost / applyPlacementToGroup
```

`cornerPlacement.resolveAdjacentPlacement` bu zincirde **yok** (test-only). Production sağ duvar: `wallReflow.planContinuousWallLayout`.

## 4. Context menu / picker

```
createModuleContextMenu
→ renderPickerCatalog → getCatalogItem → getItem
→ submitPickerSelection → getItem
```

## 5. Proje kaydet / aç / sil / import

```
saveProject / openStoredProject / restoreProject
→ projectStore + assetStore
→ openConfiguratorDb
→ getItem (katalog label / floor)
```

Resource örneği: `RestoreProject → GetItem` 10 adım (main → loadAssets → db → describeModule → getCatalogItem → getItem).

Save guard: HTML ikinci entry, `GUARDED_BUTTON_IDS`.

## 6. Görsel / kumaş / cam

```
applyImageAsset / applyRectImageAsset / applyHorizontalImageAsset
→ imageFit / rectImageLayout / horizontalImageLayout
→ getItemSurfaceCapabilities (door-leaf hariç çoğunlukla false)
```

Process: ApplyRectImageAsset → ComputeImageFit / CreateElement.

## 7. BOM (DEV)

```
?rawBom + DEV
→ import rawBomDebug.js
→ resolveItemBom
→ expandRecipe (composition.mode === 'recipe')
→ resolveRecipeItemsForPanelVariant
   item.composition.innerCorner?.panelItemKey  (inline)
→ getItem
```

`resolveItemBom` impact: 1 direct (`renderItemBom`), 1 process, risk LOW. Kullanıcı production UI’si yok.

## 8. Otomatik duvar / depo

```
main → automaticWall / autoDepot
→ designState + items
```

`FEATURE_CONTRACTS` / `getFeatureContract` **okunmaz** (incoming yalnız test).

## 9. Kapasite

```
validateCatalogAddBatch / validateCurrentAxisCapacity
→ validateStandAxisCapacity
→ STAND_AXES.includes(axis)  (iç kullanım; export incoming graph boş)
```
