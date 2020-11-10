import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('slideshowInfoSize - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll( async() => {
    await driver.closePage();
  });

  it('should set "slideshowInfoSize"(400)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize:400,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should set "slideshowInfoSize"(250)', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize:250,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})
