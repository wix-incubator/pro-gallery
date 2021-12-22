import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });
const testsSensitivityConfig = {
  failureThreshold: 0,
  failureThresholdType: 'pixel',
};

describe('arrowsType - e2e', () => {
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
        arrowsType: GALLERY_CONSTS.arrowsType[arrowValue],
        arrowsSize: 150,
      });
      await driver.waitFor.hookToBeVisible('item-container');
      const page = await driver.grab.elemScreenshot('.pro-gallery');
      expect(page).toMatchImageSnapshot(testsSensitivityConfig);
    });
  });
});
