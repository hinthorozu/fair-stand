# Fair Stand DB — kullanım kılavuzu

**Kim için:** CRM’de katalog / tip / kural / item düzenleyenler; “hangi alanı ne seçmeliyim?” sorusuna cevap.  
**Kapsam:** `TYPE_BEHAVIORS_DB_ROADMAP.md` § 11b’nin canlı karşılığı (tip davranışı **ve** snap aynı rehberde) + tüm ürün tabloları.  
**Alan açıklamaları:** §5’te **her kolon ayrı** alt başlık + Ne/Neden/Nasıl/Sahne/Örnek/Karıştırma/Kod tablosu (gruplu “width/depth/height” satırı yok).  
**Teknik envanter (kolon listesi, mapper, test):** [`DATABASE.md`](DATABASE.md).  
**Pose / snap hedef sözleşmesi:** [`SCENE_POSE.md`](SCENE_POSE.md).  
**Ertelenen / silinecek alanlar:** [`PENDING_ITEM_DECISIONS.md`](PENDING_ITEM_DECISIONS.md).  
**Dizin:** [`README.md`](README.md).

---

## 1. Veri nasıl sahneye gelir?

PostgreSQL `fair_stand` şeması **kalıcı kaynak**. Stand uygulaması (tarayıcı) her açılışta **bir kez** catalog bootstrap API’sinden JSON alır; tip davranışları, snap kuralları ve item listesi **bellekte** tutulur. CRM’de yaptığın değişiklik stand’da **sayfa yenilenene kadar** görünmez.

| Katman | Ne tutar |
|---|---|
| **DB** | Tüm katalog + müşteri projeleri |
| **Bootstrap** | DB → API → stand registry (oturumluk) |
| **`fair_stand_projects.payload`** | Müşterinin modül konumları, renkler, görseller (proje örneği) |

**Yetki:** Fair Stand tabloları Core DB’de yok; org izolasyonu `organization_id` + Core permission kodları ile.

### 1.1 Bootstrap paketi (`GET /api/v1/fair-stand/catalog/bootstrap`)

Kod: `get_catalog_bootstrap.py` → `routes.py`; stand `catalogBootstrap.js` ile yükler.

| JSON anahtarı | DB kaynağı | Stand’da kim okur | Filtre (bootstrap) |
|---|---|---|---|
| `revision` | SHA256 özet | cache/debug | — |
| `categories` | `fair_stand_categories` | `catalog.js` | `is_active=true` |
| `items` | `fair_stand_items` + child tablolar | `items.js` registry | `items.is_active=true` (**`catalog_visible=false` gizli SKU’lar dahil**) |
| `previewKinds` | `fair_stand_catalog_preview_kinds` | kart silüeti | **filtre yok** (pasif önizlemeler de gelir) |
| `itemTypes` | `fair_stand_item_type` + overlap junction | `initializeItemTypeRegistry` | `is_active=true` |
| `ruleTypes` | `fair_stand_rule_type` | API’de var; stand JS ayrı registry **açmaz** | `is_active=true` |
| `rules` | `fair_stand_rule` + `fair_stand_rule_item_type` | `initializeSnapRuleRegistry` | `is_active=true` |
| `standDimensions` | `fair_stand_dimensions` id=1 | `standDimensions.js` | singleton |
| `settings` | `fair_stand_settings` id=1 | `runtimeSettings.js` | singleton |

Item bootstrap alanları mapper’dan: `snapRequiresRuleId` + denorm `snapRequires` (kural `key`); provides için aynı (`item_mapper.py`).

---

### 1.2 Tablo envanteri (ürün şeması)

`models.py` + Alembic head **`0033_item_type_overlap_fk`** (2026-09). Junction’lar ayrı tablo sayılır.

| Tablo | Rol |
|---|---|
| `fair_stand_categories` | Katalog grupları |
| `fair_stand_catalog_preview_kinds` | Kart silüeti |
| `fair_stand_item_type` | Tip davranış paketi |
| `fair_stand_item_type_overlap` | Tip ↔ tip çakışma izni (M:N) |
| `fair_stand_rule_type` | Kural ailesi (bugün `snap`) |
| `fair_stand_rule` | Snap kuralı (key, face, edge) |
| `fair_stand_rule_item_type` | Kural ↔ tip provides link (M:N) |
| `fair_stand_items` | SKU kökü |
| `fair_stand_item_*` | Ölçü, recipe, asset, vitrin parçaları… |
| `fair_stand_dimensions` / `fair_stand_settings` | Stand zarfı + runtime UI |
| `fair_stand_projects` / `fair_stand_project_assets` | Müşteri projesi |
| `alembic_version` | Migrasyon kilidi (ürün değil) |

---

## 2. İki ayrı dil (karıştırma)

Sahne davranışının büyük kısmı **Item tipi** (`fair_stand_item_type`) ve **Snap kuralı** (`fair_stand_rule`) ile tanımlanır. Birbirinin yerine geçmez.

```text
┌─────────────────────────────────────────────────────────────────┐
│  TİP DAVRANIŞI (fair_stand_item_type)                           │
│  Aynı tipteki TÜM SKU’lar aynı paketi miras alır.                │
│  Örn: placement=wall, move_snap_cm=50, magnetic_snap=standard   │
│  → duvara mı oturur, sürüklerken 50 cm ızgara, manyetik joint   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  SNAP KURALI (fair_stand_rule + tip link + item requires/provides)│
│  “Kim kime yapışır?” — eşleşen rule id + face/edge              │
│  Örn: top-rail → projektör profil üst kenarına                  │
│       shelf-rail → raf panel ön yüz üst kenarına                │
└─────────────────────────────────────────────────────────────────┘
```

| Soru | Nereye bak |
|---|---|
| Modül duvara mı, zeminde mi, overlay mi? | Item **tipi** → `placement` |
| Sürüklerken 10 / 20 / 50 cm adım? | Item **tipi** → `move_snap_cm` |
| Short-up dikme birleşimi? | Item **tipi** → `magnetic_snap` = `short-up-joint` |
| Projektör profile nasıl snap olur? | **Kural** `top-rail` + item `snap_requires` / host `snap_provides` veya kural↔tip link |
| Çarpışma kutusu şerit mi taban mı? | Item **tipi** → `collision` |
| Kettle buzdolabının üstüne binebilir mi? | Item **tipi** → overlap (M:N `fair_stand_item_type_overlap`) |

**Overlap seçimi:** CRM’de tip A’nın listesine tip B’yi eklersen, motor `canModulesOverlapByBehavior` ile **çift yönlü** kontrol eder (A listesinde B **veya** B listesinde A yeter).

**Instance konum** (`modules[].placement.xCm/yCm/zCm`) proje JSON’undadır; tip davranışı değildir. ZIP export tip alanlarını taşımaz; açılınca güncel tip kaydından okunur.

### 2.1 Tip alanı → motor (kod doğrulaması)

| `fair_stand_item_type` | Stand fonksiyon / etki |
|---|---|
| `placement` | Yerleştirme planlayıcı / duvar vs free vs overlay |
| `move_snap_cm` | `getModuleMoveSnapCm` |
| `collision` | `getModuleCollisionStrategy` |
| `magnetic_snap` | `getModuleMagneticSnapStrategy`, `requiresShortUpJointSnap` |
| `allow_side_insert` | Yana ekleme politikası (`getModuleBehavior`) |
| `supports_wall_overlay_mount` | `supportsWallOverlayMount` |
| `wall_capacity` | `countsTowardWallCapacity` |
| `connection_endpoint` | `usesLogicalFixtureEndpoint` |
| `collision_depth` | `usesWallBackboneCollisionDepth` |
| `endpoint_contact` | `allowsThinWallEndpointContact` |
| `boundary_snap` | `usesWallInnerFaceBoundary` |
| `collision_height` | `getModuleCollisionHeightRangeCm` (v1: `full`) |
| `overlap` junction | `canModulesOverlapByBehavior` |
| `ghost_*` | `getModuleGhostBehavior` |

| Snap | Stand fonksiyon / etki |
|---|---|
| Item `snap_requires_rule_id` | `getItemSnapSpec` → hangi kural aranıyor + rule `face`/`edge` |
| Item `snap_provides_rule_id` **veya** kural↔tip link | `itemProvidesSnapRule` → host adayı |
| Recipe child provides | `itemSnap.js` `resolveProvider` — parent modül, child SKU host sayılır (sanal provider) |

**Provides üç yolu (kod):** (1) Item `snapProvidesRuleId` / `snapProvides` key, (2) Item tipi kuralın `itemTypeKeys` listesinde, (3) recipe içinde child item provides. Requires **yalnız item FK** (tip başına tek kural epic hariç).

---

## 3. CRM ekran haritası

