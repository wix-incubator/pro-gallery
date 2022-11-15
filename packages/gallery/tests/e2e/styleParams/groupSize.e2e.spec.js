import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('groupSize - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should have max group size of 3 (groupSize=3)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.density]: 0.8,
      [optionsMap.layoutParams.groups.groupSize]: 3,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    // expect to have groups of max 3
    expect(page).toMatchImageSnapshot();
  });
  it('should have max group size of 1 (groupSize=1)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.density]: 0.8,
      [optionsMap.layoutParams.groups.groupSize]: 1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    // expect to have groups of 1
    expect(page).toMatchImageSnapshot();
  });
  it('should have groups of 1 item (restricted by collageDensity)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.density]: 0,
      [optionsMap.layoutParams.groups.groupSize]: 3,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    //expect to have groups of 1 despite groupSize = 3 (because of collageDensity)
    expect(page).toMatchImageSnapshot();
  });
  it('should have groups of 1 item (restricted by groupsPerStrip)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.numberOfGroupsPerRow]: 1,
      [optionsMap.layoutParams.structure.responsiveMode]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode]
          .SET_ITEMS_PER_ROW,
      [optionsMap.layoutParams.groups.groupSize]: 3,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.partialScreenshot();
    //expect to have groups of 1 despite groupSize = 3 (because of collageDensity)
    expect(page).toMatchImageSnapshot();
  });
});
