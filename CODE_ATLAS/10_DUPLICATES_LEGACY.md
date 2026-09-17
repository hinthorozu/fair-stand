# Duplicates / Legacy

## Duplicate implementation

### 1. `getRecipeInnerCornerPanelKey`

`src/moduleRecipes.js` export’u silindi. Production hâlâ `resolveRecipeItemsForPanelVariant` içinde `item.composition.innerCorner?.panelItemKey` okur. Test helper aynı path’i okur; `variants` fallback kaldırıldı. `recipeView.variants.innerCornerPanelItemKey` test view projeksiyonu duruyor.

### 2. Recipe parent key türetimi

`test/recipeParentItemKey.js` `recipeParentItemKey(moduleType, widthCm)` string birleştirir (`wall_${widthCm}`, `desk_banko_${widthCm}_L`, …).

Production kimlik `resolveItemKey` + `ITEMS` satırı; Catalog `itemKey`.

**Yorum:** Test kolaylığı. Production’da bu helper yok. Duplicate identity kuralı riski: helper ile `ITEMS` sapabilir. Contract testler her iki tarafı da bağlar.

### 3. Module policy çift kaynak

- Runtime: `moduleBehavior.js` tabloları  
- Test/governance: `moduleContracts.js` `MODULE_CONTRACT_PROFILES` / `ASSIGNMENTS`

Aynı kavram, iki dosya. Production yalnız birini import eder.

### 4. Composition contract çift kaynak

- Runtime: `autoDepot.js` / `automaticWall.js`  
- Test/docs: `featureContracts.js`

---

## Legacy / stale scripts

`RELEASE_HARDENING_ROADMAP.md` ve `audit/evidence/A21_REPOSITORY_HYGIENE_GOVERNANCE.md` şu betikleri tarihsel yama olarak adlandırır:

- `scripts/archive/add-tv-sizes.py`
- `scripts/archive/add-video-wall-2x2.py`
- `scripts/archive/fix-tv-screen-face.py`
- `scripts/video-wall-build-trigger.txt`

`scripts/patch-video-wall-2x2.cjs` ve `scripts/patch-video-wall-single-image.cjs` bu turda silindi. Bkz. `CODE_ATLAS/CLEANUP_PHASE_1.md`.

**Kanıt:** package.json script yok; CI yok; change-contract.json path listesinde; patch cjs eski catalog şekline yazıyor.

**Yorum:** SCRIPT_ONLY stale. `install-server.sh` aynı kovada değil — gerçek deploy.

---

## Stale doküman / kod adı

| İz | Kanıt | Yorum |
| --- | --- | --- |
| `tvConfig.js` | `audit/remediation/A02_F005_CLOSURE.md` listeler | `src/tvConfig.js` yok |
| `shelfCount` audit properties | docs vs runtime 0 alan | kaldırılmış alan dokümanda duruyor |
| `add-video-wall-2x2.yml` | `FRESH_REPOSITORY_REVIEW.md` | bu taramada workflow dosyası görülmedi (yalnız `ci.yml`) |
| `createTvCatalogItem` | patch script | güncel catalog’da yok |

---

## Compatibility / persist

`items.js` yorum: zemin persist `stand.itemKey` (eski kayıt: `floorType`).  
`resolveStandFloorItemKey`: `itemKey ?? floorType`.

`designState.normalizeModuleItemState` yorum: eski kapı projeleri yüzeyde fiziksel kanat itemKey taşımıyordu.

Bunlar **canlı uyumluluk**, abandoned değil.

`scene3d.js` yorum: `LEGACY: itemKey yoksa veya scene depth/height MISSING ise STAND renderer ghost zarfı.`

**Kanıt:** kaynak yorum satırı. Ghost yolu hâlâ duruyor.

---

## Abandoned feature adayları (yorum; PROVEN değil)

| Aday | Neden aday | Neden PROVEN_UNUSED değil |
| --- | --- | --- |
| `groundLayout.js` | renderer bağlı değil | test + change-gate path |
| `cornerPlacement.js` | prod insert kullanmıyor | test + process adı |
| Connector BOM API | prod call yok | Item data + recipe hâlâ var |

---

## Duplicate test helper vs production recipe

`expandRecipe` hem `src/moduleRecipes.js` hem `test/recipeParentItemKey.js` re-export (`export { expandRecipe, getRecipeItemKey }`). Helper production’ı sarmalar; ikinci implementasyon değil, re-export.
