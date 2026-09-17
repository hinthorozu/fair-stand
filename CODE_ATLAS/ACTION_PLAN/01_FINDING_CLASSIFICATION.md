# 01 — Finding sınıflandırması

Kaynak: `CODE_ATLAS/MASTER_AUDIT/14_FULL_FINDINGS_TABLE.md` (40 satır) + source + GitNexus.  
Repo: `fair-stand`, indeks `8e9950b` / `2026-09-17T20:06:24.591Z`.

GitNexus sıfır caller unused sayılmaz. Test davranışı production sayılmaz.

---

## MA-001

- **Mevcut severity:** HIGH  
- **Dosya/symbol:** `src/itemBom.js` `resolveItemBom`; `src/rawBomDebug.js` `renderItemBom`; `src/main.js:62-63`  
- **Audit iddiası:** BOM kullanıcıya kapalı (`DEV && ?rawBom`).  
- **Source:** `main.js` yalnız `import.meta.env.DEV && URLSearchParams.has('rawBom')` ile dinamik import. Quote/order/export/maliyet consumer yok. `resolveItemBom` production orkestrasyona bağlı değil.  
- **GitNexus:** `resolveItemBom` impact tests on: 12, risk MEDIUM, process yalnız `renderItemBom`. context incoming: 9 test + `renderItemBom`. Production process BOM UX yok.  
- **Runtime:** Vite production build’de `import.meta.env.DEV` false → panel yüklenmez. `/?rawBom` production’da no-op.  
- **Test:** Unit BOM COVERED. `e2e/visible-ui-b.spec.mjs` varsayılan girişte `#raw-bom-debug` yok; `/?rawBom` panel görünür. Satır içeriği e2e’de yok.  
- **Gerçek risk:** Kullanıcı maliyet/BOM görmez. Runtime hesap yanlışlığı kanıtlanmadı.  
- **Bucket:** B DESIGN_DECISION_REQUIRED  
- **Sınıf:** INTENTIONAL_DEV_FEATURE + DESIGN_DECISION (BUG değil, UNFINISHED_FEATURE kanıtı yok: F-025 CLOSED, bilinçli DEV kapısı).  
- **Aksiyon:** Ürün kararı (DECISION-01). Karara kadar kod değiştirme.

## MA-002

- **Severity:** HIGH  
- **Dosya/symbol:** `src/moduleContracts.js` `resolveModuleContract`  
- **İddia:** Runtime BOM/behavior bu SoT’u okumaz.  
- **Source:** `src/` import 0. 19 test import. Production BOM `itemBom` + `composition.mode`. Behavior `moduleBehavior.js`. `resolveModuleContract` test anında `getModuleBehavior` okur; insert/reflow/BOM çağırmaz.  
- **GitNexus:** tests on impact 19 direct, 0 process, risk HIGH (test fan-in). context incoming yalnız test.  
- **Runtime:** Yok.  
- **Test:** Katalog contract hub; `bom.mode === 'recipe'` ise `composition.items` assert eder (test/systemDevelopmentContract.test.js). Governance test runtime planner’ı doğrulamaz.  
- **Risk:** İkinci SoT drift.  
- **Bucket:** B  
- **Rol:** GOVERNANCE spec + TEST_ORACLE. Runtime source-of-truth değil.  
- **Aksiyon:** DECISION-02.

## MA-003

- **Severity:** HIGH  
- **Dosya/symbol:** `src/featureContracts.js` `getFeatureContract` / `FEATURE_CONTRACTS`  
- **İddia:** Planner’lar contracts’suz.  
- **Source:** `main.js` `planAutomaticDepot` / `composeAutomaticStandWall` doğrudan import. `getFeatureContract` yalnız `test/systemDevelopmentContract.test.js`.  
- **GitNexus:** impact 1 (test), 0 process, risk LOW. query process [].  
- **Runtime:** Feature çalışır; registry okunmaz.  
- **Test:** Governance. `tests/autoDepot.test.js` planner’ı test eder, FEATURE_CONTRACTS’u değil.  
- **Risk:** Docs SoT ile kod drift.  
- **Bucket:** B  
- **Rol:** GOVERNANCE spec. Gelecek runtime bağlama kararı açık.  
- **Aksiyon:** DECISION-03.

## MA-004

