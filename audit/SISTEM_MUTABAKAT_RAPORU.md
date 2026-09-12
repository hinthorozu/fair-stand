# Fair Stand — Sistem mutabakat raporu

Tarih: 2026-09-12  
Dal / SHA: `Version2` / `c931039d9e9d01625b0dbe663e6baa36de760f68`  
Kapsam: kod yazılmadı. Kaynak yalnız mevcut MD + `src/` + test/E2E/CI + GitHub dal/ruleset. Miktar, unit, davranış uydurulmadı.

Bu belgenin işi `audit/FINDINGS.md` ile `audit/FULL_SWEEP_STATE.md` ve `SYSTEM_AUDIT_CHECKLIST.md` arasındaki sapmayı kapatmak değildir; o sapmayı **ölçmek** ve toparlama sırasını vermektir. Ledger’ı bu rapordan sonra ayrı bir işte güncellemek gerekir.

---

## 1. Tek cümle

Asıl karmaşa kodun “çalışmaması” değil: **eski audit/roadmap/current-system metinleri, kapanmış işleri hâlâ açık gösteriyor; gerçek açık işler ile kâğıt üzerindeki açık işler karışmış.** Önce belge defterini koda eşitle, sonra kalan gerçek P1’lere gir.

---

## 2. Şimdi bakılması gerekenler (hızlı)

Sıra, kullanıcı etkisi + “yalan söyleyen belge” riskine göredir.

| Sıra | Ne | Neden şimdi | Kanıt |
|---:|---|---|---|
| 1 | Audit defterini koda eşitle | `FINDINGS` F-000’ı FIRST/OPEN tutuyor; `FULL_SWEEP_STATE` “13 kapalı / A04 / 17 modül”; checklist hâlâ A03 ve F-001…009 OPEN. Agent ve insan yanlış “sonraki iş”e gidiyor. | `audit/FINDINGS.md`, `audit/FULL_SWEEP_STATE.md` satır 16–57, `SYSTEM_AUDIT_CHECKLIST.md` |
| 2 | `Version2` koruması: PR var, `verify` zorunlu değil | Varsayılan dal `Version2`. ROG’da `verify` zorunlu (F-041 kapalı). Default dalda yeşil CI olmadan merge mümkün. | CI `on.push/pull_request.branches: [Version2]`; F-041 kapanışı ROG ruleset; `Protect Version2` `verify` zorunlu değil |
| 3 | Üretim UI’da Raw BOM debug | `index.html` `rawBomDebug.js`’i koşulsuz yükler. F-025 hâlâ gerçek. | `index.html:160`, `src/rawBomDebug.js` |
| 4 | Overlay `allowSideInsert: false` uygulanmıyor | TV / ışıklı strafor sözleşmede kapalı; sağ tık Ekle sol/sağ herkese açık. F-015 hâlâ gerçek. | `src/moduleBehavior.js` overlay; `src/moduleContextMenu.js` `add-left`/`add-right`; `main.js` / `modulePlacement.js` `allowSideInsert` okumaz |
| 5 | `docs/items/current-system` ticari dörtlü + `catalogKey` | Historical envanter, güncel `self` BOM ve `itemKey` ile çelişiyor; “şu anki sistem” sanılır. | `docs/items/current-system/{COAT_RACK,KETTLE,MINI_FRIDGE_AVANTI,PLASTIC_TRASH_BIN}.md` vs `src/moduleContracts.js` `SELF_BOM_POLICY` |
| 6 | Proje içe aktarma yapı/limit yok | ZIP `archiveVersion===1` + id dışında `stand`/`modules` sözleşmesi yok. F-036/F-037 gerçek. | `src/main.js` import yolu |

Bunlar “yeni özellik” değil. 1 ve 5 belge; 2 güvenlik/süreç; 3–4–6 çalışan kod.

---

## 3. Sistemin bugünkü gerçek iskeleti (kod)

Bu blok, çalışma mantığını **güncel koddan** özetler. Bayat audit cümlelerinin yerine bunu kullan.