| CRM sayfası | DB tabloları | Tipik iş |
|---|---|---|
| Katalog kategorileri | `fair_stand_categories` | Sol menü grupları |
| Önizleme türleri | `fair_stand_catalog_preview_kinds` | Kart silüeti HTML/CSS |
| Item tipleri | `fair_stand_item_type` (+ overlap) | Davranış paketi (placement, collision, …) |
| Kural türleri | `fair_stand_rule_type` | Bugün yalnız `snap` |
| Kurallar | `fair_stand_rule`, `fair_stand_rule_item_type` | top-rail, shelf-rail, face/edge, hangi tip provides |
| Items | `fair_stand_items` + child tablolar | SKU, tip seçimi, snap requires/provides, ölçü, recipe |
| Temel ayarlar | `fair_stand_dimensions`, `fair_stand_settings` | Stand zarfı + upload/import butonları |
| Projeler (stand) | `fair_stand_projects`, `fair_stand_project_assets` | Müşteri tasarımı (ayrı akış) |

Form ipuçları: fair-crm `adminLabels` (`fairStandItemTypesField*`, `fairStandItemsFieldSnap*`).

---

## 4. Karar rehberi — ne zaman neyi değiştirirsin?

### 4.1 Yeni ticari ürün (SKU)

1. **Item tipi** var mı? Yoksa önce tip oluştur (davranış paketi dolu).
2. **Item** oluştur: `item_key`, `name`, **item_type** (FK), ölçüler.
3. Katalogda görünecekse: `catalog_visible=true`, kategori, sıra, preview.
4. Snap ihtiyacı varsa (raf, projektör, …): item’da **yalnız biri** — `snap_requires_rule_id` **veya** `snap_provides_rule_id`.
5. Bileşik ürün (duvar paketi): `composition_mode=recipe` + `fair_stand_item_components` child satırları.

### 4.2 Projektör → profil üstü (örnek)

| Parça | Ayar |
|---|---|
| Kural | `top-rail`, face=`top`, edge=`top` |
| Kural ↔ tip | `profile` tipi kurala bağlı (provides tarafı) |
| Profil item | `snap_provides_rule_id` = top-rail **veya** boş bırak (tip link yeter) |
| Projektör item | `snap_requires_rule_id` = top-rail; tip `led-floodlight`, `placement=top`, `default_z_cm` kot |
| Davranış | Projektör tipinde `wall_capacity=exclude`, `move_snap_cm` ince adım (seed: 10) |

Motor: moving item’ın requires kuralı = host’un provides (item FK veya recipe child veya **aynı kurala bağlı tip**).

### 4.3 Raf → panel (örnek)

| Parça | Ayar |
|---|---|
| Kural | `shelf-rail`, face=`front`, edge=`top` |
| Kural ↔ tip | `panel`, `separator-panel` |
| Raf item | `snap_requires_rule_id` = shelf-rail |
| Panel item | provides (tip link veya item FK) |

Z kotu: panel band seam’lerine göre `itemSnap.js` (host yüksekliği; pitch çoğunlukla `WALL_PANEL_BAND_PITCH_CM` veya modül `strips[]` varsa yükseklik/strip sayısı).

### 4.4 Yeni davranış ailesi (ör. yeni mobilya tipi)

Yeni **`fair_stand_item_type.key`** aç; tüm zorunlu kolonları doldur (CRM formu zorunlu kılar). Mevcut tipe en yakın satırı kopyala, sonra farkları değiştir. **Aynı tip altındaki tüm item’lar** anında aynı davranışı alır (refresh sonrası).

---


## 5. Tablolar — alan rehberi (tek tek)

Her kolon aynı şablonda anlatılır:

| Başlık | Anlam |
|---|---|
| **Ne** | Kolon ne tutar |
| **Neden** | Hangi ürün / UX sorununu çözer |
| **Nasıl** | CRM’de ne zaman, hangi değer |
| **Sahne** | Stand uygulamasında ne olur |
| **Örnek** | Seed veya bilinen SKU |
| **Karıştırma** | Yanlış eşlenen benzer alan |
| **Kod** | Doğrulama için okuyucu dosya |

---

### 5.1 `fair_stand_categories`

#### `id`

| | |
|---|---|
| **Ne** | Tam sayı grup kimliği (PK, autoincrement) |
| **Neden** | Kategori adı değişse item satırı kopmasın |
| **Nasıl** | CRM oluşturur; elle değiştirme |
| **Sahne** | Bootstrap `categoryId`; item FK |
| **Örnek** | `1` = Panel & Duvar grubu |
| **Karıştırma** | `catalog_index` sıra numarası, id değil |
| **Kod** | `fair_stand_items.category_id` |

#### `catalog_name`

| | |
|---|---|
| **Ne** | Katalog sol menüde görünen grup adı |
| **Neden** | Ürünleri kullanıcı dilinde gruplamak |
| **Nasıl** | Kısa, aranabilir; teknik key değil |
| **Sahne** | Katalog sekme başlığı |
| **Örnek** | `Panel & Duvar`, `Extra` |
| **Karıştırma** | Item `name` tek SKU adıdır |
| **Kod** | `catalog.js` |

#### `catalog_index`

| | |
|---|---|
| **Ne** | Menüdeki görüntüleme sırası (>0, unique) |
| **Neden** | Id’den bağımsız sıralama |
| **Nasıl** | 1,2,3… benzersiz; araya girmek için index kaydır |
| **Sahne** | Kategori listesi sort |
| **Örnek** | Duvarlar `1`, Mobilya `5` |
| **Karıştırma** | `catalog_item_index` grup **içi** SKU sırası |
| **Kod** | Bootstrap `catalogIndex` |

#### `is_active`

| | |
|---|---|
| **Ne** | Grup soft-delete bayrağı |
| **Neden** | Menüden kaldır, geçmiş item FK’sını kırma |
| **Nasıl** | `false` → bootstrap’a girmez, yeni item bağlanamaz |
| **Sahne** | Pasif grup yok |
| **Örnek** | Test kategorisi pasif |
| **Kod** | `list_active_categories` |

#### `created_at`

| | |
|---|---|
| **Ne** | Kategori satırının oluşturulma zamanı (timestamptz) |
| **Neden** | Audit; hangi CRM oturumunda açıldı |
| **Nasıl** | Sunucu yazar; CRM’de düzenlenmez |
| **Sahne** | Okunmaz |
| **Karıştırma** | `updated_at` son düzenleme |
| **Kod** | DB only |

#### `updated_at`

| | |
|---|---|
| **Ne** | Kategori satırının son güncellenme zamanı |
| **Neden** | Audit |
| **Nasıl** | Her CRM kaydında otomatik |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

---

### 5.2 `fair_stand_catalog_preview_kinds`

#### `id`

Kart tipi PK; item `preview_id` FK.

#### `display_name`

| | |
|---|---|
| **Ne** | Admin ve item formunda silüet tipinin adı |
| **Neden** | `markup`/`css` seçerken insan okunur etiket |
| **Nasıl** | “Duvar panel 200”, “Raf silüeti” gibi |
| **Sahne** | CRM seçim listesi |
| **Örnek** | Preview id `20` raf kartı |
| **Kod** | Bootstrap `previewKinds[].displayName` |

#### `markup`

| | |
|---|---|
| **Ne** | Katalog kartının HTML iskeleti |
| **Neden** | 3D açmadan hızlı grid |
| **Nasıl** | `data-preview-width` ile genişliğe uyum; davranış tanımlamaz |
| **Sahne** | Yalnız katalog grid |
| **Örnek** | `module-drag-shelf` sınıflı div |
| **Karıştırma** | GLB model yolu |
| **Kod** | `catalogPreviewRenderer.js` |

#### `css_code`

| | |
|---|---|
| **Ne** | Silüetin CSS kuralları |
| **Neden** | Markup’ın görünümü |
| **Nasıl** | Preview id ile eşleşen sınıflar |
| **Sahne** | Kart rengi, oran, gölge |
| **Kod** | Aynı renderer |

#### `sort_index`

Admin listesinde önizleme türlerinin sırası.

#### `is_active`

Pasif önizleme yeni **görünür** item’da seçilemez. Bootstrap tüm preview’ları gönderebilir (filtre yok).

#### `created_at`

| | |
|---|---|
| **Ne** | Önizleme türü satırının oluşturulma zamanı |
| **Neden** | Audit |
| **Nasıl** | Sunucu yazar |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

#### `updated_at`

| | |
|---|---|
| **Ne** | Önizleme türünün son güncellenme zamanı |
| **Neden** | Audit |
| **Nasıl** | CRM kaydında otomatik |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

---

### 5.3 `fair_stand_item_type`

Aynı `item_type` altındaki **tüm SKU’lar** aynı paketi miras alır. Item satırında davranış override **yok**.

#### `key`

