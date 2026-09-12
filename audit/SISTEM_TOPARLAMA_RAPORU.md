# Fair Stand — Sistem toparlama raporu (lokal kod + belge taraması)

Tarih: 2026-09-12  
Dal / SHA: `Version2` / `a2c6a75732b434bfa8ba867b7fb9f5a4054d0bfb`  
Kapsam: **kod yazılmadı.** Kaynak yalnız bu makinedeki dosyalar (`src/`, `e2e/`, `test/`, kök MD, `audit/`, `docs/`, `scripts/`, `.github/workflows/ci.yml`).  
**GitHub’a gidilmedi:** fetch, pull, push, `gh`, uzak ruleset, uzak dal listesi yok. F-041 / F-044 / canlı deploy gibi uzak iddialar bu raporda **doğrulanmadı**.

Önceki `audit/SISTEM_MUTABAKAT_RAPORU.md` aynı gün ölçü raporu; bu belge onu **koddan yeniden** tarar, açık kod sorunlarını yazar ve belge sapmasını öncelik sırasına koyar.

---

## 1. Tek cümle

Sistem çalışıyor; asıl karmaşa **üç katmanlı yalan**: (1) audit defteri hâlâ “yapılacak F-010 / F-000 / E2E yok” diyor, (2) `current-system` gövdeleri `catalogKey` / `DEPOT_*` anlatıyor, (3) gerçek açık işler (debug BOM, `allowSideInsert`, içe aktarma, Final BOM kararı, seçim metni sapması) bu gürültünün altında kalıyor.

---

## 2. Şimdi bakılması gerekenler (öncelik)

Sıra: kullanıcıya görünen hata / üretim riski / “yanlış sonraki iş” riski. Ürün kararı uydurulmadı.

| Sıra | Ne | Tür | Lokal kanıt |
|---:|---|---|---|
| 1 | Audit defterini koda eşitle | Belge | `audit/FINDINGS.md` F-000 FIRST/OPEN; `FULL_SWEEP_STATE.md` “13 kapalı / A04 / 17 modül”; `SYSTEM_AUDIT_CHECKLIST.md` A03 ve F-001…009 OPEN. Kodda F-010 merkezi factory, Item sözleşmesi, 25 E2E spec var. |
| 2 | Üretim UI’da Raw BOM debug | Kod (açık) | `index.html:160` koşulsuz `src/rawBomDebug.js`. Panel metni `Üretim Listesi · Debug`. L-banko tahmini `#selection-info` regex (`parseLCounterSelection`). F-025 ve hardening #2 hâlâ gerçek. |
| 3 | Overlay `allowSideInsert: false` menüde yok | Kod (açık) | `moduleBehavior.js` overlay `allowSideInsert: false` (`tv`, `illuminated-foam`). `moduleContextMenu.js` herkese `Ekle Sağ/Sol`; dosyada `allowSideInsert` / `getModuleBehavior` **yok**. F-015 gerçek. |
| 4 | İlk seçim metni iki kaynak | Kod (açık) | `index.html` `#selection-info`: “…karşı köşeyi seçip dikdörtgen blok oluştur.” `selectionFeedback.js` `DEFAULT_SELECTION_HINT`: “…panelleri çoklu seç.” Hardening #1 açık. |
| 5 | Yardım / standart paneli `STAND_DIMENSIONS` kopyası | Kod (açık) | `index.html` “Yükseklik: 350 cm / Derinlik: 10 cm / 7 × 50”; `helpGuide.js` aynı tablo. Kaynak `catalog.js` `STAND_DIMENSIONS`. F-026 gerçek. |
| 6 | ZIP içe aktarma şema/limit yok | Kod (açık) | `main.js` yalnız `archiveVersion === 1`, `project` nesne, `project.id` string. `stand` / `modules` sözleşmesi, boyut/adet limiti yok. F-036 / F-037 gerçek. |
| 7 | GLB yükleme hatası sessiz | Kod (açık) | `scene3d.js` `loadAsync` promise modül düzeyinde cache; `.catch` yok. Hata yolları `console.warn`. Kullanıcı yedeği yok. Reddedilen promise cache’de kalır. F-024 gerçek. |
| 8 | `current-system` + zemin definition sapması | Belge | 94 `current-system` dosyasının **53**’ünde “Migration öncesi” şeridi var, **41**’inde yok. Gövde `catalogKey` / `DEPOT_*`. Kanonik `definitions/{karolaj,hali,parke-*}.md` hâlâ `currentStand.floorType` yazar; kod `stand.itemKey` yazar ve `floorType` siler. |
| 9 | Otomatik duvar feature sözleşmesi yok | Kod (açık) | `src/automaticWall.js` çalışıyor. `featureContracts.js` yalnız `automatic-depot`. F-029 gerçek. |
| 10 | Proje Final BOM toplayıcı yok | Kod + ürün kararı | `resolveItemBom(itemKey)` var. `modules[]` toplayan proje BOM yok. F-030 / F-014 / F-048. Miktar uydurulmaz. |

