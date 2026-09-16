# `state.surface`

**Özellik ID:** `state.surface`
**İnsan tarafından anlaşılır adı:** Tekil yüzey state
**Kategori:** runtime-state
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `"{""id"":""surface-6310d0a3-5bfd-40ad-ac12-a453f07b9c82"",""color"":""#ffffff""}"` · `"{""id"":""surface-ea279e09-7e07-437d-af11-7af78db2df4c"",""color"":""#ffffff""}"` · `"{""id"":""surface-92a24d19-dff9-4420-8dd1-7bbb653a8d7f"",""color"":""#ffffff""}"` · `"{""id"":""surface-80f90de9-6822-450a-a089-089af4889e45"",""color"":""#ffffff""}"` · `"{""id"":""surface-30d50536-2572-4a27-8590-1f9103771d31"",""color"":""#ffffff""}"` · `"{""id"":""surface-f6895e9f-2b2e-4caf-8377-156b553af505"",""color"":""#ffffff""}"` · `"{""id"":""surface-7a7e3f48-e516-45cf-88a3-bcf155211e47"",""color"":""#ffffff""}"` · `"{""id"":""surface-1b3d82c6-8ab1-4fd0-a32e-2c043427af7a"",""color"":""#ffffff""}"` · `"{""id"":""surface-42a67e71-1fa5-4eec-8e6e-ad96f05c01e5"",""color"":""#ffffff""}"` · `"{""id"":""surface-2ad35b93-2c4a-4721-95b8-437ba3c44cd7"",""color"":""#17191c""}"` · `"{""id"":""surface-a1976095-e734-44bf-953d-b95ba64eb389"",""itemKey"":""door_leaf_100"",""stripIndex"":null,""color"":""#ffffff"",""imageAssetId"":null,""imageTransform"":{""mode"":""single"",""offsetX"":0,""offsetY"":0,""repeatX"":1,""repeatY"":1,""rotation"":0}}"` · `"{""id"":""surface-9331577e-66ef-4aed-b17a-21f6bc26664b"",""color"":""#c79b63""}"` (+3)

## Ne işe yarar

Tek yüzey (separator, kapı kanadı, mobilya, led, planter).

## Canonical owner

- katman: runtime module state
- dosya: `src/designState.js`
- sembol: `MODULE_STATE_FACTORIES / create*ModuleState`

## Tanımlandığı yerler

- `src/designState.js` `createSeparatorModuleState` :160 [write-or-literal]
- `src/designState.js` `createDoorModuleState` :260 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :565 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :628 [write-or-literal]

## Okuyan yerler

- `test/doorLeafItemContract.test.js` (dosya düzeyi) :51 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `createSeparatorModuleState` :160 [write-or-literal]
- `src/designState.js` `createDoorModuleState` :260 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :565 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :628 [write-or-literal]

## Default değeri

Factory default: `createEditablePanelState` / `createEditableItemSurfaceState`; renk `DEFAULT_PANEL_COLOR` `#ffffff` veya `itemDefaultColorHex`. Şerit sayısı: occupancy.stripCount ?? `STRIP_COUNT` 7.

## Override zinciri

Item defaultColor / DEFAULT_PANEL_COLOR `#ffffff` → factory yüzey → kullanıcı applyColor/image/glass/fabric → persist modules[] → load clone → normalizeModuleItemState itemKey düzeltir, yüzey ezmesini silmez.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **15** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `sofa-set-classic`, `sofa-single-classic`, `sofa-double-classic`, `table-chair-set-eames`, `chair`, `bar-stool`, `indoor-plant-1`, `led-floodlight`, `door`, `separator`
- itemKey: `furniture_sofa_set_classic`, `furniture_sofa_single_classic`, `furniture_sofa_double_classic`, `furniture_table_chair_set_eames`, `chair_eames`, `furniture_bar_stool_classic`, `EXTRA_LONG_PLANTER_100`, `EXTRA_LONG_PLANTER_150`, `EXTRA_LONG_PLANTER_200`, `led_floodlight`, `door_100`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **15**
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

Renk: `applyColor` hex. Cam/kumaş surfaceState bayrakları. Şema validator yok.

## Bağımlılıklar

- kök katman: `state`

## Değiştirmenin yan etkileri

Yüzey/ışık/foam state değişince renderer ve persist blob güncellenir; BOM değişmez.

## CRUD sınıflandırması

ITEM_EDITABLE

## CRUD gerekçesi

Factory default yazar; kullanıcı yüzey rengi/görsel/cam/kumaş, raf ışığı, strafor boyut/hale veya zemin rengi ile ezer. `saveProject` module/stand blob içinde kalır.

## Kanıt

- src dosya sayısı (unique): **1**
- src dosyaları: `src/designState.js`

- `src/designState.js` `createSeparatorModuleState` :160 [write-or-literal]
- `src/designState.js` `createDoorModuleState` :260 [write-or-literal]
- `src/designState.js` `createIndoorPlantModuleState` :565 [write-or-literal]
- `src/designState.js` `createLedFloodlightModuleState` :628 [write-or-literal]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :51 [test]

- indeks: 141 / 188
