import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('galleryThumbnailsAlignment - e2e', () => {
  let driver;

  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should place thumbnails in the bottom', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      galleryThumbnailsAlignment: GALLERY_CONSTS.thumbnailsAlignment.BOTTOM
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on top', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      galleryThumbnailsAlignment: GALLERY_CONSTS.thumbnailsAlignment.TOP
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on the left', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      galleryThumbnailsAlignment: GALLERY_CONSTS.thumbnailsAlignment.LEFT
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on the right', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      galleryThumbnailsAlignment: GALLERY_CONSTS.thumbnailsAlignment.RIGHT
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
