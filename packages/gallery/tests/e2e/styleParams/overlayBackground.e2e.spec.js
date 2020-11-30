import GalleryDriver from '../../drivers/pptrDriver';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { toMatchImageSnapshot } from '../../drivers/matchers';

expect.extend({ toMatchImageSnapshot });

describe('overlayBackground - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  it('should set the correct "overlayBackground"', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayBackground: 'rgba(0,0,0,.5)',
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
});
