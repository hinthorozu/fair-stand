# EXTRA_INDOOR_PLANT_1

- **name:** Yapay Çiçek 1
- **type:** `indoor-plant-1`
- **registry map:** `INDOOR_PLANT_ITEMS`
- **kanonik bakış:** `src/items.js` `INDOOR_PLANT_ITEMS['EXTRA_INDOOR_PLANT_1']` + `getItem('EXTRA_INDOOR_PLANT_1')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `dimensions.depthCm` | 60 | item kaydı |
| `dimensions.heightCm` | 120 | item kaydı |
| `dimensions.widthCm` | 60 | item kaydı |
| `itemKey` | EXTRA_INDOOR_PLANT_1 | item kaydı |
| `modelRotationYDeg` | 0 | item kaydı |
| `name` | Yapay Çiçek 1 | item kaydı |
| `preserveModelScale` | hayır | item kaydı |
| `type` | indoor-plant-1 | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Extra`

| catalog alan | değer |
|---|---|
| `depthCm` | 60 |
| `heightCm` | 120 |
| `itemKey` | EXTRA_INDOOR_PLANT_1 |
| `label` | Yapay Çiçek 1 |
| `modelRotationYDeg` | 0 |
| `preserveModelScale` | hayır |
| `type` | indoor-plant-1 |
| `widthCm` | 60 |

## 3. Modül sözleşmesi

- profil: `free-model-fixed`
- appearance.color: `fixed`
- appearance.image: `none`
- renderer.mode: `model`
- runtime.mode: `static`
- composition.mode (profil): `standalone`
- BOM mode: `decision-required`
- BOM source: `null`
- BOM reason: Existing module has no canonical BOM policy yet; decide recipe, commercial-item, or explicit exclusion before Final BOM integration.
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
| `connectionEndpoint` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `defaultRotationDeg` | 0 | TYPE_BEHAVIORS[type] + item descriptor override |
| `endpointContact` | thin-wall-endpoint | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 10 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | [] | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | free | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | TYPE_BEHAVIORS[type] + item descriptor override |
| `sideInsertRotation` | inherit | TYPE_BEHAVIORS[type] + item descriptor override |
| `supportsWallOverlayMount` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | include | TYPE_BEHAVIORS[type] + item descriptor override |
| collisionHeightRange | `{"minCm":0,"maxCm":120}` | `getModuleCollisionHeightRangeCm` |
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

- factory fonksiyon: `createIndoorPlantModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "EXTRA_INDOOR_PLANT_1",
  "type": "indoor-plant-1",
  "widthCm": 60,
  "depthCm": 60,
  "heightCm": 120,
  "modelFile": "indoor_plants.glb",
  "modelRotationYDeg": 0,
  "preserveModelScale": false
}
```

## 7. BOM / recipe / küme

- resolveItemBom hata: `Missing canonical unit for leaf Item: EXTRA_INDOOR_PLANT_1.`

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: `scene3d.js createIndoorPlantModule`
- sidebar kartı: var
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | hayır | resolveModuleContract().appearance.color=fixed (free-model-fixed) |
| `image` | hayır | kanonik kayıt alanı; runtime image yok veya appearance.image=none |
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
3. Sözleşme profili `free-model-fixed` type ailesi görünüm/BOM politikası verir; item assignment BOM mode'u ezer.
4. Davranış: TYPE_BEHAVIORS[`indoor-plant-1`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/EXTRA_INDOOR_PLANT_1.md`
- src dosyaları (4): `src/moduleContracts.js`, `src/catalog.js`, `src/items.js`, `src/designState.js`
- unit/integration (2): `test/indoorPlants.test.js`, `test/indoorPlantItemsContract.test.js`
- e2e (1): `e2e/indoor-plant-items-contract.spec.mjs`
- docs (4): 4 dosya
- ui/other: `SYSTEM_AUDIT_CHECKLIST.md`, `SYSTEM_MODULE_CATALOG.md`, `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

