import test from 'node:test';
import assert from 'node:assert/strict';
import { createSidebarController } from '../src/sidebarController.js';

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

test('setCollapsed preserves sidebar class, labels and resize notification', () => {
  const appElement = { classList: createClassList() };
  const toggleButton = createButton();
  const dispatched = [];
  class FakeEvent { constructor(type) { this.type = type; } }
  const controller = createSidebarController({
    appElement,
    toggleButton,
    windowRef: { dispatchEvent: (event) => dispatched.push(event.type) },
    EventClass: FakeEvent,
  });

  controller.setCollapsed(true);
  assert.equal(appElement.classList.values.has('sidebar-collapsed'), true);
  assert.equal(toggleButton.textContent, '›');
  assert.equal(toggleButton.attributes.get('aria-expanded'), 'false');
  assert.equal(toggleButton.attributes.get('aria-label'), 'Menüyü aç');
  assert.equal(toggleButton.title, 'Menüyü aç');
  assert.deepEqual(dispatched, ['resize']);

  controller.setCollapsed(false);
  assert.equal(appElement.classList.values.has('sidebar-collapsed'), false);
  assert.equal(toggleButton.textContent, '‹');
  assert.equal(toggleButton.attributes.get('aria-expanded'), 'true');
  assert.equal(toggleButton.attributes.get('aria-label'), 'Menüyü kapat');
  assert.equal(toggleButton.title, 'Menüyü kapat');
  assert.deepEqual(dispatched, ['resize', 'resize']);
});

test('toggle derives the next state from the current sidebar class', () => {
  const appElement = { classList: createClassList() };
  const controller = createSidebarController({
    appElement,
    toggleButton: null,
    windowRef: { dispatchEvent: () => {} },
    EventClass: class { constructor(type) { this.type = type; } },
  });

  assert.equal(controller.toggle(), true);
  assert.equal(controller.toggle(), false);
});

test('bind wires and unwires the click handler', () => {
  const appElement = { classList: createClassList() };
  const toggleButton = createButton();
  const controller = createSidebarController({
    appElement,
    toggleButton,
    windowRef: { dispatchEvent: () => {} },
    EventClass: class { constructor(type) { this.type = type; } },
  });

  const unbind = controller.bind();
  assert.equal(typeof toggleButton.listeners.get('click'), 'function');
  toggleButton.listeners.get('click')();
  assert.equal(appElement.classList.values.has('sidebar-collapsed'), true);
  unbind();
  assert.equal(toggleButton.listeners.has('click'), false);
});
