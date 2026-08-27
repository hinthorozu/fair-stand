# Fair Stand — Sistem Modül Kataloğu ve BOM Referansı

Bu doküman, ROG branch'inde bulunan mevcut sistem koduna göre hazırlanmıştır. Kaynaklar:

- `src/catalog.js` — katalog modülleri, tipler ve nominal ölçüler
- `src/designState.js` — modül state yapıları ve düzenlenebilir yüzeyler
- `src/moduleRecipes.js` — modül BOM / üretim reçeteleri
- `src/productionParts.js` — üretim parçaları ve gerçek parça ölçüleri
- `src/modulePlacement.js` — connect / snap / collision davranışı

> Not: Katalog ID'si (`wall_100`, `desk_banko_150` vb.) sabit sistem kimliğidir. Sahneye eklenen her modül ayrıca `module-<uuid>` formatında dinamik bir instance ID alır.

## Genel Durum

Sistemde toplam **28 katalog modülü** vardır.

- **24 modülün BOM / üretim reçetesi mevcut**
- **4 mobilya / aksesuar modülünün BOM reçetesi henüz yok**

---

# 1. Düz Panel / Duvar Modülleri

## `wall_50`

- Ekrandaki ad: **Düz Panel 50**
- Type: `flat-panel`
- Nominal genişlik: **50 cm**
- Recipe ID: `wall-straight-50`
- State: 7 ayrı düzenlenebilir panel yüzeyi

### BOM

- 2 × Profil 41,5 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 48,5 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat

### İç köşe varyantı

- Ana panel: **42,5 × 47 cm**

---

## `wall_100`

- Ekrandaki ad: **Düz Panel 100**
- Type: `flat-panel`
- Nominal genişlik: **100 cm**
- Recipe ID: `wall-straight-100`
- State: 7 ayrı düzenlenebilir panel yüzeyi

### BOM

- 2 × Profil 91 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 98 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat

### İç köşe varyantı

- Ana panel: **92 × 47 cm**

---

## `wall_150`

- Ekrandaki ad: **Düz Panel 150**
- Type: `flat-panel`
- Nominal genişlik: **150 cm**
- Recipe ID: `wall-straight-150`
- State: 7 ayrı düzenlenebilir panel yüzeyi

### BOM

- 2 × Profil 140,5 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 147,5 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat

### İç köşe varyantı

- Ana panel: **142,5 × 47 cm**

---

## `wall_200`

- Ekrandaki ad: **Düz Panel 200**
- Type: `flat-panel`
- Nominal genişlik: **200 cm**
- Recipe ID: `wall-straight-200`
- State: 7 ayrı düzenlenebilir panel yüzeyi

### BOM

- 2 × Profil 190 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 197 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat

### İç köşe varyantı

- Ana panel: **192 × 47 cm**

---

# 2. Raflı Duvar Modülleri

Katalogdaki raf modülleri `type: shelf` kullanır. Duvar tarafı normal panel sistemi gibi davranır. Her modülde 7 düzenlenebilir duvar paneli vardır.

Sistem sabitleri:

- Raf projeksiyonu: **38 cm**
- Raf kalınlığı: **3 cm**

## `wall_shelf_2_100`

- Ekrandaki ad: **Raf 100 · 2 Raf**
- Type: `shelf`
- Nominal genişlik: **100 cm**
- Raf adedi: **2**
- Recipe ID: `shelf-wall-100-2`

### BOM

- 2 × Profil 91 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 98 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat
- 2 × Raf 100 cm
- 4 × Raf Ayağı

### İç köşe varyantı

- Ana panel: **92 × 47 cm**

---

## `wall_shelf_3_100`

- Ekrandaki ad: **Raf 100 · 3 Raf**
- Type: `shelf`
- Nominal genişlik: **100 cm**
- Raf adedi: **3**
- Recipe ID: `shelf-wall-100-3`

### BOM

- 2 × Profil 91 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 98 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat
- 3 × Raf 100 cm
- 6 × Raf Ayağı

### İç köşe varyantı

- Ana panel: **92 × 47 cm**

---

## `wall_shelf_2_150`

- Ekrandaki ad: **Raf 150 · 2 Raf**
- Type: `shelf`
- Nominal genişlik: **150 cm**
- Raf adedi: **2**
- Recipe ID: `shelf-wall-150-2`

