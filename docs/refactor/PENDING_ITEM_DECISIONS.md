# Fair Stand — Ertelenmiş kararlar ve backlog

Henüz çözülmemiş veya bilinçli ertelenmiş **Item property**, **stand zarfı / DB**, **runtime davranış** ve **pose/tavan–şerit** işlerinin tek takip listesi.

- Kaynak: ürün kararı + `DATABASE.md`, `ITEMS.md`, `SCENE_POSE.md`, mevcut kod. Tahmin yazılmaz.
- Yeni madde buraya eklenir; gizli paralel liste yok.
- **Yasak (genel):** Bu dosyada karar değişmeden veya kaldırma sırası dışında ilgili alan/tablo/kolon silinmez, taşınmaz, yeniden adlandırılmaz.
- **Implementasyon izni:** Bu dosya + ilgili konu belgesi (`SCENE_POSE.md` pose/snap hedefi); tek başına yeterli değildir.
- **Kapalı maddeler** tekrar listelenmez — yalnız `REFACTOR.md` + § F özeti.

**İlgili belgeler:** `FAIR_STAND_DB_KULLANIM_KILAVUZU.md` (CRM kullanım), `SCENE_POSE.md` (duruş/snap hedef), `DATABASE.md` (tablo envanteri), `ITEMS.md` (onaylı şema + runtime field kuyruğu), `STAND_DIMENSIONS.md` (zarf), `ITEM_FIRST_ROADMAP.md` (item-first checklist), `README.md` (dizin).

---

## A. Tavan / şerit kaldırma sırası (güvenli)

Her item kendi ölçü/BOM’unu taşır; stand tavanı yalnız **max zarf** (örn. 500 cm — clamp/kamera). Global şerit ızgarası ve tavan türevli ürün yüksekliği kalkar.

`SCENE_POSE.md` hedefi ile aynı; **operasyon sırası yalnız burada** canonical’dır.

| Adım | İş | Not |
|---:|---|---|
| 1 | Her item: eksiksiz `scene_dimensions` + yüzey/BOM layout | Örn. `wall_200_250` = 5 panel; gizli 350 / `upright_346_5` / ×7 sözleşmesi biter — **sıradaki kod adımı** |
| 2 | `designState.strips[]` → item surface slot’ları | Eski proje **migration** zorunlu |
| 3 | Raf snap → host item anchor | `snap_target_item_type` / `snap_anchor`; global seam yok |
| 4 | `fair_stand_item_strip_occupancy` + CRM | Aşağı § B.3–B.4 |
| 5 | `fair_stand_dimensions.strip_count` / `strip_height_m` + CHECK | Aşağı § C.1 |
| 6 | Tavan yalnız max zarf | Ürün mesh/collision **tavan fallback okumaz** |

**Kalabilir (min):** bağımsız `height_m` (max), `depth_m` / `frame_*` (ileride tamamen item/zarf sadeleşmesine girebilir).

**Gitmeli:** şerit sayısı/pitch, seam grid, occupancy, “yükseklik yoksa tavan kullan”, 7×50 help.

**Pose/snap (ayrı hat):** `SCENE_POSE.md` § *Uygulama sırası 1–6* — default Z, snap kolonları vb. kısmen kodda; **bu tablo onu tamamlamaz**, şerit/tavan iskeletini söker.

---

## B. Item property kararları

### B.1. `eyeCount`

- **Durum:** SİLİNECEK
- **Karar:** Yerine gerçek glass shelf yerleşim bilgisi (`bodyItems.glassShelfItemKey` vb. ile uyumlu model).
- **Kaynak:** `ITEMS.md` kuyruk (2 vitrin).
- **Yasak:** Yeni dolaylı göz sayacı üretilmez.

### B.2. `dimensions.wallGapCm` (`wall_gap_cm`)

- **Durum:** KORUNACAK
- **Karar:** İleride uygun property grubuna taşınır; `illuminated-foam` tüketicisi korunur.
- **Kaynak:** `ITEMS.md` kuyruk; `DATABASE.md` `fair_stand_item_dimensions`.
- **Yasak:** Madde kapanmadan silinmez.

### B.3. `mountHeightCm` / `dimensions.mount_height_cm` vs `default_z_cm`

