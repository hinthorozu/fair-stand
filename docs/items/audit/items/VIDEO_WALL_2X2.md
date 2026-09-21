# VIDEO_WALL_2X2

- **name:** Video Wall 2×2
- **type:** `tv`
- **registry map:** `WALL_MEDIA_ITEMS`
- **kanonik bakış:** `src/items.js` `WALL_MEDIA_ITEMS['VIDEO_WALL_2X2']` + `getItem('VIDEO_WALL_2X2')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `dimensions.depthCm` | 5 | item kaydı |
| `itemKey` | VIDEO_WALL_2X2 | item kaydı |
| `name` | Video Wall 2×2 | item kaydı |
| `sizeInch` | 55 | item kaydı |
| `type` | tv | item kaydı |
| `videoWall.cols` | 2 | item kaydı |
| `videoWall.panelScreenHeightCm` | 61 | item kaydı |
| `videoWall.panelScreenWidthCm` | 108.5 | item kaydı |
| `videoWall.rows` | 2 | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Elektronik & Aydınlatma`

| catalog alan | değer |
|---|---|
| `depthCm` | 5 |
| `heightCm` | 122 |
| `itemKey` | VIDEO_WALL_2X2 |
| `label` | Video Wall 2×2 |
| `panelScreenHeightCm` | 61 |
| `panelScreenWidthCm` | 108.5 |
| `screenHeightCm` | 122 |
| `screenWidthCm` | 217 |
| `sizeInch` | 55 |
| `type` | tv |
| `videoWallCols` | 2 |
| `videoWallRows` | 2 |
| `widthCm` | 217 |

## 3. Modül sözleşmesi

- profil: `wall-media`
- appearance.color: `fixed`
- appearance.image: `renderer-managed`
- renderer.mode: `specialized-media`
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
| `allowSideInsert` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `boundarySnap` | stand-edge | TYPE_BEHAVIORS[type] + item descriptor override |
| `collision` | none | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionDepth` | physical | TYPE_BEHAVIORS[type] + item descriptor override |
| `collisionHeight` | full | TYPE_BEHAVIORS[type] + item descriptor override |
| `connectionEndpoint` | segment | TYPE_BEHAVIORS[type] + item descriptor override |
| `defaultRotationDeg` | 0 | Item kolon (`docs/refactor/ROTATION.md`) |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | none | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 10 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | [] | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | wall-overlay | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | Item kolon (`docs/refactor/ROTATION.md`) |
| `sideInsertRotation` | inherit | Item kolon (`docs/refactor/ROTATION.md`) |
| `supportsWallOverlayMount` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
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

- factory fonksiyon: `createTvModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "VIDEO_WALL_2X2",
  "type": "tv",
  "widthCm": 217,
  "depthCm": 5,
  "heightCm": 122,
  "sizeInch": 55,
  "screenWidthCm": 217,
  "screenHeightCm": 122,
  "videoWallRows": 2,
  "videoWallCols": 2,
  "panelScreenWidthCm": 108.5,
  "panelScreenHeightCm": 61
}
```

## 7. BOM / recipe / küme

- resolveItemBom hata: `Missing canonical unit for leaf Item: VIDEO_WALL_2X2.`
- resolveWallMediaMetrics: `{"widthCm":217,"screenWidthCm":217,"screenHeightCm":122,"catalogHeightCm":122,"videoWallRows":2,"videoWallCols":2}`

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: `scene3d.js createTvModule`
- sidebar kartı: var
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | hayır | resolveModuleContract().appearance.color=fixed (wall-media) |
| `image` | hayır (kullanıcı atamaz) | appearance.image=renderer-managed; TV ekran dokusu createTvScreenTexture |
| `glass` | hayır | scene3d.js getModuleContext: supportsGlass yalnız selectionMode==='panel' |
| `fabric_lightbox` | hayır | supportsFabric === supportsGlass |
| `fabric_mesh` | hayır | supportsFabric === supportsGlass |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | hayır | moduleContextMenu.js: moduleType === 'illuminated-foam' |
| `floor_select` | hayır | main.js #floor-type yalnız FLOOR_ITEMS |
| `placement_move` | evet | getModuleBehavior().placement=wall-overlay; modulePlacement.js |
| `rotation` | evet | getModuleBehavior().rotationStepDeg=90 |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor (`src/catalog.js`) Item alanlarından türetilir; ayrı iş kuralı taşımaz.
3. Sözleşme profili `wall-media` type ailesi görünüm/BOM politikası verir; item assignment BOM mode'u ezer.
4. Davranış: TYPE_BEHAVIORS[`tv`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/VIDEO_WALL_2X2.md`
- src dosyaları (3): `src/moduleContracts.js`, `src/catalog.js`, `src/items.js`
- unit/integration (1): `test/wallMediaItemsContract.test.js`
- e2e (1): `e2e/wall-media-items-contract.spec.mjs`
- docs (4): 4 dosya
- ui/other: `SYSTEM_AUDIT_CHECKLIST.md`, `SYSTEM_MODULE_CATALOG.md`, `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md`, `scripts/archive/add-video-wall-2x2.py`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

