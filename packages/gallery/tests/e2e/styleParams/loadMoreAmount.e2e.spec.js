import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('loadMoreAmount - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('Should increase the height of the gallery container to fit all items', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      enableInfiniteScroll: false,
      gridStyle: GALLERY_CONSTS.gridStyle.SET_ITEMS_PER_ROW,
      loadMoreAmount: GALLERY_CONSTS.loadMoreAmount.ALL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    await driver.actions.click('show-more');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });

  it('Should increase the height of the gallery container to show the next section of the gallery', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      enableInfiniteScroll: false,
      gridStyle: GALLERY_CONSTS.gridStyle.SET_ITEMS_PER_ROW,
      loadMoreAmount: GALLERY_CONSTS.loadMoreAmount.PARTIAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    await driver.actions.click('show-more');
    await driver.scrollInteraction();
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
