// tests/footermenu/NavigationforOwnerLink.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../../../../helpers/setup');

test.setTimeout(400_000); // extra buffer for slow loading

test('Owner Section - Full Navigation with Popups & Overlay Fix', async ({ page }) => {

  // ─────────────────────────────────────────────
  // SETUP
  // ─────────────────────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ============================================================
  // 🔷 SAFE CLICK (handles overlays automatically)
  // ============================================================
  async function safeClick(locator, options = {}) {
    if ((await locator.count()) === 0) return;

    // Retry removing overlays 2 times
    for (let retry = 0; retry < 2; retry++) {
      await page.evaluate(() => {
        document.querySelectorAll('.msc-gradient').forEach(el => el.remove());
      });
      await page.waitForTimeout(500);
    }

    // Wait until the element is attached, visible, and enabled
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
      page.waitForEvent('popup', { timeout: 50000 }),
      safeClick(linkLocator),
    ]);

    await popup.waitForLoadState('domcontentloaded');
    await popup.waitForTimeout(3000);
    await popup.close();

    await page.bringToFront();
    await page.waitForTimeout(2000);

    console.log(`✔ ${label} - popup handled`);
  }

  // ============================================================
  // 🔷 HANDLE INTERNAL LINKS (Same Tab)
  // ============================================================
  async function handleInternal(linkLocator, label) {
    if ((await linkLocator.count()) === 0) return;

    await locatorWaitVisible(linkLocator);
    await safeClick(linkLocator);
    await page.waitForTimeout(2000);

    console.log(`✔ ${label} - internal handled`);
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
    await safeClick(page.getByRole('button', { name: 'Confirm' }));
    await safeClick(page.getByRole('button', { name: 'Close' }));
  }

  // ============================================================
  // 🔷 OWNER MENU OPEN
  // ============================================================
  await safeClick(page.getByRole('heading', { name: /owner/i }));

  // ============================================================
  // 🔷 POPUP LINKS (NEW TAB)
  // ============================================================
  const popupLinks = [
    'Login to MyHyundai',
    'Make a Payment',
    'Bluelink® Multimedia/Map',
    'Owners Manuals',
    'Accessories',
    'Merchandise & Apparel',
    'Safety Recalls',
    'Engine Recalls',
    'Theta Engine Settlement',
    'ABS Module Class Action',
    'Engine II Settlement',
  ];

  for (const label of popupLinks) {
    await handlePopup(page.getByRole('link', { name: label }), label);
  }

  // ============================================================
  // 🔷 INTERNAL LINKS
  // ============================================================
  const internalLinks = [
    { name: 'Maintenance Schedules', label: 'Maintenance Schedules' },
    { name: /Roadside Assistance/i, label: '24/7 Roadside Assistance' },
    { name: 'Bluelink+', label: 'Bluelink+' },
    { name: 'Written Notice for California', label: 'Written Notice for California' },
  ];

  for (const item of internalLinks) {
    await handleInternal(page.getByRole('link', { name: item.name }), item.label);
  }

  // ============================================================
  // ✅ TEST COMPLETED
  // ============================================================
  console.log('\n🎉 OWNER SECTION FULL NAVIGATION COMPLETED SUCCESSFULLY 🎉');
});