- **Severity:** HIGH  
- **Dosya/symbol:** `src/cornerPlacement.js` `resolveAdjacentPlacement` vs `src/wallReflow.js` `planContinuousWallLayout`  
- **İddia:** Production insert’te yok.  
- **Source:** cornerPlacement import yalnız 2 test. `main.js` wallReflow. `rightWallOrientation.test.js` 270° sağ duvarı iki modelde karşılaştırır; production insert path’i cornerPlacement çağırmaz.  
- **GitNexus:** resolveAdjacentPlacement impact 2, 0 process, LOW. planContinuousWallLayout impact 7, process `rebuildSceneFromSetup`.  
- **Runtime:** Live reflow/insert wallReflow.  
- **Test:** TEST_SUPPORT. Sapma yalnız karşılaştırılan senaryoda yakalanır.  
- **Risk:** İki model; production bug gizlenebilir. Kanıtlı production sapması yok.  
- **Bucket:** B  
- **Sınıf:** TEST_SUPPORT + ALTERNATIVE_MODEL (LEGACY/ORPHAN değil; testler canlı).  
- **Aksiyon:** DECISION-05.

## MA-005

- **Severity:** HIGH  
- **Dosya/symbol:** `item.composition.innerCorner.panelItemKey`  
- **İddia:** docs/test view adı ≠ JS path.  
- **Source production:** tek path `moduleRecipes.js:39` `item.composition.innerCorner?.panelItemKey`. Src `getRecipeInnerCornerPanelKey` silindi.  
- **Alias’lar:**  
  - Runtime: `composition.innerCorner.panelItemKey`  
  - Runtime replace: `composition.innerCorner.itemReplacements`  
  - Test helper: aynı composition path (`test/recipeParentItemKey.js:58-60`)  
  - Test view: `recipeView.variants.innerCornerPanelItemKey` (composition yok)  
  - Docs: `recipe.innerCornerPanelItemKey`, `static.composition.*`, current-system `variants.innerCornerPanelItemKey`  
- **Serialize:** change-contract: `innerCorner` proje blob’una yazılmaz. Import/export Item master. Yanlış field yazılırsa production okumaz.  
- **GitNexus:** expandRecipe production path; helper test-only.  
- **Runtime:** Değer kopya ise BOM doğru.  
- **Test:** View assert’leri eski adı kullanır.  
- **Risk:** Yanlış path yazımı; docs sapması. Runtime tek SoT.  
- **Bucket:** A  
- **Aksiyon:** Docs + test view adını JS path’e çek. Production path’e dokunma.

## MA-006

- **Severity:** HIGH  
- **Dosya/symbol:** `ITEMS.composition.moduleType` (~28 recipe parent); `composition.options` (3 L-banko, yalnız `{ shape: 'L' }`)  
- **İddia:** Production okumuyor.  
- **Source:** `src/` içinde `composition.moduleType` / `composition.options` okuma 0. `item.shape` identity ve factory tarafından okunur. `userData.moduleType` = `moduleState.type`, composition alanı değil.  
- **Yazan:** `src/items.js` freeze.  
- **Okuyan:** contract testleri `item.composition.moduleType`; test helper `recipeParentItemKey(moduleType, width)` string birleştirme (Item alanı değil).  
- **Serialize:** Item master; proje state’e kopyalanmaz.  
- **Sınıf:** `moduleType` SCHEMA_ONLY (+ TEST_READ). `options` SCHEMA_ONLY; canlı kimlik `shape`.  
- **Bucket:** B  
- **Aksiyon:** DECISION-06.

## MA-007

- **Severity:** HIGH  
- **Dosya/symbol:** `src/itemCapabilities.js` `getItemSurfaceCapabilities`  
- **İddia:** Runtime yalnız door-leaf.  
- **Alanlar:** `color`, `image`, `glass`, `lightbox`, `mesh`. Map’te yalnız `'door-leaf'` true (`color`+`image`). Diğer type `NO_SURFACE_CAPABILITIES` (hepsi false).  
- **Producer:** type map.  
- **Consumer:** `designState.createEditableItemSurfaceState` color/image (door leaf factory). `scene3d` door leaf `acceptsImage: doorLeafCapabilities.image`. `glass`/`lightbox`/`mesh` src okuma 0.  
- **Item sayısı true:** 1 type (`door_leaf_100`).  
- **Başka path:** `scene3d` banko/baz/flat-panel/showcase `acceptsImage: true` hardcoded; `createEditablePanelState` capability çağırmaz.  
- **Test:** `doorLeafItemContract`, `showcaseBodyBoardsItemContract`.  
- **Risk:** İki SoT. Capability map yüzey gerçeğini temsil etmez.  
- **Bucket:** A  
- **Aksiyon:** Tek SoT veya map’i “yalnız door-leaf leaf state” diye daralt + docs.

