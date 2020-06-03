import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('galleryVerticalAlign - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should align texts container to the top', async () => {
    await driver.openPage({
      galleryLayout: 2,
      galleryVerticalAlign: GALLERY_CONSTS.verticalAlign.TOP,
      allowTitle: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align texts container to the center', async () => {
    await driver.openPage({
      galleryLayout: 2,
      galleryVerticalAlign: GALLERY_CONSTS.verticalAlign.CENTER,
      allowTitle: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align texts container to the bottom', async () => {
    await driver.openPage({
      galleryLayout: 2,
      galleryVerticalAlign: GALLERY_CONSTS.verticalAlign.BOTTOM,
      allowTitle: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})