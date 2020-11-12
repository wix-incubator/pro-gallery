import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('rotatingGroupTypes - e2e', () => {
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

  it('should order groups correctly(groups of 3)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      rotatingGroupTypes: '1,3t,3b,3l,3r',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should order groups correctly(groups of 2)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      rotatingGroupTypes: '1,2h,2v',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})
