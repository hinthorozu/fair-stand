# Audit doğrulama (CODE_ATLAS follow-up)

**Tarih:** 2026-09-17  
**Kapsam:** mevcut audit adaylarının yeniden kanıtlanması.  
**Kaynak kod değişikliği (bu belge yazıldığında):** yok.  
**Cleanup:** doğrulanmış temizlik `CODE_ATLAS/CLEANUP_PHASE_1.md` içinde uygulandı.

Kanıt = graph, dosya içeriği, grep, import, CI/package.json. Yorum ayrı satırda.

---

## 1. `scripts/patch-video-wall-2x2.cjs`

### Kim çağırıyor?

**Kanıt:** `*.{js,mjs,cjs,yml,yaml,json,sh}` içinde `patch-video-wall` eşleşmesi yalnız `.github/change-contract.json` `impactAnalysis.affectedFiles`. `scripts/*` hiçbir betik bu dosyayı spawn/import etmez. GitNexus File IMPORTS: bu `.cjs` için importer yok.

**Yorum:** Elle `node scripts/patch-video-wall-2x2.cjs` dışında çağrı yok.

### package.json?

**Kanıt:** `package.json` `scripts` anahtarları: `dev`, `contract:verify`, `test`, `build`, `preview`, `e2e:deps`, `e2e:install`, `e2e`, `audit:deps`, `syntax:check`. Patch yok.

### CI / GitHub workflow?

**Kanıt:** tek workflow `.github/workflows/ci.yml`. Adımlar: `contract:verify`, `npm ci`, `audit:deps`, `syntax:check`, `npm test`, `build`, Playwright. Patch komutu yok.

### Docs’ta manuel kullanım talimatı?

**Kanıt:**

| Dosya | Ne yazıyor |
| --- | --- |
| `audit/evidence/A21_REPOSITORY_HYGIENE_GOVERNANCE.md` | Tarihsel tek-seferlik yama; paket yaşam döngüsü komutu değil; güncel migrasyon değil |
| `RELEASE_HARDENING_ROADMAP.md` §8 | “Legacy patch … sınıflandır ve temizle”; durum **AÇIK**; `node …` komutu yok |
| `docs/items/audit/items/TV_42.md`, `TV_55.md`, `TV_65.md`, `VIDEO_WALL_2X2.md` | `ui/other` dosya listesinde path |

`node scripts/patch-video-wall-2x2.cjs` veya “şu adımlarla çalıştır” cümlesi yok.

### Catalog API bugün var mı?

**Kanıt:** script `src/catalog.js` içinde `createTvCatalogItem(TV_55_DEFINITION)` / `TV_65_DEFINITION` arar. Güncel `src/catalog.js`: `listCatalogItems` / `getCatalogItem` / `ITEMS` projeksiyonu. `createTvCatalogItem` eşleşmesi `src/` içinde **0** (yalnız bu script ve `scripts/archive/add-video-wall-2x2.py`). `VIDEO_WALL_2X2` kaydı `src/items.js` satır 315, `catalog.js` değil.

### Bugün çalıştırılsa throw eder mi?

**Kanıt (kod yolu):**

1. Catalog bloğu: `if (!s.includes('VIDEO_WALL_2X2'))` — `catalog.js` bu stringi içermez → bloğa girer. `replace` `replaceOnce` değil; pattern yoksa **throw yok**, sessiz no-op + `write`.
2. `designState.js`: aranan `export function createTvModuleState(sizeInch = 42)` — güncel imza `createTvModuleState(descriptor = {})` (`src/designState.js:513`). `replace` throw etmez.
3. `main.js`: aranan `createTvModuleState(module.sizeInch ?? 42)` — `src/main.js` içinde `createTvModuleState` **0** eşleşme. `replace` throw etmez.
4. `scene3d.js`: `indexOf('function createTvModule(moduleState, moduleIndex) {')` ve `indexOf('\nfunction createMiniFridgeTopLabel(')` — her iki fonksiyon bugün var (`scene3d.js:4958`, `:5046`). `start < 0 \|\| end < 0` **false** → **throw yok**; mevcut `createTvModule` gövdesi script’teki eski renderer ile **üzerine yazılır**.

**Yorum:** “Çalışmaz / hemen hata verir” kanıtlanmadı. Kanıtlanan: catalog/designState/main yamaları isabetsiz; scene3d yaması token bulursa dosyayı değiştirir.

### Silmek başka workflow’u kırar mı?

**Kanıt:**

