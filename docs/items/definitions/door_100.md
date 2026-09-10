# door_100 — Item Contract Definition

## Canonical identity

- `itemKey`: `door_100`
- `name`: `Depo Kapısı 100`
- `type`: `door`
- `unit`: `adet`
- yapı: **Bileşik Item**
- parametrik: hayır

Eski uppercase katalog kimliği kaldırılmıştır. Yeni runtime/catalog/state kimliği `door_100`dur.

## Canonical intrinsic/default properties

Bugün parent Item için doğrulanmış ürün ölçüsü:

```text
widthCm = 100
```

Parent kapı kümesine material veya `defaultColor` eklenmez; küme farklı malzemeli child Item'lardan oluşur. Paylaşılan stand yüksekliği/render derinliği de doğrulanmış parent ürün property’si olarak yeniden tanımlanmaz.

## Canonical composition

`door_100.composition` mevcut `door:100` recipe’sine bağlanır. Miktarların tek source-of-truth'u `src/moduleRecipes.js`dir:

```text
profile_91       ×1
upright_346_5    ×2
panel_98         ×3
connector_start  ×2
connector_single ×5
door_leaf_100    ×1
```

Child miktarları `door_100` Item kartında ikinci kez kopyalanmaz.

## Recursive BOM

`src/itemBom.js` canonical Item'ı recipe üzerinden child Item'lara açar ve bileşik child Item varsa aynı işlemi recursive sürdürür. `door_100` bugün yukarıdaki altı leaf Item'a çözülür. Nihai her satır canonical `itemKey`, `quantity` ve child Item'ın `unit` değerini taşır.

## Factory / state / persistence

`createDoorModuleState()` parent Item'ı `getItem('door_100')` üzerinden çözer ve proje instance'ına şu canonical identity'yi bağlar:

```text
id         = module-<instance>
itemKey    = door_100
type       = door
catalogKey = door_100   // generic catalog routing field; canonical key ile aynı değer
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

Bu davranışlar Item migration sırasında yeniden yazılmaz. Context menu parent module davranışını sürdürür. Kapı kanadı `selectionMode=module` olduğu için panel-only glass/Lightbox/Mesh komutlarını açmaz; üst `panel_98` yüzeyleri mevcut panel davranışını sürdürür.

## Renderer boundary

Renderer `type=door` üzerinden mevcut procedural door renderer'ını kullanır. `door_leaf_100` renk/görsel capability’sini kendi Item contract'ından tüketmeye devam eder. Parent Item'ın composition/BOM gerçeği renderer mesh'inden türetilmez.

## Legacy removal

Eski uppercase katalog kimliği için alias veya compatibility table tutulmaz. Catalog, contract, state, E2E ve aktif Item dokümanları yalnız `door_100` kullanır. Tarihsel audit evidence dosyaları migration runtime kaynağı değildir ve bu Item turunda audit remediation yapılmaz.