## MA-008

- **Severity:** HIGH (audit hotspot)  
- **Dosya/symbol:** `src/scene3d.js` `createStandScene`  
- **İddia:** impact LOW; dosya sorumluluğu HIGH.  
- **Ölçüm (source, impact değil):** LOC 7803. Tek export `createStandScene` (154–4834, ~4680 satır). Dosya düzeyi 49 top-level function, 165 iç function, 24 import, `addEventListener` 9. Item renderer’lar 4836+ (`createTvModule` … `createShowcaseModule`).  
- **GitNexus:** upstream 1 caller (`main.js`), risk LOW, process 0 (façade). UNKNOWN değil.  
- **Sorumluluklar:** sahne/kamera/renderer, stage/floor, placement ghost/drag, selection, asset/image/color/glass/fabric, capture PNG, wall overlay/strip, GLB load, item mesh.  
- **Regression hotspot’lar:** `createStandScene` return façade; `dropCatalogModuleDrag`; surface apply*; `create*Module`; GLB loader’lar. Refactor planı yok.  
- **Bucket:** C (bug yok; koruma MA-010)  
- **Aksiyon:** Dokunma / test koruması WP-08.

## MA-009

- **Severity:** MEDIUM  
- **Symbol:** `src/groundLayout.js` `createGroundLayout`  
- **Source:** scene3d import 0. Gate map renderer+placement.  
- **GitNexus:** impact 1 test, 0 process, LOW.  
- **Sınıf:** TEST_SUPPORT orphan-to-runtime.  
- **Bucket:** B  
- **Aksiyon:** DECISION-04.

## MA-010

- **Severity:** MEDIUM  
- **İddia:** scene3d dosya unit yok.  
- **Source:** `test/` scene3d.js import eden dosya-seviye unit yok; e2e smoke/item kısmi.  
- **Risk:** 7803 satır regression.  
- **Bucket:** A  
- **Aksiyon:** Targeted renderer/placement/selection test; tüm dosyayı unit’e çevirme.

## MA-011

- **Severity:** MEDIUM  
- **İddia:** e2e BOM yok.  
- **Düzeltme:** Panel varlığı e2e var; BOM satır doğruluğu yok. DEV-only.  
- **Bucket:** A (test gap; ürün kararına bağlı kapsam)  
- **Aksiyon:** DEV kalırsa mevcut spec’e satır assert. Production açılırsa production e2e.

## MA-012

- **Severity:** MEDIUM  
- **İddia:** `test/` + `tests/` iki kök.  
- **Source:** `tests/autoDepot.test.js`, `tests/moduleBehavior.test.js`. FEATURE_CONTRACTS regressionFiles `tests/autoDepot.test.js` gösterir. `npm test` = `node --test` her iki kökü de çalıştırır.  
- **Bucket:** A  
- **Aksiyon:** Tek kök; FEATURE_CONTRACTS path güncelle.

## MA-013

- **Severity:** MEDIUM  
- **Symbol:** `getConnectorItemKey` / `resolveConnectorBom`  
- **Source:** ITEMS `connectorType` 4 kayıt. Recipe `composition.items` connector itemKey taşır. API yalnız `test/connectorBom.test.js` + kendi dosya.  
- **GitNexus:** impact 2, 0 process, LOW.  
- **Sınıf:** Data ACTIVE_RUNTIME; API TEST_ONLY.  
- **Bucket:** B  
- **Aksiyon:** DECISION-08.

## MA-014

- **Severity:** MEDIUM  
- **Symbol:** `test/recipeParentItemKey.js` `recipeView.variants`  
- **Source:** View `composition` taşımaz. Helper artık Item ister. `showcaseRecipes` vb. view alanını assert eder.  
- **Risk:** Test projeksiyonunu production sanmak.  
- **Bucket:** A  
- **Aksiyon:** View’i TEST_PROJECTION diye işaretle veya kaldır.

## MA-015

