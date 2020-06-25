import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('gallerytextAlign - e2e', () => {
  let driver;

  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should align slideshow play button and numbers to the left when "LEFT" ', async () => {
    await driver.openPage({
      galleryLayout: 5,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.LEFT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align slideshow play button and numbers to the right when "RIGHT" ', async () => {
    await driver.openPage({
      galleryLayout: 5,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.RIGHT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align slideshow play button and numbers to the right when "CENTER" ', async () => {
    await driver.openPage({
      galleryLayout: 5,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.CENTER,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
