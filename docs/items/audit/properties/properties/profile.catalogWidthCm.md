# `profile.catalogWidthCm`

**Özellik ID:** `profile.catalogWidthCm`
**İnsan tarafından anlaşılır adı:** Profil katalog genişliği (straight-wall nominal)
**Kategori:** turetilmis-profil
**Veri tipi:** number
**Birim:** cm
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `50` · `100` · `150` · `200`

## Ne işe yarar

`getStraightWallNominalWidthForProfileItem` — production lengthCm değil, 50/100/150/200 nominal.

## Canonical owner

- katman: türetim
- dosya: `src/moduleRecipes.js`
- sembol: `getStraightWallNominalWidthForProfileItem`

## Tanımlandığı yerler

- `src/designState.js` (dosya düzeyi) :14 [read]
- `src/designState.js` `createProfileModuleState` :495 [write]
- `src/designState.js` `if` :814 [write]
- `src/catalog.js` (dosya düzeyi) :2 [read]
- `src/catalog.js` `createProfileCatalogItem` :87 [write]

## Okuyan yerler

- `src/designState.js` (dosya düzeyi) :14 [read]
- `src/catalog.js` (dosya düzeyi) :2 [read]
- `src/moduleRecipes.js` `getStraightWallNominalWidthForProfileItem` :185 [read]
- `src/scene3d.js` (dosya düzeyi) :24 [read]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :152 [test]

## Yazan / değiştiren yerler

- `src/designState.js` `createProfileModuleState` :495 [write]
- `src/designState.js` `if` :814 [write]
- `src/catalog.js` `createProfileCatalogItem` :87 [write]
- `src/scene3d.js` `createProfileModule` :5342 [write]

## Default değeri

Audit/çözümleyici sütunu. Runtime default değeri yok; canlı fonksiyondan türetilir veya tarama sonucudur.

## Override zinciri

Bu özellik için ayrı runtime ezme katmanı yok; değer owner katmanındaki tablodan/kayıttan gelir.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **4** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `profile`
- itemKey: `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **4**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

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

yok.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `profile`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

DERIVED

## CRUD gerekçesi

Bu sütun runtime Item alanı değil; audit/çözümleyici görünümüdür veya başka alandan türetilir. Kullanıcı bu id ile form alanı görmez.

## Kanıt

- src dosya sayısı (unique): **4**
- src dosyaları: `src/designState.js`, `src/catalog.js`, `src/moduleRecipes.js`, `src/scene3d.js`

- `src/designState.js` (dosya düzeyi) :14 [read]
- `src/designState.js` `createProfileModuleState` :495 [write]
- `src/designState.js` `if` :814 [write]
- `src/catalog.js` (dosya düzeyi) :2 [read]
- `src/catalog.js` `createProfileCatalogItem` :87 [write]
- `src/moduleRecipes.js` `getStraightWallNominalWidthForProfileItem` :185 [read]
- `src/scene3d.js` (dosya düzeyi) :24 [read]
- `src/scene3d.js` `createProfileModule` :5342 [write]
- `test/profileFieldPlacement.test.js` (dosya düzeyi) :152 [test]

- indeks: 166 / 188
