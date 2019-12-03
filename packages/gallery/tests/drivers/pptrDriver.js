import puppeteer from 'puppeteer';

const devices = require('puppeteer/DeviceDescriptors');

export default class galleryDriver {
  constructor() {
    this.timeout = 60000;
    this.browser = {};
    this.windowSize = {
      width: 1920,
      height: 1080,
    };
  }

  async launchBrowser() {
    const args = [
      '--no-sandbox',
      `--window-size=${this.windowSize.width},${this.windowSize.height}`,
    ];
    this.browser = await puppeteer.launch({
      args,
    })
    console.log('>>>>>>>>>>>>>>>>> this.browser', this.browser);
    return this.browser;
  }

  async openPage(styleParams, device) {
    if (!this.browser) {
      await this.launchBrowser();
    }
    console.log('>>>>>>>>>>>>>>>>> styleParams', styleParams )
    const page = await this.browser.newPage();
    console.log('>>>>>>>>>>>>>>>>> a new page', page)
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
    console.log('>>>>>>>>>>>>>>>>> page adjusted to devices', page)

    await page.goto(this.getPageUrl(styleParams), { waitUntil: 'networkidle2' });
    console.log('>>>>>>>>>>>>>>>>> page adjusted to devices', page)

    this.page = page;
    await this.scrollInteraction();
    await page.waitFor(2000);
    console.log('>>>>>>>>>>>>>>>>> before finishing with openPage', page)

    return page;
  }

  async scrollInteraction(){
    await this.page.evaluate(() => { // scroll the gallery down and back up to make the items load
      window.scrollBy(0, 200);
      window.scrollBy(0, 0);
    });
  }

  async closeBrowser() {
    console.log('>>>>>>>>>>>>>>>>> trying to close browser', page)

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
    return `http://localhost:3000/?${urlParam}isTestEnvironment=true`;
  }
  get grab() {
    return {
      screenshot: async () => {
        return await this.page.screenshot()
      }
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