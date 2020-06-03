import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('imageInfoType - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should apply styles to image only (imageInfoType = "NO_BACKGROUND")', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      allowTitle: true,
      itemBorderWidth: 5,
      textBoxBorderWidth: 5,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should attach texts and image and apply styles to both as one container (imageInfoType = "ATTACHED_BACKGROUND")', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND,
      allowTitle: true,
      itemBorderWidth: 5,
      textBoxBorderWidth: 5,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should separate texts and image (imageInfoType = "SEPARATED_BACKGROUND")', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      allowTitle: true,
      itemBorderWidth: 5,
      textBoxBorderWidth: 5,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should not show styles to texts and image (imageInfoType = "SEPARATED_BACKGROUND")', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.DONT_SHOW,
      allowTitle: true,
      itemBorderWidth: 5,
      textBoxBorderWidth: 5,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})