# A02 Denetim Kanıtı — Evrensel Change Gate

Denetim bölümü: `A02 — Universal change gate`
Denetim tarihi: `2026-09-03`
Kontrol edilen ROG SHA: `dda455183e5c713cb55a24232436cfd39c68ce7b`
Denetim dalı: `audit/full-system-a02`

## Özet

Evrensel change gate, kanonik CI'da gerçek ve aktiftir, ancak henüz tüm yüzeyleri kapsayan tam bir duvar değildir.

Yeni bulgular:

- `F-005` P1 — korumalı çalışma zamanı kaynaklarının yol-zorunlu alanı olmayabilir; güncel `src/` dosyalarının 20/51'i sıfır zorunlu etki alanı çözer ve diğer dosyalarda eksik/tesadüfi eşlemeler vardır.
- `F-006` P1 — kanonik kural/kapı Markdown belgeleri korumalı-dosya tespitinin dışındadır; kapının kendi insan-okunur sözleşmesi change bildirimi olmadan değişebilir.
- `F-007` P2 — `test/` ve `tests/` korumalı-dosya tespitinin dışındadır; kapı regresyon testleri bildirim olmadan değiştirilebilir/kaldırılabilir.
- `F-008` P2 — hedefli regresyon testleri makine-zorunlu değildir; `tests.targeted: []` geçerlidir ve `impact.tests` `not-applicable` olabilir.
- `F-009` P2 — yerel `npm run contract:verify` yalnızca şemayı doğrular ve CI/olay değişkenleri veya `CHANGE_GATE_FILES` sağlanmadıkça diff zorlamasını atlar.

A01'den mevcut bulgular açık kalır: F-001..F-004.

Bu denetim bölümünde kapı kodu düzeltilmedi.

---

## A02.01 — Etki alanı şema bütünlüğü

Durum: `AUDITED_OK`

Kanonik kaynak: `src/systemChangeContract.js` blob `13a6a89d2fe51e6a5d15c10ad5b5e44fa5eda183`.

`SYSTEM_IMPACT_DOMAINS` tam olarak 17 makine-okunur alan içerir:

`catalog, behavior, state, placement, renderer, persistence, bom, ui, composition, assets, storage, importExport, performance, accessibility, architecture, security, tests`.

`validateSystemChangeContract()` eksik/bilinmeyen karar doğrulamasını aynı diziden türetir. `test/systemChangeGate.test.js` açıkça `security` alanını kaldırır ve eksik-alan başarısızlığını doğrular.

`SYSTEM_CHANGE_GATE.md` içindeki insan-okunur liste bu makine listesiyle eşleşir; bu karşılık A01.04'te zaten kontrol edilmiştir.

---

## A02.02 — Değişiklik türleri ve zorunlu alanlar

Durum: `AUDITED_OK`, test-politikası uyarısı ayrı olarak `F-008` kaydındadır.

Desteklenen türler:

`module, feature, ui-control, state-change, renderer-change, persistence-change, bom-change, architecture, tooling, bugfix, refactor`.

Makine kısıtları:

- `ui-control` → UI etkilenir
- `state-change` → state etkilenir
- `renderer-change` → renderer etkilenir
- `persistence-change` → persistence etkilenir
- `bom-change` → BOM etkilenir
- `architecture/tooling` → architecture etkilenir
- `module` → catalog/behavior/state/renderer alanlarından en az biri etkilenir
- `feature` → composition/behavior/UI/state alanlarından en az biri etkilenir
- her geçerli bildirim → en az bir etki alanı etkilenir

Dosya-farkında gereksinimler ikinci bir katmandır ve aşağıda denetlenir.

---

## A02.03 — Çalışma zamanı/teslimat giriş noktaları için korumalı-dosya tespiti

Durum: geniş çalışma zamanı/teslimat dahilimi için `AUDITED_OK`; yönetişim/test dışlamaları F-006/F-007 ile izlenir.

`isGuardedChangeFile()` şunları içerir:

- `index.html`
- `package.json`
- `package-lock.json`
- tüm `src/**`
- tüm `public/**`
- tüm `scripts/**`
- `.github/workflows/**`
- `vite.config*`

Bu nedenle `src/` altındaki güncel ürün/çalışma zamanı JS/CSS, statik public varlıklar ve teslimat/derleme yüzeylerinin hepsi, aynı CI diff'inde `.github/change-contract.json` değişikliğini tetikler.

Bu, doğru etki alanının zorlandığı anlamına **gelmez**; bu ayrı F-005 boşluğudur.

---

## A02.04–A02.12 — Yol-farkında alan kapsamı

### Yapısal olarak mevcut doğrudan eşlenmiş alanlar

