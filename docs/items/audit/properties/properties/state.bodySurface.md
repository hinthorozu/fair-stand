# `state.bodySurface`

**Özellik ID:** `state.bodySurface`
**İnsan tarafından anlaşılır adı:** Vitrin gövde yüzey state
**Kategori:** runtime-state
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `"{""id"":""surface-eeee9a71-8f58-4115-a9ac-211829a6adae"",""color"":""#ffffff""}"` · `"{""id"":""surface-9652cdd3-4d2b-4d40-a371-d8e84bad7c5f"",""color"":""#ffffff""}"`

## Ne işe yarar

Vitrin 4 sunta tek renk.

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/designState.js` `createShowcaseModuleState` :185 [write-or-literal]
- `src/designState.js` `if` :847 [read]
- `src/designState.js` `if` :848 [write]

## Okuyan yerler

- `src/designState.js` `if` :847 [read]
- `src/scene3d.js` `if` :7446 [read]
- `test/f017RendererSurfacePersist.test.js` (dosya düzeyi) :12 [test]
- `test/showcaseAppearance.test.js` `for` :30 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :23 [test]
- `test/wallShowcaseItemContract.test.js` `for` :91 [test]
- `e2e/wall-showcase-item-contract.spec.mjs` `for` :78 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `createShowcaseModuleState` :185 [write-or-literal]
- `src/designState.js` `if` :848 [write]
- `src/scene3d.js` `if` :7464 [write]
- `src/scene3d.js` `for` :7582 [write-or-literal]

## Default değeri

Factory default: `createEditablePanelState` / `createEditableItemSurfaceState`; renk `DEFAULT_PANEL_COLOR` `#ffffff` veya `itemDefaultColorHex`. Şerit sayısı: occupancy.stripCount ?? `STRIP_COUNT` 7.

## Override zinciri

Item defaultColor / DEFAULT_PANEL_COLOR `#ffffff` → factory yüzey → kullanıcı applyColor/image/glass/fabric → persist modules[] → load clone → normalizeModuleItemState itemKey düzeltir, yüzey ezmesini silmez.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **2** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `showcase-2`, `showcase-3`
- itemKey: `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **2**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

evet (iç alanlar: color/image/glass/fabric)

## Kullanıcı nereden değiştirir

3D seçim + `#apply-color` / görsel asset / context menu cam-kumaş-mesh. `src/main.js` applyActiveColorToSelection, `src/scene3d.js` applyColor, `src/moduleContextMenu.js`.

## Persistence

Evet — `modules[]` nesnesinin parçası. `saveProject` şemasız put. Load `cloneProjectState`.

## Renderer etkisi

Material color/texture, cam, lightbox/mesh overlay. `scene3d.js` bindRendererSurfaceState + applyColor.

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

- src dosya sayısı (unique): **2**
- src dosyaları: `src/designState.js`, `src/scene3d.js`

- `src/designState.js` `createShowcaseModuleState` :185 [write-or-literal]
- `src/designState.js` `if` :847 [read]
- `src/designState.js` `if` :848 [write]
- `src/scene3d.js` `if` :7446 [read]
- `src/scene3d.js` `if` :7464 [write]
- `src/scene3d.js` `for` :7582 [write-or-literal]
- `test/f017RendererSurfacePersist.test.js` (dosya düzeyi) :12 [test]
- `test/showcaseAppearance.test.js` `for` :30 [test]
- `test/showcaseBodyColorRegression.test.js` `for` :23 [test]
- `test/wallShowcaseItemContract.test.js` `for` :91 [test]
- `e2e/wall-showcase-item-contract.spec.mjs` `for` :78 [test]

- indeks: 117 / 188
