import { test, expect } from '@playwright/test';

async function openDb(page) {
  return page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('fair-stand-configurator', 2);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return true;
  });
}

async function seedIlluminatedFoam(page) {
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
    const project = projects[0];
    if (!project?.modules?.length) throw new Error('Expected a saved project with modules.');

    const preserved = project.modules.map((module) => ({
      type: module.type,
      widthCm: module.widthCm,
      placement: module.placement ?? null,
    }));
    const sourcePlacement = project.modules[0].placement ?? {
      wallId: 'back', xCm: 0, yCm: 0, zCm: 0, rotationZDeg: 0,
    };
    project.modules.push({
      id: 'module-f028-illuminated-foam',
      type: 'illuminated-foam',
      imageAssetId: null,
      widthCm: 200,
      heightCm: 50,
      depthCm: 3.5,
      wallGapCm: 1.5,
      haloColor: '#ffffff',
      placement: { ...sourcePlacement },
    });

    await new Promise((resolve, reject) => {
      const tx = db.transaction('projects', 'readwrite');
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.objectStore('projects').put(project);
    });
    db.close();
    return preserved;
  });
}

async function readProjectModules(page) {
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
    return projects[0]?.modules ?? [];
  });
}

test('Tüm Özellikleri Kaldır deletes illuminated foam and preserves other module layout', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto('/');
  await openDb(page);
  const setupCard = page.locator('details.stand-setup-card');
  await setupCard.locator('summary').click();
  await setupCard.getByRole('button', { name: 'L Stand Sol' }).click();
  await page.locator('#stand-size-x').fill('500');
  await page.locator('#stand-size-y').fill('300');
  await page.locator('#create-stage').click();

  const nameInput = page.locator('form input[name="projectName"]');
  await nameInput.fill('F028 Reset');
  await page.getByRole('button', { name: 'Projeyi Oluştur' }).click();
  await expect(page.locator('#stage-result')).toContainText('L Stand Sol · 500 × 300 cm');

  const preserved = await seedIlluminatedFoam(page);
  await page.locator('#open-project').click();
  await expect(page.locator('#project-status')).toContainText('Açıldı:');

  const featurePanel = page.locator('details.panel-card').filter({
    has: page.locator('#reset-module-features'),
  });
  await featurePanel.locator('summary').click();
  await expect(page.locator('#reset-module-features')).toBeVisible();

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('1 Işıklı Strafor sahneden silinecek');
    await dialog.accept();
  });
  await page.locator('#reset-module-features').click();
  await expect(page.locator('#selection-info')).toContainText('1 Işıklı Strafor sahneden silindi');

  await page.locator('#save-project').click();
  await expect(page.locator('#project-status')).toContainText('Kaydedildi:');

  const modules = await readProjectModules(page);
  expect(modules.some((module) => module.type === 'illuminated-foam')).toBe(false);
  expect(modules.map((module) => ({
    type: module.type,
    widthCm: module.widthCm,
    placement: module.placement ?? null,
  }))).toEqual(preserved);
  expect(pageErrors).toEqual([]);
});