### BOM

- 2 × Profil 140,5 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 147,5 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat
- 2 × Raf 150 cm
- 4 × Raf Ayağı

### İç köşe varyantı

- Ana panel: **142,5 × 47 cm**

---

## `wall_shelf_3_150`

- Ekrandaki ad: **Raf 150 · 3 Raf**
- Type: `shelf`
- Nominal genişlik: **150 cm**
- Raf adedi: **3**
- Recipe ID: `shelf-wall-150-3`

### BOM

- 2 × Profil 140,5 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 147,5 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat
- 3 × Raf 150 cm
- 6 × Raf Ayağı

### İç köşe varyantı

- Ana panel: **142,5 × 47 cm**

---

## `wall_shelf_2_200`

- Ekrandaki ad: **Raf 200 · 2 Raf**
- Type: `shelf`
- Nominal genişlik: **200 cm**
- Raf adedi: **2**
- Recipe ID: `shelf-wall-200-2`

### BOM

- 2 × Profil 190 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 197 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat
- 2 × Raf 200 cm
- 6 × Raf Ayağı

### İç köşe varyantı

- Ana panel: **192 × 47 cm**

---

## `wall_shelf_3_200`

- Ekrandaki ad: **Raf 200 · 3 Raf**
- Type: `shelf`
- Nominal genişlik: **200 cm**
- Raf adedi: **3**
- Recipe ID: `shelf-wall-200-3`

### BOM

- 2 × Profil 190 cm
- 2 × Dikme 346,5 cm
- 7 × Panel 197 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat
- 3 × Raf 200 cm
- 9 × Raf Ayağı

### İç köşe varyantı

- Ana panel: **192 × 47 cm**

---

# 3. Vitrin Modülleri

Her vitrin modülü state tarafında 7 düzenlenebilir Maxima panel slotu taşır.

## `wall_showcase_100_2`

- Ekrandaki ad: **2 Gözlü Vitrin 100**
- Type: `showcase-2`
- Nominal genişlik: **100 cm**
- Recipe ID: `showcase-2-100`

### BOM

- 4 × Profil 91 cm
- 2 × Dikme 346,5 cm
- 5 × Panel 98 × 47 cm
- 4 × Başlangıç Aparatı
- 9 × Tekli Aparat
- 1 × 2 Gözlü Vitrin 100 cm
- 2 × Cam Raf

### İç köşe varyantı

- Ana panel: **92 × 47 cm**

---

## `wall_showcase_100_3`

- Ekrandaki ad: **3 Gözlü Vitrin 100**
- Type: `showcase-3`
- Nominal genişlik: **100 cm**
- Recipe ID: `showcase-3-100`

### BOM

- 4 × Profil 91 cm
- 2 × Dikme 346,5 cm
- 4 × Panel 98 × 47 cm
- 4 × Başlangıç Aparatı
- 7 × Tekli Aparat
- 1 × 3 Gözlü Vitrin 100 cm
- 3 × Cam Raf

### İç köşe varyantı

- Ana panel: **92 × 47 cm**

---

# 4. Depo Kapısı

## `DOOR_100`

- Ekrandaki ad: **Depo Kapısı 100**
- Type: `door`
- Nominal genişlik: **100 cm**
- Recipe ID: `door-100`
- State:
  - üstte 3 düzenlenebilir panel yüzeyi
  - altta bağımsız düzenlenebilir kapı yüzeyi

### BOM

- 1 × Profil 91 cm
- 2 × Dikme 346,5 cm
- 3 × Panel 98 × 47 cm
- 2 × Başlangıç Aparatı
- 5 × Tekli Aparat
- 1 × Kapı 100 cm

### İç köşe varyantı

- Ana panel: **92 × 47 cm**

---

# 5. Separatör Modülleri

Separatör state'i tek bir `surface` taşır. Renk düzenlenebilir; normal panel gibi image state'i yoktur.

## `wall_separator_50`

- Ekrandaki ad: **Separatör 50**
- Type: `separator`
- Nominal genişlik: **50 cm**
- Recipe ID: `separator-50`

### BOM

- 2 × Profil 41,5 cm
- 2 × Dikme 346,5 cm
- 1 × Separatör Paneli 48,5 × 47 cm
- 3 × Separatör Paneli 98 × 47 cm
- 2 × Başlangıç Aparatı
- 7 × Tekli Aparat

