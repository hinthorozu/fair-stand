# Atomik mekanizma hedefi

Kaynak: canlı `src/` + `MEKANIZMA_PARAMETRE` (HTML 21 aile) + `FAIR_STAND_104_ITEM_GRUPLARI.md` (24 grup). Bu turda üretim kodu yok.

21 veya 24 sayısı korunmadı. Recipe bir Item sınıfı değil. `moduleType === 'shelf'` hedef mimari değil.

## Özet

- Property: **188** / sınıflı **188**

- Atomik method: **28**

- Katmanlar: ITEM_DATA=45 · AUDIT_ONLY=6 · CATALOG_PROJECTION=27 · CONFIG_SHOULD_BE_ITEM=39 · METHOD_INPUT=25 · RUNTIME_STATE=33 · UI_AUDIT_FLAG=13

Hedef akış: `Item/instance config → canonical method → runtime/renderer`.

## HTML × MD karşılaştırma

### Yalnız HTML aile

| HTML aile | Kod yorumu |
|---|---|
| Item kimliği | MD ortak listede yok; kodda getItem — atomik identity method olarak kaldı (data kapısı). |
| Kanonik ölçü kaydı | MD “gerçek özellikler/ölçü” diye grup içinde; ayrı method değil data (readDimensions). |
| Katalog kartı | MD standalone vs recipe-only ayrımı; catalogEntry method. |
| Modül sözleşmesi | MD group 7 free-editable notu. Hedef: contract kalkar, Item config. |
| Capability tablosu | MD door_leaf özel durum. Kod: yalnız door-leaf. Hedef: color/image/glass config. |
| Factory | MD standalone=factory var. instantiate method. |
| TV/video-wall aile | MD grup 12 item grubu; mekanizma değil, dimensions data. |
| Işıklı strafor aile | MD grup 14. Atomik olarak image+halo+resize+place overlay. |
| Vitrin gövdesi | MD grup 19. composition child data, ayrı engine değil. |
| Short-up aile | MD grup 16 içinde variant. composition/stripOccupy data. |
| Sahne feature | MD’de yok. automatic-depot/wall instantiate+place zinciri. |
| Audit kanıt | MD’de yok. Mekanizma değil. |
| Strip occupancy aile | MD açık listelemedi; short-up/TV data. stripOccupy method. |


### Yalnız MD ortak mekanizma

| MD | HTML’de | Kod |
|---|---|---|
| fabricLight | cam-kumas içine gömülü (ayrı property yok) | toggle-fabric-light; isLightboxFabric |
| fabricMesh ayrı | cam-kumas + capabilities.mesh | toggle-mesh; fabricType mesh/lightbox |
| resize | isikli-strafor / ui.editable.foamResize | moduleType===illuminated-foam |
| delete | modul-davranis ui.contextMenu.delete | menü her modülde görünür |
| duplicate | modul-davranis ui.contextMenu.duplicate | duplicate-left/right |
| sideInsert | behavior.allowSideInsert | allowsModuleSideInsert → getModuleBehavior |
| select | 188 sütunda yok | moduleSelectionState / rectSelection |
| renderModel / procedural / overlay ayrı | tek sahne-renderer ailesi | createRenderableModule type switch |


### İkisinde var, farklı grup

| konu | HTML | MD | kod karar |
|---|---|---|---|
| Cam / kumaş yetkisi | capability tablosu + ayrı cam-kumas UI audit | wall parent gruplarında glass/lightbox/mesh var; capability’den bahsetmez | Kod MD+HTML ikisini de doğrular: UI panel seçimi, capability.glass false. Hedef config.glass, type if değil. |
| Raf ışığı | ayrı aile (2 property) | yalnız raflı wall grubunun sahne özelliği | Kod type===shelf. Hedef shelfLight.enabled on wall_shelf_* Item. |
| Düz banko 45° | hardcode + behavior tablosunda counter hâlâ 90 | grup 23 step 45, grup 24 L 90 + default 270 | getModuleRotationStepDeg: 100/150/200 straight 45; 50 ve L 90. HTML tablo type kaydını gösterir, override ayrı. MD doğru. |
| Leaf panel rotation 90 | behavior.* 104 item doldurulmuş gibi | panel_197 için fallback, gerçek özellik değil | TYPE_BEHAVIORS’ta panel yok → WALL_BEHAVIOR. MD doğru; HTML aile şişmesi. Hedef: place.mode=none leaf’te. |
| BOM / recipe | 30 property tek aile | grup 1–6 recipe-only + parent composition | Recipe sınıfı yok. resolveChildren(itemKey). |
| Image upright/profile | contract appearance.image editable | grup 7 image açık; hedef karar ayrı | Kod free-editable. MD uyarı doğru; config.image.enabled ayrıca karar. |
| TV color/image | tv-video-wall ölçü ailesi; color başka aile | kullanıcı color/image atamaz, renderer yönetir | contract wall-media color fixed, image renderer-managed. MD doğru. |
| Zemin | 2 property (paintable + floorSelect) | grup 15 + floor color | floorPaint ayrı atomik method; HTML floor color’u ui.editable.color’a yığmadı. MD tam. |
| connector_double | hardcode: recipe child yok | grup 5 leaf, sahnede factory yok | İkisi de doğru. Item durur; composition’da kullanılmıyor. |
| upright_99 / 49_5 factory | factory yok type listesinde upright var ama createUpright 346_5 | standalone move yok | factory({type:upright,itemKey:upright_99}) state.itemKey=upright_99 olabilir ama ölçü 346_5’ten gelir. MD: bu key katalogda standalone değil. |


## Atomik canonical method

### `getItem` — identity

**Sorumluluk:** Kanonik kimlik. Her şey Item’dır.

**Parametre:** `itemKey`

**Bugünkü çağrı:** src/items.js getItem, listRegisteredItems

**Migrasyon aşaması:** 0

**Bağlı property (5):**

- `itemKey`
- `name`
- `type`
- `state.itemKey`
- `state.type`

### `readDimensions` — dimensions

**Sorumluluk:** Ölçü verisi. Method değil, Item data.

**Parametre:** `item.dimensions.*Cm`

**Bugünkü çağrı:** factory Number(item.dimensions…), placement, renderer

**Migrasyon aşaması:** 1

**Bağlı property (36):**

- `static.dimensions.catalogHeightCm`
- `static.dimensions.depthCm`
- `static.dimensions.heightCm`
- `static.dimensions.lengthCm`
- `static.dimensions.mountHeightCm`
- `static.dimensions.screenHeightCm`
- `static.dimensions.screenWidthCm`
- `static.dimensions.tableDiameterCm`
- `static.dimensions.thicknessCm`
- `static.dimensions.wallGapCm`
- `static.dimensions.widthCm`
- `static.nominalModuleWidthCm`
- `static.sizeInch`
- `static.videoWall.cols`
- `static.videoWall.panelScreenHeightCm`
- `static.videoWall.panelScreenWidthCm`
- `static.videoWall.rows`
- `catalog.panelScreenHeightCm`
- `catalog.panelScreenWidthCm`
- `catalog.screenHeightCm`
- `catalog.screenWidthCm`
- `catalog.sizeInch`
- `catalog.videoWallCols`
- `catalog.videoWallRows`
- `state.panelScreenHeightCm`
- `state.panelScreenWidthCm`
- `state.screenHeightCm`
- `state.screenWidthCm`
- `state.sizeInch`
- `state.videoWallCols`
- `state.videoWallRows`
- `media.widthCm`
- `media.screenWidthCm`
- `media.screenHeightCm`
- `media.videoWallRows`
- `media.videoWallCols`

