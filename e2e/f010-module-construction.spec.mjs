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
  expect(project.modules.every((moduleState) => moduleState.catalogKey === `wall_${moduleState.widthCm}`)).toBe(true);
  expect(pageErrors).toEqual([]);
});

test('F-010 catalog construction persists a module created through the real picker', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await createStand(page, {
    standName: 'Sırt Duvar',
    projectName: 'F010 Catalog Module',
  });

  // F-027 changed the old clear-wall control into "Sahneyi Sıfırla". Create
  // capacity for this construction test through the existing module-delete path
  // instead of depending on the removed clear-all behavior.
  const initialProject = await saveAndReadProject(page);
  expect(initialProject).not.toBeNull();
  expect(initialProject.modules.length).toBeGreaterThan(0);
  const removedModule = initialProject.modules[0];
  expect(removedModule.catalogKey).toBe(`wall_${removedModule.widthCm}`);

  page.once('dialog', async (dialog) => dialog.accept());
  await page.evaluate((moduleId) => {
    window.dispatchEvent(new CustomEvent('fair-stand:delete-selected-module', {
      detail: { moduleId },
    }));
  }, removedModule.id);

  const openCatalogButton = page.locator('#open-module-catalog');
  const modulePanel = page.locator('details', { has: openCatalogButton });
  await expect(modulePanel).toHaveCount(1);
  await modulePanel.locator(':scope > summary').click();

  await expect(openCatalogButton).toBeVisible();
  await expect(openCatalogButton).toBeEnabled();
  await openCatalogButton.click();

  const picker = page.locator('.module-picker-backdrop');
  await expect(picker).toBeVisible();

  const replacementCard = picker.locator(`[data-module-key="${removedModule.catalogKey}"]`);
  await expect(replacementCard).toBeVisible();
  await replacementCard.click();

  const addButton = picker.locator('.module-picker-add');
  await expect(addButton).toBeEnabled();
  await addButton.click();
  await expect(picker).toBeHidden();

  const project = await saveAndReadProject(page);
  expect(project).not.toBeNull();
  expect(project.modules).toHaveLength(initialProject.modules.length);
  expect(project.modules.some((moduleState) => moduleState.id === removedModule.id)).toBe(false);
  const replacement = project.modules.find(
    (moduleState) => moduleState.catalogKey === removedModule.catalogKey
      && moduleState.id !== removedModule.id,
  );
  expect(replacement).toBeTruthy();
  expect(replacement.type).toBe('flat-panel');
  expect(replacement.widthCm).toBe(removedModule.widthCm);
  expect(pageErrors).toEqual([]);
});
