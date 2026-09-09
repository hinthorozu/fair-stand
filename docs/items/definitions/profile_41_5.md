# profile_41_5 — Item Contract Definition

## 1. Canonical identity
- `itemKey`: `profile_41_5`
- `name`: `Profil 41,5 cm`
- `type`: `profile`
- `unit`: `adet`
- structure: Tekil Item
- parametric: hayır

## 2. Canonical intrinsic properties
```js
{
  itemKey: 'profile_41_5',
  type: 'profile',
  unit: 'adet',
  dimensions: { lengthCm: 41.5, thicknessCm: 8 },
  material: 'alüminyum',
  defaultColor: 0xd0d3d4
}
```
`lengthCm`, `thicknessCm`, `material` ve `defaultColor` canonical product/default property'leridir; owner `src/productionParts.js`dir. Project/runtime override açık bir karar mekanizmasıyla uygulanabilir ve canonical değeri değiştirmez. `src/theme.js`/`scene3d.js` specialized renderer override kullanabilir.

## 3. Factory / state / persistence
Bağımsız project instance factory, mutable leaf state veya persisted profile instance yoktur: **UYGULANMIYOR**. Parent module contract'ı korunur.

## 4. Behavior / interaction
Placement, move, rotation, snap, collision, selection, drag, context-menu, delete ve duplicate leaf production profile için **UYGULANMIYOR**; parent module/type behavior sahibidir.

## 5. BOM / composition
Tekil production Item; 14 doğrulanmış parent recipe (wall/separator/counter/L-counter/base/base-wall). Recipe identity canonical `itemKey` kullanır, quantity parent recipe sahibidir, expansion metadata'yı `getProductionItem()` üzerinden çözer.

## 6. Renderer boundary
Production ölçü ve metadata business source-of-truth'tur; procedural renderer production profile mesh identity'sine zorla bağlanmaz. `defaultColor=0xd0d3d4` canonical default; mevcut `ALUMINUM_PROFILE_COLOR='#D0D3D4'` render override olarak kalabilir.

## 7. Regression contract
Regression `itemKey`, `type`, `unit`, `41.5 × 8 cm`, `material='alüminyum'`, `defaultColor=0xd0d3d4`, 14 parent recipe parity ve canonical expansion'ı korur.

## Sonuç
```text
canonical Item             TAMAM
intrinsic properties       TAMAM
material                   alüminyum
defaultColor               0xd0d3d4
recipe/BOM                 TAMAM
leaf state/persistence     UYGULANMIYOR
leaf behavior/interactions UYGULANMIYOR
renderer override boundary TAMAM
regression                 TAMAM
```