### `resolveChildren` — composition

**Sorumluluk:** Child Item listesi. Recipe sınıfı yok; BOM Item data + resolver.

**Parametre:** `itemKey → [{itemKey, quantity, unit}]`

**Bugünkü çağrı:** src/itemBom.js resolveItemBom, src/moduleRecipes.js getExpandedModuleRecipe

**Migrasyon aşaması:** 4

**Bağlı property (39):**

- `static.bodyItems.glassShelfItemKey`
- `static.bodyItems.horizontalItemKey`
- `static.bodyItems.sideItemKey`
- `static.composition.items`
- `static.composition.mode`
- `static.composition.moduleType`
- `static.composition.nominalWidthCm`
- `static.composition.options.shape`
- `static.composition.options.shelfCount`
- `static.connectorType`
- `static.eyeCount`
- `static.panelRole`
- `static.shelfCount`
- `static.unit`
- `static.variant`
- `catalog.eyeCount`
- `catalog.shelfCount`
- `catalog.unit`
- `catalog.variant`
- `contract.bom.mode`
- `contract.bom.source`
- `contract.bom.reason`
- `state.bodySurface`
- `state.eyeCount`
- `state.shelfCount`
- `bom.ok`
- `bom.error`
- `bom.lineCount`
- `bom.lines`
- `recipe.id`
- `recipe.moduleType`
- `recipe.connectionMode`
- `recipe.innerCornerPanelItemKey`
- `parents.recipe`
- `parents.innerCorner`
- `parents.replacement`
- `parents.cluster`
- `parents.showcaseBody`
- `profile.catalogWidthCm`

### `createInstance` — instantiate

**Sorumluluk:** Sahnedeki tek instance (modules[]). Type factory tablosu kalkacak.

**Parametre:** `itemKey, pose?, surfaceOverrides?`

**Bugünkü çağrı:** src/designState.js createModuleStateFromDescriptor / MODULE_STATE_FACTORIES

**Migrasyon aşaması:** 3

**Bağlı property (18):**

- `static.shape`
- `catalog.shape`
- `contract.present`
- `contract.profile`
- `contract.runtime.mode`
- `contract.composition.mode`
- `contract.state.owner`
- `contract.state.persistence`
- `factory.fn`
- `factory.ok`
- `factory.reason`
- `factory.stateKeys`
- `state.chairCount`
- `state.depthCm`
- `state.heightCm`
- `state.shape`
- `state.widthCm`
- `featureContracts`

### `listPlaceableItems` — catalogEntry

**Sorumluluk:** Katalogda görünüp sürüklenebilir mi. Leaf Item buraya girmez.

**Parametre:** `—`

**Bugünkü çağrı:** src/catalog.js MODULE_CATALOG, src/moduleDragSidebar.js

**Migrasyon aşaması:** 2

**Bağlı property (12):**

- `catalog.present`
- `catalog.inKeysList`
- `catalog.groups`
- `catalog.depthCm`
- `catalog.heightCm`
- `catalog.itemKey`
- `catalog.label`
- `catalog.preserveModelScale`
- `catalog.type`
- `catalog.visualRotationYDeg`
- `catalog.widthCm`
- `ui.sidebar`

### `place` — place

**Sorumluluk:** Konum kipi: wall | free | wall-overlay | top | none.

**Parametre:** `instance, {mode, wallId, xCm, yCm, zCm}`

**Bugünkü çağrı:** src/moduleBehavior.js placement, src/modulePlacement.js

**Migrasyon aşaması:** 2

**Bağlı property (3):**

- `behavior.placement`
- `behavior.explicitTypeEntry`
- `ui.editable.placement`

### `move` — move

**Sorumluluk:** Taşıma ızgarası. snapCm Item config.

**Parametre:** `instance, delta, {snapCm}`

**Bugünkü çağrı:** src/modulePlacement.js snapCm, getModuleMoveSnapCm

**Migrasyon aşaması:** 2

**Bağlı property (1):**

- `behavior.moveSnapCm`

### `rotate` — rotate

**Sorumluluk:** Dönüş. 45/90 ve L 270 config; type if değil.

**Parametre:** `instance, {stepDeg, defaultDeg}`

**Bugünkü çağrı:** src/moduleBehavior.js getModuleRotationStepDeg, viewKeyboardShortcuts Shift+R

**Migrasyon aşaması:** 2

**Bağlı property (4):**

- `behavior.defaultRotationDeg`
- `behavior.rotationStepDeg`
- `behavior.sideInsertRotation`
- `ui.editable.rotation`

### `resolveCollision` — collide

**Sorumluluk:** segment | footprint | none.

**Parametre:** `instance, others, {strategy}`

**Bugünkü çağrı:** src/modulePlacement.js, getModuleCollisionStrategy

**Migrasyon aşaması:** 3

**Bağlı property (10):**

- `behavior.boundarySnap`
- `behavior.collision`
- `behavior.collisionDepth`
- `behavior.collisionHeight`
- `behavior.connectionEndpoint`
- `behavior.endpointContact`
- `behavior.overlapWithTypes`
- `behavior.supportsWallOverlayMount`
- `behavior.wallCapacity`
- `behavior.collisionHeightRange`

### `snapMagnetic` — snapMagnetic

**Sorumluluk:** standard | none | short-up-joint.

**Parametre:** `instance, {strategy, wallCm, neighborCm}`

**Bugünkü çağrı:** src/modulePlacement.js MODULE_WALL_SNAP_DISTANCE_CM 50, NEIGHBOR 30

**Migrasyon aşaması:** 3

**Bağlı property (1):**

- `behavior.magneticSnap`

### `showGhost` — ghost

**Sorumluluk:** Yerleşim önizlemesi.

**Parametre:** `itemKey, pose, {opacity}`

**Bugünkü çağrı:** DEFAULT_GHOST_BEHAVIOR opacity 0.38

**Migrasyon aşaması:** 3

**Bağlı property (3):**

- `behavior.ghost.kind`
- `behavior.ghost.opacity`
- `behavior.ghost.renderer`

### `insertBeside` — sideInsert

**Sorumluluk:** Sağ/sol ekle. allowSideInsert config.

**Parametre:** `instance, side, itemKey[]`

**Bugünkü çağrı:** src/moduleContextMenu.js allowsModuleSideInsert

**Migrasyon aşaması:** 2

**Bağlı property (2):**

- `behavior.allowSideInsert`
- `ui.contextMenu.add`

### `applyColor` — color

**Sorumluluk:** Renk. enabled Item config; type adı değil.

**Parametre:** `target, hex`

**Bugünkü çağrı:** src/main.js applyActiveColorToSelection, designState applyColorOverride

**Migrasyon aşaması:** 1

**Bağlı property (7):**

- `static.defaultColor`
- `contract.appearance.color`
- `capabilities.color`
- `state.faces`
- `state.strips`
- `state.surface`
- `ui.editable.color`

### `applyImage` — image

**Sorumluluk:** Görsel. required bayrağı strafor için config.

**Parametre:** `target, assetId, transform?`

