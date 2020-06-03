import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('isVertical - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should render a gallery with vertical orientation when "isVertical" is "true"', async () => {
    await driver.openPage({
      galleryLayout: 1,
      isVertical: true,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should render a gallery with horizontal orientation when "isVertical" is "false"', async () => {
    await driver.openPage({
      galleryLayout: 1,
      isVertical: false,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})