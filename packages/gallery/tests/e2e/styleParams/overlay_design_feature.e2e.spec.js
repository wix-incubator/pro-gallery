import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('overlay design - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should set overlaySize to 50 percent, position-centered horizontally with padding 30', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.position]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position]
          .CENTERED_HORIZONTALLY,
      [optionsMap.behaviourParams.item.overlay.size]: 50,
      [optionsMap.behaviourParams.item.overlay.sizeUnits]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.sizeUnits].PERCENT,
      [optionsMap.behaviourParams.item.overlay.padding]: 30,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].ALWAYS_SHOW,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  it('should set overlaySize to 50 pixels, position-centered horizontally with padding 30', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.item.overlay.position]:
        GALLERY_CONSTS[optionsMap.behaviourParams.item.overlay.position]
          .CENTERED_HORIZONTALLY,
      [optionsMap.behaviourParams.item.overlay.size]: 50,
      [optionsMap.behaviourParams.item.overlay.sizeUnits]:
        GALLERY_CONSTS[optionsMap.layoutParams.info.sizeUnits].PIXEL,
      [optionsMap.behaviourParams.item.overlay.padding]: 30,
      [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
        GALLERY_CONSTS[
          optionsMap.behaviourParams.item.overlay.hoveringBehaviour
        ].ALWAYS_SHOW,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
