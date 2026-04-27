const { test } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');
const { safeClick } = require('../../../../../helpers/actions');

test('Why Hyundai Full Navigation Coverage', async ({ page }) => {

  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // 🔹 Open Menu
  await safeClick(page, page.getByRole('button', { name: 'Global Menu' }));

  // ============================================================
  // 🔹 Overview Flow
  // ============================================================
  await safeClick(page, page.locator('#menu').getByText('Why Hyundai'));
  await safeClick(page, page.getByRole('link', { name: 'Overview' }));
  await safeClick(page, page.getByRole('link', { name: 'Selected Overview' }), 'Why Hyundai');

  // ============================================================
  // 🔹 Hyundai in America
  // ============================================================
  await safeClick(page, page.getByRole('button', { name: 'Global Menu' }));
  await safeClick(page, page.getByRole('link', { name: 'Hyundai in America' }), '40 years in America');

  // ============================================================
  // 🔹 Building for Tomorrow
  // ============================================================
  await safeClick(page, page.getByRole('button', { name: 'Global Menu' }));
  await safeClick(page, page.getByRole('link', { name: 'Building for Tomorrow' }), 'What are we doing for');

  // ============================================================
  // 🔹 Shopper Assurance
  // ============================================================
  await safeClick(page, page.getByRole('button', { name: 'Global Menu' }));
  await safeClick(page, page.getByRole('link', { name: 'Shopper Assurance' }), 'Shopper Assurance');

});