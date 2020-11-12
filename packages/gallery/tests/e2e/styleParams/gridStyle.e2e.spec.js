import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('gridStyle - e2e', () => {
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
  it('should set number of columns according to container size (not numberOfImagesPerRow)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      gridStyle: GALLERY_CONSTS.gridStyle.FIT_TO_SCREEN,
      numberOfImagesPerRow:2,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set fixed number of columns (numberOfImagesPerRow)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      gridStyle: GALLERY_CONSTS.gridStyle.SET_ITEMS_PER_ROW,
      numberOfImagesPerRow:2,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
})
