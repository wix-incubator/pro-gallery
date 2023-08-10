import GalleryDriver from '../../drivers/pptrDriver';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('behaviourParams_item_overlay_backgroundColor - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should set the correct "behaviourParams_item_overlay_backgroundColor" ("red")', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.backgroundColor]: 'rgba(255,0,0,.5)',
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.hoveringBehaviour].ALWAYS_SHOW,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
