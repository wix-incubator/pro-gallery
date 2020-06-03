import GalleryDriver from '../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../drivers/matchers';
import GALLERY_CONSTS from '../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('texts - e2e', () => {
  let driver;

  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('should not use padding bottom in thumbnails layout', async () => {
    await driver.openPage({
      galleryLayout: 3,
      loveButton: true,
      allowTitle: true,
      allowDescription: true,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
      galleryVerticalAlign: GALLERY_CONSTS.verticalAlign.CENTER,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
  it('should use padding bottom in slider layout', async () => {
    await driver.openPage({
      galleryLayout: 4,
      cubeRatio: 16/9,
      loveButton: true,
      allowDescription: true,
      allowTitle: true,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
      galleryVerticalAlign: GALLERY_CONSTS.verticalAlign.CENTER,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('.pro-gallery');
    expect(page).toMatchImageSnapshot();
  });
})
