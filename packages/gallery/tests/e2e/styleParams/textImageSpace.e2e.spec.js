import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('textImageSpace - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should set spacing between texts and image (texts below)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      allowTitle: true,
      allowDescription: true,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      textImageSpace: 40,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should set spacing between texts and image (texts above)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ABOVE,
      allowTitle: true,
      allowDescription: true,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      textImageSpace: 40,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should not set spacing between texts and image (texts above, no separated background)', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      allowTitle: true,
      allowDescription: true,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      textImageSpace: 40,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})