import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('layoutParams_crop_enable - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should fit images inside the containers', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]: -1,
      [optionsMap.layoutParams.crop.enable]: true,
      [optionsMap.layoutParams.crop.method]:
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FIT,
      [optionsMap.layoutParams.crop.ratios]: [1],
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should crop the images and fill the containers', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]: -1,
      [optionsMap.layoutParams.crop.enable]: true,
      [optionsMap.layoutParams.crop.method]:
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
      [optionsMap.layoutParams.crop.ratios]: [1],
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have a "layoutParams_crop_ratios" of "2"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]: -1,
      [optionsMap.layoutParams.crop.enable]: true,
      [optionsMap.layoutParams.crop.method]:
        GALLERY_CONSTS[optionsMap.layoutParams.crop.method].FILL,
      [optionsMap.layoutParams.crop.ratios]: [2],
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
