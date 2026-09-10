import { test, expect } from '@playwright/test';

async function createStand(page) {
  await page.goto('/');
  const setup = page.locator('details.stand-setup-card');
  await setup.locator('summary').click();
  await setup.getByRole('button', { name: 'Sırt Duvar' }).click();
  await page.locator('#stand-size-x').fill('500');
  await page.locator('#stand-size-y').fill('500');
  await page.locator('#create-stage').click();
  const projectNameInput = page.locator('form input[name="projectName"]');
  await expect(projectNameInput).toBeVisible();
  await projectNameInput.fill('Showcase Item Contract');
  await page.getByRole('button', { name: 'Projeyi Oluştur' }).click();
  await expect(page.locator('#viewport-toolbar')).toBeVisible();
}

async function saveAndReadProject(page) {
  const saveButton = page.locator('#save-project');
  await saveButton.click();
  await expect(saveButton).toBeEnabled();
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

test('showcase catalog parents persist canonical item identity and one grouped body color state', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await createStand(page);

  const initial = await saveAndReadProject(page);
  expect(initial.modules.length).toBeGreaterThanOrEqual(2);
  for (const moduleState of initial.modules.slice(0, 2)) {
    page.once('dialog', async (dialog) => dialog.accept());
    await page.evaluate((moduleId) => {
      window.dispatchEvent(new CustomEvent('fair-stand:delete-selected-module', { detail: { moduleId } }));
    }, moduleState.id);
  }

  const openCatalogButton = page.locator('#open-module-catalog');
  const modulePanel = page.locator('details', { has: openCatalogButton });
  await modulePanel.locator(':scope > summary').click();
  await openCatalogButton.click();
  const picker = page.locator('.module-picker-backdrop');
  await expect(picker).toBeVisible();
  await picker.locator('[data-module-key="showcase_2_100"]').click();
  await picker.locator('[data-module-key="showcase_3_100"]').click();
  await picker.locator('.module-picker-add').click();
  await expect(picker).toBeHidden();

  const project = await saveAndReadProject(page);
  const showcase2 = project.modules.find((moduleState) => moduleState.itemKey === 'showcase_2_100');
  const showcase3 = project.modules.find((moduleState) => moduleState.itemKey === 'showcase_3_100');
  expect(showcase2).toBeTruthy();
  expect(showcase3).toBeTruthy();
  expect(showcase2.catalogKey).toBe('showcase_2_100');
  expect(showcase3.catalogKey).toBe('showcase_3_100');
  expect(showcase2.type).toBe('showcase-2');
  expect(showcase3.type).toBe('showcase-3');
  expect(showcase2.eyeCount).toBe(2);
  expect(showcase3.eyeCount).toBe(3);
  expect(showcase2.bodySurface.color).toBe('#ffffff');
  expect(showcase3.bodySurface.color).toBe('#ffffff');
  expect(showcase2.bodySurface.imageAssetId).toBeUndefined();
  expect(showcase3.bodySurface.imageAssetId).toBeUndefined();
  expect(pageErrors).toEqual([]);
});
