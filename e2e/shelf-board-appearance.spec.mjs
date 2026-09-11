import { test, expect } from '@playwright/test';

async function createStand(page) {
  await page.goto('/');
  const setup = page.locator('details.stand-setup-card');
  await setup.locator('summary').click();
  await setup.getByRole('button', { name: 'Sırt Duvar' }).click();
  await page.locator('#stand-size-x').fill('500');
  await page.locator('#stand-size-y').fill('500');
  await page.locator('#create-stage').click();
  const input = page.locator('form input[name="projectName"]');
  await expect(input).toBeVisible();
  await input.fill('Shelf Board Appearance');
  await page.getByRole('button', { name: 'Projeyi Oluştur' }).click();
  await expect(page.locator('#viewport-toolbar')).toBeVisible();
}

async function saveAndReadProject(page) {
  const save = page.locator('#save-project');
  await save.click();
  await expect(save).toBeEnabled();
  return page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('fair-stand-configurator', 2);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const projects = await new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readonly');
      const request = tx.objectStore('projects').getAll();
      request.onsuccess = () => resolve(request.result ?? []);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return projects.sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))[0] ?? null;
  });
}

test('wall shelf catalog placement keeps canonical shelf boards without a fake front profile', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await createStand(page);

  const initialProject = await saveAndReadProject(page);
  expect(initialProject).not.toBeNull();
  expect(initialProject.modules.length).toBeGreaterThanOrEqual(1);
  const removed = initialProject.modules[0];
  page.once('dialog', async (dialog) => dialog.accept());
  await page.evaluate((moduleId) => {
    window.dispatchEvent(new CustomEvent('fair-stand:delete-selected-module', {
      detail: { moduleId },
    }));
  }, removed.id);

  const open = page.locator('#open-module-catalog');
  const panel = page.locator('details', { has: open });
  await panel.locator(':scope > summary').click();
  await open.click();
  const picker = page.locator('.module-picker-backdrop');
  await expect(picker).toBeVisible();
  await picker.locator('[data-module-key="wall_shelf_3_100"]').click();
  await picker.locator('.module-picker-add').click();
  await expect(picker).toBeHidden();

  const project = await saveAndReadProject(page);
  const shelf = project.modules.find((moduleState) => moduleState.itemKey === 'wall_shelf_3_100'
    || moduleState.catalogKey === 'wall_shelf_3_100');
  expect(shelf).toBeTruthy();
  expect(shelf.catalogKey).toBe('wall_shelf_3_100');
  expect(shelf.type).toBe('shelf');
  expect(shelf.widthCm).toBe(100);
  expect(shelf.shelfCount).toBe(3);
  expect(shelf.shelfLightingOn).toBe(false);
  expect(errors).toEqual([]);
});
