# `contract.bom.source`

**Özellik ID:** `contract.bom.source`
**İnsan tarafından anlaşılır adı:** BOM kaynak dosyası
**Kategori:** sozlesme
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** TSV'de görülen değerler (canlı dump): `src/itemBom.js` · `src/moduleRecipes.js`

## Ne işe yarar

Modül sözleşme profil/assignment alanı. Runtime UI yetkisi ve BOM politikası.

## Canonical owner

- katman: modül sözleşmesi
- dosya: `src/moduleContracts.js`
- sembol: `MODULE_CONTRACT_ASSIGNMENTS + MODULE_CONTRACT_PROFILES`

## Tanımlandığı yerler

- `src/moduleContracts.js` (dosya düzeyi) :6 [write-or-literal]

## Okuyan yerler

- `src/moduleContracts.js` (dosya düzeyi) :6 [write-or-literal]

## Yazan / değiştiren yerler

- `src/moduleContracts.js` (dosya düzeyi) :6 [write-or-literal]

## Default değeri

Kod tablosu default: `MODULE_CONTRACT_ASSIGNMENTS[itemKey].profile` → `MODULE_CONTRACT_PROFILES`. Assignment yoksa `hasExplicitModuleContract` false.

## Override zinciri

Kod tablosu. Runtime override yok.

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **46** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `upright`, `profile`, `coat-rack`, `kettle`, `mini-fridge`, `plastic-trash-bin`, `door`, `base`, `counter`, `flat-panel`, `base-wall`, `separator`, `shelf`, `showcase-2`, `showcase-3`
- itemKey: `upright_346_5`, `profile_41_5`, `profile_91`, `profile_140_5`, `profile_190`, `COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`, `door_100`, `BASE_100`, `BASE_150`, `BASE_200`, `desk_banko_100`, `desk_banko_150`, `desk_banko_200`, `desk_banko_100_L`, `desk_banko_150_L`, `desk_banko_200_L`, `wall_50`, `wall_100`, `wall_150`, `wall_200`, `wall_200_short_up_2`, `wall_150_short_up_2`, `wall_100_short_up_2`, `wall_50_short_up_2`, `wall_200_short_up_1`, `wall_150_short_up_1`, `wall_100_short_up_1`, `wall_50_short_up_1`, `wall_base_100`, `wall_base_150`, `wall_base_200`, `wall_separator_50`, `wall_separator_100`, `wall_separator_50_sarmasik`, `wall_separator_100_sarmasik`, `wall_shelf_2_100`, `wall_shelf_2_150`, `wall_shelf_2_200`, `wall_shelf_3_100`, `wall_shelf_3_150`, `wall_shelf_3_200`, `wall_showcase_100_2`, `wall_showcase_100_3`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **46**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **0**

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod tablosu. Persist yok (her load'da type/itemKey ile yeniden çözülür).

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

yok.

## Validation

validation yok (tablo/audit).

## Bağımlılıklar

- kök katman: `contract`

## Değiştirmenin yan etkileri

Kod tablosu/audit sütunu: runtime item instance'ı doğrudan yazılmaz.

## CRUD sınıflandırması

SYSTEM_INTERNAL

## CRUD gerekçesi

`MODULE_CONTRACT_ASSIGNMENTS` / `MODULE_CONTRACT_PROFILES` dondurulmuş politika tablosu. Kullanıcı değiştirmez.

## Kanıt

- src dosya sayısı (unique): **1**
- src dosyaları: `src/moduleContracts.js`

- `src/moduleContracts.js` (dosya düzeyi) :6 [write-or-literal]

- indeks: 82 / 188