1. **Ürün kimliği** `itemKey`. `src/` içinde `catalogKey` yok. Load `catalogKey` okumaz. Zemin persist `stand.itemKey` (eski `floorType` hydrate).
2. **Katalog** `src/catalog.js` → `MODULE_CATALOG_KEYS` **51**. Sözleşme `src/moduleContracts.js`.
3. **BOM politikası (katalog):** recipe **29**, self **4** (`COAT_RACK`, `KETTLE`, `MINI_FRIDGE_AVANTI`, `PLASTIC_TRASH_BIN`), decision-required **18**. Katalog dışı: `illuminated-foam` decision-required **1**. Zemin Item’ları katalog ve `moduleContracts` dışında; `unit` yok.
4. **State oluşturma** `src/designState.js` `MODULE_STATE_FACTORIES` + `createModuleStateFromDescriptor`. `main.js` gizli tip kaydı tutmaz (F-010 kapalı, kodda duruyor).
5. **Davranış** `src/moduleBehavior.js`. Yerleşim çekirdeği bunu tüketir (F-011 kapalı). İstisna: `allowSideInsert` menüde zorlanmaz (F-015).
6. **Reçete** `src/moduleRecipes.js` + `src/itemBom.js` (`resolveItemBom`). Proje düzeyi Final BOM üreteci yok (F-030).
7. **Kapı** `.github/change-contract.json` + `npm run contract:verify`. CI: gate → test → build → Playwright Chromium `e2e/` (**25** spec).
8. **Remote dallar:** `Version2`, `ROG`. Feature yığını origin’de yok.

`SYSTEM_MODULE_CATALOG.md` bu sayılarla test kilitli (`test/systemModuleCatalogDoc.test.js`). Bu dosya güncel.

---

## 4. F-serisi: ledger vs kod

Ledger: `audit/FINDINGS.md` — 49 bulgu, açık 29 / kapalı 20 diye yazar. Aşağıdaki hüküm **c931039** koduna göredir.

### 4.1 Ledger CLOSED — kapanış kodda duruyor

F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012, F-013, F-016, F-020, F-023, F-027, F-028, F-033, F-041.

F-010 notu: “gizli `main.js` factory kaydı” **yok**. `e2e/f010-module-construction.spec.mjs` ve `audit/remediation/A03_F010_CLOSURE.md` mevcut. “F010 serisi eksik iş” hissi, kapanış belgelerinin ve `FULL_SWEEP`’in A04’te takılı kalmasından gelir; kod işi bitmiş.

F-013 notu: kapanış metni hâlâ `catalogKey` ekler; **runtime tersine döndü** (`itemKey` only). Bulgunun orijinal belirsizliği (düz vs sarmaşık) `modelFile` + `itemKey` ile çözülmüş. Kapanış **MD’si** bayat, kod değil.

### 4.2 Ledger OPEN — kodda fiilen kapanmış veya iddia yanlış (defter düzelt)

| ID | Ledger | Kod hükmü | Not |
|---|---|---|---|
| F-000 | OPEN / FIRST | Sözleşme + giriş kapısı var | `ITEM_CONTRACT.md`, `AGENTS.md`, `developerEntrypointDocs.test.js`. Kapanış kaydı yok; “FIRST yapılacak iş” yanlış. |
| F-019 | OPEN | Ölçü sahibi `items.js`; fabrikalar `getItem` okur | Hard-coded ürün `widthCm` kopyası `designState` ürün satırlarında yok. Şerit `7` kopyası F-018. |
| F-040 | OPEN (“E2E yok”) | 25 Playwright spec + CI `npm run e2e` | “Yok” cümlesi yanlış. Kritik-akış boşluğu (import/export, GLB fail) ayrı ve gerçek. |
| F-044 | OPEN (“çok dal”) | origin: `ROG` + `Version2` | Dal temizliği yapılmış. Ledger bayat. |
| F-047 (kısmen) | OPEN | `illuminated-foam` explicit contract | “Foam’un contract’ı yok” yanlış. “Yeni katalog-dışı nesne kapısız eklenemez” kuralı hâlâ yok. |

### 4.3 Ledger OPEN — kodda hâlâ doğru (gerçek iş)

