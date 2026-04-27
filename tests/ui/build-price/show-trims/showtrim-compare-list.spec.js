//all vehicles show trim compare list

import { test, expect } from '@playwright/test';
import { pageSetup } from '../../../helpers/setup';

test.setTimeout(180000);

test('Palisade Trim Slider Flow - Final Stable', async ({ page }) => {

  // ─────────────────────────────
  // Setup (URL + ZIP + Cookies inside setup.js)
  // ─────────────────────────────
  await pageSetup(page, 'https://www.hyundaiusa.com/us/en');

  // ─────────────────────────────
  // Step 1: Click Build & Price
  // ─────────────────────────────
  const buildPrice = page.locator('a[href*="build"]').first();
  await buildPrice.waitFor({ state: 'visible' });
  await buildPrice.click();
  await page.waitForLoadState('networkidle');

  console.log('✔ Build & Price clicked');

  // ─────────────────────────────
  // Step 2: Select PALISADE
  // ─────────────────────────────
  const palisade = page.getByRole('heading', { name: 'PALISADE', exact: true });
  await palisade.waitFor({ state: 'visible' });
  await palisade.click();
  await page.waitForLoadState('networkidle');

  console.log('✔ PALISADE selected');

  // ─────────────────────────────
  // Step 3: Click Show Trims
  // ─────────────────────────────
  await page.evaluate(() => window.scrollBy(0, 400));

  const showTrims = page.locator('button.bsi-trims-button').first();
  await showTrims.waitFor({ state: 'visible' });
  await showTrims.click();

  console.log('✔ Show Trims clicked');

  // Wait for carousel to load (REAL slides only)
  const selectedTrim = page.locator(
    '.bsi-flkty-cell.is-selected:not(.is-cloned)'
  );
  await selectedTrim.first().waitFor({ state: 'visible' });

  console.log('✔ Trim carousel loaded');

  // ─────────────────────────────
  // Helper: Get current selected index (ignore clones)
  // ─────────────────────────────
  async function getSelectedIndex() {
    return await page.evaluate(() => {
      const cells = document.querySelectorAll(
        '.bsi-flkty-cell:not(.is-cloned)'
      );

      for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains('is-selected')) {
          return i;
        }
      }
      return -1;
    });
  }

  // ─────────────────────────────
  // Helper: Wait for slider movement
  // ─────────────────────────────
  async function waitForSliderChange(previousIndex) {
    await page.waitForFunction(
      (prev) => {
        const cells = document.querySelectorAll(
          '.bsi-flkty-cell:not(.is-cloned)'
        );

        let currentIndex = -1;

        for (let i = 0; i < cells.length; i++) {
          if (cells[i].classList.contains('is-selected')) {
            currentIndex = i;
          }
        }

        return currentIndex !== prev;
      },
      previousIndex,
      { timeout: 10000 }
    );
  }

  const nextBtn = page.getByRole('button', { name: /Direction next/i });
  const prevBtn = page.getByRole('button', { name: /Direction previous/i });

  // ─────────────────────────────
  // Step 4: Move NEXT 3 times
  // ─────────────────────────────
  for (let i = 0; i < 3; i++) {
    const previousIndex = await getSelectedIndex();

    await nextBtn.click();
    await waitForSliderChange(previousIndex);

    console.log(`✔ Slider moved NEXT (${i + 1})`);
  }

  // ─────────────────────────────
  // Step 5: Move PREVIOUS 3 times
  // ─────────────────────────────
  for (let i = 0; i < 3; i++) {
    const previousIndex = await getSelectedIndex();

    await prevBtn.click();
    await waitForSliderChange(previousIndex);

    console.log(`✔ Slider moved PREVIOUS (${i + 1})`);
  }

  // ─────────────────────────────
  // Step 6: Click Each Trim Card (Stable)
  // ─────────────────────────────
  const trimCards = page.locator(
    '.bsi-flkty-cell:not(.is-cloned) .bsi-trim-card'
  );

  const trimCount = await trimCards.count();
  console.log('Total real trims:', trimCount);

  for (let i = 0; i < trimCount; i++) {
    await trimCards.nth(i).click();
    await page.waitForTimeout(800);
  }

  console.log('✅ Palisade Trim Slider Flow Completed Successfully');
});