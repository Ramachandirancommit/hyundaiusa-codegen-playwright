// Test Case 2: Vehicle Navigation
test('Vehicle Navigation', async ({ page }) => {
  await page.goto('https://www.hyundaiusa.com/us/en');

  // Vehicle Navigation Steps
  await page.locator('div:nth-child(62) > .fxloader-overlay').click();
  await page.getByRole('heading', { name: 'Vehicles' }).click();
  await page.getByRole('link', { name: 'All Vehicles' }).click();
  await page.getByText('Popular filters').click();
  await page.getByRole('link', { name: 'Electrified', exact: true }).click();
  await page.getByRole('link', { name: 'Charging', exact: true }).click();
  await page.getByRole('link', { name: 'Electrified', exact: true }).click();
  await page.locator('footer').getByRole('link', { name: 'SUVs' }).click();
  await page.getByRole('link', { name: 'Selected SUVs' }).click();
  await page.locator('footer').getByRole('link', { name: 'Sedans' }).click();
  await page.locator('a').filter({ hasText: /^Hybrid$/ }).click();
  await page.locator('a').filter({ hasText: 'Electric' }).click();
  await page.getByRole('link', { name: 'Learn more about Hyundai' }).click();
  await page.locator('a').filter({ hasText: 'N Vehicles' }).click();
  await page.getByRole('link', { name: 'All Wheel Drive' }).click();

  // Vehicle Reviews Popup
  const page8Promise = page.waitForEvent('popup');
  await page.getByRole('listitem').filter({ hasText: 'Vehicle Reviews' }).click();
  const page8 = await page8Promise;
  await page8.getByRole('link', { name: 'SureCritic Logo' }).click();
  await page.getByRole('link', { name: 'Vehicle Brochures' }).click();
  await page.getByRole('heading', { name: 'Hyundai Brochures' }).click();
  await page.getByRole('link', { name: 'Safety', exact: true }).click();
  await page.getByRole('heading', { name: 'Hyundai SmartSense' }).click();
  await page.getByRole('heading', { name: 'Advanced safety comes' }).click();
  await page.getByRole('link', { name: 'Technology', exact: true }).click();
  await page.getByRole('heading', { name: 'Hyundai Technology' }).click();

  // Genesis Popup
  const page9Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Genesis' }).click();
  const page9 = await page9Promise;
  await page9.getByRole('region', { name: 'Cookie banner' }).click();
});