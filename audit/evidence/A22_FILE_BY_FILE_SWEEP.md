# A22 — Dosya-dosya nihai kaynak tarama

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Kapsam

A03 tüm **51 `src/` dosyasını** birincil sahip/alana eşledi. A22 o tam haritayı yeniden kullandı ve özyinelemeli depo ağacından kalan kök/altyapı yüzeylerini çapraz kontrol etti:

- `index.html`
- `package.json` / kilit dosyası
- `vite.config.js`
- `.github/workflows/ci.yml`
- `.github/change-contract.json`
- `scripts/**`
- `public/**`
- `test/**` ve eski `tests/**`
- kanonik kural/sözleşme/denetim/yol haritası belgeleri.

Hiçbir kaynak ailesi A00-A23 kanıt zincirinden kasıtlı dışlanmadı.

## Doğrulanan dosya-düzeyi çatışmalar

- `main.js`: paralel modül-durum kurulum kaydı — F-010; yıkıcı UI kapsam/sıfırlama hataları — F-027/F-028; arşiv/şema güven boşlukları — F-035/F-036/F-037.
- `modulePlacement.js` / `scene3d.js` / `main.js`: gizli modüle özel yerleştirme politikası — F-011.
- `cornerPlacement.js` versus güncel kanonik sağ-duvar yerleştirme/reflow testleri: 90° vs 270° kural çatışması — F-016.
- `designState.js` versus katalog: yapısal/varsayılan ölçü çoğaltması — F-018/F-019.
- `scene3d.js`: doğrudan kalıcı durum mutasyonu — F-017; model başarısızlığı görünürlüğü — F-024.
- `projectStore.js` + `assetStore.js`: çoğaltılmış DB şema sahibi — F-032; çok-depo atomiklik F-023.
- `rawBomDebug.js` + `index.html`: üretim hata ayıklama yolu — F-025.
- `automaticWall.js`: özellik sözleşmesi olmadan aktif çok-modüllü bileşim — F-029.
- `moduleRecipes.js` / `productionParts.js`: proje Final BOM / ilişki bağlayıcı geçişi yok — F-030/F-031.
- `scripts/install-server.sh`: CI'dan daha zayıf dağıtım zinciri — F-042.
- tarihsel kaynak-yeniden-yazma betikleri: F-045.
- public varlık ağacı: F-033/F-034.

## TODO / FIXME / HACK / DEBUG tarama

TODO/FIXME için depo kod araması sıfır dizinlenmiş eşleşme döndürdü, ancak GitHub kod-arama yanıtı sonuçları `incomplete` işaretledi, bu yüzden bu denetim hiçbir yerde işaret olmadığı yönünde daha güçlü iddia **yapmaz**. Bağımsız incelenen çekirdek dosyalar yeni bir çalışma zamanı bulgusu süren çözülmemiş bir TODO/FIXME işareti ortaya çıkarmadı. `rawBomDebug.js` gerçek bir hata ayıklama yüzeyidir ve zaten F-025'tir.

## Yetim/ölü-yol sınıflandırması

Daha güçlü import-grafiği kanıtı olmadan yeni bir üretim-yetim kaynak dosyası ayrı bulguya yükseltilmez. `cornerPlacement.js` özellikle sorunlu kalır çünkü doğrulanmış davranışı aktif yerleştirme kuralıyla çatışır (F-016), şu anda birincil çalışma zamanı yolu olup olmadığına bakılmaksızın. Park edilmiş public varlıklar silinmek veya geçersiz tahmin edilmek yerine açıkça F-033 altında ele alınır.

## Kontrol listesi sonucu

A22'nin istediği tüm dosyalar/dizinler A00-A22 kanıtı üzerinden incelendi/sınıflandırıldı veya açıkça `DECISION_REQUIRED` işaretlendi; hiçbir A22 maddesi `NOT_AUDITED` kalmaz.

Bölüm denetim durumu: **GAP — tarama tamam, bulgular çapraz bağlı; düzeltme yapılmadı.**