- **Durum:** ARAŞTIRILACAK
- **Karar:** Producer/consumer zinciri netleşmeden tek alan seçilmez. Drop/snap hedefi `default_z_cm` (`ITEMS.md` onaylı); seed’de floodlight 350 her iki yerde de durabilir.
- **Kaynak:** `DATABASE.md` (`mount_height_cm` legacy); `ITEMS.md` `defaultZCm`.
- **Yasak:** Biri diğerine alias yazılmadan biri silinmez.

### B.4. `stripOccupancy.align`

- **Durum:** KALDIRILACAK (§ A adım 4)
- **Karar:** Tablo kalkınca alan yok; short-up kotu item `default_z_cm` + gövde height.
- **Kaynak:** `DATABASE.md` `fair_stand_item_strip_occupancy` (CHECK yalnız `top`).
- **Yasak:** § A adım 1–3 bitmeden tablo/CRM silinmez.

### B.5. `stripOccupancy.stripCount`

- **Durum:** KALDIRILACAK (§ A adım 4–5)
- **Karar:** Panel adedi ürün BOM/layout’ta; stand `strip_count` (7) ile karışmaz — o da § C.1 ile gider.
- **Kaynak:** `DATABASE.md` (8 short-up satırı).
- **Yasak:** § A adım 1–3 bitmeden silinmez.

### B.6. Panel arası boşluk (runtime vs DB)

- **Durum:** KAPANDI — `fair_stand_dimensions.panel_rail_height_cm` (seed 0.4); bootstrap → `STAND_DIMENSIONS.panelRailHeight`; CRM settings formu
- **Karar:** Tek standart cm (tavanla çarpılmaz). `wallGapCm` (B.2) ayrı ürün alanı.
- **Kaynak:** `STAND_DIMENSIONS.md`; migration `0034_stand_panel_rail_height`

### B.7. Duvar / vitrin seed SKU’ları (gizli 350)

- **Durum:** BACKLOG (§ A adım 1)
- **Karar:** `wall_*`, vitrin, kapı vb. ayrı yükseklik SKU’ları (`wall_200_100`, `wall_200_250`, …); banko modeli (kendi 100 cm) referans.
- **Kaynak:** `SCENE_POSE.md` hedef; mevcut seed `scene height=350`, `upright_346_5`, panel ×7.
- **Yasak:** Tek `wall_200` ile tavan değişimine bağlı “otomatik boy”.

### B.8. `variant` (short-up-1 / short-up-2)

- **Durum:** KORUNACAK (şimdilik)
- **Karar:** Occupancy kalkınca yalnız kimlik/seed ayrımı; şerit sayısı anlamı taşımaz.
- **Kaynak:** `ITEMS.md` kuyruk (8 Item).

### B.9. Item snap — item_type + rule_type + rule (P0 kilit)

- **Durum:** UYGULAMA — `fair_stand_item_type` + kural tabloları; item `item_type` FK; motor rule id
- **Ürün kuralı:** CRM’de item type / kural tipi / kural CRUD; item’da Type (key) + requires|provides rule
- **Kimlik:** kataloglarda `key` (unique); ad→slug + elle düzeltme
- **Geometri:** yalnız face / edge enum (CRM select + hint); **mount_mode kaldırıldı**
- **Tip bağı:** kural ↔ tip(ler) M:N (`fair_stand_rule_item_type`); aile tablosu kaldırıldı (`0029`)
- **Hedef:** `SCENE_POSE.md` Snap; `DATABASE.md` tip/kural
- **Raf:** kural `shelf-rail` face=front edge=top → seam / band geometrisi
- **Yasak:** Type→kural runtime map; item üzerinde free-text capability string kolonları

### B.7. Parent BOM ↔ leaf ölçü uyumu (uyarı; auto-fix yok)

- **Durum:** KARAR — uygulama ertelendi (şimdi kod yok)
- **Örnek kanon:** `wall_200` (zarf W=200 / H≈350) + leaf `panel_197` (197×47) BOM `×7`
- **Karar (admin / soft-warning):**
  1. Leaf veya parent ölçü / BOM `quantity` değişince **uyarı** göster; kaydı engellemek zorunda değil (bilerek override serbest).
  2. Yatay örnek: `panel_197.width` 220 olurken parent `wall_200.width` 200 → taşma uyarısı; etkilenen parent’lar listelenir.
  3. Dikey örnek: `quantity × leaf.height` (ilk dilim; boşluk payı sonra netleşir) `> parent.sceneHeight` → taşma uyarısı (`7×47` sığar, `8×47` sığmaz).
  4. **Auto-fix yok:** quantity / leaf / parent ölçü otomatik yeniden yazılmaz.