| | |
|---|---|
| **Ne** | Tip kodu (`flat-panel`, `shelf`, …) |
| **Neden** | Davranışı onlarca SKU’da tek yerden yönetmek |
| **Nasıl** | Slug; değişince FK cascade (`onupdate CASCADE`) |
| **Sahne** | `module.type` bootstrap’tan |
| **Örnek** | `wall_100` item → tip `flat-panel` |
| **Karıştırma** | `item_key` |
| **Kod** | `getItemType` |

#### `display_name`

CRM’de okunan tip etiketi (Projektör, Raf, …).

#### `placement`

| | |
|---|---|
| **Ne** | Modülün sahneye **oturma modu** (snap kuralı değil) |
| **Neden** | Duvar hattı, zemin, overlay, üst yüzey farklı yerleştirme motorları |
| **Nasıl** | Duvar paneli `wall`; koltuk `free`; raf/TV `wall-overlay`; projektör `top` |
| **Sahne** | Planner: duvara mı snap, serbest mi, overlay mi |
| **Örnek** | `shelf`→`wall-overlay`; `led-floodlight`→`top`; `counter`→`free` |
| **Karıştırma** | `modules[].placement` instance XY; `top-rail` snap **kuralı** |
| **Kod** | `getModuleBehavior` → planner |

#### `collision`

| | |
|---|---|
| **Ne** | Çarpışma hacminin şekli |
| **Neden** | Duvar ince şerit; mobilya taban kutusu; overlay çarpışmasız |
| **Nasıl** | Duvar `segment`; zemin mobilya `footprint` veya `none` |
| **Sahne** | Yerleştirirken başka modülle çakışma |
| **Örnek** | `flat-panel` `segment`; `sofa-single-classic` `none` |
| **Karıştırma** | Snap requires/provides |
| **Kod** | `getModuleCollisionStrategy` |

#### `move_snap_cm`

| | |
|---|---|
| **Ne** | Sürüklerken XY **ızgara adımı** (cm) |
| **Neden** | Duvar 50 cm modül grid; raf ince 10 cm |
| **Nasıl** | Pozitif tam sayı: 10 / 20 / 50 |
| **Sahne** | Bırakınca konum yuvarlanır |
| **Örnek** | `flat-panel` 50; `shelf` 10; `led-floodlight` 20 |
| **Karıştırma** | `magnetic_snap`, `top-rail` |
| **Kod** | `getModuleMoveSnapCm` |

#### `magnetic_snap`

| | |
|---|---|
| **Ne** | Duvar birleşiminde manyetik hizalama |
| **Neden** | Normal duvar birleşimi vs short-up joint vs overlay kapalı |
| **Nasıl** | `standard` / `none` / `short-up-joint` |
| **Sahne** | Komşu modüle yapışma |
| **Örnek** | `upright` `short-up-joint`; `profile` `standard`; `shelf` `none` |
| **Kod** | `getModuleMagneticSnapStrategy` |

#### `allow_side_insert`

| | |
|---|---|
| **Ne** | Modülün yanına başka modül eklenebilir mi |
| **Neden** | Raf yan ekleme kapalı; duvar açık |
| **Nasıl** | bool CRM checkbox |
| **Sahne** | Sağ tık “yana kopyala” / katalog yan ekleme |
| **Örnek** | `shelf` false; `flat-panel` true |
| **Kod** | `getModuleBehavior`, `allowsModuleSideInsert` |

#### `supports_wall_overlay_mount`

| | |
|---|---|
| **Ne** | Bu tip **host** olarak üzerine raf/TV overlay konabilir mi |
| **Neden** | Düz panel host; raf overlay tüketici |
| **Nasıl** | Duvar paneli true; raf tipi false |
| **Sahne** | Overlay mount planner |
| **Örnek** | `flat-panel` true; `shelf` false |
| **Kod** | `supportsWallOverlayMount` |

#### `wall_capacity`

| | |
|---|---|
| **Ne** | Duvar kapasite sayacına dahil mi |
| **Neden** | Panel sayılır; raf/projektör/dikme sayılmaz |
| **Nasıl** | `include` / `exclude` |
| **Sahne** | Kapasite UI / limit hesabı |
| **Örnek** | `led-floodlight`, `shelf`, `upright` → exclude |
| **Kod** | `countsTowardWallCapacity` |

#### `connection_endpoint`

| | |
|---|---|
| **Ne** | Modül uç birleşim modeli |
| **Neden** | Duvar şerit ucu vs banko mantıksal fixture |
| **Nasıl** | Panel `segment`; banko/baza `logical-fixture` |
| **Sahne** | Uç birleşim / yan ekleme geometrisi |
| **Örnek** | `counter`, `base` → logical-fixture |
| **Kod** | `usesLogicalFixtureEndpoint` |

#### `collision_depth`

| | |
|---|---|
| **Ne** | Derinlik yönünde çarpışma modeli |
| **Neden** | Normal kutu vs duvar omurgası |
| **Nasıl** | Çoğu `physical`; `base-wall` → `wall-backbone` |
| **Sahne** | Derinlik çarpışması |
| **Örnek** | `base-wall` wall-backbone |
| **Kod** | `usesWallBackboneCollisionDepth` |

#### `endpoint_contact`

| | |
|---|---|
| **Ne** | Modül uç temas kuralı |
| **Neden** | İnce duvar ucunda bitki/saksı |
| **Nasıl** | `standard` veya `thin-wall-endpoint` |
| **Sahne** | Uç temas / placement |
| **Örnek** | `indoor-plant-1` thin-wall-endpoint |
| **Kod** | `allowsThinWallEndpointContact` |

#### `boundary_snap`

| | |
|---|---|
| **Ne** | Stand sınırına yaslama modu |
| **Neden** | Stand dış kenarı vs iç duvar yüzü |
| **Nasıl** | `stand-edge` veya `wall-inner-face` |
| **Sahne** | Sınır snap |
| **Örnek** | `sofa-set-classic` wall-inner-face |
| **Kod** | `usesWallInnerFaceBoundary` |

#### `collision_height`

| | |
|---|---|
| **Ne** | Dikey çarpışma kapsamı |
| **Neden** | v1 tek seçenek |
| **Nasıl** | Yalnız `full` |
| **Sahne** | Tam gövde yüksekliği boyunca çarpışma |
| **Kod** | `getModuleCollisionHeightRangeCm` |

#### `ghost_kind`

| | |
|---|---|
| **Ne** | Sürükleme hayaleti **davranış sınıfı** (ör. silhouette) |
| **Neden** | Modül taşınırken gerçek mesh yerine hafif önizleme |
| **Nasıl** | Seed ile gelen default’u koru; yeni değer motor desteklemeden ekleme |
| **Sahne** | Hayalet çizim modu seçimi |
| **Örnek** | `silhouette` |
| **Karıştırma** | `ghost_renderer` hangi çizici; `ghost_opacity` saydamlık |
| **Kod** | `getModuleGhostBehavior` |

#### `ghost_renderer`

| | |
|---|---|
| **Ne** | Hayalet geometrisini çizen renderer anahtarı |
| **Neden** | Tip bazında farklı silüet çizimi |
| **Nasıl** | Örn. `module-silhouette` |
| **Sahne** | Taşıma sırasında ghost mesh üretimi |
| **Örnek** | `module-silhouette` |
| **Karıştırma** | `ghost_kind` sınıf adı |
| **Kod** | `getModuleGhostBehavior` |

#### `ghost_opacity`

| | |
|---|---|
| **Ne** | Hayalet opaklığı (0–1, Numeric) |
| **Neden** | Alttaki sahneyi göstererek hizalamayı kolaylaştırma |
| **Nasıl** | 0.38 seed default; aşırı düşük = görünmez, yüksek = gerçek modüle benzer |
| **Sahne** | Ghost materyal alpha |
| **Örnek** | `0.38` |
| **Karıştırma** | `default_color` gerçek modül rengi |
| **Kod** | `getModuleGhostBehavior` |

#### `is_active`

| | |
|---|---|
| **Ne** | Tip soft-delete bayrağı |
| **Neden** | Eski tipi kapat, geçmiş item FK’sını kırma |
| **Nasıl** | `false` → bootstrap `itemTypes`’a girmez; yeni item’da seçme |
| **Sahne** | Pasif tip yok |
| **Kod** | `list_item_types(active_only=True)` |

#### `created_at`

| | |
|---|---|
| **Ne** | Tip satırının oluşturulma zamanı |
| **Neden** | Audit |
| **Nasıl** | Sunucu yazar |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

#### `updated_at`

| | |
|---|---|
| **Ne** | Tip satırının son güncellenme zamanı |
| **Neden** | Audit |
| **Nasıl** | CRM kaydında otomatik |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

### 5.3b `fair_stand_item_type_overlap` (junction)

#### `item_type_id`

