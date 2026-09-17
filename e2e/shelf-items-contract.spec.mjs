import { test, expect } from '@playwright/test';

async function createBackWallStand(page, projectName) {
  await page.goto('/');
  const setup = page.locator('details.stand-setup-card');
  await setup.locator('summary').click();
  await setup.getByRole('button', { name: 'Sırt Duvar' }).click();
  await page.locator('#stand-size-x').fill('500');
  await page.locator('#stand-size-y').fill('500');
  await page.locator('#create-stage').click();
  const input = page.locator('form input[name="projectName"]');
  await expect(input).toBeVisible();
  await input.fill(projectName);
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

async function openShelfGroup(page) {
  const open = page.locator('#open-module-catalog');
  await page.locator('details', { has: open }).locator(':scope > summary').click();
  await open.click();
  const group = page.locator('.module-drag-group', { hasText: 'Raf & Vitrin' });
  if (!(await group.getAttribute('open'))) {
    await group.locator(':scope > summary').click();
  }
  return group;
}

test('shelf_100/150/200 Catalog’da Raf & Vitrin altında vitrinlerden sonra görünür', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await createBackWallStand(page, 'Shelf Catalog Order');
  const group = await openShelfGroup(page);
  const keys = await group.locator('.module-drag-card').evaluateAll((cards) => (
    cards.map((card) => card.getAttribute('data-module-key'))
  ));
  expect(keys).toEqual([
    'wall_showcase_100_3',
    'wall_showcase_100_2',
    'shelf_100',
    'shelf_150',
    'shelf_200',
  ]);
  for (const itemKey of ['wall_shelf_2_100', 'wall_shelf_3_200']) {
    await expect(page.locator(`.module-drag-card[data-module-key="${itemKey}"]`)).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

for (const itemKey of ['shelf_100', 'shelf_150', 'shelf_200']) {
  test(`${itemKey} catalog drag matching wall span’ine overlay olarak eklenir`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await createBackWallStand(page, itemKey);
    const initial = await saveAndReadProject(page);
    const wallUsedBefore = (initial.modules ?? [])
      .filter((module) => module.placement?.wallId === 'back' && module.type !== 'shelf')
      .reduce((sum, module) => sum + Number(module.widthCm || 0), 0);

    const open = page.locator('#open-module-catalog');
    await page.locator('details', { has: open }).locator(':scope > summary').click();
    const card = page.locator(`.module-drag-card[data-module-key="${itemKey}"]`);
    await page.locator('.module-drag-group', { has: card }).locator(':scope > summary').click();
    await expect(card).toBeVisible();

    const viewport = page.locator('#viewport');
    const box = await viewport.boundingBox();
    await card.dragTo(viewport, {
      targetPosition: { x: Math.round(box.width * 0.50), y: Math.round(box.height * 0.42) },
    });

    const project = await saveAndReadProject(page);
    const shelf = project.modules.find((module) => module.itemKey === itemKey);
    expect(shelf).toBeTruthy();
    expect(shelf.type).toBe('shelf');
    expect(shelf.widthCm).toBe(Number(itemKey.replace('shelf_', '')));
    expect(shelf.depthCm).toBe(38);
    expect(shelf.heightCm).toBe(1.8);
    expect(shelf.placement.wallId).toBe('back');
    expect(project.modules.some((module) => String(module.itemKey).startsWith('wall_shelf_'))).toBe(false);

    const wallUsedAfter = project.modules
      .filter((module) => module.placement?.wallId === 'back' && module.type !== 'shelf')
      .reduce((sum, module) => sum + Number(module.widthCm || 0), 0);
    expect(wallUsedAfter).toBe(wallUsedBefore);
    expect(errors).toEqual([]);
  });
}
