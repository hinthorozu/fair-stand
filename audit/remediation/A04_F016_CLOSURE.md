# A04 F-016 kapanışı

Bulgu: **F-016 — Right-wall corner orientation conflict: 90° helper vs 270° active placement/reflow**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Kök neden

`src/cornerPlacement.js` hâlâ sağ-duvar yerleşimini `90°` olarak kodluyordu; `src/wallReflow.js` içindeki aktif sürekli-duvar yerleşim/yeniden-akış yolu ise kanonik içe bakan sağ-duvar yönelimi olan `270°` kullanıyordu. Eski yardımcının kendi, `90°` bekleyen regresyon testi de vardı; böylece depo testleri artık aktif uygulama davranışıyla örtüşmeyen bir kuralı koruyordu.

## Düzeltme

Uygulama PR **#65 — Fix F-016 right-wall orientation conflict** eski yardımcıyı ve testleri aktif kanonik kuralla hizaladı:

- sol duvar `90°` kalır,
- arka duvar `0°` kalır,
- sağ duvar `270°`'dir,
- `test/cornerPlacement.test.js` içindeki eski sağ-duvar armatürleri güncellendi,
- `cornerPlacement` ile `wallReflow`'un aynı `270°` sağ-duvar yöneliminde anlaştığını doğrulamak için `test/rightWallOrientation.test.js` eklendi.

Aktif runtime yolu zaten `270°` kullanıyordu; bu düzeltme amaçlanan ürün davranışını değiştirmek yerine çatışan alternatif kuralı kaldırdı.

## Doğrulama

Son PR head: `f0270a5158469d23977ac8d9ce4eb64b5147c6e5`.

PR CI çalıştırması **#286 / run `33993408626`** başarıyla tamamlandı:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

PR #65, `e1e37d8211d4a20aa5a4b0575134ee103609d8c0` olarak `ROG`'a birleştirildi.

Birleştirme sonrası `ROG` CI çalıştırması **#288 / run `33993672871`** başarıyla tamamlandı:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

## Sonuç

Depo artık alternatif köşe-yerleşim yardımcısı ile aktif duvar-yeniden-akış yolu arasında çelişen sağ-duvar yönelim beklentileri taşımaz. Runtime ve regresyon kapsamı artık kanonik `270°` sağ-duvar yöneliminde anlaşır.

**F-016 is CLOSED.**
