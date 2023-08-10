import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('behaviourParams_gallery_vertical_loadMore_amount - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('Should increase the height of the gallery container to fit all items', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: true,
      [optionsMap.behaviourParams.gallery.vertical.loadMore.amount]:
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.vertical.loadMore.amount].ALL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.click('show-more');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  // it('Should increase the height of the gallery container to show the next section of the gallery', async () => {
  //   await driver.navigate({
  //     [optionsMap.layoutParams.structure.galleryLayout]: GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
  //     [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: true,
  //     [optionsMap.layoutParams.structure.responsiveMode]: GALLERY_CONSTS[optionsMap.layoutParams.structure.responsiveMode].SET_ITEMS_PER_ROW,
  //     [optionsMap.behaviourParams.gallery.vertical.loadMore.amount]: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.vertical.loadMore.amount].PARTIAL,
  //   });
  //   await driver.waitFor.hookToBeVisible('item-container');
  //   await driver.waitFor.timer(200);
  //   await driver.actions.click('show-more');
  //   await driver.scrollInteraction();
  //   const page = await driver.grab.elemScreenshot('.pro-gallery');
  //   expect(page).toMatchImageSnapshot();
  // });
});