| | |
|---|---|
| **Ne** | FK → `fair_stand_item_type.id` (PK parçası) |
| **Neden** | “Bu tip, listedeki tiplerle çarpışsa bile üst üste binebilir” |
| **Nasıl** | CRM item type formunda overlap multi-select satırı |
| **Sahne** | Bootstrap `overlapWithTypes` |
| **Örnek** | mini-fridge tip id |
| **Kod** | `canModulesOverlapByBehavior` |

#### `overlap_item_type_id`

| | |
|---|---|
| **Ne** | FK → izin verilen diğer tip id (PK parçası) |
| **Neden** | M:N overlap listesi |
| **Nasıl** | Her seçilen tip için bir junction satırı |
| **Sahne** | Motor **çift yönlü OR** kontrol eder |
| **Örnek** | kettle tip id |
| **Karıştırma** | Snap provides değil |
| **Kod** | `overlapItemTypeIds` bootstrap |

---

### 5.4 `fair_stand_rule_type`

#### `id`

| | |
|---|---|
| **Ne** | Kural türü PK (autoincrement) |
| **Neden** | `fair_stand_rule.rule_type_id` FK |
| **Nasıl** | CRM oluşturur |
| **Sahne** | Bootstrap `ruleTypes[].id` |
| **Kod** | `fair_stand_rule` FK |

#### `key`

| | |
|---|---|
| **Ne** | Kural ailesi kodu (unique) |
| **Neden** | İleride snap dışı türler |
| **Nasıl** | Bugün pratikte yalnız `snap` |
| **Örnek** | `snap` |
| **Karıştırma** | `fair_stand_rule.key` tek snap kuralı adı |
| **Kod** | Bootstrap `ruleTypes[].key` |

#### `display_name`

| | |
|---|---|
| **Ne** | CRM’de kural türünün görünen adı |
| **Neden** | Form etiketi |
| **Nasıl** | İnsan dili |
| **Sahne** | Okunmaz (yalnız admin) |
| **Kod** | CRM |

#### `is_active`

| | |
|---|---|
| **Ne** | Kural türü soft-delete |
| **Neden** | Türü gizle |
| **Nasıl** | Pasif tür altında yeni kural açma |
| **Sahne** | Bootstrap filtre |
| **Kod** | `list_rule_types` |

#### `created_at`

| | |
|---|---|
| **Ne** | Satır oluşturulma zamanı |
| **Neden** | Audit |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

#### `updated_at`

| | |
|---|---|
| **Ne** | Satır güncellenme zamanı |
| **Neden** | Audit |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

---

### 5.5 `fair_stand_rule`

#### `id`

| | |
|---|---|
| **Ne** | Snap kuralı PK |
| **Neden** | Item `snap_requires_rule_id` / `snap_provides_rule_id` FK |
| **Nasıl** | CRM oluşturur |
| **Sahne** | Bootstrap `rules[].id` |
| **Kod** | `item_mapper` denorm key |

#### `rule_type_id`

| | |
|---|---|
| **Ne** | FK → `fair_stand_rule_type.id` |
| **Neden** | Kural hangi aileye ait |
| **Nasıl** | Yeni kuralda `snap` türünü seç |
| **Örnek** | `snap` türü id |
| **Kod** | Model FK |

#### `key`

| | |
|---|---|
| **Ne** | Snap kuralının kalıcı slug’ı |
| **Neden** | Requires/provides eşleşmesi bootstrap’ta key ile |
| **Nasıl** | `top-rail`, `shelf-rail`; değiştirme cascade riski |
| **Sahne** | `getSnapRule('top-rail')` |
| **Örnek** | Projektör ↔ top-rail |
| **Karıştırma** | `rule_type.key` = aile |
| **Kod** | `rules[]` bootstrap |

#### `display_name`

| | |
|---|---|
| **Ne** | CRM listesinde kural adı |
| **Neden** | Operatör okunurluğu |
| **Nasıl** | Türkçe açıklayıcı |
| **Sahne** | Okunmaz |
| **Kod** | CRM |

#### `face`

| | |
|---|---|
| **Ne** | Snap’in bağlandığı host **yüzü** (`front`, `back`, `top`, …) |
| **Neden** | Aynı modülde farklı yüzler farklı snap hattı |
| **Nasıl** | CRM `SNAP_FACES` kümesi; **edge ile birlikte** dolu veya ikisi NULL |
| **Sahne** | Mount geometrisi, Z/kenar mantığı |
| **Örnek** | top-rail: `top`; shelf-rail: `front` |
| **Karıştırma** | `edge` kenar; legacy `snap_anchor` |
| **Kod** | `getItemSnapSpec`, `itemSnap.js` |

#### `edge`

| | |
|---|---|
| **Ne** | Seçilen yüz üzerindeki **kenar** (`top`, `bottom`, …) |
| **Neden** | Üst ray vs raf üst hattı ayrımı |
| **Nasıl** | face ile eşle; CHECK ikisi birlikte |
| **Sahne** | `isTopRailMount` / `isShelfRailMount` |
| **Örnek** | top-rail: face `top`, edge `top` |
| **Karıştırma** | `move_snap_cm` sürükleme ızgarası |
| **Kod** | `itemSnap.js` |

#### `is_active`

| | |
|---|---|
| **Ne** | Kural soft-delete |
| **Neden** | Eski kuralı kapat |
| **Nasıl** | Pasif kural yeni item FK’sında seçilmemeli |
| **Sahne** | Bootstrap filtre |
| **Kod** | `list_rules(active_only=True)` |

#### `created_at`

| | |
|---|---|
| **Ne** | Kural oluşturulma zamanı |
| **Neden** | Audit |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

#### `updated_at`

| | |
|---|---|
| **Ne** | Kural güncellenme zamanı |
| **Neden** | Audit |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

---

### 5.6 Snap junction ve item FK’ları

#### `fair_stand_rule_item_type.rule_id`

| | |
|---|---|
| **Ne** | Junction PK parçası — hangi snap kuralı |
| **Neden** | Kural ↔ tip M:N |
| **Nasıl** | Kural formunda tip multi-select eklerken yazılır |
| **Sahne** | `itemProvidesSnapRule` tip eşleşmesi |
| **Örnek** | top-rail satırı + profile tip id |
| **Karıştırma** | Item `snap_requires_rule_id` arayan taraf |
| **Kod** | Bootstrap `rules[].itemTypeKeys` |

#### `fair_stand_rule_item_type.item_type_id`

| | |
|---|---|
| **Ne** | Junction PK parçası — hangi item tipi **provides** |
| **Neden** | O tipteki tüm SKU’lar host sayılabilir |
| **Nasıl** | Kural ekranında tip seç |
| **Sahne** | Profil item’da provides FK boş olsa bile host |
| **Örnek** | shelf-rail → panel, separator-panel |
| **Kod** | `itemProvidesSnapRule` |

---

### 5.7 `fair_stand_items` — kimlik ve katalog

#### `item_key`

| | |
|---|---|
| **Ne** | Canonical SKU (snake_case, PK) |
| **Neden** | Proje, BOM, FK tek kimlik |
| **Nasıl** | Bir kez ver, değiştirme |
| **Örnek** | `wall_200`, `profile_190`, `plastic_trash_bin` |
| **Kod** | Bootstrap `itemKey` |

#### `name`

Ticari / katalog görünen ad (Türkçe).

#### `item_type`

FK → `fair_stand_item_type.key`; tüm davranış paketini seçer.

#### `unit`

BOM birimi (`adet`, `m`); boş olabilir.

#### `catalog_visible`

| | |
|---|---|
| **Ne** | Sol katalog menüsünde listelenir mi |
| **Neden** | Gizli parça (profil, panel leaf) recipe’de kalır |
| **Nasıl** | false → menüde yok; bootstrap’ta item **var** |
| **Örnek** | `panel_48_5` false; `wall_100` true |
| **Karıştırma** | `is_active=false` registry’den tamamen düşer |
| **Kod** | `catalog.js` |

#### `category_id`

| | |
|---|---|
| **Ne** | FK → `fair_stand_categories.id` |
| **Neden** | SKU hangi katalog sekmesinde |
| **Nasıl** | `catalog_visible=true` iken zorunlu |
| **Sahne** | Katalog filtre |
| **Örnek** | Duvar grubu id |
| **Karıştırma** | `item_type` davranış tipi değil menü grubu |
| **Kod** | Bootstrap `categoryId` |

#### `catalog_item_index`

| | |
|---|---|
| **Ne** | Grup **içinde** kart sırası |
| **Neden** | Aynı kategoride SKU sıralaması |
| **Nasıl** | Görünür item’da zorunlu, unique per category |
| **Sahne** | Grid sort |
| **Karıştırma** | `catalog_index` kategori sırası |
| **Kod** | `catalog.js` |

