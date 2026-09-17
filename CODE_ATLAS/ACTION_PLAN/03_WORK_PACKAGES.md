# 03 — Work packages

Tek tek 40 iş yok. Bağlı finding’ler paketlenir. B paketleri kararsız kodlanmaz.

---

## WP-01 CHANGE GATE COVERAGE

- **Finding’ler:** MA-015, MA-031  
- **Problem:** Contract `item-composition-inner-corner` birikmiş `RefactorItem` vs Version2 yüzeyini temsil etmiyor. CI yalnız `RefactorItem` push/PR `before..after` bakar. `behavior`/`renderer`/`placement` `not-applicable` iken `src/main.js` / `src/scene3d.js` path map’i bu domain’leri zorunlu kılar. Silinen patch `*.cjs` `affectedFiles`’te kaldı.  
- **Birlikte:** Aynı kapı dosyası ve verify script.  
- **Değişiklik alanı:** `.github/change-contract.json`, `.github/workflows/ci.yml` (base seçimi), belki `scripts/verify-change-contract.mjs` dokümantasyonu. Runtime item/BOM yok.  
- **Regression:** Kapı yanlış yeşil → sonraki PR’da domain kaçırma.  
- **Test:** `test/systemChangeGate.test.js`, `test/systemChangeGateLocalDiff.test.js`; `CHANGE_GATE_BASE` ile Version2 ve HEAD senaryoları.  
- **Dependency:** Yok (ilk).  
- **Sıra:** 1. **P1**

## WP-02 SURFACE CAPABILITY ALIGNMENT

- **Finding’ler:** MA-007  
- **Problem:** `getItemSurfaceCapabilities` yalnız door-leaf; sahne `acceptsImage` başka type’larda hardcoded. `glass`/`lightbox`/`mesh` hiç true değil. Docs capabilities geniş.  
- **Birlikte:** Tek capability SoT.  
- **Değişiklik alanı:** `src/itemCapabilities.js`, `src/designState.js` (door leaf), `src/scene3d.js` surface userData, docs capabilities, door/panel contract testleri.  
- **Regression:** Kapı kanadı renk/görsel; banko/panel image.  
- **Test:** `test/doorLeafItemContract.test.js`, panel/counter surface testleri, ilgili e2e.  
- **Dependency:** DECISION yoksa en azından “map yalnız door-leaf leaf state” belgesi. Tam birleştirme ürün kararı isteyebilir.  
- **Sıra:** 2. **P1**

## WP-03 CONTRACT / RUNTIME ROLE

- **Finding’ler:** MA-002, MA-003  
- **Problem:** `SYSTEM_DEVELOPMENT_CONTRACT` SoT tablosu `moduleContracts` / `featureContracts` der; production `itemBom`+`moduleBehavior` ve `autoDepot`/`automaticWall` okur.  
- **Birlikte:** Aynı “docs SoT vs executable” sınıfı.  
- **Değişiklik alanı:** Karara göre ya contract MD + yorum, ya planner/BOM’un registry okuması. İkinci yol HIGH blast (`getModuleBehavior` CRITICAL; planners live).  
- **Regression:** Planner/BOM sapması.  
- **Test:** `test/systemDevelopmentContract.test.js`; planner testleri; bağlanırsa BOM/behavior e2e.  
- **Dependency:** DECISION-02, DECISION-03.  
- **Sıra:** 3. **P1** (karar); kod sonra.

## WP-04 BOM PRODUCT DECISION

- **Finding’ler:** MA-001, MA-011  
- **Problem:** BOM resolver live; kullanıcı UI DEV `?rawBom`. E2e panel açılışını doğrular, satırları değil.  
- **Birlikte:** Ürün kararı e2e kapsamını belirler.  
- **Değişiklik alanı:** Karara göre `main.js` kapısı / `rawBomDebug` / production UI; veya docs “bilinçli DEV”.  
- **Regression:** Sidebar, selection parse, recipe expand.  
- **Test:** mevcut unit + `e2e/visible-ui-b.spec.mjs` genişletme.  
- **Dependency:** DECISION-01.  
- **Sıra:** 4. **P1** karar / **P2** UI işi.

## WP-05 INNER CORNER NAMING

- **Finding’ler:** MA-005, MA-014, MA-025  
- **Problem:** Production tek path `composition.innerCorner.panelItemKey`. Docs/test view eski ad.  
- **Birlikte:** Aynı alias kümesi.  
- **Değişiklik alanı:** docs property MD, current-system, `recipeView` (veya test assert path). `expandRecipe` **dokunulmaz**.  
- **Regression:** Inner-corner BOM testleri.  
- **Test:** `test/moduleRecipes.test.js`, corner/panel contract, showcaseRecipes.  
- **Dependency:** Yok.  
- **Sıra:** 5. **P2**

## WP-06 ITEM SCHEMA CLEANUP

- **Finding’ler:** MA-006, MA-013, MA-021, MA-022, MA-023  
- **Problem:** SCHEMA_ONLY / STALE / TEST_ONLY API ile docs sapması.  
- **Birlikte:** Item field health; `ITEM_CONTRACT` okunmadan schema silinmez.  
- **Değişiklik alanı:** Karara göre `items.js` alan kaldırma veya okuma; docs; connector API.  
- **Regression:** 96 Item, `getItem` CRITICAL.  
- **Test:** item contract suite, catalog projection, connectorBom.  
- **Dependency:** DECISION-06, DECISION-08.  
- **Sıra:** 7. **P2**

## WP-07 LEGACY / TEST SUPPORT CLASSIFICATION

- **Finding’ler:** MA-004, MA-009, MA-012, MA-030  
- **Problem:** `cornerPlacement` / `groundLayout` TEST_SUPPORT; iki test kökü.  
- **Birlikte:** Production’a bağlanmayan `src/` + test layout.  
- **Değişiklik alanı:** Karara göre sahneye bağlama veya dosya başlığı GOVERNANCE/TEST_SUPPORT; `tests/` → `test/`.  
- **Regression:** 270° sağ duvar; autoDepot tests path.  
- **Test:** cornerPlacement, rightWallOrientation, groundLayout, autoDepot.  
- **Dependency:** DECISION-04, DECISION-05.  
- **Sıra:** 8. **P2**

## WP-08 HOTSPOT PROTECTION

- **Finding’ler:** MA-008 (bağlam), MA-010, MA-035, MA-036, MA-037  
- **Problem:** scene3d 7803 LOC / createStandScene ~4680 iç fonksiyon; getItem/getModuleBehavior CRITICAL hub. Refactor yok; test kalkanı yok.  
- **Birlikte:** Hub’a dokunmadan koruma.  
- **Değişiklik alanı:** test/e2e only.  
- **Regression:** Test kırılganlığı.  
- **Test:** placement drag, selection, bir GLB/item renderer, camera/capture duman.  
- **Dependency:** Yok.  
- **Sıra:** 6. **P2**

## WP-09 DOCS / HYGIENE

- **Finding’ler:** MA-019, MA-020, MA-024, MA-028, MA-033, MA-034  
- **Problem:** Ghost path, py yama, trigger txt, F-045. MA-034 kapanmış.  
- **Değişiklik alanı:** docs/checklist/roadmap; `scripts/*.py` (kararlı).  
- **Regression:** Düşük (elle script).  
- **Test:** docs alignment testleri varsa.  
- **Dependency:** DECISION-07 py için.  
- **Sıra:** 9. **P3**

C finding’ler (MA-016,017,018,026,027,029,032,034,038,039,040) paket işi değil.
