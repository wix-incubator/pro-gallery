import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('layoutParams_info_layout - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should apply styles to image only (layoutParams_info_layout = "NO_BACKGROUND")', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].NO_BACKGROUND,
      [optionsMap.stylingParams.itemBorderWidth]: 5,
      [optionsMap.layoutParams.info.border.width]: 5,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should attach texts and image and apply styles to both as one container (layoutParams_info_layout = "ATTACHED_BACKGROUND")', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].ATTACHED_BACKGROUND,
      [optionsMap.stylingParams.itemBorderWidth]: 5,
      [optionsMap.layoutParams.info.border.width]: 5,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should separate texts and image (layoutParams_info_layout = "SEPARATED_BACKGROUND")', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND,
      [optionsMap.stylingParams.itemBorderWidth]: 5,
      [optionsMap.layoutParams.info.border.width]: 5,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should not show styles to texts and image (layoutParams_info_layout = "SEPARATED_BACKGROUND")', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].DONT_SHOW,
      [optionsMap.stylingParams.itemBorderWidth]: 5,
      [optionsMap.layoutParams.info.border.width]: 5,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
