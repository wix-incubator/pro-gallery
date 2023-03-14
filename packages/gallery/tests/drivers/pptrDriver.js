import puppeteer, { devices } from 'puppeteer';
import { flattenObject } from 'pro-gallery-lib';

const timeout = (ms) => new Promise((res) => setTimeout(res, ms));
export default class galleryDriver {
  constructor() {
    this.timeout = 60000;
    jest.setTimeout(40000);
    /** @type{import('puppeteer').Browser} */
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
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
      `--window-size=${this.windowSize.width},${this.windowSize.height}`,
    ];
    this.browser = await puppeteer.launch({
      args,
      headless: true,
    });
    return this.browser;
  }

  /** @type{import('puppeteer'.Page)} */
  page = {};
  async openPage(device) {
    await this.launchBrowser();
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
    this.page = page;
    return page;
  }

  async navigate(options, thenWait = 500) {
    const pageUrl = this.getPageUrl(options);
    await this.page.goto(pageUrl, { waitUntil: 'networkidle2' });
    await timeout(thenWait);
    await this.speedUpAnimations();
    await this.scrollInteraction();
    return this.page;
  }

  async speedUpAnimations() {
    await this.page.evaluate(() => {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = `
        *, *::before, *::after {
          transition-duration: 0s !important;
          animation-duration: 0s !important;
          animation-iteration-count: 1 !important;
          transition-delay: 0s !important;
          animation-delay: 0s !important;
        }
      `;
      const allElements = document.getElementsByTagName('*');
      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        element.style.transitionDuration = '0s';
        element.style.animationDuration = '0s';
        element.style.animationIterationCount = '1';
        element.style.transitionDelay = '0s';
        element.style.animationDelay = '0s';
      }
      document.getElementsByTagName('head')[0].appendChild(style);
    });
  }

  async scrollInteraction() {
    await this.page.evaluate(() => {
      // scroll the gallery down and back up to make the items load
      window.scrollBy(0, 200);
      window.scrollBy(0, 0);
    });
  }

  async closePage() {
    try {
      await this.browser.close();
    } catch (e) {
      //
    }
  }

  get find() {
    return {
      hook: async (str) => await this.page.$$(`[data-hook="${str}"]`),
      items: async () => await this.page.$$('.gallery-item-container'),
    };
  }

  get actions() {
    return {
      hover: async (str, thenWait = 1000) =>
        await this.page
          .hover(`[data-hook="${str}"]`)
          .then(() => timeout(thenWait)),
      click: async (str) => await this.page.click(`[data-hook="${str}"]`),
      scroll: async (x, y) =>
        await this.page.evaluate(() => {
          window.scrollBy(x, y);
        }),
    };
  }
  getPageUrl(options) {
    let urlParam = '';
    let flatSP = flattenObject(options);
    Object.keys(flatSP).map((sp) => (urlParam += `${sp}=${flatSP[sp]}&`));
    const url = `http://localhost:3006/?${urlParam}isTestEnvironment=true`;
    console.log('testing link: ', url);
    return url;
  }
  get grab() {
    return {
      screenshot: async () => {
        return await this.page.screenshot();
      },
      elemScreenshot: async (str) => {
        const rootEl = await this.page.$(str);
        return rootEl.screenshot();
      },
      partialScreenshot: async () => {
        return await this.page.screenshot({
          clip: {
            x: 0,
            y: 0,
            height: 5000,
            width: this.windowSize.width,
          },
        });
      },
    };
  }

  get waitFor() {
    return {
      hookToExist: async (str) =>
        await this.page.waitForSelector(`[data-hook="${str}"]`, {
          timeout: 3000,
        }),
      hookToBeVisible: async (str) =>
        await this.page.waitForSelector(`[data-hook="${str}"]`, {
          visible: true,
        }),
      hookToBeHidden: async (str) =>
        await this.page.waitForSelector(`[data-hook="${str}"]`, {
          hidden: true,
        }),
      timer: async (time) => await timeout(time),
      newPage: async (timeoutSec = 5000) => {
        return new Promise((resolve, reject) => {
          this.browser.on('targetcreated', resolve);
          timeout(timeoutSec).then(reject);
        });
      },
    };
  }
}
