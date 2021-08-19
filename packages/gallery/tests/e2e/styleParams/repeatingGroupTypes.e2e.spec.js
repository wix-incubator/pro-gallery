import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('repeatingGroupTypes - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should order groups correctly(groups of 3)', async () => {
    await driver.navigate({
      layoutParams: {
        repeatingGroupTypes: '1,3t,3b,3l,3r',
      },
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should order groups correctly(groups of 2)', async () => {
    await driver.navigate({
      layoutParams: {
        repeatingGroupTypes: '1,2h,2v',
      },
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
});
