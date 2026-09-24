import { test, expect } from '@playwright/test';

async function createStand(page, standName, projectName) {
  await page.goto('/');
  const standSetup = page.locator('details.stand-setup-card');
  await standSetup.locator('summary').click();
  await standSetup.getByRole('button', { name: standName }).click();
  await page.locator('#stand-size-x').fill('500');
  await page.locator('#stand-size-y').fill('500');
  await page.locator('#create-stage').click();
  const projectNameInput = page.locator('form input[name="projectName"]');
  await expect(projectNameInput).toBeVisible();
  await projectNameInput.fill(projectName);
  await page.getByRole('button', { name: 'Projeyi Oluştur' }).click();
  await expect(page.locator('#viewport-toolbar')).toBeVisible();
}

async function openSurfacePanel(page) {
  const panel = page.locator('details', { has: page.locator('#apply-color') });
  if (!(await panel.getAttribute('open'))) {
    await panel.locator(':scope > summary').click();
  }
  await expect(page.locator('#apply-color')).toBeVisible();
}

test('seçim yokken Rengi uygula production mesajı verir ve state bozulmaz', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createStand(page, 'Sırt Duvar', 'E2E Color No Selection');
  await openSurfacePanel(page);

  await page.locator('#apply-color').click();
  await expect(page.locator('#selection-info')).toHaveText(
    'Önce 3D sahnede boyamak istediğin panel, panel bloğu, modül veya zemini seç.',
  );
  await expect(page.locator('#raw-bom-debug')).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test('görsel arşive yüklenir; seçim yokken Kaldır production mesajı verir', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createStand(page, 'Ada Stand', 'E2E Image Library');
  await openSurfacePanel(page);

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  );
  await page.locator('#surface-image').setInputFiles({
    name: 'e2e-swatch.png',
    mimeType: 'image/png',
    buffer: png,
  });
  await expect(page.locator('#asset-status')).toContainText('Aktif görsel: e2e-swatch.png');
  await expect(page.locator('.asset-tile')).toHaveCount(1);

  await page.locator('#clear-texture').click();
  await expect(page.locator('#selection-info')).toHaveText('Önce bir panel veya panel bloğu seç.');
  await expect(page.locator('.asset-tile')).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test('5 MB üstü görsel arşive yazılmaz', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createStand(page, 'Ada Stand', 'E2E Image Size Cap');
  await openSurfacePanel(page);

  const filesPromise = page.locator('#surface-image').setInputFiles({
    name: 'too-big.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 1),
  });
  const dialog = await page.waitForEvent('dialog');
  expect(dialog.message()).toBe('Görsel en fazla 5 MB olabilir.');
  await dialog.accept();
  await filesPromise;
  await expect(page.locator('#asset-status')).toHaveText('Görsel seçilmedi.');
  await expect(page.locator('.asset-tile')).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test('katalog image-capable wall ve non-image TV kartlarını birlikte sunar', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createStand(page, 'Ada Stand', 'E2E Capability Catalog');

  const openCatalogButton = page.locator('#open-module-catalog');
  const modulePanel = page.locator('details', { has: openCatalogButton });
  await modulePanel.locator(':scope > summary').click();

  const wallCard = page.locator('.module-drag-card[data-module-key="wall_100_350"]');
  const tvCard = page.locator('.module-drag-card[data-module-key="tv_42"]');
  const fridgeCard = page.locator('.module-drag-card[data-module-key="mini_fridge_avanti"]');

  for (const card of [wallCard, tvCard, fridgeCard]) {
    const group = page.locator('.module-drag-group', { has: card });
    if (!(await group.getAttribute('open'))) {
      await group.locator(':scope > summary').click();
    }
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('aria-disabled', 'false');
  }
  expect(pageErrors).toEqual([]);
});