**Bugünkü çağrı:** src/scene3d.js applyImage, designState imageAssetId

**Migrasyon aşaması:** 1

**Bağlı property (4):**

- `contract.appearance.image`
- `capabilities.image`
- `state.imageAssetId`
- `ui.editable.image`

### `setGlass` — glass

**Sorumluluk:** Cam. Bugün selectionMode===panel; hedef: config.glass.enabled.

**Parametre:** `surface, on`

**Bugünkü çağrı:** src/scene3d.js supportsGlass, moduleContextMenu toggle-glass

**Migrasyon aşaması:** 1

**Bağlı property (2):**

- `capabilities.glass`
- `ui.editable.glass`

### `setFabric` — fabric

**Sorumluluk:** Kumaş. lightbox ve mesh aynı method, kind parametresi.

**Parametre:** `surface, {kind: lightbox|mesh|off}`

**Bugünkü çağrı:** src/scene3d.js applyFabricCoverMode, toggle-fabric / toggle-mesh

**Migrasyon aşaması:** 1

**Bağlı property (3):**

- `capabilities.lightbox`
- `capabilities.mesh`
- `ui.editable.fabric`

### `setFabricLight` — fabricLight

**Sorumluluk:** Lightbox aydınlatma. Ayrı type if yok; surface state.

**Parametre:** `surface, on`

**Bugünkü çağrı:** src/moduleContextMenu.js toggle-fabric-light, main.js

**Migrasyon aşaması:** 1

**Bağlı property (0):**



### `setShelfLight` — shelfLight

**Sorumluluk:** Raf LED. Bugün type===shelf; hedef: config.shelfLight.enabled.

**Parametre:** `instance, on`

**Bugünkü çağrı:** src/moduleContextMenu.js toggle-shelf-light, designState shelfLightingOn

**Migrasyon aşaması:** 1

**Bağlı property (2):**

- `state.shelfLightingOn`
- `ui.editable.shelfLight`

### `setHaloColor` — halo

**Sorumluluk:** Hale rengi. Strafor’a özel method değil; config.halo.enabled.

**Parametre:** `instance, hex`

**Bugünkü çağrı:** src/designState.js haloColor regex, scene3d halo material

**Migrasyon aşaması:** 2

**Bağlı property (1):**

- `state.haloColor`

### `resize` — resize

**Sorumluluk:** Boyut. Bugün type===illuminated-foam; min 10×5 kodda.

**Parametre:** `instance, {widthCm, heightCm, min}`

**Bugünkü çağrı:** src/moduleContextMenu.js resize-foam, designState Math.max(10/5)

**Migrasyon aşaması:** 2

**Bağlı property (2):**

- `state.wallGapCm`
- `ui.editable.foamResize`

### `resolveStripOccupancy` — stripOccupy

**Sorumluluk:** Duvar şeridi kaplama. Item data align/stripCount.

**Parametre:** `item, stand{stripCount,stripHeight}`

**Bugünkü çağrı:** src/stripOccupancy.js resolveModuleStripOccupancy

**Migrasyon aşaması:** 3

**Bağlı property (8):**

- `static.stripOccupancy.align`
- `static.stripOccupancy.stripCount`
- `catalog.stripOccupancy.align`
- `catalog.stripOccupancy.stripCount`
- `behavior.stripOccupancyResolved`
- `state.stripOccupancy`
- `state.stripOccupancy.align`
- `state.stripOccupancy.stripCount`

### `render` — render

**Sorumluluk:** Görsel. kind: procedural | model | overlay | media. Type switch kalkacak.

**Parametre:** `instance, {kind}`

**Bugünkü çağrı:** src/scene3d.js createRenderableModule

**Migrasyon aşaması:** 5

**Bağlı property (13):**

- `static.material`
- `static.modelFile`
- `static.modelRotationYDeg`
- `static.preserveModelScale`
- `static.visualRotationYDeg`
- `catalog.modelFile`
- `catalog.modelRotationYDeg`
- `contract.renderer.mode`
- `state.modelFile`
- `state.modelRotationYDeg`
- `state.preserveModelScale`
- `state.visualRotationYDeg`
- `renderer.fn`

### `deleteInstance` — delete

**Sorumluluk:** Sil. Config.delete.enabled (bugün her modül menüde).

**Parametre:** `instanceId`

**Bugünkü çağrı:** src/moduleContextMenu.js data-module-action=delete

**Migrasyon aşaması:** 2

**Bağlı property (1):**

- `ui.contextMenu.delete`

### `duplicateInstance` — duplicate

**Sorumluluk:** Çoğalt. Config.duplicate.enabled.

**Parametre:** `instanceId, side`

**Bugünkü çağrı:** src/moduleContextMenu.js duplicate-left/right

**Migrasyon aşaması:** 2

**Bağlı property (1):**

- `ui.contextMenu.duplicate`

### `assignFloor` — floorSelect

**Sorumluluk:** Zemin Item seçimi. Modül değil.

**Parametre:** `floorItemKey`

**Bugünkü çağrı:** src/main.js assignStandFloorItem, scene3d setFloorType

**Migrasyon aşaması:** 2

**Bağlı property (1):**

- `ui.editable.floorSelect`

### `setFloorColor` — floorPaint

**Sorumluluk:** Zemin boyası. item.paintable config.

**Parametre:** `hex`

**Bugünkü çağrı:** src/scene3d.js setFloorColor, items.js paintable

**Migrasyon aşaması:** 2

**Bağlı property (1):**

- `static.paintable`

### `saveProject` — persist

**Sorumluluk:** IndexedDB tüm proje. Whitelist yok.

**Parametre:** `project`

**Bugünkü çağrı:** src/projectStore.js saveProject

**Migrasyon aşaması:** 6

**Bağlı property (2):**

- `persist.projectBlob`
- `persist.path`

### `select` — select

**Sorumluluk:** Seçim / çoklu seçim. Item config değil, editor.

**Parametre:** `target[]`

**Bugünkü çağrı:** src/moduleSelectionState.js, rectSelection

**Migrasyon aşaması:** 6

**Bağlı property (0):**



## 188 property sınıflandırma

