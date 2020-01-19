import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('oneRow - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should render horizontal gallery with navigation arrows when "oneRow" is "true"', async () => {
    await driver.openPage({
      galleryLayout: -1,
      oneRow: true
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(2000);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should render vertical gallery when "oneRow" is "false"', async () => {
    await driver.openPage({
      galleryLayout: -1,
      oneRow: false,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(2000);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})