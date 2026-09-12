# A21 F-041 kapanışı

Bulgu: **F-041 — ROG korumasız; yeşil CI/change-gate merge/doğrudan push öncesi zorunlu değil**

Durum: **CLOSED / REPOSITORY RULESET VERIFIED**

## Kök neden

Denetim baseline'ında kanonik `ROG` dalının, değişikliklerin inmesi için pull-request akışı ve yeşil kanonik CI zorunlu kılan uygulanmış bir depo kuralı yoktu. Bu, yönetişimin sunucu tarafı dal kuralı yerine teamüle dayanmasına izin veriyordu.

## Düzeltme

GitHub depo ruleset **`Protect ROG`** (ruleset id `22234684`) artık aktiftir ve tam olarak `refs/heads/ROG` hedefini alır.

Canlı ruleset şunları zorunlu kılar:

- değişikliklerin `ROG`'a inmesi için pull request,
- zorunlu durum kontrolü `verify`,
- katı zorunlu-durum-kontrolü politikası,
- dal silme engeli,
- fast-forward olmayan güncelleme engeli,
- bypass aktörü yok; güncel kullanıcı bypass'ı `never`.

Depo dal API'si de `ROG`'u korumalı olarak bildirir. Koruma, eski/klasik dal-koruma yapılandırmasına dayanmak yerine depo ruleset'i üzerinden uygulanır.

Bu kapanış defter işlemi hiçbir uygulama runtime, kalıcılık, şema, renderer, yerleşim, Item/BOM, katalog, içe/dışa aktarma, derleme çıktısı veya dağıtım davranışını değiştirmez.

## Doğrulama

Canlı GitHub depo yapılandırması kapanıştan önce doğrudan okundu:

- ruleset adı: `Protect ROG`,
- ruleset hedefi: branch,
- zorunluluk: `active`,
- dahil edilen ref: `refs/heads/ROG`,
- pull-request kuralı mevcut,
- required-status-check kuralı mevcut,
- zorunlu kontrol: `verify`,
- katı zorunlu-durum-kontrolü politikası: `true`,
- silme kuralı mevcut,
- non-fast-forward kuralı mevcut,
- bypass aktörleri: yok,
- `current_user_can_bypass`: `never`.

Kapanış PR'ının kendisi birleştirmeden önce kanonik `verify` CI'sini geçmelidir; bu, korumalı-dal iş akışının deponun güncel yönetişim zinciriyle uyumlu kaldığına dair ek bir operasyonel kontroldür.

## Sonuç

`ROG` artık korumasız bir dal değildir. GitHub artık dal sınırında PR tabanlı entegrasyonu ve kanonik yeşil `verify` kontrolünü zorunlu kılar; ayrıca bypass aktörü olmadan silmeyi ve fast-forward olmayan güncellemeleri engeller.

A21, F-043, F-044, F-045 ve F-046 ayrı açık depo-hijyen bulguları olduğu için daha geniş bir `GAP` bölümü olarak kalır.

**F-041 is CLOSED.**
