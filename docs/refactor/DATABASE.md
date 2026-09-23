# Fair Stand veritabanı

Lokal / sunucu PostgreSQL `fair_stand` şemasının yaşayan envanteri. “Üç ay sonra bunu niye koyduk?” cevabı buradadır.

**Doğrulama (2026-09-22, `models.py` + Alembic `0012_fair_stand_projects` + `item_mapper.py` + `src/`):**

1. Şema — 15 tablo; kolon adları `models.py` ile aynı. Alembic head: `0012_fair_stand_projects`.
2. `item_mapper.py` — her ürün kolonu JSON anahtarına (veya “bootstrap’a girmez”) bağlandı.
3. Production `src/` grep — “Nerede” hücresi gerçek okuyucu dosyadır; okunmayan kolon **DATA / TEST_ONLY / SCHEMA_ONLY** yazılır.
4. `ITEMS.md` (alan kuyruğu + onaylı şema), `CATALOG.md`, `ROTATION.md`, `SCENE_POSE.md`, `STAND_DIMENSIONS.md` — değer kopyalanmaz; işaret edilir.
5. Proje SoT — `fair_stand_projects` / `fair_stand_project_assets` + disk asset kökü; tarayıcı IndexedDB yalnız önbellek (`src/projectRemote.js`).

Satır sayıları (catalog tabloları) bu makinedeki canlı DB envanterinden (2026-09-21). Başka dump’ta adet değişebilir; kolon yok olamaz. Değer SoT bu dosya değildir.

- Model: `backend/app/modules/fair_stand/infrastructure/models.py`
- Mapper (DB → bootstrap JSON): `backend/app/modules/fair_stand/application/item_mapper.py`
- Proje servisi: `backend/app/modules/fair_stand/application/projects.py`
- Asset disk I/O: `backend/app/modules/fair_stand/infrastructure/asset_storage.py`
- Migrasyon: `backend/alembic/versions/`
- Okuma (catalog): bootstrap → `initializeItemRegistry` / `initializeStandDimensions` / `initializeRuntimeSettings`
- Okuma/yazma (proje): `/api/v1/fair-stand/projects` → `projectRemote.js` → IndexedDB cache

Yeni kolon aynı PR’da bu dosyaya yazılır. Kolon yoksa “var” yazılmaz.

---

## Neden 15 tablo?

Tek `items` JSON blob’u yok. Amaç: Item kimliği sabit, isteğe bağlı 1:1 / 1:N parçalar ayrı, Catalog ayrı, stand zarfı Item değil, **müşteri proje örneği** catalog’dan ayrı.

| Tablo | Canlı satır | Neden ayrı |
|---|---|---|
| `alembic_version` | 1 | Alembic head. Ürün değil. |
| `fair_stand_categories` | 7 (6 `is_active=true`; 1 pasif yerel satır) | Katalog grupları. Item’dan bağımsız id. Bootstrap yalnız aktif. |
| `fair_stand_catalog_preview_kinds` | 28 (hepsi aktif) | Kart silüeti HTML/CSS. Item davranışını tanımlamaz. |
| `fair_stand_items` | 96 (58 `catalog_visible`, 62 `is_render`) | Ürün kimliği + Catalog üyeliği + davranış bayrakları. |
| `fair_stand_item_dimensions` | 90 / 96 Item | Fiziksel / BOM ölçü. 6 Item’da satır yok (`connector_*`, `shelf_leg`, `hali`). |
| `fair_stand_item_scene_dimensions` | 34 | Sahne kutusu override. Yoksa aynı adlı `dimensions` alanı. |
| `fair_stand_item_strip_occupancy` | 8, hepsi `align=top` (4× strip 1, 4× strip 2) | Short-up şerit bandı. |
| `fair_stand_item_assets` | 19 (14 `model` + 5 `default_screen`) | GLB / TV ekran yolu. CHECK beş rol izin verir; seed ve mapper yalnız bu iki rolü doldurur/okur. |
| `fair_stand_item_components` | 186 | Recipe BOM child (`composition.items`). |
| `fair_stand_item_video_walls` | 2 | `VIDEO_WALL_2X2` / `3X3`. |
| `fair_stand_item_body_parts` | 6 (2 parent × 3 rol) | Vitrin gövde child `itemKey`. |
| `fair_stand_dimensions` | 1 (`id=1`) | Stand zarfı. Item kutusu değil. Admin UI: CRM `/admin/fair-stand/settings`. |
| `fair_stand_settings` | 1 (`id=1`) | Runtime tavanlar. Item kutusu değil. Aynı Temel Ayarlar ekranı. |
| `fair_stand_projects` | org başına değişken | Müşteri stand projesi SoT (tek JSONB payload). Catalog Item tablolarından ayrı. |
| `fair_stand_project_assets` | proje başına değişken | Proje yüzey görsellerinin meta kaydı; binary diskte. |

