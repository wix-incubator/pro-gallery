import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('textImageSpace - e2e', () => {
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
  it('should set spacing between texts and image (texts below)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      textImageSpace: 60,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should set spacing between texts and image (texts above)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ABOVE,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      textImageSpace: 60,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should not set spacing between texts and image (texts above, no separated background)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      textImageSpace: 60,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})
