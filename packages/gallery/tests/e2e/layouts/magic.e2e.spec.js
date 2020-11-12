import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('magic - e2e', () => {
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
  it('magic - scrollDirection = vertical, magicLayoutSeed = 1 (vertical)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.MAGIC,
      magicLayoutSeed: 1,
      scrollDirection:GALLERY_CONSTS.scrollDirection.VERTICAL
    });
    // await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  it('magic - scrollDirection = horizontal, magicLayoutSeed = 1 (vertical)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.MAGIC,
      magicLayoutSeed: 1,
      scrollDirection:GALLERY_CONSTS.scrollDirection.HORIZONTAL
    });
    // await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  // it('magic - scrollDirection = vertical, magicLayoutSeed = 2 (horizontal)', async () => {
  //   await driver.navigate({
  //     galleryLayout: GALLERY_CONSTS.layout.MAGIC,
  //     magicLayoutSeed: 2,
  //     scrollDirection:GALLERY_CONSTS.scrollDirection.VERTICAL
  //   });
  //   // await driver.waitFor.hookToBeVisible('item-container');
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.screenshot();
  //   expect(page).toMatchImageSnapshot();
  // });
  //
  // it('magic - scrollDirection = horizontal, magicLayoutSeed = 2 (horizontal)', async () => {
  //   await driver.navigate({
  //     galleryLayout: GALLERY_CONSTS.layout.MAGIC,
  //     magicLayoutSeed: 2,
  //     scrollDirection:GALLERY_CONSTS.scrollDirection.HORIZONTAL
  //   });
  //   // await driver.waitFor.hookToBeVisible('item-container');
  //   await driver.waitFor.timer(200);
  //   const page = await driver.grab.screenshot();
  //   expect(page).toMatchImageSnapshot();
  // });

})
