# Scene pose

Item gövdesi, sahne kotu, snap. Stand zarfı değildir (`STAND_DIMENSIONS.md`).
Rotation ayrı: `ROTATION.md`.
Kolon envanteri: `DATABASE.md`.

Bu belge hedef sözleşmedir. Aşağıdaki “hedef” satırları henüz kodda tam uygulanmış değildir.

**Backlog / kaldırma sırası / ertelenen property’ler:** `PENDING_ITEM_DECISIONS.md` (canonical iş sırası § A).

---

## Üç kural

1. **Gövde** — item kaç cm: `dimensions` / `scene_dimensions`.
2. **Duruş** — sahnede nerede, özellikle Z (yerden kot). Sürükleince `placement` oluşur; Z’nin default’u item’dan gelir, stand tavanından değil.
3. **Snap** — sihirli kota değil. Kime yapışacağı **DB’den** (sürülen item’ın hedef `item_type`’ı). Kodda `profile` / `profile_190` sabiti yok.

Eksen (placement, Max/SketchUp): **X** genişlik, **Y** derinlik (0 = arka duvar, +Y öne), **Z** yerden yukarı.

Motor Three.js Y-up. `applyPlacementToGroup` cm→m ve `yCm`→dünya Z, `zCm`→dünya Y çevirir. Item/DB bu takası yazmaz.

---

## Resolver (bu kısım kodda doğru)

`resolveSceneDimensions`: aynı alan adı için `sceneDimensions ?? dimensions ?? null`.

- `length` → `width` yok
- `thickness` → `depth` yok
- `type` / `itemKey` / `STAND_DIMENSIONS` remap yok

`profile_190` sahne genişliği 200 çünkü DB `scene_dimensions.width_cm = 200`, kod 190’ı ezmiyor.

---

## Kalacak

| Kaynak | Alan | İş |
|---|---|---|
| `fair_stand_item_dimensions` | `width/depth/height/length/thickness` | Üretim gövdesi, BOM |
| `fair_stand_item_scene_dimensions` | `width/depth/height` | Sahne kutusu (slot). Null ise dimensions aynı ad |
| `fair_stand_items` | `rotationStepDeg` / `defaultRotationDeg` / `sideInsertRotation` | Shift+R, ilk yaw, yana ek |
| runtime `placement` | `xCm yCm zCm rotationZDeg` | Instance. Drop’ta oluşur |
| `fair_stand_dimensions` | height/depth/strips/frame | **Yalnız stand zarfı**: tavan, duvar kalınlığı, panel şerit ızgarası |

Eklenecek (hedef; rotation üçlüsü gibi item’da):

| Alan | İş |
|---|---|
| `defaultZCm` (veya kullanılan `mount_height_cm`) | Katalog drop’ta `placement.zCm`. Profil ray kotu. Tavan 500 olsa da 450 durur |
| `snap_target_item_type` | Sürülen item üzerinde. Floodlight seed: `'profile'`. Raf seed: `'panel'`. JS yalnız bu string’i okur |
| `snap_anchor` | Hedefin neresi: `top` / `bottom` / `left` / `right`. Raf: `'top'`. Floodlight profil `'top'` |

X/Y default şart değil; pointer + duvar snap. Z default şart.

---

## STAND_DIMENSIONS — yalnız zarf

Tut:

- Stand tavanı / derinliği / şerit sayısı (düz panel 7×50)
- Ghost/çarpışma **fallback’i** yalnız item’da height yoksa

Kes (item duruşunu ezmesin):

| Kod | Bugün | Hedef |
|---|---|---|
| `createProfileModule` | Ray `STAND_DIMENSIONS.height` tavanında | Ray `placement.zCm` / item default Z |
| `createUprightModule` | Mesh stand 10×350; hep `upright_346_5` | Item `scene_dimensions` + kendi yüksekliği |
| `snapTopFixturePlacement` | `zCm = 350` | En yakın hedef rayın Z’si (`snap_target_item_type`) |
| `getTopFixtureDragPoint` | 350 yatay düzlem | DB’deki hedef type hatları |
| `led_floodlight.mountHeightCm = 350` | Sabit tavan | Snap sonucu; item default yalnızca ilk değer |
| `getModuleCollisionHeightRangeCm` | Stand tavan fallback (eski) | Item `heightCm` + `placement.zCm` / `defaultZCm` (occupancy×şerit okumaz) |
| `main.js` floodlight `zCm: 350` | Literal | placement/item |

`strip_occupancy` (`short-up-1/2`, align top): bugün tavan kayınca short-up tavana yapışır. Hedef: şerit sayısı **görünen panel adedi**; kot item Z/height.

---

## Snap (DB, hardcode yok)

Projektör “üst kot 350” değil. Hedef listesi JS’te yazılmaz.

Sürülen item’da kolonlar: `snap_target_item_type`, `snap_anchor` (nullable).

- `led_floodlight`: `'profile'`  
- raf: `'panel'` + `'top'` — `panel_197` koda yazılmaz  

Motor (generic):

1. Sahnede `item.type === snap_target_item_type` → o gövdenin `snap_anchor` kenarı.  
2. Değilse reçetede o type çocuk → her çocuğun aynı kenarı (duvar içi panel üstü, profil rayı).  

`wall_200` / şerit seam / `panel-seam` yok. Birden fazla type gerekirse üye tablosu.

`TYPE_BEHAVIORS.overlaySnap = 'panel-seam'` kalkar.

---

## Uygulama sırası (unutma)

Kod henüz yoktu; sıra bu. **1–6** uygulandı.

