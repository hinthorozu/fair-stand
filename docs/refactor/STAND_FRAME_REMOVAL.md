# Stand `frame_width_cm` / `frame_depth_cm` kaldırma

**Durum:** Uygulandı (deney). Stand tablosunda yalnız **tavan H** + **duvar D** kalır; prosedürel aluminyum kesiti **item** kaynağına taşındı.

## Neden

`fair_stand_dimensions` içindeki 5,5 / 10 cm, BOM’daki dikme/profil kesiti (8×8) ve düz paneldeki 4 cm sabitiyle çelişiyordu. Çerçeve kesiti **stand ayarı değil**, **leaf profile/upright ölçüsü** olmalı.

## Yeni kaynak (runtime)

- `resolveProceduralFrameCrossSectionCm(moduleState)` → parent `itemKey` recipe’sindeki **ilk `profile` veya `upright` leaf** + `resolveSceneDimensions` (kesit cm). Global sabit itemKey **yok**.
- `scene3d.js` separatör, düz panel, kapı, baza/banko rayları: `STAND_DIMENSIONS.frameWidth/Depth` **kullanmaz**.

## Lokal DB / Alembic

Migration `0022_drop_stand_frame_columns` repoda durur; **çalıştırmadan** da güncel kod okur: bootstrap yalnız `heightCm`/`depthCm` gönderir. Eski DB’de `frame_*` kolonları kalırsa PostgreSQL’de **zararsız** (model map etmez). Alembic’i erteleyebilirsiniz.

## Kaldırılanlar

| Katman | Değişiklik |
|--------|------------|
| DB | Migration `0022_drop_stand_frame_columns` → `frame_width_cm`, `frame_depth_cm` drop |
| Bootstrap | `standDimensions` yalnız `heightCm`, `depthCm` |
| Admin API + fair-crm settings | Çerçeve alanları kaldırıldı |
| `standDimensions.js` | frame getter’ları kaldırıldı |

## Patlama / dikkat listesi (regression)

- [ ] Separatör / Panel 100 / kapı / baza mesh — çerçeve **8 cm** kesit (upright DB); eskiden 5,5×10 görünürdü.
- [ ] Admin stand ayarları sayfasında çerçeve input yok.
- [ ] Eski bootstrap cache / CDN `frameWidthCm` bekleyen client → yeni API ile uyumlu.
- [ ] Item docs (`wall_separator_*`) hâlâ “catalog frameWidth 5.5” diyebilir → güncellenmeli.
- [ ] `PANEL_VERTICAL_PROFILE_WIDTH_M` (4 cm) kaldırıldı; düz panel yan profil = upright kesit W.

## Geri alma

Seed + migration downgrade veya `frame_*` kolonlarını geri ekleyip renderer’ı tekrar STAND’a bağlamak.
