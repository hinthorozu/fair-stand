# 07 — Validation

Baseline: `refs/remotes/origin/Version2` (`Diff source: local git diff against refs/remotes/origin/Version2 + staged/unstaged/untracked`).

## Targeted

capability SoT, wallReflow, cornerPlacement import kilidi, BOM DEV entry, python archive, systemDevelopmentContract, groundLayout, door/showcase: **51 pass**.

## Full

| Komut | Sonuç |
| --- | --- |
| `npm run syntax:check` | geçti |
| `npm test` | **787 pass / 0 fail** (`duration_ms` ~10950) |
| `npm run build` | geçti (Vite 8; chunk-size uyarı pre-existing) |
| `npm run contract:verify` | geçti; guarded 139; E2E required `smoke` + `visible-ui-b` |

## E2E

Playwright kalıcı dependency değil. Chromium e2e bu turda çalıştırılmadı. Unit `rawBomDebugEntry` gerçek `main.js` kapısını kilitler; e2e spec eklendi.

## GitNexus

`detect_changes` scope all: risk **CRITICAL** (`scene3d` create*Module). `riskSharedAxes` ile düşürülmedi. Capability mapping + regression ile uygulandı. İndeks py path’leri hâlâ eski `scripts/*.py` gösterebilir (taşındı; reindex yok).

## Regression

Image true/false aileleri testle kilitli. wallReflow davranışı değiştirilmedi. BOM production UI açılmadı.
