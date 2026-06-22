const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(180000);

test('BSI Filter - Fuel Type Validation (State Safe)', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  console.log('✔ Page setup complete');

  await page.getByRole('link', { name: 'Build & Price', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: /Build and Search Inventory/i })
  ).toBeVisible({ timeout: 30000 });

  console.log('✔ BSI page loaded');

  // =========================
  // CORE HELPERS
  // =========================

  async function resetFuelFilterState() {
    // Ensures no stale UI state before next selection
    const fuelBtn = page.getByRole('button', { name: /Fuel Type/i });

    if (await fuelBtn.isVisible().catch(() => false)) {
      await fuelBtn.click();
      await page.waitForTimeout(1200);
    }

    // Escape helps close overlay / reset animation state
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(1200);
  }

  async function openFuelFilter() {
    const fuelBtn = page.getByRole('button', { name: /Fuel Type/i });

    await expect(fuelBtn).toBeVisible({ timeout: 30000 });
    await fuelBtn.click();

    await page.waitForTimeout(1500); // animation buffer
  }

  async function selectFuel(type) {

    const option = page.getByText(type, { exact: true });

    // wait for DOM stabilization
    await page.waitForTimeout(1500);

    await expect(option).toBeAttached({ timeout: 30000 });

    // scroll into view first (important for hidden list items)
    await option.scrollIntoViewIfNeeded();

    // retry-safe click (handles animation + overlays)
    await expect(async () => {
      await option.click({ timeout: 5000 });
    }).toPass({
      timeout: 30000,
      intervals: [500, 1000, 1500]
    });

    const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');
    await expect(cards.first()).toBeVisible({ timeout: 30000 });

    await page.waitForTimeout(2000);
  }

  async function validateVehicles(expected) {

    const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');

    await expect(cards.first()).toBeVisible({ timeout: 30000 });

    const count = await cards.count();

    for (const [name, price] of expected) {

      const card = cards.filter({ hasText: name }).first();

      await expect(card).toBeVisible({ timeout: 20000 });

      const text = (await card.textContent())?.replace(/\s+/g, ' ') || '';

      expect(text).toContain(name);
      expect(text).toContain(price);

      console.log(`✔ ${name} | ${price}`);
    }
  }

  async function waitForUISettle() {
    const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');
    await expect(cards.first()).toBeVisible({ timeout: 30000 });
    await page.waitForTimeout(1500);
  }

  async function applyFilter(label, vehicles) {

    console.log(`\n========== ${label.toUpperCase()} ==========\n`);

    // 🔴 KEY FIX: reset state before switching filters
    await resetFuelFilterState();

    await openFuelFilter();
    await selectFuel(label);

    await validateVehicles(vehicles);

    await waitForUISettle();

    console.log(`\n🎉 ${label.toUpperCase()} COMPLETED\n`);
  }

  // =========================
  // TEST EXECUTION
  // =========================

  await applyFilter('Electric', [
    ['IONIQ 5', '$35,000'],
    ['IONIQ 5 N', '$66,200'],
    ['IONIQ 9', '$58,955'],
    ['KONA Electric', '$32,975'],
    ['IONIQ 6', '$37,850']
  ]);

  await applyFilter('Plug-in Hybrid', [
    ['TUCSON Plug-in Hybrid', '$40,325']
  ]);

  await applyFilter('Hybrid', [
    ['PALISADE Hybrid', '$44,160'],
    ['SANTA FE Hybrid', '$36,400'],
    ['TUCSON Hybrid', '$32,450'],
    ['SONATA', '$26,900'],
    ['SONATA Hybrid', '$29,200'],
    ['ELANTRA Hybrid', '$25,450']
  ]);

  await applyFilter('Gasoline', [
    ['PALISADE', '$39,435'],
    ['SANTA FE', '$35,050'],
    ['TUCSON', '$29,450'],
    ['SONATA', '$27,450'],
    ['ELANTRA', '$22,625'],
    ['ELANTRA N', '$35,100'],
    ['KONA', '$25,500'],
    ['SANTA CRUZ', '$29,750'],
    ['VENUE', '$20,550']
  ]);

});