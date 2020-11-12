import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('imageMargin - e2e', () => {
  //let driver;
  
  let driver 
  beforeAll(async () => {
    const browser = global.__BROWSER__;
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    driver = new GalleryDriver(page)
  });
  it('should create a margin between items ', async () => {
    await driver.navigate({
      galleryLayout: 2,
      imageMargin: 20
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(2000);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should not create a margin between items when "imageMargin" is "0"', async () => {
    await driver.navigate({
      galleryLayout: 2,
      imageMargin: 0
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(2000);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})