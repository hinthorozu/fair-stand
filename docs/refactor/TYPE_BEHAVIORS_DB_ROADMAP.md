# TYPE_BEHAVIORS → DB yol haritası (analiz; kod yok)

**Durum:** ürün/analiz (2026-09-24). Uygulama izni: bu belge + `PENDING_ITEM_DECISIONS.md` § C.3.  
**Amaç:** Snap dilimindeki gibi placement davranışını JS `TYPE_BEHAVIORS` map’inden çıkarıp DB + CRM + bootstrap’a taşımak.  
**Kapsam dışı (şimdi):** Export/import formatı değişmez; proje ZIP zaten bu alanları taşımaz.

İlgili: `SCENE_POSE.md` (snap şablonu), `PENDING_ITEM_DECISIONS.md` § C.3, `DATABASE.md`, `ITEM_FIRST_ROADMAP.md`, `src/moduleBehavior.js`.

---

## 1. Bugün ne var? (ne işe yarar)

Kaynak: eskiden `TYPE_BEHAVIORS[item.type]`; kesit 1–3 alanları artık `fair_stand_item_type` kolonları (`TYPE_BEHAVIORS` map kaldırıldı).

**Snap `fair_stand_rule` değil** — bunlar tip özelliği. Snap = iki tarafın eşleşmesi (requires/provides + face/edge).

| Alan | Ne işe yarar | Değerler |
|---|---|---|
| `placement` | Modül sahneye nasıl oturur (duvar hattı / serbest / overlay / üst) | `wall` \| `free` \| `wall-overlay` \| `top` |
| `moveSnapCm` | Sürüklerken XY ızgara adımı (cm); manyetik/top-rail değil | pratikte `50` / `10` / `20` |
| `allowSideInsert` | Yanına başka modül sokulabilir mi | `true` \| `false` |
| `collision` | Çarpışma gövdesi: şerit / taban / yok | `segment` \| `footprint` \| `none` |
| `magneticSnap` | Manyetik hizalama stratejisi (ızgara değil) | `standard` \| `none` \| `short-up-joint` |
| `connectionEndpoint` | Uç birleşim modeli | `segment` \| `logical-fixture` |
| `collisionDepth` | Çarpışmada derinlik modeli | `physical` \| `wall-backbone` |
| `endpointContact` | Uç temas kuralı | `standard` \| `thin-wall-endpoint` |
| `boundarySnap` | Stand sınırına nasıl snap | `stand-edge` \| `wall-inner-face` |
| `overlapWithTypes` | Çarpışmaya rağmen üst üste binebileceği tipler | `string[]` tip `key` |
| `supportsWallOverlayMount` | Üzerine raf/TV overlay konabilir mi | `true` \| `false` |
| `wallCapacity` | Duvar kapasitesi hesabına dahil mi | `include` \| `exclude` |
| `collisionHeight` | Dikey çarpışma kapsamı | pratikte `full` |
| `ghost` | Yerleştirme önizleme hayaleti | `{ kind, renderer, opacity }` |

**Önemli:** Bu paket **%100 tip bazlı**. Aynı `item_type` altındaki tüm SKU aynı davranışı paylaşır; Item satırında override yok.

**Proje export:** ZIP `modules[].placement = { xCm, yCm, zCm, … }` = **instance konum** (davranış alanı değil). Davranış ZIP’te yok; açılınca tip kaydından gelir.

---

## 2. Snap dilimi = şablon (ne yaptık, ne kopyalanır)

### Snap’te ne vardı / ne oldu

| Snap | Placement davranışı (hedef) |
|---|---|
| Eski: JS string / tip map | Eski: `TYPE_BEHAVIORS` |
| Katalog: `fair_stand_item_type`, `fair_stand_rule_type`, `fair_stand_rule` | Katalog: **mevcut** `fair_stand_item_type` + kolonlar (yeni tablo şart değil) |
| Kural↔tip M:N: `fair_stand_rule_item_type` | Tip↔overlap: ya JSON/array kolon ya junction (aşağı) |
| Item: `snap_requires_rule_id` XOR `snap_provides_rule_id` | İlk dilimde Item override **yok** (gerek yok; saf tip) |
| Motor: rule id eşleşmesi | Motor: tip kaydından üçlü+ paket okuma |
| CRM: tip / kural CRUD | CRM: **Item Type** edit’e davranış alanları |
| Bootstrap: `itemTypes` + `rules` | Bootstrap: `itemTypes[]` davranış alanlarını taşır |
| Seed = eski JS gerçeği | Seed = `TYPE_BEHAVIORS` birebir kopya |
| Dual-read → JS map sil | Dual-read → `TYPE_BEHAVIORS` sil |

