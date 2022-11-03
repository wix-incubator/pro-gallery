import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('gallerySizeType - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('when "gallerySizeType" set to "PIXELS" the width of each item or group should be approximately the value given to "gallerySizePx"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.targetItemSize.unit]:
        GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].PIXEL,
      [optionsMap.layoutParams.targetItemSize.value]: 600,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  it('when "gallerySizeType" set to "RATIO" the width of each item or group should be approximately the value given to "gallerySizeRatio" in percentage (from the gallery total width).', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.targetItemSize.unit]:
        GALLERY_CONSTS[optionsMap.layoutParams.targetItemSize.unit].PERCENT,
      [optionsMap.layoutParams.targetItemSize.value]: 25,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
