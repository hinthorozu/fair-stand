# upright_346_5

- **name:** Dikme 346,5 cm
- **type:** `upright`
- **registry map:** `LEAF_ITEMS`
- **kanonik bakış:** `src/items.js` `LEAF_ITEMS['upright_346_5']` + `getItem('upright_346_5')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `defaultColor` | 13685716 (`#d0d3d4`) | item kaydı |
| `dimensions.lengthCm` | 346.5 | item kaydı |
| `dimensions.thicknessCm` | 8 | item kaydı |
| `itemKey` | upright_346_5 | item kaydı |
| `material` | alüminyum | item kaydı |
| `name` | Dikme 346,5 cm | item kaydı |
| `type` | upright | item kaydı |
| `unit` | adet | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Panel Ek Modül`

| catalog alan | değer |
|---|---|
| `depthCm` | 8 |
| `heightCm` | 346.5 |
| `itemKey` | upright_346_5 |
| `label` | Dikme 346,5 cm |
| `type` | upright |
| `widthCm` | 8 |

## 3. Modül sözleşmesi

- profil: `free-editable`
- appearance.color: `editable`
- appearance.image: `editable`
- renderer.mode: `procedural`
- runtime.mode: `static`
- composition.mode (profil): `standalone`
- BOM mode: `self`
- BOM source: src/itemBom.js
- state.owner: `src/designState.js`
- persistence: `project-state`

## 4. Runtime davranış (`getModuleBehavior`)

- TYPE_BEHAVIORS kaydı: **var**

| alan | değer | kaynak |
|---|---|---|
| `allowSideInsert` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `boundarySnap` | stand-edge | TYPE_BEHAVIORS[type] + item descriptor override |
| `collision` | footprint | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionDepth` | physical | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionHeight` | full | TYPE_BEHAVIORS[type] + item descriptor override |
| `connectionEndpoint` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `defaultRotationDeg` | 0 | Item kolon (`docs/refactor/ROTATION.md`) |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | short-up-joint | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 50 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | flat-panel, profile, counter | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | free | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | Item kolon (`docs/refactor/ROTATION.md`) |
| `sideInsertRotation` | inherit | Item kolon (`docs/refactor/ROTATION.md`) |
| `supportsWallOverlayMount` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | exclude | TYPE_BEHAVIORS[type] + item descriptor override |
| collisionHeightRange | `{"minCm":0,"maxCm":350}` | `getModuleCollisionHeightRangeCm` |
| stripOccupancy resolved | `null` | `resolveModuleStripOccupancy` |

## 5. Yüzey yetenekleri (`getItemSurfaceCapabilities`)

| bayrak | değer |
|---|---|
| `color` | false |
| `image` | false |
| `glass` | false |
| `lightbox` | false |
| `mesh` | false |

- Type `door-leaf` dışında tablo `NO_SURFACE_CAPABILITIES` (hepsi false). Parent duvar renk/görsel yetkisi `itemCapabilities` değil, `moduleContracts.appearance` + `scene3d` `selectionMode`/`accepts*` üzerinden gider.

## 6. Factory / runtime state

- factory fonksiyon: `createUprightModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "upright_346_5",
  "type": "upright",
  "widthCm": 8,
  "depthCm": 8,
  "heightCm": 346.5
}
```

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `upright_346_5` | 1 | `adet` |

## 8. Bu item'ı kullanan parent'lar

### recipe child
- `{"parentKey":"door_100","quantity":2,"recipeId":"door-100","variant":"straight"}`
- `{"parentKey":"wall_50","quantity":2,"recipeId":"wall-straight-50","variant":"straight"}`
- `{"parentKey":"wall_100","quantity":2,"recipeId":"wall-straight-100","variant":"straight"}`
- `{"parentKey":"wall_150","quantity":2,"recipeId":"wall-straight-150","variant":"straight"}`
- `{"parentKey":"wall_200","quantity":2,"recipeId":"wall-straight-200","variant":"straight"}`
- `{"parentKey":"wall_base_100","quantity":2,"recipeId":"base-wall-100","variant":"straight"}`
- `{"parentKey":"wall_base_150","quantity":2,"recipeId":"base-wall-150","variant":"straight"}`
- `{"parentKey":"wall_base_200","quantity":2,"recipeId":"base-wall-200","variant":"straight"}`
- `{"parentKey":"wall_separator_50","quantity":2,"recipeId":"separator-50","variant":"straight"}`
- `{"parentKey":"wall_separator_100","quantity":2,"recipeId":"separator-100","variant":"straight"}`
- `{"parentKey":"wall_separator_50_sarmasik","quantity":2,"recipeId":"separator-50","variant":"straight"}`
- `{"parentKey":"wall_separator_100_sarmasik","quantity":2,"recipeId":"separator-100","variant":"straight"}`
- `{"parentKey":"wall_shelf_2_100","quantity":2,"recipeId":"shelf-wall-100-2","variant":"straight"}`
- `{"parentKey":"wall_shelf_2_150","quantity":2,"recipeId":"shelf-wall-150-2","variant":"straight"}`
- `{"parentKey":"wall_shelf_2_200","quantity":2,"recipeId":"shelf-wall-200-2","variant":"straight"}`
- `{"parentKey":"wall_shelf_3_100","quantity":2,"recipeId":"shelf-wall-100-3","variant":"straight"}`
- `{"parentKey":"wall_shelf_3_150","quantity":2,"recipeId":"shelf-wall-150-3","variant":"straight"}`
- `{"parentKey":"wall_shelf_3_200","quantity":2,"recipeId":"shelf-wall-200-3","variant":"straight"}`
- `{"parentKey":"wall_showcase_100_2","quantity":2,"recipeId":"showcase-2-100","variant":"straight"}`
- `{"parentKey":"wall_showcase_100_3","quantity":2,"recipeId":"showcase-3-100","variant":"straight"}`


## 9. Renderer / UI / persistence

- renderer: `scene3d.js createUprightModule`
- sidebar kartı: var
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | evet | resolveModuleContract().appearance.color=editable (free-editable) |
| `image` | evet | resolveModuleContract().appearance.image=editable |
| `glass` | hayır | scene3d.js getModuleContext: supportsGlass yalnız selectionMode==='panel' |
| `fabric_lightbox` | hayır | supportsFabric === supportsGlass |
| `fabric_mesh` | hayır | supportsFabric === supportsGlass |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | hayır | moduleContextMenu.js: moduleType === 'illuminated-foam' |
| `floor_select` | hayır | main.js #floor-type yalnız FLOOR_ITEMS |
| `placement_move` | evet | getModuleBehavior().placement=free; modulePlacement.js |
| `rotation` | evet | getModuleBehavior().rotationStepDeg=90 |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor (`src/catalog.js`) Item alanlarından türetilir; ayrı iş kuralı taşımaz.
3. Sözleşme profili `free-editable` type ailesi görünüm/BOM politikası verir; item assignment BOM mode'u ezer.
4. Davranış: TYPE_BEHAVIORS[`upright`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/upright_346_5.md`
- src dosyaları (7): `src/moduleContracts.js`, `src/catalog.js`, `src/items.js`, `src/moduleRecipes.js`, `src/modulePlacement.js`, `src/designState.js`, `src/scene3d.js`
- unit/integration (15): `test/doorCompositeItemContract.test.js`, `test/moduleRecipes.test.js`, `test/profileFieldPlacement.test.js`, `test/wallFlatPanelItemsContract.test.js`, `test/showcaseRecipes.test.js`, `test/wallBaseItemsContract.test.js`, `test/uprightIntrinsicProperties.test.js`, `test/uprightFieldPlacement.test.js`, `test/separatorRecipes.test.js`, `test/upright3465ItemContract.test.js`, `test/baseItemsContract.test.js`, `test/wallShowcaseItemContract.test.js`, `test/baseWallRecipes.test.js`, `test/wallShelfItemsContract.test.js`, `test/wallSeparatorItemsContract.test.js`
- e2e (1): `e2e/invalid-placement-ghost.spec.mjs`
- docs (28): 28 dosya
- ui/other: `MODULE_BEHAVIOR_STANDARD.md`, `SYSTEM_MODULE_CATALOG.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

