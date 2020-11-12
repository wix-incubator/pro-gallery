import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('slider - e2e', () => {
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
  it('slider - scrollDirection = vertical', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      cubeRatio: 16/9,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('slider - scrollDirection = horizontal', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      cubeRatio: 16/9,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });

})
