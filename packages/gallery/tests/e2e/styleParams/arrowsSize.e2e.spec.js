import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('arrowsSize - e2e', () => {
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
  it('should set arrowsSize', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      arrowsSize: 150,
      cubeRatio: 16/9,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot({failureThreshold: 0.0005});
  });
})
