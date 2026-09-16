# `static.composition.options.shelfCount`

**Özellik ID:** `static.composition.options.shelfCount`
**İnsan tarafından anlaşılır adı:** Kanonik composition: options.shelfCount
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `2` · `3`

## Ne işe yarar

shelf recipe `shelf:{w}:{count}` seçimi.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` (dosya düzeyi) :861 [define]

## Okuyan yerler

- `src/items.js` (dosya düzeyi) :861 [define]

## Yazan / değiştiren yerler

- `src/items.js` (dosya düzeyi) :861 [define]

## Default değeri

Item default: yalnız COMPOSITE_ITEMS (recipe) veya FURNITURE cluster `items`. Global composition default yok.

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **6** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `shelf`
- itemKey: `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **6**
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

- `src/items.js` (dosya düzeyi) :861 [define]

- indeks: 13 / 188
