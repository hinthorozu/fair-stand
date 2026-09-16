# karolaj

- **name:** Karolaj
- **type:** `floor`
- **registry map:** `FLOOR_ITEMS`
- **kanonik bakış:** `src/items.js` `FLOOR_ITEMS['karolaj']` + `getItem('karolaj')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `defaultColor` | #e9edf1 | item kaydı |
| `dimensions.depthCm` | 100 | item kaydı |
| `dimensions.widthCm` | 100 | item kaydı |
| `itemKey` | karolaj | item kaydı |
| `name` | Karolaj | item kaydı |
| `paintable` | evet | item kaydı |
| `type` | floor | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **yok** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **yok**
- grup: yok

## 3. Modül sözleşmesi

- **resolveModuleContract:** `null`
- **explicit assignment:** yok
- Neden: katalog dışı leaf/floor item; `resolveModuleContract` yalnız `MODULE_CATALOG` veya `NON_CATALOG_MODULE_CONTRACTS` anahtarını çözer (`src/moduleContracts.js` `resolveModuleContract`).

## 4. Runtime davranış (`getModuleBehavior`)

- TYPE_BEHAVIORS kaydı: **yok — DEFAULT_BEHAVIOR (WALL_BEHAVIOR) fallback**
- **Not:** `hasExplicitModuleBehavior` false. `getModuleBehavior` `DEFAULT_BEHAVIOR = WALL_BEHAVIOR` döner. Bu type sahneye modül olarak çıkmıyorsa davranış pratikte kullanılmaz; fallback yine de kodda vardır.

| alan | değer | kaynak |
|---|---|---|
| `allowSideInsert` | evet | DEFAULT_BEHAVIOR |
| `boundarySnap` | stand-edge | DEFAULT_BEHAVIOR |
| `collision` | segment | DEFAULT_BEHAVIOR |
| `collisionDepth` | physical | DEFAULT_BEHAVIOR |
| `collisionHeight` | full | DEFAULT_BEHAVIOR |
| `connectionEndpoint` | segment | DEFAULT_BEHAVIOR |
| `defaultRotationDeg` | 0 | DEFAULT_BEHAVIOR |
| `endpointContact` | standard | DEFAULT_BEHAVIOR |
| `ghost.kind` | silhouette | DEFAULT_BEHAVIOR |
| `ghost.opacity` | 0.38 | DEFAULT_BEHAVIOR |
| `ghost.renderer` | module-silhouette | DEFAULT_BEHAVIOR |
| `magneticSnap` | standard | DEFAULT_BEHAVIOR |
| `moveSnapCm` | 50 | DEFAULT_BEHAVIOR |
| `overlapWithTypes` | [] | DEFAULT_BEHAVIOR |
| `placement` | wall | DEFAULT_BEHAVIOR |
| `rotationStepDeg` | 90 | DEFAULT_BEHAVIOR |
| `sideInsertRotation` | inherit | DEFAULT_BEHAVIOR |
| `supportsWallOverlayMount` | evet | DEFAULT_BEHAVIOR |
| `wallCapacity` | include | DEFAULT_BEHAVIOR |
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

- factory fonksiyon: yok
- factory çıktısı yok: MODULE_STATE_FACTORIES içinde type yok: floor

## 7. BOM / recipe / küme

- resolveItemBom hata: `Missing canonical unit for leaf Item: karolaj.`

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: createRenderableModule bu type için `null` döner (modül değil)
- sidebar kartı: yok
- persistence yolu: stand.itemKey (eski floorType silinir)
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | evet | FLOOR_ITEMS.paintable=true; scene3d zemin rengi + main.js seçim |
| `image` | hayır | kanonik kayıt alanı; runtime image yok veya appearance.image=none |
| `glass` | hayır | scene3d.js getModuleContext: supportsGlass yalnız selectionMode==='panel' |
| `fabric_lightbox` | hayır | supportsFabric === supportsGlass |
| `fabric_mesh` | hayır | supportsFabric === supportsGlass |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | hayır | moduleContextMenu.js: moduleType === 'illuminated-foam' |
| `floor_select` | evet | main.js syncFloorTypeSelect + assignStandFloorItem; sahne scene3d.setFloorType |
| `placement_move` | hayır | katalog/modül state yok |
| `rotation` | hayır | modül davranışı yok veya yerleştirilemez |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor yok.
3. Sözleşme yok.
4. Davranış: TYPE_BEHAVIORS[`floor`] yok, DEFAULT_BEHAVIOR.
5. Kendi factory state'i yok; parent recipe/BOM veya zemin `stand.itemKey` üzerinden yaşar.

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/karolaj.md`
- src dosyaları (4): `src/main.js`, `src/items.js`, `src/standStandardsCopy.js`, `src/scene3d.js`
- unit/integration (2): `test/floorItemsContract.test.js`, `test/projectImportValidation.test.js`
- e2e (1): `e2e/floor-items-contract.spec.mjs`
- docs (8): 8 dosya
- ui/other: `index.html`, `audit/FINDINGS.md`, `audit/SISTEM_MUTABAKAT_RAPORU.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.
- Bu type için `createRenderableModule` dalı yok; leaf olarak sahneye çıkmaz.

