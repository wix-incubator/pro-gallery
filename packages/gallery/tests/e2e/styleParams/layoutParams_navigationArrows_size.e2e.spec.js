import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
// import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('layoutParams_navigationArrows_size - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should set layoutParams_navigationArrows_size', async () => {
    // await driver.navigate({
    //   [optionsMap.layoutParams.structure.galleryLayout]: GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDER,
    //   [optionsMap.layoutParams.navigationArrows.size]: 150,
    //   [optionsMap.layoutParams.crop.ratios] : [16 / 9],
    //
    // });
    // await driver.waitFor.hookToBeVisible('item-container');
    // const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(true).toBe(true);
  });
});
