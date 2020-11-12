import GalleryDriver from '../../drivers/pptrDriver';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('chooseBestGroup - e2e', () => {
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

  it('should choose best group', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.COLLAGE,
      chooseBestGroup: true,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should not choose best group', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.COLLAGE,
      chooseBestGroup: false,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})
