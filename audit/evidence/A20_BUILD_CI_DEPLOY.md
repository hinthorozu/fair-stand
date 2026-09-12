# A20 — Derleme / CI / dağıtım denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Güncel kanonik CI

`.github/workflows/ci.yml` Node 22 ile ROG push ve ROG'a PR üzerinde çalışır:

1. tam geçmişle checkout,
2. `npm run contract:verify`,
3. `npm ci`,
4. `npm test`,
5. `npm run build`.

Taban SHA `e764732...` için son kanonik ROG push çalıştırması çalıştırma #83 / id `33792514084`; listelenen her adım başarıyla tamamlandı.

## Bulgular

### F-041 — P1 — ROG korumalı değildir; yeşil CI birleştirme/doğrudan-push zorlanmaz

ROG `protected:false` bildirir. CI iş akışı çalışır ve başarısız olabilir, ancak depo yönetişimi şu anda yazma/birleştirme izni olan bir insanın ROG'u güncellemesinden önce kontrolü gerektirmez. Bu nedenle evrensel change gate teknik olarak aktiftir ancak tam bir yönetişim duvarı değildir.

### F-042 — P1 — sunucu dağıtım yolu kanonik CI/kapı sözleşmesini zorlamaz ve commit-sabitli değildir

`scripts/install-server.sh` sunucuda hangisi kontrol edilmişse o dalda çalışır, origin'i değiştirir, sonra `dist/` nginx üzerinden sunulmadan önce `git pull --ff-only`, `npm ci` ve `npm run build` çalıştırır. **Şunları yapmaz**:

- açıkça ROG checkout/doğrulama,
- denetlenmiş bir commit SHA sabitleme,
- `npm run contract:verify` çalıştırma,
- dağıtımdan önce `npm test` çalıştırma.

İstenmeyen bir daldaki sunucu checkout'u veya doğrudan-push edilmiş bir commit bu nedenle kanonik CI'dan daha zayıf bir yolla derlenebilir/dağıtılabilir.

## Olumlu kontroller

- CI belirleyici `npm ci` kullanır.
- Node 22 açıktır.
- CI tam-geçmiş checkout, diff-farkında change gate'i destekler.
- test derlemeden önce gelir.
- sunucu yükleyici katı kabuk bayrakları kullanır, nginx doğrular, SSL işler ve `npm ci` kullanır.
- Vite yapılandırması Three.js satıcı kodunu kasıtlı ayırır.

## Kontrol listesi sonuçları

- A20.01 belirleyici kurulum: CI/dağıtımda `AUDITED_OK` (`npm ci`).
- A20.02 test/derleme sırası: CI'da `AUDITED_OK`.
- A20.03 testlerden önce change gate: CI'da `AUDITED_OK`.
- A20.04 güncel taban CI yeşil: `AUDITED_OK`.
- A20.05 birleştirmeden önce CI gerekli: `GAP` — F-041.
- A20.06 doğrudan push baypası engellenmiş: `GAP` — F-041.
- A20.07 dağıtım yeniden üretilebilir/sabitli: `GAP` — F-042.
- A20.08 dağıtım aynı doğrulama zincirini çalıştırır: `GAP` — F-042.
- A20.09 derleme yapılandırması kasıtlı: güncel Vite yapılandırması için `AUDITED_OK`.
- A20.10 üretim dağıtım duman/geri alma otomasyonu: `DECISION_REQUIRED`; yükleyici HTTPS erişilebilirlik kontrolü yapar ancak sürüm artefaktı/geri alma sözleşmesi yoktur.

Bölüm denetim durumu: **GAP**.