Uzak GitHub koruması (F-041, default dal zorunlu `verify`) bu taramada **bilinçli olarak yok**. Lokal CI dosyası: `.github/workflows/ci.yml` `Version2` push/PR için `contract:verify` → `npm test` → `build` → Playwright.

---

## 3. Sistemin bugünkü iskeleti (kod)

Bu blok bayat audit cümlelerinin yerine geçer.

1. **Kimlik.** Persist ürün kimliği `itemKey`. `src/` grep: `catalogKey` sıfır. Load `createModuleStateFromDescriptor` + `resolveItemKey`. Zemin: `items.js` yorumu `stand.itemKey` (eski `floorType`); `main.js` yüklemede `delete next.floorType`; UI select hâlâ `floor-type`.
2. **Katalog.** `SYSTEM_MODULE_CATALOG.md` test kilitli: **51** anahtar. BOM: **29 recipe / 4 self / 18 decision-required**. Katalog dışı: `illuminated-foam` (contract var, BOM `decision-required`). Zemin Item’ları katalog dışı (`karolaj`, `hali`, `parke-*`).
3. **Self BOM (bitmiş).** `MINI_FRIDGE_AVANTI`, `KETTLE`, `COAT_RACK`, `PLASTIC_TRASH_BIN`: `items.js` `unit: 'adet'`; `moduleContracts.js` `SELF_BOM_POLICY`; `itemBom.js` `resolveItemBom`.
4. **State.** Tek kayıt `designState.js` `MODULE_STATE_FACTORIES` (**25** type ailesi). `createModuleStateFromDescriptor` type ile factory çağırır, sonra `itemKey` yazar. `main.js` gizli type kaydı tutmaz. **F-010 kodda kapalı.**
5. **Davranış.** `moduleBehavior.js` type ailesi. Overlay: TV + ışıklı strafor. Bar taburesi / tekli koltuk `rotationStepDeg: 45`. Yerleşim çekirdeği davranışı okur; **yan ekleme menüsü okumaz.**
6. **BOM.** Recipe: `moduleRecipes.js` + expansion. Leaf: `itemBom.js`. Tüketici bugün esas `rawBomDebug.js` (seçili modül). Proje düzeyi Final BOM yok. Köşe/connector **reçetede sabit**; komşuluk graph’tan türetilmiyor (F-031).
7. **Özellik.** `featureContracts.js`: yalnız `automatic-depot`. `creates.contentKinds` dört depo içeriği listeler; `contentCatalogKeys` yalnız `PLASTIC_TRASH_BIN` — alan adı ve liste kodla uyumsuz kalıntı.
8. **Otomatik duvar.** `automaticWall.js` + `wall.js` / `wallReflow.js`. Feature contract kaydı yok.
9. **Kalıcılık.** Snapshot `main.js` `version: 1`. IndexedDB adı `fair-stand-configurator`, sürüm `2`; `projectStore.js` ve `assetStore.js` ayrı `openDb` (aynı DB/şema kopyası). F-021 / F-032.
10. **Kapı.** `.github/change-contract.json` + `npm run contract:verify`. Korumalı yollar `src/systemChangeContract.js`. `package.json`: `lint` yok, `npm audit` yok.
11. **E2E.** `e2e/` **25** spec (F-010/011/020/023/027/028 + item contract + smoke). CI `npm run e2e`. “E2E yok” cümlesi yanlış. Import/export ve GLB fail için ayrı kritik spec bu listede **yok**.
12. **Deploy script.** `scripts/install-server.sh`: `git remote set-url` + `git pull --ff-only` + build; commit pin ve test yok (F-042, lokal script).

---

## 4. F-serisi: ledger vs lokal kod

Ledger: `audit/FINDINGS.md` — “49 bulgu, açık 29 / kapalı 20”. Aşağıdaki hüküm **a2c6a75** koduna göredir.

