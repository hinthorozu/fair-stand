import { test, expect } from '@playwright/test';
import { DEFAULT_SELECTION_HINT } from '../src/selectionFeedback.js';

test('seçim hint, standart listesi ve debug BOM varsayılan girişte doğru', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#selection-info')).toHaveText(DEFAULT_SELECTION_HINT);
  await expect(page.locator('#raw-bom-debug')).toHaveCount(0);

  const standardsPanel = page.locator('details').filter({ hasText: 'Standartlar' }).first();
  await standardsPanel.locator('summary').click();
  await expect(page.locator('#stand-standards-list li').first()).toContainText('Yükseklik:');
  await expect(page.locator('#stand-standards-list li')).toHaveCount(9);
});

test('rawBom sorgu parametresi DEV’de debug panelini açar', async ({ page }) => {
  await page.goto('/?rawBom');
  await expect(page.locator('#raw-bom-debug')).toBeVisible();
  await expect(page.getByText('Üretim Listesi · Debug')).toBeVisible();
});

test('DEV rawBom paneli gerçek girişte düz duvar reçete satırlarını çizer', async ({ page }) => {
  await page.goto('/?rawBom');
  await expect(page.locator('#raw-bom-debug')).toBeVisible();

  const standSetup = page.locator('details.stand-setup-card');
  await standSetup.locator('summary').click();
  await standSetup.getByRole('button', { name: 'Sırt Duvar' }).click();
  await page.locator('#stand-size-x').fill('500');
  await page.locator('#stand-size-y').fill('500');
  await page.locator('#create-stage').click();
  await page.locator('form input[name="projectName"]').fill('DEV BOM satır');
  await page.getByRole('button', { name: 'Projeyi Oluştur' }).click();
  await expect(page.locator('#viewport-toolbar')).toBeVisible();

  await page.locator('#selection-info').evaluate((el) => {
    el.textContent = 'Modül 1 · 100 cm · alttan 1. panel · Ctrl/Cmd + tık ile çoklu seç.';
  });

  const firstLine = page.locator('#raw-bom-debug [data-role="bom-content"] li').first();
  await expect(firstLine).toBeVisible();
  await expect(firstLine).toContainText('×');
  await expect(page.locator('#raw-bom-debug [data-role="bom-status"]')).toContainText('Raw BOM');
});
