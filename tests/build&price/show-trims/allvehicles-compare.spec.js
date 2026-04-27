const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../helpers/setup');

test.setTimeout(300000); // 5 minutes just in case

test('Build & Price - PALISADE compare flow (recode)', async ({ page }) => {
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');
  await page.waitForTimeout(2000);

  // Enhanced safeClick: scroll + wait + log
  async function safeClick(locator, description = '', options = {}) {
    if (await locator.count() > 0) {
      try {
        await locator.first().waitFor({ state: 'visible', timeout: 20000 });
        await locator.first().scrollIntoViewIfNeeded();
        await locator.first().click(options);
        await page.waitForTimeout(1000);

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

  // Handle ZIP modal if present
  const zipInput = page.getByRole('textbox', { name: 'ZIP Code' });
  if (await zipInput.count() > 0) {
    try {
      await zipInput.first().click();
      await zipInput.first().fill('10010');
      await page.waitForTimeout(500);
      await safeClick(page.getByRole('button', { name: 'Confirm' }), 'Confirm ZIP');
      await page.waitForTimeout(500);
      await safeClick(page.getByRole('button', { name: 'Close' }), 'Close ZIP modal');
    } catch (e) {
      console.log('ZIP modal handling skipped or failed:', e.message);
    }
  }

  // Navigate to Build & Price
  await safeClick(page.getByRole('link', { name: 'Build & Price' }).first(), 'Build & Price');
  await page.waitForTimeout(3000);

  // Show trims and select year tab
  await safeClick(page.getByRole('button', { name: 'Show Trims' }).first(), 'Show Trims');
  await page.waitForTimeout(1000);
  await safeClick(page.getByRole('button', { name: 'year tab' }).first(), 'Year Tab');
  await page.waitForTimeout(1000);

  // Select the PALISADE group (matches text seen in original script)
  await safeClick(page.getByText('PALISADE 1 - 2 of 7 matches').first(), 'PALISADE group');
  await page.waitForTimeout(1000);

  // Compare interactions
  await safeClick(page.getByRole('button', { name: 'Compare' }).first(), 'Compare (first)');
  await page.waitForTimeout(1000);
  await safeClick(page.getByRole('button', { name: 'Remove trim' }), 'Remove trim');
  await page.waitForTimeout(1000);
  await safeClick(page.getByRole('button', { name: 'Compare' }).first(), 'Compare (after remove)');
  await page.waitForTimeout(1000);

  // Click a specific SE heading instance (match the original intent)
  const seHeadings = page.getByRole('heading', { name: 'SE' });
  if (await seHeadings.count() > 3) {
    await safeClick(seHeadings.nth(3), 'SE heading (nth 3)');
    await page.waitForTimeout(500);
  } else if (await seHeadings.count() > 0) {
    await safeClick(seHeadings.first(), 'SE heading (fallback first)');
    await page.waitForTimeout(500);
  }

  // Select trims in comparison drawer (multiple clicks to mirror original behavior)
  await safeClick(page.getByText('Select trim').first(), 'Select trim (first)');
  await page.waitForTimeout(500);
  if ((await page.getByText('Select trim').count()) > 1) {
    await safeClick(page.getByText('Select trim').nth(1), 'Select trim (second)');
    await page.waitForTimeout(500);
  }

  // Some pages require repeated clicks; mirror original script's repeated clicks safely
  for (let i = 0; i < 3; i++) {
    const maybeCompareText = page.getByText('SE Select trimSelect trim Compare');
    if (await maybeCompareText.count() > 0) {
      await safeClick(maybeCompareText.first(), `SE Select trim sequence (${i + 1})`);
      await page.waitForTimeout(400);
    } else {
      break;
    }
  }

  // Close comparison drawer if present
  await safeClick(page.getByRole('button', { name: 'Close comparison drawer' }).first(), 'Close comparison drawer');

  await page.waitForTimeout(1000);
  console.log('\n🎉 PALISADE compare flow (recode) completed');
});
