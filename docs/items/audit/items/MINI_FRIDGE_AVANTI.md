# MINI_FRIDGE_AVANTI

- **name:** Mini Buzdolabı
- **type:** `mini-fridge`
- **registry map:** `COMMERCIAL_ITEMS`
- **kanonik bakış:** `src/items.js` `COMMERCIAL_ITEMS['MINI_FRIDGE_AVANTI']` + `getItem('MINI_FRIDGE_AVANTI')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `dimensions.depthCm` | 50 | item kaydı |
| `dimensions.heightCm` | 66 | item kaydı |
| `dimensions.widthCm` | 50 | item kaydı |
| `itemKey` | MINI_FRIDGE_AVANTI | item kaydı |
| `modelFile` | 80s_avanti_mini_fridge.glb | item kaydı |
| `name` | Mini Buzdolabı | item kaydı |
| `type` | mini-fridge | item kaydı |
| `unit` | adet | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **var** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **var**
- grup: `Extra`

| catalog alan | değer |
|---|---|
| `depthCm` | 50 |
| `heightCm` | 66 |
| `itemKey` | MINI_FRIDGE_AVANTI |
| `label` | Mini Buzdolabı |
| `modelFile` | 80s_avanti_mini_fridge.glb |
| `type` | mini-fridge |
| `unit` | adet |
| `widthCm` | 50 |

## 3. Modül sözleşmesi

- profil: `free-model-fixed`
- appearance.color: `fixed`
- appearance.image: `none`
- renderer.mode: `model`
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
| `overlapWithTypes` | kettle | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | free | TYPE_BEHAVIORS[type] + item descriptor override |
| `rotationStepDeg` | 90 | TYPE_BEHAVIORS[type] + item descriptor override |
| `sideInsertRotation` | inherit | TYPE_BEHAVIORS[type] + item descriptor override |
| `supportsWallOverlayMount` | hayır | TYPE_BEHAVIORS[type] + item descriptor override |
| `wallCapacity` | include | TYPE_BEHAVIORS[type] + item descriptor override |
| collisionHeightRange | `{"minCm":0,"maxCm":66}` | `getModuleCollisionHeightRangeCm` |
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

- factory fonksiyon: `createMiniFridgeModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "MINI_FRIDGE_AVANTI",
  "type": "mini-fridge",
  "widthCm": 50,
  "depthCm": 50,
  "heightCm": 66
}
```

## 7. BOM / recipe / küme

| child itemKey | quantity | unit |
|---|---:|---|
| `MINI_FRIDGE_AVANTI` | 1 | `adet` |

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: `scene3d.js createMiniFridgeModule`
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
4. Davranış: TYPE_BEHAVIORS[`mini-fridge`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/MINI_FRIDGE_AVANTI.md`
- src dosyaları (6): `src/moduleContracts.js`, `src/catalog.js`, `src/items.js`, `src/featureContracts.js`, `src/scene3d.js`, `src/autoDepot.js`
- unit/integration (1): `test/miniFridge.test.js`
- e2e (5): `e2e/f011-module-behavior.spec.mjs`, `e2e/invalid-placement-ghost.spec.mjs`, `e2e/mini-fridge-dimensions.spec.mjs`, `e2e/commercial-items-contract.spec.mjs`, `e2e/free-props-collision-none.spec.mjs`
- docs (4): 4 dosya
- ui/other: `SYSTEM_AUDIT_CHECKLIST.md`, `SYSTEM_MODULE_CATALOG.md`, `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md`, `audit/remediation/A11_F029_CLOSURE.md`, `audit/SISTEM_MUTABAKAT_RAPORU.md`

### featureContracts
- `automatic-depot` (`src/autoDepot.js`) eşleşme: contentCatalogKeys

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

