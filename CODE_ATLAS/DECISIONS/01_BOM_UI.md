# DECISION-01 — BOM UI

**KONU:** `resolveItemBom` çıktısı kullanıcıya production özelliği mi, DEV debug mi, yoksa resolver durup UI ertelensin mi?

## MEVCUT GERÇEK DURUM

Production orchestrasyon (`index.html` → `src/main.js`) BOM paneli yüklemez.

Kapı:

```
import.meta.env.DEV && URLSearchParams.has('rawBom')
  → dynamic import('./rawBomDebug.js')
    → sidebar `#raw-bom-debug` (“Üretim Listesi · Debug”)
      → renderItemBom(itemKey) → resolveItemBom(itemKey)
```

Vite production build’de `import.meta.env.DEV` false; `/?rawBom` no-op.

Resolver live: `src/itemBom.js` `resolveItemBom` → `composition.mode === 'recipe'` ise `expandRecipe`, değilse leaf `itemKey + quantity + unit`. GitNexus: production process yalnız `renderItemBom`; unit test 9 dosya.

Kullanıcı UI bağlantısı: yok (sidebar panel yalnız DEV + query). Export/order/quote/maliyet consumer: `src/` yok. `ITEM_CONTRACT.md` §11 BOM ile fiyatlandırmayı ayrı tutar; fiyat sistemi yok.

E2E: `e2e/visible-ui-b.spec.mjs` varsayılan `/` → `#raw-bom-debug` count 0; `/?rawBom` panel görünür. Satır içeriği e2e’de yok. Unit BOM COVERED.

## NEDEN KARAR GEREKİYOR

Resolver ürün hesabı üretir; kullanıcı yüzeyi kapalı. Her BOM işi “kullanıcı görür mü?” sorusuna dönüyor. MA-011 e2e satır kapsamı bu karara bağlı.

---

## OPTION A — BOM yalnız developer/debug

**Ne yapılır?** `DEV && ?rawBom` kalır. Docs/contract “bilinçli DEV kapısı” yazar. Production UI açılmaz.

**Avantajları:** Mevcut runtime. `main.js` kapısı, change-gate bom+ui semantiği aynı. Kullanıcıya üretim listesi sızmaz.

**Dezavantajları:** Kullanıcı ITEM_CONTRACT “BOM sahibi” yüzeyini görmez. Resolver ile UX kopuk kalır.

**Runtime etkisi:** Yok.

**Backward compatibility:** Yok (persist/BOM schema değişmez).

**Test etkisi:** Mevcut unit durur. MA-011 kapanışı: DEV e2e’ye satır assert eklenebilir (ürün UI değil).

**Migration:** Hayır.

## OPTION B — BOM production UI

**Ne yapılır?** `main.js` DEV kapısı kalkar veya production’da panel/export. Sidebar veya ayrı yüzey. E2e satır assert production path.

**Avantajları:** Kullanıcı üretim listesini görür. Resolver ile UX hizası.

**Dezavantajları:** UI copy, seçim parse (`rawBomDebug` type+width → itemKey), change-contract `bom`+`ui`+browser E2E. Fiyat/quote hâlâ yok; “üretim listesi ≠ teklif”. `ITEM_CONTRACT` maliyet ayrımı korunmalı.

**Runtime etkisi:** Production bundle `rawBomDebug` (veya eşdeğeri) yükler. Sidebar her kullanıcıda.

**Backward compatibility:** Proje blob’una BOM yazılmaz (bugün de yazılmıyor). UI-only.

**Test etkisi:** `visible-ui-b` varsayılan giriş beklentisi değişir; production e2e satır.

**Migration:** Persist yok. Kullanıcı eğitimi / kopya.

## OPTION C — Resolver korunur, kullanıcı UI ertelenir

**Ne yapılır?** Kod yolu A ile aynı (`DEV && ?rawBom`). Fark: ürün kararı “şimdilik UI yok, resolver canonical kalsın; production UI ayrı epic”. Docs bunu açık yazar.

**Avantajları:** A gibi sıfır runtime. B’yi kilitlemez. MA-001 “unfinished” değil “ertelenmiş ürün” olur.

**Dezavantajları:** A ile kod özdeş; yalnız yönetişim metni. Kararsızlık A’ya kayabilir.

**Runtime / compatibility / migration:** A ile aynı.

**Test etkisi:** A gibi; MA-011 DEV satır assert ile daraltılabilir.

## DO NOTHING

Bugünkü `DEV && ?rawBom` durur. Risk: her BOM PR’ında ürün tartışması. Teknik borç: resolver–UI kopukluğu belgelenmez; MA-001/MA-011 açık kalır.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | A ve C (kod özdeş; C metin) |
| En az migration | A / C |
| En az regression | A / C (production UI yok) |
| En temiz uzun vadeli model | B (kullanıcı yüzeyi resolver ile aynı ürün) veya C+sonra B (ertelenmiş B) |

Blok: MA-001, MA-011. WP-04.
