import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('hasThumbnails - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should not have thumbnails when "hasThumbnails" is "false" and gallery is horizontal scroll', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      hasThumbnails: false,
      oneRow:true,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should not have thumbnails when "hasThumbnails" is "true" and gallery is vertical scroll', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      hasThumbnails: false,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have thumbnails when "hasThumbnails" is "true" and gallery is horizontal scroll', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      hasThumbnails: true,
      oneRow:true,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})