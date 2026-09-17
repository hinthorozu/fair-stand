# 10 — Kalan ACTION_REQUIRED

Başlangıç A: 17. Remediation sonrası **3** açık: MA-007, MA-011, MA-019.

Hepsi insan kararına bağlı. **READY_FOR_FINAL_REMEDIATION: 0.**

---

## MA-007

**Gerçek problem:** Image/yüzey izni iki kural: `getItemSurfaceCapabilities` yalnız `door-leaf`; `userData.acceptsImage` banko/baza/panel/showcase/door-panel’de hardcoded true. `glass`/`lightbox`/`mesh` map’te hiç true değil ve P okunmaz.

**Neden kapanmadı:** WP-02 SKIPPED_DECISION. SoT seçimi ürün/mimari; yanlış birleştirme production image’i kapatır.

**İnsan kararı:** Evet. `09_CAPABILITY_SOURCE_OF_TRUTH.md` A/B/C/D.

**Otomatik kapanır mı:** Hayır. Docs-only D bile “iki kavram” ürün onayı ister.

**Bağ:** DECISION/MA-007, WP-02.

---

## MA-011

**Gerçek problem:** E2e BOM **satır** doğruluğu yok. Panel varlığı var: `/` → `#raw-bom-debug` 0; `/?rawBom` görünür. Unit `resolveItemBom` COVERED. UI DEV-only.

**Neden kapanmadı:** WP-04 SKIPPED_DECISION. Satır e2e’nin **hedef yüzeyi** (DEV debug vs production liste) DECISION-01.

**İnsan kararı:** Evet — kapsam DECISION-01.  
Teknik not: DECISION-01 A veya C seçilirse DEV e2e’ye satır assert **kod olarak** eklenebilir (production UI açmadan). Bu yine A/C seçimidir; bağımsız patch değil.

**Otomatik kapanır mı:** Hayır (`READY_FOR_FINAL_REMEDIATION` değil). Karar A/C → DEV satır testi; karar B → production e2e.

**Bağ:** DECISION-01, WP-04. MA-001 (B) aynı kapı.

---

## MA-019

**Gerçek problem:** Üç Python rewriter `scripts/`; npm/CI yok; güncel `catalog.js` API’sine uymuyor (`SystemExit`). Elle zarar veya false “TV ekleme aracı”. F-045 OPEN.

**Neden kapanmadı:** WP-09 py kesiti DECISION-07. SAFE_TO_REMOVE=0; silme karar ister. Remediation yalnız tetik txt belgelemesi / tvConfig ghost.

**İnsan kararı:** Evet. KEEP / ARCHIVE / REMOVE / REWRITE.

**Otomatik kapanır mı:** Hayır.

**Bağ:** DECISION-07, WP-09. MA-020 (F-045 kapanış metni) aynı karar.

---

## Özet

| Finding | Status | Blocking decision | Ready after decision? |
| --- | --- | --- | --- |
| MA-007 | ACTION_REQUIRED açık | MA-007 SoT (A–D) | Evet (D docs veya A/B/C kod) |
| MA-011 | ACTION_REQUIRED açık | DECISION-01 | Evet (A/C DEV satır e2e veya B production e2e) |
| MA-019 | ACTION_REQUIRED açık | DECISION-07 | Evet (REMOVE/ARCHIVE/KEEP+waive/REWRITE) |
