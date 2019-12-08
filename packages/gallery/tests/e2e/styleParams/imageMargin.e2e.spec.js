import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot} from 'jest-image-snapshot';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('imageMargin - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should create a margin between items ', async () => {
    await driver.openPage({
      galleryLayout: 2,
      imageMargin: 20
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should not create a margin between items when "imageMargin" is "0"', async () => {
    await driver.openPage({
      galleryLayout: 2,
      imageMargin: 0
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})