Akış (catalog): PostgreSQL → Fair Stand API bootstrap → CRM proxy → tarayıcı registry.  
Akış (proje): PostgreSQL + disk assets → Fair Stand projects API → CRM proxy → `projectRemote` → IndexedDB cache.  
CRM/Core kendi DB’lerinde bu tablolar yok; `organization_id` Core org UUID’sidir (FK yok). Yetki Core permission kodları: `fair_crm.fair_stand.projects.{read,create,update,delete,execute}`.

---

## `alembic_version`

Migrasyon kilidi. Ürün kodu okumaz. `alembic upgrade head` yazar.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `version_num` | yok | Uygulanan Alembic revision | Şema sürümü | yalnız Alembic; head `0012_fair_stand_projects` |

---

## `fair_stand_categories`

Katalog sol menü grupları. `docs/refactor/CATALOG.md`. Canlı: 6 aktif grup (`id` 1–6); 7. satır pasif yerel (`is_active=false`) — bootstrap’a girmez.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `id` | `categoryId` | Tam sayı grup kimliği | İsim değişse Item satırı kopmasın | `fair_stand_items.category_id` FK; `listCatalogGroups` |
| `catalog_name` | `catalogName` | UI başlık | Kullanıcı dili | Katalog UI |
| `catalog_index` | `catalogIndex` | Grup sırası (`> 0`, unique) | Sürükle sırası | `listCatalogGroups` sort |
| `is_active` | bootstrap’a girmez (repo `is_active=true` filtreler) | Soft delete | Grubu silmeden gizle | `catalog_repository.list_active_categories`; admin |
| `created_at` / `updated_at` | yok | Audit | Kim ne zaman | DB only |

---

## `fair_stand_catalog_preview_kinds`

Katalog kartı çizimi. Placement/BOM değildir.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `id` | `previewId` | Kart tipi id | Item `preview_id` FK | Görünür Item zorunlu |
| `display_name` | preview `displayName` | Admin adı | İnsan | Catalog admin |
| `markup` | `markup` | Kart HTML | Silüet | Catalog kart renderer |
| `css_code` | `cssCode` | Kart CSS | Silüet stil | Catalog kart renderer |
| `sort_index` | `sortIndex` | Admin sıra | Liste | Catalog admin |
| `is_active` | `isActive` | Soft delete | Kullanımdan kaldır | Bootstrap preview listesi |
| `created_at` / `updated_at` | yok | Audit | — | DB only |

---

## `fair_stand_items`

Kök Item. PK `item_key`. Gizli Item (`catalog_visible=false`) yine `getItem` ile durur.

Aşağıdaki `###` başlıkları (Kimlik, Catalog, Rotation, Duruş/snap…) **ayrı veritabanı tablosu değildir.** Hepsi bu tablonun kolon gruplarıdır. DBeaver’da `fair_stand_items` kolon listesinde görünürler. 1:1 / 1:N uydular sonraki `## fair_stand_item_*` bölümleridir.

### Kimlik (`fair_stand_items`)

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `item_key` | `itemKey` | Canonical ürün id | Tek kimlik | Tüm FK, factory, BOM, persist |
| `name` | `name` | İnsan adı | Catalog `label`, UI | Katalog, seçim metni |
| `item_type` | `type` | Davranış ailesi adı | Placement/collision hâlâ `TYPE_BEHAVIORS[type]` | `moduleBehavior.js`, recipe lookup adayı |
| `unit` | `unit` | BOM birimi | `adet` vb. | `itemBom` |
| `is_active` | item listesine girmez (`is_active=true` filtre) | Soft delete | Satırı yok etmeden kapat | `catalog_repository` item query; lokal seed hepsi true |
| `created_at` / `updated_at` | yok | Audit | — | DB only |

### Catalog üyeliği (`fair_stand_items`)

