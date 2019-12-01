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

  it('Grid layout - image-snapshot', async () => {
    await driver.openPage({
      galleryLayout: 2
    });
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });

  it('Slideshow layout - image-snapshot', async () => {
    await driver.openPage({
      galleryLayout: 3
    });
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('Collage layout - image-snapshot', async () => {
    await driver.openPage({
      galleryLayout: 1
    });
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
})