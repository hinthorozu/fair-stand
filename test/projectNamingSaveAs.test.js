import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createProjectNamingController,
  suggestSaveAsEditableName,
} from '../src/projectNaming.js';

test('save-as dialog uses the same stand-name + suffix rule as create', async () => {
  const nodes = [];
  const documentRef = {
    body: {
      appendChild(node) {
        nodes.push(node);
      },
    },
    createElement(tag) {
      const el = {
        tagName: tag.toUpperCase(),
        style: {},
        children: [],
        listeners: Object.create(null),
        value: '',
        textContent: '',
        className: '',
        type: '',
        name: '',
        maxLength: 0,
        autocomplete: '',
        required: false,
        placeholder: '',
        append(...kids) {
          this.children.push(...kids);
        },
        appendChild(child) {
          this.children.push(child);
          return child;
        },
        addEventListener(type, fn) {
          (this.listeners[type] ||= []).push(fn);
        },
        focus() {},
        select() {},
        remove() {
          const index = nodes.indexOf(this);
          if (index >= 0) nodes.splice(index, 1);
        },
      };
      return el;
    },
  };

  const { requestProjectName } = createProjectNamingController({ documentRef });
  const pending = requestProjectName({
    mode: 'save-as',
    defaultName: suggestSaveAsEditableName('Ferromet'),
    suffix: 'L_Sol_500_300',
  });

  const overlay = nodes[0];
  assert.ok(overlay);
  const form = overlay.children[0];
  const texts = [];
  const walk = (node) => {
    if (!node) return;
    if (node.textContent) texts.push(node.textContent);
    (node.children || []).forEach(walk);
  };
  walk(form);

  assert.equal(texts.includes('Farklı Kaydet'), true);
  assert.equal(texts.includes('Stand adını gir; proje adı stand tipi ve ölçülerle otomatik oluşturulacak.'), true);
  assert.equal(texts.includes('Stand adı'), true);
  assert.equal(texts.some((text) => text.startsWith('Proje adı: Ferromet_(1)-L_Sol_500_300') || text === 'Proje adı: Ferromet_(1)-L_Sol_500_300' || text.includes('L_Sol_500_300')), true);

  const input = (() => {
    const stack = [form];
    while (stack.length) {
      const node = stack.pop();
      if (node.tagName === 'INPUT') return node;
      stack.push(...(node.children || []));
    }
    return null;
  })();
  assert.ok(input);
  assert.equal(input.placeholder, 'Örn. Ferromet');
  assert.equal(input.value, 'Ferromet (1)');

  const submit = form.listeners.submit[0];
  submit({ preventDefault() {} });
  assert.equal(await pending, 'Ferromet_(1)-L_Sol_500_300');
});

test('projectNaming source keeps shared stand-name rule for create and save-as', () => {
  const source = readFileSync(new URL('../src/projectNaming.js', import.meta.url), 'utf8');
  assert.match(source, /usesStandNameRule = !isRename/);
  assert.match(source, /Stand adını gir; proje adı stand tipi ve ölçülerle otomatik oluşturulacak\./);
});