#### `preview_id`

| | |
|---|---|
| **Ne** | FK → `fair_stand_catalog_preview_kinds.id` |
| **Neden** | Kart silüeti HTML/CSS |
| **Nasıl** | Görünür item’da zorunlu |
| **Sahne** | Katalog kart renderer |
| **Örnek** | Duvar 200 silüeti |
| **Karıştırma** | GLB `asset_role=model` |
| **Kod** | Bootstrap `previewId` |

#### `is_active`

| | |
|---|---|
| **Ne** | SKU soft-delete |
| **Neden** | Bootstrap’tan çıkar, DB satırı kalır |
| **Nasıl** | Pasif yapmadan önce projelerde kullanım kontrol |
| **Sahne** | `getItem` yok → proje kırılır |
| **Kod** | `list_items(active_only=True)` |

---

### 5.7b `fair_stand_items` — GLB yönelimi

Three.js **Y-up**. `placement.rotationZDeg` = kullanıcı/plan döndürmesi (Shift+R). Aşağıdakiler GLB **iç eksen** düzeltmesi; her yerleştirmede değişmez.

#### `model_rotation_y_deg`

| | |
|---|---|
| **Ne** | GLB mesh’inin yerel **Y** ekseni etrafında sabit derece |
| **Neden** | Export ekseni stand ile uyuşmuyor (model yan modellenmiş) |
| **Nasıl** | Sahneye koy, 0/90/-90/180 dene; sonra kutuya fit |
| **Sahne** | `model.rotation.y` → ardından ölçek kutusu |
| **Örnek** | `extra_long_planter_*`: **90**; çöp: **0** |
| **Karıştırma** | `rotation_step_deg`; `visual_rotation_y_deg` |
| **Kod** | `scene3d.js` `createIndoorPlantModule` |

#### `visual_rotation_y_deg`

| | |
|---|---|
| **Ne** | Mesh/grup için **ek** Y dönüşü (model rotation’dan ayrı katman) |
| **Neden** | Çöp kutusu kapak grubu; koltuk mesh seçimi + sırt yönü |
| **Nasıl** | Model rotation yetmezse doldur; çoğu duvar item **null** |
| **Sahne** | `trashVisualGroup.rotation.y` veya `attachBeigeSofaMesh` |
| **Örnek** | `plastic_trash_bin`: **-90**; tekli koltuk: **-135**; çiftli: **-45** |
| **Karıştırma** | Plan rotasyonu (`rotationZDeg`) değil |
| **Kod** | `scene3d.js`, `designState.js` |

#### `preserve_model_scale`

| | |
|---|---|
| **Ne** | GLB’yi item ölçü kutusuna zorla sığdırma (uniform scale) |
| **Neden** | Sanatçı ölçüsü bozulmasın (uzun saksı) |
| **Nasıl** | Uzun planter true; standart duvar false/null |
| **Örnek** | `extra_long_planter_100` true |
| **Kod** | `if (!preserveModelScale)` fit |

#### `default_color`

| | |
|---|---|
| **Ne** | Integer RGB (`16777215` = beyaz) |
| **Neden** | İlk yüzey/zemin rengi |
| **Nasıl** | Hex’i int olarak CRM |
| **Sahne** | Yeni modül `surfaceState.color` başlangıcı |
| **Karıştırma** | Proje içi kullanıcı rengi override eder |

#### `material`

Vitrin gövde malzemesi (`sunta`); yan/yatay panel uyumu.

#### `paintable`

| | |
|---|---|
| **Ne** | **Zemin** item’ı boyanabilir mi (`hali` vb.) |
| **Neden** | Parke seçeneği vs boyanabilir zemin |
| **Nasıl** | Zemin SKU true; duvar paneli değil |
| **Sahne** | Zemin seçiliyken renk paleti |
| **Karıştırma** | `accepts_color` panel yüzeyi içindir |
| **Kod** | `applyActiveColorToSelection` + `floorItem.paintable` |

#### `shape`

| | |
|---|---|
| **Ne** | Özel plan formu etiketi (bugün `L`) |
| **Neden** | L-banko modül fabrikası |
| **Nasıl** | Yalnız L-banko SKU’larda `L` |
| **Sahne** | `createLCounterModule` |
| **Karıştırma** | `variant` alt ayrım |
| **Kod** | `designState.js`, `scene3d.js` |

#### `variant`

| | |
|---|---|
| **Ne** | Aynı tip içinde alt ayrım (short-up, sarmasık) |
| **Neden** | Tip değiştirmeden SKU ailesi |
| **Nasıl** | Seed string |
| **Sahne** | Descriptor / contract |
| **Karıştırma** | `item_type` |
| **Kod** | `items.js`, `moduleContracts.js` |

#### `eye_count`

| | |
|---|---|
| **Ne** | Vitrin açıklık sayısı (2 veya 3) |
| **Neden** | Raf/şerit layout |
| **Nasıl** | Vitrin SKU’larda 2 veya 3 |
| **Sahne** | Showcase mesh |
| **Karıştırma** | `strip_count` |
| **Kod** | `scene3d.js`; backlog B.1 |

---

### 5.8 `fair_stand_items` — plan rotasyonu (Z)

#### `rotation_step_deg`

| | |
|---|---|
| **Ne** | Shift+R ile plan döndürme adımı (derece) |
| **Neden** | Item bazında ince/kaba adım |
| **Nasıl** | Rotasyon üçlüsünden biri; **üçü birlikte null veya birlikte dolu** |
| **Sahne** | `getModuleRotationStepDeg` |
| **Örnek** | `wall_200`: 90 |
| **Karıştırma** | `model_rotation_y_deg` |
| **Kod** | `moduleBehavior.js` |

#### `default_rotation_deg`

| | |
|---|---|
| **Ne** | İlk yerleştirmede `placement.rotationZDeg` |
| **Neden** | Katalogdan sürüklerken başlangıç açısı |
| **Nasıl** | Rotasyon üçlüsü ile birlikte |
| **Sahne** | Yeni modül |
| **Örnek** | `wall_200`: 0 |
| **Kod** | `getModuleDefaultRotationDeg` |

#### `side_insert_rotation`

| | |
|---|---|
| **Ne** | Yana eklemede açı kipi: `inherit` veya `default` |
| **Neden** | Yan ekleme ile varsayılan açı |
| **Nasıl** | Rotasyon üçlüsü ile birlikte |
| **Sahne** | `resolveSideInsertRotationDeg` |
| **Örnek** | `inherit` |
| **Karıştırma** | `allow_side_insert` |
| **Kod** | `moduleBehavior.js` |

---

### 5.9 `fair_stand_items` — duruş ve snap

#### `default_z_cm`

| | |
|---|---|
| **Ne** | Modül ilk yerleşince **yerden kot** (cm, NOT NULL, default 0) |
| **Neden** | Projektör/raf/strafor farklı Z; tavan türetilmez |
| **Nasıl** | Zemin 0; projektör item bazlı yüksek kot |
| **Sahne** | İlk `placement.zCm` |
| **Karıştırma** | `fair_stand_dimensions.height_cm` max clamp |
| **Kod** | `resolveItemDefaultZCm` |

#### `snap_requires_rule_id`

| | |
|---|---|
| **Ne** | FK → snap kural — modül **arayan** taraf |
| **Neden** | Raf, projektör host arar |
| **Nasıl** | `snap_provides_rule_id` ile **aynı anda dolu olamaz** |
| **Sahne** | `getItemSnapSpec` |
| **Örnek** | Raf → shelf-rail |
| **Kod** | `itemSnap.js` |

#### `snap_provides_rule_id`

| | |
|---|---|
| **Ne** | FK → snap kural — item **host override** |
| **Neden** | Tip junction yetmezse |
| **Nasıl** | Çoğu host’ta boş |
| **Sahne** | `itemProvidesSnapRule` |
| **Kod** | `listSnapHosts` |

#### `snap_target_item_type`

| | |
|---|---|
| **Ne** | Legacy hedef tip |
| **Nasıl** | **Null bırak** |
| **Sahne** | Okunmaz |
| **Kod** | — |

#### `snap_anchor`

| | |
|---|---|
| **Ne** | Legacy anchor |
| **Nasıl** | **Null**; yerine `face`/`edge` |
| **Sahne** | Okunmaz |
| **Kod** | — |

---

### 5.10 Yüzey yetenekleri — `is_render` ve `accepts_*`

#### Genel akış

1. CRM’de item bayrakları DB’ye yazılır → bootstrap (`acceptsColor`, …).
2. Modül sahneye kurulurken tıklanabilir mesh’lere `userData.accepts*` kopyalanır (`itemCapabilities.js`).
3. Kullanıcı aracı (renk, görsel, sağ tık menüsü) **bayrak false ise o yüzeyde çalışmaz**.
4. Uygulanan renk/görsel/kumaş/cam **proje** `modules[].surface` / `surfaceState` içinde saklanır; bayraklar sadece **izin kapısı**.

