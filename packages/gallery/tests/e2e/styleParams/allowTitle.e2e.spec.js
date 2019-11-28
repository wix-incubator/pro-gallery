import GalleryDriver from '../../drivers/pptrDriver';
// import { expect } from 'chai';

const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

// const { Assertion } = require('chai')
// const toMatchScreenshot = require('match-screenshot/chai');

// Assertion.addMethod('toMatchScreenshot', toMatchScreenshot);

describe('allowTitle - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchPuppeteer();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should render when "allowTitle" is "true"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowTitle: true
    })
    const items = await driver.find.items('item-container');
    console.log(items.length);
    expect(items.length).to.eq(20)
  });
  
  // it('Grid layout - Desktop', async () => {
  //   await driver.openPage({});
  //   const page = await driver.grab.screenshot();
  //   console.log(page);
  //   await expect(page).toMatchScreenshot({
  //     key: 'Grid layout - Desktop',
  //     version: 'v1.0.1',
  //   })
  // }, 30000);

  it('Grid layout - image-snapshot', async () => {
    await driver.openPage({});
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  }, 30000);
})