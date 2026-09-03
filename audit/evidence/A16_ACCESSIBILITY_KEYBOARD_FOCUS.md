# A16 — Accessibility / keyboard / focus audit

Baseline: ROG `e7647326668ab25c96f3a3139f0d855c03176325`
Mode: audit-first / fix-later. No runtime/product fix in this evidence commit.

## Findings

### F-039 — P2 — dynamic modal/context focus semantics are incomplete and inconsistent

The UI uses native buttons/inputs extensively and the module picker declares `role="dialog"` + `aria-modal="true"`, but dynamic overlays do not share a complete focus contract:

- module picker opens without explicitly moving focus into the dialog, trapping focus, or returning focus to the invoker;
- module context menu is a positioned `div` with buttons, without menu/dialog semantics or keyboard roving behavior;
- project naming overlay focuses the text input, but has no dialog role/aria-modal, focus trap, explicit Escape handler or focus restoration;
- illuminated-foam size overlay similarly focuses an input but lacks a common modal accessibility/focus lifecycle.

This is a product accessibility/keyboard consistency gap, not evidence that mouse workflows are broken.

## Positive controls

- primary static controls use native `button`, `input`, `select`, `details/summary` semantics.
- static labels/aria-labels exist for most primary fields.
- view shortcuts route through `isEditableKeyboardTarget()` and do not intentionally fire while focus is in input/textarea/select/contenteditable.
- module picker supports Escape close.
- project loading overlay exposes `aria-live`/`aria-busy` status.
- feedback is generally textual in addition to color.

## Checklist results

- A16.01 accessible names/labels: `AUDITED_OK` for primary static controls; dynamic semantics gap F-039.
- A16.02 button semantics: `AUDITED_OK` for primary actions.
- A16.03 shortcut suppression while editing: `AUDITED_OK` at resolver/integration level.
- A16.04 modal/context focus lifecycle: `GAP` — F-039.
- A16.05 Escape/close consistency: `GAP` — F-039.
- A16.06 hidden/disabled focus: `AUDITED_OK` on inspected native controls.
- A16.07 non-color-only feedback: `AUDITED_OK` for inspected status/selection flows.
- A16.08 critical workflows keyboard-operable: `GAP/DECISION_REQUIRED` — 3D pointer placement and dynamic dialogs do not have a complete keyboard-equivalent contract.

Section audit status: **GAP**.
