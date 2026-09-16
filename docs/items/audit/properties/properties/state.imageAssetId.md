# `state.imageAssetId`

**Özellik ID:** `state.imageAssetId`
**İnsan tarafından anlaşılır adı:** Modül/yüzey görsel asset id
**Kategori:** runtime-state
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `null`

## Ne işe yarar

Strafor zorunlu görsel; yüzeylerde strips/faces içinde ayrı alan.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/designState.js` `if` :64 [write-or-literal]
- `src/designState.js` `createEditablePanelState` :73 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :573 [write]
- `src/designState.js` `createIlluminatedFoamModuleState` :581 [read]
- `src/designState.js` `createLedFloodlightModuleState` :663 [read]
- `src/designState.js` `createModuleStateFromDescriptor` :672 [write]
- `src/designState.js` `if` :835 [write]
- `src/designState.js` `if` :855 [read]

## Okuyan yerler

- `src/designState.js` `createIlluminatedFoamModuleState` :581 [read]
- `src/designState.js` `createLedFloodlightModuleState` :663 [read]
- `src/designState.js` `if` :855 [read]
- `src/scene3d.js` `if` :1508 [read]
- `src/scene3d.js` `loadGroupedImageOnSurface` :3853 [read]
- `src/scene3d.js` `clearImageAssetById` :4112 [read]
- `src/main.js` `restoreProject` :1391 [read]
- `test/baseModule.test.js` (dosya düzeyi) :36 [test]
- `test/designState.test.js` (dosya düzeyi) :17 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :41 [test]
- `test/imageAssetDeletion.test.js` (dosya düzeyi) :9 [test]
- `test/imageAssetLiveDelete.test.js` (dosya düzeyi) :10 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :9 [test]
- `test/lightboxFabricPerformance.test.js` (dosya düzeyi) :19 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :94 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :41 [test]
- `test/projectImportFlow.test.js` (dosya düzeyi) :34 [test]
- `test/shelfModule.test.js` (dosya düzeyi) :43 [test]
- `test/surfaceStateBinding.test.js` (dosya düzeyi) :17 [test]
- `test/wallSeparatorItemsContract.test.js` (dosya düzeyi) :99 [test]
- `test/wallShowcaseItemContract.test.js` `for` :92 [test]
- `e2e/f010-module-construction.spec.mjs` `for` :162 [test]
- `e2e/f028-reset-features.spec.mjs` `seedIlluminatedFoam` :42 [test]
- `e2e/wall-separator-items-contract.spec.mjs` `for` :87 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `if` :64 [write-or-literal]
- `src/designState.js` `createEditablePanelState` :73 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :573 [write]
- `src/designState.js` `createModuleStateFromDescriptor` :672 [write]
- `src/designState.js` `if` :835 [write]
- `src/scene3d.js` `if` :3924 [write]
- `src/scene3d.js` `applyImageAsset` :3933 [write]
- `src/scene3d.js` `addPanelFace` :6551 [write-or-literal]
- `src/scene3d.js` `addFace` :6723 [write-or-literal]
- `src/scene3d.js` `addFace` :6851 [write]
- `src/scene3d.js` `if` :7073 [write-or-literal]
- `src/scene3d.js` `for` :7261 [write-or-literal]
- `src/main.js` `if` :1662 [write]
- `src/imageAssetReferences.js` (dosya düzeyi) :1 [write]

## Default değeri

Foam: factory argümanı zorunlu (`options.imageAssetId ?? descriptor.imageAssetId ?? null`). Yüzey görseli bu sütunda değil; `strips/faces/surface.imageAssetId`.

## Override zinciri

foam: createIlluminatedFoamModuleState(imageAssetId) zorunlu asset. Yüzey imageAssetId strips/faces içinde ayrı. Reset illuminated-foam siler (`main.js` resetModuleFeatures).

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **1** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `illuminated-foam`
- itemKey: `illuminated-foam`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **1**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

koşullu

## Kullanıcı nereden değiştirir

Strafor: SVG/asset oluşturma. Panel yüzeyleri: strips[].imageAssetId asset library. Foam resize ayrı.

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `state`

## Değiştirmenin yan etkileri

Yüzey/ışık/foam state değişince renderer ve persist blob güncellenir; BOM değişmez.

## CRUD sınıflandırması

ITEM_EDITABLE

## CRUD gerekçesi

Factory default yazar; kullanıcı yüzey rengi/görsel/cam/kumaş, raf ışığı, strafor boyut/hale veya zemin rengi ile ezer. `saveProject` module/stand blob içinde kalır.

## Kanıt

- src dosya sayısı (unique): **4**
- src dosyaları: `src/designState.js`, `src/scene3d.js`, `src/main.js`, `src/imageAssetReferences.js`

- `src/designState.js` `if` :64 [write-or-literal]
- `src/designState.js` `createEditablePanelState` :73 [write-or-literal]
- `src/designState.js` `createIlluminatedFoamModuleState` :573 [write]
- `src/designState.js` `createIlluminatedFoamModuleState` :581 [read]
- `src/designState.js` `createLedFloodlightModuleState` :663 [read]
- `src/designState.js` `createModuleStateFromDescriptor` :672 [write]
- `src/designState.js` `if` :835 [write]
- `src/designState.js` `if` :855 [read]
- `src/scene3d.js` `if` :1508 [read]
- `src/scene3d.js` `loadGroupedImageOnSurface` :3853 [read]
- `src/scene3d.js` `if` :3924 [write]
- `src/scene3d.js` `applyImageAsset` :3933 [write]
- `src/scene3d.js` `clearImageAssetById` :4112 [read]
- `src/scene3d.js` `addPanelFace` :6551 [write-or-literal]
- `src/scene3d.js` `addFace` :6723 [write-or-literal]
- `src/scene3d.js` `addFace` :6851 [write]
- `src/scene3d.js` `if` :7073 [write-or-literal]
- `src/scene3d.js` `for` :7261 [write-or-literal]
- `src/main.js` `restoreProject` :1391 [read]
- `src/main.js` `if` :1662 [write]
- `src/imageAssetReferences.js` (dosya düzeyi) :1 [write]
- `test/baseModule.test.js` (dosya düzeyi) :36 [test]
- `test/designState.test.js` (dosya düzeyi) :17 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :41 [test]
- `test/imageAssetDeletion.test.js` (dosya düzeyi) :9 [test]
- `test/imageAssetLiveDelete.test.js` (dosya düzeyi) :10 [test]
- `test/lCounter100Contract.test.js` (dosya düzeyi) :9 [test]
- `test/lightboxFabricPerformance.test.js` (dosya düzeyi) :19 [test]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :94 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :41 [test]
- `test/projectImportFlow.test.js` (dosya düzeyi) :34 [test]
- `test/shelfModule.test.js` (dosya düzeyi) :43 [test]
- `test/surfaceStateBinding.test.js` (dosya düzeyi) :17 [test]
- `test/wallSeparatorItemsContract.test.js` (dosya düzeyi) :99 [test]
- `test/wallShowcaseItemContract.test.js` `for` :92 [test]
- `e2e/f010-module-construction.spec.mjs` `for` :162 [test]
- `e2e/f028-reset-features.spec.mjs` `seedIlluminatedFoam` :42 [test]
- `e2e/wall-separator-items-contract.spec.mjs` `for` :87 [test]

- indeks: 124 / 188

### İkinci tur ek consumer

- `src/surfaceStateBinding.js` (ikinci tur token taraması; ilk tur listesinde yoktu)