**Ürün kararı olmadan kapanmaz**

- **F-014** — 18 katalog + 1 foam `decision-required`. Ledger “18 aktif” katalog sayısıyla uyumlu. Self dörtlü buradan çıktı; kalan: 8 mobilya, 4 bitki/saksı, 5 wall-media, `led_floodlight`, foam. Zeminler bu 18’e dahil değil.
- **F-034** — model köken/lisans envanteri tam değil (kısmi `public/models/*ATTRIBUTION.txt`).
- **F-043** — kök `LICENSE` yok; repo public.
- **F-048** — katalog key’lerinde `bom.mode` var; `decision-required` nihai sayılmaz. `FLOOR_ITEMS` + foam `unit` yok. “Hiçbir öğe politikasız olamaz” henüz evrensel kapı değil.

**Davranış / UI / BOM tüketici**

- **F-015** — `allowSideInsert: false` bildirim; menü/runtime uygulamıyor.
- **F-017** — `scene3d.js` kalıcı `surfaceState` alanlarını yerinde yazar.
- **F-018** — `STAND_DIMENSIONS.stripCount: 7` (`catalog.js`) ve `STRIP_COUNT = 7` (`designState.js`) ayrı.
- **F-021** — snapshot `version: 1`; migration hattı yok.
- **F-022** — kısmi: aile `*items-contract*` e2e var; tam fabrika→kaydet→reopen tablosu ve foam/door ayrı contract e2e yok.
- **F-024** — GLB `loadAsync` hata: `console.warn`, reddedilen promise cache, kullanıcı yedeği yok.
- **F-025** — üretim girişinde debug BOM UI.
- **F-026** — `index.html` / `helpGuide.js` 350 / 7×50 / 10 cm metinleri `STAND_DIMENSIONS`’tan üretilmiyor.
- **F-029** — `featureContracts.js` yalnız `automatic-depot`; otomatik duvar çalışır, sözleşme kaydı yok.
- **F-030** — `resolveItemBom` var; proje `modules[]` toplayan Final BOM yok.
- **F-031** — köşe/ilişki parçası proje komşuluğundan türetilmiyor; reçetede sabit connector satırları var.
- **F-032** — `projectStore` + `assetStore` ayrı `openDb`, aynı DB adı/sürüm.
- **F-035** — ZIP `archiveVersion: 1` `main.js` içinde sabit; ortak şema modülü yok.
- **F-036 / F-037** — import yapı ve boyut/adet politikası yok.
- **F-038** — CI’da `npm audit` yok.
- **F-039** — kısmi: help dialog a11y var; bağlam menüsü / proje adlandırma / foam dialog zayıf.
- **F-042** — `scripts/install-server.sh` `git pull` + build; SHA pin ve test yok.
- **F-045** — `scripts/patch-video-wall-*.cjs`, `add-tv-sizes.py` vb. duruyor; `package.json` çağırmaz.
- **F-046** — lint/format script ve CI adımı yok.

---

## 5. “Nasıl çalışır” belgeleri — kodla uyumsuz

Güncel kabul edilecekler: `ITEM_CONTRACT.md`, `AGENTS.md`, `SYSTEM_CHANGE_GATE.md`, `SYSTEM_MODULE_CATALOG.md` (sayılar testli), `src/*`.

