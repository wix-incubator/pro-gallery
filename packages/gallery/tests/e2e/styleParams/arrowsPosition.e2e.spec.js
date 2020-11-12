import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('arrowsPosition - e2e', () => {
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
  it('should have navigation arrows inside the gallery ', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      arrowsPosition: GALLERY_CONSTS.arrowsPosition.ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have navigation arrows outside the gallery ', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      arrowsPosition: GALLERY_CONSTS.arrowsPosition.OUTSIDE_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
