/* global benchmark */

benchmark('demo marks', async ({page, waitForMark}) => {
  await page.goto('http://localhost:6661');
    //await waitForMark('mount', { timeout: 300000 });
});
