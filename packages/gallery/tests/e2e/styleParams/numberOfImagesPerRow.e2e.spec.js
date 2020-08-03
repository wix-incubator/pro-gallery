import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('numberOfImagesPerRow - e2e', () => {
  let driver;

  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should set 1 images per a row', async () => {
    await driver.openPage({
      galleryLayout: 2,
      numberOfImagesPerRow:1,
      gridStyle: 1,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
  // it('should set 2 images per a row', async () => {
  //   await driver.openPage({
  //     galleryLayout: 2,
  //     numberOfImagesPerRow:2,
  //     gridStyle: 1,
  //     oneRow: false,
  //     scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
  //   });
  //   await driver.waitFor.hookToBeVisible('item-container');
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.elemScreenshot('.pro-gallery');
  //   expect(page).toMatchImageSnapshot();
  // });
  it('should set 3 images per a row', async () => {
    await driver.openPage({
      galleryLayout: 2,
      numberOfImagesPerRow:3,
      gridStyle: 1,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