| id | katman | hedef method | HTML aile | not |
|---|---|---|---|---|
| `itemKey` | ITEM_DATA | `identity` | Item kimliği |  |
| `name` | ITEM_DATA | `identity` | Item kimliği |  |
| `type` | ITEM_DATA | `identity` | Item kimliği |  |
| `registry` | AUDIT_ONLY | `— (mekanizma değil)` | Item kimliği | Audit map adı; runtime kimliği itemKey. |
| `static.bodyItems.glassShelfItemKey` | ITEM_DATA | `composition` | Vitrin gövdesi |  |
| `static.bodyItems.horizontalItemKey` | ITEM_DATA | `composition` | Vitrin gövdesi |  |
| `static.bodyItems.sideItemKey` | ITEM_DATA | `composition` | Vitrin gövdesi |  |
| `static.composition.items` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.composition.mode` | ITEM_DATA | `composition` | BOM ve recipe | Recipe bir sınıf değil; composition child listesinin bugünkü adı. |
| `static.composition.moduleType` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.composition.nominalWidthCm` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.composition.options.shape` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.composition.options.shelfCount` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.connectorType` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.defaultColor` | ITEM_DATA | `color` | Yüzey rengi ve görseli |  |
| `static.dimensions.catalogHeightCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.dimensions.depthCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.dimensions.heightCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.dimensions.lengthCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.dimensions.mountHeightCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.dimensions.screenHeightCm` | ITEM_DATA | `dimensions` | TV / video wall ölçüsü |  |
| `static.dimensions.screenWidthCm` | ITEM_DATA | `dimensions` | TV / video wall ölçüsü |  |
| `static.dimensions.tableDiameterCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.dimensions.thicknessCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.dimensions.wallGapCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.dimensions.widthCm` | ITEM_DATA | `dimensions` | Kanonik ölçü kaydı |  |
| `static.eyeCount` | ITEM_DATA | `composition` | Vitrin gövdesi |  |
| `static.material` | ITEM_DATA | `render` | 3D çizim dalı |  |
| `static.modelFile` | ITEM_DATA | `render` | 3D çizim dalı |  |
| `static.modelRotationYDeg` | ITEM_DATA | `render` | 3D çizim dalı |  |
| `static.nominalModuleWidthCm` | ITEM_DATA | `dimensions` | BOM ve recipe |  |
| `static.paintable` | ITEM_DATA | `floorPaint` | Zemin seçimi ve boyası |  |
| `static.panelRole` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.preserveModelScale` | ITEM_DATA | `render` | 3D çizim dalı |  |
| `static.shape` | ITEM_DATA | `instantiate` | Runtime module state fabrikası |  |
| `static.shelfCount` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.sizeInch` | ITEM_DATA | `dimensions` | TV / video wall ölçüsü |  |
| `static.stripOccupancy.align` | ITEM_DATA | `stripOccupy` | Şerit doluluğu |  |
| `static.stripOccupancy.stripCount` | ITEM_DATA | `stripOccupy` | Şerit doluluğu |  |
| `static.unit` | ITEM_DATA | `composition` | BOM ve recipe |  |
| `static.variant` | ITEM_DATA | `composition` | Short-up duvar varyantı |  |
| `static.videoWall.cols` | ITEM_DATA | `dimensions` | TV / video wall ölçüsü |  |
| `static.videoWall.panelScreenHeightCm` | ITEM_DATA | `dimensions` | TV / video wall ölçüsü |  |
| `static.videoWall.panelScreenWidthCm` | ITEM_DATA | `dimensions` | TV / video wall ölçüsü |  |
| `static.videoWall.rows` | ITEM_DATA | `dimensions` | TV / video wall ölçüsü |  |
| `static.visualRotationYDeg` | ITEM_DATA | `render` | 3D çizim dalı |  |
| `catalog.present` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `catalog.inKeysList` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `catalog.groups` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `catalog.depthCm` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `catalog.eyeCount` | CATALOG_PROJECTION | `composition` | Vitrin gövdesi |  |
| `catalog.heightCm` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `catalog.itemKey` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `catalog.label` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `catalog.modelFile` | CATALOG_PROJECTION | `render` | 3D çizim dalı |  |
| `catalog.modelRotationYDeg` | CATALOG_PROJECTION | `render` | 3D çizim dalı |  |
| `catalog.panelScreenHeightCm` | CATALOG_PROJECTION | `dimensions` | TV / video wall ölçüsü |  |
| `catalog.panelScreenWidthCm` | CATALOG_PROJECTION | `dimensions` | TV / video wall ölçüsü |  |
| `catalog.preserveModelScale` | CATALOG_PROJECTION | `catalogEntry` | 3D çizim dalı |  |
| `catalog.screenHeightCm` | CATALOG_PROJECTION | `dimensions` | TV / video wall ölçüsü |  |
| `catalog.screenWidthCm` | CATALOG_PROJECTION | `dimensions` | TV / video wall ölçüsü |  |
| `catalog.shape` | CATALOG_PROJECTION | `instantiate` | Runtime module state fabrikası |  |
| `catalog.shelfCount` | CATALOG_PROJECTION | `composition` | BOM ve recipe |  |
| `catalog.sizeInch` | CATALOG_PROJECTION | `dimensions` | TV / video wall ölçüsü |  |
| `catalog.stripOccupancy.align` | CATALOG_PROJECTION | `stripOccupy` | Şerit doluluğu |  |
| `catalog.stripOccupancy.stripCount` | CATALOG_PROJECTION | `stripOccupy` | Şerit doluluğu |  |
| `catalog.type` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `catalog.unit` | CATALOG_PROJECTION | `composition` | BOM ve recipe |  |
| `catalog.variant` | CATALOG_PROJECTION | `composition` | Short-up duvar varyantı |  |
| `catalog.videoWallCols` | CATALOG_PROJECTION | `dimensions` | TV / video wall ölçüsü |  |
| `catalog.videoWallRows` | CATALOG_PROJECTION | `dimensions` | TV / video wall ölçüsü |  |
| `catalog.visualRotationYDeg` | CATALOG_PROJECTION | `catalogEntry` | 3D çizim dalı |  |
| `catalog.widthCm` | CATALOG_PROJECTION | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `contract.present` | CONFIG_SHOULD_BE_ITEM | `instantiate` | Modül sözleşmesi |  |
| `contract.profile` | CONFIG_SHOULD_BE_ITEM | `instantiate` | Modül sözleşmesi |  |
| `contract.appearance.color` | CONFIG_SHOULD_BE_ITEM | `color` | Modül sözleşmesi |  |
| `contract.appearance.image` | CONFIG_SHOULD_BE_ITEM | `image` | Modül sözleşmesi |  |
| `contract.renderer.mode` | CONFIG_SHOULD_BE_ITEM | `render` | Modül sözleşmesi |  |
| `contract.runtime.mode` | CONFIG_SHOULD_BE_ITEM | `instantiate` | Modül sözleşmesi |  |
| `contract.composition.mode` | CONFIG_SHOULD_BE_ITEM | `instantiate` | Modül sözleşmesi |  |
| `contract.bom.mode` | CONFIG_SHOULD_BE_ITEM | `composition` | BOM ve recipe |  |
| `contract.bom.source` | CONFIG_SHOULD_BE_ITEM | `composition` | BOM ve recipe |  |
| `contract.bom.reason` | CONFIG_SHOULD_BE_ITEM | `composition` | BOM ve recipe |  |
| `contract.state.owner` | CONFIG_SHOULD_BE_ITEM | `instantiate` | Modül sözleşmesi |  |
| `contract.state.persistence` | CONFIG_SHOULD_BE_ITEM | `instantiate` | Modül sözleşmesi |  |
| `behavior.allowSideInsert` | CONFIG_SHOULD_BE_ITEM | `sideInsert` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.boundarySnap` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.collision` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.collisionDepth` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.collisionHeight` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.connectionEndpoint` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.defaultRotationDeg` | CONFIG_SHOULD_BE_ITEM | `rotate` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.endpointContact` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.ghost.kind` | CONFIG_SHOULD_BE_ITEM | `ghost` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.ghost.opacity` | CONFIG_SHOULD_BE_ITEM | `ghost` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.ghost.renderer` | CONFIG_SHOULD_BE_ITEM | `ghost` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.magneticSnap` | CONFIG_SHOULD_BE_ITEM | `snapMagnetic` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.moveSnapCm` | CONFIG_SHOULD_BE_ITEM | `move` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.overlapWithTypes` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.placement` | CONFIG_SHOULD_BE_ITEM | `place` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.rotationStepDeg` | CONFIG_SHOULD_BE_ITEM | `rotate` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.sideInsertRotation` | CONFIG_SHOULD_BE_ITEM | `rotate` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.supportsWallOverlayMount` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.wallCapacity` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.explicitTypeEntry` | CONFIG_SHOULD_BE_ITEM | `place` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) |  |
| `behavior.collisionHeightRange` | CONFIG_SHOULD_BE_ITEM | `collide` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `behavior.stripOccupancyResolved` | CONFIG_SHOULD_BE_ITEM | `stripOccupy` | Şerit doluluğu | TYPE_BEHAVIORS type tablosu; leaf Item’lara DEFAULT_BEHAVIOR=WALL_BEHAVIOR bulaşır. MD: bu fallback gerçek özellik değil. |
| `capabilities.color` | CONFIG_SHOULD_BE_ITEM | `color` | Item yüzey capability tablosu | itemCapabilities yalnız door-leaf color+image true; glass/lightbox/mesh hep false. Cam UI selectionMode===panel. |
| `capabilities.image` | CONFIG_SHOULD_BE_ITEM | `image` | Item yüzey capability tablosu | itemCapabilities yalnız door-leaf color+image true; glass/lightbox/mesh hep false. Cam UI selectionMode===panel. |
| `capabilities.glass` | CONFIG_SHOULD_BE_ITEM | `glass` | Item yüzey capability tablosu | itemCapabilities yalnız door-leaf color+image true; glass/lightbox/mesh hep false. Cam UI selectionMode===panel. |
| `capabilities.lightbox` | CONFIG_SHOULD_BE_ITEM | `fabric` | Item yüzey capability tablosu | itemCapabilities yalnız door-leaf color+image true; glass/lightbox/mesh hep false. Cam UI selectionMode===panel. |
| `capabilities.mesh` | CONFIG_SHOULD_BE_ITEM | `fabric` | Item yüzey capability tablosu | itemCapabilities yalnız door-leaf color+image true; glass/lightbox/mesh hep false. Cam UI selectionMode===panel. |
| `factory.fn` | METHOD_INPUT | `instantiate` | Runtime module state fabrikası |  |
| `factory.ok` | METHOD_INPUT | `instantiate` | Runtime module state fabrikası |  |
| `factory.reason` | METHOD_INPUT | `instantiate` | Runtime module state fabrikası |  |
| `factory.stateKeys` | METHOD_INPUT | `instantiate` | Runtime module state fabrikası |  |
| `state.bodySurface` | RUNTIME_STATE | `composition` | Vitrin gövdesi |  |
| `state.chairCount` | RUNTIME_STATE | `instantiate` | Runtime module state fabrikası |  |
| `state.depthCm` | RUNTIME_STATE | `instantiate` | Runtime module state fabrikası |  |
| `state.eyeCount` | RUNTIME_STATE | `composition` | Vitrin gövdesi |  |
| `state.faces` | RUNTIME_STATE | `color` | Yüzey rengi ve görseli |  |
| `state.haloColor` | RUNTIME_STATE | `halo` | Işıklı strafor |  |
| `state.heightCm` | RUNTIME_STATE | `instantiate` | Runtime module state fabrikası |  |
| `state.imageAssetId` | RUNTIME_STATE | `image` | Işıklı strafor | HTML strafor ailesine koydu; yüzey imageAssetId strips/faces altında da var. |
| `state.itemKey` | RUNTIME_STATE | `identity` | Item kimliği |  |
| `state.modelFile` | RUNTIME_STATE | `render` | 3D çizim dalı |  |
| `state.modelRotationYDeg` | RUNTIME_STATE | `render` | 3D çizim dalı |  |
| `state.panelScreenHeightCm` | RUNTIME_STATE | `dimensions` | TV / video wall ölçüsü |  |
| `state.panelScreenWidthCm` | RUNTIME_STATE | `dimensions` | TV / video wall ölçüsü |  |
| `state.preserveModelScale` | RUNTIME_STATE | `render` | 3D çizim dalı |  |
| `state.screenHeightCm` | RUNTIME_STATE | `dimensions` | TV / video wall ölçüsü |  |
| `state.screenWidthCm` | RUNTIME_STATE | `dimensions` | TV / video wall ölçüsü |  |
| `state.shape` | RUNTIME_STATE | `instantiate` | Runtime module state fabrikası |  |
| `state.shelfCount` | RUNTIME_STATE | `composition` | BOM ve recipe |  |
| `state.shelfLightingOn` | RUNTIME_STATE | `shelfLight` | Raf altı ışık |  |
| `state.sizeInch` | RUNTIME_STATE | `dimensions` | TV / video wall ölçüsü |  |
| `state.stripOccupancy` | RUNTIME_STATE | `stripOccupy` | Şerit doluluğu |  |
| `state.stripOccupancy.align` | RUNTIME_STATE | `stripOccupy` | Şerit doluluğu |  |
| `state.stripOccupancy.stripCount` | RUNTIME_STATE | `stripOccupy` | Şerit doluluğu |  |
| `state.strips` | RUNTIME_STATE | `color` | Yüzey rengi ve görseli |  |
| `state.surface` | RUNTIME_STATE | `color` | Yüzey rengi ve görseli |  |
| `state.type` | RUNTIME_STATE | `identity` | Item kimliği |  |
| `state.videoWallCols` | RUNTIME_STATE | `dimensions` | TV / video wall ölçüsü |  |
| `state.videoWallRows` | RUNTIME_STATE | `dimensions` | TV / video wall ölçüsü |  |
| `state.visualRotationYDeg` | RUNTIME_STATE | `render` | 3D çizim dalı |  |
| `state.wallGapCm` | RUNTIME_STATE | `resize` | Işıklı strafor |  |
| `state.widthCm` | RUNTIME_STATE | `instantiate` | Runtime module state fabrikası |  |
| `bom.ok` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `bom.error` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `bom.lineCount` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `bom.lines` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `recipe.id` | METHOD_INPUT | `composition` | BOM ve recipe | Recipe bir sınıf değil; composition child listesinin bugünkü adı. |
| `recipe.moduleType` | METHOD_INPUT | `composition` | BOM ve recipe | Recipe bir sınıf değil; composition child listesinin bugünkü adı. |
| `recipe.connectionMode` | METHOD_INPUT | `composition` | BOM ve recipe | Recipe bir sınıf değil; composition child listesinin bugünkü adı. |
| `recipe.innerCornerPanelItemKey` | METHOD_INPUT | `composition` | BOM ve recipe | Recipe bir sınıf değil; composition child listesinin bugünkü adı. |
| `parents.recipe` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `parents.innerCorner` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `parents.replacement` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `parents.cluster` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `parents.showcaseBody` | METHOD_INPUT | `composition` | Vitrin gövdesi |  |
| `media.widthCm` | METHOD_INPUT | `dimensions` | TV / video wall ölçüsü |  |
| `media.screenWidthCm` | METHOD_INPUT | `dimensions` | TV / video wall ölçüsü |  |
| `media.screenHeightCm` | METHOD_INPUT | `dimensions` | TV / video wall ölçüsü |  |
| `media.videoWallRows` | METHOD_INPUT | `dimensions` | TV / video wall ölçüsü |  |
| `media.videoWallCols` | METHOD_INPUT | `dimensions` | TV / video wall ölçüsü |  |
| `profile.catalogWidthCm` | METHOD_INPUT | `composition` | BOM ve recipe |  |
| `renderer.fn` | METHOD_INPUT | `render` | 3D çizim dalı |  |
| `ui.sidebar` | UI_AUDIT_FLAG | `catalogEntry` | Katalog kartı ve sürükle-bırak |  |
| `ui.contextMenu.delete` | UI_AUDIT_FLAG | `delete` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) |  |
| `ui.contextMenu.duplicate` | UI_AUDIT_FLAG | `duplicate` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) |  |
| `ui.contextMenu.add` | UI_AUDIT_FLAG | `sideInsert` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) |  |
| `ui.editable.color` | UI_AUDIT_FLAG | `color` | Yüzey rengi ve görseli |  |
| `ui.editable.image` | UI_AUDIT_FLAG | `image` | Yüzey rengi ve görseli |  |
| `ui.editable.glass` | UI_AUDIT_FLAG | `glass` | Cam panel ve kumaş (lightbox/mesh) | Audit bayrağı; runtime type adından değil panel seçiminden. |
| `ui.editable.fabric` | UI_AUDIT_FLAG | `fabric` | Cam panel ve kumaş (lightbox/mesh) | Audit bayrağı; runtime type adından değil panel seçiminden. |
| `ui.editable.shelfLight` | UI_AUDIT_FLAG | `shelfLight` | Raf altı ışık | Kod: moduleType === 'shelf'. Hedef: config. |
| `ui.editable.foamResize` | UI_AUDIT_FLAG | `resize` | Işıklı strafor | Kod: moduleType === 'illuminated-foam'. Hedef: config.resize.enabled. |
| `ui.editable.floorSelect` | UI_AUDIT_FLAG | `floorSelect` | Zemin seçimi ve boyası |  |
| `ui.editable.placement` | UI_AUDIT_FLAG | `place` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) |  |
| `ui.editable.rotation` | UI_AUDIT_FLAG | `rotate` | Modül davranışı (yerleşim, dönüş, çarpışma, ghost) |  |
| `persist.projectBlob` | RUNTIME_STATE | `persist` | Proje kaydı |  |
| `persist.path` | RUNTIME_STATE | `persist` | Proje kaydı |  |
| `featureContracts` | METHOD_INPUT | `instantiate` | Sahne feature sözleşmesi |  |
| `docs.definition` | AUDIT_ONLY | `— (mekanizma değil)` | Audit kanıt sütunu (çalışan mekanizma değil) |  |
| `tests.srcHits` | AUDIT_ONLY | `— (mekanizma değil)` | Audit kanıt sütunu (çalışan mekanizma değil) |  |
| `tests.unitHits` | AUDIT_ONLY | `— (mekanizma değil)` | Audit kanıt sütunu (çalışan mekanizma değil) |  |
| `tests.e2eHits` | AUDIT_ONLY | `— (mekanizma değil)` | Audit kanıt sütunu (çalışan mekanizma değil) |  |
| `tests.docHits` | AUDIT_ONLY | `— (mekanizma değil)` | Audit kanıt sütunu (çalışan mekanizma değil) |  |


## MD 24 grup — kod doğrulama

`katalog` = MODULE_CATALOG. `factory` = createModuleStateFromDescriptor. `explicit` = TYPE_BEHAVIORS kaydı. explicit hayır ise placement WALL_BEHAVIOR fallback (MD ile uyumlu: leaf için gerçek özellik değil).

### 1. Recipe-only dikmeler

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `upright_99` | upright | hayır | evet | upright_346_5 | evet | free | 90 | 50 |
| `upright_49_5` | upright | hayır | evet | upright_346_5 | evet | free | 90 | 50 |


### 2. Recipe-only düz paneller

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `panel_48_5` | panel | hayır | hayır |  | hayır | wall | 90 | 50 |
| `panel_98` | panel | hayır | hayır |  | hayır | wall | 90 | 50 |
| `panel_147_5` | panel | hayır | hayır |  | hayır | wall | 90 | 50 |
| `panel_197` | panel | hayır | hayır |  | hayır | wall | 90 | 50 |


### 3. Recipe-only köşe panelleri

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `panel_corner_42_5` | panel | hayır | hayır |  | hayır | wall | 90 | 50 |
| `panel_corner_92` | panel | hayır | hayır |  | hayır | wall | 90 | 50 |
| `panel_corner_142_5` | panel | hayır | hayır |  | hayır | wall | 90 | 50 |
| `panel_corner_192` | panel | hayır | hayır |  | hayır | wall | 90 | 50 |


### 4. Separatör leaf panelleri

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `separator_panel_48_5` | separator-panel | hayır | hayır |  | hayır | wall | 90 | 50 |
| `separator_panel_98` | separator-panel | hayır | hayır |  | hayır | wall | 90 | 50 |


### 5. Connector leaf

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `connector_start` | connector | hayır | hayır |  | hayır | wall | 90 | 50 |
| `connector_single` | connector | hayır | hayır |  | hayır | wall | 90 | 50 |
| `connector_double` | connector | hayır | hayır |  | hayır | wall | 90 | 50 |
| `connector_corner` | connector | hayır | hayır |  | hayır | wall | 90 | 50 |


### 6. Diğer recipe-only parçalar

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `door_leaf_100` | door-leaf | hayır | hayır |  | hayır | wall | 90 | 50 |
| `shelf_100` | shelf | hayır | hayır |  | evet | wall | 90 | 50 |
| `shelf_150` | shelf | hayır | hayır |  | evet | wall | 90 | 50 |
| `shelf_200` | shelf | hayır | hayır |  | evet | wall | 90 | 50 |
| `shelf_leg` | shelf-accessory | hayır | hayır |  | hayır | wall | 90 | 50 |
| `showcase_side_94_6_30` | showcase-board | hayır | hayır |  | hayır | wall | 90 | 50 |
| `showcase_side_143_5_30` | showcase-board | hayır | hayır |  | hayır | wall | 90 | 50 |
| `showcase_horizontal_87_4_30` | showcase-board | hayır | hayır |  | hayır | wall | 90 | 50 |
| `glass_shelf` | showcase-accessory | hayır | hayır |  | hayır | wall | 90 | 50 |
| `counter_top_110_60` | counter-top | hayır | hayır |  | hayır | wall | 90 | 50 |
| `counter_top_52_60` | counter-top | hayır | hayır |  | hayır | wall | 90 | 50 |
| `counter_top_160_60` | counter-top | hayır | hayır |  | hayır | wall | 90 | 50 |
| `counter_top_102_60` | counter-top | hayır | hayır |  | hayır | wall | 90 | 50 |
| `counter_top_210_60` | counter-top | hayır | hayır |  | hayır | wall | 90 | 50 |
| `counter_top_150_60` | counter-top | hayır | hayır |  | hayır | wall | 90 | 50 |
| `base_top_107_50` | base-top | hayır | hayır |  | hayır | wall | 90 | 50 |
| `base_top_157_50` | base-top | hayır | hayır |  | hayır | wall | 90 | 50 |
| `base_top_206_50` | base-top | hayır | hayır |  | hayır | wall | 90 | 50 |


### 7. Standalone dikme / profil

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `upright_346_5` | upright | evet | evet | upright_346_5 | evet | free | 90 | 50 |
| `profile_41_5` | profile | evet | evet | profile_41_5 | evet | wall | 90 | 50 |
| `profile_91` | profile | evet | evet | profile_91 | evet | wall | 90 | 50 |
| `profile_140_5` | profile | evet | evet | profile_140_5 | evet | wall | 90 | 50 |
| `profile_190` | profile | evet | evet | profile_190 | evet | wall | 90 | 50 |


### 8. Sabit ticari GLB

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `COAT_RACK` | coat-rack | evet | evet | COAT_RACK | evet | free | 90 | 10 |
| `KETTLE` | kettle | evet | evet | KETTLE | evet | free | 90 | 10 |
| `MINI_FRIDGE_AVANTI` | mini-fridge | evet | evet | MINI_FRIDGE_AVANTI | evet | free | 90 | 10 |
| `PLASTIC_TRASH_BIN` | plastic-trash-bin | evet | evet | PLASTIC_TRASH_BIN | evet | free | 90 | 10 |


### 9. Renklenebilir mobilyalar

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `furniture_sofa_set_classic` | sofa-set-classic | evet | evet | furniture_sofa_set_classic | evet | free | 90 | 10 |
| `furniture_sofa_single_classic` | sofa-single-classic | evet | evet | furniture_sofa_single_classic | evet | free | 45 | 10 |
| `furniture_sofa_double_classic` | sofa-double-classic | evet | evet | furniture_sofa_double_classic | evet | free | 90 | 10 |
| `furniture_table_chair_set_eames` | table-chair-set-eames | evet | evet | furniture_table_chair_set_eames | evet | free | 90 | 10 |
| `chair_eames` | chair | evet | evet | chair_eames | evet | free | 90 | 10 |
| `furniture_bar_stool_classic` | bar-stool | evet | evet | furniture_bar_stool_classic | evet | free | 45 | 10 |


### 10. Sabit mobilyalar

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `furniture_coffee_table_classic` | coffee-table-classic | evet | evet | furniture_coffee_table_classic | evet | free | 90 | 10 |
| `glass_table` | table-glass | evet | evet | glass_table | evet | free | 90 | 10 |


### 11. Bitki / saksı

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `EXTRA_INDOOR_PLANT_1` | indoor-plant-1 | evet | evet | EXTRA_INDOOR_PLANT_1 | evet | free | 90 | 10 |
| `EXTRA_LONG_PLANTER_100` | indoor-plant-1 | evet | evet | EXTRA_LONG_PLANTER_100 | evet | free | 90 | 10 |
| `EXTRA_LONG_PLANTER_150` | indoor-plant-1 | evet | evet | EXTRA_LONG_PLANTER_150 | evet | free | 90 | 10 |
| `EXTRA_LONG_PLANTER_200` | indoor-plant-1 | evet | evet | EXTRA_LONG_PLANTER_200 | evet | free | 90 | 10 |


### 12. TV / Video Wall

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `TV_42` | tv | evet | evet | TV_42 | evet | wall-overlay | 90 | 10 |
| `TV_55` | tv | evet | evet | TV_55 | evet | wall-overlay | 90 | 10 |
| `TV_65` | tv | evet | evet | TV_65 | evet | wall-overlay | 90 | 10 |
| `VIDEO_WALL_2X2` | tv | evet | evet | VIDEO_WALL_2X2 | evet | wall-overlay | 90 | 10 |
| `VIDEO_WALL_3X3` | tv | evet | evet | VIDEO_WALL_3X3 | evet | wall-overlay | 90 | 10 |


### 13. LED Projektör

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `led_floodlight` | led-floodlight | evet | evet | led_floodlight | evet | top | 90 | 20 |


### 14. Işıklı Strafor

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `illuminated-foam` | illuminated-foam | hayır | evet | illuminated-foam | evet | wall-overlay | 90 | 10 |


### 15. Zemin

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `karolaj` | floor | hayır | hayır |  | hayır | wall | 90 | 50 |
| `hali` | floor | hayır | hayır |  | hayır | wall | 90 | 50 |
| `parke-acik` | floor | hayır | hayır |  | hayır | wall | 90 | 50 |
| `parke-sari` | floor | hayır | hayır |  | hayır | wall | 90 | 50 |
| `parke-beton` | floor | hayır | hayır |  | hayır | wall | 90 | 50 |


### 16. Wall / Short-Up paneller

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `wall_50` | flat-panel | evet | evet | wall_50 | evet | wall | 90 | 50 |
| `wall_100` | flat-panel | evet | evet | wall_100 | evet | wall | 90 | 50 |
| `wall_150` | flat-panel | evet | evet | wall_150 | evet | wall | 90 | 50 |
| `wall_200` | flat-panel | evet | evet | wall_200 | evet | wall | 90 | 50 |
| `wall_50_short_up_1` | flat-panel | evet | evet | wall_50_short_up_1 | evet | wall | 90 | 50 |
| `wall_100_short_up_1` | flat-panel | evet | evet | wall_100_short_up_1 | evet | wall | 90 | 50 |
| `wall_150_short_up_1` | flat-panel | evet | evet | wall_150_short_up_1 | evet | wall | 90 | 50 |
| `wall_200_short_up_1` | flat-panel | evet | evet | wall_200_short_up_1 | evet | wall | 90 | 50 |
| `wall_50_short_up_2` | flat-panel | evet | evet | wall_50_short_up_2 | evet | wall | 90 | 50 |
| `wall_100_short_up_2` | flat-panel | evet | evet | wall_100_short_up_2 | evet | wall | 90 | 50 |
| `wall_150_short_up_2` | flat-panel | evet | evet | wall_150_short_up_2 | evet | wall | 90 | 50 |
| `wall_200_short_up_2` | flat-panel | evet | evet | wall_200_short_up_2 | evet | wall | 90 | 50 |


### 17. Bazalı Wall

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `wall_base_100` | base-wall | evet | evet | wall_base_100 | evet | wall | 90 | 50 |
| `wall_base_150` | base-wall | evet | evet | wall_base_150 | evet | wall | 90 | 50 |
| `wall_base_200` | base-wall | evet | evet | wall_base_200 | evet | wall | 90 | 50 |


### 18. Raflı Wall

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `wall_shelf_2_100` | shelf | evet | evet | wall_shelf_2_100 | evet | wall | 90 | 50 |
| `wall_shelf_2_150` | shelf | evet | evet | wall_shelf_2_150 | evet | wall | 90 | 50 |
| `wall_shelf_2_200` | shelf | evet | evet | wall_shelf_2_200 | evet | wall | 90 | 50 |
| `wall_shelf_3_100` | shelf | evet | evet | wall_shelf_3_100 | evet | wall | 90 | 50 |
| `wall_shelf_3_150` | shelf | evet | evet | wall_shelf_3_150 | evet | wall | 90 | 50 |
| `wall_shelf_3_200` | shelf | evet | evet | wall_shelf_3_200 | evet | wall | 90 | 50 |


### 19. Vitrin

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `wall_showcase_100_2` | showcase-2 | evet | evet | wall_showcase_100_2 | evet | wall | 90 | 50 |
| `wall_showcase_100_3` | showcase-3 | evet | evet | wall_showcase_100_3 | evet | wall | 90 | 50 |


### 20. Kapı

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `door_100` | door | evet | evet | door_100 | evet | wall | 90 | 50 |


### 21. Separatör parent

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `wall_separator_50` | separator | evet | evet | wall_separator_50 | evet | wall | 90 | 50 |
| `wall_separator_100` | separator | evet | evet | wall_separator_100 | evet | wall | 90 | 50 |
| `wall_separator_50_sarmasik` | separator | evet | evet | wall_separator_50_sarmasik | evet | wall | 90 | 50 |
| `wall_separator_100_sarmasik` | separator | evet | evet | wall_separator_100_sarmasik | evet | wall | 90 | 50 |


### 22. Baza

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `BASE_100` | base | evet | evet | BASE_100 | evet | free | 90 | 50 |
| `BASE_150` | base | evet | evet | BASE_150 | evet | free | 90 | 50 |
| `BASE_200` | base | evet | evet | BASE_200 | evet | free | 90 | 50 |


### 23. Düz Banko

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `desk_banko_100` | counter | evet | evet | desk_banko_100 | evet | free | 45 | 50 |
| `desk_banko_150` | counter | evet | evet | desk_banko_150 | evet | free | 45 | 50 |
| `desk_banko_200` | counter | evet | evet | desk_banko_200 | evet | free | 45 | 50 |


### 24. L Banko

| itemKey | type | katalog | factory | factory itemKey | explicit | placement | step° | snap cm |
|---|---|---|---|---|---|---|---:|---:|
| `desk_banko_100_L` | counter | evet | evet | desk_banko_100_L | evet | free | 90 | 50 |
| `desk_banko_150_L` | counter | evet | evet | desk_banko_150_L | evet | free | 90 | 50 |
| `desk_banko_200_L` | counter | evet | evet | desk_banko_200_L | evet | free | 90 | 50 |


## Hardcode (type adı → config)

| yer | ne | hedef |
|---|---|---|
| `src/moduleBehavior.js TYPE_BEHAVIORS` | Davranış type adına bağlı; DEFAULT_BEHAVIOR = WALL_BEHAVIOR | Item config place/move/rotate/collide |
| `src/moduleBehavior.js STRAIGHT_COUNTER_WIDTHS_CM` | Düz banko 100/150/200 → rotationStepDeg 45; 50 ve L kalır 90; L defaultRotation 270 | rotate.stepDeg / defaultDeg Item+instance config |
| `src/moduleContextMenu.js` | isShelf = moduleType === 'shelf'; isFoam = illuminated-foam | shelfLight.enabled / resize.enabled |
| `src/scene3d.js supportsGlass` | selectionMode === 'panel'; capability.glass hep false | glass.enabled + surface role config |
| `src/itemCapabilities.js` | Yalnız door-leaf color+image true | color/image enabled Item config |
| `src/designState.js createUprightModuleState` | getItem('upright_346_5') sabit | instantiate(itemKey) |
| `src/designState.js tam boy şerit` | `STAND_DIMENSIONS.stripCount` (DB zarf) | stand config tek kaynak |
| `src/designState.js separatorDefaultColor` | width 50 → separator_panel_48_5 else 98 | child Item defaultColor |
| `src/designState.js led surface.color` | #17191c | item defaultColor / surface config |
| `src/designState.js foam Math.max` | min widthCm 10, heightCm 5 | resize.min Item config (yalnız bu Item) |
| `DEFAULT_GHOST_BEHAVIOR` | opacity 0.38 tüm type | ghost.opacity config veya tek default |
| `src/scene3d.js createRenderableModule` | uzun type === switch | render.kind config |
| `src/moduleRecipes.js getModuleRecipe` | moduleType === 'shelf' / 'wall' / counter L | composition data lookup by itemKey |
| `src/moduleDragSidebar.js` | önizleme type === dalları | catalog preview kind config |
| `src/selectionFeedback.js` | modül bilgi metni type === dalları | identity + dimensions okuma |


## Migrasyon

### Aşama 0 — Analiz dondur (bu tur)

src/ yok. 188 sınıflı. Atomik method listesi kilit. Regression listesi aşağıda; yeni test yazılmadı.

**Regression:** mevcut CI yeşil taban: npm test, e2e/f011-module-behavior, e2e/f010-module-construction

### Aşama 1 — UI yeteneği config oku (davranış değişmez)

Item (veya itemKey tablosu) color/image/glass/fabric/shelfLight/resize/halo enabled bayrakları. Context menu type=== kalkar; aynı görünür sonuç. supportsGlass panel kuralı config’e taşınır, uydurma yetki eklenmez.

**Regression:** test/moduleContextAllowSideInsert.test.js, test/coverModeExclusivity.test.js, test/lightboxFabric.test.js, test/lightboxFabricLighting.test.js, e2e/f011-module-behavior.spec.mjs

### Aşama 2 — place/move/rotate/sideInsert/delete/duplicate Item config

getModuleBehavior(type) yerine getItemMechanisms(itemKey). DEFAULT_BEHAVIOR leaf’e wall bulaştırmaz: catalog dışı / factory’siz Item place.mode=none. Düz banko 45 ve L 270 Item data (desk_banko_100 vs _L).

**Regression:** tests/moduleBehavior.test.js, test/moduleBehaviorPolicy.test.js, test/moduleRotationPolicy.test.js, test/lCounterDefaultOrientation.test.js, test/moduleMove.test.js, e2e/desk-banko-items-contract.spec.mjs

### Aşama 3 — instantiate itemKey ile

MODULE_STATE_FACTORIES type anahtarı kalkar. createUpright hardcoded upright_346_5 biter. upright_99 sahneye ancak kendi Item’ı placeable ise çıkar (şimdi değil).

**Regression:** test/moduleStateConstructionRegistry.test.js, test/upright99And495ItemContract.test.js, test/upright3465ItemContract.test.js, test/uprightFieldPlacement.test.js

### Aşama 4 — composition = child Item listesi

recipeId/moduleType lookup itemKey children olur. connector_double hâlâ Item; parent children’da yoksa üretilmez. Miktar uydurulmaz.

**Regression:** test/moduleRecipes.test.js, test/connectorBom.test.js, test/counterRecipes.test.js, test/baseRecipes.test.js, test/separatorRecipes.test.js, test/wallShelfItemsContract.test.js

### Aşama 5 — render.kind config

createRenderableModule type switch → kind. plastic-trash-bin ile indoor-plant paylaşımı kind=model aynı loader, ayrı itemKey.

**Regression:** test/plasticTrashBinTopLabel.test.js, test/indoorPlants.test.js, test/tv42Module.test.js, test/ledFloodlightModule.test.js, test/baseRenderStyle.test.js

### Aşama 6 — persist + select dokunulmaz / en son

Schemaless saveProject olduğu gibi kalır ta ki instance state şekli sadeleşsin. select editor mekanizması Item config değil.

**Regression:** e2e/f020-save-before-project-actions.spec.mjs, test/autosaveController.test.js, test/moduleSelectionState.test.js, e2e/floor-items-contract.spec.mjs

## Bilinçli dışarıda bırakılanlar

- 21 HTML ailesi ve 24 MD grubu hedef sayı değildir.

- `recipe` kanonik sınıf olarak önerilmez; composition child Item listesidir.

- Kanıtsız yeni miktar/unit yok. Foam min 10×5 yalnız mevcut koddaki `Math.max` değeridir.
