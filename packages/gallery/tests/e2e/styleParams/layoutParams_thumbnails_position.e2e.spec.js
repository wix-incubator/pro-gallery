import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('thumbnails position - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should place thumbnails in the bottom', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.alignment]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM,
      [optionsMap.layoutParams.thumbnails.position]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on gallery', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.alignment]: GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP,
      [optionsMap.layoutParams.thumbnails.position]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on the left', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.alignment]: GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT,
      [optionsMap.layoutParams.thumbnails.position]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on the right', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.alignment]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].RIGHT,
      [optionsMap.layoutParams.thumbnails.position]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.position].ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