- **Severity:** MEDIUM (audit); doğrulama: gerçek kapı riski  
- **Dosya:** `.github/change-contract.json`, `scripts/verify-change-contract.mjs`, `src/systemChangeContract.js`  
- **İddia:** Contract Version2 diff ile hizasız.  
- **Source:** Contract id `item-composition-inner-corner`. `behavior`/`placement`/`renderer` `not-applicable`. `src/main.js` requiredDomains behavior+renderer+placement içerir; `src/scene3d.js` renderer/state/placement/behavior/performance. Guarded dosya diff’teyse `undeclaredRequiredDomains` fail eder.  
- **CI:** `.github/workflows/ci.yml` yalnız `RefactorItem` push/PR. Push kapısı `before..after` (o push), Version2 birikmiş diff değil. Local default Version2; cleanup `CHANGE_GATE_BASE=HEAD` ile dar pencere kullanıldı.  
- **Yakalar:** Contract dosyası güncellenmeden guarded değişim; path-required domain’in `affected` olmaması; discovery’de eksik declared file/test/doc.  
- **Kaçırır:** Dalda daha önce merge edilmiş main/scene3d değişimi (push penceresi dışında); `not-applicable` + birikmiş dosya; Version2’ye PR yok (CI Version2 dinlemez).  
- **Yanlış pozitif:** Discovery fazla file ister (affectedFiles şişer). Extra declared file fail değil.  
- **Yanlış negatif:** Evet — CI Version2 yüzeyini görmez; HEAD override birikmiş domain’i atlar. **Regression riski gerçek.**  
- **Bucket:** A  
- **Aksiyon:** WP-01. P1.

## MA-016

- **Severity:** MEDIUM  
- **İddia:** `STAND_DIMENSIONS.stripCount` 7 vs Item `stripOccupancy.stripCount` 1–2.  
- **Source:** İki kavram. Stand zarfı 7 şerit; short-up overlay 1/2. `resolveModuleStripOccupancy` Item/state okur; stand grid `STAND_DIMENSIONS`.  
- **Bug kanıtı yok.**  
- **Bucket:** C  
- **Aksiyon:** İsimlendirmeyi belgede tut.

## MA-017

- **Severity:** MEDIUM  
- **İddia:** `visualRotationYDeg` vs `modelRotationYDeg` çift SoT.  
- **Source:** İkisi de ITEMS’te. `modelRotationYDeg` GLB; `visualRotationYDeg` görsel grup (çöp kutusu/preview). `designState` ikisini state’e kopyalar. Distinct ACTIVE_RUNTIME.  
- **Bucket:** C  
- **Aksiyon:** Birleştirme yok.

## MA-018

- **Severity:** MEDIUM  
- **Symbol:** `STAND_AXES`  
- **Source:** `validateStandAxisCapacity` iç `includes`. Dış import 0.  
- **GitNexus:** graph incoming boş olabilir; grep USED.  
- **Bucket:** C  
- **Aksiyon:** Export daraltma opsiyonel; silme yasak.

## MA-019

- **Severity:** MEDIUM  
- **Dosya:** `scripts/archive/add-tv-sizes.py`, `add-video-wall-2x2.py`, `fix-tv-screen-face.py`  
- **Source:** package.json/CI yok. Elle çalışırsa kaynak bozabilir.  
- **Bucket:** A (hijyen) + DECISION-07  
- **Aksiyon:** Sınıflandır/sil; F-045.

## MA-020

- **Severity:** MEDIUM  
- **İddia:** F-045 OPEN.  
- **Bucket:** B  
- **Aksiyon:** DECISION-07.

## MA-021

- **Severity:** LOW  
- **İddia:** docs `static.shelfCount`; Item alanı 0.  
- **Source:** `src/` shelfCount yalnız yorum + test “yok” assert.  
- **Bucket:** A  
- **Aksiyon:** MD güncelle.

## MA-022

- **Severity:** LOW  
- **İddia:** `catalog.sizeInch` / `sizeInch` src 0. TV `dimensions`.  
- **Bucket:** A  
- **Aksiyon:** MD güncelle.

## MA-023

- **Severity:** LOW  
- **İddia:** `static.*` JS path değil.  
- **Bucket:** A  
- **Aksiyon:** Audit katmanını “docs notation” işaretle.

## MA-024

- **Severity:** LOW  
- **İddia:** `src/tvConfig.js` yok.  
- **Source:** current-system TV MD + A02 path.  
- **Bucket:** A  
- **Aksiyon:** Ghost path sil.

## MA-025

