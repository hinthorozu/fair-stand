import test from 'node:test';
import assert from 'node:assert/strict';
import { createViewportToolbarController } from '../src/viewportToolbarController.js';

function createClassList(initial = []) {
  const values = new Set(initial);
  return {
    contains: (value) => values.has(value),
    toggle: (value, force) => {
      if (force) values.add(value);
      else values.delete(value);
    },
    values,
  };
}

function createButton() {
  const attributes = new Map();
  const listeners = new Map();
  return {
    textContent: '',
    title: '',
    setAttribute: (name, value) => attributes.set(name, value),
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: (name, handler) => {
      if (listeners.get(name) === handler) listeners.delete(name);
    },
    attributes,
    listeners,
  };
}

test('setCollapsed hides the top band and keeps the toggle labeled', () => {
  const toolbarElement = { classList: createClassList() };
  const toggleButton = createButton();
  const controller = createViewportToolbarController({ toolbarElement, toggleButton });

  controller.setCollapsed(true);
  assert.equal(toolbarElement.classList.values.has('is-collapsed'), true);
  assert.equal(toggleButton.textContent, '‹');
  assert.equal(toggleButton.attributes.get('aria-expanded'), 'false');
  assert.equal(toggleButton.attributes.get('aria-label'), 'Üst bandı aç');
  assert.equal(toggleButton.title, 'Üst bandı aç');

  controller.setCollapsed(false);
  assert.equal(toolbarElement.classList.values.has('is-collapsed'), false);
  assert.equal(toggleButton.textContent, '›');
  assert.equal(toggleButton.attributes.get('aria-expanded'), 'true');
  assert.equal(toggleButton.attributes.get('aria-label'), 'Üst bandı kapat');
  assert.equal(toggleButton.title, 'Üst bandı kapat');
});

test('toggle derives the next state from the current toolbar class', () => {
  const toolbarElement = { classList: createClassList() };
  const controller = createViewportToolbarController({
    toolbarElement,
    toggleButton: null,
  });

  assert.equal(controller.toggle(), true);
  assert.equal(controller.toggle(), false);
});

test('bind wires and unwires the click handler', () => {
  const toolbarElement = { classList: createClassList() };
  const toggleButton = createButton();
  const controller = createViewportToolbarController({ toolbarElement, toggleButton });
  const unbind = controller.bind();

  toggleButton.listeners.get('click')();
  assert.equal(toolbarElement.classList.values.has('is-collapsed'), true);
  unbind();
  assert.equal(toggleButton.listeners.has('click'), false);
});
