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

  it('should set the correct "overlayBackground" "(red)"', async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      overlayBackground: 'rgba(241,6,6,0.75)',
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.DISAPPEARS,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
});
