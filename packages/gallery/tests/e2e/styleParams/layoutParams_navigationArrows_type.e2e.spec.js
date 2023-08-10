import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });
const testsSensitivityConfig = {
  failureThreshold: 0,
  failureThresholdType: 'pixel',
};

describe('layoutParams_navigationArrows_type - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  Object.keys(GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.type]).forEach((arrowValue) => {
    it(`should display ${arrowValue}`, async () => {
      await driver.navigate({
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDER,
        [optionsMap.layoutParams.navigationArrows.size]: 150,
        [optionsMap.layoutParams.navigationArrows.type]:
          GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.type][arrowValue],
      });
      await driver.waitFor.hookToBeVisible('item-container');
      const page = await driver.grab.elemScreenshot('.pro-gallery');
      expect(page).toMatchImageSnapshot(testsSensitivityConfig);
    });
  });
});
