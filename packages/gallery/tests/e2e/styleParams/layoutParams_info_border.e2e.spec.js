import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('layoutParams_info_border - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should render border-width=2, border-radius=2', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.border.width]: 2,
      [optionsMap.layoutParams.info.border.radius]: 2,
      [optionsMap.layoutParams.info.border.color]: 'rgba(24, 144, 255, 1)',
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  it('should have border-width=20, border-radius=20', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.border.width]: 20,
      [optionsMap.layoutParams.info.border.radius]: 20,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  it('should have border-width=40, border-radius=40', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].SEPARATED_BACKGROUND,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.border.width]: 40,
      [optionsMap.layoutParams.info.border.radius]: 40,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  it('should not have any border design', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.info.layout]: GALLERY_CONSTS[optionsMap.layoutParams.info.layout].NO_BACKGROUND,
      [optionsMap.layoutParams.info.placement]: GALLERY_CONSTS[optionsMap.layoutParams.info.placement].BELOW,
      [optionsMap.layoutParams.info.border.width]: 40,
      [optionsMap.layoutParams.info.border.radius]: 40,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection].VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
