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

## Dikdörtgen blok seçim

193. Serbest Ctrl/Cmd panel toggle seçimi, dikdörtgen blok seçim modeline dönüştürüldü.
194. Normal tıklanan panel seçim başlangıç / anchor noktası olarak kullanılmaya başlandı.
195. Ctrl/Cmd + tıklanan ikinci panel seçim bloğunun karşı köşesi olarak kullanılmaya başlandı.
196. İki köşe arasındaki tüm panel hücrelerinin otomatik seçilmesi sağlandı.
197. `1 × N` yatay blok seçimleri desteklendi.
198. `N × 1` dikey blok seçimleri desteklendi.
199. `N × M` dikdörtgen blok seçimleri desteklendi.
200. `10 × 7` gibi büyük blokların iki tıklama ile seçilebilmesi sağlandı.
201. Farklı genişlikteki 50 / 100 / 150 / 200 cm modüller arasında dikdörtgen seçim desteklendi.
202. L, zikzak, boşluklu veya eksik hücreli seçim state'lerinin oluşması engellendi.
203. Seçim alanında eksik hücre varsa dikdörtgen seçim doğrulamasının reddetmesi sağlandı.
204. Seçim ölçüsü arayüzde `kolon × sıra` ve toplam panel sayısı olarak gösterilmeye başlandı.
205. Duvar rebuild sırasında seçim anchor kimliğinin mümkün olduğunda korunması sağlandı.
206. Dikdörtgen seçim hesabı için `rectSelection.js` yardımcı modülü eklendi.
207. `3 × 2`, `1 × 7` ve `10 × 7` senaryoları için otomatik testler eklendi.
208. Eksik hücreli dikdörtgen seçim için negatif regresyon testi eklendi.
209. Dikdörtgen seçim değişiklikleri GitHub Actions test + Vite build kontrolünden başarıyla geçti.

## Dikdörtgen birleşik görsel ve panel bazlı renk override

210. Birleşik görsel uygulaması yatay tek sıra sınırından çıkarıldı.
211. `rectImageLayout.js` yardımcı modülü eklendi.
212. `N × M` dikdörtgen seçimlerin tek baskı yüzeyi olarak hesaplanması sağlandı.
213. `3 × 2`, `3 × 3`, `1 × 7`, `10 × 7` gibi blokların görsel uygulaması desteklendi.
214. Farklı genişlikteki modüllerin aynı baskı bloğu içinde fiziksel genişliklerine göre pay alması sağlandı.
215. Dikdörtgen bloğun toplam fiziksel genişliği ve toplam fiziksel yüksekliği hesaplanır hale getirildi.
216. Her seçili panel için görselin yatay kırpım başlangıcı ve genişlik oranı hesaplandı.
217. Her seçili panel için görselin dikey kırpım başlangıcı ve yükseklik oranı hesaplandı.
218. Görselin seçili dikdörtgen alanın tamamına en-boy oranı bozulmadan `contain` mantığıyla ortalanması sağlandı.
219. Panel state'ine `rect-group` texture modu eklendi.
220. `regionStartX`, `regionStartY`, `regionWidth` ve `regionHeight` değerleri panel bazında state'e yazılır hale getirildi.
221. Duvar rebuild sonrasında `rect-group` görsel state'inin tekrar yüklenmesi sağlandı.
222. Önceki `horizontal-group` state'leri geriye dönük okunmaya devam edecek şekilde korundu.
223. Görselli bir panel seçilip renk uygulandığında artık kullanıcının ayrıca `Görseli kaldır` demesi gerekmiyor.
224. Renk uygulaması seçili paneldeki image mapping'i otomatik kaldırıp panel rengini görünür hale getiriyor.
225. Bir `3 × 3` görsel grubunda yalnızca sağ alt panel kırmızı yapılırsa diğer 8 panelin görsel mapping state'i korunuyor.
226. Panel bazlı renk override davranışı için `applyColorOverride` state fonksiyonu eklendi.
227. Renk override sonrası yalnızca hedef panelin `imageAssetId` değerinin temizlendiğini doğrulayan regresyon testi eklendi.
228. Dikdörtgen görsel layout'u için karışık sütun genişlikli `3 × 2` otomatik testi eklendi.
229. Tek sütunda `1 × 7` dikey görsel layout testi eklendi.
230. L şeklinde / eksik hücreli görsel grubunun reddedildiğini doğrulayan test eklendi.
231. Sütunlar arasında boşluk bulunan görsel grubunun reddedildiğini doğrulayan test eklendi.
232. Arayüzde `Görseli uygula` artık yatay-only fonksiyon yerine genel dikdörtgen görsel fonksiyonunu kullanıyor.
233. Dikdörtgen görsel ve panel bazlı renk override değişiklikleri GitHub Actions test + Vite build kontrolünden başarıyla geçti.