Sözleşme: `CATALOG.md`. `catalog_visible=true` ⇒ `category_id` + `catalog_item_index` + `preview_id` dolu (CHECK).

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `catalog_visible` | `catalogVisible` | Katalogda görünsün mü | Leaf/BOM parçayı listeden sakla | yalnız `catalog.js` |
| `category_id` | `categoryId` | Grup FK / null | Hangi menü | Catalog UI |
| `catalog_item_index` | `catalogItemIndex` | Grup içi sıra | Kart sırası; görünürlerde unique | Catalog UI |
| `preview_id` | `previewId` | Kart silüet FK / gizlide yok | Kart çizimi | Catalog kart |

### Üretim / görünüm üstveri (`fair_stand_items`)

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `material` | `material` | Üretim malzemesi metni | Vitrin yan/yatay `sunta` zorunlu | `getShowcaseBodyDefinition`; cam raf `getMaterialAppearance` |
| `default_color` | `defaultColor` | Integer hex (örn. `16777215` = beyaz). String değil. | İlk yüzey rengi; zemin de aynı kolon + `paintable` | `designState.js` hex; `scene3d.js` floor `item.defaultColor`; vitrin yan=yatay kilit |
| `preserve_model_scale` | `preserveModelScale` | GLB ölçeğini ezme | Fit istemeyen saksı/çöp | `scene3d.js` model load; `designState.js` |
| `model_rotation_y_deg` | `modelRotationYDeg` | Mesh Y ofset | GLB eksen | `scene3d.js`; `designState.js` |
| `visual_rotation_y_deg` | `visualRotationYDeg` | Görsel Y ofset | Koltuk sırt / çöp | `scene3d.js` (sahne Z değil) |
| `paintable` | `paintable` | Zemin boyanır mı | Zemin select | `scene3d.js`, `main.js`, `items.js` floor |
| `shape` | `shape` | `L` | L-banko kimliği | `designState.js`, `scene3d.js` `createLCounterModule` |
| `variant` | `variant` | Short-up / sarmasık etiketi | Aile içi ayrım (behavior type değil) | `designState.js` descriptor; `items.js` / `moduleContracts.js` |
| `eye_count` | `eyeCount` | Vitrin 2 / 3 | Açıklık şerit + raf sayısı | `scene3d.js` showcase; `designState.js` |

### Sahne Z dönüşü (`fair_stand_items`)

Üçlü birlikte dolu veya birlikte NULL (CHECK). Yerleşen 61 dolu; leaf 35 null. `ROTATION.md`. Ayrı rotation tablosu yok.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `rotation_step_deg` | `rotationStepDeg` | Shift+R adımı | Type tablosu ezmesin | `src/moduleBehavior.js` `getModuleRotationStepDeg` |
| `default_rotation_deg` | `defaultRotationDeg` | İlk `placement.rotationZDeg` | İlk bakış | `getModuleDefaultRotationDeg` |
| `side_insert_rotation` | `sideInsertRotation` | `inherit` / `default` | Yana ek açı kipi | `resolveSideInsertRotationDeg` |

### Duruş / snap / yüzey (`fair_stand_items` + tip/kural tabloları)

Ayrı katalog: `fair_stand_item_type` (unique `key`), `fair_stand_rule_type`, `fair_stand_rule`. Item `item_type` → `fair_stand_item_type.key` FK; kural ↔ tip M:N (`fair_stand_rule_item_type`). Sözleşme: `SCENE_POSE.md`. Okuma: `src/itemSnap.js` + `src/items.js`.

Katalog tablolarında kalıcı kimlik **`key`**. CRM’de label Key; create’te display_name’den slug. `mount_mode` yok; yalnız face/edge. Aile (`fair_stand_family`) kaldırıldı (`0029_item_type_catalog`).

