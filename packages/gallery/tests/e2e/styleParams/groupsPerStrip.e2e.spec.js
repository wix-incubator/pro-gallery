import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('groupsPerStrip - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should have 3 groups per strip', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupsPerStrip: 3,
      groupSize:1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should have 7 groups per strip', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      groupsPerStrip: 7,
      groupSize:1,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');

    expect(page).toMatchImageSnapshot();
  });
})