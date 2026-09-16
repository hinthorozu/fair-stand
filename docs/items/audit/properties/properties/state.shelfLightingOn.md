# `state.shelfLightingOn`

**Özellik ID:** `state.shelfLightingOn`
**İnsan tarafından anlaşılır adı:** Raf altı LED açık/kapalı
**Kategori:** runtime-state
**Veri tipi:** boolean
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `false`

## Ne işe yarar

Raf altı LED. Context menu toggle. `createShelfModule` görünürlük.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/designState.js` `createShelfModuleState` :234 [write-or-literal]

## Okuyan yerler

- `src/main.js` `getContextShelfLightingState` :789 [read]
- `test/shelfLighting.test.js` (dosya düzeyi) :9 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :103 [test]
- `e2e/shelf-board-appearance.spec.mjs` `saveAndReadProject` :78 [test]
- `e2e/wall-shelf-items-contract.spec.mjs` `for` :89 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `createShelfModuleState` :234 [write-or-literal]
- `src/scene3d.js` `setShelfLightingVisible` :4644 [write]
- `src/scene3d.js` `if` :6876 [write]
- `src/scene3d.js` (dosya düzeyi) :6955 [write]
- `src/main.js` `changeContextShelfLighting` :797 [write]
- `src/moduleContextMenu.js` `if` :419 [write]

## Default değeri

Factory default: `false` (`createShelfModuleState`).

## Override zinciri

factory `false` → context menu toggle `main.js` yazar → persist modules[] → createShelfModule LED visible.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **6** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `shelf`
- itemKey: `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **6**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

evet

## Kullanıcı nereden değiştirir

Context menu toggle-shelf-light; `main.js` currentModules[index].shelfLightingOn.

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

`createShelfModule` LED strip/spot `.visible`.

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
- src dosyaları: `src/designState.js`, `src/scene3d.js`, `src/main.js`, `src/moduleContextMenu.js`

- `src/designState.js` `createShelfModuleState` :234 [write-or-literal]
- `src/scene3d.js` `setShelfLightingVisible` :4644 [write]
- `src/scene3d.js` `if` :6876 [write]
- `src/scene3d.js` (dosya düzeyi) :6955 [write]
- `src/main.js` `getContextShelfLightingState` :789 [read]
- `src/main.js` `changeContextShelfLighting` :797 [write]
- `src/moduleContextMenu.js` `if` :419 [write]
- `test/shelfLighting.test.js` (dosya düzeyi) :9 [test]
- `test/wallShelfItemsContract.test.js` (dosya düzeyi) :103 [test]
- `e2e/shelf-board-appearance.spec.mjs` `saveAndReadProject` :78 [test]
- `e2e/wall-shelf-items-contract.spec.mjs` `for` :89 [test]

- indeks: 135 / 188
