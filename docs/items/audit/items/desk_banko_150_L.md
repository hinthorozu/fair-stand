# desk_banko_150_L

- **name:** Köşe Banko 150×150
- **type:** `counter`
- **registry map:** `COMPOSITE_ITEMS`
- **kanonik bakış:** `src/items.js` `COMPOSITE_ITEMS['desk_banko_150_L']` + `getItem('desk_banko_150_L')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `composition.mode` | recipe | item kaydı |
| `composition.moduleType` | counter | item kaydı |
| `composition.nominalWidthCm` | 150 | item kaydı |
| `composition.options.shape` | L | item kaydı |
| `dimensions.depthCm` | 150 | item kaydı |
| `dimensions.heightCm` | 100 | item kaydı |
| `dimensions.widthCm` | 150 | item kaydı |
| `itemKey` | desk_banko_150_L | item kaydı |
| `name` | Köşe Banko 150×150 | item kaydı |
| `shape` | L | item kaydı |
| `type` | counter | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Banko & Baza`

| catalog alan | değer |
|---|---|
| `depthCm` | 150 |
| `heightCm` | 100 |
| `itemKey` | desk_banko_150_L |
| `label` | Köşe Banko 150×150 |
| `shape` | L |
| `type` | counter |
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
| `defaultRotationDeg` | 270 (`#00010e`) | TYPE_BEHAVIORS[type] + item descriptor override |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 50 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | [] | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | free | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | Item kolon (`docs/refactor/ROTATION.md`) |
| `sideInsertRotation` | inherit | Item kolon (`docs/refactor/ROTATION.md`) |
| `supportsWallOverlayMount` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | include | TYPE_BEHAVIORS[type] + item descriptor override |
| collisionHeightRange | `{"minCm":0,"maxCm":100}` | `getModuleCollisionHeightRangeCm` |
| stripOccupancy resolved | `null` | `resolveModuleStripOccupancy` |

- **Item override:** `getModuleBehavior` type `counter` ve `shape==='L'` iken `defaultRotationDeg: 270` (`src/moduleBehavior.js`).

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

- factory fonksiyon: `createCounterModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "desk_banko_150_L",
  "type": "counter",
  "shape": "L",
  "widthCm": 150,
  "depthCm": 150,
  "heightCm": 100,
  "faces": {
    "frontLower": {
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
    "frontUpper": {
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
    "leftLower": {
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
    "leftUpper": {
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
    "rightLower": {
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
    "rightUpper": {
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
    "returnLower": {
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
    "returnUpper": {
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
| `profile_140_5` | 5 | `adet` |
| `profile_91` | 1 | `adet` |
| `profile_41_5` | 4 | `adet` |
| `upright_99` | 5 | `adet` |
| `panel_147_5` | 4 | `adet` |
| `panel_48_5` | 4 | `adet` |
| `connector_start` | 8 | `adet` |
| `connector_single` | 16 | `adet` |
| `counter_top_160_60` | 1 | `adet` |
| `counter_top_102_60` | 1 | `adet` |
- recipeId: `counter-l-150`

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: `scene3d.js createCounterModule / createLCounterModule (shape L)`
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
4. Davranış: TYPE_BEHAVIORS[`counter`] var + shape/width override.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/desk_banko_150_L.md`
- src dosyaları (4): `src/designState.js`, `src/moduleContracts.js`, `src/catalog.js`, `src/items.js`
- unit/integration (2): `test/deskBankoItemsContract.test.js`, `test/lCounter150Contract.test.js`
- e2e (1): `e2e/desk-banko-items-contract.spec.mjs`
- docs (3): 3 dosya
- ui/other: `SYSTEM_AUDIT_CHECKLIST.md`, `SYSTEM_MODULE_CATALOG.md`, `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

