import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('galleryRatio - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('galleryRatio 0.5', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      layoutParams_structure_galleryRatio_value: 0.5,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('galleryRatio 0.65', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      layoutParams_structure_galleryRatio_value: 0.65,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('Should consider thumbnails ', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      layoutParams_structure_galleryRatio_value: 0.5,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
});
