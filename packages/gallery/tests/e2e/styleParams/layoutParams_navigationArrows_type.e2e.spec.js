import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

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
  Object.keys(GALLERY_CONSTS.arrowsType).forEach((arrowValue) => {
    it(`should display ${arrowValue}`, async () => {
      await driver.navigate({
        galleryLayout: GALLERY_CONSTS.layout.SLIDER,
        arrowsSize: 150,
        layoutParams: {
          navigationArrows: {
            type: GALLERY_CONSTS.arrowsType[arrowValue],
          },
        },
      });
      await driver.waitFor.hookToBeVisible('item-container');
      const page = await driver.grab.elemScreenshot('.pro-gallery');
      expect(page).toMatchImageSnapshot(testsSensitivityConfig);
    });
  });
});
