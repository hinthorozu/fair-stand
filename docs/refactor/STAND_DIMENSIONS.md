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

## Alanlar (cm canonical)

| Bootstrap / admin JSON | DB kolon | Ne işe yarar |
|---|---|---|
| `heightCm` | `height_cm` | Duvar tavanı (cm). Overlay Y 0…heightCm. Item yüksekliği yoksa çarpışma tavanı. |
| `depthCm` | `depth_cm` | Duvar kalınlığı (cm). Omurga çarpışması (`wall-backbone`). TV/raf ön yüzü `depthCm/2`. |
| `stripCount` | `strip_count` | Yatay şerit sayısı. Tam boy panel yüzey sayısı. |
| `stripHeightCm` | `strip_height_cm` | Bir şerit boyu (cm). Seam’ler stripHeightCm, 2×… (0 ve tavan seam değil). |
| `frameWidthCm` | `frame_width_cm` | Dikey profil görsel kesiti (cm). |
| `frameDepthCm` | `frame_depth_cm` | Profil derinlik kutusu / yatay ray kalınlığı (cm). |

Seed (varsayılan): 350 / 10 / 7 / 50 / 5.5 / 10 cm.

Three.js sahnesi metre kullanır: `STAND_DIMENSIONS.height`, `.depth`, `.stripHeight`, … getter’ları `/100` döner.

`height_cm` **max tavan zarfı**; `strip_count × strip_height_cm` ile eşit olmak zorunda değil (admin’den ayrı düzenlenir, migration `0017_stand_height_envelope`). Uzunluk birimi migration `0018_stand_dimensions_cm`.

350 catalog max ürün yüksekliği değildir. Koltuk/banko/TV kendi Item `heightCm` değerini kullanır.

---

## Bu dosyada olmayanlar

- Item `dimensions` / `sceneDimensions` — `ITEMS.md`
- Catalog görünürlük, kategori, kart — `CATALOG.md`
- `MODULE_WIDTHS_CM` (50/100/150/200) — hâlâ `src/standDimensions.js` kod sabiti; bu tabloda yok
- collision / snap politikası — `moduleBehavior.js` (henüz DB değil)