| Belge | Sapma |
|---|---|
| `audit/FINDINGS.md` | F-000 FIRST; F-019/F-040/F-044 iddiaları kodla çelişir. Özet “29 açık” şişik. Tab SHA eski ROG. |
| `audit/FULL_SWEEP_STATE.md` | Taban ROG `e764732`; kapalı 13; sonraki F-014 = **17** modül; remediasyon A04; F-000/047/048 yok. A08/A10/A13/A21 kapanışları satırda yok. |
| `audit/evidence/A24_FINAL_CLOSURE.md` | 46 açık; F-041 GAP; E2E yok. |
| `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md` | 45 katalog; 17 decision-required; factory `catalogKey`. |
| `audit/evidence/A12_BOM_RECIPES_PRODUCTION.md` | 17 decision-required. |
| `audit/evidence/A19_BROWSER_E2E_CRITICAL_FLOWS.md` | Koşum yok iddiası. |
| `audit/evidence/A20` / `A21` | CI/ROG/dal hijyeni eski. |
| `SYSTEM_AUDIT_CHECKLIST.md` | IN_PROGRESS, A03, F-001…009 OPEN, A12/A19–A24 `NOT_AUDITED`. Evidence A24 “25/25 incelendi” der. |
| `docs/items/current-system/COAT_RACK.md` (KETTLE, MINI_FRIDGE, PLASTIC_TRASH_BIN aynı) | `DEPOT_*`, `catalogKey`, `decision-required`, unit yok. |
| `docs/items/current-system/wall_*.md` ve birçok current-system JSON | Kimlik `catalogKey`. |
| `docs/items/current-system/{karolaj,hali,parke}.md` | Persist `floorType`. |
| `docs/items/door_100_full_system_audit.md` | `catalogKey = door_100`. |
| `fair-stand-base-family-migration-handoff.md` | `catalogKey` hydrate. |
| `RELEASE_HARDENING_ROADMAP.md` | E2E yok, ROG korumasız, çok dal, `indoor_plants2.glb` — kodda kapanmış. |
| `Changelog.md` | Ağustos 2026’da durur; Item/`itemKey`/self BOM/E2E yok. |
| `FRESH_REPOSITORY_REVIEW.md` | Banner historical; gövde “şu anda” konuşur. |
| `audit/remediation/A03_F010_CLOSURE.md` / `A04_F013_CLOSURE.md` | “45 katalog”; F-013 `catalogKey` zorunlu. |

`current-system/` **migration öncesi envanter** olarak tutuluyorsa dosya başında bunun **tarihî** olduğu yazılı olmalı; aksi halde güncel tanım sanılır. `docs/items/definitions/` ticari dörtlü güncel (`self`, `adet`).

`PRODUCT_FUTURE.md` ve `LEGACY_TRASH.md` kasıtlı non-canonical / gelecek; runtime varsayımı sızdırmıyorlar (A01.08 ile uyumlu). `ROADMAP.md` “proje Final BOM yok” hâlâ doğru; `self` kipini saymaz.

---

## 6. “İleride yapılacak” yazılmış, kodda bitmiş