### Snap’ten bilerek sapma

- Snap’te Item-level requires/provides vardı (floodlight/shelf).  
- Placement üçlüsü (+ diğerleri) bugün tip-only → **önce yalnız `fair_stand_item_type` kolonları**.  
- Item override ileride snap Provides gibi opsiyonel OR; **şimdi açma**.

---

## 3. Yeni tablo gerekir mi?

### Tavsiye: hayır (ilk dilim)

Davranış zaten tip’e bağlı → kolonlar **`fair_stand_item_type`** üzerinde.

```text
fair_stand_item_type
  key, display_name, is_active, …
  + placement
  + move_snap_cm
  + allow_side_insert
  + collision
  + magnetic_snap
  + connection_endpoint
  + collision_depth
  + endpoint_contact
  + boundary_snap
  + supports_wall_overlay_mount
  + wall_capacity
  + collision_height
  + ghost_kind / ghost_renderer / ghost_opacity   (veya tek JSONB ghost)
  + overlap_with_types   (aşağı)
```

### Ne zaman ayrı tablo?

| Durum | Tablo |
|---|---|
| Tip başına tek satır davranış | **Kolonlar yeterli** (önerilen) |
| `overlapWithTypes` M:N ve FK istiyorsan | `fair_stand_item_type_overlap (item_type_id, overlap_item_type_id)` |
| Item başına override | Sonra: `fair_stand_items` nullable kolonlar veya ince override tablosu |
| Requires/provides çoklu | **Ayrı epic:** `item_requires_rule` / `item_provides_rule` junction — placement ile aynı migration’a koyma |

`overlap_with_types`: ilk dilimde `TEXT[]` / JSON liste (`['flat-panel','profile']`) kabul edilebilir; FK sıkılaştırması 2. dilim.

---

## 4. Enum / CHECK önerileri

DB `CHECK` (veya Postgres enum) — JS string’leriyle **birebir aynı** kalsın (rename yok).

| Kolon | İzinli değerler |
|---|---|
| `placement` | `wall`, `free`, `wall-overlay`, `top` |
| `collision` | `segment`, `footprint`, `none` |
| `magnetic_snap` | `standard`, `none`, `short-up-joint` |
| `connection_endpoint` | `segment`, `logical-fixture` |
| `collision_depth` | `physical`, `wall-backbone` |
| `endpoint_contact` | `standard`, `thin-wall-endpoint` |
| `boundary_snap` | `stand-edge`, `wall-inner-face` |
| `wall_capacity` | `include`, `exclude` |
| `collision_height` | `full` (şimdilik; genişlerse CHECK güncelle) |
| `move_snap_cm` | `INTEGER CHECK (move_snap_cm > 0)` — pratik seed: 10 / 20 / 50 |
| `allow_side_insert` | `BOOLEAN NOT NULL` |
| `supports_wall_overlay_mount` | `BOOLEAN NOT NULL` |
| `ghost_*` | `kind` örn. `silhouette`; `renderer` örn. `module-silhouette`; `opacity` 0–1 |

Tüm davranış kolonları **NOT NULL** + seed dolu (tip kaydı eksik davranışla yaşamasın).

---

## 5. Öncelikli dilimler (snap sırası gibi)

Kod yok; onay sonrası iş sırası:

### Dilim 0 — Karar kilidi
- [ ] Bu belge + § C.3: “placement paketi `item_type` kolonlarında”
- [ ] Item override yok (v1)
- [ ] Enum rename yok
- [ ] Snap çoklu requires/provides **ayrı** epic

### Dilim 1 — Şema + seed (A)
- [x] Migration: `fair_stand_item_type` kolonları + CHECK (`0030_item_type_placement`)
- [x] Seed/Backfill: her tip key için `TYPE_BEHAVIORS` kopyası (`item_type_behavior_seed.py` kesit 1)
- [x] Model + admin item-type API read/write
- [ ] Fixture / catalog seed dump güncelle *(gerekmez: dump item_type satırı taşımıyor; ensure path seed kullanıyor)*

