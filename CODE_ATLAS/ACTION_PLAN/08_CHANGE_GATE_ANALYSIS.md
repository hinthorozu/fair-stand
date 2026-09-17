# 08 — Change gate analizi (MA-015)

## Parçalar

| Parça | Rol |
| --- | --- |
| `.github/change-contract.json` | İnsan beyanı; şu an id `item-composition-inner-corner` |
| `src/systemChangeContract.js` | Domain enum, `SOURCE_FILE_REQUIRED_DOMAINS`, schema validate |
| `scripts/verify-change-contract.mjs` | Diff + path-required domain + discovery |
| `scripts/change-impact-analysis.mjs` | Token/referans sweep |
| `.github/workflows/ci.yml` | `npm run contract:verify`; trigger yalnız `RefactorItem` |

## Ne yakalıyor

1. Guarded dosya değiştiyse contract dosyası da değişmeli.  
2. Diff’teki her guarded path için `requiredDomainsForFile` → impact `affected` olmalı.  
3. `src/` dosyaları map’te tam: `test/systemChangeGate.test.js` her src dosyasını `SOURCE_FILE_REQUIRED_DOMAINS` ile eşitler.  
4. Discovery’nin bulduğu file/test/doc/finding declared listede olmalı.  
5. Schema: tests affected, e2e kuralı, kind required domains.

`src/main.js` zorunlu domain’ler: architecture, catalog, behavior, state, placement, renderer, persistence, ui, composition, assets, storage, importExport.  
`src/scene3d.js`: renderer, state, placement, behavior, performance.  
`src/items.js`: architecture, catalog, bom.

## Mevcut contract sapması

Beyan:

- `behavior`: not-applicable  
- `placement`: not-applicable  
- `renderer`: not-applicable  
- `affectedFiles` içinde `src/main.js`, `src/scene3d.js`, silinen `scripts/patch-video-wall-*.cjs`

Bu beyan, **o dosyalar evaluate edilen diff’teyse** verify’ın `undeclaredRequiredDomains` dalında fail etmelidir. Cleanup turu `CHANGE_GATE_BASE=HEAD` ile dar pencere kullandı; Version2 birikmiş diff bu contract ile yeşil olmayabilir.

## CI penceresi — yanlış negatif

`ci.yml`:

```yaml
on:
  push:
    branches: [RefactorItem]
  pull_request:
    branches: [RefactorItem]
```

Push’ta verify `event.before..after` kullanır (o push’un dosyaları). Version2 birikmiş `main.js`/`scene3d.js` bu pencerede yoksa domain zorunluluğu **yeniden uygulanmaz**.

Version2’ye PR CI’da yok. Local default base Version2; CI default değil.

**Yanlış negatif: evet.** Birikmiş hub değişimi + dar contract + RefactorItem-only CI.

## Yanlış pozitif

Discovery fazla bağımlı dosya ister → `affectedFiles` şişer. Extra declared path fail değil (MA-031 stale cjs buna örnek). İnsan yükü artar, kaçırma azalır.

## Guarded vs gerçek yüzey

| Yüzey | Gate | Boşluk |
| --- | --- | --- |
| `src/**` | evet | yeni dosya map testiyle yakalanır |
| `test/` `tests/` `e2e/` | tests domain | semantik (TEST_SUPPORT vs prod) yok |
| Item sistemi | items.js bom+catalog+architecture | field unread yakalamaz |
| scene3d | renderer+… path kuralı | fonksiyon-içi façade yakalamaz |
| BOM UI | rawBomDebug bom+ui | DEV flag semantiği yok |
| Governance MD | map | tvConfig ghost yakalamaz |

## Regression riski

**Gerçek.** Runtime bug değil; süreç bug’ı: Version2’ye giden birikmiş renderer/behavior değişimi, mevcut contract + CI penceresiyle “kabul” görünebilir.

## Önerilen aksiyon (kod bu turda yok)

1. Evaluate base’i birikmiş hedef dal (Version2) yap veya her PR’da merge-base zorunlu kıl.  
2. Contract impact’ini o diff’teki path-required domain’lerle eşle.  
3. Stale `affectedFiles` (silinen cjs) temizle.  
4. `CHANGE_GATE_BASE=HEAD`’i dal kapısı sanma.
