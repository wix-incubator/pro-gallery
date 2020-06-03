import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('gallerytextAlign - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should align texts to the left', async () => {
    await driver.openPage({
      galleryLayout: 2,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.LEFT,
      allowTitle: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align texts to the right', async () => {
    await driver.openPage({
      galleryLayout: 2,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.RIGHT,
      allowTitle: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should align texts to the center', async () => {
    await driver.openPage({
      galleryLayout: 2,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.CENTER,
      allowTitle: true,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_HOVER,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})