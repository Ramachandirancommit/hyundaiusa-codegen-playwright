const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(180000);

test('BSI Filter - Seating 5 6 7 8 Validation', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', {
    name: 'Build & Price',
    exact: true
  }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Build and Search Inventory'
    })
  ).toBeVisible({ timeout: 30000 });

  console.log('Redirected to Build and Search Inventory page 🎉');

  // =====================================
  // OPEN SIZE → SEATING FILTER
  // =====================================

  await page.getByRole('button', {
    name: 'Size',
    exact: true
  }).click();

  await page.locator(
    'div:nth-child(3) > .bsi-filters-sub-title-container > .bsi-filters-expand-icon'
  ).first().click();

  // =====================================
  // 5 SEATER
  // =====================================

  console.log('\n========== 5 SEATER ==========\n');

  await page.getByRole('checkbox', {
    name: '5',
    exact: true
  }).check();

  await validateVehicles(page, [
    ['TUCSON', '$29,450'],
    ['TUCSON Hybrid', '$32,450'],
    ['TUCSON Plug-in Hybrid', '$40,325'],
    ['SONATA', '$27,450'],
    ['SONATA Hybrid', '$29,200'],
    ['IONIQ 5', '$35,000'],
    ['IONIQ 5 N', '$66,200'],
    ['ELANTRA', '$22,625'],
    ['ELANTRA Hybrid', '$25,450'],
    ['ELANTRA N', '$35,100'],
    ['KONA', '$25,500'],
    ['KONA Electric', '$32,975'],
    ['IONIQ 6', '$37,850'],
    ['SANTA CRUZ', '$29,750'],
    ['VENUE', '$20,550']
  ]);

  console.log('\n🎉 5 SEATER VALIDATION COMPLETED 🎉\n');

  // =====================================
  // 6 SEATER
  // =====================================

  console.log('\n========== 6 SEATER ==========\n');

  await page.getByRole('button', { name: 'Chip' }).click();

  await page.locator('label[for="Seating-6"]').click();

  await validateVehicles(page, [
    ['SANTA FE', '$35,050']
  ]);

  console.log('\n🎉 6 SEATER VALIDATION COMPLETED 🎉\n');

  // =====================================
  // 7 SEATER
  // =====================================

  console.log('\n========== 7 SEATER ==========\n');

  await page.getByRole('button', { name: 'Chip' }).click();

  await page.locator('label[for="Seating-7"]').click();

  await validateVehicles(page, [
    ['PALISADE', '$39,435'],
    ['PALISADE Hybrid', '$44,160'],
    ['SANTA FE', '$35,050'],
    ['SANTA FE Hybrid', '$36,400'],
    ['IONIQ 9', '$58,955']
  ]);

  console.log('\n🎉 7 SEATER VALIDATION COMPLETED 🎉\n');

  // =====================================
  // 8 SEATER
  // =====================================

  console.log('\n========== 8 SEATER ==========\n');

  await page.getByRole('button', { name: 'Chip' }).click();

  await page.locator('label[for="Seating-8"]').click();

  await validateVehicles(page, [
    ['PALISADE', '$39,435']
  ]);

  console.log('\n🎉 8 SEATER VALIDATION COMPLETED 🎉\n');

});

async function validateVehicles(page, vehicles) {

  await page.waitForTimeout(3000);

  const cards = page.locator(
    '#bsi-vehicle-cards .bsi-model-card-container'
  );

  await expect(cards.first()).toBeVisible({
    timeout: 30000
  });

  for (const [name, price] of vehicles) {

    const card = cards.filter({
      hasText: name
    }).first();

    await card.scrollIntoViewIfNeeded();

    await expect(card).toBeVisible();

    const text = await card.textContent();

    expect(text).toContain(name);
    expect(text).toContain(price);

    console.log(`✔ ${name} | ${price} | PASS`);
  }
}