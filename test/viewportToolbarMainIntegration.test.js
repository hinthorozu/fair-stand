import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const markup = readFileSync(new URL('../src/configuratorMarkup.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

test('main delegates top band collapse to viewportToolbarController', () => {
  assert.match(main, /import \{ createViewportToolbarController \} from '\.\/viewportToolbarController\.js'/);
  assert.match(
    main,
    /createViewportToolbarController\(\{[\s\S]*toolbarElement: viewportToolbar,[\s\S]*toggleButton: viewportToolbarToggle,[\s\S]*\}\)\.bind\(\)/,
  );
  assert.doesNotMatch(main, /viewportToolbarToggle\?\.addEventListener\('click'/);
});

test('standalone and mounted markup expose the same top band toggle', () => {
  assert.match(html, /id="viewport-toolbar-toggle" class="viewport-toolbar-toggle"/);
  assert.match(html, /aria-label="Üst bandı kapat"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /title="Üst bandı kapat">›<\/button>/);
  assert.match(markup, /id=\\"viewport-toolbar-toggle\\" class=\\"viewport-toolbar-toggle\\"/);
  assert.match(markup, /aria-label=\\"Üst bandı kapat\\"/);
  assert.match(markup, /title=\\"Üst bandı kapat\\">›<\/button>/);
  assert.match(css, /\.viewport-toolbar\.is-collapsed > :not\(\.viewport-toolbar-toggle\)/);
});