## Sahne güvenliği, dinamik zemin ve kamera navigasyonu

234. `Oluştur` komutu çalıştırılırken sahnede mevcut duvar varsa kullanıcıdan onay istenmeye başlandı.
235. Yeni duvar oluşturma uyarısı iptal edilirse mevcut panel renkleri, görselleri ve düzenlemeleri korunur hale getirildi.
236. Yeni duvar oluşturma onaylanırsa eski tasarım state'i taşınmadan sıfırdan yeni modül state'leri üretilmesi sağlandı.
237. `Duvarı temizle` komutu sahne doluyken kullanıcıdan onay ister hale getirildi.
238. Temizleme uyarısı iptal edilirse sahnenin değişmemesi sağlandı; sahne zaten boşsa gereksiz uyarı gösterilmemesi eklendi.
239. Uzun duvarlarda sabit 30 metrelik zemin sınırını kaldırmak için `groundLayout.js` eklendi.
240. Zemin başlangıç boyutu 30 metre olarak korundu.
241. Duvar uzadıkça zemin ve grid'in 10 metrelik adımlarla otomatik genişlemesi sağlandı.
242. Grid büyürken her karenin ölçüsünün sürekli 1 m × 1 m kalması sağlandı.
243. Zemin plane'i ile GridHelper aynı dinamik ölçüye bağlı hale getirildi.
244. Zemin, duvarın başlangıç tarafında çalışma payı bırakıp sağ tarafa doğru duvarla birlikte genişleyecek şekilde konumlandırıldı.
245. Duvar temizlendiğinde zemin grid'inin varsayılan boyuta dönmesi sağlandı.
246. Uzun duvarlarda uzak kamera kullanımını desteklemek için kamera far plane ve OrbitControls maksimum mesafesi artırıldı.
247. OrbitControls pan özelliği açık ve aktif hale getirildi.
248. Sağ mouse tuşuna basılı sürükleme `pan` olarak sabitlendi.
249. Sol mouse sürükleme döndürme, tekerlek / orta mouse zoom davranışı olarak korundu.
250. Sağ tuşla pan yapılırken panel seçim raycaster'ının yanlışlıkla seçim yapmaması için seçim yalnızca sol mouse tuşuna sınırlandı.
251. Viewport yardım çubuğuna `Sağ sürükle: pan` bilgisi eklendi.
252. Dinamik zemin boyutu, 1 metrelik grid hücresi ve uzun duvar büyümesi için otomatik testler eklendi.
253. Dinamik zemin ve pan entegrasyonu GitHub Actions test + Vite build kontrolünden başarıyla geçti.
254. Pan kontrolü kullanıcı tercihine göre sağ mouse tuşundan orta mouse / tekerlek tuşuna taşındı.
255. Orta mouse basılı sürükleme `pan`, tekerlek çevirme `zoom`, sol mouse sürükleme `rotate` olarak sabitlendi.
256. Sağ mouse tuşu kamera navigasyonundan çıkarıldı.
257. Viewport yardım metni orta mouse pan davranışını gösterecek şekilde güncellendi.
258. Orta mouse pan değişikliği GitHub Actions test + Vite build kontrolünden başarıyla geçti.

## ViewCube / kamera yön küpü