| Eski iddia | Bitmiş yer |
|---|---|
| F-000 Item sözleşmesi yok | `docs/items/contract/ITEM_CONTRACT.md` + giriş kapıları |
| F-010 gizli factory | `designState.js` registry |
| F-013 separatör kimliği / catalogKey zorunlu | `itemKey` + `modelFile`; `src/` `catalogKey` yok |
| F-019 ölçü kopyası (genel) | Item-backed fabrikalar |
| F-040 / hardening #4 E2E yok | `e2e/` 25 spec + CI |
| F-041 / hardening #6 ROG korumasız | GitHub `Protect ROG`, zorunlu `verify` |
| F-044 / hardening #7 dal yığını | origin 2 dal |
| F-033 / hardening #12 atıl GLB | `indoor_plants2.glb` vb. yok |
| F-014 bu 4 ticari `decision-required` | `SELF_BOM_POLICY` + `unit: 'adet'` + `resolveItemBom` ×1 |
| F-047 foam contract yok | `NON_CATALOG_MODULE_CONTRACTS` |
| Historical işaretle (hardening #10) | `FRESH_REPOSITORY_REVIEW.md` banner (gövde hâlâ karışık) |

---

## 7. Öncelik sırası (toparlama planı)

Kod yok; önerilen sıra. Her madde ayrı change set / ayrı ürün kararı.

### A — Belge defteri (hızlı, düşük risk)

1. `FINDINGS.md` özet + F-000/F-019/F-040/F-044/F-047 satırlarını koda çek.
2. `FULL_SWEEP_STATE.md` ve `A24` sayaçlarını durdur veya “tarihî SHA e764732” diye mühürle; güncel SHA’ya yeniden yazma ayrı iş.
3. `SYSTEM_AUDIT_CHECKLIST.md`: ya evidence’a hizala ya da “ikinci kopya, kullanma” banner.
4. `current-system` ticari dörtlü + `catalogKey` / `floorType` başlıklarına **TARİHÎ ENVANTER** uyarısı; güncel için `definitions/` işaret et.
5. `RELEASE_HARDENING_ROADMAP.md` kapanmış maddeleri işaretle.
6. Kapanış MD’lerindeki “45 katalog / catalogKey zorunlu” dipnotunu düzelt.

Bu adım ürün kararı istemez. Agent’ın bir sonraki “F-000 yap” sapmasını keser.

### B — Süreç / güven

1. `Protect Version2`: zorunlu durum `verify` (ROG ile aynı).
2. F-025: debug BOM üretim girişinden çıkar veya açık dev bayrağı.
3. F-036/F-037: import şema + limit (ürün kararı: hangi alanlar zorunlu, max ZIP).
4. F-042: server install pin (tag/SHA) — ürün/ops kararı.

### C — Kullanıcıya görünen yanlışlık

1. F-015 `allowSideInsert`.
2. F-026 HTML/help sabitleri tek kaynaktan.
3. F-024 GLB hata geri bildirimi.
4. F-039 kalan dialog/menü a11y.

### D — Mimari borç (bilinçli, acele değil)

1. F-017 renderer persist mutate.
2. F-018 `stripCount` tek sahip.
3. F-021/F-032/F-035 version/şema sahibi.
4. F-029 otomatik duvar feature contract.
5. F-022 kalan aile persist e2e (foam, kapı, import).
6. F-045 yama betiklerini `scripts/` dışına veya historical klasöre.
7. F-038/F-046 lint + audit CI.
8. F-043 LICENSE (ürün kararı).
9. F-034 varlık lisansı (ürün kararı).

### E — Item / BOM (asıl ürün işi; uydurma yasak)

Ledger F-014/F-030/F-031/F-048. Karar sende:

- Kalan Extra tekiller (mobilya parçası, bitki, TV, LED, foam, zemin): ticari dörtlü gibi `self` + `adet` mi?
- Takımlar (koltuk seti, Eames): üyelik zaten Item’da yazılı (1+2+1 ve 1+4); bu BOM recipe mi, yoksa set self mi?
- Proje Final BOM tüketicisi (F-030) ayrı: reçete + self satırlarını bir listede toplamak.
- Köşe bağlantı (F-031) ayrı: komşuluk graph.

Bu raporda unit/miktar önerilmez.

---

## 8. Bilinçli olarak dokunulmayanlar

- Extra katalog UI isimleri / `MODULE_CATALOG` grupları.
- `type` aile `if` refactor.
- `moduleRecipes.js` miktarları.
- Fiyat/CRM/`PRODUCT_FUTURE.md` teslimatları (kodda yok, belge gelecek diyor — doğru).

---

## 9. Özet sayaç (bu SHA)

| Sınıf | Adet (bu tarama) |
|---|---|
| Ledger CLOSED ve kodda duruyor | 20 |
| Ledger OPEN, kodda kapanmış / iddia yanlış | F-000, F-019, F-040 (yok iddiası), F-044, F-047 kısmen |
| Ledger OPEN, gerçek kod/ürün işi | ~24 (F-014/015/017/018/021/022/024–026/029–032/034–039/042/043/045/046/048 + F-047 kural) |
| Katalog BOM | 29 recipe / 4 self / 18 decision-required + 1 foam |
| Playwright spec | 25 |
| Origin dal | 2 (`Version2`, `ROG`) |

P0 kullanıcı-kırıcı regresyon bu taramada **yeni numaralandırılmadı**. Acil olan: **defter yalanı**, **Version2’de zorunlu CI eksik**, **üretimde debug BOM**, **allowSideInsert**, **zayıf import**.

---

## 10. Sonraki somut adım

İlk PR (bu raporun ardından, onayınla): yalnız A — belge defteri eşitlemesi. Kod davranışına dokunma. İkinci konuşma: B/C mi, E (BOM ürün kararı) mı.
