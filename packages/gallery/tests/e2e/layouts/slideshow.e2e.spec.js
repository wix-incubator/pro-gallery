import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('slideshow - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('slideshow - scrollDirection = vertical', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('slideshow - scrollDirection = horizontal', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
});
