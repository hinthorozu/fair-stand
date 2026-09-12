# A02 / F-006 Düzeltme Kapanışı

Bulgu: `F-006` — Kanonik kural/gate Markdown belgeleri korumalı-dosya tespitinin dışındaydı.
Önem: `P1`
Durum: **CLOSED**

## Düzeltme

`src/systemChangeContract.js` artık `GOVERNANCE_DOCUMENT_REQUIRED_DOMAINS` bildirir ve aşağıdaki dosyaları korumalı architecture yüzeyleri olarak işler:

- `README.md`
- `PROJECT_RULES.md`
- `ARCHITECTURE_RULES.md`
- `SYSTEM_DEVELOPMENT_CONTRACT.md`
- `SYSTEM_CHANGE_GATE.md`
- `MODULE_BEHAVIOR_STANDARD.md`
- `SYSTEM_AUDIT_CHECKLIST.md`

Bu dosyalardan herhangi birine yapılan değişiklik artık aynı korumalı farkta `.github/change-contract.json` gerektirir ve `impact.architecture = affected` gerektirir.

`ROADMAP.md` gibi planlama/tarih belgeleri kasıtlı olarak bu yönetişime özel kurala alınmaz.

## Regresyon koruması

`test/systemChangeGate.test.js` şunları doğrular:

1. yedi yönetişim/geliştirici-giriş-noktası belgesinin tümü korunur,
2. her biri architecture etki alanını gerektirir,
3. `README.md` ve `SYSTEM_CHANGE_GATE.md` artık evrensel bildirimi atlayamaz,
4. yönetişim dışı planlama Markdown'ı bu özel korumanın dışında kalır.

## Doğrulama

PR: `#41 — Fix F-006 guard canonical governance documents`
Kapanış kayıtlarından önceki uygulama head: `bbccef67434dbfdf317c8a6e6e2d1a5d8add0397`
PR CI çalıştırması: `#112` / `33802087763`

Doğrulanan başarılı adımlar:

- Change contract gate: passed
- Install dependencies: passed
- Full `npm test`: passed
- `npm run build`: passed

Hiçbir runtime ürün davranışı veya saklı-proje şeması değişmedi.

## Sonuç

İnsan/AI yönetişim sözleşmesi ile makine gate'i, açık bir architecture-etki bildirimi olmadan yalnızca belgeler üzerinden sapamaz.
