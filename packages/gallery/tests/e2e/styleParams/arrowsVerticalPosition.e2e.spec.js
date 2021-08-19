import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('arrowsPosition - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should have arrows on info center and info below', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      titlePlacement: 'SHOW_BELOW',
      arrowsVerticalPosition: 'INFO_CENTER',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have arrows on item center and info below', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      titlePlacement: 'SHOW_BELOW',
      arrowsVerticalPosition: 'ITEM_CENTER',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have arrows on image center and info below', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      titlePlacement: 'SHOW_BELOW',
      arrowsVerticalPosition: 'IMAGE_CENTER',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have arrows on info center and info above', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      titlePlacement: 'SHOW_ABOVE',
      arrowsVerticalPosition: 'INFO_CENTER',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have arrows on item center and info above', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      titlePlacement: 'SHOW_ABOVE',
      arrowsVerticalPosition: 'ITEM_CENTER',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have arrows on image center and info above', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      titlePlacement: 'SHOW_ABOVE',
      arrowsVerticalPosition: 'IMAGE_CENTER',
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
