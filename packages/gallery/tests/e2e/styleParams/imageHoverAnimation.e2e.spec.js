import GalleryDriver from '../../drivers/pptrDriver';
import {toMatchImageSnapshot} from '../../drivers/matchers';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

expect.extend({ toMatchImageSnapshot });

describe('imageHoverAnimation - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll( async() => {
    await driver.closePage();
  });

  Object.values(GALLERY_CONSTS.imageHoverAnimations).forEach( animationType => {
    it(`should have "${animationType}" animation`, async () => {
      await driver.navigate({
        galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
        imageHoverAnimation: animationType,
        hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW
      });
      await driver.waitFor.hookToBeVisible('item-container');
      await driver.actions.hover('item-container')[0];
      await driver.waitFor.timer(500);
      const page = await driver.grab.elemScreenshot('.pro-gallery');
      expect(page).toMatchImageSnapshot();
    });
  })
})
