# DECISION-08 — Connector BOM API

**KONU:** `getConnectorItemKey` / `resolveConnectorBom` product surface mi, test helper mı, yoksa `resolveItemBom`’a mı bağlansın?

## MEVCUT GERÇEK DURUM

**Data (ACTIVE_RUNTIME):** 4 Item `connector_start|single|double|corner`, `type: 'connector'`, `connectorType`, `unit: 'adet'`. Recipe `composition.items` **doğrudan `itemKey`** taşır (`desk_banko_*` vb.). `expandRecipe` / `resolveItemBom` bu itemKey’leri leaf satır yapar. `moduleRecipes.js` `getConnectorItemKey` çağırmaz.

**API (TEST_ONLY):** `src/items.js` `getConnectorItemKey(connectorType)`, `resolveConnectorBom(requirements)` — miktarı çağıran verir; renderer’dan tahmin yok (dosya yorumu).

**Consumer:** `test/connectorBom.test.js` + kendi dosya. GitNexus: 2 direct, 0 process, LOW.

**UI / export / order / quote:** yok.

**Product surface:** Connector **Item’ları** BOM’da vardır (recipe child). **API** kullanıcı/BOM UI yüzeyi değil.

## NEDEN KARAR GEREKİYOR

İkinci giriş: type→key map vs recipe itemKey. Hangisi canonical lookup?

---

## OPTION A — API’yi `resolveItemBom` / expand kullansın

**Ne yapılır?** Recipe satırları `connectorType` veya API üzerinden çözülür.

**Avantajları:** Tek lookup. `connectorType` data ile API aynı yol.

**Dezavantajları:** İkinci indirection. Recipe zaten itemKey. Yanlış type production BOM’u değiştirir. `expandRecipe` dokunuşu (WP-05’dde yasak sınıftı; bu karar açarsa ayrı tur).

**Runtime:** BOM satır kimliği.

**Compatibility:** Miktar aynı kalmalı; itemKey sapması görünür.

**Test:** connectorBom + tüm recipe/BOM contract.

**Migration:** Recipe şekli değişirse Item master. Yüksek dikkat; miktar uydurma yasağı.

## OPTION B — API test helper / sil

**Ne yapılır?** Docs: TEST_ONLY. Veya API’yi test dosyasına taşı/sil; data `composition.items` canonical.

**Avantajları:** Tek BOM yolu (`resolveItemBom`). Dead API temizliği.

**Dezavantajları:** `connectorBom.test.js` rewrite. `connectorType` alanı Item’da durur (identity); yalnız lookup fonksiyonu kalkar.

**Runtime:** 0 (API zaten P’de yok).

**Compatibility:** Yok.

**Test:** 1 dosya.

**Migration:** hayır.

## OPTION C — API dursun, product değil (status quo belgelenir)

**Ne yapılır?** Kod aynı. “BOM data = recipe itemKey; API harici type→key, production çağırmaz.”

**Avantajları:** 0 patch. Test helper kalır.

**Dezavantajları:** İki giriş görünür; ajan API’yi runtime sanır.

**Runtime / migration:** Yok.

## DO NOTHING

C ile kod özdeş. MA-013 açık.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | C / DO NOTHING |
| En az migration | C / B (B küçük test) |
| En az regression | C (B API silme test-only) |
| En temiz uzun vadeli model | B (tek BOM yolu) veya A (type map = resolver) |

Blok: MA-013. WP-06. Product surface: **Item data evet, API hayır.**