- **Sahne (ayrı borç):** Sessiz clamp kaldırıldı (2026-09-24): `resolveFlatPanelStripCount` = BOM qty; height = qty × pitch. Soft-warning admin (§ madde) hâlâ kod yok.
- **Kaynak:** `ITEM_FIRST_ROADMAP.md` P1; `wall_200` seed; `items.js` `resolveFlatPanelStripCount`
- **Yasak:** Uyarıyı “geçsin diye” kapatmak; clamp’i ürün özelliği sanmak; auto-recalc quantity

### B.10. `is_render` = çizilir

- **Durum:** KARAR — sahne child mesh henüz yok
- **Karar (2026-09-25):** `is_render=true` ise sistem o SKU’yu çizer. Katalog yalnız sürükle-bırak. Reçetede kullanılan parça `is_render=false` bırakılmaz. `connector`, vitrin gövde, cam raf ve video duvar paneli de true. Zemin ve kullanılmayan `shelf_leg` false kalır. Bağlayıcının kendi modül fabrikası yoktur.
- **Bugün:** Reçeteli modül, gömülü `is_render` parçayı (`panel`, `separator-panel`, `base-top`, `counter-top`) yüzeye bağlar. Katalog bu kapıya girmez. `connector_*` false, mesh yok.
- **Kaynak:** `ITEMS.md` § isRender; `FAIR_STAND_DB_KULLANIM_KILAVUZU.md` § `is_render`
- **Yasak:** Çizimi katalog kartına bağlamak; `is_render=true` child’ı atlayıp kutu basmak; bir item ailesini kalıcı “çizilmez” ilan etmek

---
## C. Stand zarfı ve DB (Item tablosu değil)

### C.1. `fair_stand_dimensions.strip_count` / `strip_height_m` / height CHECK

- **Durum:** KALDIRILACAK (§ A adım 5)
- **Karar:** Zarf yalnız max `height_m` (+ depth/frame). Ürün panel ızgarası item layout’ta.
- **Kaynak:** `DATABASE.md` § `fair_stand_dimensions`; CRM ayar formu.
- **Yasak:** CHECK kalkmadan seed’de tutarsız height bırakılmaz.

### C.2. Stand tavan fallback (collision / ghost / mesh)

- **Durum:** KALDIRILACAK (§ A adım 6)
- **Karar:** Item’da height yoksa tavan kullanımı biter; eksik ölçü seed/validation hatası.
- **Kaynak:** `SCENE_POSE.md` STAND_DIMENSIONS hedef; `STAND_DIMENSIONS.md`.

### C.3. `TYPE_BEHAVIORS` (placement davranışı)

- **Durum:** KAPANDI — kesit 1+2+3 + overlap FK; JS map yok; motor DB-only
- **Operatör kılavuzu:** `FAIR_STAND_DB_KULLANIM_KILAVUZU.md` (§ tip vs snap)
- **Migration arşivi:** `TYPE_BEHAVIORS_DB_ROADMAP.md`
- **Karar (analiz 2026-09-24):** Snap dilimi şablon. Davranış paketi **`fair_stand_item_type` kolonlarına**. Item override / snap çoklu requires-provides ayrı epic. Export etkilenmez.
- **Kaynak:** `DATABASE.md`; `moduleBehavior.js`; `SCENE_POSE.md` snap şablonu
- **Yasak:** Tip davranışını JS map’e geri almak; enum rename; placement’ı proje ZIP’e gömmek

### C.4. `overlaySnap = 'panel-seam'`

- **Durum:** KAPANDI — `usesPanelSeamOverlaySnap` ← requires `shelf-rail` veya face front/back + edge top (mount_mode yok)
- **Karar:** Raf host + seam geometrisi; type map `overlaySnap` yok
- **Kaynak:** `SCENE_POSE.md` § Snap
- **Kalıntı:** yok — `scene3d` snap meta `requires: 'shelf-rail'` (2026-09-24)

### C.5. `MODULE_CONTRACT_ASSIGNMENTS` (per-itemKey JS allowlist)