259. Fusion benzeri kamera yönlendirme aracı için `viewCube.js` eklendi.
260. ViewCube sağ üstte sahneden bağımsız küçük bir Three.js renderer olarak oluşturuldu.
261. ViewCube ana kameranın yönünü gerçek zamanlı takip eder hale getirildi.
262. `FRONT`, `BACK`, `LEFT`, `RIGHT`, `TOP` ve `BOTTOM` yüz etiketları eklendi.
263. Küp yüzüne tıklanınca kameranın ilgili ortografik yöne yakın perspektif görünüşe animasyonla geçmesi sağlandı.
264. Küp kenar ve köşelerine tıklanınca iki veya üç eksenli izometrik / diyagonal görünüşler desteklenmeye başlandı.
265. ViewCube üzerine basılı sürükleme ile ana kameranın döndürülebilmesi sağlandı.
266. ViewCube üzerindeyken mouse tekerleği ile ana kameranın zoom yapması desteklendi.
267. ViewCube altında izometrik görünüşe döndüren home butonu eklendi.
268. ViewCube kamera geçişlerinde mevcut pan hedefini ve zoom mesafesini koruyacak şekilde bağlandı.
269. ViewCube için responsive sağ üst overlay stili eklendi.
270. ViewCube entegrasyonu GitHub Actions test + Vite build kontrolünden başarıyla geçti.
271. ViewCube masaüstünde yaklaşık üçte bir oranında küçültüldü; mobil görünüm, home butonu, padding ve gölge ölçüleri de yeni kompakt boyuta göre ayarlandı.
272. Uygulamanın ilk sahne açılışı ViewCube `⌂` Home yönü ile aynı izometrik kamera açısına alındı.
273. 350 cm gibi standart duvarlarda ilk kamera mesafesi minimum yaklaşık 9 metreye çekilerek sahnenin daha ferah görünmesi sağlandı.
274. Uzun duvarlarda başlangıç kamera mesafesinin mevcut otomatik kadraja oranlı büyümesi sağlandı; sabit 9 metreye kilitlenmedi.
275. Başlangıç Home kadrajının duvar kurulmadan önce değil, ilk gerçek animation frame'de duvar oluşturulduktan sonra uygulanması sağlandı.
276. İlk Home kadrajı değişikliği GitHub Actions test + Vite build kontrolünden başarıyla geçti.

## Kamera reset ayrımı ve modül sağ tık menüsü

277. `Oluştur` komutu yeni duvar kurulduktan sonra kamerayı Home / default görünüme döndürecek şekilde sabitlendi.
278. `Duvarı temizle` komutu boş sahneye geçerken kamerayı Home / default görünüme döndürecek şekilde sabitlendi.
279. Sol panelden 50 / 100 / 150 / 200 cm modül eklenirken mevcut kamera pan, zoom ve bakış açısının korunması sağlandı.
280. Modül düzenleme işlemleri için `moduleContextMenu.js` eklendi.
281. Three.js sahnesinde herhangi bir modülün üzerine sağ tıklanınca özel işlem menüsü açılması sağlandı.
282. Sağ tık raycast'i yalnızca panel yüzeyine değil modül grubunun tamamına bağlandı; profil ve ray üzerinden de ilgili modül bulunabilir hale getirildi.
283. Sağ tık menüsüne `Sil` komutu eklendi ve aktif hale getirildi.
284. `Sil` komutunun hedef modülü kaldırıp kamerayı mevcut konumunda tutarak sahneyi rebuild etmesi sağlandı.
285. Sağ tık menüsüne `Çoğalt Sağ Tarafa` komutu eklendi ve aktif hale getirildi.
286. Sağ tık menüsüne `Çoğalt Sol Tarafa` komutu eklendi ve aktif hale getirildi.
287. Modül çoğaltılırken kaynak modülün renk, görsel ve diğer tasarım state'inin kopyalanması sağlandı.
288. Çoğaltılan modül için yeni benzersiz module ID ve yeni benzersiz panel / surface ID'leri üretilmesi sağlandı.
289. Sağ tık menüsüne `Ekle Sağ Tarafa` ve `Ekle Sol Tarafa` komutları eklendi.
290. `Ekle Sağ Tarafa` ve `Ekle Sol Tarafa` tıklandığında gelecekte genel modül kataloğunu gösterecek popup kabuğu açılır hale getirildi; gerçek modül seçimi sonraki adıma bırakıldı.
291. Düz panel, vitrin, separatör ve depo kapısının yerleşim sistemi açısından tek ve bölünmez bir `module` nesnesi olarak ele alınacağı mimari netleştirildi.
292. Modül çoğaltma state'inin bağımsız kimlikler üretip tasarım verisini koruduğunu doğrulayan regresyon testi eklendi.
293. Sağ tık modül menüsü ve çoğaltma değişiklikleri GitHub Actions test + Vite build kontrolünden başarıyla geçti.