- CI/npm script bu dosyayı çalıştırmaz.
- `test/` bu path’i okumaz (`hygieneGates.test.js` yalnız `install-server.sh` + CI script adları).
- `isGuardedChangeFile`: `path.startsWith('scripts/')` true (`src/systemChangeContract.js:368`). Silme PR’ı change-gate’e girer (`architecture` domain, `requiredDomainsForFile` scripts/ kuralı).
- Mevcut `.github/change-contract.json` bu path’i `impactAnalysis.affectedFiles` içinde **listeler** (o contract’ın etkilenen-dosya envanteri; runner değil).

**Sınıf: `SCRIPT_ONLY_STALE`**

`PROVEN_UNUSED` değil: path docs + change-contract + guarded `scripts/` altında.  
`SCRIPT_ONLY_ACTIVE` değil: npm/CI/çalıştırma talimatı yok.

---

## 2. `scripts/patch-video-wall-single-image.cjs`

### Kim çağırıyor?

**Kanıt:** `patch-video-wall-single-image` eşleşmesi: `.github/change-contract.json`, `RELEASE_HARDENING_ROADMAP.md`, CODE_ATLAS. JS/CI spawn yok. GitNexus importer yok.

`package.json`: yok.  
`.github/workflows/ci.yml`: yok.

### Docs talimatı?

**Kanıt:** `RELEASE_HARDENING_ROADMAP.md` §8 listesi. `node scripts/patch-video-wall-single-image.cjs` komutu yok. Item audit MD’ler bu dosyayı **listelemez** (yalnız `patch-video-wall-2x2.cjs` path’i TV/VIDEO_WALL audit `ui/other` satırında).

### Catalog API?

**Kanıt:** bu script catalog’a dokunmaz. Tek hedef `src/scene3d.js` `createTvModule`.

### Bugün throw?

**Kanıt:** `startToken = 'function createTvModule(moduleState, moduleIndex) {'`, `endToken = '\nfunction createMiniFridgeTopLabel'`. Her iki token bugünkü `scene3d.js`’te var. `start < 0 \|\| end < 0` false → throw yok; `createTvModule` üzerine yazılır.

### Silme etkisi?

2x2 ile aynı: npm/CI kırılmaz; `scripts/` guarded; change-contract `affectedFiles` listesinde.

**Sınıf: `SCRIPT_ONLY_STALE`**

---

## 3. `getRecipeInnerCornerPanelKey`

### Production referanslar

| Konum | Kanıt |
| --- | --- |
| Tanım | `src/moduleRecipes.js:7-9` `export function getRecipeInnerCornerPanelKey(item) { return item?.composition?.innerCorner?.panelItemKey ?? null; }` |
| `src/` çağrı / import | **0.** `src/**/*.js` grep yalnız tanım satırı. `src/itemBom.js` import: `expandRecipe`, `getRecipeItemKey` — bu sembol yok. |
| `expandRecipe` çağrısı | **yok.** Inner-corner `resolveRecipeItemsForPanelVariant` içinde inline. |
| GitNexus `context` | incoming CALLS `{}`, processes `[]`, epistemic exact |
| GitNexus `impact` upstream `includeTests: true` | `impactedCount: 0`, risk UNKNOWN |
| Docs audit | `docs/items/audit/properties/...` dosyaları sembolü “read” olarak listeler (MD envanter, import değil) |

Inline production eşdeğer (`src/moduleRecipes.js:43`):

```javascript
const cornerPanelItemKey = item.composition.innerCorner?.panelItemKey ?? null;
```

`expandRecipe` → `resolveRecipeItemsForPanelVariant(item, options.panelVariant)` (`:74-77`). `panelVariant !== 'inner-corner'` ise inner key okunmaz.

### Test referanslar

`src/moduleRecipes.js` export’unu **hiçbir test import etmez.**

| Dosya | Import kaynağı | Kullanım |
| --- | --- | --- |
| `test/recipeParentItemKey.js:58-62` | kendi tanımı | `itemOrView?.composition?.innerCorner?.panelItemKey ?? itemOrView?.variants?.innerCornerPanelItemKey ?? null` |
| `test/moduleRecipes.test.js` | `./recipeParentItemKey.js` | `getStraightWallRecipe` / `getModuleRecipe` view’ına çağrı (ör. `:196`, `:215`, `:229`) |
| `test/cornerPanelsItemContract.test.js` | `./recipeParentItemKey.js` | `getModuleRecipe(...)` view (`:77`) |
| `test/panelCorner192ItemContract.test.js` | `./recipeParentItemKey.js` | `getModuleRecipe(...)` view (`:39`) |

Aynı testler `../src/moduleRecipes.js`’den yalnız `getRecipeItemKey` alır.

View şekli (`recipeParentItemKey.js` `recipeView`): `{ recipeId, items, variants: { innerCornerPanelItemKey, ... } }` — **`composition` yok.**

### Helper production ile aynı semantik mi?

**Kanıt: hayır.**