| Kolon / tablo | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `default_z_cm` | `defaultZCm` | Yerden kot (cm) | Tavan ezmesin | `resolveItemDefaultZCm` |
| `item_type` → `fair_stand_item_type.key` | `type` | Item tipi (unique key) | Tip seçimi / davranış | CRM + bootstrap `itemTypes` |
| `snap_requires_rule_id` → `fair_stand_rule` | `snapRequiresRuleId` (+ denorm `snapRequires`) | Aranan kural | Eşleşme | `getItemSnapSpec` → face/edge **kural kaydından** |
| `snap_provides_rule_id` → `fair_stand_rule` | `snapProvidesRuleId` (+ denorm `snapProvides`) | Sunulan kural | Host | `listSnapHosts` / `resolveItemSnapGeometry` |
| `fair_stand_rule.key` / `face` / `edge` | bootstrap `rules[]` | Snap kimlik + geometri | UI’dan kural | CRM Kurallar; motor rule registry |
| `fair_stand_rule_item_type` | `itemTypeIds` / `itemTypeKeys` | Kural ↔ tip(ler) | **Provides:** o tipteki tüm item’lar host | Motor `itemProvidesSnapRule` |
| `snap_target_item_type` / `snap_anchor` | — | Legacy | Okunmaz | null |
| `is_render` / `accepts_*` | aynı | yüzey | aynı | aynı |

CHECK: requires XOR provides rule id; `is_render=false` → accepts_* false.

### Bileşim başlığı (`fair_stand_items`; child satırlar `fair_stand_item_components`)

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `composition_mode` | `composition.mode` | Yalnız `recipe` (CHECK) | BOM expand kapısı | `itemBom.js` `resolveRecipe` |

---

## `fair_stand_item_dimensions`

Fiziksel gövde. En az bir ölçü NOT NULL (CHECK). JSON `dimensions.*`.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `item_key` | — | FK/PK | 1:1 | cascade delete |
| `width_cm` | `widthCm` | Kutu W | Placement / kart / BOM | `resolveSceneDimensions`; factory; AutoDepot |
| `depth_cm` | `depthCm` | Kutu D | Footprint | aynı |
| `height_cm` | `heightCm` | Kutu H | Mesh / şerit aralığı | aynı; collision type tablosu hâlâ ayrı |
| `mount_height_cm` | `mountHeightCm` | Legacy montaj (floodlight 350) | Seed tarihi; drop asıl `default_z_cm`. Fallback: `resolveItemDefaultZCm` hâlâ okur | `led_floodlight`; `selectionFeedback.js` metin |
| `wall_gap_cm` | `wallGapCm` | Strafor–duvar boşluğu | Overlay öne | `designState.js` → `scene3d.js` foam |

**Kaldırıldı:** `length_cm`, `thickness_cm` — migration `0021_drop_item_length_thickness`; önce `0020_item_dims_wh_d_fill` ile W/H/D dolduruldu.

`resolveSceneDimensions`: aynı field `sceneDimensions ?? dimensions ?? MISSING`. Cross-remap yok.

---

## `fair_stand_item_scene_dimensions`

Sahne kutusu. Örn. `profile_190` üretim 190, sahne width 200. Width/depth/height’ten en az biri dolu.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `item_key` | — | FK/PK | 1:1 | — |
| `width_cm` / `depth_cm` / `height_cm` | `sceneDimensions.*` | Slot | Üretim ≠ sahne | `resolveSceneDimensions` |

---

## `fair_stand_item_strip_occupancy`

Short-up duvarın kaç üst şeridi kestiği. `align` bugün yalnız `top`.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `item_key` | — | FK/PK | — | — |
| `align` | `stripOccupancy.align` | Bant hizası (CHECK yalnız `top`) | Katalog/preview oranı; layout helper’ları kalktı (PENDING § A.1) | `normalizeStripOccupancy` / `resolveModuleStripOccupancy`; `catalogPreviewRenderer.js` |
| `strip_count` | `stripOccupancy.stripCount` | Şerit adedi (`> 0`) | 1 veya 2 short-up | aynı + `designState.js` (persist). Tablo kaldırma: PENDING § A.5 |

Stand `strip_count` (7) ile karışmaz. O zarf tablosunda.

---

## `fair_stand_item_assets`

Dosya yolları. `(item_key, asset_role)` unique.

| Kolon | JSON (role’e göre) | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `id` | yok | UUID PK | Çok asset | DB |
| `item_key` | — | FK | — | — |
| `asset_role` | — | CHECK: `model` / `default_screen` / `catalog_image` / `thumbnail` / `texture`. Canlı seed: yalnız `model` ve `default_screen`. | Rol ayrımı | mapper yalnız `model`→`modelFile`, `default_screen`→`defaultScreenFile`. Diğer üç rol şemada durur, JSON’a yazılmaz. |
| `relative_path` | `modelFile` (`model`) veya `defaultScreenFile` (`default_screen`) | Repo-relative path | GLB / TV ekran | `scene3d.js` `loadItemModel` / TV texture |
| `is_active` | mapper yalnız aktif | Soft delete | Eski dosyayı tut | mapper |

