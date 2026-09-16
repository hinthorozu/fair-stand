# Final property audit

## Sayısal tutarlılık

- beklenen property: 188
- oluşturulan property dosyası: 188
- index satırı: 188
- CRUD sınıflandırılmış: 188
- owner belirlenmiş veya BELIRSIZ: 188
- consumer belirlenmiş veya "consumer yok": 188
- katalog id === dosya: TAMAM
- eksik dosya: yok
- fazla dosya: yok

## CRUD dağılımı

- ITEM_EDITABLE: 9
- ITEM_READONLY: 45
- COMPOSITION_EDITABLE: 0
- BEHAVIOR_EDITABLE: 0
- RUNTIME_ONLY: 0
- DERIVED: 74
- LEGACY_COMPAT: 0
- SYSTEM_INTERNAL: 60
- BELIRSIZ: 0

## İkinci tur başlık kontrolü

- 188 dosyada zorunlu başlıklar tam.

## İkinci tur ek consumer (ilk turda kaçan src dosyası)

- `state.imageAssetId`: `src/surfaceStateBinding.js`
- `ui.editable.floorSelect`: `src/projectImportValidation.js`, `index.html`
- `itemKey`: `src/projectImportValidation.js`
- `state.haloColor`: `src/moduleContextMenu.js`
- `behavior.rotationStepDeg`: `src/scene3d.js`, `src/moduleDragSidebar.js`, `src/viewKeyboardShortcuts.js`
- `persist.path`: `src/items.js` (yorum satırı 286 — `stand.itemKey` / legacy `floorType`; runtime yazıcı değil)

Bu ekler ilgili property dosyalarının Kanıt bölümüne işlendi. Yorum-only hit runtime consumer sayılmaz.

## Açıklar

### src hit 0 (token taraması boş)

- yok

### Owner BELIRSIZ

- yok (0)

### CRUD BELIRSIZ

- yok (0)

### Kanonik vs runtime

- `capabilities.glass/lightbox/mesh` her item false; gerçek cam `scene3d` `selectionMode==='panel'`.
- `createUprightModuleState` yalnız `upright_346_5`.
- `connector_double` varsayılan recipe parent 0.
- Persistence alan whitelist yok.
- `plastic-trash-bin` renderer `createIndoorPlantModule`.

### 188 sütunda olmayan, ikinci turda görülen ilişkili alanlar

Yeni property üretilmedi. Aşağıdakiler mevcut 188 id'nin dışında kalan runtime alanlarıdır:

- `modules[].placement` / `rotationZDeg` / `xCm` / `yCm` / `wallId` — placement persist; 188 içinde `ui.editable.placement` / `rotation`. Owner: `src/modulePlacement.js`, `src/scene3d.js`.
- `stand.floorColor` — zemin boyası persist (`main.js` applyActiveColorToSelection, `scene3d.setFloorColor`). 188: `static.paintable` + `static.defaultColor` + `ui.editable.color`.
- yüzey iç alanları `isGlass`, `fabricGroupId`, `fabricType`, `fabricLightingOn`, `fabricImageAssetId`, `imageTransform` — `state.strips` / `faces` / `surface`. `surfaceStateBinding.js` `FABRIC_KEYS`. Ayrı sütun yok.
- `imageAssetReferences.js` `IMAGE_ASSET_REFERENCE_KEYS` = `imageAssetId` + `fabricImageAssetId`.
- `validateImportedModuleState` yalnız `id` + `type ∈ MODULE_STATE_TYPES`; alan şeması yok (`src/projectImportValidation.js`).
- legacy `floorType` src'de persist yolu olarak yok; zemin `stand.itemKey`.

### itemKey taraması

`item.itemKey` / `getItem(` / `resolveItemKey` token'ları owner dosyalarından başlar. Unique src dosya listesi her property kaydının Kanıt bölümündedir.

`src/` bu turda değişmedi.
