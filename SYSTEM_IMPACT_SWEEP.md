# Fair Stand — Full-System Change Impact Sweep

Bu belge, sisteme yapılan **her ekleme, değiştirme, düzeltme, silme, refactor, bugfix, UI değişikliği, state değişikliği, renderer değişikliği, persistence değişikliği, tooling değişikliği ve mimari değişiklik** için zorunlu etki taramasını tanımlar.

Bu kuralın amacı yalnızca "hangi domain etkilenebilir?" sorusunu sormak değildir. Amaç, değişen yüzeyin **gerçekte nerelerde kullanıldığını ve hangi mevcut sözleşme/testlerin bu değişikliğe bağlı olduğunu değişiklik kabul edilmeden önce bulmaktır.**

## 1. Temel kural

Guarded bir değişiklik yapıldığında sistem yalnız değişen dosyayı kontrol etmez.

Zorunlu tarama zinciri:

`değişen dosya / symbol / UI id / contract`  
`→ doğrudan referanslar ve import edenler`  
`→ transitive dependents / orchestration yolları`  
`→ mevcut testler ve source-text assertions`  
`→ canonical docs/contracts`  
`→ audit finding adayları`  
`→ targeted regression + full test + build`

Bu tarama tamamlanmadan implementation kabul edilmez.

## 2. Domain sayısına bağlı değildir

Bu süreç bugün tanımlı domain sayısına sabitlenmez.

`SYSTEM_IMPACT_DOMAINS` registry'sinde bugün kaç domain varsa **tamamı** değerlendirilir. Yarın registry 17 yerine 38 domain içerirse aynı kural 38 domainin tamamına uygulanır.

## 3. Otomatik discovery zorunluluğu

`npm run contract:verify` değişen guarded yüzeyler için en az şu keşifleri yapar:

1. Relative/static import ve export referansları.
2. Dynamic `import()` referansları.
3. `new URL('../src/...', import.meta.url)` ve benzeri source-file referansları.
4. Relative path string referansları.
5. Reverse dependency graph ve transitive dependents.
6. Diff içinde değişen/çıkarılan fonksiyon, class, state/controller/registry/contract/module/factory isimleri.
7. Diff içinde değişen UI `id`, `data-*`, CSS id/class tokenları.
8. Bu tokenları kullanan mevcut source/test/doc dosyaları.
9. Audit kayıtlarında aynı tokenlarla ilişkili finding adayları.

Discovery yalnız yeni kodu değil **silinen/eski symbol'leri de** tarar. Böylece refactor sırasında eski implementation adını regex ile bekleyen bir test görünür hale gelir.

## 4. Zorunlu acknowledgement

`.github/change-contract.json` her değişiklikte `impactAnalysis.mode = "full-system"` taşır.

Ayrıca şu listeler açıkça beyan edilir:

- `impactAnalysis.affectedFiles` — discovery tarafından bulunan ve gözden geçirilmesi gereken code/runtime dependents.
- `impactAnalysis.affectedTests` — değişiklikten etkilenebilecek mevcut testler + targeted testler.
- `impactAnalysis.affectedDocs` — canonical veya ilişkili doküman/contract yüzeyleri.
- `impactAnalysis.relatedFindings.affected` — gerçekten etkilenen audit finding'leri.
- `impactAnalysis.relatedFindings.reviewedNotAffected` — discovery tarafından aday gösterilen fakat incelenip etkilenmediği doğrulanan finding'ler.

Discovery tarafından bulunan bir yüzey bu beyanlarda yoksa gate **fail-closed** olur.

## 5. Test kuralı

Bir testin daha önce yeşil olması, yeni mimari için doğru test olduğu anlamına gelmez.

Her değişiklikte:

1. Discovery'nin bulduğu mevcut testler `impactAnalysis.affectedTests` içinde görünür olmalıdır.
2. Değişen davranış için en az bir targeted regression zorunludur.
3. Targeted testlerin tamamı `impactAnalysis.affectedTests` içinde yer almalıdır.
4. Existing test source-shape/implementation-detail assertion içeriyorsa yeni canonical ownership'e göre gözden geçirilir.
5. Test yalnız eski dosya adı, eski factory çağrısı veya eski dispatcher şekli bulunduğu için geçemez.
6. Targeted regression sonrası full `npm test` çalışır.
7. Ardından `npm run build` çalışır.

