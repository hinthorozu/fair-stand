# 00 — Karar özeti

**Repo:** fair-stand (`C:\Users\hinthorozu\Kyrox\fair-stand\fair-stand-atlas`)  
**Dal:** `RefactorItem`  
**Tarih:** 2026-09-17  
**GitNexus:** repo `fair-stand`, indeks `8e9950b` / `2026-09-17T20:06:24.591Z`, 13482 sembol, 543 process, `incomplete_reasons: []`. Cycle `status: clean`, `cycleCount: 0`.  
**Bu tur:** yalnız doğrulama + sınıflandırma. `src/` / `test/` / `e2e/` / `scripts/` / `package.json` yazılmadı.

Knip unused ve GitNexus sıfır caller tek başına unused sayılmaz.

## Hüküm

CONFIRMED runtime bug (yanlış sahne, veri kaybı, bozuk insert) **yok**.

En gerçek işler: change gate’in birikmiş dal yüzeyini kaçırması, surface capability’nin iki SoT olması, contract dosyalarının runtime’a bağlı olmaması, BOM’un bilinçli DEV-only kalması.

Graph `risk: CRITICAL` (`getItem`, `getModuleBehavior`) bug değildir; hub blast radius’tur.

## Bucket

| Bucket | Adet | Anlam |
| --- | --- | --- |
| A ACTION_REQUIRED | 17 | Mevcut sistemde düzeltilmesi gereken tutarsızlık / kapı / doküman-test sapması |
| B DESIGN_DECISION_REQUIRED | 8 | Bug kanıtlanmadı; ürün/mimari karar şart |
| C NO_ACTION / DOCUMENT_ONLY | 15 | Bilinçli support, false-positive, hotspot metriği |

Toplam: 40.

## Öncelik (work package)

| Öncelik | Adet | Not |
| --- | --- | --- |
| P0 | 0 | Aktif runtime yanlışlığı / veri kaybı yok |
| P1 | 4 | Kapı, capability SoT, contract rolü, BOM ürün kararı |
| P2 | 4 | Inner-corner adlandırma, schema, test-support, hotspot koruması |
| P3 | 1 | Docs / hijyen |

SAFE_TO_REMOVE: **0**  
İnsan kararı: **8**

## Uygulama sırası

1. WP-01 Change gate coverage  
2. WP-02 Surface capability alignment  
3. WP-03 Contract / runtime rol kararı (koddan önce karar)  
4. WP-04 BOM ürün kararı (koddan önce karar)  
5. WP-05 Inner-corner adlandırma  
6. WP-08 Hotspot koruması  
7. WP-06 Item schema  
8. WP-07 Legacy / test-support sınıflandırma  
9. WP-09 Docs / hijyen  

B paketleri kararsız uygulanmaz.

## İlk 5 iş

1. CI `contract:verify` penceresini Version2 birikmiş diff ile hizala; mevcut contract’taki `not-applicable` domain’leri gerçek guarded dosyalarla düzelt (MA-015).  
2. `getItemSurfaceCapabilities` ile `scene3d` `acceptsImage` / panel surface state’i tek kurala bağla veya SoT’u belgele (MA-007).  
3. `moduleContracts` / `featureContracts` için insan kararı: governance-only mi, runtime SoT mu (MA-002, MA-003).  
4. BOM kullanıcıya açılsın mı kararı (MA-001); ardından MA-011 e2e kapsamı.  
5. Docs/test `recipe.innerCornerPanelItemKey` / `recipeView.variants` adlarını `composition.innerCorner.panelItemKey` ile hizala (MA-005, MA-014).

## Hiçbir işlem gerektirmeyen finding’ler (C)

MA-008 (yalnız hotspot metriği; test işi MA-010), MA-016, MA-017, MA-018, MA-026, MA-027, MA-029, MA-032, MA-034, MA-035, MA-036, MA-037, MA-038, MA-039, MA-040.

## Derin sınıflar (istenen finding’ler)

| ID | Sınıf |
| --- | --- |
| MA-001 | INTENTIONAL_DEV_FEATURE + DESIGN_DECISION (bug değil) |
| MA-002 | GOVERNANCE spec + TEST_ORACLE; runtime SoT değil |
| MA-003 | GOVERNANCE spec; planner’lar dosyayı okumaz |
| MA-004 | TEST_SUPPORT + ALTERNATIVE_MODEL; production `wallReflow` |
| MA-006 `composition.moduleType` | SCHEMA_ONLY / TEST_READ |
| MA-006 `composition.options` | SCHEMA_ONLY; identity `item.shape` |
| MA-008 | documented architecture hotspot; impact LOW ≠ dosya riski düşük |
