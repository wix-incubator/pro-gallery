import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('magic - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('magic - scrollDirection = vertical, magicLayoutSeed = 1 (vertical)', async () => {
    await driver.openPage({
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
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.MAGIC,
      magicLayoutSeed: 1,
      scrollDirection:GALLERY_CONSTS.scrollDirection.HORIZONTAL
    });
    // await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('magic - scrollDirection = vertical, magicLayoutSeed = 2 (horizontal)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.MAGIC,
      magicLayoutSeed: 2,
      scrollDirection:GALLERY_CONSTS.scrollDirection.VERTICAL
    });
    // await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });

  it('magic - scrollDirection = horizontal, magicLayoutSeed = 2 (horizontal)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.MAGIC,
      magicLayoutSeed: 2,
      scrollDirection:GALLERY_CONSTS.scrollDirection.HORIZONTAL
    });
    // await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  
})