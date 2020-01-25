import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import PLACEMENTS from '../../../src/common/constants/placements';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('titlePlacement - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should place texts on the bottom of the items', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowTitle: true,
      allowDescription: true,
      titlePlacement: PLACEMENTS.SHOW_BELOW
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should place texts on top of the items', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowTitle: true,
      allowDescription: true,
      titlePlacement: PLACEMENTS.SHOW_ABOVE
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})