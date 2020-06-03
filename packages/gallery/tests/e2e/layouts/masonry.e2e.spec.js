import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import GALLERY_CONSTS from '../../../src/common/constants';

expect.extend({ toMatchImageSnapshot });

describe('masonry - e2e', () => {
  let driver;
  
  beforeEach(async () => {
    driver = new GalleryDriver();
    await driver.launchBrowser();
  });

  afterEach(() => {
    driver.closeBrowser();
  });
  it('masonry - scrollDirection = vertical', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.MASONRY,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('masonry - scrollDirection = horizontal', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.MASONRY,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.screenshot();
    expect(page).toMatchImageSnapshot();
  });
  it('masonry horizontal orientation', async () => {
    await driver.openPage({
      galleryLayout: GALLERY_CONSTS.layout.MASONRY,
      allowTitle: true,
      allowDescription: true,
      itemBorderRadius: 50,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  
})