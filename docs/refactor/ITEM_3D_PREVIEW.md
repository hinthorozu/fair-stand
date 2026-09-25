# Item 3D Önizleme (Admin)

> **Asıl plan (Cursor):** `.cursor/plans/item_3d_preview_439e7580.plan.md` — “Item 3D Preview (P5) yol haritası”.  
> Bu dosya repo içi mirror; unutmamak için yetenek + sınır özeti.

Fair Stand **admin Item düzenleme** ekranındaki canlı 3D önizleme + recipe montaj layout kaydı.

Branch: `item_3d_preview` (lokal; commit/push/merge ürün kararına bağlı).  
Roadmap dilimi: `ITEM_FIRST_ROADMAP.md` § P5.

Bu dosya **ne yaptık / sistem ne yapabilir / ne yapamaz** için yaşayan not. Audit değil.

---

## Amaç

- Leaf Item: W / D / H (+ scene override) ve `defaultColor` ile **BoxGeometry** canlı kutu.
- Recipe parent: BOM’daki `isRender=true` child’ları **serbest pose** ile yerleştir; kaydet; prod sahne bootstrap sonrası aynı layout’u çiz.
- Admin **full `scene3d` kopyası değildir** — ince Three sahne (`itemAdminPreview.js`).

---

## Dosyalar

| Katman | Yol |
|---|---|
| Preview motor | `fair-stand/src/itemAdminPreview.js` |
| Pose merge / normalize | `fair-stand/src/itemAssembly.js` |
| Prod tüketim | `fair-stand/src/scene3d.js` → `createItemAssemblyModule` (assembly varsa parts mesh) |
| Migration | `0038_item_assembly_parts`, `0039_assembly_rotation_xyz` |
| API | `PUT /api/v1/fair-stand/admin/item-records/{itemKey}/assembly` |
| Model / mapper | `FairStandItemAssemblyPartModel`, `item_mapper` → bootstrap `assembly.parts` |
| CRM UI | `fair-crm/.../FairStandItem3dPreview.tsx`, Items admin sekme `preview3d` |
| Test | `fair-stand/test/itemAssembly.test.js` |

---

## Koordinat (SCENE_POSE)

Ürün: **X = W**, **Y = D (+öne)**, **Z = H (yerden yükseklik)**.  
Three Y-up: W→+X, H→+Y dünya, D→+Z dünya.

`zCm` = kutunun **tabanı** (yerden). Merkez Three’de `y = zCm/100 + heightM/2`.

Eksen legend (canvas sol alt) + W/D/H okları sabit sahne grubunda.

---

## UI akışı (CRM)

1. **Adım 1 — Kutu:** Envelope (scene ölçü varsa scene, yoksa dimensions) + renk.
2. **Adım 2 — Montaj:** Recipe + en az bir isRender child. Her child instance bir kutu.
3. **Seç:** tık → `itemKey · isim · #instance`.
4. **Taşı:** `G` (TranslateControls).
5. **Döndür:** `R` — **üç eksen, 360°** (serbest Euler).
6. **Açı yaz:** seçili parçada **W° / D° / H°** alanları (Enter/blur). Sürüklerken her frame React güncellemesi yok; bırakınca senkron.
7. **Genişlet / Küçült:** aynı sayfada full-viewport panel (Esc).
8. **Montajı kaydet:** pose listesini API’ye yazar.

Zemin: AABB tabanı `y < 0` olmaz (`clampMeshAboveGround`).

---

## Kayıt modeli

**BOM ayrı kalır** → `fair_stand_item_components` / `composition.items` (child + quantity).  
**Pose ayrı** → `fair_stand_item_assembly_parts`:

| Kolon | Anlam |
|---|---|
| `parent_item_key` | Recipe Item |
| `child_item_key` + `instance_index` | BOM instance kimliği |
| `x_cm`, `y_cm`, `z_cm` | Parent lokal cm |
| `rotation_x_deg` | Ürün W ekseni etrafı → Three `rotation.x` |
| `rotation_y_deg` | Ürün D ekseni etrafı → Three `rotation.z` |
| `rotation_z_deg` | Ürün H ekseni etrafı → Three `rotation.y` (eski tek açı alanı) |

GLB / mesh dosyası kaydedilmez; yalnızca sayılar. Mesh’ler runtime’da BoxGeometry (veya ileride child asset).

Bootstrap: parent Item JSON’da `assembly.parts[]`.  
Prod: `itemHasAssemblyLayout` → parts çiz; yoksa legacy gömülü/şerit yolu.

---

## Yetenekler (bugün)

- [x] Leaf envelope önizleme (WDH + renk)
- [x] Recipe assembly free pose (translate + full Euler)
- [x] Seçim etiketi (`itemKey` / isim)
- [x] Açı alanları W/D/H (yazılabilir + gizmo sonrası okuma)
- [x] Zemin altı engeli
- [x] Same-page expand viewport
- [x] Persist + bootstrap + prod assembly mesh
- [x] `isRender` filtresi (catalogVisible ile karıştırılmaz)
- [x] Admin AABB **köşe snap + yapıştır** (C / buton; 8 köşe; rotasyon korunur; absolute pose)
- [x] Admin **oturum kilidi** (N parça grup: Kilitle / Gruba ekle; sürükle/snap/açı; DB’ye yazılmaz)
- [x] ViewCube + Persp/Ortho (ana editör `viewCube.js` / projection-control ile aynı)

---

## Bilinçli sınırlar (yapılmaz / henüz yok)

- Admin ≠ prod `scene3d` (magnetic joint / wall reflow burada yok).
- **Kalıcı kilitle** (DB relative constraint / reload sonrası grup) yok — oturum kilidi absolute pose kaydından bağımsız.
- BOM çocuğu otomatik sahne mesh’i sanılmaz; assembly yoksa eski davranış.
- Gerçek GLB köşe ≠ AABB köşe; admin layout kutuya göre.

---

## isRender vs catalogVisible

| Bayrak | Anlam |
|---|---|
| `isRender` | Sahnede / montaj önizlemede çizilsin mi |
| `catalogVisible` | Katalog menüsünde görünsün mü |

Montaj Adım 2 yalnız `isRender=true` child instance’larını listeler.

---

## Manuel smoke

1. Recipe Item aç → sekme **3D Önizleme**.
2. Adım 1: kutu W/D/H okları + legend.
3. Adım 2: child kutular; tık → seçili satır; G/R; açı yaz; zeminin altına inme.
4. **Montajı kaydet** → DB `fair_stand_item_assembly_parts`.
5. Prod bootstrap sonrası parent yerleştirilince parts layout’u görünür.

---

## Sonraki aday (karar bekler)

Kalıcı **kilitle** (relative constraint + hedef takip + persist) = şema genişletmesi, ayrı dilim.

---

## Günlük

| Tarih | Not |
|---|---|
| 2026-09-25 | P5 uygulandı: sekme, assembly tablo/API, prod mesh, WDH eksen, expand, seçim, full Euler + açı UI, zemin clamp. |
| 2026-09-25 | Bu doküman + Cursor plan mirror. |
| 2026-09-25 | Admin köşe snap MVP: `itemAdminCornerSnap.js` + C/buton iki tık yapıştır. |
| 2026-09-25 | Oturum kilidi: snap sonrası Kilitle; kilitli çift rigid-group (hangisi sürüklenirse); persist yok. |
