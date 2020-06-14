import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('cubeImages - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  
  it('should fit images inside the containers', async () => {
    await driver.openPage({
      galleryLayout: -1,
      cubeImages: true,
      cubeType: 'fit',
      cubeRatio: 1
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('#pro-gallery-container'); 
    expect(page).toMatchImageSnapshot();
  });
  it('should crop the images and fill the containers', async () => {
    await driver.openPage({
      galleryLayout: -1,
      cubeImages: true,
      cubeType: 'fill',
      cubeRatio: 1
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should have a "cubeRatio" of "2"', async () => {
    await driver.openPage({
      galleryLayout: -1,
      cubeImages: true,
      cubeType: 'fill',
      cubeRatio: 2
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})