---

## `wall_separator_100`

- Ekrandaki ad: **Separatör 100**
- Type: `separator`
- Nominal genişlik: **100 cm**
- Recipe ID: `separator-100`

### BOM

- 2 × Profil 91 cm
- 2 × Dikme 346,5 cm
- 7 × Separatör Paneli 98 × 47 cm
- 2 × Başlangıç Aparatı
- 13 × Tekli Aparat

---

# 6. Banko Modülleri

Bankolar fiziksel footprint kullanan zemin modülleridir.

State tarafında 6 ayrı düzenlenebilir yüz vardır:

- `frontLower`
- `frontUpper`
- `leftLower`
- `leftUpper`
- `rightLower`
- `rightUpper`

## `desk_banko_100`

- Ekrandaki ad: **Banko 100**
- Type: `counter`
- Ölçü: **100 × 50 × 100 cm**
- Recipe ID: `counter-100`

### BOM

- 3 × Profil 91 cm
- 4 × Profil 41,5 cm
- 4 × Dikme 99 cm
- 2 × Panel 98 × 47 cm
- 4 × Panel 48,5 × 47 cm
- 6 × Başlangıç Aparatı
- 12 × Tekli Aparat
- 1 × Banko Üstü 110 × 60 cm

---

## `desk_banko_150`

- Ekrandaki ad: **Banko 150**
- Type: `counter`
- Ölçü: **150 × 50 × 100 cm**
- Recipe ID: `counter-150`

### BOM

- 3 × Profil 140,5 cm
- 4 × Profil 41,5 cm
- 4 × Dikme 99 cm
- 2 × Panel 147,5 × 47 cm
- 4 × Panel 48,5 × 47 cm
- 6 × Başlangıç Aparatı
- 12 × Tekli Aparat
- 1 × Banko Üstü 160 × 60 cm

---

## `desk_banko_200`

- Ekrandaki ad: **Banko 200**
- Type: `counter`
- Ölçü: **200 × 50 × 100 cm**
- Recipe ID: `counter-200`

### BOM

- 3 × Profil 190 cm
- 4 × Profil 41,5 cm
- 4 × Dikme 99 cm
- 2 × Panel 197 × 47 cm
- 4 × Panel 48,5 × 47 cm
- 6 × Başlangıç Aparatı
- 12 × Tekli Aparat
- 1 × Banko Üstü 210 × 60 cm

---

# 7. Baza Modülleri

Bazalar fiziksel footprint kullanan zemin modülleridir.

State tarafında 3 ayrı düzenlenebilir yüz vardır:

- `front`
- `left`
- `right`

## `BASE_100`

- Ekrandaki ad: **Baza 100**
- Type: `base`
- Ölçü: **100 × 50 × 50 cm**
- Recipe ID: `base-100`

### BOM

- 4 × Profil 91 cm
- 4 × Profil 41,5 cm
- 4 × Dikme 49,5 cm
- 2 × Panel 98 × 47 cm
- 2 × Panel 48,5 × 47 cm
- 8 × Başlangıç Aparatı
- 8 × Tekli Aparat
- 1 × Baza Üstü 107 × 50 cm

---

## `BASE_150`

- Ekrandaki ad: **Baza 150**
- Type: `base`
- Ölçü: **150 × 50 × 50 cm**
- Recipe ID: `base-150`

### BOM

- 4 × Profil 140,5 cm
- 4 × Profil 41,5 cm
- 4 × Dikme 49,5 cm
- 2 × Panel 147,5 × 47 cm
- 2 × Panel 48,5 × 47 cm
- 8 × Başlangıç Aparatı
- 8 × Tekli Aparat
- 1 × Baza Üstü 157 × 50 cm

---

## `BASE_200`

- Ekrandaki ad: **Baza 200**
- Type: `base`
- Ölçü: **200 × 50 × 50 cm**
- Recipe ID: `base-200`

### BOM

- 4 × Profil 190 cm
- 4 × Profil 41,5 cm
- 4 × Dikme 49,5 cm
- 2 × Panel 197 × 47 cm
- 2 × Panel 48,5 × 47 cm
- 8 × Başlangıç Aparatı
- 8 × Tekli Aparat
- 1 × Baza Üstü 206 × 50 cm

