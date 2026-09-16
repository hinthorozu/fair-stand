# `static.bodyItems.sideItemKey`

**Özellik ID:** `static.bodyItems.sideItemKey`
**İnsan tarafından anlaşılır adı:** Vitrin bodyItems.sideItemKey
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `showcase_side_94_6_30` · `showcase_side_143_5_30`

## Ne işe yarar

Audit özelliği. Aşağıdaki kanıt satırlarına bak.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :936 [define]
- `src/items.js` (dosya düzeyi) :937 [write-or-literal]
- `src/items.js` `getShowcaseBodyDefinition` :981 [write]

## Okuyan yerler

- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/wallShowcaseItemContract.test.js` `for` :25 [test]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :936 [define]
- `src/items.js` (dosya düzeyi) :937 [write-or-literal]
- `src/items.js` `getShowcaseBodyDefinition` :981 [write]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **2** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `showcase-2`, `showcase-3`
- itemKey: `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **2**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

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

- src dosya sayısı (unique): **1**
- src dosyaları: `src/items.js`

- `src/items.js` (dosya düzeyi) :936 [define]
- `src/items.js` (dosya düzeyi) :937 [write-or-literal]
- `src/items.js` `getShowcaseBodyDefinition` :981 [write]
- `test/wallShowcaseItemContract.test.js` (dosya düzeyi) :11 [test]
- `test/wallShowcaseItemContract.test.js` `for` :25 [test]

- indeks: 7 / 188
