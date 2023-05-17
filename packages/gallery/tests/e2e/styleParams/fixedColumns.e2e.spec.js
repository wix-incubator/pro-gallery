import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('fixedColumns - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should set fixedColimns of "1"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.groupSize]: 1,
      [optionsMap.layoutParams.structure.layoutOrientation]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL,
      [optionsMap.layoutParams.structure.numberOfColumns]: 1,
      [optionsMap.layoutParams.structure.responsiveMode]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.partialScreenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('should set fixedColimns of "2"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.groupSize]: 1,
      [optionsMap.layoutParams.structure.layoutOrientation]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL,
      [optionsMap.layoutParams.structure.numberOfColumns]: 2,
      [optionsMap.layoutParams.structure.responsiveMode]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set fixedColimns of "3"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.groupSize]: 1,
      [optionsMap.layoutParams.structure.layoutOrientation]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.layoutOrientation].VERTICAL,
      [optionsMap.layoutParams.structure.numberOfColumns]: 3,
      [optionsMap.layoutParams.structure.responsiveMode]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
