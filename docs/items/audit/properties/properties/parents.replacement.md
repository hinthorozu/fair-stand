# `parents.replacement`

**Özellik ID:** `parents.replacement`
**İnsan tarafından anlaşılır adı:** innerCornerItemReplacements child kullanımı
**Kategori:** ters-indeks
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `door_100 replaces connector_single ×3; wall_showcase_100_2 replaces connector_single ×5; wall_showcase_100_3 replaces connector_single ×5` · `door_100 replaces connector_single ×2; wall_showcase_100_2 replaces connector_single ×4; wall_showcase_100_3 replaces connector_single ×4`

## Ne işe yarar

Ters indeks: bu itemKey hangi parent recipe/küme/body içinde child.

## Canonical owner

- katman: recipe variant
- dosya: `src/moduleRecipes.js`
- sembol: `variants`

## Tanımlandığı yerler

- consumer yok (bu id ile src/test/e2e satırı bulunamadı veya audit türevi).

## Okuyan yerler

- `src/moduleRecipes.js` `if` :264 [read]
- `test/cornerPanelsItemContract.test.js` `for` :117 [test]

## Yazan / değiştiren yerler

- `src/moduleRecipes.js` (dosya düzeyi) :23 [write-or-literal]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **2** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `connector`
- itemKey: `connector_single`, `connector_corner`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **0**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **2**
- tanımlı ama sahneye çıkmayan: `connector_single`, `connector_corner`

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

- src dosya sayısı (unique): **1**
- src dosyaları: `src/moduleRecipes.js`

- `src/moduleRecipes.js` (dosya düzeyi) :23 [write-or-literal]
- `src/moduleRecipes.js` `if` :264 [read]
- `test/cornerPanelsItemContract.test.js` `for` :117 [test]

- indeks: 158 / 188
