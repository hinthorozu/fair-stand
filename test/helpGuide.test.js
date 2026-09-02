import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const mainSource = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const guideSource = fs.readFileSync(new URL('../src/helpGuide.js', import.meta.url), 'utf8');
const guideCss = fs.readFileSync(new URL('../src/helpGuide.css', import.meta.url), 'utf8');

test('in-app help guide is wired into the application', () => {
  assert.match(mainSource, /import '\.\/helpGuide\.css';/);
  assert.match(mainSource, /import \{ initHelpGuide \} from '\.\/helpGuide\.js';/);
  assert.match(mainSource, /initHelpGuide\(\);/);
});

test('help guide exposes a fixed question-mark launcher and collapsible sections', () => {
  assert.match(guideSource, /button\.textContent = '\?';/);
  assert.match(guideSource, /document\.createElement\('details'\)/);
  assert.match(guideSource, /Kullanım Kılavuzu/);
  assert.match(guideSource, /Mouse Kontrolleri/);
  assert.match(guideSource, /Klavye Kısayolları/);
  assert.match(guideSource, /Sağ Tık Menüsü/);
  assert.match(guideSource, /Stand Oluşturma ve Sistem Standartları/);
});

test('help guide supports close button, backdrop click and Escape', () => {
  assert.match(guideSource, /help-guide-close/);
  assert.match(guideSource, /event\.target === backdrop/);
  assert.match(guideSource, /event\.key === 'Escape'/);
  assert.match(guideCss, /\.help-guide-button\s*\{/);
  assert.match(guideCss, /\.help-guide-backdrop\s*\{/);
});
