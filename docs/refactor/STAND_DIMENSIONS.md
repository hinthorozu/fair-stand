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
| `heightCm` | `height_cm` | Duvar tavanı (cm). Overlay Y 0…heightCm. Max zarf. |
| `depthCm` | `depth_cm` | Duvar kalınlığı (cm). Omurga çarpışması (`wall-backbone`). TV/raf ön yüzü `depthCm/2`. |

Seed (varsayılan): 350 / 10 cm.

Prosedürel aluminyum **kesit** (eski `frame_*`): `upright_346_5` item W/D — bkz. `STAND_FRAME_REMOVAL.md`.

Panel bandı pitch ve slot sayısı **ürün BOM +** `src/wallPanelBand.js` (`WALL_PANEL_BAND_PITCH_CM`). Eski `strip_count` / `strip_height_cm` kolonları migration `0019_drop_stand_strip_grid` ile kaldırıldı.

Three.js sahnesi metre kullanır: `STAND_DIMENSIONS.height`, `.depth` getter’ları `/100` döner.

350 catalog max ürün yüksekliği değildir. Koltuk/banko/TV kendi Item `heightCm` değerini kullanır.

---

## Bu dosyada olmayanlar

- Item `dimensions` / `sceneDimensions` — `ITEMS.md`
- Catalog görünürlük, kategori, kart — `CATALOG.md`
- `MODULE_WIDTHS_CM` (50/100/150/200) — hâlâ `src/standDimensions.js` kod sabiti; bu tabloda yok
- collision / snap politikası — `moduleBehavior.js` (henüz DB değil)

---

## Duvar zinciri genişlik adları (Item değil)

Stand tipi + `standXCm` / `standYCm` ile L/U/back-wall kenarları birleşik zincir oluşturur. Item `dimensions.widthCm` ile karıştırılmaz.

| Alan | Nerede | Anlam |
|---|---|---|
| `edgeWidthCm` | `getContinuousWallSegments()` segment | O kenarın toplam kapasitesi (ör. sol 400, arka 500) |
| `wallWidthCm` | `composeStraightWall`, `composeAutomaticStandWall` | İstenen duvar / zincir genişliği (50 cm katları) |
| `widthCm` | Modül state / yerleşim | Modülün duvar boyunca genişliği (100/200 …) |

Kod: `src/wall.js`, `src/wallReflow.js`, `src/automaticWall.js`, `src/moduleMove.js`.
