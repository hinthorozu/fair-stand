# Symbol Dependency Map

**Kanıt:** GitNexus Cypher `CALLS` fan-in (`count(DISTINCT caller) >= 8`) ve `impact` upstream (test hariç, aksi belirtilir).

**Yorum:** Fan-in test dosyalarını da sayar. `getItem` 128 caller’ın çoğu test. Production impact ayrı satırda.

## En yüksek CALLS fan-in (src fonksiyonları)

| Sembol | Dosya | Callers (graph, test dahil) |
| --- | --- | --- |
| `getItem` | items.js | 128 |
| `getCatalogItem` | catalog.js | 51 |
| `getModuleBehavior` | moduleBehavior.js | 42 |
| `close` | moduleContextMenu.js | 40 |
| `createModuleStateFromDescriptor` | designState.js | 27 |
| `open` | moduleContextMenu.js | 27 |
| `normalizeModuleRotationZDeg` | modulePlacement.js | 26 |
| `resolveItemKey` | items.js | 25 |
| `isVerticalModuleRotation` | modulePlacement.js | 22 |
| `createId` | designState.js | 19 |
| `resolveModuleContract` | moduleContracts.js | 19 |
| `createModulePlacement` | modulePlacement.js | 19 |
| `getRecipeItemKey` | moduleRecipes.js | 19 |
| `resolveSceneDimensions` | items.js | 16 |
| `duplicateModuleState` / `applySceneFootprint` / `normalizeModuleItemState` | designState.js | 15 |
| `bindRendererSurfaceState` | surfaceStateBinding.js | 15 |
| `listCatalogItems` | catalog.js | 14 |
| `validatePlacementAgainstModules` | modulePlacement.js | 14 |
| `dispose` | viewCube.js | 14 |
| `getFloorItem` / `listRegisteredItems` | items.js | 13 |
| `createSelectionFrame` | scene3d.js | 13 |
| `resolveItemBom` | itemBom.js | 10 |
| `openConfiguratorDb` | configuratorDb.js | 10 |
| `rebuildWall` | main.js | 10 |

## Impact (production walk, `includeTests: false`)

| Target | Risk | Direct | Processes | Not |
| --- | --- | --- | --- | --- |
| `getItem` | CRITICAL | 60 | 79 | Hub. epistemic exact |
| `getModuleBehavior` | CRITICAL | 21 | 44 | Hub |
| `createModuleStateFromDescriptor` | CRITICAL | 4 | 5 | Process sayısı düşük; risk etiketi process/community’den |
| `createStandScene` | LOW | 1 | 0 (impact listesi) | Tek caller `main.js`. **Yorum:** dosya-içi fan-out impact’e yansımaz |
| `STAND_AXES` | UNKNOWN | 0 | 0 | İç kullanım; CALLS yok. riskNote: edge yok = unused kanıtı değil |
| `getRecipeInnerCornerPanelKey` | n/a (src export silindi) | 0 | 0 | Cleanup phase 1 |
| `validateImportedModuleState` | LOW | 1 | 0 | Caller: `validateImportedProjectState` (includeTests true iken main zinciri de görünür) |

## File IMPORTS fan-in (src dosyaları, test dahil)

En çok import edilen:

1. `items.js` — 88 importer  
2. `catalog.js` — 51  
3. `designState.js` — 45  
4. `moduleBehavior.js` — 33  
5. `modulePlacement.js` — 21  
6. `moduleContracts.js` — 19 (hepsi test)  
7. `moduleRecipes.js` — 17 (1 prod: itemBom)  

`main.js` importerCount 0 — HTML entry.

## Outgoing (hub dosyalar)

`scene3d.js` 20 `src/` import (Cypher IMPORTS listesi). `main.js` 28 `src/` import. Bu **fan-out hotspot**.

## String-key / registry (graph CALLS kaçırabilir)

| Mekanizma | Dosya | Yorum |
| --- | --- | --- |
| `ITEMS[itemKey]` | items.js | `getItem` |
| `MODULE_STATE_FACTORIES[type]` | designState.js | dynamic dispatch |
| `CATALOG_PREVIEW_RENDERERS` | moduleDragSidebar.js | preview key |
| `getModuleBehavior(moduleOrType)` | moduleBehavior.js | type/itemKey tablo |
| `MODULE_CONTRACT_ASSIGNMENTS` | moduleContracts.js | test-only |
| `FEATURE_CONTRACTS` | featureContracts.js | test-only |
| HTML `data-stand-type`, `data-module-key` | index.html / DOM | main/scene okur |

Bunlar `UNCERTAIN_DYNAMIC` değil; sabit tablolar. Silmeden önce tablo key taraması gerekir.

## `resolveModuleContract` 19 caller

Hepsi test. Production bağımlılık grafında yok. Yüksek fan-in **test sözleşmesi hub’ı**, runtime hub değil.
