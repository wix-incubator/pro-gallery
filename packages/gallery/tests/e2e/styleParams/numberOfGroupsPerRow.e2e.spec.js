import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('numberOfGroupsPerRow - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should have 3 groups per strip', async () => {
    await driver.navigate({
      layoutParams: {
        numberOfGroupsPerRow: 3,
      },
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      gridStyle: 1,
      groupSize: 1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have 7 groups per strip', async () => {
    await driver.navigate({
      layoutParams: {
        numberOfGroupsPerRow: 7,
      },
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      gridStyle: 1,
      groupSize: 1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');

    expect(page).toMatchImageSnapshot();
  });
});
