const Puppeteer = require('puppeteer');

module.exports = async function () {
  const windowSize = {
    width: 1920,
    height: 1080,
  };
  const args = [
    '--no-sandbox',
    '--font-render-hinting=none',
    '--force-color-profile=srgb|generic-rgb|color-spin-gamma24',
    `--window-size=${windowSize.width},${windowSize.height}`,
  ];
  const browser = await Puppeteer.launch({
    args,
    headless: true,
  })
  // await driver.launchBrowser();
  global.__BROWSER_GLOBAL__ = browser;
  console.log('setup ===================');
};