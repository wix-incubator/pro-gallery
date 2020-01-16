import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants'

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('scrollDirection - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should render horizontal gallery with navigation arrows when "onRow" is "true"', async () => {
    await driver.openPage({
      galleryLayout: -1,
      onRow: true
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(2000);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should render vertical gallery when "onRow" is "false"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(2000);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})