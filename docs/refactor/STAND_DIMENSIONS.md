# Stand Dimensions

Fair Stand stand zarfının canonical sözleşmesi. Item şeması ve Catalog projeksiyonu değildir.

- Item: `docs/refactor/ITEMS.md`
- Catalog: `docs/refactor/CATALOG.md`
- PostgreSQL envanter: `docs/refactor/DATABASE.md`
- Kod: `src/standDimensions.js`
- Tablo: `fair_stand_dimensions`

---

## Ne

Maxima duvar iskeleti. Tek satır, `id = 1`. Item kutusu değil; Catalog kartı değil.

Kaynak: PostgreSQL `fair_stand_dimensions` → catalog bootstrap `standDimensions` → `initializeStandDimensions` → `STAND_DIMENSIONS` / `getStandDimensions()`.

`initializeStandDimensions` API payload’ını belleğe yazar. Configurator açılınca bir kez çalışır. Çağrılmazsa zarf okuması fail-fast’tir.

---

## Alanlar (metre)

| Alan | DB kolon | Ne işe yarar |
|---|---|---|
| `height` | `height_m` | Duvar tavanı. Projektör kotu. Overlay Y 0…height. Item yüksekliği yoksa çarpışma tavanı. |
| `depth` | `depth_m` | Duvar kalınlığı. Omurga çarpışması (`wall-backbone`). TV/raf ön yüzü `depth/2`. |
| `stripCount` | `strip_count` | Yatay şerit sayısı. Tam boy panel yüzey sayısı. |
| `stripHeight` | `strip_height_m` | Bir şerit boyu. Seam’ler stripHeight, 2×stripHeight, … (0 ve height seam değil). |
| `frameWidth` | `frame_width_m` | Dikey profil görsel kesiti. |
| `frameDepth` | `frame_depth_m` | Profil derinlik kutusu / yatay ray kalınlığı. |

Kural: `height = stripCount × stripHeight`.

Seed (şu an): 3.5 / 0.1 / 7 / 0.5 / 0.055 / 0.1 → duvar 350 cm, 7 × 50 cm.

350 catalog max ürün yüksekliği değildir. Koltuk/banko/TV kendi Item `heightCm` değerini kullanır.

---

## Bu dosyada olmayanlar

- Item `dimensions` / `sceneDimensions` — `ITEMS.md`
- Catalog görünürlük, kategori, kart — `CATALOG.md`
- `MODULE_WIDTHS_CM` (50/100/150/200) — hâlâ `src/standDimensions.js` kod sabiti; bu tabloda yok
- collision / snap politikası — `moduleBehavior.js` (henüz DB değil)
