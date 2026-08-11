# Changelog

Bu dosya, Fair Stand / Maxima Stand Konfigüratörü projesinde başlangıçtan bugüne yapılan geliştirmeleri kronolojik olarak kaydeder.

## Başlangıç ve proje iskeleti

1. Proje, bağımsız çalışan bir 3D fuar standı konfigüratörü olarak başlatıldı.
2. GitHub deposu olarak `hinthorozu/fair-stand` kullanıldı.
3. İlk proje notları ve hedefleri `README.md` dosyasına yazıldı.
4. Uygulama için Vite tabanlı bir frontend yapısı oluşturuldu.
5. 3D sahne motoru olarak Three.js eklendi.
6. Three.js OrbitControls entegrasyonu yapıldı.
7. `package.json` oluşturuldu.
8. `npm run dev`, `npm run test`, `npm run build` ve `npm run preview` scriptleri tanımlandı.
9. GitHub Actions üzerinden otomatik test ve build kontrolü kuruldu.

## Maxima sistem ölçüleri ve katalog

10. Stand yüksekliği 350 cm olarak tanımlandı.
11. Stand derinliği 10 cm olarak tanımlandı.
12. Düz panel yapısı 7 adet yatay bölüme ayrıldı.
13. Her yatay bölüm 50 cm yükseklik olacak şekilde modellendi.
14. Standart düz panel genişlikleri 50 / 100 / 150 / 200 cm olarak tanımlandı.
15. `Düz Panel 50` katalog öğesi eklendi.
16. `Düz Panel 100` katalog öğesi eklendi.
17. `Düz Panel 150` katalog öğesi eklendi.
18. `Düz Panel 200` katalog öğesi eklendi.
19. `3 Raflı Vitrin 100` katalog öğesi tanımlandı.
20. `2 Raflı Vitrin 100` katalog öğesi tanımlandı.
21. `Depo Kapısı 100` katalog öğesi tanımlandı.
22. `Separatör 100` katalog öğesi tanımlandı.
23. `Separatör 50` katalog öğesi tanımlandı.

## İlk 3D duvar prototipi

24. Three.js sahnesi oluşturuldu.
25. Perspektif kamera eklendi.
26. OrbitControls ile sahne döndürme ve zoom desteği eklendi.
27. Hemisphere light eklendi.
28. Directional light eklendi.
29. Gölge desteği açıldı.
30. Zemin plane'i eklendi.
31. Grid zemini eklendi.
32. Maxima benzeri dikey profil geometrileri oluşturuldu.
33. Maxima benzeri yatay ray geometrileri oluşturuldu.
34. Her düz modül için 7 ayrı seçilebilir panel yüzeyi üretildi.
35. Panel arka gövdesi ayrı mesh olarak oluşturuldu.
36. Panel ön yüzeyi ayrı mesh olarak oluşturuldu.
37. Modüllerin yan yana hizalı şekilde yerleştirilmesi sağlandı.
38. İlk demo olarak 350 cm duvarın otomatik şekilde `200 + 150` modüllerine bölünmesi sağlandı.

## Düz duvar oluşturma motoru

39. Duvar genişliği doğrulama fonksiyonu yazıldı.
40. Minimum duvar genişliği 50 cm olarak belirlendi.
41. Şimdilik duvar ölçülerinin 50 cm katları olması şartı eklendi.
42. 50 / 100 / 150 / 200 cm modülleri kullanarak otomatik düz duvar oluşturma algoritması yazıldı.
43. Algoritmada büyük modülden küçüğe seçim yapılarak modül sayısının azaltılması hedeflendi.
44. 350 cm için `200 + 150` sonucu test edildi.
45. 600 cm için `200 + 200 + 200` mantığı desteklendi.
46. Otomatik duvar çözüm motoru için testler yazıldı.

## Kullanıcı arayüzü

47. Sol tarafta kontrol paneli oluşturuldu.
48. Toplam duvar genişliği girişi eklendi.
49. `Oluştur` butonu eklendi.
50. Oluşturulan duvarın toplam ölçüsünü ve modül dağılımını gösteren bilgi alanı eklendi.
51. Elle 50 cm modül ekleme butonu eklendi.
52. Elle 100 cm modül ekleme butonu eklendi.
53. Elle 150 cm modül ekleme butonu eklendi.
54. Elle 200 cm modül ekleme butonu eklendi.
55. `Duvarı temizle` butonu eklendi.
56. Seçili yüzey bilgisi alanı eklendi.
57. Renk seçici eklendi.
58. `Rengi uygula` butonu eklendi.
59. Görsel / logo dosya seçme alanı eklendi.
60. `Görseli kaldır` butonu eklendi.
61. Sağ üstte sahne kullanım ipuçları eklendi.
62. Arayüz mobil ekranlar için responsive hale getirildi.

## 11 Ağustos 2026 — FAZ 3 / Zemin sistemi tamamlandı

- Aktif stand alanı sabit **5 cm yüksekliğinde platform** haline getirildi; modüller ve duvarlar platform üst kotuna taşındı.
- Platform yüksekliği zemin tipi ve renk değişikliklerinden bağımsız, değişmez 5 cm olarak sabitlendi.
- **Karolaj** zemini gerçek ölçekte **100 × 100 cm** olarak eklendi; stand ölçüsü tam metre değilse son karo otomatik kalan ölçüde kırpılır (ör. 450 cm = 100 + 100 + 100 + 100 + 50).
- Karolaj, mevcut **Aktif renk → Rengi uygula** aracıyla boyanabilir hale getirildi; grid/derz çizgileri renk değişiminde korunur.
- **Halı / Halıfleks** zemini eklendi; yüzey mevcut aktif renk aracıyla boyanabilir hale getirildi.
- Parke zemini üç sabit seçenek olarak ayrıldı: **Parke Açık**, **Parke Sarı**, **Parke Beton**.
- Parke deseni tuğla görünümünden çıkarılıp uzun, ince ve şaşırtmalı parke/laminat lamel düzenine dönüştürüldü.
- Parke seçenekleri serbest renk boyamasının dışında bırakıldı; kendi sabit yüzey tonlarını kullanır.
- Zemin seçimi ve boyama davranışları mevcut panel/modül renk sistemini bozmadan entegre edildi.
- **FAZ 3 / 1. Zemin ayarlanması tamamlandı.**


## 11 Ağustos 2026 — LED projektör ilk sürüm

- LED Projektör katalog modülü eklendi; siyah ince floodlight gövde, braket ve emissive lens geometrisi oluşturuldu.
- Projektör 350 cm duvar üst kotuna bağlanan üst aksesuar olarak tanımlandı; duvar kapasitesini ve normal modül collision hesabını tüketmez.
- Sırt/L/U standların izin verilen duvar üst kenarlarına 50 cm snap ile sürüklenebilir ve taşınabilir hale getirildi.
- Her projektöre panel yüzüne doğru gerçek Three.js SpotLight ışığı eklendi.
