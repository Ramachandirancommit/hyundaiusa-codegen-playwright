const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(300000);

test('BSI - Exterior Color Black Validation', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', {
    name: 'Build & Price',
    exact: true
  }).click();

  await expect(
    page.getByRole('heading', { name: /Build and Search Inventory/i })
  ).toBeVisible({ timeout: 30000 });

  // =========================
  // EXPECTED BLACK VEHICLES
  // =========================
  const expectedVehicles = [
    ['PALISADE', '$39,435'],
    ['PALISADE Hybrid', '$44,160'],
    ['SANTA FE', '$35,050'],
    ['SANTA FE Hybrid', '$36,400'],
    ['TUCSON', '$29,450'],
    ['TUCSON Hybrid', '$32,450'],
    ['TUCSON Plug-in Hybrid', '$40,325'],
    ['SONATA', '$27,450'],
    ['SONATA Hybrid', '$29,200'],
    ['IONIQ 5', '$35,000'],
    ['IONIQ 5 N', '$66,200'],
    ['IONIQ 9', '$58,955'],
    ['ELANTRA', '$22,625'],
    ['ELANTRA Hybrid', '$25,450'],
    ['ELANTRA N', '$35,100'],
    ['KONA', '$25,500'],
    ['KONA Electric', '$32,975'],
    ['IONIQ 6', '$37,850'],
    ['SANTA CRUZ', '$29,750'],
    ['VENUE', '$20,550']
  ];

  // =========================
  // OPEN FILTER
  // =========================
  await page.getByRole('button', {
    name: 'Exterior Colors'
  }).click();

  await page.waitForTimeout(1500);

  // =========================
  // SELECT BLACK
  // =========================
  await page.getByRole('button', {
    name: 'Black'
  }).click();

  console.log('\n==============================');
  console.log('BLACK COLOR VALIDATION STARTED');
  console.log('==============================\n');

  // =========================
  // GET CARDS
  // =========================
  const cards = page.locator(
    '#bsi-vehicle-cards .bsi-model-card-container'
  );

  await expect(cards.first()).toBeVisible({
    timeout: 30000
  });

  const count = await cards.count();

  console.log(`✔ 20 vehicle found (UI): ${count}`);

  expect(count).toBe(20);

  console.log(`✔ 20 vehicle matched with pre data`);

  // =========================
  // VALIDATION LOOP
  // =========================
  for (let i = 0; i < expectedVehicles.length; i++) {

    const [name, price] = expectedVehicles[i];

    const card = cards.filter({
      hasText: name
    }).first();

    await expect(card).toBeVisible();

    // IMAGE CHECK
    const img = card.getByRole('img', {
      name: 'Model Image'
    });

    await expect(img).toBeVisible();

    // PRICE CHECK
    await expect(card).toContainText(price);

    // CLICK CARD (dcodegen style)
    await card.click();

    await page.waitForTimeout(1200);

    console.log(
      `${name} | ${price} | img present -> verified | PASS`
    );

    // CLOSE / RESET
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(800);
  }

  console.log('\n🎉 BLACK COLOR VALIDATION COMPLETED SUCCESSFULLY');
});