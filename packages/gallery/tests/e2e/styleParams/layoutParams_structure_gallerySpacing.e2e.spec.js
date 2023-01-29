import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { optionsMap } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('gallerySpacing - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should set the gallery with a margin of 100px ', async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.gallerySpacing]: 100,
      [optionsMap.layoutParams.structure.galleryLayout]: -1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
