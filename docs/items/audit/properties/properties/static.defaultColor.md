# `static.defaultColor`

**Özellik ID:** `static.defaultColor`
**İnsan tarafından anlaşılır adı:** Kanonik varsayılan renk
**Kategori:** kanonik-kayit
**Veri tipi:** color (int 0xRRGGBB veya hex string; katmana göre değişir)
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `13685716` · `13081443` · `16777215` · `16317180` · `#e9edf1` · `#8b8f94` · `#e8dfd1` · `#c4a480` · `#625f58`

## Ne işe yarar

Leaf/zemin varsayılan renk. Factory `itemDefaultColorHex` / separatorDefaultColor / zemin deseni.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `FLOOR_ITEMS` :293 [write-or-literal]
- `src/items.js` `if` :994 [read]
- `src/designState.js` `separatorDefaultColor` :22 [write]
- `src/designState.js` `separatorDefaultColor` :23 [read]
- `src/designState.js` `itemDefaultColorHex` :46 [read]
- `src/designState.js` `itemDefaultColorHex` :47 [write]
- `src/designState.js` `if` :63 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :187 [write-or-literal]
- `src/designState.js` `if` :834 [write]

## Okuyan yerler

- `src/items.js` `if` :994 [read]
- `src/designState.js` `separatorDefaultColor` :23 [read]
- `src/designState.js` `itemDefaultColorHex` :46 [read]
- `src/scene3d.js` `if` :636 [read]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :40 [test]
- `test/baseTopsItemContract.test.js` `for` :76 [test]
- `test/counterTopDefaultColor.test.js` `for` :18 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :19 [test]
- `test/floorItemsContract.test.js` `for` :41 [test]
- `test/profileIntrinsicProperties.test.js` `for` :20 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :13 [test]
- `test/separatorPanelsItemContract.test.js` `for` :69 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :26 [test]
- `test/shelfItemsItemContract.test.js` `for` :63 [test]
- `test/showcaseAppearance.test.js` `for` :26 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :35 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :213 [test]
- `test/uprightIntrinsicProperties.test.js` `for` :14 [test]
- `test/wallShowcaseItemContract.test.js` `for` :82 [test]

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `FLOOR_ITEMS` :293 [write-or-literal]
- `src/designState.js` `separatorDefaultColor` :22 [write]
- `src/designState.js` `itemDefaultColorHex` :47 [write]
- `src/designState.js` `if` :63 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :187 [write-or-literal]
- `src/designState.js` `if` :834 [write]
- `src/scene3d.js` `fine` :520 [write]
- `src/scene3d.js` `if` :6887 [write-or-literal]
- `src/scene3d.js` `if` :7463 [write]

## Default değeri

Item default: leaf/zemin kaydında integer veya hex. Factory: `itemDefaultColorHex` / `separatorDefaultColor`. Global yüzey rengi: `DEFAULT_PANEL_COLOR` `#ffffff` (`src/designState.js`) item defaultColor yoksa (mobilya/planter). Upright/profile: Item.defaultColor zorunlu (yoksa TypeError).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **30** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `separator-panel`, `door-leaf`, `shelf`, `showcase-board`, `counter-top`, `base-top`, `floor`
- itemKey: `upright_346_5`, `upright_99`, `upright_49_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `separator_panel_48_5`, `separator_panel_98`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`, `karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **10**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **20**
- tanımlı ama sahneye çıkmayan: `upright_99`, `upright_49_5`, `separator_panel_48_5`, `separator_panel_98`, `door_leaf_100`, `shelf_100`, `shelf_150`, `shelf_200`, `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `counter_top_110_60`, `counter_top_52_60`, `counter_top_160_60`, `counter_top_102_60`, `counter_top_210_60`, `counter_top_150_60`, `base_top_107_50`, `base_top_157_50`, `base_top_206_50`

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

Factory/zemin varsayılan rengi; kullanıcı ezerse material güncellenir.

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `static`

## Değiştirmenin yan etkileri

Kanonik kayıt değişirse catalog, factory, BOM, davranış çözümü ve test kilitleri birlikte etkilenir. Bu turda değiştirilmedi.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **3**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/scene3d.js`

- `src/items.js` `LEAF_ITEMS` :3 [define]
- `src/items.js` `FLOOR_ITEMS` :293 [write-or-literal]
- `src/items.js` `if` :994 [read]
- `src/designState.js` `separatorDefaultColor` :22 [write]
- `src/designState.js` `separatorDefaultColor` :23 [read]
- `src/designState.js` `itemDefaultColorHex` :46 [read]
- `src/designState.js` `itemDefaultColorHex` :47 [write]
- `src/designState.js` `if` :63 [write-or-literal]
- `src/designState.js` `createShowcaseModuleState` :187 [write-or-literal]
- `src/designState.js` `if` :834 [write]
- `src/scene3d.js` `fine` :520 [write]
- `src/scene3d.js` `if` :636 [read]
- `src/scene3d.js` `if` :6887 [write-or-literal]
- `src/scene3d.js` `if` :7463 [write]
- `test/baseTopsItemContract.test.js` (dosya düzeyi) :40 [test]
- `test/baseTopsItemContract.test.js` `for` :76 [test]
- `test/counterTopDefaultColor.test.js` `for` :18 [test]
- `test/doorLeafItemContract.test.js` (dosya düzeyi) :19 [test]
- `test/floorItemsContract.test.js` `for` :41 [test]
- `test/profileIntrinsicProperties.test.js` `for` :20 [test]
- `test/separatorPanelsItemContract.test.js` (dosya düzeyi) :13 [test]
- `test/separatorPanelsItemContract.test.js` `for` :69 [test]
- `test/shelfItemsItemContract.test.js` (dosya düzeyi) :26 [test]
- `test/shelfItemsItemContract.test.js` `for` :63 [test]
- `test/showcaseAppearance.test.js` `for` :26 [test]
- `test/showcaseBodyBoardsItemContract.test.js` `for` :35 [test]
- `test/uprightFieldPlacement.test.js` (dosya düzeyi) :213 [test]
- `test/uprightIntrinsicProperties.test.js` `for` :14 [test]
- `test/wallShowcaseItemContract.test.js` `for` :82 [test]

- indeks: 15 / 188