---

## `fair_stand_item_components`

Recipe child listesi → JSON `composition.items[]`. Parent ≠ child. `quantity > 0`.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `id` | yok | UUID | Aynı child iki kez (farklı sıra) | DB |
| `parent_item_key` | — | Parent Item | Bileşik | `resolveItemBom` |
| `child_item_key` | `items[].itemKey` | Child Item | Gerçek parça | BOM recursive |
| `quantity` | `items[].quantity` | Adet | Üretim | BOM |
| `sort_order` | sıra | Liste sırası | Deterministik dump | mapper sort |

---

## `fair_stand_item_video_walls`

`VIDEO_WALL_2X2` / `3X3`. PK parent.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `parent_item_key` | — | Parent | — | — |
| `rows` / `cols` | `videoWall.rows` / `cols` | Panel ızgara | Seam mesh | `scene3d.js` TV wall; `designState.js` |
| `panel_item_key` | `videoWall.panelItemKey` | `video_wall_panel` | Gizli panel SKU | `items.js` video-wall ölçü |

---

## `fair_stand_item_body_parts`

Vitrin gövde. PK `(parent, body_role)`. Role: `side` / `horizontal` / `glass_shelf`.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `parent_item_key` | — | Showcase parent | — | — |
| `body_role` | `bodyItems.sideItemKey` / `horizontalItemKey` / `glassShelfItemKey` | Hangi parça | Tek child Key | mapper üçlüyü zorunlu okur |
| `child_item_key` | karşılık | Leaf board/cam | BOM + renk | `getShowcaseBodyDefinition`; `scene3d.js` boards |

---

## `fair_stand_dimensions`

Tek satır `id = 1`. Item değildir. `STAND_DIMENSIONS.md`.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `id` | — | Singleton; CHECK `id = 1`. (Postgres sequence default var, ikinci satır CHECK’ten geçmez.) | İkinci zarf yok | CHECK `ck_fair_stand_dimensions_singleton` |
| `height_cm` | `heightCm` | Tavan (cm) | Max zarf | `src/standDimensions.js` |
| `depth_cm` | `depthCm` | Duvar kalınlığı (cm) | Omurga / overlay | same |
| `frame_width_cm` | `frameWidthCm` | Dikey profil kesit (cm) | Görsel iskelet | renderer via `STAND_DIMENSIONS.*` (m getter) |
| `frame_depth_cm` | `frameDepthCm` | Profil derinlik (cm) | Ray kalınlığı | aynı |
| `created_at` / `updated_at` | yok | Audit | — | DB |

`MODULE_WIDTHS_CM` (50/100/150/200) hâlâ JS; bu tabloda yok.

Lokal seed: `id=1`, `height_cm=350`, `depth_cm=10`, `frame_width_cm=5.5`, `frame_depth_cm=10`.

---

## `fair_stand_settings`

Tek satır `id = 1`. Item değildir. Stand zarfı değildir.

Kaynak: PostgreSQL `fair_stand_settings` → catalog bootstrap `settings` → `initializeRuntimeSettings` → `getMaxImageUploadMb()` / `applyArchiveButtonVisibility`.

| Kolon | JSON | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `id` | — | Singleton; CHECK `id = 1` | İkinci ayar satırı yok | CHECK `ck_fair_stand_settings_singleton` |
| `max_image_upload_mb` | `maxImageUploadMb` | Görsel arşiv yükleme tavanı (MB) | JS sabiti yok; aşım popup | `src/runtimeSettings.js` → `imageOptimize.js` / `main.js` |
| `export_button_visible` | `exportButtonVisible` | Dışarı Aktar butonu | Zip günlük vitrin değil; DB kapatır | `applyArchiveButtonVisibility` → `#export-project` |
| `import_button_visible` | `importButtonVisible` | İçe Aktar butonu | Ayrı kapı | `applyArchiveButtonVisibility` → `#import-project` |
| `created_at` / `updated_at` | yok | Audit | — | DB |

Seed: MB `5`; butonlar `true` (mevcut davranış). Markup’ta butonlar `hidden` başlar; bootstrap sonrası ayar `true` ise açılır (flash yok). UI kilidi; zip endpoint güvenlik değildir.

---

## `fair_stand_projects`

