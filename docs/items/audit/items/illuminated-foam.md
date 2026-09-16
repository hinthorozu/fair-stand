# illuminated-foam

- **name:** Işıklı Strafor / Logo
- **type:** `illuminated-foam`
- **registry map:** `NON_CATALOG_ITEMS`
- **kanonik bakış:** `src/items.js` `NON_CATALOG_ITEMS['illuminated-foam']` + `getItem('illuminated-foam')`

## 1. Statik kayıt alanları

| alan | değer | kapsam |
|---|---|---|
| `dimensions.depthCm` | 3.5 | item kaydı |
| `dimensions.heightCm` | 50 | item kaydı |
| `dimensions.wallGapCm` | 1.5 | item kaydı |
| `dimensions.widthCm` | 200 | item kaydı |
| `itemKey` | illuminated-foam | item kaydı |
| `name` | Işıklı Strafor / Logo | item kaydı |
| `type` | illuminated-foam | item kaydı |

Tanımsız üst alanlar bu tabloda satır olarak yoktur; birleşik matriste sütun olarak açılır ve bu item için boş kalır.

## 2. Katalog

- MODULE_CATALOG kaydı: **yok** (`src/catalog.js`)
- MODULE_CATALOG_KEYS listesinde: **yok**
- grup: yok

## 3. Modül sözleşmesi

- profil: `wall-overlay-image`
- appearance.color: `halo-only`
- appearance.image: `required`
- renderer.mode: `specialized-overlay`
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
| `defaultRotationDeg` | 0 | TYPE_BEHAVIORS[type] + item descriptor override |
| `endpointContact` | standard | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.kind` | silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.opacity` | 0.38 | TYPE_BEHAVIORS[type] + item descriptor override |
| `ghost.renderer` | module-silhouette | TYPE_BEHAVIORS[type] + item descriptor override |
| `magneticSnap` | none | TYPE_BEHAVIORS[type] + item descriptor override |
| `moveSnapCm` | 10 | TYPE_BEHAVIORS[type] + item descriptor override |
| `overlapWithTypes` | [] | TYPE_BEHAVIORS[type] + item descriptor override |
| `placement` | wall-overlay | TYPE_BEHAVIORS[type] + item descriptor override |
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

- factory fonksiyon: `createIlluminatedFoamModuleState`
- factory çıktısı (id maskeli):

```json
{
  "id": "<id>",
  "itemKey": "illuminated-foam",
  "type": "illuminated-foam",
  "imageAssetId": null,
  "widthCm": 200,
  "heightCm": 50,
  "depthCm": 3.5,
  "wallGapCm": 1.5,
  "haloColor": "#ffffff"
}
```

## 7. BOM / recipe / küme

- resolveItemBom hata: `Missing canonical unit for leaf Item: illuminated-foam.`

## 8. Bu item'ı kullanan parent'lar

- Ters indeks boş: hiçbir recipe/cluster/bodyItems bu `itemKey`'i child olarak göstermiyor.

## 9. Renderer / UI / persistence

- renderer: `scene3d.js createIlluminatedFoamModule`
- sidebar kartı: yok
- persistence yolu: project.modules[] factory state + placement
- proje kaydı: `src/projectStore.js` `saveProject` — nesne şeması yok, tüm project put.

### Kullanıcı tarafından değiştirilebilir (kanıtlı UI)

| özellik | durum | kanıt |
|---|---|---|
| `color` | evet (haloColor) | appearance.color=halo-only; selectionFeedback foamControlsVisible |
| `image` | evet (zorunlu imageAssetId) | appearance.image=required |
| `glass` | hayır | scene3d.js getModuleContext: supportsGlass yalnız selectionMode==='panel' |
| `fabric_lightbox` | hayır | supportsFabric === supportsGlass |
| `fabric_mesh` | hayır | supportsFabric === supportsGlass |
| `shelf_light` | hayır | moduleContextMenu.js: moduleType === 'shelf' |
| `foam_resize` | evet | moduleContextMenu resize-foam; createIlluminatedFoamModuleState widthCm/heightCm |
| `floor_select` | hayır | main.js #floor-type yalnız FLOOR_ITEMS |
| `placement_move` | evet | getModuleBehavior().placement=wall-overlay; modulePlacement.js |
| `rotation` | evet | getModuleBehavior().rotationStepDeg=90 |