DB CHECK: `is_render=false` iken tüm `accepts_*` false olmalı.

#### `is_render`

| | |
|---|---|
| **Ne** | Bu SKU sahneye **3D modül** olarak çizilir mi |
| **Neden** | BOM parçası (iç panel, profil leaf) menüde değil, modül değil |
| **Nasıl** | Katalogdan seçilen ürünler true; recipe child leaf false |
| **Sahne** | false → mesh yok, accepts hepsi false |
| **Örnek** | `wall_200` true; `panel_48_5` false |
| **Kod** | Modül factory girişi |

#### `accepts_color`

| | |
|---|---|
| **Ne** | Seçili yüzeye **düz renk** (palet / Uygula) uygulanabilir mi |
| **Neden** | Kapı profili boyanmasın; duvar paneli boyansın |
| **Nasıl** | Duvar modülü true; salt BOM parçası false |
| **Sahne** | Renk paleti → `scene3d.applyColor`; `acceptsColor===false` mesh atlanır |
| **Örnek** | `wall_200`: true (seed/test) |
| **Karıştırma** | Lightbox **bez rengi** `fabricColor`; zemin **`paintable`** |
| **Kod** | `scene3d.js` applyColor; `itemCapabilities.js` |

#### `accepts_image`

| | |
|---|---|
| **Ne** | Yüzeye **görsel arşivden texture** (kaplama fotoğrafı) basılabilir mi |
| **Neden** | Logolu panel vs boyanabilir düz renk |
| **Nasıl** | Standart duvar paneli true; mobilya proxy çoğu false |
| **Sahne** | Görsel sürükle/yapıştır → `applyImageAsset`; map yoksa atlar |
| **Örnek** | `wall_200` true |
| **Karıştırma** | Lightbox bez görseli `fabricImageAssetId` ayrı akış |
| **Kod** | `scene3d.js` applyImageAsset |

#### `accepts_glass`

| | |
|---|---|
| **Ne** | Panel **cam moduna** geçebilir mi (şeffaf, cam malzeme) |
| **Neden** | Duvar panelinde cam seçeneği; koltukta anlamsız |
| **Nasıl** | Duvar flat-panel SKU true |
| **Sahne** | Sağ tık → “Cam Panele Çevir” / “Normal Panele Çevir” (`applyGlassMode`) |
| **Örnek** | `wall_200` true |
| **Karıştırma** | Vitrin **cam raf** geometry ayrı; bu duvar panel camı |
| **Kod** | `main.js` `changeContextPanelGlassMode`; `pickModuleContext` |

#### `accepts_lightbox`

| | |
|---|---|
| **Ne** | Panel grubu **Lightbox kumaş** (tek parça ışıklı bez) olabilir mi |
| **Neden** | Fuar ışıklı grafik duvarı |
| **Nasıl** | Duvar panel SKU true; seçim dikdörtgen blok + aynı düzlem kuralı |
| **Sahne** | Sağ tık → Lightbox Kumaşa Çevir; `fabricGroupId`, overlay mesh |
| **Örnek** | `wall_200` true |
| **Karıştırma** | **`accepts_mesh`** delikli branda; strafor modülü ayrı tip |
| **Kod** | `applyFabricMode`, `setFabricLighting` |

#### `accepts_mesh`

| | |
|---|---|
| **Ne** | Panel grubu **Mesh (delikli) branda** olabilir mi |
| **Neden** | Delikli baskı branda vs ışıklı lightbox |
| **Nasıl** | Duvar panel true; lightbox ile aynı anda bir panelde tek fabric tipi |
| **Sahne** | Sağ tık → Mesh Brandaya Çevir (`applyMeshMode`, `fabricType=mesh`) |
| **Örnek** | `wall_200` true |
| **Karıştırma** | Mesh **aydınlatılamaz**; lightbox aydınlatılır |
| **Kod** | `applyFabricCoverMode` |

#### CRM’de tipik kombinasyon

| SKU tipi | is_render | color | image | glass | lightbox | mesh |
|---|---|---|---|---|---|---|
| Duvar `wall_200` | evet | evet | evet | evet | evet | evet |
| BOM leaf `panel_48_5` | hayır | hayır | hayır | hayır | hayır | hayır |
| Koltuk GLB | evet | kısmi* | hayır | hayır | hayır | hayır |

\*Koltukta renk hedef mesh’ler `colorTargets` ile; yine item `accepts_color` bootstrap’tan gelir.

---

### 5.10 `fair_stand_items` — bileşim

#### `composition_mode`

Yalnız `recipe` veya null. `recipe` ⇒ `fair_stand_item_components` child satırları zorunlu (duvar paketi).

---

### 5.11 `fair_stand_item_dimensions`

Item başına en fazla bir satır (PK/FK `item_key`). JSON `dimensions.*`. CHECK: **en az bir** ölçü kolonu dolu.

#### `item_key`

| | |
|---|---|
| **Ne** | FK/PK → `fair_stand_items.item_key` |
| **Neden** | 1:1 ölçü satırı |
| **Nasıl** | Item ile cascade silinir |
| **Sahne** | Bootstrap item altında `dimensions` |
| **Kod** | `item_mapper.map_item` |

#### `width_cm`

| | |
|---|---|
| **Ne** | Fiziksel/BOM **genişlik** (W, cm) |
| **Neden** | Footprint X, katalog kartı metni, otomatik duvar panel eşlemesi, mesh kutusu |
| **Nasıl** | Duvar modülünde modül genişliği (50/100/150/200); leaf’te panel genişliği |
| **Sahne** | `resolveSceneDimensions` — scene override yoksa bu W |
| **Örnek** | `wall_200` → 200; `panel_50` → 50 |
| **Karıştırma** | `fair_stand_dimensions.height_cm` stand zarfı; `move_snap_cm` tip ızgarası; scene tablosundaki `width_cm` override |
| **Kod** | `items.js` `resolveAutomaticWallFlatPanelItemKey`, `resolveSceneDimensions` |

#### `depth_cm`

| | |
|---|---|
| **Ne** | Fiziksel/BOM **derinlik** (D, cm) |
| **Neden** | Zemin footprint, çarpışma tabanı (`collision=footprint`) |
| **Nasıl** | Mobilya/ekipman derinliği; ince duvarlarda profil derinliği |
| **Sahne** | Placement derinlik ekseni, GLB fit |
| **Örnek** | Koltuk seti derinliği |
| **Karıştırma** | `fair_stand_dimensions.depth_cm` duvar omurga kalınlığı (stand zarfı) |
| **Kod** | `resolveSceneDimensions`, factory |

#### `height_cm`

| | |
|---|---|
| **Ne** | Fiziksel/BOM **yükseklik** (H, cm) |
| **Neden** | Mesh ölçek, panel band aralığı, seçim geri bildirimi |
| **Nasıl** | Duvar/panel yüksekliği; sadece W olan flat-panel’de H boş olabilir (CHECK diğerleri) |
| **Sahne** | Collision yüksekliği tip tablosundan; H burada kutu |
| **Örnek** | Duvar 250 cm |
| **Karıştırma** | Stand `height_cm` tavan clamp; tip `collision_height` |
| **Kod** | `selectionFeedback.js`, `scene3d.js` |

#### `mount_height_cm`

| | |
|---|---|
| **Ne** | Eski **montaj kotu** (cm) — yerden yükseklik |
| **Neden** | Seed döneminde projektör vb. |
| **Nasıl** | Yeni işlerde **`default_z_cm`** kullan; legacy satırlar kalabilir |
| **Sahne** | `resolveItemDefaultZCm` hâlâ fallback okuyabilir |
| **Örnek** | Eski floodlight 350 |
| **Karıştırma** | `default_z_cm` item kök kolonu |
| **Kod** | `resolveItemDefaultZCm` |

#### `wall_gap_cm`

| | |
|---|---|
| **Ne** | Strafor/foam ile duvar arası **boşluk** (cm) |
| **Neden** | Aydınlatmalı strafor overlay derinliği |
| **Nasıl** | Yalnız ilgili SKU’larda (ör. illuminated-foam) |
| **Sahne** | Foam modülü duvara ofset |
| **Örnek** | Foam paketi gap |
| **Karıştırma** | `wall_gap` tip değil item ölçüsü |
| **Kod** | `designState.js` → `scene3d.js` |

---

### 5.12 `fair_stand_item_scene_dimensions`

Üretim/BOM ölçüsünden farklı **sahne slotu**. Yoksa motor `fair_stand_item_dimensions` kullanır.

#### `item_key`

