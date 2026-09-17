# Fair Stand — Repo Atlas: Genel Bakış

**Analiz tarihi:** 2026-09-17  
**Dal:** `RefactorItem`  
**GitNexus indeksi:** `fair-stand`, commit `8e9950b19ffe49a80ac9661cae9cd03eecb255c6`, `indexed_at: 2026-09-17T19:06:27.473Z`  
**İndeks taze mi:** Evet. `incomplete_reasons: []`.

## Kanıt — indeks ölçeği

| Ölçü | Değer | Kaynak |
| --- | --- | --- |
| Dosya | 890 | GitNexus `list_repos` / `gitnexus://repo/fair-stand/context` |
| Sembol | 13263 | aynı |
| İlişki | 24484 | aynı |
| Community | 166 | aynı |
| Process | 542 | aynı |
| `src/*.js` | 56 | GitNexus Cypher `File WHERE filePath STARTS WITH 'src/'` + glob |
| Unit test (`test/` + `tests/`) | 184 + 2 | glob |
| E2E spec | 26 | glob `e2e/*.spec.mjs` |

## Bu atlas neyi kapsar

Mevcut çalışan sistemin olduğu hali. Yeni mimari önerilmez. Kaynak kod değiştirilmedi.

Kullanılan kaynaklar:

1. GitNexus MCP (`list_repos`, `query`, `context`, `impact`, `cypher`, `check`, process/cluster/schema resources)
2. Repo kaynak kodu (okuma)
3. `knip-report.json`, `knip-cycles.json`
4. `package.json` scriptleri
5. Unit test ve Playwright e2e

**Kanıt / yorum ayrımı:** “Kanıt” satırları graph, dosya içeriği veya komut çıktısıdır. “Yorum” satırları sınıflandırma ve risk okumasıdır.

## Çalışan sistem — tek cümle

Fair Stand, Vite + Three.js ile tarayıcıda çalışan bir stand konfigüratörüdür. Kanonik ürün tablosu `src/items.js` `ITEMS` map’idir. Sahne `src/scene3d.js` içinde kurulur; UI orkestrasyonu `src/main.js` ve `index.html` üzerindedir. Kalıcılık IndexedDB (`src/configuratorDb.js`) ile projeler ve görsellerdir.

## Mimari katmanlar (uydurma değil; mevcut dosya sınırları)

```
index.html
  ├─ /src/main.js          uygulama orkestrasyonu
  └─ /src/projectActionSaveGuard.js   ikinci HTML entry (kaydetme bekçisi)

main.js
  ├─ designState.js        modül state factory
  ├─ items.js              Item registry
  ├─ catalog.js            katalog projeksiyonu (catalogVisible)
  ├─ scene3d.js            Three.js sahne / renderer / etkileşim
  ├─ modulePlacement.js    yerleşim / çarpışma / snap
  ├─ moduleBehavior.js     type bazlı davranış
  ├─ projectStore / assetStore / configuratorDb
  ├─ autoDepot / automaticWall / wallReflow
  └─ UI: sidebar, color editor, context menu, drag sidebar, feedback
```

Vite production grafına **girmeyen** `src/` dosyaları (HTML/`main.js` transitif import yok): `groundLayout.js`, `featureContracts.js`, `moduleContracts.js`, `cornerPlacement.js`, `systemChangeContract.js`. Bunlar test/governance/script grafındadır. Ayrıntı: `08_UNUSED_CANDIDATES.md`.

## Knip vs GitNexus — özet hüküm

- `knip-cycles.json`: `{"issues":[]}`. GitNexus `check({cycles:true})`: `status: clean`, `cycleCount: 0`. **Döngüsel dosya import’u yok.**
- Knip’in “unused file” listesinin büyük kısmı Playwright entry’leridir (`playwright.config.mjs`, `e2e/*.spec.mjs`). Bunlar `USED`.
- Knip’in unused export’ları (`STAND_AXES`, `PROJECT_ARCHIVE_VERSION`, `validateImportedModuleState`, `validateImportedStandState`) tek başına silme kararı değildir. `getRecipeInnerCornerPanelKey` src export’u cleanup phase 1’de kaldırıldı. Doğrulama: `08_UNUSED_CANDIDATES.md`.

## En önemli bulgular (kanıtlı)

1. **Item hub:** `getItem` — GitNexus impact `risk: CRITICAL`, 60 doğrudan bağımlı, 79 process (test hariç).
2. **Davranış hub:** `getModuleBehavior` — `risk: CRITICAL`, 21 doğrudan, 44 process.
3. **`src/scene3d.js`:** tek dış çağıran `main.js` (`createStandScene`); dosya içi fan-out ve Three.js lifecycle nedeniyle değişiklik riski yüksektir. Impact `risk: LOW` yalnız **upstream caller sayısı**dır; dosya boyutu/sorumluluk bunu düşük risk yapmaz.
4. **BOM:** `resolveItemBom` production kullanıcı yolunda `import.meta.env.DEV && ?rawBom` dinamik import ile `rawBomDebug.js` üzerinden açılır. Kalıcı maliyet UI’si yoktur.
5. **`shelfCount`:** runtime Item alanında 0 kayıt. Yalnız yorum ve audit MD’de kalır.
6. **`static.*`:** runtime JS property yolu değil; `docs/items/audit` dokümantasyon katmanı.
7. **Workers yok.** `new Worker` eşleşmesi yok.

## Rapor dizini

| Dosya | İçerik |
| --- | --- |
| `01_ENTRY_POINTS.md` | HTML, Vite, JS, script, test, e2e |
| `02_MODULE_MAP.md` | Production `src/` dosya haritası |
| `03_RUNTIME_FLOWS.md` | GitNexus process grupları |
| `04_FEATURE_MAP.md` | Feature → kod zinciri |
| `05_ITEM_SYSTEM_MAP.md` | Item alanları DEFINED/READ/WRITE |
| `06_SYMBOL_DEPENDENCY_MAP.md` | Yüksek fan-in semboller |
| `07_TEST_MAP.md` | Feature → test ilişkisi |
| `08_UNUSED_CANDIDATES.md` | Sınıflandırılmış unused adaylar |
| `09_BROKEN_SUSPICIOUS.md` | Şüpheli / kopuk yollar |
| `10_DUPLICATES_LEGACY.md` | Duplicate ve stale |
| `11_CHANGE_IMPACT_HOTSPOTS.md` | Değişiklik riski |
| `FINAL_AUDIT.md` | Özet tablolar |
