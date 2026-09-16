# door_100

- **name:** Depo Kapısı 100
- **type:** `door`
- **registry map:** `COMPOSITE_ITEMS`
- **kanonik bakış:** `src/items.js` `COMPOSITE_ITEMS['door_100']` + `getItem('door_100')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `composition.mode` | recipe | item kaydı |
| `composition.moduleType` | door | item kaydı |
| `composition.nominalWidthCm` | 100 | item kaydı |
| `dimensions.widthCm` | 100 | item kaydı |
| `itemKey` | door_100 | item kaydı |
| `name` | Depo Kapısı 100 | item kaydı |
| `type` | door | item kaydı |
| `unit` | adet | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Panel & Duvar`

| catalog alan | değer |
|---|---|
| `itemKey` | door_100 |
| `label` | Depo Kapısı 100 |
| `type` | door |
| `widthCm` | 100 |

## 3. Modül sözleşmesi

- profil: `wall-editable`
- appearance.color: `editable`
- appearance.image: `editable`
- renderer.mode: `procedural-or-specialized`
- runtime.mode: `static`
- composition.mode (profil): `standalone`
- BOM mode: `recipe`
- BOM source: src/moduleRecipes.js
- state.owner: `src/designState.js`
- persistence: `project-state`

## 4. Runtime davranış (`getModuleBehavior`)

- TYPE_BEHAVIORS kaydı: **var**

| alan | değer | kaynak |
|---|---|---|
| `allowSideInsert` | evet | TYPE_BEHAVIORS[type] + item descriptor override |
| `boundarySnap` | stand-edge | TYPE_BEHAVIORS[type] + item descriptor override |
| `collision` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionDepth` | physical | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionHeight` | full | TYPE_BEHAVIORS[type] + item descriptor override |
| `connectionEndpoint` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `defaultRotationDeg` | 0 | TYPE_BEHAVIORS[type] + item descriptor override |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 50 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | [] | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | wall | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | TYPE_BEHAVIORS[type] + item descriptor override |
| `sideInsertRotation` | inherit | TYPE_BEHAVIORS[type] + item descriptor override |
| `supportsWallOverlayMount` | evet | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | include | TYPE_BEHAVIORS[type] + item descriptor override |
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

- factory fonksiyon: `createDoorModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "door_100",
  "type": "door",
  "widthCm": 100,
  "strips": [
    {
      "id": "<id>",
      "stripIndex": 4,
      "color": "#ffffff",
      "imageAssetId": null,
      "imageTransform": {
        "mode": "single",
        "offsetX": 0,
        "offsetY": 0,
        "repeatX": 1,
        "repeatY": 1,
        "rotation": 0
      }
    },
    {
      "id": "<id>",
      "stripIndex": 5,
      "color": "#ffffff",
      "imageAssetId": null,
      "imageTransform": {
        "mode": "single",
        "offsetX": 0,
        "offsetY": 0,
        "repeatX": 1,
        "repeatY": 1,
        "rotation": 0
      }
    },
    {
      "id": "<id>",
      "stripIndex": 6,
      "color": "#ffffff",
      "imageAssetId": null,
      "imageTransform": {
        "mode": "single",
        "offsetX": 0,
        "offsetY": 0,
        "repeatX": 1,
        "repeatY": 1,
        "rotation": 0
      }
    }
  ],
  "surface": {
    "id": "<id>",
    "itemKey": "door_leaf_100",
    "stripIndex": null,
    "color": "#ffffff",
    "imageAssetId": null,
    "imageTransform": {
      "mode": "single",
      "offsetX": 0,
      "offsetY": 0,
      "repeatX": 1,
      "repeatY": 1,
      "rotation": 0
    }
  }
}
```

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `profile_91` | 1 | `adet` |
| `upright_346_5` | 2 | `adet` |
| `panel_98` | 3 | `adet` |
| `connector_start` | 2 | `adet` |
| `connector_single` | 5 | `adet` |
| `door_leaf_100` | 1 | `adet` |
- recipeId: `door-100`
- innerCornerPanelItemKey: `panel_corner_92`

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: `scene3d.js createDoorModule`
- sidebar kartı: var
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | evet (kanat + üst paneller) | getItemSurfaceCapabilities(door-leaf) color/image; kapı strips panel |
| `image` | evet (kanat + üst paneller) | itemCapabilities.js door-leaf image:true |
| `glass` | evet (yalnız panel selectionMode) | scene3d.js ~1801: supportsGlass = selectionMode === 'panel'. Banko/baza yüzeyleri selectionMode module. |
| `fabric_lightbox` | evet (yalnız panel selectionMode) | scene3d.js ~1801: supportsGlass = selectionMode === 'panel'. Banko/baza yüzeyleri selectionMode module. |
| `fabric_mesh` | evet (yalnız panel selectionMode) | scene3d.js ~1801: supportsGlass = selectionMode === 'panel'. Banko/baza yüzeyleri selectionMode module. |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | hayır | moduleContextMenu.js: moduleType === 'illuminated-foam' |
| `floor_select` | hayır | main.js #floor-type yalnız FLOOR_ITEMS |
| `placement_move` | evet | getModuleBehavior().placement=wall; modulePlacement.js |
| `rotation` | evet | getModuleBehavior().rotationStepDeg=90 |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor (`src/catalog.js`) Item alanlarından türetilir; ayrı iş kuralı taşımaz.
3. Sözleşme profili `wall-editable` type ailesi görünüm/BOM politikası verir; item assignment BOM mode'u ezer.
4. Davranış: TYPE_BEHAVIORS[`door`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/door_100.md`
- src dosyaları (5): `src/moduleContracts.js`, `src/designState.js`, `src/rawBomDebug.js`, `src/catalog.js`, `src/items.js`
- unit/integration (5): `test/doorCompositeItemContract.test.js`, `test/doorLeafItemContract.test.js`, `test/itemDocsRuntimeAlignment.test.js`, `test/moduleRecipes.test.js`, `test/moduleStateConstructionRegistry.test.js`
- e2e (1): `e2e/f010-module-construction.spec.mjs`
- docs (8): 8 dosya
- ui/other: `fair-stand-base-family-migration-handoff.md`, `SYSTEM_MODULE_CATALOG.md`, `audit/SISTEM_MUTABAKAT_RAPORU.md`

### featureContracts
- `automatic-depot` (`src/autoDepot.js`) eşleşme: creates.kinds

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

