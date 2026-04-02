// tests/footermenu/NavigationforPrivacy.spec.js

const { test } = require('@playwright/test');
const { pageSetup } = require('../../helpers/setup');

test.setTimeout(300_000);

test('Privacy & Site Map Navigation - Full Flow with Popups', async ({ page }) => {

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
  // 🔷 SITE MAP & PRIVACY FLOW
  // ============================================================
  await handleInternal(page.getByRole('link', { name: 'Site Map' }), 'Site Map');
  await handleInternal(page.getByRole('heading', { name: 'Site Map' }), 'Site Map heading');

  await handleInternal(page.getByRole('link', { name: "FAQ's" }), 'FAQ');
  await handleInternal(page.getByRole('heading', { name: 'Frequently Asked Questions' }), 'FAQ heading');

  await handleInternal(page.getByRole('link', { name: 'Accessibility', exact: true }), 'Accessibility');
  await handleInternal(page.getByText('Accessibility and inclusion'), 'Accessibility text');

  await handleInternal(page.getByRole('link', { name: 'Terms of Use' }), 'Terms of Use');
  await handleInternal(page.locator('#main').getByText('Terms of Use', { exact: true }), 'Terms of Use heading');

  await handleInternal(page.getByRole('link', { name: 'Privacy Notice' }), 'Privacy Notice');
  await handleInternal(page.getByText('Hyundai Motor America Privacy Notice', { exact: true }), 'Privacy Notice heading');

  await handleInternal(page.getByLabel('Your Privacy Choices'), 'Your Privacy Choices heading');
  await handleInternal(page.getByRole('heading', { name: 'Personal Information Request' }), 'Personal Information Request');

  // ─────────────────────────────────────────────
  // 🔷 HANDLE "Your Privacy Choices" POPUP
  // ─────────────────────────────────────────────
  await handlePopup(page.locator('footer').getByRole('link', { name: 'Your Privacy Choices' }), 'Your Privacy Choices');

  // ============================================================
  // 🔷 COOKIE PREFERENCES
  // ============================================================
  await handleInternal(page.getByRole('link', { name: 'Cookie Preferences' }), 'Cookie Preferences');
  await handleInternal(page.getByRole('heading', { name: 'Privacy Preference Center' }), 'Privacy Preference Center heading');
  await handleInternal(page.getByRole('button', { name: 'Close preference center' }), 'Close Preference Center');
  await handleInternal(page.getByRole('link', { name: 'Cookie Preferences' }), 'Cookie Preferences revisit');

  // ============================================================
  // ✅ TEST COMPLETED
  // ============================================================
  console.log('\n🎉 SITE MAP & PRIVACY NAVIGATION COMPLETED SUCCESSFULLY 🎉');
});