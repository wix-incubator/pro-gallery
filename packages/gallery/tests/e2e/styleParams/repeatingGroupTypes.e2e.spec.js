import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('repeatingGroupTypes - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should order groups correctly(groups of 3)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.groups.repeatingGroupTypes]: [
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3t'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3b'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3l'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3r'],
      ],
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should order groups correctly(groups of 2)', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.groups.repeatingGroupTypes]: [
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['1'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2h'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['2v'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3l'],
        GALLERY_CONSTS[optionsMap.layoutParams.groups.allowedGroupTypes]['3r'],
      ],
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
