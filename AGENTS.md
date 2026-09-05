# Fair Stand — Agent Instructions

Bu repository üzerinde çalışan insan veya AI agent için aşağıdaki kurallar zorunludur.

## Zorunlu okuma sırası

Her değişiklikten önce işin kapsamına göre aşağıdaki canonical belgeler okunur:

1. `SYSTEM_CHANGE_GATE.md`
2. `SYSTEM_IMPACT_SWEEP.md`
3. `SYSTEM_DEVELOPMENT_CONTRACT.md`
4. `PROJECT_RULES.md`
5. `ARCHITECTURE_RULES.md`
6. **`ITEM_CONTRACT.md`** — fiziksel ürün, zemin, malzeme, BOM, üretim, maliyet, katalog, runtime item/module, context-menu behavior veya item state ile ilgili her işte zorunludur.
7. `MODULE_BEHAVIOR_STANDARD.md` — type bazlı editor/runtime davranışı etkileniyorsa zorunludur.

## Item gate

Aksine açık bir ürün kararı yoksa BOM, üretim veya maliyet hesabına girebilen her fiziksel öğe `Item` kabul edilir.

Yeni bir ürün, zemin, malzeme, kombinasyon, runtime module veya üretilebilir öğe eklerken `ITEM_CONTRACT.md` okunmadan ve aşağıdaki alanlar karara bağlanmadan implementasyona başlanmaz:

- canonical `itemKey`,
- `type` / behavior family,
- canonical state/ölçü/parametreler,
- tekil/bileşik/parametrik yapı,
- BOM recipe/resolver,
- terminal BOM quantity + unit,
- project instance ayrımı,
- renderer/asset temsilinin business rule'dan ayrımı,
- persistence etkisi,
- regression/E2E kapsamı.

## Yasaklar

- Yeni fiziksel öğeyi yalnız catalog, renderer, GLB veya UI ekleyerek tamamlanmış saymak.
- BOM/maliyet kapsamındaki bir öğeyi Item contract dışında ayrı paralel model olarak eklemek.
- `itemKey` yerine label, model filename veya renderer node adını ürün kimliği yapmak.
- Item'a özel davranışı dağınık `if (itemKey === ...)` kontrolleriyle çoğaltmak.
- Aynı behavior ailesindeki varyantlar için gereksiz item-level override üretmek.
- BOM'u render/mesh/texture görünümünden türetmek.
- BOM miktarını unitsiz sayı olarak üretmek.
- BOM reçetesi ile fiyatlandırmayı aynı canonical kaynakta birleştirmek.

## Tamamlanma kuralı

`ITEM_CONTRACT.md` kapsamındaki bir değişiklik ancak Item identity/state/behavior/BOM/persistence/render/test etkileri birlikte değerlendirilip repository change gate ve CI zinciri başarılı olduğunda tamamlanmış sayılır.

Bu dosya repository-level giriş talimatıdır. Alt dizinde daha özel bir `AGENTS.md` yoksa bütün repository için geçerlidir.
