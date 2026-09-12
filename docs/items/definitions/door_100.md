# door_100 — Item Contract Definition

## Canonical identity

- `itemKey`: `door_100`
- `name`: `Depo Kapısı 100`
- `type`: `door`
- `unit`: `adet`
- yapı: **Bileşik Item**
- parametrik: relationship/recipe variant açısından evet; nominal ürün genişliği sabit 100 cm

Eski uppercase katalog kimliği kaldırılmıştır. Yeni runtime/catalog/state kimliği `door_100`dur.

## Canonical intrinsic/default properties

Bugün parent Item için doğrulanmış ürün ölçüsü:

```text
widthCm = 100
```

Parent kapı kümesine material veya `defaultColor` eklenmez; küme farklı malzemeli child Item'lardan oluşur. Paylaşılan stand yüksekliği/render derinliği de doğrulanmış parent ürün property’si olarak yeniden tanımlanmaz.

## Canonical composition — base

`door_100.composition` mevcut `door:100` recipe’sine bağlanır. Miktarların tek source-of-truth'u `src/moduleRecipes.js`dir:

```text
profile_91            ×1
upright_346_5         ×2
panel_98              ×3
connector_start       ×2
connector_single      ×5
door_leaf_100         ×1
```

Child miktarları `door_100` Item kartında ikinci kez kopyalanmaz.

## Canonical composition — inner corner

Doğrulanmış relationship-derived ürün kuralı şöyledir:

```text
profile_91            ×1
upright_346_5         ×2
panel_corner_92       ×3
connector_start       ×2
connector_single      ×3
connector_corner      ×2
door_leaf_100         ×1
```

Base → inner-corner dönüşümü:

```text
panel_98 ×3          → panel_corner_92 ×3
connector_single ×5  → connector_single ×3 + connector_corner ×2
connector_start ×2   → değişmez
```

Bu fark `src/moduleRecipes.js` içindeki `door:100` variant metadata'sında tutulur. Unchanged kalemler ikinci kez tam recipe olarak kopyalanmaz; base recipe'den korunur. Böylece door corner BOM için ikinci hardcoded business source-of-truth yaratılmaz.

## Recipe variant API

Canonical expanded recipe:

```js
getExpandedModuleRecipe('door', 100, { panelVariant: 'inner-corner' })
```

Canonical recursive Item BOM:

```js
resolveItemBom('door_100', 1, { panelVariant: 'inner-corner' })
```

Bu çağrı inner-corner recipe'yi terminal Item'lara kadar recursive açar. Base çağrı `resolveItemBom('door_100')` mevcut düz recipe'yi aynen korur.

`panelVariant` relationship sonucunun recipe/BOM katmanına taşınan context'idir. Runtime placement/relationship motorunun gerçek bir inner-corner ilişkisini bu context'e otomatik dönüştürmesi ayrı relationship integration sorumluluğudur; renderer veya UI tahmini BOM source-of-truth'u olamaz.

## Recursive BOM

`src/itemBom.js` canonical Item'ı expanded recipe üzerinden child Item'lara açar ve bileşik child Item varsa aynı işlemi recursive sürdürür. Nihai her satır canonical `itemKey`, `quantity` ve child Item'ın `unit` değerini taşır.

Caller recipe options yalnız ilgili root composite Item'ın recipe çözümüne uygulanır; child Item'lara körlemesine sızdırılmaz. Child composite varsa kendi canonical composition options'ı ile çözülür.

## Factory / state / persistence

`createDoorModuleState()` parent Item'ı `getItem('door_100')` üzerinden çözer ve proje instance'ına şu canonical identity'yi bağlar:

```text
id         = module-<instance>
itemKey    = door_100
type       = door
widthCm    = 100
```

Kapı kanadı child state'i ayrı canonical Item kimliğini korur:

```text
surface.itemKey = door_leaf_100
```

Renk/görsel override'ları `door_leaf_100` surface state'inde kalır. Parent placement ve nested state proje snapshot'ı içinde saklanır.

## Behavior / context menu / interaction

Parent `door_100`, `type=door` olduğu için mevcut `WALL_BEHAVIOR` contract'ını kullanır:

- wall placement,
- 50 cm move snap,
- 90° rotation,
- segment collision,
- standard magnetic snap,
- side insert,
- wall-capacity participation,
- module silhouette ghost.

Bu davranışlar Item migration sırasında yeniden yazılmaz. Context menu parent module davranışını sürdürür. Kapı kanadı `selectionMode=module` olduğu için panel-only glass/Lightbox/Mesh komutlarını açmaz; üst `panel_98`/`panel_corner_92` üretim kimlikleri renderer state'inin ikinci BOM kaynağı yapılmaz.

## Renderer boundary

Renderer `type=door` üzerinden mevcut procedural door renderer'ını kullanır. `door_leaf_100` renk/görsel capability’sini kendi Item contract'ından tüketmeye devam eder. Parent Item'ın composition/BOM gerçeği renderer mesh'inden türetilmez.

## Legacy removal

Eski uppercase katalog kimliği için alias veya compatibility table tutulmaz. Catalog, contract, state, E2E ve aktif Item dokümanları yalnız `door_100` kullanır. Tarihsel audit evidence dosyaları migration runtime kaynağı değildir ve bu Item turunda audit remediation yapılmaz.
