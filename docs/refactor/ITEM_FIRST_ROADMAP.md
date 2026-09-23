# Fair Stand — Item-first yol haritası (karar + checklist)

**Durum:** ürün kararı (2026-09-23). Uygulama izni için bu belge + ilgili konu belgesi gerekir.  
**Amaç:** Her yeni `wall_*` / SKU için kod yazmamak; leaf → registry → recipe → davranış kurallarını **DB/Item** üzerinden ilerletmek.

İlgili: `ITEMS.md`, `SCENE_POSE.md`, `DATABASE.md`, `PENDING_ITEM_DECISIONS.md`, `ROTATION.md`.

---

## Karar özeti

1. **Leaf önce.** `profile_*`, `panel_*`, `upright_*` WDH + renk + `item_type` + `is_render` ile Item olarak kaydolur (`item_key` lowercase).
2. **Registry.** Bunlar kanonik `Item{}` kümesidir; lookup yalnız `itemKey`.
3. **Parent = recipe BOM.** `wall_200` gibi item’lar `composition.mode = recipe` + `composition.items` (`{itemKey, quantity}`). Bu **BOM listesi**dir; çocuk pose/offset taşımaz.
4. **Davranış SKU’ya yazılmaz.** Snap/mount ailesine veya capability’ye yazılır:
   - Projetör: `requires: top-rail` ← `profile` `provides: top-rail` (+ uygun face/edge).
   - Raf: `requires: shelf-rail` ← `panel` **ön yüzünün lokal üst kenarı** (`face: front`, edge: o yüzün `top`). Wall AABB tavanı değil; 7 panel → 7 (veya dikiş sayısı kadar) yatay hat.
   - Free leaf sahnedeyse aynı kural; wall’da child mesh yoksa hatlar recipe quantity × leaf ölçüden **türetilir** (sanal snap hattı).
5. **Admin 3D preview ertelenir (P5).** Bugün admin “live” = CSS siluet (`preview_id`). Parametrik BoxGeometry / assembly preview istenen ama **veri modeli oturmadan** yapılmaz.

### Bilinçli sınırlar

- BOM’da child olması ≠ sahnede otomatik mesh. Snap için gerekirse **sanal mount hattı** yeterli; tam Lego assembly şart değil.
- Sahneye konmak için `is_render=true` **ve** bilinen `item_type` (factory/behavior) gerekir.
- Her behavior’ı bir anda DB’ye taşımak yok; capability snap ince dilimle gelir.
- Admin preview ≠ prod `scene3d` birebir kopyası olmak zorunda değil.
- Tek kelime `top` / `side` yetmez: projetör üst rayı ile rafın ön-yüz üst dikişi **farklı capability** olmalı.

---

## Hedef sözlük (P0)

| Terim | Anlam |
|---|---|
| Leaf | Ölçü/renk sahibi SKU (`profile_*`, `panel_*`, …) |
| Parent / recipe | Çocuk listesi + quantity; BOM kaynağı |
| Aile | Genelde mevcut `item_type` (`profile`, `panel`, `upright`, …) |
| Capability / mount | Snap rolü; type’tan dar. Örn. `top-rail`, `shelf-rail` |
| `provides` | Bu item (veya türetilmiş sanal hat) ne sunar |
| `requires` | Sürülen item ne arar |
| `face` | Hangi yüzey: `front` / `top` / … (AABB tek `top` değil) |
| `edge` | O yüzün kenarı: `top` / `bottom` / `left` / `right` |
| Sanal snap hattı | Mesh instance olmadan recipe + leaf ölçüden üretilen tekrarlayan mount çizgisi |

`SCENE_POSE.md` bugünkü alanlar: sürülen item’da `snap_target_item_type`, `snap_anchor`. Capability modeli (`provides`/`requires` + `face`/`edge`) buna **üstüne biner veya onu genelleştirir**; paralel gizli sözleşme yok. Çakışmalar § *Gap / çatışma* + bu belge + `SCENE_POSE.md` + `PENDING_ITEM_DECISIONS.md` B.9 / C.3–C.4 birlikte çözülür.

---

## Gap / çatışma (yol haritası × bugünkü kod/DB)

Kaynak tarama: 2026-09-23. Kod değiştirilmeden tespit.  
Derin tarama (aynı gün): üç paralel snap motoru — `itemSnap.js` (floodlight type+anchor), `TYPE_BEHAVIORS` `panel-seam` (raf; DB snap yok sayılır), magnetic/stand XY. Host = recipe parent AABB top (`listSnapHosts` child type eşleşince tüm wall). Seed hard map: `item_snap_seed._SNAP_BY_TYPE`. Rename sürtünmesi: `WALL_WIDTH_TO_ITEM_KEY` / `wall_200` sabitleri + `flat-panel` type registry — capability host’u `item_key`’e bağlamamalı.