- **Durum:** KAPANDI — per-SKU map silindi; `resolveModuleContract` tip + composition’tan türetir (`TYPE_CONTRACT_PROFILE` / recipe|self|decision-required)
- **Kod gerçeği:** `src/moduleContracts.js` governance-only; production import etmez
- **Karar:** Yeni SKU için JS satırı gerekmez (aynı tip). Planter istisnası: `itemKey` …`planter`… → `free-model-color`
- **Kaynak:** `ITEM_FIRST_ROADMAP.md` P2
- **Yasak:** Contract’ı runtime görsel/catalog kaynağı sanmak

---

## D. ITEMS.md runtime kuyruğu (henüz PENDING maddesi yok)

Aşağıdakiler **onaylı şemada değil**; karar verilince B veya C’ye madde açılır veya şemaya alınır. Tam liste: `ITEMS.md` § *Runtime field kuyruğu*.

| Alan / grup | Durum | Not |
|---|---|---|
| `type`, `name`, `unit` | KUYRUK | Davranış/BOM; `type` → C.3 ile ilişkili |
| `composition` / `composition.items` | KUYRUK | Recipe BOM; onaylı parça, tam şema değil |
| `paintable` | KUYRUK | 5 Item; Color mekanizması yok (§ D.1) |
| `modelFile`, `modelRotationYDeg`, `preserveModelScale`, `visualRotationYDeg` | KUYRUK | GLB Item’ları |
| `bodyItems.*` | KUYRUK | Vitrin yan/yatay/cam; B.1 ile kesişir |
| `videoWall.*` | KUYRUK | 2 Item |
| `defaultColor`, `material` | KUYRUK | Renk/malzeme şeması ayrı |

### D.1. Color / Image / Lighting / Delete mekanizmaları

- **Durum:** YAPILMADI
- **Karar:** `ITEMS.md` § *Canonical Mechanism Connections* yer tutucu; config şeması yok.
- **Yasak:** `accepts*` kolonları kaldırılmaz; UI yeteneği master’da kalır.

---

## E. Proje / envanter (Item değil)

### E.1. `fair_stand_projects.organization_id`

- **Durum:** MEVCUT — genişletme kuyruğu
- **Karar:** Core org UUID, FK yok; list/filter/path `{org}/…` çalışıyor. Proje–org bağının ürün kuralları (paylaşım, varsayılan org) ayrı karar.
- **Kaynak:** `DATABASE.md` § `fair_stand_projects` / assets.

---

## F. Kapalı / arşiv (bu dosyada açılmaz)

| Madde | Sonuç |
|---|---|
| § A eski adım 1 — ölü occupancy layout | `REFACTOR.md` 2026-09-22 occupancy |
| `nominalModuleWidthCm` / inner-corner recipe | `REFACTOR.md` 2026-09-20 |
| `composition.moduleType` / `composition.options.shape` / DB `composition_module_type` | Migration `0014`; dump + fixture temiz; bootstrap yalnız `mode` + `items` |
| SCENE_POSE pose adım 7 (ortak kutu primitive) | Örnek; sistemde yok, atlandı |

---

## G. Hızlı çapraz tablo (çakışma kontrolü)

| Konu | PENDING | SCENE_POSE | DATABASE / ITEMS |
|---|---|---|---|
| strip occupancy | B.4–B.5 KALDIRILACAK, § A.4 | Hedefte yok | Tablo + 8 satır |
| mount vs default Z | B.3 ARAŞTIRILACAK | defaultZ drop hedefi | İki kolon |
| wallGap vs panel boşluğu | B.2 koru, B.6 KAPANDI | Standart boşluk = panel_rail | wall_gap_cm ayrı |
| TYPE_BEHAVIORS | C.3 KAPANDI | — | `FAIR_STAND_DB_KULLANIM_KILAVUZU.md` + `TYPE_BEHAVIORS_DB_ROADMAP.md` |
| Contract allowlist | C.5 KAPANDI | — | tip’ten türet (`moduleContracts.js`) |
| Item snap (Profile host) | B.9 UYGULAMA | snap face/edge kuralda | rule FK; legacy `snap_target_item_type` / `snap_anchor` nullable |
| BOM ↔ leaf fit uyarı | B.7 KARAR (admin kod yok; sahne clamp kalktı) | zarf item’da | recipe `quantity` + leaf dims |
| Panel ray boşluğu | B.6 KAPANDI | — | `panel_rail_height_cm` |
| Kaldırma sırası | § A canonical | Hedef metin | strip kolonları § C.1 |

