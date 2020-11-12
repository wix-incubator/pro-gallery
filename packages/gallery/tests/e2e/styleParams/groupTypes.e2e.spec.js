import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('groupTypes - e2e', () => {
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
  it('should set groups of "1,2v,2h"', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupTypes: '1,2v,2h'
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set groups of "1,3v,3b,3t"', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupTypes: '1,3v,3b,3t'
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set groups of "1"', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupTypes: '1,'
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
