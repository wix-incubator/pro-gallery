import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('allowHover - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should not have any hover effect when "allowHover" is "false"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowHover: false
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0]
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should have a hover effect when "allowHover" is "true"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      allowHover: true
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0]
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})