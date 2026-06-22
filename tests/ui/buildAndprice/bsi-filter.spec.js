const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../helpers/setup');

test.setTimeout(180_0000);

test('BSI Filter - 2026 Name and Price Validation', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  await page.getByRole('link', { name: 'Build & Price', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: 'Build and Search Inventory' })
  ).toBeVisible({ timeout: 30000 });

  await page.waitForTimeout(3000);

  // Year Filter
  await page.getByRole('button', { name: 'Year', exact: true }).click();

  await page.waitForTimeout(2000);

  await page.locator('label').nth(2).click();

  // Allow filter refresh
  await page.waitForTimeout(6000);

  // Exact codegen locator
  await page.getByRole('paragraph').filter({ hasText: 'Model Results' }).first().click();

  await page.waitForTimeout(5000);

  await page.waitForSelector(
    '#bsi-vehicle-cards .bsi-model-card-container',
    { timeout: 30000 }
  );

  const vehicles = [
    { name: 'PALISADE', price: '$39,435' },
    { name: 'SANTA FE', price: '$35,050' },
    { name: 'PALISADE Hybrid', price: '$44,160' },
    { name: 'SANTA FE Hybrid', price: '$36,400' },
    { name: 'TUCSON', price: '$29,450' },
    { name: 'TUCSON Plug-in Hybrid', price: '$40,325' },
    { name: 'TUCSON Hybrid', price: '$32,450' },
    { name: 'SONATA', price: '$27,450' },
    { name: 'SONATA Hybrid', price: '$29,200' },
    { name: 'IONIQ 5', price: '$35,000' },
    { name: 'ELANTRA', price: '$22,625' },
    { name: 'IONIQ 9', price: '$58,955' },
    { name: 'ELANTRA Hybrid', price: '$25,450' },
    { name: 'ELANTRA N', price: '$35,100' },
    { name: 'KONA', price: '$25,500' },
    { name: 'SANTA CRUZ', price: '$29,750' }
  ];

  const cards = page.locator(
    '#bsi-vehicle-cards .bsi-model-card-container'
  );

  await expect(cards.first()).toBeVisible({ timeout: 30000 });

  const count = await cards.count();

  console.log(`Vehicle cards found: ${count}`);

  for (let i = 0; i < Math.min(count, vehicles.length); i++) {

    const card = cards.nth(i);

    await card.scrollIntoViewIfNeeded();

    await expect(card).toBeVisible();

    await page.waitForTimeout(500);

    const cardText = await card.textContent();

    console.log(`\nCard ${i + 1}`);
    console.log(cardText);

    expect(cardText).toContain('2026');
    expect(cardText).toContain(vehicles[i].name);
    expect(cardText).toContain(vehicles[i].price);

    console.log(
      `✔ ${vehicles[i].name} | 2026 | ${vehicles[i].price}`
    );
  }

  console.log('\n🎉 ALL 2026 VEHICLES VALIDATED SUCCESSFULLY 🎉\n');
});