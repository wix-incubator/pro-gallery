import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('smartCrop - e2e', () => {
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

  it('should crop according to original image ratio', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      smartCrop: true,
      cubeImages: true,
      cubeRatio: 2,
      cubeType: GALLERY_CONSTS.cubeType.CROP,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should not use smart crop', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      smartCrop: false,
      cubeImages: true,
      cubeRatio: 2,
      cubeType: GALLERY_CONSTS.cubeType.CROP,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})