---

# 8. Panel Bazalı Modüller

Panel Bazalı modüller üretim ve 3D state açısından 50 cm baza derinliği taşır; fakat connect / snap / collision davranışında normal Maxima duvar hattı gibi değerlendirilir.

State tarafında:

- 7 duvar panel strip'i
- `front`
- `left`
- `right`

olmak üzere duvar + baza yüzeyleri birlikte bulunur.

## `wall_base_100`

- Ekrandaki ad: **Panel Bazalı 100**
- Type: `base-wall`
- Katalog ölçüsü: **100 × 50 × 350 cm**
- Recipe ID: `base-wall-100`

### BOM

- 4 × Profil 91 cm
- 2 × Dikme 346,5 cm
- 4 × Profil 41,5 cm
- 2 × Dikme 49,5 cm
- 7 × Panel 98 × 47 cm
- 2 × Panel 48,5 × 47 cm
- 6 × Başlangıç Aparatı
- 17 × Tekli Aparat
- 1 × Baza Üstü 107 × 50 cm

### İç köşe varyantı

- Ana panel: **92 × 47 cm**

---

## `wall_base_150`

- Ekrandaki ad: **Panel Bazalı 150**
- Type: `base-wall`
- Katalog ölçüsü: **150 × 50 × 350 cm**
- Recipe ID: `base-wall-150`

### BOM

- 4 × Profil 140,5 cm
- 2 × Dikme 346,5 cm
- 4 × Profil 41,5 cm
- 2 × Dikme 49,5 cm
- 7 × Panel 147,5 × 47 cm
- 2 × Panel 48,5 × 47 cm
- 6 × Başlangıç Aparatı
- 17 × Tekli Aparat
- 1 × Baza Üstü 157 × 50 cm

### İç köşe varyantı

- Ana panel: **142,5 × 47 cm**

---

## `wall_base_200`

- Ekrandaki ad: **Panel Bazalı 200**
- Type: `base-wall`
- Katalog ölçüsü: **200 × 50 × 350 cm**
- Recipe ID: `base-wall-200`

### BOM

- 4 × Profil 190 cm
- 2 × Dikme 346,5 cm
- 4 × Profil 41,5 cm
- 2 × Dikme 49,5 cm
- 7 × Panel 197 × 47 cm
- 2 × Panel 48,5 × 47 cm
- 6 × Başlangıç Aparatı
- 17 × Tekli Aparat
- 1 × Baza Üstü 206 × 50 cm

### İç köşe varyantı

- Ana panel: **192 × 47 cm**

---

# 9. Mobilya ve Aksesuar Modülleri

Bu modüller katalogda ve state sisteminde vardır ancak `moduleRecipes.js` içinde BOM reçeteleri henüz tanımlı değildir.

## `furniture_sofa_set_classic`

- Ekrandaki ad: **Koltuk Takımı**
- Type: `sofa-set`
- Ölçü: **150 × 150 × 80 cm**
- State: tek renk yüzeyi
- BOM: **Yok**

Ek sabitler:

- Loveseat genişliği: 150 cm
- Sandalye genişliği: 65 cm
- Masa çapı: 60 cm

---

## `furniture_table_chair_set_minyon`

- Ekrandaki ad: **Masa Sandalye Takımı**
- Type: `table-chair-set`
- Ölçü: **120 × 120 × 90 cm**
- State: tek renk yüzeyi
- BOM: **Yok**

Ek sabitler:

- Sandalye: 46 × 46 cm
- Masa çapı: 75 cm
- Masa yüksekliği: 74 cm

---

## `furniture_bar_stool_classic`

- Ekrandaki ad: **Bar Taburesi**
- Type: `bar-stool`
- Ölçü: **50 × 50 × 80 cm**
- State: tek renk yüzeyi
- BOM: **Yok**

---

## `LED_FLOODLIGHT`

- Ekrandaki ad: **LED Projektör**
- Type: `led-floodlight`
- Ölçü: **50 × 20 × 35 cm**
- Montaj yüksekliği: **350 cm**
- State: sabit siyah gövde yüzeyi
- BOM: **Yok**

---

# 10. Üretim Parça Kataloğundaki Aparatlar

Sistemde aşağıdaki bağlantı parçaları ayrı üretim parçası ID'leriyle tanımlıdır:

