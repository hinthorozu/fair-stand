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