| | |
|---|---|
| **Ne** | FK/PK → `fair_stand_items.item_key` |
| **Neden** | 1:1 sahne kutusu |
| **Nasıl** | Item silinince cascade |
| **Sahne** | Bootstrap `sceneDimensions` |
| **Kod** | `item_mapper` |

#### `width_cm`

| | |
|---|---|
| **Ne** | Sahne **genişlik** override (cm) |
| **Neden** | Üretim genişliği ≠ katalog/placement genişliği |
| **Nasıl** | Sadece fark varsa doldur; en az bir scene ölçüsü dolu CHECK |
| **Sahne** | `resolveSceneDimensions` **önce** scene, sonra dimensions |
| **Örnek** | `profile_190` üretim 190, sahne 200 |
| **Karıştırma** | `fair_stand_item_dimensions.width_cm` BOM W |
| **Kod** | `items.js` `resolveSceneDimensions` |

#### `depth_cm`

| | |
|---|---|
| **Ne** | Sahne **derinlik** override (cm) |
| **Neden** | Görsel slot derinliği üretimden farklı |
| **Nasıl** | İhtiyaç yoksa satır veya kolon boş |
| **Sahne** | Footprint D |
| **Karıştırma** | dimensions tablosu `depth_cm` |
| **Kod** | `resolveSceneDimensions` |

#### `height_cm`

| | |
|---|---|
| **Ne** | Sahne **yükseklik** override (cm) |
| **Neden** | Mesh slot H ≠ BOM H |
| **Nasıl** | Video wall gibi parametrik ölçüde panel H × rows kullanılabilir |
| **Sahne** | Görünür ekran/kutu yüksekliği |
| **Karıştırma** | dimensions `height_cm` |
| **Kod** | `resolveSceneDimensions`, `items.js` video-wall |

---

### 5.13 `fair_stand_item_strip_occupancy`

#### `item_key`

| | |
|---|---|
| **Ne** | FK/PK → item |
| **Neden** | Short-up bandı yalnız ilgili SKU |
| **Sahne** | `stripOccupancy` bootstrap |
| **Kod** | `item_mapper` |

#### `align`

| | |
|---|---|
| **Ne** | Şerit bandının hizası |
| **Neden** | Katalog/preview oranı |
| **Nasıl** | Bugün CHECK yalnız `top` |
| **Sahne** | Short-up üst band |
| **Karıştırma** | Tam panel pitch 50 cm kod sabiti |
| **Kod** | `normalizeStripOccupancy` |

#### `strip_count`

| | |
|---|---|
| **Ne** | Kapladığı **üst şerit** adedi (>0) |
| **Neden** | Short-up 1 veya 2 band |
| **Nasıl** | 1 veya 2 |
| **Sahne** | `resolveModuleStripOccupancy` |
| **Karıştırma** | Stand zarfında strip yok (migration 0019) |
| **Kod** | `designState.js` |

---

### 5.14 `fair_stand_item_assets`

#### `id`

| | |
|---|---|
| **Ne** | Asset satırı UUID PK |
| **Neden** | Aynı item’da birden fazla dosya rolü |
| **Sahne** | Bootstrap birleşik item |
| **Kod** | DB |

#### `item_key`

| | |
|---|---|
| **Ne** | FK → parent item |
| **Neden** | GLB/TV dosyası hangi SKU |
| **Kod** | cascade delete |

#### `asset_role`

| | |
|---|---|
| **Ne** | Dosyanın rolü: `model`, `default_screen`, `catalog_image`, `thumbnail`, `texture` |
| **Neden** | Mapper hangi JSON alanına map eder |
| **Nasıl** | Canlı seed: `model` + `default_screen`; diğer üç rol şemada, mapper yok |
| **Sahne** | `modelFile`, `defaultScreenFile` |
| **Kod** | `item_mapper` |

#### `relative_path`

| | |
|---|---|
| **Ne** | Repo-relative dosya yolu |
| **Neden** | GLB/texture yükleme |
| **Nasıl** | Geçerli path; deploy ile birlikte |
| **Sahne** | `loadItemModel` |
| **Kod** | `scene3d.js` |

#### `is_active`

| | |
|---|---|
| **Ne** | Asset soft-delete |
| **Neden** | Eski GLB’yi tut, bootstrap’tan çıkar |
| **Sahne** | Pasif satır mapper atlar |
| **Kod** | mapper filtre |

---

### 5.15 `fair_stand_item_components`

#### `id`

| | |
|---|---|
| **Ne** | Component satır UUID |
| **Neden** | Aynı child iki kez farklı quantity |
| **Kod** | DB |

#### `parent_item_key`

| | |
|---|---|
| **Ne** | Recipe **parent** SKU |
| **Neden** | Duvar paketi kökü |
| **Nasıl** | `composition_mode=recipe` |
| **Sahne** | BOM expand |
| **Kod** | `itemBom.js` |

#### `child_item_key`

| | |
|---|---|
| **Ne** | Recipe **child** gerçek SKU |
| **Neden** | BOM parçası |
| **Nasıl** | Leaf item key |
| **Sahne** | `composition.items[]` |
| **Kod** | `resolveRecipe` |

#### `quantity`

| | |
|---|---|
| **Ne** | Child adedi (>0) |
| **Neden** | Üretim miktarı |
| **Nasıl** | Decimal quantity |
| **Sahne** | BOM çarpanı |
| **Karıştırma** | Sıra kolonu yok; bootstrap child key alfabetik |
| **Kod** | `item_mapper` |

---

### 5.16 `fair_stand_item_video_walls`

#### `parent_item_key`

| | |
|---|---|
| **Ne** | Video wall parent SKU (PK) |
| **Neden** | 2×2 / 3×3 paket |
| **Örnek** | `VIDEO_WALL_2X2` |
| **Kod** | mapper |

#### `rows`

| | |
|---|---|
| **Ne** | Panel ızgara satır sayısı |
| **Neden** | Seam mesh, toplam H |
| **Sahne** | `videoWall.rows` |
| **Kod** | `scene3d.js` |

#### `cols`

| | |
|---|---|
| **Ne** | Panel ızgara sütun sayısı |
| **Neden** | Toplam W = panel W × cols |
| **Sahne** | `videoWall.cols` |
| **Kod** | `items.js` |

#### `panel_item_key`

| | |
|---|---|
| **Ne** | Gizli panel leaf SKU |
| **Neden** | Tek panel ölçüsünden duvar hesabı |
| **Nasıl** | `catalog_visible=false` panel |
| **Sahne** | Parametrik ekran boyutu |
| **Kod** | `designState.js` |

---

### 5.17 `fair_stand_item_body_parts`

#### `id`

| | |
|---|---|
| **Ne** | Body part satır UUID |
| **Kod** | DB |

#### `parent_item_key`

| | |
|---|---|
| **Ne** | Vitrin showcase parent |
| **Kod** | vitrin BOM |

#### `body_role`

| | |
|---|---|
| **Ne** | Parça rolü: `side`, `horizontal`, `glass_shelf` |
| **Neden** | Üç zorunlu child mapping |
| **Sahne** | `bodyItems.*ItemKey` |
| **Kod** | `getShowcaseBodyDefinition` |

#### `child_item_key`

| | |
|---|---|
| **Ne** | Rol için leaf board/cam SKU |
| **Sahne** | Renk/malzeme vitrin parçaları |
| **Kod** | `scene3d.js` |

---

### 5.18 `fair_stand_dimensions` (singleton `id=1`)

Stand **zarfı**; item kutusu değil. Modül genişlikleri 50/100/150/200 kod sabiti.

#### `id`

| | |
|---|---|
| **Ne** | Singleton PK; CHECK yalnız `1` |
| **Neden** | Tek stand zarfı kaydı |
| **Kod** | `standDimensions.js` |

#### `height_cm`

| | |
|---|---|
| **Ne** | Stand **max tavan** yüksekliği (cm) |
| **Neden** | Modül Z clamp |
| **Nasıl** | CRM Temel Ayarlar |
| **Örnek** | 350 |
| **Karıştırma** | Item `height_cm` |
| **Kod** | `standDimensions.js` |

#### `depth_cm`

| | |
|---|---|
| **Ne** | Duvar **omurga** kalınlığı (cm) |
| **Neden** | Overlay/derinlik referansı |
| **Sahne** | Duvar iskelet derinliği |
| **Karıştırma** | Item `depth_cm` footprint |
| **Kod** | `STAND_DIMENSIONS` |

#### `frame_width_cm`

| | |
|---|---|
| **Ne** | Dikey profil **kesit genişliği** (cm) |
| **Neden** | Görsel iskelet çizimi |
| **Sahne** | Profil ray görseli |
| **Karıştırma** | `frame_depth_cm` |
| **Kod** | renderer |

#### `frame_depth_cm`