## 10. Default / override zinciri

1. Kanonik Item kaydı (`src/items.js` map).
2. Katalog descriptor yok.
3. Sözleşme profili `wall-overlay-image` type ailesi görünüm/BOM politikası verir; item assignment BOM mode'u ezer.
4. Davranış: TYPE_BEHAVIORS[`illuminated-foam`] var.
5. Factory default state Item + type factory. Kullanıcı rengi/görseli/cam/kumaş/placement proje `modules[]` üzerinde ezer. `saveProject` ezereleri olduğu gibi yazar.
6. `normalizeModuleItemState` kayıtlı state'te itemKey/ölçü düzeltir (kullanıcı yüzey ezmesini silmeden — kapı/tv/base/counter/flat-panel yorumları `designState.js`).

## 11. Test / doküman kanıtı

- definition: `docs/items/definitions/illuminated-foam.md`
- src dosyaları (8): `src/moduleContextMenu.js`, `src/moduleBehavior.js`, `src/moduleContracts.js`, `src/main.js`, `src/selectionFeedback.js`, `src/scene3d.js`, `src/items.js`, `src/designState.js`
- unit/integration (11): `test/illuminatedFoamInteraction.test.js`, `test/f028FeatureReset.test.js`, `test/illuminatedFoamModule.test.js`, `test/projectImportValidation.test.js`, `test/moduleStateConstructionRegistry.test.js`, `test/moduleRotationPolicy.test.js`, `test/systemDevelopmentContract.test.js`, `test/moduleContextAllowSideInsert.test.js`, `test/lightingItemsContract.test.js`, `test/selectionFeedback.test.js`, `test/systemModuleCatalogDoc.test.js`
- e2e (2): `e2e/f028-reset-features.spec.mjs`, `e2e/lighting-items-contract.spec.mjs`
- docs (9): 9 dosya
- ui/other: `SYSTEM_DEVELOPMENT_CONTRACT.md`, `SYSTEM_IMPACT_SWEEP.md`, `audit/evidence/A09_RENDERER_SCENE_RUNTIME.md`, `audit/evidence/A06_PLACEMENT_MOVE_ROTATION_COLLISION_REFLOW.md`, `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md`, `audit/evidence/A19_BROWSER_E2E_CRITICAL_FLOWS.md`, `audit/evidence/A16_ACCESSIBILITY_KEYBOARD_FOCUS.md`, `audit/evidence/A10_UI_CONTROLS.md`, `audit/evidence/A05_MODULE_BEHAVIOR.md`, `audit/evidence/A08_PERSISTENCE_AUTOSAVE_ISOLATION.md`, `audit/evidence/A07_STATE_MODEL_FACTORIES.md`, `audit/FINDINGS.md`, `audit/remediation/A01_F001_CLOSURE.md`, `SYSTEM_AUDIT_CHECKLIST.md`, `audit/remediation/A03_F010_CLOSURE.md`, `audit/remediation/A10_F028_CLOSURE.md`, `SYSTEM_MODULE_CATALOG.md`, `audit/remediation/A04_F013_CLOSURE.md`, `audit/SISTEM_MUTABAKAT_RAPORU.md`

## 12. Belirsiz / sınır

- Persistence alan whitelist'i yok; hangi factory alanının gerçekten yazıldığı `saveProject` ile tüm project nesnesinin kopyalanmasına bağlı (`src/projectStore.js` `saveProject`). Snapshot içeriği `src/main.js` `buildProjectSnapshot`.

