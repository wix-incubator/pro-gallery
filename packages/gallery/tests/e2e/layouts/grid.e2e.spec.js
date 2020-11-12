import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('grid - e2e', () => {
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
  it('grid - scrollDirection = vertical', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('grid - scrollDirection = horizontal', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });

})
