// tests/footermenu/why-hyundai.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../helpers/setup');

test.setTimeout(300_000);

test('Why Hyundai - Navigate all links', async ({ page }) => {

  // ── Setup: navigate + ZIP + cookie ────────────────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ── Why Hyundai menu ──────────────────────────────────────────────────────
  await page.getByRole('heading', { name: 'why hyundai list of links' }).click();

  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await page.getByRole('link', { name: 'Selected Overview' }).click();

  await page.getByRole('link', { name: "America's Best Warranty", exact: true }).click();
  await page.getByRole('heading', { name: "America's Best Warranty" }).click();

  await page.getByRole('link', { name: 'Shopper Assurance', exact: true }).click();
  await page.getByRole('heading', { name: 'Shopper Assurance', exact: true }).click();

  await page.locator('div:nth-child(2) > .utce-tile-icon-section').click();

  await page.getByRole('link', { name: 'Owner Assurance' }).click();
  await page.locator('.generic-hero-content-contain').click();

  await page.getByRole('link', { name: 'Complimentary Maintenance', exact: true }).click();
  await page.getByRole('heading', { name: 'Hyundai Complimentary' }).click();

  await page.getByRole('link', { name: 'Happy Drivers' }).click();
  await expect(page.locator('h1.hero-enhanced-title')).toBeVisible();


  // ── Footer links ──────────────────────────────────────────────────────────
  await page.locator('footer').getByRole('link', { name: 'Philanthropy' }).click();
  await expect(page.locator('span:has-text("Community")')).toBeVisible();

  await page.locator('footer').getByRole('link', { name: 'Hyundai in America' }).click();
  await page.getByRole('heading', { name: "40 years in America. And we'" }).click();

  await page.getByRole('link', { name: 'Build for Tomorrow' }).click();
  await page.getByRole('heading', { name: 'What are we doing for' }).click();

  // ── Social Responsibility (opens new tab) ─────────────────────────────────
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Social Responsibility' }).click(),
  ]);

  await popup.waitForLoadState('domcontentloaded');
  console.log(`  ✔ Social Responsibility opened: ${popup.url()}`);
  await popup.close();

  console.log('\n✅ Why Hyundai navigation test completed successfully!');
});