- **Severity:** LOW  
- **İddia:** property MD src `getRecipeInnerCornerPanelKey` read. Export yok.  
- **Bucket:** A  
- **Aksiyon:** Audit MD.

## MA-026

- **Severity:** LOW  
- **İddia:** knip e2e unused file.  
- **Source:** Playwright `testDir`; `npm run e2e`; 26 spec. USED.  
- **Bucket:** C  
- **Aksiyon:** İsteğe bağlı knip ignore; silme yasak.

## MA-027

- **Severity:** LOW  
- **İddia:** knip `playwright.config.mjs` unused.  
- **Bucket:** C  
- **Aksiyon:** ignore; silme yasak.

## MA-028

- **Severity:** LOW  
- **Dosya:** `scripts/video-wall-build-trigger.txt`  
- **Refs:** roadmap + atlas. Runtime 0.  
- **Bucket:** A  
- **Aksiyon:** Sil veya belgele. SAFE_TO_REMOVE değil (roadmap bağı).

## MA-029

- **Severity:** LOW  
- **Symbol:** `PROJECT_ARCHIVE_VERSION`  
- **Source:** `validateImportedProjectState` / manifest iç ACCESS.  
- **Bucket:** C  
- **Aksiyon:** Dokunma.

## MA-030

- **Severity:** LOW  
- **İddia:** `tests/` 2 dosya. MA-012 ile aynı kök.  
- **Bucket:** A  
- **Aksiyon:** WP-07.

## MA-031

- **Severity:** LOW  
- **İddia:** change-contract `affectedFiles` silinen patch-video-wall `*.cjs`.  
- **Source:** dosyalar CLEANUP_PHASE_1’de silindi; liste stale. Gate extra declared’i cezalandırmaz.  
- **Bucket:** A  
- **Aksiyon:** Listeyi güncel diff’e çek (WP-01).

## MA-032

- **Severity:** LOW  
- **Symbol:** `validateImportedModuleState` / `validateImportedStandState`  
- **Source:** aynı dosyada CALLS. Knip unused-export false-positive.  
- **Bucket:** C  
- **Aksiyon:** Dokunma.

## MA-033

- **Severity:** LOW  
- **İddia:** SYSTEM_AUDIT_CHECKLIST A02.04 tvConfig GAP.  
- **Bucket:** A  
- **Aksiyon:** MA-024 ile checklist.

## MA-034

- **Severity:** LOW  
- **İddia:** patch cjs silindi.  
- **Source:** CLEANUP_PHASE_1 tamam.  
- **Bucket:** C  
- **Aksiyon:** Yok (kapanmış).

## MA-035

- **Severity:** INFO  
- **Symbol:** `getItem`  
- **GitNexus:** tests off impact 130, direct 60, 79 process, CRITICAL.  
- **Bucket:** C  
- **Aksiyon:** Değişiklik kapısı; refactor yok.

## MA-036

- **Severity:** INFO  
- **Symbol:** `getModuleBehavior` (`src/moduleBehavior.js:220`)  
- **GitNexus:** disambiguated Function impact 72, direct 21, 45 process, CRITICAL. İkinci aday UNKNOWN — grep ile Function kullanılır.  
- **Bucket:** C

## MA-037

- **Severity:** INFO  
- **Symbol:** `createModuleStateFromDescriptor`  
- **GitNexus:** impact 9, direct 4, 5 process, CRITICAL; riskSharedAxes LOW.  
- **Bucket:** C

## MA-038

- **Severity:** INFO  
- **GitNexus check:** cycleCount 0.  
- **Bucket:** C  
- **Aksiyon:** Yok.

## MA-039

- **Severity:** INFO  
- **Source:** `src/` `new Worker` 0.  
- **Bucket:** C

## MA-040

- **Severity:** INFO  
- **Symbol:** `CATALOG_PREVIEW_RENDERERS`  
- **Source:** `moduleDragSidebar.js` `CATALOG_PREVIEW_RENDERERS[catalogPreview]`. Test whitelist. USED. Graph CALLS eksik olabilir.  
- **Bucket:** C

---

## Sayım doğrulaması

A: MA-005,007,010,011,012,014,015,019,021,022,023,024,025,028,030,031,033 → **17**  
B: MA-001,002,003,004,006,009,013,020 → **8**  
C: MA-008,016,017,018,026,027,029,032,034,035,036,037,038,039,040 → **15**  
**40/40.**