## 6. UI / buton kuralı

Bir buton, input, menu action, keyboard shortcut veya görünür UI değiştiğinde yalnız HTML/CSS kontrol edilmez.

Tarama en az şunları kapsar:

- DOM id/data attribute referansları,
- event handler / controller,
- çağrılan state veya feature yolu,
- persistence/save-load etkisi,
- undo/restore/delete kapsamı,
- renderer/scene etkisi,
- keyboard/accessibility etkisi,
- ilgili integration/source tests,
- varsa browser/E2E coverage.

UI handler bulunmadan veya downstream state davranışı incelenmeden UI değişikliği tamamlandı sayılmaz.

## 7. State / API / function kuralı

Bir function, method, state factory, registry veya public API değiştiğinde:

- nerede tanımlı olduğu,
- nerelerde çağrıldığı,
- hangi wrapper/orchestrator üzerinden kullanıldığı,
- hangi module/feature ailesini etkilediği,
- hangi testlerin doğrudan veya source-text üzerinden bağlı olduğu,
- persistence/restore yollarının etkilenip etkilenmediği,
- ilişkili finding/contract'ların etkilenip etkilenmediği

zorunlu olarak gözden geçirilir.

Yeni canonical API eklenip eski çağıran/testler sessizce bırakılmaz.

## 8. Finding ilişkileri

Bir remediation başka bir finding'in root cause'una dokunuyorsa bu ilişki görünür olmak zorundadır.

Örnek:

`F-010 state construction ownership` değişikliği `createCatalogModuleState` / non-catalog construction yolunu etkiliyorsa, `F-028 Tüm Özellikleri Kaldır + illuminated-foam` finding'i impact sweep sırasında aday olarak görünmeli ve `affected` veya gerekçeli `reviewedNotAffected` olarak ele alınmalıdır.

Finding'ler yalnız sıra numarasına göre bağımsız işler gibi uygulanmaz.

## 9. Fail-closed ilkesi

Aşağıdaki durumlardan biri varsa değişiklik kabul edilmez:

- impact analysis eksikse,
- discovery bulunan code dependent beyan edilmemişse,
- discovery bulunan test beyan edilmemişse,
- discovery bulunan doc/contract gözden geçirilmemişse,
- candidate finding incelenmemişse,
- targeted regression yoksa,
- full test başarısızsa,
- build başarısızsa.

"CI'da sonra çıkar" kabul edilen çalışma yöntemi değildir.

## 10. Sınır

Static discovery bütün runtime davranışını matematiksel olarak kanıtlayamaz. Reflection, runtime-generated selector/path, browser-only interaction veya external side effect gibi dinamik ilişkiler static scan dışında kalabilir.

Bu nedenle otomatik discovery **minimum zorunlu tabandır**, insan/AI impact review'ının yerine geçmez. Domain classification, contract review, targeted regression, full test/build ve gerektiğinde browser/E2E doğrulaması birlikte uygulanır.

## 11. Zorunlu çalışma sırası

1. Fresh base üzerinden change branch oluştur.
2. Değişikliği tanımla; henüz implementation yazma.
3. Universal domain classification yap.
4. Full-system impact discovery çalıştır.
5. Bulunan callers/dependents/tests/docs/findings listesini incele.
6. Change contract içinde tam impact analysis acknowledgement yaz.
7. Canonical owner ve contract kararlarını ver.
8. Implementation yap.
9. Impact discovery'yi tekrar çalıştır; diff değiştiyse acknowledgement listelerini güncelle.
10. Targeted regressionları çalıştır.
11. Full test çalıştır.
12. Build çalıştır.
13. PR CI yeşil olmadan tamamlandı deme.
14. Merge sonrası required CI doğrulanmadan finding kapatma.

**Kural:** Etki alanı implementation'dan sonra tahmin edilmez; implementation'dan önce keşfedilir ve implementation değiştikçe yeniden hesaplanır.