### 4.1 Ledger CLOSED — kapanış kodda duruyor

F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009, **F-010**, F-011, F-012, F-013, F-016, F-020, F-023, F-027, F-028, F-033, F-041 (kapanış MD’si var; **uzak ruleset bu taramada doğrulanmadı**).

**F-010:** `MODULE_STATE_FACTORIES` + `createModuleStateFromDescriptor`. `e2e/f010-module-construction.spec.mjs`, `audit/remediation/A03_F010_CLOSURE.md`. “F010 serisi eksik” hissi kapanış belgesi + `FULL_SWEEP`’in A04’te takılı kalmasından; **kod işi bitmiş.** Kapanış MD “45 katalog” / `catalogKey` yazar — **MD bayat, kod değil.**

**F-013:** `src/` `catalogKey` yok. Ayırıcı kimliği `itemKey` + `modelFile`. Kapanış MD hâlâ `catalogKey` zorunlu der.

### 4.2 Ledger OPEN — kodda fiilen kapanmış veya iddia yanlış (defter düzelt)

| ID | Ledger | Kod hükmü |
|---|---|---|
| F-000 | OPEN / FIRST | `docs/items/contract/ITEM_CONTRACT.md`, `AGENTS.md`, checklist, giriş testleri var. “İlk yapılacak iş” değil. Kapanış kaydı yok. |
| F-019 | OPEN | Ölçü sahibi Item (`items.js` / production parts). Fabrika satırları `getItem`. Ürün `widthCm` kopyası genel factory kaydında yok. Şerit `7` kopyası ayrı (F-018). |
| F-040 | OPEN “E2E yok” | 25 Playwright spec + CI adımı. “Yok” yanlış. Kritik-akış boşluğu (ZIP, GLB fail) ayrı ve gerçek. |
| F-044 | OPEN “çok dal” | Uzak dal listesi **alınmadı**. İddia bu raporda ne doğrulanır ne çürütülür. |
| F-047 kısmen | OPEN “foam contractsuz” | `NON_CATALOG_MODULE_CONTRACTS['illuminated-foam']` var. “Yeni katalog-dışı nesne kapısız eklenemez” evrensel kuralı hâlâ yok. |

### 4.3 Ledger OPEN — kodda hâlâ doğru (gerçek iş)

**Ürün kararı olmadan kapanmaz**

- **F-014** — 18 katalog + foam `decision-required`. Self dörtlü çıktı. Kalan: 8 mobilya, 4 bitki/saksı, 5 wall-media, `led_floodlight`, foam. Zeminler bu 18’e dahil değil; `unit` yok.
- **F-034** — `public/models/` altında 4 `*_ATTRIBUTION.txt` (bar stool, kettle, coat rack, Eames). Tam köken/lisans envanteri değil.
- **F-043** — kök `LICENSE` yok (glob sıfır).
- **F-048** — katalog key’lerinde `bom.mode` var; `decision-required` nihai değil. Zemin + foam unit yok. Evrensel “politikasız öğe olamaz” kapısı yok.

**Davranış / UI / veri**

- **F-015** — overlay yan ekleme bildirimi; menü uygulamıyor.
- **F-017** — `scene3d.js` `userData.surfaceState` olarak **aynı** module state nesnesini bağlar (`surfaceState: moduleState.surface` vb.) ve yerinde yazar (`imageTransform`, `fabricColor`, `isGlass`, `imageAssetId`).
- **F-018** — `STAND_DIMENSIONS.stripCount: 7` (`catalog.js`) ve `STRIP_COUNT = 7` (`designState.js`).
- **F-021** — snapshot `version: 1`; migration hattı yok.
- **F-022** — aile `*-items-contract` e2e var; foam dialog / kapı / ZIP gidiş-dönüş tam tablosu yok.
- **F-024** — GLB cache + `console.warn`.
- **F-025** — üretim girişinde debug BOM.
- **F-026** — HTML/help sabitleri.
- **F-029** — otomatik duvar codesuz contract.
- **F-030** — proje Final BOM yok.
- **F-031** — ilişki parçası komşuluktan türetilmiyor.
- **F-032** — iki store, aynı `openDb` şeması.
- **F-035** — ZIP `archiveVersion: 1` `main.js` içinde.
- **F-036 / F-037** — import yalnız `archiveVersion` / `project.id` / asset path. `restoreProject()` `project.modules` ve `project.stand` için şema doğrulamaz.
- **F-038** — CI’da `npm audit` yok.
- **F-039** — help dialog kısmi; bağlam menüsü / proje adlandırma / foam form a11y zayıf (foam form `main.js` içinde inline HTML).
- **F-042** — `install-server.sh` `git pull`, pin yok.
- **F-045** — `scripts/patch-video-wall-*.cjs`, `add-tv-sizes.py`, `add-video-wall-2x2.py`, `fix-tv-screen-face.py` duruyor; `package.json` çağırmıyor.
- **F-046** — lint/format script ve CI adımı yok.

