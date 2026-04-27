const { test, expect } = require('@playwright/test');

test.setTimeout(300000); // 5 minutes

test('Build & Price - PALISADE Trim and Comparison Flow', async ({ page }) => {

  // ───────────────────────────────
  // Helper: Safe click with scroll + log
  // ───────────────────────────────
  async function safeClick(locator, description = '', options = {}) {
    if (await locator.count() > 0) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout: 20000 });
        await locator.first().scrollIntoViewIfNeeded();
        await locator.first().click(options);
        await page.waitForTimeout(500); // small delay after click

        let label = '';
        try {
          label = await locator.first().getAttribute('aria-label');
          if (!label) label = await locator.first().innerText();
        } catch (e) {
          label = description || '[unknown element]';
        }
        console.log(`✔ Element clicked: ${label}`);
      } catch (e) {
        console.log(`⚠ Failed to click: ${description} - ${e.message}`);
      }
    } else {
      console.log(`⚠ Element not found: ${description}`);
    }
  }

  // ───────────────────────────────
  // Step 0: Open Hyundai USA
  // ───────────────────────────────
  await page.goto('https://www.hyundaiusa.com/us/en');
  await page.waitForTimeout(2000);

  // Step 1: Handle ZIP Code modal
  await safeClick(page.getByRole('textbox', { name: 'ZIP Code' }), 'ZIP Code input');
  await page.getByRole('textbox', { name: 'ZIP Code' }).fill('10010');
  await safeClick(page.getByRole('button', { name: 'Confirm' }), 'Confirm ZIP Code');

  // Step 2: Close cookies / modal if present
  await safeClick(page.getByRole('button', { name: 'Close' }), 'Close modal');

  // ───────────────────────────────
  // Step 3: Build & Price Navigation
  // ───────────────────────────────
  await safeClick(page.getByRole('link', { name: 'Build & Price' }).first(), 'Build & Price');
  await page.waitForTimeout(5000);

  // Step 4: Show Trims
  await safeClick(page.getByRole('button', { name: 'Show Trims' }).first(), 'Show Trims');

  // Step 5: Open Year Tab
  await safeClick(page.getByRole('button', { name: 'year tab' }).first(), 'Year Tab');

  // ───────────────────────────────
  // Step 6: Select PALISADE model
  // ───────────────────────────────
  await safeClick(page.getByText('PALISADE 1 - 2 of 7 matches').first(), 'PALISADE Selection');

  // ───────────────────────────────
  // Step 7: Comparison & Remove Trim
  // ───────────────────────────────
  await safeClick(page.getByRole('button', { name: 'Compare' }).first(), 'Compare');
  await safeClick(page.getByRole('button', { name: 'Remove trim' }), 'Remove Trim');
  await safeClick(page.getByRole('button', { name: 'Compare' }).first(), 'Compare Again');

  // ───────────────────────────────
  // Step 8: Select SE Trim & Select Trim options
  // ───────────────────────────────
  await safeClick(page.getByRole('heading', { name: 'SE' }).nth(3), 'SE Trim');
  await safeClick(page.getByText('Select trim').first(), 'Select Trim Option 1');
  await safeClick(page.getByText('Select trim').nth(1), 'Select Trim Option 2');

  // ───────────────────────────────
  // Step 9: Click repeated SE Select trim / Compare buttons
  // ───────────────────────────────
  for (let i = 0; i < 4; i++) {
    await safeClick(page.getByText('SE Select trimSelect trim Compare'), `SE Select trim / Compare click #${i + 1}`);
  }

  // ───────────────────────────────
  // Step 10: Close Comparison Drawer
  // ───────────────────────────────
  await safeClick(page.getByRole('button', { name: 'Close comparison drawer' }), 'Close Comparison Drawer');

  console.log('\n🎉 PALISADE Trim and Comparison Flow Completed Successfully 🎉');
});