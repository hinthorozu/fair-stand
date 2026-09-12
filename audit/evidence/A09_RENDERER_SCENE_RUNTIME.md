# A09 — Renderer / sahne / çalışma-zamanı-türetilmiş davranış denetimi

Taban: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Kip: önce-denetim / sonra-düzelt. Bu kanıt commit'inde çalışma zamanı/ürün düzeltmesi yok.

## Gözlenen renderer mimarisi

`scene3d.js` şu anda şunları sahiplenir:

- Three.js sahne/kameralar/kontroller/render döngüsü
- sahne/zemin/ızgara/duvar kılavuzları
- yordamsal modül renderer'ları
- GLB model yükleyicileri ve önbellekli şablonlar
- TV/medya/illuminated-foam renderer'ları
- seçim/ışın izleme/bağlam-menüsü bağlam oluşturma
- sürükleme önizleme/bırakma planlama entegrasyonu
- yüzey görünüm mutasyonu ve doku uygulama
- renderer-yanı kaynak imha

Bu yoğunlaşma işlevseldir ancak F-011/F-017'de zaten izlenen birkaç çapraz-alan sahiplik bağlanması yaratır.

## Bulgular

### F-024 — P2 — model yükleme başarısızlığı, model-destekli modülleri yalnızca konsol başarısızlığıyla fiilen görünmez bırakır

Birkaç GLB-destekli modül renderer'ı şeffaf bir seçim vekili oluşturur, sonra asıl GLB'yi eşzamansız ekler. Yükleme başarısızlığında işleyiciler genellikle yalnızca `console.warn(...)` yapar; kullanıcıya görünür yedek geometri/durum yükseltilmez.

Örnekler arasında iç mekan bitkisi, coat rack, kettle ve diğer önbellekli GLB aileleri vardır. Vekil malzemesi kasıtlı olarak görünmez olduğu için, eksik/bozuk/erişilemez bir model, görünür ürün geometrisi olmadan yerleştirme/çarpışma alanı kaplayan kalıcı bir modül bırakabilir.

Önbellekli yükleyici promise'leri reddedildikten sonra da tutulur, böylece geçici bir ilk yükleme başarısızlığı, o sayfa oturumunda sonraki denemeler için reddedilmiş önbellekli promise olarak kalır.

Bu bir dayanıklılık/gözlemlenebilirlik bulgusudur; işlenmiş public varlıkların şu anda eksik olduğunun kanıtı değildir.

## Kontrol listesi sonuçları

- **A09.01 durum-güdümlü yeniden kurulum:** güncel modül aileleri için `AUDITED_OK`. Yeniden kurulum, modül durumu artı kanonik katalog/yapılandırma değerlerini tüketir.
- **A09.02 renderer yalnızca görselleştirir:** `GAP` — F-017; scene3d kalıcı düzenlenebilir yüzey durumunu doğrudan değiştirir.
- **A09.03 GLB/yordamsal kullanılabilirlik:** `GAP` — işlenmiş model yolları incelendi, ancak başarısızlık yedeği/geri bildirimi yetersizdir (F-024). Varlık varlığı/lisans A13/A21.
- **A09.04 yalnızca-renderer görünüm hack'leri:** `GAP` — renderer birçok görsel sabiti uygun biçimde içerir, ancak modüle özel etkileşim/yerleştirme yönlendirmesi de gömülüdür; F-011. LED/model aileleri için çalışma zamanı ölçü çoğaltması F-019'a referans verir.
- **A09.05 yükleme başarısızlığı:** `GAP` — F-024.
- **A09.06 eşzamansız yarış / bayat sahne:** `GAP/P2 gözlem` — bazı eşzamansız model ekleme yolları yüklemeden sonra eklemeden önce `group.parent` kontrol eder, diğerleri etmez. Ayrılmış-grup ekleme öncelikle bir kaynak-yaşam-döngüsü/performans riskidir; A17 burada yinelenen açmak yerine onu sınıflandırır.
- **A09.07 imha:** `IN_SCOPE_A17` — açık imha yardımcıları vardır; tam geometri/malzeme/doku/paylaşılan-şablon doğruluğu performans bölümünde denetlenir.
- **A09.08 tekrarlanan sahne yeniden kurulumu:** işlevsel düzeyde `AUDITED_OK` — sahne/duvar grupları ve seçim bilinçli biriktirilmek yerine temizlenir/yeniden kurulur. Kaynak doğruluğu A17'ye bırakıldı.
- **A09.09 yeniden boyutlandırma/DPR:** güncel kod düzeyinde `AUDITED_OK` — renderer piksel oranı sınırlıdır (1 kaba / aksi halde 1.5), kamera sığdırma kapsayıcı en-boyunu kullanır, yeniden boyutlandırma mantığı vardır. Tarayıcı E2E gerçek yeniden boyutlandırmayı A19'da doğrular.
- **A09.10 yakalama/render:** kaynak düzeyinde `AUDITED_OK` — güncel-görünüm PNG yakalama geçici olarak istenen ölçeği kullanır ve düzenleyici ölçülerini/durumunu geri yükler; gerçek tarayıcı dışa aktarma A19.
- **A09.11 özelleşmiş renderer'lar:** `GAP` yalnızca ortak sahiplik kurallarının aşıldığı yerde: F-011, F-017, F-019. Ek tekil kalıcı kural yeni bir bulguya ayrılmadı.
- **A09.12 yalnızca-çalışma-zamanı davranış:** güncel modül kümesi için `AUDITED_OK` — canlı saat/zamanlayıcı modülü şu anda yoktur. Gelecek yeniden kurulumu etkileyen raf/kumaş/köpük ayarları kasıtlı olarak kalıcıdır.

## Çapraz-alan çatışmaları

- Sahne çevre sabiti çoğaltması: F-012.
- Renderer'da yerleştirme/tip politikası: F-011.
- Renderer'da kalıcı durum mutasyonu: F-017.
- Durum/katalog çalışma zamanı ölçüleri: F-019.
- Katalog kimliği belirsizliği renderer etiketlerini/sözleşmelerini etkileyebilir ancak kökü F-013'tür.

Bölüm denetim durumu: **GAP**.
Sonraki denetim bölümü: **A10 — UI kontrolleri / girdiler / menüler / kısayollar / geri bildirim**.