### Dilim 2 — Bootstrap + motor dual-read (B)
- [x] Catalog bootstrap `itemTypes[]` alanları *(payload’da var; motor henüz okumuyor)*
- [x] Frontend tip registry (snap rules gibi) veya `getItem` yolundan tip satırı
- [x] `getModuleBehavior`: **DB tip kaydı → yoksa JS map** (geçici) — yalnız kesit 1 üçlüsü overlay
- [x] Test: tip seed ↔ davranış parity (`TYPE_BEHAVIORS` golden)

### Dilim 3 — CRM (C)
- [x] Item Type formu: select/checkbox’lar (enum + overlap virgüllü liste) — kesit 1–3
- [x] Label/hint TR (`adminLabels`)
- [x] Yeni tip create: zorunlu davranış alanları

### Dilim 4 — JS map kaldırma (D) — kesit 1–3
- [x] Dual-read kapat; yalnız DB (kesit 1+2+3)
- [x] `TYPE_BEHAVIORS` literal kaldırıldı; bilinen tip kümesi + eksik bootstrap fail-fast
- [x] `DATABASE.md` / § C.3 tick

### Dilim 5 (opsiyonel sonra) — overlap FK / Item override
- [x] Junction overlap tablosu (`fair_stand_item_type_overlap`, `0033_item_type_overlap_fk`) — JSON kolon kaldırıldı
- [ ] Item nullable override (gerçek ihtiyaç çıkarsa)

### Dilim S (paralel ama ayrı) — Snap çoklu requires/provides
- [ ] Junction tablolar; XOR CHECK kaldırma
- [ ] Motor: ortak rule id OR
- [ ] CRM multi-select
- **Placement dilimleriyle aynı PR/migration’a koyma**

---

## 6. Önerilen ilk kesit (dar)

Hepsini bir anda taşımak yerine Snap’teki “ince dilim” gibi:

**Kesit 1 (önerilen start):**  
`placement` + `collision` + `move_snap_cm`  
→ en çok okunan üçlü; CRM’de üç alan; seed kolay.

**Kesit 2:**  
`magnetic_snap`, `allow_side_insert`, `supports_wall_overlay_mount`, `wall_capacity`

**Kesit 3:**  
`connection_endpoint`, `collision_depth`, `endpoint_contact`, `boundary_snap`, `collision_height`, `overlap_with_types`, `ghost_*`

Her kesitte: migration → seed → dual-read → CRM → test → map’ten alan sil.

---

## 7. Motor / export etkisi (bozulur mu?)

| Soru | Cevap |
|---|---|
| Export’taki konum bozulur mu? | Hayır — instance `placement {x,y,z}` ayrı |
| Davranış export’ta mı? | Hayır — hiç olmadı |
| DB’ye geçince motor bozulur mu? | Hayır, seed+dual-read doğruysa; risk = eksik tip seed |
| `wall_200` nerede duruyor export’ta? | Evet — `itemKey` + `modules[].placement` |

---

## 8. CRM UX özeti

**Ekran:** mevcut Item Type CRUD (yeni sayfa şart değil).

| UI | Alan |
|---|---|
| Select | placement, collision, magnetic_snap, … |
| Number | move_snap_cm |
| Checkbox | allow_side_insert, supports_wall_overlay_mount |
| Multi-select (tipler) | overlap_with_types |
| Ghost | 3 alt alan veya tek JSON editor (v1’de sabit default da olur) |

Item edit ekranına (v1) **koyma** — tip’ten miras.

---

## 9. Test planı (gevşetmeden)

- Parity: her seed tip ↔ eski `TYPE_BEHAVIORS` satırı (golden JSON veya generate-from-seed)
- `getModuleBehavior('wall_200')` ≡ eski wall paketi (itemKey üzerinden tip çözümü)
- CRM update tip → bootstrap/reload sonrası davranış değişir
- Bilinmeyen tip → fail-fast veya bilinçli default (ürün kararı; sessiz `WALL_BEHAVIOR` fallback’i tartışmalı)
- Export roundtrip: davranış ZIP’te yok; açılışta canlı tip’ten gelir (regresyon)

