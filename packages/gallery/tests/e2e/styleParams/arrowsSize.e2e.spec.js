import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchIconsAndTexts} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

jest.setTimeout(30000)

expect.extend({ toMatchIconsAndTexts });

describe('arrowsSize - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should set arrowsSize', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      arrowsSize: 120,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchIconsAndTexts();
  });
})