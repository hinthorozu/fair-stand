# A01 Denetim Kanıtı — Kanonik Belgeler + Doğruluk Kaynağı

Denetim bölümü: `A01 — Canonical docs + source-of-truth`
Denetim tarihi: `2026-09-03`
Kontrol edilen ROG SHA: `6b9a4400f10d8a1957ffd52dbc6a8da3f0141af5`
Denetim dalı: `audit/full-system-a01`

## Özet

A01, belgeleme/doğruluk-kaynağı denetimini tamamladı. Küresel ürün ve mimari sözleşmeler mevcut çalışma zamanı sahipliğiyle büyük ölçüde hizalıdır, ancak dört belgeleme/süreç sapması bulundu.

Bulgular:

- `F-001` P1 — `SYSTEM_MODULE_CATALOG.md`, çalışma zamanı kataloğuna göre maddi olarak bayattır.
- `F-002` P2 — tarihsel depo inceleme/ilerleme belgeleri görünür biçimde arşivlenmiş/tarihsel işaretlenmemiştir ve geçersiz kılınmış güncel-durum ifadeleri içerir.
- `F-003` P2 — yol haritası belgeleri, koddaki kanonik üretim sayısal değerlerini ve reçete olgularını çoğaltır.
- `F-004` P2 — geliştirici giriş noktası belgelemesi evrensel change gate'den öncesine aittir.

Bu denetim bölümünde çalışma zamanı kodu değiştirilmedi veya düzeltilmedi.

---

## A01.01 — PROJECT_RULES.md

Durum: `AUDITED_OK`

Kanıt:

- `PROJECT_RULES.md` blob: `4ce07780206186f2c5b6930af72a9bceb4ce6493`
- `src/moduleBehavior.js` blob: `d466d8c0d9e08853791ff84bddbb85d6d94a01e3`
- `src/modulePlacement.js` blob: `381eda7c096997fb29a4a8cd81ebd62f61d3342d`
- `src/catalog.js` blob: `b4514b445e6a70a38dcfb7a8c4d516089b3ce565`
- `src/productionParts.js` blob: `d86a57c312912e769006f639bd7d038326f7a3dd`

Sonuç:

- X/Y zemin ve Z-yükseklik kuralı belgelenmiş mantıksal model olarak durur.
- Modüle özel taşıma/döndürme/çarpışma/ghost değerleri, kurallar belgesinde küresel olarak dondurulmak yerine `moduleBehavior.js`'e devredilir.
- Yerleştirme algoritmaları yerleştirme/çekirdek kodunda kalır.
- Katalog nominal ölçüleri ile üretim/BOM ölçüleri açıkça ayrılmıştır.
- Silme-boşluğu/otomatik-sıkıştırma-yok, A06'da sonra doğrulanacak küresel bir değişmez olarak durur; belgenin kendisi artık eski geçersiz küresel 90-derece/50-cm davranış varsayımlarını içermez.

A01 sırasında bu belgede bayat küresel değişmez saptanmadı.

---

## A01.02 — ARCHITECTURE_RULES.md

Durum: `AUDITED_OK`

Kanıt:

- `ARCHITECTURE_RULES.md` blob: `4b378d811cc34f2cb237bedc4bc94d8ed884bd68`
- `src/moduleBehavior.js`
- `src/modulePlacement.js`
- `src/designState.js` blob: `98e3eeba8f98d63831a3be55745c7478d412ed17`
- `src/moduleRecipes.js`
- `src/productionParts.js`

Belgelenmiş sahiplik sınırları gerçek çalışma zamanı katmanlarına karşılık gelir: katalog, davranış, yerleştirme/çekirdek, durum, renderer sınırı ve reçete/üretim parçaları. Tekil çalışma zamanı dosyalarının bu sınırları ihlal edip etmediği kasıtlı olarak A03'e bırakılır; A01, mimari belgenin kendisinin mevcut hedeflenen sahiplik modelini tanımladığını doğrular.

---

## A01.03 — SYSTEM_DEVELOPMENT_CONTRACT.md

Durum: `GAP` — bkz. `F-004`.

Belgedeki sahip referansları gerçek ve günceldir:

- katalog → `src/catalog.js`
- modül politikası → `src/moduleContracts.js`
- özellik/bileşim → `src/featureContracts.js`
- davranış → `src/moduleBehavior.js` + yerleştirme çekirdeği
- durum → `src/designState.js`
- reçeteler → `src/moduleRecipes.js`
- üretim parçaları → `src/productionParts.js`
- otomatik depo → `src/autoDepot.js`
- sözleşme testleri → `test/` artı mevcut `tests/`

