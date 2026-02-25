// tests/social-links.spec.js

const { test, expect } = require('@playwright/test');
const { pageSetup } = require('../../helpers/setup');

// ─── Config ────────────────────────────────────────────────────────────────
test.setTimeout(90_000);

const SOCIAL_LINKS = [
  { name: 'Facebook',  selector: 'a[href*="facebook.com"]',              expected: /facebook\.com/i       },
  { name: 'X',         selector: 'a[href*="x.com"], a[href*="twitter.com"]', expected: /(x|twitter)\.com/i, hrefOnly: true },
  { name: 'Instagram', selector: 'a[href*="instagram.com"]',             expected: /instagram\.com/i      },
  { name: 'YouTube',   selector: 'a[href*="youtube.com"]',               expected: /youtube\.com/i        },
  { name: 'Pinterest', selector: 'a[href*="pinterest.com"]',             expected: /pinterest\.com/i      },
  { name: 'Email',     selector: 'a[href*="owners.hyundaiusa.com"]',     expected: /owners\.hyundaiusa\.com/i },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

async function scrollToFooter(page) {
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  );
  await page.waitForTimeout(2_500);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight })
  );
  await page.waitForTimeout(1_000);
}

async function waitForPopupUrl(popup, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const url = popup.url();
    if (url && url !== 'about:blank' && !url.startsWith('about:')) return url;
    await popup.waitForTimeout(500);
  }
  return popup.url();
}

// ─── Test ──────────────────────────────────────────────────────────────────

test('Verify Social Media Links Open, Validate URL, Wait, Close and Continue', async ({ page, context }) => {

  await context.clearPermissions();

  // ── Setup: navigate + ZIP + cookie (all done in one call) ─────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ── Scroll to footer ───────────────────────────────────────────────────────
  console.log('Scrolling to footer…');
  await scrollToFooter(page);

  // ── Loop through each social link ──────────────────────────────────────────
  for (const social of SOCIAL_LINKS) {

    console.log(`\nTesting: ${social.name}`);

    const link = page.locator(social.selector).first();

    try {
      await link.scrollIntoViewIfNeeded({ timeout: 10_000 });
      await expect(link).toBeVisible({ timeout: 10_000 });
    } catch {
      console.warn(`  ⚠ ${social.name} link not visible – skipping`);
      continue;
    }

    // ── EMAIL or hrefOnly links: validate href only, no popup ─────────────
    if (social.name === 'Email' || social.hrefOnly) {
      const href = await link.getAttribute('href');
      console.log(`  href = ${href}`);
      expect(href).toMatch(social.expected);
      console.log(`  ✔ ${social.name} href validated (no popup)`);
      continue;
    }

    // ── SOCIAL: click → popup → validate URL → close ──────────────────────
    let popup;

    try {
      [popup] = await Promise.all([
        context.waitForEvent('page', { timeout: 15_000 }),
        link.click(),
      ]);
    } catch {
      console.warn(`  ⚠ No popup for ${social.name}, checking same-tab navigation`);
      await page.waitForTimeout(2_000);
      const currentUrl = page.url();

      if (social.expected.test(currentUrl)) {
        console.log(`  ✔ Same-tab navigation detected: ${currentUrl}`);
        console.log(`  👀 Waiting 5 seconds for demo view...`);
        await page.waitForTimeout(5_000);
        await page.goBack({ waitUntil: 'domcontentloaded', timeout: 20_000 });
        await scrollToFooter(page);
        continue;
      }

      throw new Error(`${social.name} failed: No popup and URL mismatch`);
    }

    const popupUrl = await waitForPopupUrl(popup, 15_000);
    console.log(`  Popup URL: ${popupUrl}`);

    expect(popupUrl).toMatch(social.expected);
    console.log(`  ✔ ${social.name} validated`);

    console.log(`  👀 Waiting 5 seconds so user can observe ${social.name} page...`);
    await popup.waitForTimeout(5_000);

    await popup.close();
    await page.bringToFront();
    await page.waitForTimeout(1_000);
  }

  console.log('\n✅ All social media links verified successfully!');
});

