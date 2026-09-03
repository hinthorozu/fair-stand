import test from 'node:test';
import assert from 'node:assert/strict';
import { isEditableKeyboardTarget, resolveViewKeyboardShortcut } from '../src/viewKeyboardShortcuts.js';

test('view shortcuts map P/O/L/R/T/F/H without modifiers', () => {
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'P' }), { type: 'projection', mode: 'perspective' });
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'o' }), { type: 'projection', mode: 'orthographic' });
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'L' }), { type: 'view', direction: 'left' });
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'R' }), { type: 'view', direction: 'right' });
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'T' }), { type: 'view', direction: 'top' });
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'F' }), { type: 'view', direction: 'front' });
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'H' }), { type: 'view', direction: 'home' });
});

test('rotation keeps Shift+R reverse and moves clockwise rotation to Ctrl/Cmd+R', () => {
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'r', ctrlKey: true }), { type: 'rotate', direction: 'clockwise' });
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'r', metaKey: true }), { type: 'rotate', direction: 'clockwise' });
  assert.deepEqual(resolveViewKeyboardShortcut({ key: 'r', shiftKey: true }), { type: 'rotate', direction: 'counterclockwise' });
});

test('unrelated modified view keys do not trigger camera shortcuts', () => {
  assert.equal(resolveViewKeyboardShortcut({ key: 'p', ctrlKey: true }), null);
  assert.equal(resolveViewKeyboardShortcut({ key: 'l', shiftKey: true }), null);
  assert.equal(resolveViewKeyboardShortcut({ key: 'f', altKey: true }), null);
});

test('editable target guard covers form and contenteditable fields', () => {
  assert.equal(isEditableKeyboardTarget({ tagName: 'INPUT' }), true);
  assert.equal(isEditableKeyboardTarget({ tagName: 'textarea' }), true);
  assert.equal(isEditableKeyboardTarget({ tagName: 'SELECT' }), true);
  assert.equal(isEditableKeyboardTarget({ tagName: 'DIV', isContentEditable: true }), true);
  assert.equal(isEditableKeyboardTarget({ tagName: 'CANVAS' }), false);
});
