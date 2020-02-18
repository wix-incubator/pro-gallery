import GalleryDriver from '../../drivers/pptrDriver';
import GALLERY_CONSTS from '../../../src/common/constants';
import {toMatchImageSnapshot} from '../../drivers/matchers';

jest.setTimeout(30000)

expect.extend({ toMatchImageSnapshot });

describe('textBoxBorder - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should render border-width=2, border-radius=2', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      allowTitle: true,
      allowDescription: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderWidth: 2,
      textBoxBorderRadius: 2,
      textBoxBorderColor: 'rgba(24, 144, 255, 1)',
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });

  it('should have border-width=20, border-radius=20', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      allowTitle: true,
      allowDescription: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderWidth: 20,
      textBoxBorderRadius: 20,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });

  it('should have border-width=40, border-radius=40', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      allowTitle: true,
      allowDescription: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderWidth: 40,
      textBoxBorderRadius: 40,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });

  it('should not have any border design', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      allowTitle: true,
      allowDescription: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderWidth: 40,
      textBoxBorderRadius: 40,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
})