- katalog: `src/catalog.js` → `catalog`
- davranış/yerleştirme çekirdeği: `moduleBehavior.js`, `moduleMove.js`, `modulePlacement.js`, `wallReflow.js`, `cornerPlacement.js` → `behavior + placement`
- durum: `designState.js` → `state + persistence`
- renderer: `scene3d.js`, `viewCube.js` → `renderer`
- depolama/kalıcılık: `projectStore.js`, `assetStore.js`, `imageAssetReferences.js` → `persistence + storage`
- BOM: `moduleRecipes.js`, `productionParts.js`, `rawBomDebug.js` → `bom`
- bileşim: `autoDepot.js`, `automaticWall.js`, `featureContracts.js` → `composition`
- varlıklar: tüm `public/**` → `assets`
- teslimat/araçlar: paket/kilit/betikler/iş akışları/vite yapılandırması ve seçili sözleşme dosyaları → `architecture`
- UI: `index.html`, seçili UI/denetleyici dosyaları ve `Ui|UI|Controller|Feedback` dosya adı kalıbı → `ui`

### Bulgu F-005 — eksik yol-alan duvarı

Önem: `P1`
Alan: `architecture / change-gate coverage`
Durum: `OPEN`

Tüm güncel `src/**` dosyaları korumalıdır, ancak `requiredDomainsForFile()` **güncel kaynak dosyalarının 51'inden 20'si** için sıfır zorunlu alan döner:

1. `src/colorEditor.css`
2. `src/colorEditorInputs.js`
3. `src/colorUtils.js`
4. `src/groundLayout.js`
5. `src/helpGuide.css`
6. `src/horizontalImageLayout.js`
7. `src/imageActions.css`
8. `src/imageFit.js`
9. `src/main.js`
10. `src/projectNaming.js`
11. `src/projectSwitch.js`
12. `src/rectImageLayout.js`
13. `src/rectSelection.js`
14. `src/standCapacity.js`
15. `src/standSetup.js`
16. `src/style.css`
17. `src/theme.js`
18. `src/tvConfig.js`
19. `src/viewKeyboardShortcuts.js`
20. `src/wall.js`

Bu yalnızca adlandırma belirsizliği değildir. Taze kaynak kanıtı, bu dosyaların anlamlı ürün davranışına sahip olduğunu gösterir:

- `main.js` sahne render'ını, katalog çözümlemesini, otomatik depo/duvar bileşimini, modül durum fabrikalarını, varlık depolamayı, proje depolamayı, yerleştirmeyi, duvar reflow'unu, davranışı, otomatik kaydı, proje değiştirmeyi ve UI kontrollerini içe aktarır ve orkestre eder. Yine de yolu hiçbir alan gerektirmez.
- `autosaveController.js` kalıcılık zamanlamasını ve persist çağrılarını sahiplenir, ancak genel `Controller` dosya adı regex'i yalnızca `ui` gerektirir; persistence yol-zorunlu değildir.
- `tvConfig.js`, katalog/render mantığının tükettiği kanonik TV boyut/tip/ekran ölçülerini tanımlar, ancak hiçbir alan gerektirmez.
- `standSetup.js` stand tipi etiketlerini, geçerli ölçü aralığı/adımını ve sahne ölçülerini tanımlar, ancak hiçbir alan gerektirmez.
- `standCapacity.js` gerçek stand kapasitesini ve başarısızlık semantiğini doğrular, ancak hiçbir alan gerektirmez.
- `viewKeyboardShortcuts.js` klavye davranışını ve düzenlenebilir-hedef bastırmayı tanımlar, ancak UI/accessibility/behavior alanı gerektirmez.
- `colorEditorInputs.js` kullanıcının girdiği renk değerlerini doğrular/normalize eder, ancak UI/security/state alanı gerektirmez.
- `groundLayout.js` sahne ızgara boyutlandırma/konumlandırmasını tanımlar, ancak renderer/placement alanı gerektirmez.
- `wall.js` düz-duvar bileşimini doğrular/kurar, ancak behavior/composition alanı gerektirmez.

Etki:

Sıfır-eşlemeli herhangi bir korumalı dosya için CI hâlâ `.github/change-contract.json` düzenlenmesini zorlar, ancak bir geliştirici ilgisiz bir etki alanını `affected` işaretleyip gerçek alanı/alanları `not-applicable` işaretleyebilir; doğrulayıcının bunu reddedecek yol-türevli çelişkisi yoktur. Kısmen eşlenmiş dosyalarda, yanlış bir bildirim benzer biçimde önemli ikincil etkileri atlayabilir.

Bu, çalışma zamanı kaynaklarının önemli bir kısmı için hedeflenen “yanlış not-applicable kod tarafından engellenir” güvencesini bozar.

Karar: denetim kanonik sorumlulukları belirledikten sonra yol/alan sahipliğini sistematik genişlet; A03/A22/A23 nihai haritayı beslemelidir.

Madde sonuçları:

