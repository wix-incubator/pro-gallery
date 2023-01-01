import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('columnWidths - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should set the width of each column according to the values in "columnWidths" in repeating order', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      gridStyle: GALLERY_CONSTS.gridStyle.SET_ITEMS_PER_ROW,
      columnWidths: '1,2,4',
      numberOfImagesPerRow: 4,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
});
