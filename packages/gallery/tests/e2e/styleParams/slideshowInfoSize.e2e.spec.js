import GalleryDriver from '../../drivers/pptrDriver';
import GALLERY_CONSTS from '../../../src/common/constants';
import {toMatchImageSnapshot} from '../../drivers/matchers';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('slideshowInfoSize - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });

  it('should set "slideshowInfoSize"(400)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      allowTitle: true,
      slideshowInfoSize:400,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should set "slideshowInfoSize"(250)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      allowTitle: true,
      slideshowInfoSize:250,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})