- A02.04 katalog yol kapsamı: `GAP` çünkü katalog-komşu kanonik `tvConfig.js` eşlenmemiştir.
- A02.05 davranış/yerleştirme kapsamı: `GAP` çünkü `groundLayout.js`, `standCapacity.js`, `standSetup.js`, `wall.js` ve diğer ilgili kaynaklar yol-zorunlu değildir.
- A02.06 durum/kalıcılık/depolama kapsamı: `GAP` çünkü `autosaveController.js`, `projectSwitch.js` ve merkezi orkestrasyon doğru zorlanmaz.
- A02.07 renderer kapsamı: `GAP` çünkü görüntü yerleşim/sığdırma ve TV yapılandırma yardımcıları eşlenmemiştir.
- A02.08 UI kapsamı: `GAP` çünkü CSS, `colorEditorInputs.js`, `viewKeyboardShortcuts.js` ve `main.js` UI-zorunlu değildir.
- A02.09 BOM kapsamı: bu aşamada bilinen güncel kanonik BOM kaynakları için `AUDITED_OK`.
- A02.10 bileşim kapsamı: bu aşamada bilinen güncel açık bileşim sahipleri için `AUDITED_OK`.
- A02.11 public varlıklar: `AUDITED_OK` — her `public/**` yolu assets gerektirir.
- A02.12 derleme/araç/teslimat: paket/kilit/betikler/iş akışları/vite yapılandırması için `AUDITED_OK`.

A23.14, sonraki bölümlerin her kanonik sahibi keşfetmesinden sonra bu eşlemeyi yeniden çalıştıracaktır.

---

## A02.13 — CI diff'lerinde bildirim atlama tespiti

Durum: `AUDITED_OK`

Kanonik doğrulayıcı: `scripts/verify-change-contract.mjs` blob `65e2d93d4b4194a8bcb88a1282b1de415782baa4`.

Pull request'ler için doğrulayıcı, PR taban SHA → HEAD diff'ini alır. Push'lar için olay before → after diff'ini alır. En az bir korumalı dosya değiştiyse ve `.github/change-contract.json` değişen dosya kümesinde değilse, sıfır-dışı çıkar.

CI, `fetch-depth: 0` checkout kullanır, böylece PR/push diff'inin gerekli geçmişi vardır. Çalıştırılabilir negatif-yol regresyon derinliği sonra A18'de değerlendirilecektir.

---

## A02.14 — Eşlenmiş yüksek-risk yollarda yanlış `not-applicable`

Durum: **zorunlu-alan eşlemesi olan yollar için** `AUDITED_OK`.

Değişen her korumalı yol için doğrulayıcı `requiredDomainsForFile(path)` toplar. Toplanan her alan `impact[domain] === 'affected'` olmalıdır; aksi halde CI sıfır-dışı çıkar.

F-005 önemli sınırlamayı belgeler: eşlenmemiş veya eksik eşlenmiş bir dosya bu ikinci duvardan yararlanamaz.

---

## A02.15 — Risk / migrasyon / geri alma / test bildirimi doğrulaması

Durum: `GAP` — `F-008`.

Risk, migrasyon ve geri almanın makine doğrulaması vardır:

- risk düzeyi low/medium/high olmalı ve notlar boş olmamalı
- migrasyon gerekli boolean olmalı ve notlar boş olmamalı
- geri alma boş olmamalı
- fullSuite true olmalı
- build true olmalı

### Bulgu F-008 — hedefli regresyon politikası zorlanmıyor

Önem: `P2`
Alan: `tests / change contract`
Durum: `OPEN`

`validateSystemChangeContract()` yalnızca `Array.isArray(contract.tests.targeted)` kontrol eder. Boş dizi geçerlidir. Anlamlı kod değişiklikleri için `impact.tests === 'affected'` de gerektirmez.

Bu, insan sözleşmesinin uygulamadan önce hedefli testleri belirleme zorunlu sırasıyla çelişir ve hedeflenen “bir düğme/modül/özellik değişikliği onu neyin koruduğunu söylemeli” kuralını zayıflatır.

Etki:

Bir değişiklik, sıfır hedefli testle evrensel bildirimi geçebilir ve mevcut tam paket/derlemeye dayanabilir; yeni bir davranışın belirli bir regresyon koruması olmasa bile.

Karar: salt belge/araç değişiklikleri için tam istisnalar kararlaştırıldıktan sonra şema/politikayı sonra sertleştir.

---

## A02.16 — Kapı kendini korur

Durum: `GAP` — `F-006` + `F-007`.

### Bulgu F-006 — kanonik kural/kapı belgeleri korumasızdır

Önem: `P1`
Alan: `architecture / governance`
Durum: `OPEN`

`isGuardedChangeFile()` kök Markdown kural/sözleşme dosyalarını içermez. Bu nedenle yalnızca şunlardan herhangi birine yapılan bir değişiklik, `.github/change-contract.json` değiştirilmeden change-gate adımını geçebilir:

