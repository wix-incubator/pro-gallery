import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('numberOfImagesPerCol - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll( async() => {
    await driver.closePage();
  });
  it('should set 1 images per a column', async () => {
    await driver.navigate({
      galleryLayout: 2,
      numberOfImagesPerCol:1,
      oneRow: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set 2 images per a column', async () => {
    await driver.navigate({
      galleryLayout: 2,
      numberOfImagesPerCol:2,
      oneRow: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set 3 images per a column', async () => {
    await driver.navigate({
      galleryLayout: 2,
      numberOfImagesPerCol:3,
      oneRow: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