---

## 10. Yasaklar

- Davranışı hem JS map hem DB’de kalıcı çift otorite bırakmak (dual-read geçici)
- Enum rename / Türkçe key
- Placement davranışını proje ZIP’e gömmek
- Bu epic’te snap çoklu requires/provides
- Item’a gereksiz kopya kolon (v1)
- Testleri “geçsin diye” esnetmek

---

## 11. Karar özeti (onay kutusu)

1. **Ev:** `fair_stand_item_type` kolonları (yeni davranış tablosu yok).  
2. **İlk kesit:** `placement` + `collision` + `move_snap_cm`.  
3. **Overlap:** FK junction `fair_stand_item_type_overlap` (`0033`); bootstrap `overlapWithTypes: string[]`.  
4. **Ghost:** v1 üç kolon veya seed’de sabit default.  
5. **Item override / snap multi:** ayrı epic.  
6. **Export:** değişmez.

---

## 11b. Kullanım kılavuzu (sonra — şimdi yazma)

**Durum:** PLAN / not. İçerik bu oturumda üretilmez.

Tek operatör kılavuzu (CRM + motor):

1. **Tip davranışı (TYPE_BEHAVIORS / `fair_stand_item_type`)** — `placement`, `collision`, `move_snap_cm`, …: ne işe yarar, hangi değer ne demek, tip mirası (SKU override yok).
2. **Snap kuralı (`fair_stand_rule` + tip link + item requires/provides)** — aynı kılavuzda ayrı bölüm: face/edge, top-rail / shelf-rail, tip çentiği vs item FK; **tip kolonlarıyla karıştırılmaması** net uyarı.

Amaç: 5 ay sonra “bu neydi / snap mi tip mi?” dememek.  
Hedef dosya (öneri): `docs/refactor/TYPE_AND_SNAP_USAGE.md` (veya bu yol haritasına ek bölüm).  
Bağımlı: kesit 1+ stabilize; CRM hint’leri kılavuza taşınır/genişletilir.

---

## 12. Günlük

| Tarih | Not |
|---|---|
| 2026-09-24 | Analiz yazıldı: Snap şablonu; tip kolonları; yeni tablo şart değil; ilk kesit üçlü; export etkisiz. |
| 2026-09-24 | **Dilim 1 / Kesit 1 kod:** migration `0030`; seed map; model+admin API `placement`/`collision`/`move_snap_cm`. Motor/CRM dual-read sonraki dilim. |
| 2026-09-24 | **Dilim 2:** `initializeItemTypeRegistry` + `getModuleBehavior` dual-read (DB üçlü overlay → JS fallback). CRM sonraki. |
| 2026-09-24 | **Dilim 3:** CRM Item Type — placement/collision/moveSnapCm form + tablo kolonları. Dilim 4: JS map kaldırma. |
| 2026-09-24 | **Dilim 4 (kesit 1):** üçlü yalnız DB; JS map’ten çıkarıldı; bilinen tipte eksik bootstrap fail-fast. Sıradaki: kesit 2 alanları. |
| 2026-09-24 | Not: **kullanım kılavuzu sonra** — tip davranışı + snap kuralı aynı rehberde (§ 11b); şimdi yazılmadı. |
| 2026-09-24 | **Kesit 2 Dilim 1:** migration `0031_item_type_behavior_s2` — `magnetic_snap`, `allow_side_insert`, `supports_wall_overlay_mount`, `wall_capacity` + seed/API. Motor dual-read sonraki. |
| 2026-09-24 | **Kesit 2 Dilim 2–4:** motor DB-only (kesit2 JS map’ten silindi) + CRM form/hint + fixture/test. |
| 2026-09-24 | **Kesit 3 Dilim 1–4:** migration `0032_item_type_behavior_s3` — endpoint/depth/contact/boundary/height/overlap/ghost; motor DB-only; `TYPE_BEHAVIORS` kaldırıldı; CRM + parity/live verify. |
| 2026-09-24 | **Dilim 5 overlap FK:** `0033_item_type_overlap_fk` — JSON `overlap_with_types` → M:N junction; CRM tip multi-select; bilinmeyen key reddi. |
