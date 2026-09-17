# Fair Stand — Ertelenmiş Item kararları

Bu dosya Item refactor sırasında henüz çözülmemiş veya bilinçli olarak ertelenmiş property / Item kararlarının **sürekli kullanılan** takip listesidir.

- Kaynak: açık ürün kararı + mevcut kod/MD. Tahmin veya “muhtemelen” yazılmaz.
- Yeni ertelenen property veya Item kararı buraya eklenir; ayrı gizli liste tutulmaz.
- Listedeki madde, bu dosyada karar değişene kadar runtime’da silinmez, taşınmaz veya yeniden adlandırılmaz.
- Bu dosya tek başına implementasyon izni değildir.

---

## 1. `eyeCount`

- **Durum:** SİLİNECEK
- **Karar:** Yerine gerçek glass shelf yerleşim bilgisi gelecek.
- **Yasak:** Yeni bir dolaylı sayaç üretilmez.

## 2. `wallGapCm`

- **Durum:** KORUNACAK
- **Karar:** İleride uygun yeni property grubuna taşınacak.
- **Yasak:** Bu madde kapanmadan silinmez.

## 3. `mountHeightCm`

- **Durum:** ARAŞTIRILACAK
- **Karar:** Producer / consumer zinciri incelenmeden karar verilmez.

## 4. `stripOccupancy.align`

- **Durum:** ARAŞTIRILACAK
- **Karar:** Henüz verilmedi.

## 5. `stripOccupancy.stripCount`

- **Durum:** ARAŞTIRILACAK
- **Karar:** Henüz verilmedi.

## 6. `nominalModuleWidthCm`

- **Durum:** TEKRAR DEĞERLENDİRİLECEK
- **Karar:** Item / composition temizliğinden sonra yeniden bakılacak.
- **Yasak:** Şu aşamada değiştirilmez.
