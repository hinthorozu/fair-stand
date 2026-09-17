# Unused Candidates

Knip tek başına gerçek kabul edilmedi. Her aday: GitNexus `context`/`impact` + kaynak grep + import grafı + HTML/script/e2e.

Sınıflar: USED | PROVEN_UNUSED | LIKELY_UNUSED | UNCERTAIN_DYNAMIC | TEST_ONLY | SCRIPT_ONLY

**PROVEN_UNUSED eşiği:** production + test + config + script + dynamic + HTML + string-key tarama negatif **ve** silmeye güçlü aday. Bu taramada **tam dosya silme için PROVEN_UNUSED yok.** Birkaç **export** iç kullanımda USED, dış import’ta ölü.

---

## A. Knip unused files — doğrulama

### `playwright.config.mjs`

| | |
| --- | --- |
| Knip | unused file |
| GitNexus | config; Playwright runtime okur |
| Runtime | `package.json` `"e2e": "playwright test"`; CI `npm run e2e` |
| **Status** | **USED** |

### `e2e/*.spec.mjs` (26 dosya, Knip listesinin tamamı)

| | |
| --- | --- |
| Knip | her spec unused file |
| Kanıt | `playwright.config.mjs` `testDir: './e2e'` — Playwright glob `**/*.spec.mjs` |
| **Status** | **USED** (e2e entry). Otomatik unused sayılmaz. |

Liste: `base-items-contract`, `commercial-items-contract`, `desk-banko-items-contract`, `f010-module-construction`, `f011-module-behavior`, `f020-save-before-project-actions`, `f023-atomic-project-delete`, `f027-scene-reset`, `f028-reset-features`, `floor-items-contract`, `free-props-collision-none`, `furniture-items-contract`, `indoor-plant-items-contract`, `invalid-placement-ghost`, `lighting-items-contract`, `mini-fridge-dimensions`, `plastic-trash-bin-asset`, `plastic-trash-bin-module`, `project-import-validation`, `shelf-items-contract`, `smoke`, `visible-ui-b`, `wall-flat-panel-items-contract`, `wall-media-items-contract`, `wall-separator-items-contract`, `wall-showcase-item-contract`.

### `scripts/patch-video-wall-2x2.cjs` / `patch-video-wall-single-image.cjs`

Silindi. Doğrulama: `CODE_ATLAS/AUDIT_VERIFICATION.md` (`SCRIPT_ONLY_STALE`). Uygulama: `CODE_ATLAS/CLEANUP_PHASE_1.md`.

---

## B. Knip unused exports — öncelikli doğrulama

### `STAND_AXES` (`src/standCapacity.js`)

| | |
| --- | --- |
| GitNexus context | incoming `{}`, processes `[]`, epistemic exact |
| impact upstream | impactedCount 0, risk UNKNOWN (riskNote: edge yok = unused kanıtı değil) |
| Grep | yalnız `standCapacity.js`: tanım + `STAND_AXES.includes(axis)` |
| Import | `main.js` `validateStandAxisCapacity` import eder; `STAND_AXES` import etmez |
| Test | `standCapacity.test.js` dosyayı import eder, sembolü kullanmaz |
| **Status** | **USED** (modül-içi). **Export** dışarıdan ölü. Silme adayı: `export` kaldırılabilir; sembol silinemez |

### `PROJECT_ARCHIVE_VERSION` (`src/projectImportValidation.js`)

| | |
| --- | --- |
| GitNexus | accesses: `validateImportedProjectState`, `validateProjectArchiveManifest` |
| Grep | dış import yok |
| main import | `validateProjectArchiveManifest` vb.; const’u değil |
| **Status** | **USED** (modül-içi). Export dışarıdan ölü |

### `validateImportedModuleState`

| | |
| --- | --- |
| GitNexus | CALLS: `validateImportedProjectState` |
| impact (includeTests) | d=1 validateImportedProjectState → d=2 test + validateProjectArchiveManifest → d=3 main.js |
| main | fonksiyonu import etmez; archive zinciri kullanır |
| **Status** | **USED** (iç). Export dışarıdan ölü (`TEST_ONLY` değil; production import path iç çağrı) |

