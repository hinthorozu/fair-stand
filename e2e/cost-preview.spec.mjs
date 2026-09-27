import { test, expect } from '@playwright/test';

async function createStand(page) {
  await page.goto('/');
  const standSetup = page.locator('details.stand-setup-card');
  await standSetup.locator('summary').click();
  await standSetup.getByRole('button', { name: 'Sırt Duvar' }).click();
  await page.locator('#stand-size-x').fill('400');
  await page.locator('#stand-size-y').fill('400');
  await page.locator('#create-stage').click();
  await page.locator('form input[name="projectName"]').fill('Maliyet Önizleme');
  await page.getByRole('button', { name: 'Projeyi Oluştur' }).click();
  await expect(page.locator('#viewport-toolbar')).toBeVisible();
}

test('maliyet paneli BOM satırını fiyatsız eşleşmedi olarak gösterir', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await createStand(page);
  await page.locator('#toggle-cost-preview').click();

  const panel = page.locator('#cost-preview-panel');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Fiyat reçeteye yazılmaz');
  await expect(panel).toContainText('eşleşmedi');
  await expect(panel.getByRole('button', { name: 'Teklife kaydet' })).toBeVisible();

  await panel.getByRole('button', { name: 'Teklife kaydet' }).click();
  await expect(panel).toContainText('Maliyet anlık görüntüsü kaydedildi');
  await expect(pageErrors).toEqual([]);
});
