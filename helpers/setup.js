// helpers/setup.js

/**
 * Full page setup:
 * 1. Go to URL
 * 2. Handle ZIP modal
 * 3. Handle Cookie banner
 *
 * @param {object} page - Playwright page object
 * @param {string} url  - URL to navigate to
 * @param {string} zip  - ZIP code (default: '10010')
 */
async function pageSetup(page, url, zip = '10010') {

  // ── 1. Navigate ────────────────────────────────────────────────────────────
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 50_000 });
  await page.waitForTimeout(2_000);
  console.log(`  ✔ Navigated to ${url}`);

  // ── 2. ZIP modal ───────────────────────────────────────────────────────────
  try {
    const zipInput = page.getByRole('textbox', { name: /zip code/i });
    await zipInput.waitFor({ state: 'visible', timeout: 8_000 });
    await zipInput.fill(zip);
    await page.getByRole('button', { name: /confirm/i }).click();
    await page.waitForTimeout(2_000);
    console.log('  ✔ ZIP modal dismissed');
  } catch {
    // ZIP modal did not appear
  }

  // ── 3. Cookie banner ───────────────────────────────────────────────────────
  try {
    const cookieBtn = page
      .locator('.onetrust-close-btn-handler, #onetrust-accept-btn-handler')
      .first();
    await cookieBtn.waitFor({ state: 'visible', timeout: 8_000 });
    await cookieBtn.click();
    await page.waitForTimeout(1_500);
    console.log('  ✔ Cookie banner dismissed');
  } catch {
    // Cookie banner did not appear
  }

  // ── 4. Close any stray overlay ─────────────────────────────────────────────
  await page.mouse.click(10, 10);
  await page.waitForTimeout(1000);

  console.log('  ✔ Page setup complete\n');
}

module.exports = { pageSetup };
