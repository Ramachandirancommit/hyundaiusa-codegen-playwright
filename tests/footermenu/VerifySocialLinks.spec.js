import { test, expect } from '@playwright/test';

// Test Case 1: Social Media Links
test('Social Media Links', async ({ page }) => {
  await page.goto('https://www.hyundaiusa.com/us/en');

  // Set ZIP Code
  await page.getByRole('textbox', { name: 'ZIP Code' }).click();
  await page.getByRole('textbox', { name: 'ZIP Code' }).fill('10010');
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('button', { name: 'Close' }).click();

  // Facebook
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Find us on Facebook' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Facebook' }).click();
  const page2Promise = page1.waitForEvent('popup');
  await page1.getByRole('button', { name: 'Create new account' }).click();
  await page2Promise;

  // Twitter
  const page3Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Follow us on Twitter' }).click();
  const page3 = await page3Promise;
  await page3.getByText('Hyundai USA').first().click();
  await page3.getByTestId('UserName').getByText('Hyundai USA').click();

  // Instagram
  const page4Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Instagram' }).click();
  const page4 = await page4Promise;
  await page4.getByRole('button', { name: 'Log in' }).click();
  await page4.locator('div').filter({ hasText: /^See everyday moments from your close friends\.$/ }).nth(3).click();

  // Pinterest
  const page5Promise = page.waitForEvent('popup');
  await page.getByRole('list').filter({ hasText: '.hyundaiGray{fill:#bababa;}' }).click();
  const page5 = await page5Promise;
  await page5.getByLabel('HyundaiUSA, Verified').getByText('HyundaiUSA').click();

  // Pinterest Home
  const page6Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Pinterest' }).click();
  const page6 = await page6Promise;
  await page6.getByRole('link', { name: 'Pinterest home' }).click();

  // Email
  const page7Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Email' }).click();
  const page7 = await page7Promise;
  await page7.locator('div:nth-child(62) > .fxloader-overlay').click();
});

