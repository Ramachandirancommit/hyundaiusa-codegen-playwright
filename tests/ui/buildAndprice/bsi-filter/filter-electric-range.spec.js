const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(180000);

test('BSI Filter - Electric Range (Production Stable)', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  console.log('✔ Page setup complete');

  await page.getByRole('link', { name: 'Build & Price', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: /Build and Search Inventory/i })
  ).toBeVisible({ timeout: 30000 });

  console.log('✔ BSI page loaded');

  // =========================
  // OPEN FILTER (SAFE)
  // =========================
  async function ensureFilterOpen() {
    const btn = page.getByRole('button', { name: 'Electric Range' });
    const slider = page.getByRole('slider', { name: 'Electric Range' });

    const isOpen = await slider.isVisible().catch(() => false);

    if (!isOpen) {
      await expect(btn).toBeVisible({ timeout: 30000 });
      await btn.click();
      await page.waitForTimeout(1500);
    }
  }

  // =========================
  // WAIT FOR STABLE UI CHANGE
  // =========================
  async function waitForStableCards(prevCount = -1) {

    const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');

    await expect(cards.first()).toBeVisible({ timeout: 30000 });

    let stableCount = -1;

    for (let i = 0; i < 10; i++) {

      const count = await cards.count();

      if (count === stableCount && count !== prevCount) {
        break;
      }

      stableCount = count;

      await page.waitForTimeout(1000);
    }

    return stableCount;
  }

  // =========================
  // SET RANGE (SAFE + RETRY)
  // =========================
  async function setRange(value) {

    const slider = page.getByRole('slider', { name: 'Electric Range' });

    await expect(slider).toBeVisible({ timeout: 30000 });

    await slider.click({ force: true });
    await page.waitForTimeout(500);

    await slider.fill(String(value));

    // IMPORTANT: wait for network + render settle
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);
  }

  // =========================
  // VALIDATE
  // =========================
  async function validate(value, expected) {

    const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');

    const count = await cards.count();

    console.log(`📦 Range ${value} | Expected: ${expected} | Actual: ${count}`);

    expect(count).toBe(expected);
  }

  // =========================
  // RUN FLOW
  // =========================
  async function run(value, expected) {

    console.log(`\n========== RANGE ${value} ==========`);

    await ensureFilterOpen();

    const cards = page.locator('#bsi-vehicle-cards .bsi-model-card-container');
    const prevCount = await cards.count();

    await setRange(value);

    const stableCount = await waitForStableCards(prevCount);

    await validate(value, expected);

    console.log(`🎉 RANGE ${value} DONE (stable: ${stableCount})\n`);
  }

  // =========================
  // TEST DATA
  // =========================
  const ranges = [
    { value: 50, expected: 5 },
    { value: 100, expected: 5 },
    { value: 150, expected: 5 },
    { value: 200, expected: 5},
    { value: 250, expected: 4 },
    { value: 300, expected: 3 },
    { value: 342, expected: 1 }
  ];

  for (const r of ranges) {
    await run(r.value, r.expected);
  }

});