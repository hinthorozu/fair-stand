# Entry Points

**Kanıt kaynakları:** `index.html`, `vite.config.js`, `package.json`, `playwright.config.mjs`, `.github/workflows/ci.yml`, GitNexus File IMPORTS, kaynak grep.

Workers: yok. `new Worker` eşleşmesi 0.

## 1. HTML / tarayıcı

| Entry | Kanıt | Yorum |
| --- | --- | --- |
| `index.html` → `<script type="module" src="/src/main.js">` | `index.html` satır 158 | Ana uygulama |
| `index.html` → `<script type="module" src="/src/projectActionSaveGuard.js">` | `index.html` satır 159 | İkinci entry. GitNexus File IMPORTS grafında `main.js` bunu import etmez; HTML yükler. Knip/graph “yalnız test importer” okuması **false-positive** olur. |
| `#app`, `#viewport`, stand/proje/modül formları | `index.html` DOM id’leri | `main.js` `document.querySelector` ile bağlanır |

`projectActionSaveGuard.js` dosya sonunda `bindProjectActionSaveGuard()` çağırır (self-bootstrap). Testler aynı export’u import eder.

## 2. Vite

| Entry | Kanıt |
| --- | --- |
| `npm run dev` → `vite` | `package.json` |
| `npm run build` → `vite build` | `package.json` |
| `npm run preview` → `vite preview` | `package.json` |
| Root HTML | Vite varsayılanı: `index.html` |
| Three.js vendor chunk | `vite.config.js` `rolldownOptions.output.codeSplitting.groups` `three-vendor` |

Dinamik import (production/dev):

| Çağrı | Dosya | Koşul |
| --- | --- | --- |
| `import('./rawBomDebug.js')` | `src/main.js` | `import.meta.env.DEV && URLSearchParams.has('rawBom')` |
| `import('jszip')` | `src/main.js` `loadJSZip()` | proje zip import/export |

## 3. JS production grafı (main.js’ten)

GitNexus `IMPORTS` (yalnız `src/` → `src/`):

`main.js` doğrudan: assetStore, autoDepot, automaticWall, autosaveController, colorEditorController, designState, helpGuide, imageAssetReferences, items, moduleBehavior, moduleContextMenu, moduleDragSidebar, modulePlacement, projectImportValidation, projectNaming, projectStore, projectSwitch, projectUi, rawBomDebug (koşullu), rectSelection, scene3d, selectionFeedback, sidebarController, stageFeedback, standCapacity, standSetup, standStandardsCopy, uiFeedback, wallReflow.

CSS (main.js static import): `style.css`, `colorEditor.css`, `imageActions.css`, `helpGuide.css`.

`scene3d.js` doğrudan: catalog, designState, horizontalImageLayout, imageFit, itemCapabilities, items, moduleBehavior, moduleDragSidebar, moduleMove, modulePlacement, placementFeedback, rectImageLayout, rectSelection, sceneDimensions, standDimensions, stripOccupancy, surfaceStateBinding, theme, viewCube, viewKeyboardShortcuts.

## 4. HTML-only / graph-dışı production

| Dosya | Nasıl bağlanır |
| --- | --- |
| `src/projectActionSaveGuard.js` | HTML script tag + dosya sonu çağrısı |

## 5. Script / tooling

| Script | `package.json` | CI | Dokümantasyon / başka |
| --- | --- | --- | --- |
| `scripts/verify-change-contract.mjs` | `contract:verify` | `.github/workflows/ci.yml` “Change contract gate” | `SYSTEM_CHANGE_GATE.md`; `change-impact-analysis.mjs` import eder |
| `scripts/change-impact-analysis.mjs` | yok | dolaylı (`verify-change-contract`) | `SYSTEM_CHANGE_GATE.md`, `test/systemImpactAnalysis.test.js` |
| `scripts/check-src-syntax.mjs` | `syntax:check` | CI “Source syntax check” | `test/hygieneGates.test.js` |
| `scripts/install-server.sh` | yok | yok | deploy; `audit/evidence/A20_BUILD_CI_DEPLOY.md`, `test/hygieneGates.test.js` |
| `scripts/archive/add-tv-sizes.py` | yok | yok | change-contract + TV item audit MD |
| `scripts/archive/add-video-wall-2x2.py` | yok | yok | aynı |
| `scripts/archive/fix-tv-screen-face.py` | yok | yok | aynı |
| `scripts/video-wall-build-trigger.txt` | yok | yok | roadmap legacy listesi |

`src/systemChangeContract.js`: production `main.js` import etmez. Callers: `scripts/verify-change-contract.mjs`, `test/systemChangeGate.test.js`. Sınıf: `SCRIPT_ONLY` (+ test).

## 6. Test entry

| Runner | Komut | Keşif |
| --- | --- | --- |
| Node test runner | `npm test` → `node --test` | `test/**/*.test.js`, `tests/*.test.js` (Node varsayılan glob) |
| Playwright | `npm run e2e` → `playwright test` | `playwright.config.mjs` `testDir: './e2e'` — **26 spec’in tamamı entry** |
| Playwright config | `playwright.config.mjs` | `npx playwright test` / `npm run e2e` bunu okur |
| E2E webServer | aynı config | `npm run dev -- --host 127.0.0.1 --port 4173` |

Knip `playwright.config.mjs` ve `e2e/*.spec.mjs` dosyalarını unused file saymış. **Yorum:** Playwright keşfi statik import değildir; false-positive. Durum: `USED`.

Knip `package.json` binaries: `playwright`. **Kanıt:** `@playwright/test` `devDependencies` içinde yok; `e2e:deps` ile geçici kurulur. CI `npm run e2e:deps` sonra `npx playwright install`. Durum: tooling binary, unused dependency değil.

## 7. CI zinciri (`.github/workflows/ci.yml`)

Sıra: `contract:verify` → `npm ci` → `audit:deps` → `syntax:check` → `npm test` → `npm run build` → `e2e:deps` → Chromium → `npm run e2e`.

Trigger: `push`/`pull_request` dalı `RefactorItem`.

## 8. Olmayan entry türleri

| Tür | Kanıt |
| --- | --- |
| Web Worker | `new Worker` 0 eşleşme |
| Service Worker | yok |
| `public/*.html` JS entry | `public/` altında HTML/JS entry yok (yalnız model attribution txt glob’u görüldü) |
| Backend HTTP server (uygulama) | yok; Vite dev server + `install-server.sh` nginx/dist |