## Görsel modül kataloğu

294. Sol paneldeki ayrı 50 / 100 / 150 / 200 cm modül butonları tek `Modül Ekle` butonunda birleştirildi.
295. `Modül Ekle` butonu ortak modül katalog popup'ını açar hale getirildi.
296. Katalog ilk aşamada `Düz Panel 200`, `Düz Panel 150`, `Düz Panel 100` ve `Düz Panel 50` modülleriyle sınırlandı.
297. Her katalog kartına başlık ve modül genişliğini temsil eden görsel panel önizlemesi eklendi.
298. Tek tıklanan katalog kartının turuncu çerçeve ile aktif seçimi göstermesi sağlandı.
299. Popup altına `Vazgeç` ve `Ekle` aksiyonları eklendi; seçim yapılmadan `Ekle` pasif tutuldu.
300. Sol panelden açılan katalogda seçilen modülün doğrudan duvarın sonuna eklenmesi sağlandı.
301. Sağ tık `Ekle Sağ Tarafa` ve `Ekle Sol Tarafa` komutları aynı ortak katalog popup'ına bağlandı.
302. Sağ / sol yerleşim isteklerinde seçilen katalog modülünün hedef modülün ilgili tarafına eklenmesi sağlandı.
303. Katalog üzerinden modül eklenirken mevcut kamera pan, zoom ve bakış açısının korunması sağlandı.
304. Katalog kartına çift tıklanınca seçimin `Ekle` butonuna basmaya gerek kalmadan doğrudan eklenmesi sağlandı.
305. Tek tıklama yalnızca seçili kartı değiştirmeye devam ederken çift tıklama mevcut append / sağ / sol yerleşim bağlamını kullanarak ekleme yapar hale getirildi.

## HEX / RGB / CMYK renk editörü

306. Aktif renk alanının altına kalıcı ve düzenlenebilir HEX, RGB ve CMYK değer alanları eklendi.
307. HEX / RGB / CMYK dönüşümleri için `colorUtils.js` yardımcı modülü eklendi.
308. HEX alanından girilen rengin native renk picker, RGB ve CMYK alanlarına senkronize edilmesi sağlandı.
309. RGB alanları 0–255 aralığında düzenlenebilir hale getirildi ve değişikliklerin HEX, CMYK ve renk picker'a yansıması sağlandı.
310. CMYK alanları C / M / Y / K için %0–100 aralığında düzenlenebilir hale getirildi ve değişikliklerin RGB, HEX ve renk picker'a yansıması sağlandı.
311. Native renk picker üzerinden yapılan değişikliklerin HEX, RGB ve CMYK alanlarına anlık aktarılması sağlandı.
312. Renk editöründeki geçerli bir değer değişikliğinin seçili panel veya dikdörtgen panel bloğuna canlı uygulanması sağlandı.
313. CMYK değerleri kullanıcı tarafından doğrudan düzenlendiğinde girilen C / M / Y / K oranlarının RGB dönüşümü sonrasında yeniden dağıtılmadan korunması sağlandı.
314. HEX normalizasyonu, HEX↔RGB ve RGB↔CMYK dönüşümleri için otomatik testler eklendi.
315. HEX / RGB / CMYK renk editörü entegrasyonu GitHub Actions test + Vite build kontrolünden başarıyla geçti.

## Separatör modülleri

