import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('imageHoverAnimation - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  Object.values(
    GALLERY_CONSTS[optionsMap.behaviourParams.item.content.hoverAnimation]
  ).forEach((animationType) => {
    it(`should have "${animationType}" animation`, async () => {
      await driver.navigate({
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
            .THUMBNAIL,
        [optionsMap.behaviourParams.item.content.hoverAnimation]: animationType,
        [optionsMap.behaviourParams.item.overlay.hoveringBehaviour]:
          GALLERY_CONSTS[
            optionsMap.behaviourParams.item.overlay.hoveringBehaviour
          ].NEVER_SHOW,
      });
      await driver.waitFor.hookToBeVisible('item-container');
      await driver.actions.hover('item-container')[0];
      await driver.waitFor.timer(3000);
      const page = await driver.grab.elemScreenshot('.pro-gallery');
      expect(page).toMatchImageSnapshot();
    });
  });
});
