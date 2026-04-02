// tests/footermenu/NavigationforShoppingTools.spec.js

const { test } = require('@playwright/test');
const { pageSetup } = require('../../helpers/setup');

test.setTimeout(400_000);

test('Shopping Tools - Full Navigation with Popups & Overlay Safe Click', async ({ page }) => {

  // ─────────────────────────────────────────────
  // SETUP
  // ─────────────────────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ============================================================
  // 🔷 SAFE CLICK (handles overlays automatically)
  // ============================================================
  async function safeClick(locator, options = {}) {
    if ((await locator.count()) === 0) return;

    // Remove overlays dynamically
    await page.evaluate(() => {
      document.querySelectorAll('.msc-gradient, .generic-hero-gradient-overlay').forEach(el => el.remove());
    });

    // Wait until the element is visible
    await locator.first().waitFor({ state: 'visible', timeout: 15000 });
    await locator.first().click({ force: true, ...options });
    await page.waitForTimeout(2000);
  }

  // ============================================================
  // 🔷 HANDLE POPUP LINKS (New Tab)
  // ============================================================
  async function handlePopup(linkLocator, label) {
    if ((await linkLocator.count()) === 0) return;

    const [popup] = await Promise.all([
      page.waitForEvent('popup', { timeout: 30000 }),
      safeClick(linkLocator),
    ]);

    await popup.waitForLoadState('domcontentloaded');
    await popup.waitForTimeout(2000);

    console.log(`✔ ${label} - popup opened`);
    await popup.close();
    await page.bringToFront();
    await page.waitForTimeout(2000);
  }

  // ============================================================
  // 🔷 HANDLE INTERNAL LINKS (Same Tab)
  // ============================================================
  async function handleInternal(linkLocator, label) {
    if ((await linkLocator.count()) === 0) return;

    await locatorWaitVisible(linkLocator);
    await safeClick(linkLocator);
    console.log(`✔ ${label} - internal navigation done`);
  }

  // Wait until locator is visible
  async function locatorWaitVisible(locator, timeout = 15000) {
    await locator.first().waitFor({ state: 'visible', timeout });
  }

  // ============================================================
  // 🔷 ZIP HANDLING
  // ============================================================
  const zip = page.getByRole('textbox', { name: 'ZIP Code' });
  if (await zip.isVisible()) {
    await zip.fill('10010');
    await zip.press('Enter');
    await safeClick(page.getByRole('button', { name: 'Confirm' }));
    await safeClick(page.getByRole('button', { name: 'Close' }));
  }

  // ============================================================
  // 🔷 SHOPPING TOOLS FLOW
  // ============================================================
  await safeClick(page.getByRole('heading', { name: 'Shopping Tools' }));

  const internalLinks = [
    { name: 'Shop Hyundai', label: 'Shop Hyundai' },
    { name: 'Find a Dealer', label: 'Find a Dealer' },
    { name: 'Build & Search Inventory', label: 'Build & Search Inventory' },
    { name: 'Offers & Promotions', label: 'Offers & Promotions' },
    { name: 'Special Programs', label: 'Special Programs' },
    { name: 'Request a Quote', label: 'Request a Quote' },
    { name: 'Schedule a Test Drive', label: 'Schedule a Test Drive' },
    { name: 'Search Certified Used Vehicles', label: 'Search Certified Used Vehicles' },
    { name: 'Compare our Vehicles', label: 'Compare our Vehicles' },
    { name: 'Compare to Competitors', label: 'Compare to Competitors' },
    { name: 'Calculate a Payment', label: 'Calculate a Payment' },
  ];

  for (const item of internalLinks) {
    await handleInternal(page.getByRole('link', { name: item.name }), item.label);
    await handleInternal(page.getByRole('heading', { name: new RegExp(item.label, 'i') }), `${item.label} heading`);
  }

  // ============================================================
  // 🔷 POPUP LINKS
  // ============================================================
  const popupLinks = [
    { name: 'Calculate Trade-in Value', label: 'Trade-in Value' },
    { name: 'Apply for Credit', label: 'Apply for Auto Financing' },
    { name: 'Hyundai Showroom Live', label: 'Hyundai Showroom Live' },
  ];

  for (const item of popupLinks) {
    await handlePopup(page.getByRole('link', { name: item.name }), item.label);
  }

  // ============================================================
  // ✅ TEST COMPLETED
  // ============================================================
  console.log('\n🎉 SHOPPING TOOLS FULL NAVIGATION COMPLETED SUCCESSFULLY 🎉');
});