### 4.4 Ledger’de olmayan, kodda görülen sapmalar

Bunlar yeni F numarası **uydurulmadı**; toparlama listesine alındı.

| Konu | Kanıt |
|---|---|
| Seçim hint çift kaynak | `index.html` vs `DEFAULT_SELECTION_HINT` (hardening #1). |
| Depo feature `contentCatalogKeys` | Yalnız `PLASTIC_TRASH_BIN`; `contentKinds` dört ürün. Eski `catalogKey` adı. |
| `ITEM_LIST.md` migration “devam” | Duvar/raf/banko satırları “Tamam” demiyor; `definitions/wall_200.md` recipe Item. Liste geride. |
| `featureContracts` vs kod | Otomatik duvar yok; depo key listesi eksik. |
| Foam ölçü dialog | `main.js` inline; max yükseklik `350` sabit. |
| Kanonik zemin MD `floorType` | `definitions/karolaj.md`, `hali.md`, `parke-acik.md` persist alanı olarak `currentStand.floorType` der. Kod: `assignStandFloorItem` → `itemKey`, `delete next.floorType`. |

---

## 5. “Nasıl çalışır” belgeleri — kodla uyumsuz

Güncel kabul: `ITEM_CONTRACT.md`, `AGENTS.md`, `SYSTEM_CHANGE_GATE.md`, `SYSTEM_MODULE_CATALOG.md` (51/29/4/18 testli), `src/*`. `docs/items/definitions/` ticari dörtlü ve duvar kartları güncel; **zemin kartları `floorType` persist iddiasıyla sapıyor.**

| Belge | Sapma |
|---|---|
| `audit/FINDINGS.md` | F-000 FIRST; F-019/F-040 iddiaları kodla çelişir. Özet “29 açık” şişik. Tab SHA eski ROG. |
| `audit/FULL_SWEEP_STATE.md` | Taban `e764732`; kapalı 13; sonraki F-014 = **17** modül; A04; F-000/047/048 yok. A08/A10/A13/A21 kapanışları üst özette yok. |
| `audit/evidence/A24_FINAL_CLOSURE.md` | 46 açık; F-041 GAP; “E2E koşum yok”; düzeltme sırası hâlâ F-010/F-013. Tarihî SHA mühürlü olmalı. |
| `audit/evidence/A04_CATALOG_MODULE_CONTRACTS.md` | 45 katalog; factory `catalogKey`. |
| `audit/evidence/A07_STATE_MODEL_FACTORIES.md` | Ortak alan `catalogKey`; restore “yalnız catalogKey onarımı”. |
| `audit/evidence/A08_*.md` | Aynı `catalogKey` onarım dili. |
| `audit/evidence/A12_BOM_RECIPES_PRODUCTION.md` | 17 decision-required. |
| `audit/evidence/A19_BROWSER_E2E_CRITICAL_FLOWS.md` | Koşum yok iddiası. |
| `SYSTEM_AUDIT_CHECKLIST.md` | “Canonical tracker”, `IN_PROGRESS`, A03, F-001…009 OPEN, sonraki A03.01. Evidence A24 “25/25 incelendi”. **En tehlikeli ikinci kopya.** |
| `docs/items/current-system/*.md` (94 dosya) | **53** dosyada “Migration öncesi” şeridi var, **41**’inde yok. Gövde `catalogKey` / `DEPOT_*` / “runtime itemKey yok”. Başlık hâlâ “Mevcut Sistem Profili”. |
| `docs/items/definitions/{karolaj,hali,parke-*}.md` | `itemKey = floorType` ve `currentStand.floorType`. Persist sahibi kodda `stand.itemKey`. |
| `docs/items/door_100_full_system_audit.md` | `catalogKey = door_100`. |
| `fair-stand-base-family-migration-handoff.md` | `catalogKey` hydrate cutover. |
| `audit/remediation/A03_F010_CLOSURE.md` / `A04_F013_CLOSURE.md` | 45 katalog; F-013 `catalogKey` zorunlu. |
| `RELEASE_HARDENING_ROADMAP.md` | #1–#4 hâlâ AÇIK (#2/#4 kısmen kodda yanlış: E2E **var**, debug BOM **duruyor**, selection hint **duruyor**). Eski “E2E yok / ROG korumasız / indoor_plants2” maddeleri gövlede tarihî kalabilir. |
| `Changelog.md` | Ağustos 2026 civarı durur; `itemKey` / self BOM / E2E yok. |
| `FRESH_REPOSITORY_REVIEW.md` | Banner HISTORICAL; gövde “şu anda”; güncel için `FINDINGS` / `FULL_SWEEP` işaret eder — onlar da bayat. |
| `ITEM_LIST.md` | Envanter işe yarar; birçok bileşik Item “Tamam” değil oysa definition + recipe test var. |
| `.github/change-contract.json` | Diskteki sözleşme hâlâ `commercial-items-self-bom`. Sonraki iş bu dosyayı kendi change set’ine göre yenilemek zorunda; unutulursa kapı yalan söyler. |

`PRODUCT_FUTURE.md` ve `LEGACY_TRASH.md` kasıtlı gelecek / non-canonical. `ROADMAP.md` “proje Final BOM yok / instance Raw BOM tamamlanmadı” **hâlâ doğru**; self kipi saymaz.

---

## 6. “İleride / eksik” yazılmış, kodda bitmiş

| Eski iddia | Bitmiş yer |
|---|---|
| F-000 Item sözleşmesi yok | `ITEM_CONTRACT.md` + `AGENTS.md` + checklist |
| F-010 gizli factory | `designState.js` registry + F-010 e2e |
| F-011 dağınık yerleşim politikası | `moduleBehavior.js` |
| F-012 surround kopyası | `sceneDimensions.js` `SCENE_SURROUND_M = 1` |
| F-013 separatör / catalogKey zorunlu | `itemKey` + `modelFile`; `src/` `catalogKey` yok |
| F-019 genel ölçü kopyası | Item-backed fabrikalar |
| F-020/F-023 autosave / silme | kapanış + e2e spec |
| F-027/F-028 sahne/özellik reset | kapanış + e2e |
| F-033 atıl GLB iddiası (eski) | kapanış MD; bu taramada `indoor_plants2.glb` aranmadı teker teker ama kapanış dosyası var |
| F-040 / hardening “E2E yok” | 25 spec + CI |
| F-014 bu 4 ticari `decision-required` | `SELF_BOM_POLICY` + `adet` |
| F-047 foam contract yok | `NON_CATALOG_MODULE_CONTRACTS` |
| Ticari dörtlü current-system şeritsiz | Şerit **eklenmiş**; gövde hâlâ eski (şerit yetmez) |

---

## 7. Öncelik sırası (toparlama planı)

Kod bu raporda yok. Her madde ayrı change set / ayrı ürün kararı.

### A — Belge defteri (hızlı, düşük risk, en yüksek kaldıraç)

1. `FINDINGS.md` özet + F-000 / F-019 / F-040 satırlarını koda çek; F-044’ü “uzak doğrulanmadı” veya tarihî yap.
2. `FULL_SWEEP_STATE.md` ve `A24` sayaçlarını **mühürle** (tarihî SHA `e764732`); güncel SHA’ya yeniden yazma ayrı iş.
3. `SYSTEM_AUDIT_CHECKLIST.md`: “ikinci kopya, kullanma” banner **veya** evidence’a hizala. Bugün yeni oturumu A03.01’e gönderiyor.
4. `current-system` gövde `catalogKey` / `DEPOT_*` bloklarını tarihî örnek diye etiketle; 41 şeritsiz dosyaya aynı banner; başlığı “Mevcut Sistem” olmaktan çıkar.
5. Zemin `definitions/` persist cümlelerini `stand.itemKey` + eski `floorType` hydrate ile eşle.
6. `RELEASE_HARDENING_ROADMAP.md`: kapanmış maddeleri işaretle; açık kalan #1 #2 #3 ile F-025/F-026’yı bağla.
7. Kapanış MD dipnotu: 45 katalog / `catalogKey` zorunlu.
8. `ITEM_LIST.md` migration durumunu definition/test ile eşle.
9. `Changelog.md` ya tarihî banner ya kısa güncel özet.
10. `fair-stand-base-family-migration-handoff.md` arşiv şeridi.

Bu adım ürün kararı istemez. Agent’ın “F-000 / F-010 yap” sapmasını keser.

### B — Kullanıcıya görünen yanlışlık (kod, küçük, onay sonrası)

1. F-025: debug BOM üretim girişinden çıkar veya açık dev bayrağı.
2. F-015: menü `allowSideInsert`.
3. Seçim hint tek kaynak (`index.html` = `DEFAULT_SELECTION_HINT`).
4. F-026: HTML/help `STAND_DIMENSIONS`.
5. F-024: GLB hata geri bildirimi + rejected cache.
6. F-039 kalan dialog/menü (foam form dahil).

### C — Güven / veri / süreç

1. F-036/F-037: import şema + limit (ürün kararı: hangi alanlar zorunlu, max ZIP).
2. F-042: server install pin — ops kararı. Script bugün origin URL yazar; bu taramada uzak doğrulanmadı.
3. F-038/F-046: lint + `npm audit` CI — ayrı karar.
4. F-043 LICENSE — ürün kararı.
5. GitHub branch protection — **bu raporda yok; ayrı lokal-dışı iş.**

### D — Mimari borç (bilinçli, acele değil)

1. F-017 renderer persist mutate.
2. F-018 `stripCount` tek sahip.
3. F-021/F-032/F-035 version/şema sahibi.
4. F-029 otomatik duvar feature contract; depo `contentCatalogKeys` temizliği.
5. F-022 kalan persist e2e (foam, kapı, ZIP).
6. F-045 yama betiklerini historical klasöre.
7. F-034 varlık lisansı.

### E — Item / BOM (asıl ürün işi; uydurma yasak)

Ledger F-014 / F-030 / F-031 / F-048. Karar sende:

- Kalan Extra tekiller (mobilya parçası, bitki, TV, LED, foam, zemin): self + `adet` mi?
- Takımlar (koltuk seti, Eames): üyelik Item’da yazılı; recipe mi, set self mi?
- Proje Final BOM tüketicisi (F-030) ayrı.
- Köşe bağlantı (F-031) ayrı: komşuluk graph.

Bu raporda unit/miktar önerilmez.

---

## 8. Bilinçli olarak dokunulmayanlar

- Extra katalog UI isimleri / `MODULE_CATALOG` grupları.
- `type` aile `if` refactor.
- `moduleRecipes.js` miktarları.
- Fiyat / CRM / `PRODUCT_FUTURE.md` teslimatları (kodda yok — belge doğru).
- Uzak GitHub dal/ruleset/CI run.
- `scene3d.js` / `main.js` büyük refactor.

---

## 9. Sayaç (bu SHA, lokal)

| Sınıf | Adet |
|---|---|
| Katalog anahtarı | 51 |
| BOM recipe / self / decision-required | 29 / 4 / 18 |
| Katalog dışı explicit modül | 1 (`illuminated-foam`) |
| Playwright spec | 25 |
| `docs/items/current-system` | 94 MD (53 tarihî şerit / 41 şeritsiz) |
| `docs/items/definitions` | 97 MD (zemin persist cümleleri sapıyor) |
| Zemin Item (`FLOOR_ITEMS`) | 5 (`karolaj`, `hali`, `parke-acik`, `parke-sari`, `parke-beton`) |
| State factory type ailesi | 25 |
| Ledger CLOSED ve kodda duran (F-041 uzak hariç) | 19 kesin + F-041 kapanış dosyası |
| Ledger OPEN, kodda kapanmış / iddia yanlış | F-000, F-019, F-040 (yok iddiası), F-047 kısmen |
| Ledger OPEN, gerçek kod/ürün işi | F-014/015/017/018/021/022/024–026/029–032/034–039/042/043/045/046/048 + F-047 kural |
| Kök `LICENSE` | yok |
| Model attribution txt | 4 |

P0 kullanıcı-kırıcı yeni F numarası **açılmadı**. Acil olan: **defter yalanı**, **üretimde debug BOM**, **allowSideInsert**, **seçim hint**, **zayıf import**, **sessiz GLB**.

---

## 10. Sonraki somut adım

Onayınla ilk PR yalnız **A — belge defteri**. Kod davranışına dokunma.  
İkinci konuşma: **B** (görünen UI) mi, **E** (BOM ürün kararı) mı.

GitHub’a bu rapor **push edilmedi** (istek: uzak yok). Dal lokal oluşturulur.
