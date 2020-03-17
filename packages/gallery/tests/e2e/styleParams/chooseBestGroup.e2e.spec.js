import GalleryDriver from '../../drivers/pptrDriver';
import GALLERY_CONSTS from '../../../src/common/constants';
import {toMatchImageSnapshot} from '../../drivers/matchers';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('chooseBestGroup - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });

  it('should choose best group', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      chooseBestGroup: true,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should not choose best group', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      chooseBestGroup: false,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})