Müşteri stand **proje örneği** SoT. Catalog Item satırı değildir. Eski tarayıcı-only IndexedDB artık otorite değil; lokal store önbellek + dirty sync içindir (`src/projectRemote.js`, `src/projectStore.js`).

Auth: org-scoped Core verify; `X-Organization-Id` + Bearer. API: `backend/app/modules/fair_stand/api/project_routes.py`.

| Kolon | JSON / API | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `id` | `id` | Proje UUID PK | İstemci ve asset path aynı id | `projectRemote`, asset `storage_key` |
| `organization_id` | `organizationId` | Core org UUID (FK yok) | Çok kiracılı izolasyon | list/get filtre; disk `{org}/…` |
| `name` | `name` | Görünen ad (trim, boş değil) | Liste / başlık | UI proje listesi |
| `version` | `version` | Optimistic / sıra (`> 0`) | İstemci sürüm bilinci | API response |
| `payload` | `payload` (+ düz `stand` / `modules`) | JSONB proje gövdesi | Tek blob; kolon patlatma yok | `ProjectService`; `buildProjectSnapshot` şekli |
| `created_by` | — | Oluşturan kullanıcı UUID / null | Audit | DB / create |
| `created_at` / `updated_at` | `createdAt` / `updatedAt` | Zaman damgası | Liste sırası (`updated_at` desc) | API |

`payload` zorunlu şekil (servis normalize): `{ stand: object, modules: array, … }`. Ek anahtarlar korunur. Catalog bootstrap JSON’u değildir.

---

## `fair_stand_project_assets`

Proje yüzey görseli **meta** satırı. Binary PostgreSQL’de değil; disk kökünde `storage_key` yolu.

Yüklemede sunucu optimize eder (tercihen WebP). Path: `{organization_id}/{project_id}/{asset_id}.webp` (`build_storage_key` / `asset_storage.py`). Proje silinince satırlar CASCADE + klasör silinir.

| Kolon | JSON / API | Nedir | Neden | Nerede |
|---|---|---|---|---|
| `id` | `id` | Asset UUID PK | Payload `imageAssetId` ile aynı | upload/get/delete |
| `organization_id` | — | Org UUID (denormalize) | Org filtre / güvenlik | index; path |
| `project_id` | — | FK → `fair_stand_projects` CASCADE | Proje ağacı | relationship |
| `name` | `name` | Orijinal / gösterim adı | UI | asset list |
| `mime_type` | `mimeType` | Örn. `image/webp` | Content-Type | download |
| `byte_size` | `byteSize` | Byte (`>= 0`) | Kota / debug | API |
| `storage_key` | `storageKey` | Kök-relative path; unique | Disk adresi | `asset_storage` |
| `created_at` | — | Zaman | Audit | DB |

Catalog `fair_stand_item_assets` (GLB/TV seed) ile karışmaz.

---

## Production `src/` bu kolonları okumaz

Kayıt durur; mapper bootstrap’a yazar (asset unused rolleri hariç).

| Kolon | Durum |
|---|---|
| asset `catalog_image` / `thumbnail` / `texture` | CHECK izin; seed/mapper yok |

---

## Bilerek burada olmayanlar

Ertelenmiş kararlar, tavan/şerit kaldırma sırası, Item property backlog: `PENDING_ITEM_DECISIONS.md`.

Collision / magneticSnap / moveSnapCm / ghost: hâlâ `TYPE_BEHAVIORS` (`type`). Item kolon değil — taşıma kuyruğu aynı dosyada § C.3.

Runtime instance alanları (`placement.xCm/yCm/zCm/rotationZDeg`, `rotationLocked`, yüzey ezmeleri): catalog Item kolonu değil; **`fair_stand_projects.payload` JSONB** içinde yaşar (SoT sunucu). IndexedDB aynı blob’un önbelleğidir.

Catalog projection alias (`label`, kök `widthCm`): Item/DB alanı değil.

Core `role_permissions` / permission lifecycle: Fair Stand DB’sinde yok; yetki Core’da. Stand yalnız permission kodunu verify eder.

---

## Yeni kolon checklist

1. Model + Alembic + mapper (null omit kuralı).
2. Bu dosyada tablo/kolon satırı (nedir / neden / nerede).
3. Konu dosyası varsa oraya pointer (`ROTATION.md` gibi); değer kopyalama.
4. Test: seed + getter fail-fast.
5. `ITEMS.md` şemaya alındıysa oraya da.
