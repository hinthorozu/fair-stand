# Module Behavior Standard

`src/moduleBehavior.js` is the single source of truth for editor behavior that differs by module type.

Every new module must use this contract instead of adding scattered type checks for placement behavior. The behavior record covers:

- `placement`: `wall`, `free`, or `top`
- `moveSnapCm`: movement/grid step in centimetres
- `rotationStepDeg`: R / Shift+R rotation step
- `defaultRotationDeg`: initial facing
- `allowSideInsert`: whether context left/right insertion is allowed
- `collision`: collision strategy
- `ghost`: placement preview strategy

## Ghost contract

Every module has a ghost definition. Missing/unknown module types automatically receive the safe proxy ghost:

```js
{ kind: 'proxy', renderer: 'proxy', opacity: 0.30 }
```

For modules that need a real model or composed preview, declare it in `TYPE_BEHAVIORS`:

```js
ghost: {
  kind: 'real-model', // or 'custom'
  renderer: 'bar-stool',
  opacity: 0.38,
}
```

`scene3d.js` must route ghost creation through `getModuleGhostBehavior()` and the declared `renderer`. Do not introduce a new module-type decision for choosing a ghost outside this registry.

When adding a new module, add/verify its behavior contract and a regression test in the same change.
