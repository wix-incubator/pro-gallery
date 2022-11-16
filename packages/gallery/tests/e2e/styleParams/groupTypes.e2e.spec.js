import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('groupTypes - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should set groups of "1,2v,2h"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.allowedGroupTypes]: [
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2v'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
      ],
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set groups of "1,3v,3b,3t"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.allowedGroupTypes]: [
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3v'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3b'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3t'],
      ],
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set groups of "1"', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.groups.allowedGroupTypes]: [
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
      ],
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