| Girdi | Production (`src/moduleRecipes.js`) | Test helper (`test/recipeParentItemKey.js`) |
| --- | --- | --- |
| Item master (`composition.innerCorner.panelItemKey`) | o alanı döner | aynı alanı döner (ilk `??`) |
| `getModuleRecipe` / `getStraightWallRecipe` view (`variants` var, `composition` yok) | `null` | `variants.innerCornerPanelItemKey` |

Mevcut test çağrıları view geçirir (`getStraightWallRecipe(50)` vb.). Bu çağrılar **src export’unu doğrulamaz.** Src export’un test import’u yoktur.

`variants.innerCornerPanelItemKey` view içinde `inner.panelItemKey` kopyasıdır (`recipeView` `:25-33`). Item üzerinde production ile aynı **değer** üretilir; **fonksiyon semantiği** (okunan path) view’da farklıdır.

---

## 4. Runtime’a transitif girmeyen dört `src/` dosyası

GitNexus IMPORTS (kanıt, önceki taramayla aynı): `src/main.js` / `src/scene3d.js` bu dördünü import etmez. Importer’lar yalnız `test/*` (ve `featureContracts` için `test/systemDevelopmentContract.test.js`).

### `src/groundLayout.js`

**Rol: `TEST_SUPPORT`**

Kanıt:

- Tek CALLS: `test/groundLayout.test.js` (`createGroundLayout`)
- GitNexus processes `[]`
- `src/scene3d.js` `createGroundLayout` 0
- `SOURCE_FILE_REQUIRED_DOMAINS['src/groundLayout.js']` = renderer+placement (`systemChangeContract.js:88`)
- `test/systemChangeGate.test.js:294` bu path’in domain listesini assert eder

`PRODUCTION_RUNTIME` değil. `UNUSED` değil (unit test + gate map). Canonical SoT tablosunda yok (`SYSTEM_DEVELOPMENT_CONTRACT.md` §2).

### `src/featureContracts.js`

**Rol: `GOVERNANCE`**

Kanıt:

- `SYSTEM_DEVELOPMENT_CONTRACT.md` §2: “Feature / composition contract” → `src/featureContracts.js`
- Production `src/` import 0; `autoDepot.js` / `automaticWall.js` bu dosyayı okumaz
- Executable okuma: `test/systemDevelopmentContract.test.js` `FEATURE_CONTRACTS`, `getFeatureContract`
- GitNexus: `getFeatureContract` incoming yalnız o test; `FEATURE_CONTRACTS` process `[]`

### `src/moduleContracts.js`

**Rol: `GOVERNANCE`**

Kanıt:

- `SYSTEM_DEVELOPMENT_CONTRACT.md` §2: “Modül contract profile ve politika ataması” → `src/moduleContracts.js`
- `SYSTEM_CHANGE_GATE.md`: module-level detay bu dosya
- GitNexus `resolveModuleContract` incoming: 19 **test** dosyası, `src/` yok; processes `[]`
- Production davranış `src/moduleBehavior.js` + `src/items.js` (bu dosyayı import etmez)

`TEST_SUPPORT` de var (contract testleri) ama canonical SoT kaydı governance.

### `src/cornerPlacement.js`

**Rol: `TEST_SUPPORT`**

Kanıt:

- Prod import 0
- Callers: `test/cornerPlacement.test.js`, `test/rightWallOrientation.test.js`
- `rightWallOrientation.test.js` `resolveAdjacentPlacement` ile `planContinuousWallLayout` (`wallReflow.js`) 270° sağ duvarı karşılaştırır
- Production insert/reflow: `src/wallReflow.js` / `src/modulePlacement.js` / `src/moduleMove.js` (bu dosyayı import etmez)
- `SOURCE_FILE_REQUIRED_DOMAINS` behavior+placement map’i var; canonical SoT tablosunda yok

`PRODUCTION_RUNTIME` değil. `LEGACY` iddiası bu doğrulamada sınıf olarak kullanılmadı: testler hâlâ çalıştırıyor.

---

## Özet

| Aday | Sınıf |
| --- | --- |
| `scripts/patch-video-wall-2x2.cjs` | `SCRIPT_ONLY_STALE` |
| `scripts/patch-video-wall-single-image.cjs` | `SCRIPT_ONLY_STALE` |
| `src/moduleRecipes.js` `getRecipeInnerCornerPanelKey` | production caller yok; testler **src export’u değil** helper’ı kullanır; helper view path’i production’dan farklı |
| `src/groundLayout.js` | `TEST_SUPPORT` |
| `src/featureContracts.js` | `GOVERNANCE` |
| `src/moduleContracts.js` | `GOVERNANCE` |
| `src/cornerPlacement.js` | `TEST_SUPPORT` |
