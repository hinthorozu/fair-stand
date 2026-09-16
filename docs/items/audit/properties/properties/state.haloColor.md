# `state.haloColor`

**Özellik ID:** `state.haloColor`
**İnsan tarafından anlaşılır adı:** Işıklı strafor hale rengi
**Kategori:** runtime-state
**Veri tipi:** color (int 0xRRGGBB veya hex string; katmana göre değişir)
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `#ffffff`

## Ne işe yarar

Strafor hale. Color editor foam yolu `main.js`.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/designState.js` `createIlluminatedFoamModuleState` :586 [write-or-literal]

## Okuyan yerler

- `test/lightingItemsContract.test.js` (dosya düzeyi) :93 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :40 [test]
- `test/selectionFeedback.test.js` `surface` :47 [test]
- `e2e/f028-reset-features.spec.mjs` `seedIlluminatedFoam` :47 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `createIlluminatedFoamModuleState` :586 [write-or-literal]
- `src/scene3d.js` `if` :4801 [write]
- `src/main.js` `resizeContextIlluminatedFoam` :881 [write]
- `src/main.js` `if` :1662 [write]
- `src/main.js` `onKeyDown` :1707 [write]
- `src/selectionFeedback.js` `if` :122 [write]

## Default değeri

Factory default: `#ffffff`; regex `/^#[0-9a-fA-F]{6}$/` geçmezse aynı fallback (`createIlluminatedFoamModuleState`).

## Override zinciri

factory `#ffffff` (regex geçmezse) → foam color UI `moduleState.haloColor=color` → persist → renderer MeshBasicMaterial color.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **1** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `illuminated-foam`
- itemKey: `illuminated-foam`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **1**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

evet

## Kullanıcı nereden değiştirir

Işıklı strafor seçiliyken renk; `main.js` moduleState.haloColor=color (~1707).

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

Strafor halo MeshBasicMaterial color.

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

`createIlluminatedFoamModuleState`: `/^#[0-9a-fA-F]{6}$/` değilse `#ffffff`.

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
- src dosyaları: `src/designState.js`, `src/scene3d.js`, `src/main.js`, `src/selectionFeedback.js`

- `src/designState.js` `createIlluminatedFoamModuleState` :586 [write-or-literal]
- `src/scene3d.js` `if` :4801 [write]
- `src/main.js` `resizeContextIlluminatedFoam` :881 [write]
- `src/main.js` `if` :1662 [write]
- `src/main.js` `onKeyDown` :1707 [write]
- `src/selectionFeedback.js` `if` :122 [write]
- `test/lightingItemsContract.test.js` (dosya düzeyi) :93 [test]
- `test/moduleStateConstructionRegistry.test.js` `for` :40 [test]
- `test/selectionFeedback.test.js` `surface` :47 [test]
- `e2e/f028-reset-features.spec.mjs` `seedIlluminatedFoam` :47 [test]

- indeks: 122 / 188

### İkinci tur ek consumer

- `src/moduleContextMenu.js` (ikinci tur token taraması; ilk tur listesinde yoktu)
