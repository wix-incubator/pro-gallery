import puppeteer from 'puppeteer';

export default class galleryDriver {

  constructor() {
    this.browser = {};
    this.page = {};
    this.frames = [{}];
  }

  async openGallery(name = 'Default') {
    this.browser = await puppeteer.launch({args: ['--no-sandbox']});
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
      items: async () => (await this.galleryFrame.$$('.gallery-item-container'))
    };
  }
}
