# BASE_150

- **name:** Baza 150
- **type:** `base`
- **registry map:** `COMPOSITE_ITEMS`
- **kanonik bakış:** `src/items.js` `COMPOSITE_ITEMS['BASE_150']` + `getItem('BASE_150')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `composition.mode` | recipe | item kaydı |
| `composition.moduleType` | base | item kaydı |
| `composition.nominalWidthCm` | 150 | item kaydı |
| `dimensions.depthCm` | 50 | item kaydı |
| `dimensions.heightCm` | 50 | item kaydı |
| `dimensions.widthCm` | 150 | item kaydı |
| `itemKey` | BASE_150 | item kaydı |
| `name` | Baza 150 | item kaydı |
| `type` | base | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Banko & Baza`

| catalog alan | değer |
|---|---|
| `depthCm` | 50 |
| `heightCm` | 50 |
| `itemKey` | BASE_150 |
| `label` | Baza 150 |
| `type` | base |
| `widthCm` | 150 |

## 3. Modül sözleşmesi

- profil: `free-editable`
- appearance.color: `editable`
- appearance.image: `editable`
- renderer.mode: `procedural`
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
| `collision` | footprint | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionDepth` | physical | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionHeight` | full | TYPE_BEHAVIORS[type] + item descriptor override |
| `connectionEndpoint` | logical-fixture | TYPE_BEHAVIORS[type] + item descriptor override |
| `defaultRotationDeg` | 0 | TYPE_BEHAVIORS[type] + item descriptor override |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 50 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | [] | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | free | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | TYPE_BEHAVIORS[type] + item descriptor override |
| `sideInsertRotation` | inherit | TYPE_BEHAVIORS[type] + item descriptor override |
| `supportsWallOverlayMount` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | include | TYPE_BEHAVIORS[type] + item descriptor override |
| collisionHeightRange | `{"minCm":0,"maxCm":50}` | `getModuleCollisionHeightRangeCm` |
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

- factory fonksiyon: `createBaseModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "BASE_150",
  "type": "base",
  "widthCm": 150,
  "depthCm": 50,
  "heightCm": 50,
  "faces": {
    "front": {
      "id": "<id>",
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
    },
    "left": {
      "id": "<id>",
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
    },
    "right": {
      "id": "<id>",
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
}
```

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `profile_140_5` | 4 | `adet` |
| `profile_41_5` | 4 | `adet` |
| `upright_49_5` | 4 | `adet` |
| `panel_147_5` | 2 | `adet` |
| `panel_48_5` | 2 | `adet` |
| `connector_start` | 8 | `adet` |
| `connector_single` | 8 | `adet` |
| `base_top_157_50` | 1 | `adet` |
- recipeId: `base-150`

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: `scene3d.js createBaseModule`
- sidebar kartı: var
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | evet | resolveModuleContract().appearance.color=editable (free-editable) |
| `image` | evet | resolveModuleContract().appearance.image=editable |
| `glass` | hayır | scene3d.js ~1801: supportsGlass = selectionMode === 'panel'. Banko/baza yüzeyleri selectionMode module. |
| `fabric_lightbox` | hayır | scene3d.js ~1801: supportsGlass = selectionMode === 'panel'. Banko/baza yüzeyleri selectionMode module. |
| `fabric_mesh` | hayır | scene3d.js ~1801: supportsGlass = selectionMode === 'panel'. Banko/baza yüzeyleri selectionMode module. |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | hayır | moduleContextMenu.js: moduleType === 'illuminated-foam' |
| `floor_select` | hayır | main.js #floor-type yalnız FLOOR_ITEMS |
| `placement_move` | evet | getModuleBehavior().placement=free; modulePlacement.js |
| `rotation` | evet | getModuleBehavior().rotationStepDeg=90 |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor (`src/catalog.js`) Item alanlarından türetilir; ayrı iş kuralı taşımaz.
3. Sözleşme profili `free-editable` type ailesi görünüm/BOM politikası verir; item assignment BOM mode'u ezer.
4. Davranış: TYPE_BEHAVIORS[`base`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/BASE_150.md`
- src dosyaları (4): `src/moduleContracts.js`, `src/catalog.js`, `src/items.js`, `src/designState.js`
- unit/integration (2): `test/baseModule.test.js`, `test/baseItemsContract.test.js`
- e2e (1): `e2e/base-items-contract.spec.mjs`
- docs (5): 5 dosya
- ui/other: `fair-stand-base-family-migration-handoff.md`, `SYSTEM_AUDIT_CHECKLIST.md`, `SYSTEM_MODULE_CATALOG.md`, `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

