import GalleryDriver from '../../drivers/pptrDriver';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

describe('scrollAnimations - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  Object.keys(GALLERY_CONSTS.scrollAnimations).forEach((animationKey) => {
    if (animationKey !== 'NO_EFFECT') {
      it(`should create style tag with animation for each item (plus two extra styles tags)`, async () => {
        await driver.navigate({
          galleryLayout: GALLERY_CONSTS.layout.GRID,
          scrollAnimation: GALLERY_CONSTS.scrollAnimations[animationKey],
        });
        await driver.waitFor.hookToBeVisible('item-container');
        const children = await driver.page.evaluate(() => {
          return Array.from(
            document.querySelector('div[data-key="dynamic-styles"]').children
          ).length;
        });
        // the default e2e images is always 20 so we should get 20 style tags plus two extra styles tags
        expect(children).toEqual(22);
      });
    }
  });

  it(`should not create animation style tags when scrollAnimation is NO_EFFECT`, async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollAnimation: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const children = await driver.page.evaluate(() => {
      return Array.from(
        document.querySelector('div[data-key="dynamic-styles"]').children
      ).length;
    });
    // should create two style tags for layout and hover element
    expect(children).toEqual(2);
  });
});
