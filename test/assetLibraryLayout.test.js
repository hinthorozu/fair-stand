import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../src/style.css', import.meta.url), 'utf8');

function ruleBody(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `missing rule ${selector}`);
  return match[1];
}

test('asset library keeps equal thumbnails and a filename under each tile', () => {
  const library = ruleBody('.asset-library');
  assert.match(library, /display:\s*grid/);
  assert.match(library, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(library, /grid-auto-rows:\s*max-content/);

  const tile = ruleBody('button.asset-tile');
  assert.match(tile, /display:\s*flex/);
  assert.match(tile, /flex-direction:\s*column/);
  assert.match(tile, /overflow:\s*visible/);
  assert.match(tile, /height:\s*auto/);
  assert.doesNotMatch(tile, /min-height:\s*0/);

  const image = ruleBody('button.asset-tile > img');
  assert.match(image, /height:\s*84px/);
  assert.match(image, /max-height:\s*84px/);
  assert.match(image, /flex:\s*0 0 84px/);
  assert.match(image, /object-fit:\s*contain/);

  const label = ruleBody('button.asset-tile > span');
  assert.match(label, /display:\s*block/);
  assert.match(label, /flex:\s*0 0 auto/);
  assert.match(label, /line-height:\s*16px/);
  assert.match(label, /white-space:\s*nowrap/);
});

test('stand chrome keeps the ink navy actions and the orange accent', () => {
  assert.match(css, /--primary:\s*#1e3a5f/);
  assert.match(css, /--accent:\s*#f97316/);
  assert.match(css, /font-family:\s*Inter,/);
});
