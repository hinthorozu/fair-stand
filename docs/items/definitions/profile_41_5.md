# profile_41_5 — Item Contract Definition

## 1. Kanonik kimlik
- `itemKey`: `profile_41_5`
- `name`: `Profil 41,5 cm`
- `type`: `profile`
- `unit`: `adet`
- structure: Tekil Item
- parametric: hayır

## 2. Kanonik ürüne özgü özellikler
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
`lengthCm`, `thicknessCm`, `material` ve `defaultColor` kanonik product/default property'leridir; owner `src/productionParts.js`dir. Project/runtime ezme açık bir karar mekanizmasıyla uygulanabilir ve kanonik değeri değiştirmez. `src/theme.js`/`scene3d.js` specialized renderer ezme kullanabilir.

## 3. Oluşturma / state / kalıcılık
Bağımsız proje örneği oluşturucu, mutable leaf state veya persisted profile örnek yoktur: **UYGULANMIYOR**. Parent module contract'ı korunur.

## 4. Davranış / etkileşim
Yerleşim, move, rotation, snap, collision, selection, drag, context-menu, delete ve duplicate leaf production profile için **UYGULANMIYOR**; parent module/type behavior sahibidir.

## 5. BOM / composition
Tekil production Item; 14 doğrulanmış parent recipe (wall/separator/counter/L-counter/base/base-wall). Recipe identity kanonik `itemKey` kullanır, quantity parent recipe sahibidir, expansion üstveriyi `getProductionItem()` üzerinden çözer.

## 6. Renderer sınırı
Production ölçü ve üstveri business tek kaynak'tur; prosedürel renderer production profile mesh identity'sine zorla bağlanmaz. `defaultColor=0xd0d3d4` kanonik default; mevcut `ALUMINUM_PROFILE_COLOR='#D0D3D4'` render ezme olarak kalabilir.

## 7. Regresyon sözleşmesi
Regression `itemKey`, `type`, `unit`, `41.5 × 8 cm`, `material='alüminyum'`, `defaultColor=0xd0d3d4`, 14 parent recipe eşyapı ve kanonik expansion'ı korur.

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
