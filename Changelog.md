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

## Panel seçimi ve renklendirme

63. Raycaster ile 3D panel yüzeyine tıklama desteği eklendi.
64. Normal tıklamada tek panel seçimi yapıldı.
65. Seçilen panel bilgisi arayüzde gösterildi.
66. Panel rengi anlık olarak değiştirilebilir hale getirildi.
67. Panel varsayılan rengi beyaz (`#ffffff`) olarak değiştirildi.
68. Görseli olmayan panellerde seçilen renk panel state'ine yazılır hale getirildi.
69. Görsel bulunan panellerde renk state'i korunurken texture'ın tint edilmemesi sağlandı.

## Çoklu seçim

70. `Ctrl + tık` ile çoklu panel seçimi eklendi.
71. macOS için `Cmd + tık` desteği de eklendi.
72. Ctrl/Cmd ile seçilen bir panel tekrar tıklanınca seçimden çıkarılması sağlandı.
73. Normal tıklamada mevcut seçim temizlenip tek panel seçilir hale getirildi.
74. Boş alana normal tıklanınca seçim temizlenir hale getirildi.
75. Çoklu seçili panel sayısı arayüzde gösterilmeye başlandı.
76. Çoklu seçili panellere tek seferde aynı renk uygulanması eklendi.
77. Çoklu seçili panellerden görseli tek seferde kaldırma desteği eklendi.

## Seçim görünürlüğü

78. Çoklu seçimde seçili yüzeylerin daha net görünmesi için seçim çerçevesi eklendi.
79. Her panel yüzeyi için seçim frame'i oluşturuldu.
80. Seçili yüzeylerde mavi/turkuaz çerçeve görünür hale getirildi.
81. Seçim sırasında hafif emissive highlight eklendi.
82. Seçim kaldırıldığında çerçeve ve emissive efektin temizlenmesi sağlandı.

## Zemin ölçeği ve duvar başlangıç noktası

83. Zemin grid'i gerçek ölçü mantığına çekildi.
84. Grid 30 metre alan / 30 bölüm olacak şekilde ayarlandı.
85. Her grid karesi 1 m × 1 m, yani 100 cm × 100 cm olacak şekilde düzenlendi.
86. Duvarın ortada merkezlenmesi kaldırıldı.
87. Duvarın grid üzerindeki sabit başlangıç çizgisinden başlaması sağlandı.
88. Yeni modüller sağ tarafa doğru eklenir hale getirildi.
89. Kamera odağı, duvarın gerçek başlangıç ve toplam genişliğine göre güncellendi.
90. Böylece duvarın kaç metre uzadığı grid üzerinden okunabilir hale getirildi.

## Tasarım state altyapısı

91. `designState.js` oluşturuldu.
92. Her modül için benzersiz bir `moduleId` üretilmeye başlandı.
93. Her panel yüzeyi için benzersiz bir `surfaceId` üretilmeye başlandı.
94. Her panelin rengi state içinde tutulmaya başlandı.
95. Her panelin görsel asset kimliği state içinde tutulmaya başlandı.
96. Her panel için texture transform alanları state içine eklendi.
97. Texture offset X state'i eklendi.
98. Texture offset Y state'i eklendi.
99. Texture repeat X state'i eklendi.
100. Texture repeat Y state'i eklendi.
101. Texture rotation state'i eklendi.
102. Duvar yeniden çizildiğinde aynı sıradaki aynı genişlikteki modüllerin state'inin korunması sağlandı.
103. Modül eklendiğinde eski modüllerin renklerinin kaybolması bug'ı giderildi.
104. Modül eklendiğinde eski modüllerin görsellerinin kaybolması bug'ı giderildi.
105. Seçili panel kimliklerinin duvar rebuild sırasında korunması sağlandı.
106. State korunumu için otomatik test eklendi.
107. State korunumu test + build üzerinden doğrulandı.

## Renk aracı davranışı

108. Bir panele tıklandığında renk picker'ın panelin mevcut rengine zorla dönmesi kaldırıldı.
109. Kullanıcının en son seçtiği renk araçta kalır hale getirildi.
110. Sayfa sıfırdan açıldığında renk picker varsayılan beyaz başlar hale getirildi.
111. Böylece farklı panellere aynı rengi art arda uygularken tekrar tekrar renk seçme ihtiyacı azaltıldı.

## Görsel / logo state ve arşiv sistemi

112. Görselleri tekrar tekrar upload etme ihtiyacını kaldırmak için görsel arşivi tasarlandı.
113. `assetStore.js` oluşturuldu.
114. Tarayıcı üzerinde kalıcı görsel saklama altyapısı eklendi.
115. Yüklenen görseller için benzersiz asset kimliği oluşturuldu.
116. Görsel adı kaydedilmeye başlandı.
117. Görsel blob verisi kaydedilmeye başlandı.
118. Görsel oluşturulma zamanı kaydedilmeye başlandı.
119. Uygulama açılırken daha önce yüklenen görsellerin tekrar yüklenmesi sağlandı.
120. Görsel arşivindeki her asset için object URL oluşturuldu.
121. Sol panelde görsel arşivi alanı eklendi.
122. Arşivde görseller thumbnail olarak gösterilmeye başlandı.
123. Görsel adına arşiv tile'ında yer verildi.
124. Arşivden bir görsel aktif hale getirilebilir oldu.
125. Aktif görsel bilgisi arayüzde gösterilmeye başlandı.
126. Bir görsel yalnızca bir kez upload edilip daha sonra tekrar kullanılabilir hale getirildi.
127. Sayfa kapanırken oluşturulan object URL'lerin temizlenmesi sağlandı.
128. `Görseli uygula` davranışı aktif arşiv asset'i üzerinden çalışır hale getirildi.