### Uyuşanlar

- Leaf registry, lowercase `item_key`, WDH/renk/type/`is_render` kolonları.
- Parent recipe BOM (`composition.items` = `{itemKey, quantity}`, pose yok); `wall_200` örneği seed’de.
- BOM child ≠ otomatik mesh (wall `createFlatPanelModule` prosedürel).
- Rotation + `defaultZCm` büyük ölçüde Item kolonlarından.
- Snap kolonları var ama **type-target modeli** (`snap_target_item_type` + `snap_anchor`).
- Admin “live” = CSS siluet; Three.js P5 ile uyumlu erteleme.
- Yeni `wall_*` SKU’su çoğu zaman yeni factory istemez (`flat-panel` + recipe).

### Kısmi / yanlış katman

| Konu | Bugün | Yol haritası |
|---|---|---|
| Snap modeli | Sürülen Item’da type + anchor | Aile/capability `provides`/`requires` + face/edge |
| Floodlight → wall | Recipe’de `profile` var diye **tüm wall** host; Z ≈ duvar tavanı | Profile ray / `top-rail` geometrisi veya free profile instance |
| Raf | DB seed `panel`+`top`; runtime **`panel-seam`** (`TYPE_BEHAVIORS`) | `shelf-rail`: panel **front** yüz lokal üst; N panel → N hat; Item’dan |
| Wall üst ray / panel hatları | Strip sayısı BOM’dan; mount capability yok | Child provides → sanal hat türetme kuralı |
| `is_render` | Seed `PLACEABLE_ITEM_TYPES` listesine bağlı | Leaf master alanı; yeni aile hâlâ factory ister |
| Create formu | Kimlik | WDH/`is_render` edit’te |
| Cycle | Self-parent CHECK | Admin A→B→A yok |
| Doc üçgeni | `ITEM_FIRST` capability · `SCENE_POSE` type-target · PENDING B.9 gerçek Profile instance | Üçü birden “doğru” kabul edilerek P4 yazılamaz |

### Dünya kuralı ihlalleri (böyle olmaz)

1. **BOM satırı ≠ snap yüzeyi.** “Wall içinde `profile_*` var → otomatik doğru kot” bugün yanlış köprü (parent AABB top). Ya gerçek profile instance, ya sanal `top-rail` hattı, ya yalnız free profile — kararsız bırakılamaz.
2. **İki snap otoritesi.** Raf için DB `snap_*` ile `overlaySnap: panel-seam` aynı anda yaşamaz. Seam kalkmadan “snap DB/Item’dan” iddiası false.
3. **Tek `top` kelimesi.** Projetörün profil üstü ile rafın **ön yüz üst dikişi** aynı anchor olamaz. Capability ayır: `top-rail` vs `shelf-rail`; face/edge zorunlu.
4. **Kod yazmadan yeni aile.** Yeni SKU (`profile_250`, `wall_250`) olur; yeni `item_type` için factory + çoğu yerde `TYPE_BEHAVIORS` hâlâ gerekir.
5. **Placement tamamı Item’da değil.** Snap dilimi taşınsa bile `placement` / `moveSnapCm` / magnetic vb. type map’te (C.3 ertelendi).

### Raf / panel görsel kuralı (ürün cümlesi)

Önden bakınca raf, wall kutusunun tavanına değil; **panel bandının front yüzündeki üst kenara / dikişe** oturur (cyan hatlar).  
7× `panel_*` recipe → motor leaf `heightCm` (veya scene) ile tekrarlayan yatay hatlar üretir.  
Bugünkü `panel-seam` bu **görünümü** verir ama kaynak stand pitch / `strips[]` / type map’tir — hedef kaynak Item capability + leaf ölçü.

### Eksikler (P4 için sıfır)

- `provides` / `requires` / capability sözlüğü kolon veya tablo  
- `face` + `edge` (veya eşdeğer) sözleşmesi dondurulmuş hali  
- Wall sanal hat türetme kuralı (yazılı + kod)  
- Capability runtime okuyucu  
- Rafın `panel-seam`’den tek motor’a geçiş planı  
- Admin cycle validation  

### Risk (hızlı dilim)

| Pri | Risk | Not |
|---|---|---|
| P4 | Kritik | İki motor + yanlış wall host Z + capability yok |
| P0 | Yüksek | Sözleşme dondurulmadan P4 borç |
| P2 | Yüksek | BOM OK; mount türetme procedural wall ile çelişebilir |
| P1 | Orta | Leaf master var; yeni aile riskli |
| P3 | Düşük | Rotate/defaultZ yakın |
| P5 | Erteli | Doğru |

