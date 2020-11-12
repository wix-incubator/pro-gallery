const NodeEnvironment = require('jest-environment-node');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // connect to puppeteer
    const browser = global.__BROWSER_GLOBAL__;
    // const page = await browser.newPage();
    // await page.setViewport({width: 1920,
    //   height: 1080,});
    this.global.__PUPPETEER_PAGE__ = browser;
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;