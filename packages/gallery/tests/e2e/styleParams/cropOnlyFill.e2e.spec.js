import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('cropOnlyFill - e2e', () => {
  //let driver;

  let driver 
  beforeAll(async () => {
    const browser = global.__BROWSER__;
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    driver = new GalleryDriver(page)
  });
  it('should crop images', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      cubeType: GALLERY_CONSTS.cubeType.FIT,
      cubeImages: true,
      cropOnlyFill: false,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should not crop images', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      cubeType: GALLERY_CONSTS.cubeType.FIT,
      cubeImages: true,
      cropOnlyFill: true,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
