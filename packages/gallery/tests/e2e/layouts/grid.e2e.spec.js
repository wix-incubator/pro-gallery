import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('grid - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('grid - layoutParams_structure_scrollDirection = VERTICAL', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('grid - layoutParams_structure_scrollDirection = HORIZONTAL', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
});
