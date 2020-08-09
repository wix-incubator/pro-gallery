import puppeteer from 'puppeteer';

const devices = require('puppeteer/DeviceDescriptors');

export default class galleryDriver {
  constructor() {
    this.timeout = 60000;
    jest.setTimeout(40000)
    this.browser = {};
    this.windowSize = {
      width: 1920,
      height: 1080,
    };
  }

  async launchBrowser() {
    const args = [
      '--no-sandbox',
      '--font-render-hinting=none',
      '--force-color-profile=srgb|generic-rgb|color-spin-gamma24',
      `--window-size=${this.windowSize.width},${this.windowSize.height}`,
    ];
    this.browser = await puppeteer.launch({
      args,
      headless: true,
    })
    return this.browser;
  }

  async openPage(styleParams, device) {
    if (!this.browser) {
      await this.launchBrowser();
    }
    const page = await this.browser.newPage();
    switch (device) {
      case 'Android':
        await page.emulate(devices['Galaxy S5']);
        break;
      case 'iPhone':
        await page.emulate(devices['iPhone X']);
        break;
      default:
        await page.setViewport(this.windowSize);
    }
    const pageUrl = this.getPageUrl(styleParams);
    console.log('Testing page at: ', pageUrl);
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    this.page = page;
    await this.scrollInteraction();
    await page.waitFor(2500);
    return page;
  }

  async scrollInteraction(){
    await this.page.evaluate(() => { // scroll the gallery down and back up to make the items load
      window.scrollBy(0, 200);
      window.scrollBy(0, 0);
    });
  }

  async closeBrowser() {
    try {
      await this.browser.close();
    } catch (e) {
      //
    }
  }

  get find() {
    return {
      hook: async str => await this.page.$$(`[data-hook="${str}"]`),
      items: async () => await this.page.$$('.gallery-item-container'),
    };
  }

  get actions() {
    return {
      hover: async str => await this.page.hover(`[data-hook="${str}"]`),
      click: async str => await this.page.click(`[data-hook="${str}"]`),
      scroll: async (x, y) => await this.page.evaluate(() => {
        window.scrollBy(x, y);
      })
    };
  }
  getPageUrl(styleParams) {
    let urlParam = ''
    Object.keys(styleParams).map(sp => urlParam += `${sp}=${styleParams[sp]}&`);
    const url = `http://localhost:3000/?${urlParam}isTestEnvironment=true`;
    console.log('Openning URL:', url);
    return url;
  }
  get grab() {
    return {
      screenshot: async () => {
        return await this.page.screenshot()
      },
      elemScreenshot: async str => {
        const rootEl = await this.page.$(str);
        return rootEl.screenshot();
      },
      partialScreenshot: async () => {
        return await this.page.screenshot({
          clip: {
            x: 0,
            y: 0,
            height: 5000,
            width: this.windowSize.width
          }
        })
      },
    }
  }

  get waitFor() {
    return {
      hookToExist: async str =>
        await this.page.waitForSelector(`[data-hook="${str}"]`, {
          timeout: 3000,
        }),
      hookToBeVisible: async str =>
        await this.page.waitForSelector(`[data-hook="${str}"]`, {
          visible: true,
        }),
      hookToBeHidden: async str =>
        await this.page.waitForSelector(`[data-hook="${str}"]`, {
          hidden: true,
        }),
      timer: async time => await this.page.waitFor(time),
      newPage: async (timeoutSec = 5000) => {
        return new Promise((resolve, reject) => {
          this.browser.on('targetcreated', resolve);
          this.page.waitFor(timeoutSec).then(reject);
        });
      },
    };
  }
}