# Test Map

**Kanıt:** glob `test/*.js` (184), `tests/*.js` (2), `e2e/*.spec.mjs` (26), `package.json` `test`/`e2e`, Playwright `testDir: './e2e'`.

Sınıflar: **COVERED** / **PARTIAL** / **NO COVERAGE** / **TEST_ONLY**.

TEST_ONLY burada “feature’ın production’da olmayıp yalnız testte yaşaması” değil; `07` sütunu production feature’ın test durumudur. Test-only **kod** `08_UNUSED_CANDIDATES.md`.

## Runner

| | |
| --- | --- |
| Unit | `node --test` — `test/` ve `tests/` |
| E2E | `playwright test` — 26 spec, Chromium, `webServer: npm run dev --port 4173` |
| CI | her ikisi de `.github/workflows/ci.yml` |

E2E spec’ler Knip unused file. **Durum: USED** (Playwright entry).

## Production feature → test

| Feature | Unit (örnek) | E2E | Durum |
| --- | --- | --- | --- |
| Item contract / katalog | `*ItemsContract.test.js`, `catalog*.test.js`, `itemCatalogFields.test.js` | `*-items-contract.spec.mjs`, `base/floor/furniture/shelf/...` | COVERED |
| Module behavior | `moduleBehavior.test.js` (`tests/`), `moduleBehaviorPolicy/Contract`, rotation, ghost | `f011-module-behavior.spec.mjs` | COVERED |
| Module construction / state | `moduleStateConstructionRegistry.test.js`, `designState.test.js`, `*Module.test.js` | `f010-module-construction.spec.mjs` | COVERED |
| Placement / collision | `modulePlacement.test.js`, `freePropsCollisionNone.test.js`, `lCounterPlacement.test.js` | `invalid-placement-ghost.spec.mjs`, `free-props-collision-none.spec.mjs` | COVERED |
| Auto depot / wall | `tests/autoDepot.test.js`, `automaticWall.test.js`, `depot*.test.js` | PARTIAL (contract e2e ticari öğeler) | PARTIAL |
| Stand setup / kapasite | `standSetup.test.js`, `standCapacity.test.js`, `visibleUiContract.test.js` | smoke / visible-ui | PARTIAL |
| Proje persist / autosave | `f032ConfiguratorDb.test.js`, `autosave*.test.js`, `projectSwitch.test.js`, `projectActionSaveGuard.test.js`, `projectAtomicDeletion.test.js` | `f020-save-before-project-actions.spec.mjs`, `f023-atomic-project-delete.spec.mjs` | COVERED |
| Import validation | `projectImportValidation.test.js`, `projectImportFlow.test.js` | `project-import-validation.spec.mjs` | COVERED |
| Sahne reset / feature reset | `f027SceneReset.test.js`, `f028FeatureReset.test.js` | `f027-scene-reset.spec.mjs`, `f028-reset-features.spec.mjs` | COVERED |
| Görsel asset | `imageAssetDeletion.test.js`, `imageAssetLiveDelete.test.js`, `imageFit.test.js` | `plastic-trash-bin-asset.spec.mjs` | PARTIAL |
| Renk editörü | `colorEditor*.test.js`, `colorUtils.test.js` | yok özel spec | PARTIAL |
| Seçim / UI copy | `selectionFeedback*.test.js`, `visibleUiContract.test.js`, `helpGuide.test.js` | `visible-ui-b.spec.mjs`, `smoke.spec.mjs` | PARTIAL |
| BOM / recipe | `moduleRecipes.test.js`, `*Recipes.test.js`, `itemBom` tüketen contract testleri, `connectorBom.test.js` | yok | COVERED unit; e2e yok (BOM DEV UI) |
| Change gate | `systemChangeGate*.test.js`, `hygieneGates.test.js`, `systemImpactAnalysis.test.js` | yok | COVERED (tooling) |
| `scene3d.js` renderer gövdesi | dolaylı (gltfLoadCache, lightbox, module testleri) | birçok e2e sahneyi açar | PARTIAL — `scene3d.test.js` yok |
| `main.js` orkestrasyon | `*MainIntegration.test.js` | smoke + feature e2e | PARTIAL |
| Context menu | `moduleContextDirection.test.js`, `moduleContextAllowSideInsert.test.js` | PARTIAL | PARTIAL |
| Keyboard / view | `viewKeyboard*.test.js` | yok özel | PARTIAL |
| Strip occupancy / seam | `stripOccupancy.test.js`, `shelfCatalogPanelSeam.test.js` | `shelf-items-contract.spec.mjs` | COVERED |
| Mini fridge / trash bin | `miniFridge*.test.js`, `plasticTrashBin*.test.js` | `mini-fridge-dimensions.spec.mjs`, `plastic-trash-bin-*.spec.mjs` | COVERED |
| Lighting / foam | `ledFloodlightModule.test.js`, `illuminatedFoam*.test.js`, `lightboxFabric*.test.js` | `lighting-items-contract.spec.mjs` | COVERED |
| Indoor plants | `indoorPlants.test.js`, `indoorPlantItemsContract.test.js` | `indoor-plant-items-contract.spec.mjs` | COVERED |

## Production’da var, birim testi zayıf / yok

| Yüzey | Kanıt | Durum |
| --- | --- | --- |
| `src/scene3d.js` (~7800+ satır, createStandScene façade) | dosya-adlı unit test yok | NO COVERAGE dosya olarak; PARTIAL davranış e2e/modül testleriyle |
| `src/viewCube.js` | doğrudan test glob’da yok | NO COVERAGE / UNCERTAIN (scene3d üzerinden) |
| `captureCurrentViewPng` | process var; özel test adı görülmedi | NO COVERAGE (e2e’de buton olabilir — doğrulanmadı) |
| Zip export tam roundtrip | import testleri var | PARTIAL |
| Three.js lifecycle (dispose, animation loop) | `viewCube.dispose` graph’da çok çağrılır | NO COVERAGE birim |

## Test-only kod (production feature değil)

| Kod | Test | Sınıf |
| --- | --- | --- |
| `src/groundLayout.js` | `groundLayout.test.js` | TEST_ONLY |
| `src/featureContracts.js` | `systemDevelopmentContract.test.js` | TEST_ONLY |
| `src/moduleContracts.js` | contract testleri | TEST_ONLY |
| `src/cornerPlacement.js` | `cornerPlacement.test.js`, `rightWallOrientation.test.js` | TEST_ONLY |
| `test/recipeParentItemKey.js` | test helper | TEST_ONLY |
| `getConnectorItemKey` / `resolveConnectorBom` | `connectorBom.test.js` | TEST_ONLY |
| `getRecipeInnerCornerPanelKey` | `test/recipeParentItemKey.js` + recipe testler | TEST_ONLY |

## `tests/` vs `test/`

İki kök: `tests/autoDepot.test.js`, `tests/moduleBehavior.test.js`. `FEATURE_CONTRACTS.automaticDepot.tests.regressionFiles` `tests/autoDepot.test.js` yolunu yazar. Node `--test` her iki dizini de çalıştırır (varsayılan).