Ancak bu belge hâlâ kendini zorunlu geliştirme sözleşmesi olarak adlandırırken, zorunlu çalışma sırası geliştiriciyi daha yeni evrensel `SYSTEM_CHANGE_GATE.md` / `.github/change-contract.json` adımına yönlendirmez. CI kapıyı zorlar, fakat insan/AI giriş noktası belgelemesi bölünmüştür.

---

## A01.04 — SYSTEM_CHANGE_GATE.md ↔ systemChangeContract.js

Durum: `AUDITED_OK`

Kanıt:

- `SYSTEM_CHANGE_GATE.md` blob: `c155e2805ad68c4b481ade1a43c7b3ef8381ff37`
- `src/systemChangeContract.js` blob: `13a6a89d2fe51e6a5d15c10ad5b5e44fa5eda183`

Belgelenmiş 17 etki alanı, `SYSTEM_IMPACT_DOMAINS` ile tam olarak eşleşir:

`catalog, behavior, state, placement, renderer, persistence, bom, ui, composition, assets, storage, importExport, performance, accessibility, architecture, security, tests`.

Ayrıntılı yol kapsamı kalitesi burada belgelenmez; bu A02'nin kapsamıdır.

---

## A01.05 — MODULE_BEHAVIOR_STANDARD.md

Durum: `AUDITED_OK`

Kanıt:

- belge blob: `dee718d9ce80b92893c2143cc89492566e83b185`
- çalışma zamanı blob: `d466d8c0d9e08853791ff84bddbb85d6d94a01e3`

Belge, mevcut davranış sözleşmesi alanları ve kavramlarıyla eşleşir:

- placement
- moveSnapCm
- rotationStepDeg
- defaultRotationDeg
- allowSideInsert
- collision
- ghost
- açık katalog-tip kapsamı
- katalog-dışı yedek
- wall/free/wall-overlay/top yerleştirme kipleri
- segment/footprint/none çarpışma stratejileri
- tanımlayıcı-farkında merkezileştirilmiş override'lar

Belgelenmiş varsayılan ghost `{ kind: silhouette, renderer: module-silhouette, opacity: 0.38 }` de kodla eşleşir.

---

## A01.06 — SYSTEM_MODULE_CATALOG.md

Durum: `GAP` — `F-001`.

### Bulgu F-001

Önem: `P1`
Alan: `documentation / catalog / BOM source-of-truth`
Durum: `OPEN`

Kanıt:

- bayat belge blob: `04285925e3ee57a8312468f75084b3ad7f469fa6`
- güncel katalog blob: `b4514b445e6a70a38dcfb7a8c4d516089b3ce565`

Belge açıkça şunu iddia eder:

- toplam katalog modülü = `28`
- BOM reçeteli `24`
- BOM'suz `4`

Güncel `MODULE_CATALOG_KEYS` `45` girdi içerir.

Bayat belge ayrıca geçersiz kılınmış kimlik verisi içerir; örneğin `furniture_table_chair_set_minyon` / `table-chair-set`, oysa güncel katalog `furniture_table_chair_set_eames` / `table-chair-set-eames` kullanır.

Güncel çalışma zamanı kataloğu belgede olmayan birçok girdi içerir; sarmasık ayırıcılar, L bankolar, depo ekipmanları, bitkiler/uzun saksılar, TV boyutları, video duvarları ve diğer ekstralar.

Etki:

Bir insan veya AI bu belgeyi sözde güncel ROG referansı olarak kullanıp yanlış katalog/BOM sonuçlarına varabilir. Özellikle eski `24 / 4` BOM sayısı güncel denetim gerçeği olarak kabul edilmez. Güncel BOM kapsamı A12'de bağımsız denetlenecektir.

Karar: `denetim/kullanıcı talimatından sonra şimdi-düzelt önerilir`; denetim sırasında sessizce düzenleme yapılmaz.

---

## A01.07 — ROADMAP.md aktif plan gerçeği

Durum: `GAP` — `F-003`.

Ana yol haritasının faz etiketleri, bağlı faz-4 planıyla içsel olarak tutarlıdır: FAZ 1/2/3 kapalı, FAZ 4 aktif, FAZ 5/6 planlı. Eski render işi güncel FAZ 4 olarak sunulmamaktadır.

