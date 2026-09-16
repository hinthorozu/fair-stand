# furniture_sofa_single_classic

- **name:** Tekli Koltuk
- **type:** `sofa-single-classic`
- **registry map:** `FURNITURE_ITEMS`
- **kanonik bakış:** `src/items.js` `FURNITURE_ITEMS['furniture_sofa_single_classic']` + `getItem('furniture_sofa_single_classic')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `dimensions.depthCm` | 45 | item kaydı |
| `dimensions.heightCm` | 78 | item kaydı |
| `dimensions.widthCm` | 65 | item kaydı |
| `itemKey` | furniture_sofa_single_classic | item kaydı |
| `name` | Tekli Koltuk | item kaydı |
| `type` | sofa-single-classic | item kaydı |
| `visualRotationYDeg` | -135 | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Extra`

| catalog alan | değer |
|---|---|
| `depthCm` | 45 |
| `heightCm` | 78 |
| `itemKey` | furniture_sofa_single_classic |
| `label` | Tekli Koltuk |
| `type` | sofa-single-classic |
| `widthCm` | 65 |

## 3. Modül sözleşmesi

- profil: `free-model-color`
- appearance.color: `editable`
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
| `collision` | none | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionDepth` | physical | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionHeight` | full | TYPE_BEHAVIORS[type] + item descriptor override |
| `connectionEndpoint` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `defaultRotationDeg` | 0 | TYPE_BEHAVIORS[type] + item descriptor override |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | none | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 10 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | [] | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | free | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 45 | TYPE_BEHAVIORS[type] + item descriptor override |
| `sideInsertRotation` | inherit | TYPE_BEHAVIORS[type] + item descriptor override |
| `supportsWallOverlayMount` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | include | TYPE_BEHAVIORS[type] + item descriptor override |
| collisionHeightRange | `{"minCm":0,"maxCm":78}` | `getModuleCollisionHeightRangeCm` |
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

- factory fonksiyon: `createSofaSingleClassicModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "furniture_sofa_single_classic",
  "type": "sofa-single-classic",
  "widthCm": 65,
  "depthCm": 45,
  "heightCm": 78,
  "surface": {
    "id": "<id>",
    "color": "#ffffff"
  },
  "visualRotationYDeg": -135
}
```

## 7. BOM / recipe / küme

- resolveItemBom hata: `Missing canonical unit for leaf Item: furniture_sofa_single_classic.`

## 8. Bu item'ı kullanan parent'lar

### furniture cluster
- `{"parentKey":"furniture_sofa_set_classic","quantity":2,"mode":"cluster-items"}`


## 9. Renderer / UI / persistence

- renderer: `scene3d.js createSofaSingleClassicModule`
- sidebar kartı: var
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | evet | resolveModuleContract().appearance.color=editable (free-model-color) |
| `image` | hayır | kanonik kayıt alanı; runtime image yok veya appearance.image=none |
| `glass` | hayır | scene3d.js getModuleContext: supportsGlass yalnız selectionMode==='panel' |
| `fabric_lightbox` | hayır | supportsFabric === supportsGlass |
| `fabric_mesh` | hayır | supportsFabric === supportsGlass |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | hayır | moduleContextMenu.js: moduleType === 'illuminated-foam' |
| `floor_select` | hayır | main.js #floor-type yalnız FLOOR_ITEMS |
| `placement_move` | evet | getModuleBehavior().placement=free; modulePlacement.js |
| `rotation` | evet | getModuleBehavior().rotationStepDeg=45 |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor (`src/catalog.js`) Item alanlarından türetilir; ayrı iş kuralı taşımaz.
3. Sözleşme profili `free-model-color` type ailesi görünüm/BOM politikası verir; item assignment BOM mode'u ezer.
4. Davranış: TYPE_BEHAVIORS[`sofa-single-classic`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/furniture_sofa_single_classic.md`
- src dosyaları (5): `src/moduleContracts.js`, `src/selectionFeedback.js`, `src/catalog.js`, `src/items.js`, `src/scene3d.js`
- unit/integration (2): `test/sofaClassicPiecesContract.test.js`, `test/furnitureItemsContract.test.js`
- e2e (1): `e2e/furniture-items-contract.spec.mjs`
- docs (7): 7 dosya
- ui/other: `SYSTEM_MODULE_CATALOG.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