## Texture uygulama ve state restorasyonu

129. Asset kimliğinden gerçek görsel URL'sine erişim için resolver eklendi.
130. TextureLoader asset arşivi ile entegre edildi.
131. Bir panelde kayıtlı görsel varsa rebuild sonrası tekrar yüklenmesi sağlandı.
132. Texture color space sRGB olarak ayarlandı.
133. Texture anisotropy ayarı renderer kapasitesine göre yapıldı.
134. Texture wrap ayarları eklendi.
135. Texture center ayarı eklendi.
136. State içindeki texture transform değerleri Three.js texture'a uygulanır hale getirildi.
137. Görsel kaldırıldığında panelin kayıtlı kendi rengine dönmesi sağlandı.

## Yatay birleşik görsel uygulama

138. Çoklu seçime aynı görseli her panele ayrı ayrı basma davranışının yetersiz olduğu tespit edildi.
139. Yan yana seçili panellerin tek baskı alanı olarak değerlendirilmesi için yeni mantık geliştirildi.
140. İlk sürüm yalnızca yatay birleşik seçim için hazırlandı.
141. Seçili panellerin aynı yatay sırada olup olmadığı doğrulanır hale getirildi.
142. Seçili panellerin birbirine bitişik olup olmadığı doğrulanır hale getirildi.
143. Aralıklı seçimlerde birleşik görsel uygulamasının reddedilmesi sağlandı.
144. Farklı yatay sıralardan seçimlerde birleşik görsel uygulamasının reddedilmesi sağlandı.
145. Bitişik seçili panellerin toplam fiziksel genişliği hesaplanır hale getirildi.
146. Birleşik baskı alanı için yatay layout hesabı eklendi.
147. Görselin en-boy oranını bozmadan seçili toplam alanın içine ortalanması sağlandı.
148. `contain` mantığına benzer ölçekleme uygulanmaya başlandı.
149. Her panel için birleşik görselin sadece kendi payına düşen kırpım bölgesi hesaplanmaya başlandı.
150. Görselin paneller arasında görsel olarak devam etmesi sağlandı.
151. Maxima dikey profil ve raylarının görselin üzerinde görünmeye devam etmesi sağlandı.
152. Birleşik görsel placement bilgisi panel state'lerine yazılır hale getirildi.
153. Duvar rebuild sonrasında yatay birleşik görselin korunması sağlandı.
154. Yatay birleşik baskı alanı hesabı için ayrı yardımcı modül eklendi.
155. Yatay birleşik görsel layout hesapları için otomatik test eklendi.
156. Yatay birleşik görsel testleri başarılı geçti.
157. Yatay birleşik görsel özelliğinin Vite build'i başarılı geçti.

## CI / kalite kontrolleri

158. Düz duvar kompozisyon testleri GitHub Actions üzerinde çalıştırıldı.
159. Test çalışmadan build aşamasına geçilmemesi sağlandı.
160. State korunumu için regresyon testi eklendi.
161. Yatay birleşik görsel layout'u için regresyon testi eklendi.
162. Yapılan ana geliştirmeler sonrasında GitHub Actions `test + build` kontrolleri çalıştırıldı.
163. Son yatay birleşik görsel geliştirmesi test ve build aşamalarından başarıyla geçti.

## Şu anki durum

164. Düz Maxima duvarı oluşturulabiliyor.
165. Modüller 50 / 100 / 150 / 200 cm genişliklerle kullanılabiliyor.
166. Modüller soldaki sabit başlangıç noktasından sağa doğru ekleniyor.
167. Zemin 1 m × 1 m grid ile gerçek ölçeğe referans veriyor.
168. Her 50 cm yatay panel parçası ayrı seçilebiliyor.
169. Ctrl/Cmd ile çoklu panel seçilebiliyor.
170. Seçili paneller belirgin çerçeve ile gösteriliyor.
171. Panellere tekli veya toplu renk uygulanabiliyor.
172. Son kullanılan renk araçta kalıyor.
173. Görseller tarayıcıdaki arşive bir kez yüklenip tekrar kullanılabiliyor.
174. Panel renk ve görsel state'i rebuild sırasında korunuyor.
175. Aynı yatay sıradaki bitişik panellere tek birleşik görsel uygulanabiliyor.
176. Birleşik görsel, toplam seçili alana oranı bozulmadan ortalanıyor.
177. Görsel paneller arasında devam ediyor ve Maxima profilleri görselin üzerinde kalıyor.

## Sıradaki planlanan geliştirmeler

178. Dikey birleşik görsel uygulama.
179. Hem yatay hem dikey çoklu seçimi tek dikdörtgen baskı alanı olarak kullanma.
180. L stand yerleşimi.
181. U stand yerleşimi.
182. Sırt duvar stand yerleşimi.
183. Ada stand yerleşimi.
184. Depo / storage geometri ve kural sistemi.
185. Depo kapısı geometri ve yerleşim kuralları.
186. 2 raflı vitrin geometrisi.
187. 3 raflı vitrin geometrisi.
188. Separatör 50 geometrisi.
189. Separatör 100 geometrisi.
190. Düz panel slot'unu vitrin / separatör / kapı modülü ile değiştirme sistemi.
191. Fiziksel Maxima kurallarına göre geçersiz yerleşimleri engelleyen rule engine.
192. Daha sonra gerçek profil ölçülerine göre görsel model detayının iyileştirilmesi.
