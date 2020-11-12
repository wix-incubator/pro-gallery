import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('fixedColumns - e2e', () => {
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
  it('should set fixedColimns of "1"', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupSize:1,
      isVertical:true,
      fixedColumns: 1,
      gridStyle: 1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('should set fixedColimns of "2"', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupSize:1,
      isVertical:true,
      fixedColumns: 2,
      gridStyle: 1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set fixedColimns of "3"', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupSize:1,
      isVertical:true,
      fixedColumns: 3,
      gridStyle: 1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