## `connector_start`

- Ad: **Başlangıç Aparatı**
- Type: `connector`
- Connector type: `start`

## `connector_single`

- Ad: **Tekli Aparat**
- Type: `connector`
- Connector type: `single`

## `connector_double`

- Ad: **Çiftli Aparat**
- Type: `connector`
- Connector type: `double`

## `connector_corner`

- Ad: **Köşe Aparatı**
- Type: `connector`
- Connector type: `corner`

### Mevcut durum

`connector_double` ve `connector_corner` üretim parça kataloğunda tanımlıdır fakat mevcut modül reçetelerinin hiçbirinde henüz kullanılmamaktadır.

Şu an kayıtlı BOM reçeteleri ağırlıklı olarak:

- Başlangıç Aparatı
- Tekli Aparat

üzerinden tanımlanmıştır.

---

# 11. Üretim Parça ID Referansı

## Dikmeler

- `upright_346_5` → Dikme 346,5 cm
- `upright_99` → Dikme 99 cm
- `upright_49_5` → Dikme 49,5 cm

## Profiller

- `profile_41_5` → Profil 41,5 cm
- `profile_91` → Profil 91 cm
- `profile_140_5` → Profil 140,5 cm
- `profile_190` → Profil 190 cm

## Düz paneller

- `panel_48_5` → Panel 48,5 × 47 cm
- `panel_98` → Panel 98 × 47 cm
- `panel_147_5` → Panel 147,5 × 47 cm
- `panel_197` → Panel 197 × 47 cm

## İç köşe panelleri

- `panel_corner_42_5` → İç Köşe Paneli 42,5 × 47 cm
- `panel_corner_92` → İç Köşe Paneli 92 × 47 cm
- `panel_corner_142_5` → İç Köşe Paneli 142,5 × 47 cm
- `panel_corner_192` → İç Köşe Paneli 192 × 47 cm

## Separatör panelleri

- `separator_panel_48_5` → Separatör Paneli 48,5 × 47 cm
- `separator_panel_98` → Separatör Paneli 98 × 47 cm

## Kapı

- `door_100` → Kapı 100 cm

## Raflar

- `shelf_100` → Raf 100 cm
- `shelf_150` → Raf 150 cm
- `shelf_200` → Raf 200 cm
- `shelf_leg` → Raf Ayağı

## Vitrin parçaları

- `showcase_2_100` → 2 Gözlü Vitrin 100 cm
- `showcase_3_100` → 3 Gözlü Vitrin 100 cm
- `glass_shelf` → Cam Raf

## Banko üstleri

- `counter_top_110_60` → Banko Üstü 110 × 60 cm
- `counter_top_160_60` → Banko Üstü 160 × 60 cm
- `counter_top_210_60` → Banko Üstü 210 × 60 cm

## Baza üstleri

- `base_top_107_50` → Baza Üstü 107 × 50 cm
- `base_top_157_50` → Baza Üstü 157 × 50 cm
- `base_top_206_50` → Baza Üstü 206 × 50 cm

---

# 12. Özet Tablo

| Grup | Modül Sayısı | BOM Durumu |
|---|---:|---|
| Düz Panel | 4 | Var |
| Raflı Duvar | 6 | Var |
| Vitrin | 2 | Var |
| Depo Kapısı | 1 | Var |
| Separatör | 2 | Var |
| Banko | 3 | Var |
| Baza | 3 | Var |
| Panel Bazalı | 3 | Var |
| Mobilya / Aksesuar | 4 | Yok |
| **Toplam** | **28** | **24 BOM var / 4 BOM yok** |

---

# 13. Önemli Sistem Ayrımı

Katalog ölçüsü ile üretim ölçüsü aynı kavram değildir.

Örnek:

- `wall_100` katalogda nominal olarak **100 cm** modüldür.
- Gerçek üretim parçaları ise:
  - Profil 91 cm
  - Panel 98 × 47 cm
  - Dikme 346,5 cm
  - ilgili aparatlar

şeklinde BOM reçetesinden gelir.

Bu nedenle katalog ölçüsü, sahne / yerleşim / kullanıcı arayüzü için nominal modül ölçüsüdür; gerçek üretim ölçüleri `moduleRecipes.js` ve `productionParts.js` üzerinden çözülür.
