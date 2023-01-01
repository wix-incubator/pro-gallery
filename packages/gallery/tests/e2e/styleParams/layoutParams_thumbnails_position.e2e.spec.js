import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('thumbnails position - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should place thumbnails in the bottom', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      galleryThumbnailsAlignment: GALLERY_CONSTS.thumbnailsAlignment.BOTTOM,
      layoutParams_thumbnails_position:
        GALLERY_CONSTS.thumbnailsPosition.ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on gallery', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      galleryThumbnailsAlignment: GALLERY_CONSTS.thumbnailsAlignment.TOP,
      layoutParams_thumbnails_position:
        GALLERY_CONSTS.thumbnailsPosition.ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on the left', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      galleryThumbnailsAlignment: GALLERY_CONSTS.thumbnailsAlignment.LEFT,
      layoutParams_thumbnails_position:
        GALLERY_CONSTS.thumbnailsPosition.ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should place thumbnails on the right', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      galleryThumbnailsAlignment: GALLERY_CONSTS.thumbnailsAlignment.RIGHT,
      layoutParams_thumbnails_position:
        GALLERY_CONSTS.thumbnailsPosition.ON_GALLERY,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