- `PROJECT_RULES.md`
- `ARCHITECTURE_RULES.md`
- `SYSTEM_DEVELOPMENT_CONTRACT.md`
- `SYSTEM_CHANGE_GATE.md`
- `MODULE_BEHAVIOR_STANDARD.md`
- diğer kanonik politika Markdown

Mevcut kapı testi açıkça `README.md`'nin korumasız olduğunu ileri sürer; bu, belirsiz bir yol eşleşmesi değil, güncel davranış olduğunu doğrular.

En önemlisi, `SYSTEM_CHANGE_GATE.md` — kapının kendisinin insan-okunur sözleşmesi — architecture-etki bildirimi olmadan zayıflatılabilir veya değiştirilebilir.

Etki:

Makine kapı kodu `src/` / `scripts/` / iş akışları altında korumalı kalır, ancak insan/AI kural gerçeği makine zorlamasından bağımsız sapabilir ve “önce kuralları oku” modelini zayıflatır.

Karar: kanonik yönetişim belgeleri korumalı architecture/süreç yüzeyleri olmalıdır.

### Bulgu F-007 — kapı testleri korumasızdır

Önem: `P2`
Alan: `tests / governance`
Durum: `OPEN`

`test/**` ve eski `tests/**` `isGuardedChangeFile()` tarafından korunmaz. Böylece `test/systemChangeGate.test.js` ve `test/systemChangeGateCiContract.test.js` yalnızca-test bir PR'da herhangi bir change bildirimi olmadan değiştirilebilir veya kaldırılabilir.

Etki:

CI hâlâ ortaya çıkan test paketini çalıştırır, ancak kapının kendi regresyon testlerini zayıflatmak/kaldırmak açık bir `tests/architecture` etki bildirimi gerektirmez. Bu nedenle `tests` etki alanı yalnızca-test değişikliklerini yönetmez.

Karar: test yüzeylerini, yalnızca-test değişikliklerine uygun yol/alan kurallarıyla koru.

---

## A02.17 — Yol-alan eşlemesi olmayan korumalı kaynak yolları

Durum: `GAP` — `F-005`.

Güncel sayı: `isGuardedChangeFile()` tarafından hâlâ korunurken `requiredDomainsForFile()` ile **tamamen eşlenmemiş 20 / 51 kaynak dosya**.

Bu sayı ROG SHA `dda455183e5c713cb55a24232436cfd39c68ce7b` için sabitlenmiştir ve sonraki mimari/dosya-dosya bölümlerinden sonra yeniden hesaplanmalıdır.

---

## A02.18 — Yerel doğrulayıcı davranışı (denetimde keşfedilen madde)

Durum: `GAP` — `F-009`.

### Bulgu F-009

Önem: `P2`
Alan: `tooling / developer workflow`
Durum: `OPEN`

`npm run contract:verify`, `scripts/verify-change-contract.mjs` çağırır. Ne `CHANGE_GATE_FILES` ne de GitHub olay ortam değişkenleri varken `changedFilesFromEnvironment()` null döner ve betik açıkça şunu yazdırır:

`System change contract schema is valid. Diff enforcement skipped outside CI.`

Şema doğrulamasından sonra başarıyla çıkar.

Etki:

Bir insan/AI korumalı kaynak dosyaları yerelde değiştirebilir, change bildirimini bayat bırakabilir, belgelenmiş doğrulayıcıyı çalıştırıp yeşil komut alabilir. Kanonik CI atlamayı sonra yine yakalar, bu yüzden bu bir üretim baypası değildir; hedeflenen “uygulamadan önce bildir” iş akışına göre PR-öncesi zorlama boşluğudur.

Karar: sonra yerel komutu varsayılan olarak çalışma-ağacı/taban değişikliklerini türetmek üzere yap veya ayrı, açıkça adlandırılmış yalnızca-şema kipi sağla.

---

## A02.19 — Yalnızca-test değişiklik yönetişimi (denetimde keşfedilen madde)

Durum: `GAP` — `F-007` / `F-008`.

`tests` alanı şemada vardır, ancak test dosyalarının kendisi korumasızdır ve hedefli testler boş olabilir. Test yönetişimi bu nedenle henüz kapalı bir döngü değildir.

---

# A02 sonucu

Bölüm durumu: `GAP` (denetim tamam; beş yeni bulgu açık)

A02 sonrası sayılar:

- Açık P0: 0
- Açık P1: 3 (`F-001`, `F-005`, `F-006`)
- Açık P2: 6 (`F-002`, `F-003`, `F-004`, `F-007`, `F-008`, `F-009`)
- Açık P3: 0
- Karar gerekli: 0

Sonraki katı denetim maddesi: `A03.01`.
