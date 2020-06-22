import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('textsVerticalPadding - e2e', () => {
  let driver;

  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should set vertical padding for texts (text below item)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      textsVerticalPadding: 15,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should set vertical padding for texts (text above item)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      textsVerticalPadding: 50,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ABOVE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
