# Module Behavior Standard

`src/moduleBehavior.js` is the single source of truth for editor behavior that differs by module type.

Every new module must use this contract instead of adding scattered type checks for placement behavior.

## Behavior record

The behavior contract currently covers:

- `placement`: `wall`, `free`, `wall-overlay`, or `top`
- `moveSnapCm`: movement/grid step in centimetres
- `rotationStepDeg`: R / Shift+R rotation step
- `defaultRotationDeg`: initial facing
- `allowSideInsert`: whether context left/right insertion is allowed
- `collision`: collision strategy
- `ghost`: placement preview strategy

These values are **not global constants**. Different module types may intentionally use different snap distances, rotation steps, placement modes, or collision strategies.

## Explicit catalog behavior contract

Every module type exposed through `MODULE_CATALOG` must have an explicit entry in the behavior registry, even when that type intentionally uses the standard wall behavior.

`hasExplicitModuleBehavior()` exposes whether a type is declared by the registry. `test/moduleBehaviorContract.test.js` compares all unique catalog module types against this contract, so adding a new catalog type without declaring its behavior fails CI.

This prevents a newly added catalog type from silently inheriting fallback behavior by accident.

## Defaults

Unknown or undeclared non-catalog module types still fall back to the default behavior defined in `src/moduleBehavior.js`.

The current default behavior is wall placement with the default movement/rotation/collision contract declared in code. Documentation should not duplicate those numeric defaults as a separate source of truth.

Fallback remains useful as a defensive runtime behavior, but catalog entries must not depend on it implicitly.

## Ghost contract

Every module has a ghost definition. Missing/unknown module types currently receive the central silhouette ghost:

```js
{
  kind: 'silhouette',
  renderer: 'module-silhouette',
  opacity: 0.38,
}
```

For modules that need a specific real-model or custom preview, declare the behavior in `TYPE_BEHAVIORS` rather than introducing a new module-type decision elsewhere.

`scene3d.js` must route ghost creation through `getModuleGhostBehavior()` and the declared renderer strategy.

## Placement contract

Placement mode expresses editor intent:

- `wall` — normal wall/segment placement
- `free` — free floor/fixture placement inside stand boundaries
- `wall-overlay` — wall-mounted overlay/accessory behavior that does not consume the normal wall chain like a structural wall module
- `top` — top-mounted accessory behavior

Exact geometric validation remains the responsibility of the placement/core layer.

## Collision contract

Behavior records declare the collision strategy, while the placement/core layer performs the actual geometric validation.

Current strategies include contracts such as:

- `segment`
- `footprint`
- `none`

Do not duplicate module-specific collision decisions in unrelated editor/controller code when they can be expressed through this registry.

## Rotation and snap contract

Do not assume all modules rotate in 90° steps or move on a 50 cm grid.

Call the behavior helpers instead of hard-coding module-specific values:

- `getModuleRotationStepDeg()`
- `getModuleDefaultRotationDeg()`
- `getModuleMoveSnapCm()`
- `getModuleBehavior()`

Descriptor-aware overrides are allowed when a family needs behavior based on module metadata such as shape or verified nominal size. Such overrides must stay centralized in `moduleBehavior.js` and be covered by regression tests.

## New module checklist

When adding a new module:

1. Add its catalog entry when applicable.
2. Declare its type explicitly in `src/moduleBehavior.js`, even if it intentionally uses standard wall behavior.
3. Avoid new scattered placement/type checks outside the registry unless the behavior cannot reasonably be represented by the contract.
4. Add a regression test for any non-default placement, snap, rotation, collision, or ghost behavior.
5. Keep renderer, state, catalog and BOM responsibilities separate from editor behavior.
6. Run `npm test` and `npm run build`.