Ancak ana yol haritası ayrıca sabit fiziksel üretim ölçüleri ve tam bir 50-cm duvar reçetesi içeren bir `Doğrulanmış üretim bilgileri` bloğu saklar. Bu olguların kanonik çalışma zamanı sahipleri zaten `productionParts.js` / `moduleRecipes.js` içindedir. Bu, hedeflenen “yol haritası plandır, kod çalışma zamanı üretim gerçeğidir” ayrımını ihlal eder ve sapma riski yaratır. Bkz. `F-003`.

---

## A01.08 — PRODUCT_FUTURE.md

Durum: `AUDITED_OK`

Kanıt blob: `aa1a6940f5957f00b7b98b9a8a4bbd625ac1f832`

Belge kendini açıkça gelecek gereksinimler/veri ihtiyaçları olarak sınıflandırır, aktif önceliği yol haritası belgelerine yönlendirir ve alan kurallarını doğrulama gerektiren veri olarak etiketler. Doğrulanmamış kurallarının güncel çalışma zamanı kısıtları olduğunu iddia etmez.

---

## A01.09 — RENDER_FUTURE_BACKLOG.md

Durum: `AUDITED_OK`

Kanıt blob: `f5845e53e77ac6d7f255a64b27232f06066e130e`

Belge açıkça eski render “FAZ 4” etiketinin geçersiz olduğunu, güncel FAZ 4'ün reçete/parametrik/bağlantı-grafiği işi olduğunu ve render işinin yol haritası üzerinden yeniden etkinleştirilene kadar yalnızca gelecek olduğunu belirtir.

---

## A01.10 — Tarihsel belgeleme sınıflandırması

Durum: `GAP` — `F-002`.

### Bulgu F-002

Önem: `P2`
Alan: `documentation / repository history`
Durum: `OPEN`

Kanıt:

- `FRESH_REPOSITORY_REVIEW.md` blob `5767e856e75130d76ac3aa6698163c91a08aa238`
- `REPOSITORY_CLEANUP_PROGRESS.md` blob `13904e826b7f459d1672e28c13d3791fdc2d7b67`
- `MILESTONES.md` blob `8e0dbcf0fd2355b272e32ad36942b997ad4e708c`
- `Changelog.md` blob `31769e11fcff59ab908bd9553baef5e788922773`

`MILESTONES.md` doğru biçimde tarihsel kapanış kaydı olarak işaretlenmiştir ve aktif faz gerçeğini yol haritası dosyalarına yönlendirir. `Changelog.md` kendini kronolojik tarih olarak tanımlar.

Buna karşılık:

- `FRESH_REPOSITORY_REVIEW.md` tarihsel olarak işaretlenmemiştir ve hâlâ güncel `PROJECT_RULES.md`'nin 90-derece döndürme / 50-cm hareketi yanlış biçimde küreselleştirdiğini söyler; oysa güncel `PROJECT_RULES.md` zaten düzeltilmiştir.
- `REPOSITORY_CLEANUP_PROGRESS.md` kendini “nerede kaldık / sonraki iş” kontrol noktası olarak sunar ve renk-düzenleyici denetleyici PR/kanonik CI'nın hâlâ beklemede olduğuyla biter; oysa birçok sonraki PR zaten birleştirilmiştir.

Etki:

Yeni bir AI/insan, geçersiz kılınmış denetim/ilerleme belgelerini güncel depo durumu sanıp zaten çözülmüş işi yeniden açabilir.

Karar: sonraki bir düzeltme PR'ında açıkça işaretle/arşivle/yönlendir.

---

## A01.11 — LEGACY_TRASH.md yalıtımı

Durum: belgeleme/doğruluk-kaynağı yalıtımı için `AUDITED_OK`.

Kanıt:

- `LEGACY_TRASH.md` blob `cd86ec48ce560d1cd32087548652f068614bfbc4`
- `src/standCapacity.js` blob `cfb05f380fea5bc5fe52e464022ba898d72a217e`
- güncel katalog/davranış kaynakları

Eski dosya, doğrulanmamış alan kurallarının doğrulanana kadar kodlanmaması gerektiğini açıkça söyler. `LEGACY_TRASH.md`'ye çalışma zamanı import/referansı yoktur. Güncel stand-kapasitesi uygulaması, eski yaklaşık 4m/5–6m destek kuralları yerine gerçek aktif stand sınırlarını kontrol eder.

Güncel katalogda açık raf varyantları vardır, ancak A01, eski “en fazla 3 raf” cümlesinin kendisinin doğrulanmamış küresel kısıt olarak tüketildiğini söyleyen kanonik bir çalışma zamanı kuralı bulmadı. Daha derin davranış/parametrik kontroller kendi sonraki denetim bölümlerinde kalır.