1. Item kolonları: `is_render`, `accepts_*`. Seed. **Done.**
2. Yüzey kapısı item `accepts*` (type map / `selectionMode==='panel'` kapısı). **Done (menü/uygula).** Ctrl çoklu seçim hâlâ şerit `selectionMode` (geometri).
3. `isRender`: false → sahne factory yok. **Done** (`createModuleStateFromDescriptor` / catalog key).
4. `defaultZCm` / `mount_height` → drop `placement.zCm`. **Done** (`resolveItemDefaultZCm`; floodlight 350 literal yok). Kettle sahne kotu da item `defaultZCm`; renderer buzdolabı yüksekliği eklemez.
5. `snap_target_item_type` + `snap_anchor` (`top`/`bottom`/`left`/`right`). **Done** (kolon + generic `snapPlacementToItemAnchor`; floodlight Z host top).
6. Duvar tavanı bırak; `wall_200_100`; şerit occupancy yok; panel boşluğu standart. **Done (mesh + kot).** Profil ray `height=8` + `defaultZCm=342`. Dikme item `scene_dimensions`. Düz panel `frameHeight` item `heightCm`. Short-up kot `defaultZCm` + gövde; collision occupancy×stand değil. Occupancy JSON hâlâ katalogda (strip adedi / test); renderer ve collision kotu okumaz. `wall_200_100` yeni SKU yok (adım 8). Panel boşluğu hâlâ `PANEL_RAIL_HEIGHT_M` 0.4 cm — cm seed’de yazılmadı.
7. Ortak kutu primitive (asılı lightbox). **Örnekti; sistemde böyle bir primitive yok. Atlandı.**
8. Admin item üretimi (Stand API; CRM form sonra). Mevcut `item_type` + ölçü/kot/snap/`accepts*` satırı. Yeni sahne factory doğmaz.

Connector’ı gerçek yapmak ve `panel_197` drop sonra. CRM sahne yok.

## Sıra (eski pose maddeleri, 4–6 ile birleşir)

1. Item default Z kolonu (veya `mount_height_cm`’i profile/floodlight için gerçekten oku).
2. Drop: `placement.zCm = defaultZCm`.
3. Profil/dikme mesh’i stand tavanından kopar. **Done.**
4. Floodlight snap: `snap_target_item_type` + reçetedeki aynı type çocukların üst/alt rayı. `profile` / `350` literal yok. **Done (adım 5).**
5. Short-up yüksekliği occupancy×stand yerine item ölçü + Z. **Done (adım 6).**

Bittikten sonra tavan 350→500 item kotlarını oynatmaz.

---

## Profil = TV gibi Z (reçete değil)

`profile_190` sahneye birden fazla konur. Her kopya TV overlay gibi **Z− / Z+**: biri 450, biri 400. Reçete merdiven çizmez; merdiven bu kopyalardan çıkar.

- `wall_200_500` ayrı item olabilir; üstüne ayrıca profil koymak zorunlu değil.
- Floodlight o kopyanın **o anki** `zCm`’ine snap.

## Stand tavanı + item gövdesi (hedef)

- Stand tavanı **üst sınır** kalır (ör. 500). Kamera, overlay clamp, “sahne dışına çıkma”.
- Her item **kendi** `dimensions` / `scene_dimensions` (ve çocuk parçaları) ile çizilir. Mesh `STAND_DIMENSIONS.height` / `stripCount` okumaz.
- Duvar SKU yükseklik taşır: `wall_200_100` → sahne yüksekliği **100 cm**. Tavan 350→500 olsa da 100 kalır; tavana hizalanmaz, şişmez, “üstten N şerit” olmaz. `wall_200_350` / `wall_200_500` ayrı item’lar.
- `height = stripCount × stripHeight` **duvar şekli değildir.** O eşitlik (varsa) yalnız zarf satırının kendi aritmetiğidir; `wall_*` okumaz.
- **Şerit occupancy yok.** 7×50 ızgara, short-up “üstten N şerit”, `align: top` kalkar.

### İki panel arası (standart, tavan değil)

Panel boyu child item’dır (`panel_197` üretim **47 cm**). İki panel arasındaki boşluk/ray **tek standart** (zarf veya pose sabiti; item’a göre değişmez, tavanla çarpılmaz).

Duvar yüksekliği ≈ alt/üst profil + N×panel boyu + (N−1)×panel boşluğu. `wall_200_100` bu toplamı 100’e kilitleyen katalog kaydıdır; ızgara tavanı 100’e “kesmez”.

Bugünkü sapma (uygulanmayacak): renderer ray `0.4 cm` (`PANEL_RAIL_HEIGHT_M`); şerit pitch 50. Hedefte tek boşluk sayısı — 50−47=3 cm ürün pitch’i aday; kesin cm seed’de yazılır.

- Raf: şerit dikişi yok. Snap = hedef item’ın **kenarı** (aşağıda).


Profil kopyaları yine TV gibi kendi `zCm`. Tavan yalnız max.


## Bu sohbetten notlar

- Placement Z-up (Max). Motor Y-up çevirisi DB’de yok.
- Katalog `category_id` snap grubu değil. Snap = sürülen item’daki `snap_target_item_type`.
- `mount_height_cm` floodlight’ta 350; profil `default_z_cm` 342 (gövde 8).
- Kod bu belgeden sonra yazılacak; uygulama henüz yok.
- Arayüzden `wall_200_100` = 200×100 item; tavan onu hareket ettirmez.
- Item `isRender` (DB `is_render`): `true` = kendi sahne render’ı; `false` = sanal/BOM, sahneye çizilmez. Duvar tipi değil; `catalogVisible` ayrı. Ayrıntı `ITEMS.md`.
- Item yüzey yetenekleri (hepsi item kolonu, type map değil): `acceptsColor`, `acceptsImage`, `acceptsLightbox`, `acceptsGlass`, `acceptsMesh`. `isRender=false` → hepsi `false`.
