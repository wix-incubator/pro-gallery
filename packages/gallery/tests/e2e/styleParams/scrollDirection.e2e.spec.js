import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

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
  it('should render horizontal gallery with navigation arrows when "scrollDirection" is "1"', async () => {
    await driver.openPage({
      galleryLayout: -1,
      scrollDirection: 1
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(2000);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should render vertical gallery when "scrollDirection" is "0"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      scrollDirection: 0
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(2000);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})