| | |
|---|---|
| **Ne** | Profil **kesit derinliği** (cm) |
| **Neden** | Ray kalınlığı görseli |
| **Sahne** | 3D iskelet |
| **Karıştırma** | `frame_width_cm` |
| **Kod** | renderer |

#### `created_at`

| | |
|---|---|
| **Ne** | Zarf kaydı oluşturulma |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

#### `updated_at`

| | |
|---|---|
| **Ne** | Zarf son güncelleme |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

---

### 5.19 `fair_stand_settings` (singleton)

#### `id`

| | |
|---|---|
| **Ne** | Singleton PK (`1`) |
| **Kod** | CHECK |

#### `max_image_upload_mb`

| | |
|---|---|
| **Ne** | Görsel yükleme/import **MB tavanı** |
| **Neden** | Sunucu optimize byte limiti |
| **Nasıl** | CRM Temel Ayarlar (ör. 5) |
| **Sahne** | Popup aşımda |
| **Kod** | `runtimeSettings.js`, `imageOptimize.js` |

#### `export_button_visible`

| | |
|---|---|
| **Ne** | Zip **dışa aktar** butonu görünür mü |
| **Neden** | UI vitrin; güvenlik değil |
| **Sahne** | `#export-project` |
| **Kod** | `applyArchiveButtonVisibility` |

#### `import_button_visible`

| | |
|---|---|
| **Ne** | Zip **içe aktar** butonu görünür mü |
| **Neden** | Ayrı kapı export’tan |
| **Sahne** | `#import-project` |
| **Kod** | aynı |

#### `created_at`

| | |
|---|---|
| **Ne** | Ayar satırı oluşturulma |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

#### `updated_at`

| | |
|---|---|
| **Ne** | Ayar satırı güncelleme |
| **Sahne** | Okunmaz |
| **Kod** | DB only |

---

### 5.20 `fair_stand_projects`

#### `id`

| | |
|---|---|
| **Ne** | Proje UUID PK |
| **Neden** | Asset path, API kimliği |
| **Kod** | `projectRemote.js` |

#### `organization_id`

| | |
|---|---|
| **Ne** | Core org UUID (FK yok) |
| **Neden** | Kiracı izolasyonu |
| **Kod** | API filtre |

#### `name`

| | |
|---|---|
| **Ne** | Liste/başlık adı (trim, boş değil) |
| **Neden** | Müşteri projesi etiketi |
| **Kod** | UI liste |

#### `version`

| | |
|---|---|
| **Ne** | Optimistic sürüm (>0) |
| **Neden** | Eşzamanlı kayıt |
| **Kod** | API response |

#### `payload`

| | |
|---|---|
| **Ne** | JSONB: `stand`, `modules[]`, yüzey, placement |
| **Neden** | Proje SoT; catalog kolonu değil |
| **Sahne** | Tasarım aracı state |
| **Karıştırma** | Bootstrap catalog JSON |
| **Kod** | `ProjectService` |

#### `created_by`

| | |
|---|---|
| **Ne** | Oluşturan kullanıcı UUID veya null |
| **Neden** | Audit |
| **Kod** | DB |

#### `created_at`

| | |
|---|---|
| **Ne** | Proje oluşturulma zamanı |
| **Kod** | API `createdAt` |

#### `updated_at`

| | |
|---|---|
| **Ne** | Son kayıt zamanı |
| **Neden** | Liste sırası desc |
| **Kod** | API |

---

### 5.21 `fair_stand_project_assets`

#### `id`

| | |
|---|---|
| **Ne** | Asset UUID; payload `imageAssetId` |
| **Kod** | upload API |

#### `organization_id`

| | |
|---|---|
| **Ne** | Org UUID (denormalize) |
| **Neden** | Path `{org}/{project}/{id}.webp` |
| **Kod** | `asset_storage` |

#### `project_id`

| | |
|---|---|
| **Ne** | FK → proje CASCADE |
| **Kod** | proje silince asset gider |

#### `name`

| | |
|---|---|
| **Ne** | Orijinal/görünen dosya adı |
| **Kod** | asset list UI |

#### `mime_type`

| | |
|---|---|
| **Ne** | Örn. `image/webp` |
| **Kod** | download Content-Type |

#### `byte_size`

| | |
|---|---|
| **Ne** | Dosya boyutu byte (≥0) |
| **Kod** | API debug/kota |

#### `storage_key`

| | |
|---|---|
| **Ne** | Disk relative path (unique) |
| **Kod** | `build_storage_key` |

#### `created_at`

| | |
|---|---|
| **Ne** | Yükleme zamanı |
| **Kod** | DB |

---

### 5.22 `alembic_version`

#### `version_num`

| | |
|---|---|
| **Ne** | Uygulanan Alembic revision string |
| **Neden** | Şema sürüm kilidi |
| **Nasıl** | `alembic upgrade head` |
| **Sahne** | Ürün kodu okumaz |
| **Kod** | Alembic only |

---

## 6. Proje JSON’unda yaşayan alanlar (catalog kolonu değil)

Bunlar CRM item formunda yok; tasarım aracında kullanıcı/ proje kaydeder:

- `modules[].placement` — `xCm`, `yCm`, `zCm`, `rotationZDeg`, `wallId`
- Yüzey override’ları (renk, görsel asset id)
- `stand` seçimi (zemin itemKey vb.)

Kaynak: `fair_stand_projects.payload` (sunucu); tarayıcı IndexedDB önbellek.

---

## 7. Sık karışanlar

| Yanlış | Doğru |
|---|---|
| `move_snap_cm` = top-rail | Move snap = sürükleme ızgarası; top-rail = **kural** |
| `placement` = snap kuralı | placement = tip modu; snap = requires/provides + rule |
| Tip değiştirmeden tek SKU’ya özel collision | Collision tip kolonunda; item override yok |
| `snap_target_item_type` doldurmak | Kural FK + `fair_stand_rule_item_type` |
| CRM’de tip değiştirdim, stand eski | Stand **yenile** (bootstrap) |
| Duvar yüksekliği = `fair_stand_dimensions.height_cm` | Ürün yüksekliği item `height_cm` / scene; zarf = max clamp |
| Stand admin’de 7 şerit ayarı | Kaldırıldı; item `strip_occupancy` yalnız short-up; tam panel pitch kodda 50 cm |
| Pasif item’ı bootstrap’ta görmek | `is_active=false` → listede yok; `catalog_visible` sadece katalog UI |
| `ruleTypes` JSON’u stand’da registry | Kurallar `rules[]` içinde `ruleTypeKey`; ayrı JS registry yok |

---

## 7b. Doğrulama (kod ↔ belge)

| Kontrol | Komut / dosya |
|---|---|
| Alembic head | `backend/alembic/versions/0033_*` |
| Tip seed parity | `pytest backend/tests/modules/fair_stand/test_item_type_behavior.py` |
| Bootstrap şekli | `get_catalog_bootstrap.py`, `routes.py` `/catalog/bootstrap` |
| Mapper alanları | `item_mapper.py`, `admin_snap_catalog._item_type_payload` |

---

## 8. Seed referansı (ilk kurulum)

İlk DB doldurma Python seed’lerden gelir (CRM sonrası düzenlenebilir):

- Snap: `item_snap_seed.py` — `top-rail`, `shelf-rail`, tip linkleri
- Tip davranışı: `item_type_behavior_seed.py` — eski TYPE_BEHAVIORS parity

Canlı ortamda doğrulama: `backend/scripts/verify_live_item_type_placement.py`.

---

## 9. Henüz DB’de olmayan / backlog

- Item başına **çoklu** snap requires/provides (junction epic)
- Tip davranışında **item-level override**
- Global şerit/tavan türevli yükseklik kaldırma — [`PENDING_ITEM_DECISIONS.md`](PENDING_ITEM_DECISIONS.md) § A
- `eye_count` → vitrin layout modeli (B.1)

---

## 10. İlgili belgeler

| Belge | İçerik |
|---|---|
| [`DATABASE.md`](DATABASE.md) | Tüm kolon envanteri, mapper, “nerede okunur” |
| [`TYPE_BEHAVIORS_DB_ROADMAP.md`](TYPE_BEHAVIORS_DB_ROADMAP.md) | Tip davranış migrasyon geçmişi |
| [`SCENE_POSE.md`](SCENE_POSE.md) | Z, snap hedef, eksen |
| [`STAND_DIMENSIONS.md`](STAND_DIMENSIONS.md) | Zarf vs item kutusu |
| [`ITEMS.md`](ITEMS.md) | Onaylı item şema kuyruğu |
| [`CATALOG.md`](CATALOG.md) | Katalog görünürlük sözleşmesi |

**Belge güncelleme:** Yeni kolon/tablo → önce `DATABASE.md`, sonra bu kılavuzda “ne seçilir” paragrafı; CRM `adminLabels` hint’i.
