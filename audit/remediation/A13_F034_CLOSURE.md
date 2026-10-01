# A13 F-034 kapanışı

Bulgu: **F-034 — public varlık köken/lisans envanteri eksik**

Durum: **ACCEPTED_RISK** (Won’t Fix for current legacy assets)

`CLOSED` kullanılmaz. `audit/FINDINGS.md` bir bulguyu ancak uygulama, hedefli regresyon, tam test/build ve gerekli CI kanıtından sonra `CLOSED` sayar. Bu kayıt o kanıtı taşımaz.

## Kaynak

- Asıl metin: `audit/evidence/A13_STORAGE_ASSETS_REFERENCES.md` — “Bu denetim lisans ihlali iddia etmez.”
- Defter: `audit/FINDINGS.md` — önceki durum `OPEN / DECISION_REQUIRED`.
- Envanter: `docs/assets/PUBLIC_MODEL_ATTRIBUTION.md`.
- Atıf dosyası olanlar: `coat_rack.glb`, `kettle.glb`, `eames_chair.glb`, `bar_chair.glb`.
- Atıf dosyası olmayan aktif GLB (9): `80s_avanti_mini_fridge.glb`, `plastic_trash_bin.glb`, `indoor_plants.glb`, `saksi_bitkili_100x30x30.glb`, `saksi_bitkili_150x30x30.glb`, `saksi_bitkili_200x30x30.glb`, `wall_separator_50_sarmasik.glb`, `wall_separator_100_sarmasik.glb`, `bej_koltuk_1_ciftli_2_tekli.glb`.

Bu dokuz dosyanın lisansı bu kayıtta unknown kalır. Yazar, kaynak URL, CC0 veya ticari kullanım izni yazılmaz.

## Gerekçe

Mevcut legacy 3D asset’lerin bir kısmında license/provenance metadata eksiktir. Bu boşluk mevcut ürün kapsamı için bilinen risk olarak kabul edilir. Bu turda geriye dönük metadata tamamlanmaz. Asset dosyası, model dosyası ve runtime davranışı değişmez.

Yeni asset eklemelerinde mevcut kural durur: `docs/assets/PUBLIC_MODEL_ATTRIBUTION.md` lisans metninin uydurulmayacağını yazar. Bu kapanış o kuralı gevşetmez.

F-043 (kök `LICENSE` yok) ayrı bulgudur ve açık kalır.

## Kapsam

- asset dosyası değişmedi
- model dosyası değişmedi
- runtime davranışı değişmedi
- test gevşetilmedi
- gate kapatılmadı
- provenance uydurulmadı
- bulgu silinmedi

## Kalan risk

Bazı legacy asset’ler eksik license/provenance kaydıyla durmaya devam edebilir.

## Kapı

`audit/` change-gate guarded yolu değildir. CI, F-034 açık kaldığı için fail etmez. `standards/quality/QUALITY_GATE_STANDARD.md` test baseline’ıdır; bu bulgu bir baseline satırı yapılmadı ve yeşil CI bahanesi değildir.
