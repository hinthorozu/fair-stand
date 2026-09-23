# wall_showcase_100_3

- **name:** 3 Gözlü Vitrin 100
- **type:** `showcase-3`
- **registry map:** `COMPOSITE_ITEMS`
- **kanonik bakış:** `src/items.js` `COMPOSITE_ITEMS['wall_showcase_100_3']` + `getItem('wall_showcase_100_3')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `bodyItems.glassShelfItemKey` | glass_shelf | item kaydı |
| `bodyItems.horizontalItemKey` | showcase_horizontal_87_4_30 | item kaydı |
| `bodyItems.sideItemKey` | showcase_side_143_5_30 | item kaydı |
| `composition.mode` | recipe | item kaydı |
| `composition.moduleType` | showcase-3 | item kaydı |
| `composition.nominalWidthCm` | 100 | item kaydı |
| `dimensions.widthCm` | 100 | item kaydı |
| `eyeCount` | 3 | item kaydı |
| `itemKey` | wall_showcase_100_3 | item kaydı |
| `name` | 3 Gözlü Vitrin 100 | item kaydı |
| `type` | showcase-3 | item kaydı |
| `unit` | adet | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.
| `sceneDimensions.depthCm` | 10 | item kaydı |
| `sceneDimensions.heightCm` | 350 | item kaydı |
## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Raf & Vitrin`

| catalog alan | değer |
|---|---|
| `eyeCount` | 3 |
| `itemKey` | wall_showcase_100_3 |
| `label` | 3 Gözlü Vitrin 100 |
| `type` | showcase-3 |
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
| `defaultRotationDeg` | 0 | Item kolon (`docs/refactor/ROTATION.md`) |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 50 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | [] | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | wall | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | Item kolon (`docs/refactor/ROTATION.md`) |
| `sideInsertRotation` | inherit | Item kolon (`docs/refactor/ROTATION.md`) |
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

- factory fonksiyon: `createShowcaseModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "wall_showcase_100_3",
  "type": "showcase-3",
  "widthCm": 100,
  "eyeCount": 3,
  "strips": [
    {
      "id": "<id>",
      "stripIndex": 0,
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
      "stripIndex": 1,
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
      "stripIndex": 2,
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
      "stripIndex": 3,
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
  "bodySurface": {
    "id": "<id>",
    "color": "#ffffff"
  }
}
```

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `profile_91` | 4 | `adet` |
| `upright_346_5` | 2 | `adet` |
| `panel_98` | 4 | `adet` |
| `connector_start` | 4 | `adet` |
| `connector_single` | 7 | `adet` |
| `showcase_side_143_5_30` | 2 | `adet` |
| `showcase_horizontal_87_4_30` | 2 | `adet` |
| `glass_shelf` | 2 | `adet` |
- recipeId: `showcase-3-100`
- innerCornerPanelItemKey: `panel_corner_92`
- getShowcaseBodyDefinition: `{"sideItemKey":"showcase_side_143_5_30","horizontalItemKey":"showcase_horizontal_87_4_30","glassShelfItemKey":"glass_shelf","defaultColor":16777215,"error":null}`

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: `scene3d.js createShowcaseModule`
- sidebar kartı: var
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | evet | resolveModuleContract().appearance.color=editable (wall-editable) |
| `image` | evet | resolveModuleContract().appearance.image=editable |
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
4. Davranış: TYPE_BEHAVIORS[`showcase-3`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/wall_showcase_100_3.md`
- src dosyaları (3): `src/moduleContracts.js`, `src/catalog.js`, `src/items.js`
- unit/integration (4): `test/showcaseRecipes.test.js`, `test/showcaseBodyColorRegression.test.js`, `test/showcaseAppearance.test.js`, `test/wallShowcaseItemContract.test.js`
- e2e (1): `e2e/wall-showcase-item-contract.spec.mjs`
- docs (8): 8 dosya
- ui/other: `SYSTEM_AUDIT_CHECKLIST.md`, `SYSTEM_MODULE_CATALOG.md`, `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