---

## A01.12 — Yarışan çoğaltılmış sayısal/iş kuralları

Durum: `GAP` — `F-001` ve `F-003`.

### Bulgu F-003

Önem: `P2`
Alan: `documentation / production source-of-truth`
Durum: `OPEN`

Kanıt:

- `ROADMAP.md` blob `8b5afd0e31bc6172cb94cd6d5c5614e7aa61bb3d`
- `ROADMAP_PHASE_4.md` blob `ef7800f2747d69688206e05491e2a0037a92b493`
- `src/productionParts.js` blob `d86a57c312912e769006f639bd7d038326f7a3dd`
- `src/moduleRecipes.js` güncel ROG

Yol haritası Markdown'ında ve kodda çoğaltılan örnekler:

- dikme uzunluğu `346.5 cm` ve kalınlık `8 cm`
- panel yüksekliği `47 cm` / kalınlık `0.8 cm`
- düz panel genişlikleri `48.5 / 98 / 147.5 / 197`
- iç-köşe genişlikleri `42.5 / 92 / 142.5 / 192`
- profil uzunlukları `41.5 / 91 / 140.5 / 190`
- 50-cm düz-duvar reçete miktarları ve parça kimlikleri

Bu değerler şu anda kodla eşleşir, ancak bugün eşleşmek yarışan-kaynak riskini kaldırmaz. `PROJECT_RULES.md`, `ARCHITECTURE_RULES.md` ve `SYSTEM_DEVELOPMENT_CONTRACT.md` hepsi, çalışma zamanı değerlerinin bağımsız sabit Markdown gerçeği olarak sürdürülmemesi gerektiğini kurar.

Etki:

Bir üretim ölçüsü sonra kodda değişebilirken yol haritası/referans metni sessizce bayat kalabilir; bu denetimin önlemeyi amaçladığı doğruluk-kaynağı sapmasını üretir.

Karar: açıkça üretilmiş bir anlık görüntü mekanizması benimsenmedikçe, yol haritası sabit üretim veri kümelerini elle çoğaltmak yerine kanonik parça/reçete kaynaklarına referans vermelidir.

---

## A01.13 — README / geliştirici giriş noktası (denetimde keşfedilen kontrol listesi maddesi)

Durum: `GAP` — `F-004`.

### Bulgu F-004

Önem: `P2`
Alan: `documentation / development process`
Durum: `OPEN`

Kanıt:

- `README.md` blob `5a5f4b519c3fd12af182b364848305b65c76a9b6`
- `SYSTEM_DEVELOPMENT_CONTRACT.md` blob `81d32ed1791cf097587f71abfcf1c1512b45c5c6`
- `.github/workflows/ci.yml` güncel ROG
- `SYSTEM_CHANGE_GATE.md` / `src/systemChangeContract.js`

Sapma:

- README komut listesi `npm run contract:verify` göstermez.
- README kanonik CI'yı `npm ci → npm test → npm run build` olarak tanımlar; oysa güncel CI, kurulum/test/derlemeden önce change-contract kapısını çalıştırır.
- README depo-belge haritası `SYSTEM_DEVELOPMENT_CONTRACT.md`, `SYSTEM_CHANGE_GATE.md` ve `SYSTEM_AUDIT_CHECKLIST.md` belgelerini atlar.
- README “yeni modül” akışı, bir insan/AI'ya evrensel change contract'ı önce bildirmesini söylemez.
- `SYSTEM_DEVELOPMENT_CONTRACT.md` kendini zorunlu geliştirme sözleşmesi olarak adlandırır, ancak zorunlu sırası açıkça daha yeni evrensel change gate/change bildirimine devretmez.

Etki:

CI hâlâ birçok bildirilmemiş kod değişikliğini durdurur, bu yüzden bu tek başına bir uygulama baypası değildir. Ancak belgelenmiş giriş noktasını izleyen bir insan/AI eksik bir süreç alır ve CI reddetmeden önce iş kaybedebilir.

Karar: sonraki bir düzeltme PR'ında belgeleme giriş noktasını güncelle.

---

# A01 sonucu

Bölüm durumu: `GAP` (denetim tamam, dört bulgu açık)

A01 sonrası sayılar:

- Açık P0: 0
- Açık P1: 1 (`F-001`)
- Açık P2: 3 (`F-002`, `F-003`, `F-004`)
- Açık P3: 0
- Karar gerekli: 0

Sonraki katı denetim maddesi: `A02.01`.