### `validateImportedStandState`

Aynı zincir + outgoing `getFloorItem`, `resolveStandFloorItemKey`, `validateStandSetup`. **USED** (iç).

### `getRecipeInnerCornerPanelKey`

`src/moduleRecipes.js` export’u silindi. Test helper `test/recipeParentItemKey.js` production path `item.composition.innerCorner?.panelItemKey` ile hizalandı. `expandRecipe` inline okuma duruyor. Bkz. `CODE_ATLAS/CLEANUP_PHASE_1.md`.

---

## C. Knip’in raporlamadığı, graph+grep ile bulunan adaylar

### `src/groundLayout.js` / `createGroundLayout`

| | |
| --- | --- |
| Prod IMPORTS | yok |
| scene3d | `createGroundLayout` / `GridHelper` eşleşmesi yok |
| Callers | yalnız `test/groundLayout.test.js` |
| Process | `[]` |
| Change-gate | `systemChangeContract.js` path map |
| **Status** | **TEST_ONLY**. Renderer’dan kopuk implementasyon. Silme: test+gate path güncellemesi gerekir → PROVEN_UNUSED değil |

### `src/featureContracts.js`

Prod import yok. Callers: `systemDevelopmentContract.test.js`. Docs/README zorunlu sözleşme kaynağı gösterir. Runtime `autoDepot`/`automaticWall` contract’ı okumaz. **TEST_ONLY** (governance).

### `src/moduleContracts.js` / `resolveModuleContract`

Prod import yok. 19 test caller. **TEST_ONLY** (governance hub).

### `src/cornerPlacement.js` / `resolveAdjacentPlacement`

Prod import yok. Test callers 2. Process var (graph test/helper). Production insert `wallReflow`/`modulePlacement`. **TEST_ONLY**.

### `src/systemChangeContract.js`

Prod import yok. Script+test. **SCRIPT_ONLY**.

### `getConnectorItemKey` / `resolveConnectorBom`

Grep: yalnız `items.js` + `test/connectorBom.test.js`. Recipe BOM connector’ı başka yoldan üretiyor olabilir; bu iki export production çağrılmıyor. **TEST_ONLY**.

### `resolveItemBom` / `itemBom.js`

Prod: `rawBomDebug.js` ← `main.js` `import.meta.env.DEV && ?rawBom`. Production build’de DEV false → kullanıcı yolunda yok. Testler yoğun. **TEST_ONLY** + **DEV debug**. Kullanıcı BOM özelliği değil.

### `src/projectActionSaveGuard.js`

Graph: test + (HTML). **USED**.

---

## D. Zero-CALLS tuzakları (USED)

GitNexus zero-caller listesinden **kullanılan** örnekler:

- `main.js` `onKeyDown`, `onPointerMove`, DOM listener
- `scene3d` return API (`getCameraMode`, `clearSelection`, …)
- `designState` factory map key’leri (`bar-stool`, …)
- `helpGuide.openGuide`
- `sidebarController.onClick`

Bunlar **UNCERTAIN_DYNAMIC** değil; HTML/Three.js/façade. PROVEN_UNUSED denemez.

---

## E. Dependencies / binaries

| Aday | Knip | Doğrulama | Status |
| --- | --- | --- | --- |
| `playwright` binary | unused binary | `e2e:deps` ile geçici; CI kullanır | USED (tooling, package.json’da yok) |
| `three` | raporlanmadı | scene3d | USED |
| `jszip` | raporlanmadı | dinamik import main | USED |
| `vite` | raporlanmadı | scripts | USED |

Unresolved imports: Knip `unresolved: []`. GitNexus missing-module taraması bu oturumda boş.

---

## F. Döngüler

`knip-cycles.json`: `issues: []`.  
GitNexus `check`: `status: clean`, `cycleCount: 0`, `componentCount: 0`, `enumeration: complete`.

**Hüküm: circular file import yok.**