316. Maxima çerçeve derinliği belirsiz 10–11 cm ifadesinden çıkarılıp sabit `10 cm` olarak tanımlandı.
317. `Separatör 50` ve `Separatör 100` için ayrı renk-only modül state'leri eklendi.
318. İki separatörde de aynı düşey ritmi koruyan 36 adet yatay çıta kullanıldı.
319. Separatör çıtalarının ön görünüş yüksekliği 3,5 cm, net aralığı yaklaşık 6 cm ve derinliği çerçeve ile aynı 10 cm yapıldı.
320. 50 ve 100 cm separatörlerde çıta adedi aynı tutulup yalnızca çıta uzunluğu modül genişliğine göre değişir hale getirildi.
321. Separatörlere görsel atanması engellendi; modül tek parça seçilip yalnızca çıta rengi değiştirilebilir hale getirildi.
322. Separatör 50 / 100 katalog kartları ve görsel önizlemeleri ortak modül popup'ına eklendi.
323. Separatörler sağ / sol ekleme, silme ve tasarım state'ini koruyarak çoğaltma akışına bağlandı.
324. Separatör state ve çoğaltma davranışları otomatik testlerle doğrulandı.
325. Separatör entegrasyonu GitHub Actions test + Vite build kontrolünden başarıyla geçti.

## Görsel Doldur / Sığdır

326. Büyük `Görseli uygula` ve `Görseli kaldır` butonları kaldırılıp kompakt `Doldur | Sığdır | Kaldır` aksiyonları eklendi.
327. `Doldur` için gerçek `cover`, `Sığdır` için gerçek `contain` yerleşim hesabını yapan `imageFit.js` yardımcı modülü eklendi.
328. `Doldur` modunda seçili baskı alanının tamamının kaplanması ve taşan görsel bölümünün merkezden kırpılması sağlandı.
329. `Sığdır` modunda görselin tamamının en-boy oranı bozulmadan seçili baskı alanı içinde gösterilmesi sağlandı.
330. Tek panel ve dikdörtgen birleşik görsel uygulamalarında `cover / contain` seçiminin aynı motoru kullanması sağlandı.
331. Seçilen görsel yerleşim modunun panel state'ine yazılması ve rebuild sonrasında korunması sağlandı.
332. `cover / contain` hesapları için otomatik testler eklendi.
333. Görsel yerleşim değişiklikleri GitHub Actions test + Vite build kontrolünden başarıyla geçti.

## 2 ve 3 gözlü vitrin modülleri

334. Katalogdaki vitrin isimleri kullanıcı terminolojisine göre `3 Gözlü Vitrin 100` ve `2 Gözlü Vitrin 100` olarak güncellendi.
335. `showcase-3` ve `showcase-2` için bağımsız, 100 cm genişlikli ve renk-only modül state'leri eklendi.
336. 3 gözlü vitrin 2 cam rafla üç hacim, 2 gözlü vitrin 1 cam rafla iki hacim oluşturacak şekilde modellendi.
337. Vitrinler 350 cm Maxima dış çerçeve ve standart 50 cm yatay sistem ritmi içine yerleştirildi.
338. Referans görsele uygun olarak vitrin dışındaki kapalı bölümlerde koyu dolgu panelleri bırakıldı.
339. Vitrin hacmi öne doğru 36 cm derinlikte; arka panel, şeffaf yan yüzeyler, ön profil çerçevesi ve hacimli cam raflarla modellendi.
340. Cam raflara hafif yeşil / şeffaf malzeme uygulanarak kamerayı çevirince vitrin derinliğinin okunması sağlandı.
341. Vitrin modülü tek parça seçilir hale getirildi; kapalı dolgu panellerine renk uygulanabilirken görsel ataması kapatıldı.
342. Vitrinler ortak katalog popup'ına görsel kartlarıyla eklendi ve append / sağ / sol ekleme akışına bağlandı.
343. Vitrinler mevcut sağ tık silme ve sağa / sola çoğaltma davranışlarını destekler hale getirildi.
344. Vitrin state'inin tip, renk ve bağımsız kimliklerini koruyan otomatik testler eklendi.
345. 2 / 3 gözlü vitrin entegrasyonu GitHub Actions test + Vite build kontrolünden başarıyla geçti.
