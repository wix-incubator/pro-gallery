import GalleryDriver from '../../drivers/pptrDriver';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });
const navigateAndHoverTakeSnapshot = async (driver, options) => {
  await driver.navigate(options);
  await driver.waitFor.hookToBeVisible('item-container');
  await driver.waitFor.timer(200);
  await driver.actions.hover('item-container');
  return await driver.grab.elemScreenshot('.pro-gallery');
};
describe('behaviourParams_item_secondaryMedia_trigger - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should not reveal second media on hover', async () => {
    const page = await navigateAndHoverTakeSnapshot(driver, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      behaviourParams_item_secondaryMedia_trigger:
        GALLERY_CONSTS.secondaryMediaTrigger.OFF,
    });
    expect(page).toMatchImageSnapshot();
  });
  it('should reveal second media on hover', async () => {
    const page = await navigateAndHoverTakeSnapshot(driver, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      behaviourParams_item_secondaryMedia_trigger:
        GALLERY_CONSTS.secondaryMediaTrigger.HOVER,
    });
    expect(page).toMatchImageSnapshot();
  });
});
