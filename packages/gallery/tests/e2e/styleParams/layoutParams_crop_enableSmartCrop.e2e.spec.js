import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('layoutParams_crop_enableSmartCrop - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should crop according to original image ratio', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.crop.enableSmartCrop]: true,
      [optionsMap.layoutParams.crop.enable]: true,
      [optionsMap.layoutParams.crop.ratios]: [2],
      [optionsMap.layoutParams.crop.method]:
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should not use smart crop', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.crop.enableSmartCrop]: false,
      [optionsMap.layoutParams.crop.enable]: true,
      [optionsMap.layoutParams.crop.ratios]: [2],
      [optionsMap.layoutParams.crop.method]:
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
