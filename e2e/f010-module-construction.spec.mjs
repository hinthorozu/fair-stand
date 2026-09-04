import { test, expect } from '@playwright/test';

async function createStand(page, { standName, projectName, xCm = '500', yCm = '500' }) {
  await page.goto('/');

  const standSetup = page.locator('details.stand-setup-card');
  await standSetup.locator('summary').click();
  await standSetup.getByRole('button', { name: standName }).click();
  await page.locator('#stand-size-x').fill(xCm);
  await page.locator('#stand-size-y').fill(yCm);

  const createStage = page.locator('#create-stage');
  await expect(createStage).toBeEnabled();
  await createStage.click();

  const projectNameInput = page.locator('form input[name="projectName"]');
  await expect(projectNameInput).toBeVisible();
  await projectNameInput.fill(projectName);
  await page.getByRole('button', { name: 'Projeyi Oluştur' }).click();

  await expect(page.locator('#viewport-empty')).toBeHidden();
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

test('F-010 automatic wall construction reaches persisted runtime state through Chromium', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await createStand(page, {
    standName: 'Sırt Duvar',
    projectName: 'F010 Automatic Wall',
  });

  const project = await saveAndReadProject(page);
  expect(project).not.toBeNull();
  expect(project.modules.length).toBeGreaterThan(0);
  expect(project.modules.every((moduleState) => moduleState.type === 'flat-panel')).toBe(true);
  expect(pageErrors).toEqual([]);
});

test('F-010 catalog construction persists a module created through the real picker', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await createStand(page, {
    standName: 'Ada Stand',
    projectName: 'F010 Catalog Module',
  });

  await page.locator('#open-module-catalog').click();
  const picker = page.locator('.module-picker-backdrop');
  await expect(picker).toBeVisible();

  const wallCard = picker.locator('[data-module-key="wall_100"]');
  await expect(wallCard).toBeVisible();
  await wallCard.click();

  const addButton = picker.locator('.module-picker-add');
  await expect(addButton).toBeEnabled();
  await addButton.click();
  await expect(picker).toBeHidden();

  const project = await saveAndReadProject(page);
  expect(project).not.toBeNull();
  expect(project.modules).toHaveLength(1);
  expect(project.modules[0].type).toBe('flat-panel');
  expect(project.modules[0].widthCm).toBe(100);
  expect(pageErrors).toEqual([]);
});
