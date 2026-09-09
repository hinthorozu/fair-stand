# door_leaf_100 — Item Contract Definition

## Canonical identity

- `itemKey`: `door_leaf_100`
- `name`: `Ahşap Kapı Kanadı 100 × 200 cm`
- `type`: `door-leaf`
- `unit`: `adet`
- yapı: tekil physical child Item
- parametrik: hayır

## Canonical intrinsic/default properties

```text
widthCm = 100
heightCm = 200
thicknessCm = 8
material = ahşap
defaultColor = 0xffffff
nominalModuleWidthCm = 100
```

Bu değerlerin product/default source-of-truth'u `PRODUCTION_PARTS.door_leaf_100` kaydıdır.

## Surface capability contract

`door-leaf` type capability kaynağı `src/itemCapabilities.js`dir:

```text
color    = true
image    = true
glass    = false
lightbox = false
mesh     = false
```

Kapı kanadı `panel` Item değildir. Panel-range selection veya panel-only glass/Lightbox/Mesh davranışına sokulmaz.

## State / override / persistence

Leaf bağımsız top-level project instance değildir; parent door module içinde child `surface` state'i taşır. Yeni state canonical Item kimliğiyle oluşturulur:

```text
surface.itemKey = door_leaf_100
surface.color = #ffffff
surface.imageAssetId = null
surface.imageTransform = canonical image transform default
```

`color`, `imageAssetId` ve `imageTransform` project/runtime override alanlarıdır ve save/load ile korunur. Eski persisted door surface state'leri restore sırasında `normalizeModuleItemState()` ile `door_leaf_100` child identity'sine bağlanır; mevcut kullanıcı renk/görsel override'ı korunur.

## Behavior / interaction ownership

Placement, move, rotation, snap, collision, ghost, side insert, delete ve duplicate top-level leaf davranışı değildir; parent `door` module `WALL_BEHAVIOR` zinciri sahibidir. Leaf surface tekil olarak renk/görsel düzenlemesi için seçilebilir. Sağ click parent module context menüsünü açar; special panel modes bu leaf için kapalıdır.

## BOM / relationship

`door_leaf_100` nihai fiziksel BOM Item'ıdır ve başka Item'lardan oluşmaz. Parent `door:100` recipe quantity sahibidir:

```text
door:100 → door_leaf_100 × 1 adet
```

Eski `door_100` production `partId` kimliği kaldırılmıştır; paralel ikinci leaf kimliği tutulmaz.

## Renderer boundary

Door renderer child `surface.itemKey` üzerinden canonical Item'ı ve `door-leaf` capability contract'ını çözer. Effective renk/görsel state'ten gelir. Procedural mesh'in stand frame içine fit edilen teknik ölçüsü canonical product dimensions'ın ikinci business source-of-truth'u değildir; specialized renderer temsilidir.

## Regression

`test/doorLeafItemContract.test.js`, `test/designState.test.js` ve `test/moduleRecipes.test.js` canonical properties, capability, default consumer, override/persistence migration, BOM identity/quantity ve renderer consumer bağlantısını korur.
