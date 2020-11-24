import GalleryDriver from '../../drivers/pptrDriver';
import { toMatchImageSnapshot } from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('hoveringBehaviour - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });
  it('should show hover container on hover event when "hoveringBehaviour" is "APPEAR', async () => {
    await driver.navigate({
      galleryLayout: 2,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.APPEARS,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0];
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should make hover state disapear on hover (reverse-hover) when "hoveringBehaviour" is "DISAPPEARS', async () => {
    await driver.navigate({
      galleryLayout: 2,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.DISAPPEARS,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0];
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
  it('should set all items in constant hover state when "hoveringBehaviour" is "NO_CHANGE"', async () => {
    await driver.navigate({
      galleryLayout: 2,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    await driver.actions.hover('item-container')[0];
    await driver.waitFor.timer(200);
    const page = await driver.grab.elemScreenshot('#pro-gallery-container');
    expect(page).toMatchImageSnapshot();
  });
});
