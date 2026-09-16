# `parents.showcaseBody`

**Özellik ID:** `parents.showcaseBody`
**İnsan tarafından anlaşılır adı:** showcase bodyItems parent
**Kategori:** ters-indeks
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `wall_showcase_100_2.sideItemKey` · `wall_showcase_100_3.sideItemKey` · `wall_showcase_100_2.horizontalItemKey; wall_showcase_100_3.horizontalItemKey` · `wall_showcase_100_2.glassShelfItemKey; wall_showcase_100_3.glassShelfItemKey`

## Ne işe yarar

Ters indeks: bu itemKey hangi parent recipe/küme/body içinde child.

## Canonical owner

- katman: kanonik bodyItems
- dosya: `src/items.js`
- sembol: `getShowcaseBodyDefinition`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :936 [define]
- `src/items.js` `getShowcaseBodyDefinition` :976 [read]
- `src/items.js` `getShowcaseBodyDefinition` :981 [write]
- `src/designState.js` (dosya düzeyi) :10 [read]
- `src/designState.js` `createShowcaseModuleState` :173 [write]
- `src/designState.js` `if` :844 [write]

## Okuyan yerler

- `src/items.js` `getShowcaseBodyDefinition` :976 [read]
- `src/designState.js` (dosya düzeyi) :10 [read]
- `src/scene3d.js` (dosya düzeyi) :13 [read]
- `test/glassShelfItemContract.test.js` `for` :57 [test]
- `test/showcaseAppearance.test.js` (dosya düzeyi) :5 [test]
- `test/showcaseAppearance.test.js` `for` :14 [test]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/wallShowcaseItemContract.test.js` `for` :25 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :936 [define]
- `src/items.js` `getShowcaseBodyDefinition` :981 [write]
- `src/designState.js` `createShowcaseModuleState` :173 [write]
- `src/designState.js` `if` :844 [write]
- `src/scene3d.js` `createShowcaseModule` :7445 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **4** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `showcase-board`, `showcase-accessory`
- itemKey: `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **0**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **4**
- tanımlı ama sahneye çıkmayan: `showcase_side_94_6_30`, `showcase_side_143_5_30`, `showcase_horizontal_87_4_30`, `glass_shelf`

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Runtime-only / derived audit. Ayrı persist alanı yok.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `parents`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **3**
- src dosyaları: `src/items.js`, `src/designState.js`, `src/scene3d.js`

- `src/items.js` (dosya düzeyi) :936 [define]
- `src/items.js` `getShowcaseBodyDefinition` :976 [read]
- `src/items.js` `getShowcaseBodyDefinition` :981 [write]
- `src/designState.js` (dosya düzeyi) :10 [read]
- `src/designState.js` `createShowcaseModuleState` :173 [write]
- `src/designState.js` `if` :844 [write]
- `src/scene3d.js` (dosya düzeyi) :13 [read]
- `src/scene3d.js` `createShowcaseModule` :7445 [write]
- `test/glassShelfItemContract.test.js` `for` :57 [test]
- `test/showcaseAppearance.test.js` (dosya düzeyi) :5 [test]
- `test/showcaseAppearance.test.js` `for` :14 [test]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :8 [test]
- `test/wallShowcaseItemContract.test.js` `for` :25 [test]

- indeks: 160 / 188