**P0 zorunlu seçim (yazılmadan P4 yok):**  
**(KİLİTLENDİ 2026-09-23, güncellendi).** stand.family + rule_type + rule; item `family_id` + requires|provides rule FK; motor **rule id**. Face/edge/mount_mode kural satırında; CRM CRUD. Type→kural runtime map yok.

(B) iptal — mevcut `snap_target_item_type` dilinde P4 yok.

---

## Checklist (öncelik)

### P0 — Sözleşme (bu belge)

- [x] Leaf / parent / BOM ayrımı yazılı
- [x] Snap SKU’da değil aile/capability’de (hedef)
- [x] Admin 3D P5’e alındı
- [x] Gap / çatışma notu yazıldı (2026-09-23)
- [x] Capability sözlüğü hedefi: `top-rail`, `shelf-rail` + face/edge (DB’den; hardcode yok)
- [x] P0 seçim **A** kilitlendi (2026-09-23)
- [x] `SCENE_POSE.md` + PENDING B.9 / C.4 aynı cümleye çekildi
- [x] DB şema + admin seçim alanları (0024; CRM face/edge dropdown)
- [ ] Sanal hat türetme ince ayarı (recipe panel band / top-rail offset) — devam

### P1 — Leaf Item tek kaynak

- [ ] `profile` / `panel` / `upright` create→edit: WDH, renk, type, `is_render`, lowercase key
- [ ] Catalog görünürlük kuralları (`category` + index + `preview_id`) bilinçli
- [ ] Leaf ölçü değişince parent BOM quantity’leri elle doğrulanır (otomatik “wall büyüsün” bu fazda yok)

### P2 — Parent = recipe only

- [ ] Yeni `wall_*` yalnız `composition.items` + sahne kutusu; snap/rotate wall SKU hardcode’u yok
- [ ] Wall sanal hat kuralı yazılı: `top-rail` (profile) ve/veya `shelf-rail` (panel×N) — host modeli seçilmiş
- [ ] Self-parent / cycle: admin + seed tutarlı

### P3 — Rotate / defaultZ (kolay kazanım)

- [ ] Item rotation alanları tek kaynak (`ROTATION.md`)
- [ ] `defaultZCm` / mount Item’dan; type listesi eritme (`SCENE_POSE.md`)
- [ ] Yeni leaf eklenince rotate için kod gerekmez

### P4 — Snap capability (kod yazmamayı burası sağlar)

- [ ] Örnek 1: projetör ↔ `profile` / `top-rail`
- [ ] Örnek 2: raf ↔ `panel` / `shelf-rail` (front + lokal top; N hat) — `panel-seam` tek otoriteye indir
- [ ] Seed: provides / requires (+ face/edge)
- [ ] Runtime ince dilim; wall recipe-AABB-top host’u gölgelemez
- [ ] Free leaf sahnedeyse aynı kural

### P5 — Admin canlı preview (sonra)

- [ ] Leaf: WDH + renk → basit BoxGeometry canlı (kaydetmeden önce)
- [ ] Parent: çocukları basit assembly doğrulama (prod renderer şart değil)
- [ ] Kayıt mevcut item-records API’ye; create kimlik → edit tam master akışı korunur

---

## Bu hafta “hızlı” dilim

1. P0: A veya B kilidi + `top-rail` / `shelf-rail` sözlüğü.
2. Bir leaf + bir `wall_*` recipe’nin Item/BOM’dan okunduğunu doğrula.
3. P4 planı: önce floodlight + free/`top-rail`; raf/`shelf-rail` ikinci dilim (`panel-seam` ile yarışmasın).
4. P5 backlog’ta kalsın.

---

## Yapılmayacaklar (şimdi)

- Her `TYPE_BEHAVIORS` kuralını DB’ye toplu taşımak
- Admin = full `scene3d` kopyası
- BOM çocuğunu otomatik sahne mesh’i sanmak (sanal hat ≠ mesh)
- `top-rail` ile `shelf-rail`’i tek `top` altında birleştirmek
- Testleri “geçsin diye” esnetmek; kural/kod hizası zorunlu
- P0 kilidi olmadan P4 implementasyonu

---

## Günlük

| Tarih | Not |
|---|---|
| 2026-09-23 | Karar yazıldı: item-first sıra + capability snap + admin 3D P5. |
| 2026-09-23 | Gap/çatışma eklendi: type-target vs capability, wall AABB host, raf `panel-seam` vs front-top `shelf-rail`, P0 A/B kilidi. |
