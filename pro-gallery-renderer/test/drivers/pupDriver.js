import puppeteer from 'puppeteer';

export default class galleryDriver {

  constructor() {
    this.browser = {};
    this.page = {};
    this.frames = [{}];
    this.debug = false;
  }
// we should look at opening one browser insead of opening one every test. this might require takeing it out of the driver.
  async openGallery(name = 'Default') {
    if (this.debug) {
      this.browser = await puppeteer.launch({
        slowMo: 200,
        devtools: true,
        headless: false,
        args: ['--no-sandbox']});
    } else {
      this.browser = await puppeteer.launch({args: ['--no-sandbox']});
    }
    this.page = await this.goAndWait(this.browser, this.getPageUrl('Gallery', name));
    this.frames = await this.page.frames();
    this.galleryFrame = this.frames.find(f => f.name() === 'storybook-preview-iframe');

  }

  async closeGallery() {
    try {
      await this.browser.close();
    } catch (e) {
      //
    }
  }

  async goAndWait(browser, url) {
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    return page;
  }

  getPageUrl(kind = 'Gallery', story = 'Default') {
    return `http://localhost:6006/?selectedKind=${kind}&selectedStory=${story}`;
  }

  get find() {
    return {
      hook: async str => (await this.galleryFrame.$$(`[data-hook="${str}"]`)),
      items: async () => (await this.galleryFrame.$$('.gallery-item-container')),
    };
  }
  get grab() {
    return {
      hook: async str => (await this.galleryFrame.waitForSelector(`[data-hook="${str}"]`)),
      value: async str => (await document.querySelector(`[data-hook="${str}"]`)),
      html: async str => (await this.page.$eval(`[data-hook="${str}"]`, element => {
        return element.innerHTML;
      })),
      style: async (str, prop) => {
        const foo = (element, prop) => {
          const styles = window.getComputedStyle(element);
          return (styles.getPropertyValue(`${prop}`));
        };
        return (await this.galleryFrame.$eval(`[data-hook="${str}"]`, foo, prop));
      },
      numOfPages: async () => {
        const a = await this.browser.pages();
        return a.length;
      }
    };
  }
  get waitFor() {
    return {
      hookToExist: async str => (await this.galleryFrame.waitForSelector(`[data-hook="${str}"]`, {timeout: 3000})),
      hookToBeVisible: async str => (await this.galleryFrame.waitForSelector(`[data-hook="${str}"]`, {visible: true})),
      hookToBeHidden: async str => (await this.galleryFrame.waitForSelector(`[data-hook="${str}"]`, {hidden: true})),
      timer: async time => (await this.galleryFrame.waitFor(time)),
      newPage: async (timeoutSec = 5000) => {
        return new Promise((resolve, reject) => {
          this.browser.on('targetcreated', resolve);
          this.galleryFrame.waitFor(timeoutSec).then(reject);
        });
      }
    };
  }
  get actions() {
    return {
      hover: async str => (await this.galleryFrame.hover(`[data-hook="${str}"]`)),
      click: async str => (await this.galleryFrame.click(`[data-hook="${str}"]`)),
      // debug: () => {
      //   debugger;
      // }
    };
  }
}
