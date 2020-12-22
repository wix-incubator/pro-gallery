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
      it(`should create ${animationKey} animation style tag for each item`, async () => {
        await driver.navigate({
          galleryLayout: GALLERY_CONSTS.layout.GRID,
          scrollAnimation: GALLERY_CONSTS.scrollAnimations[animationKey],
        });
        await driver.waitFor.hookToBeVisible('item-container');
        const numberOfAnimationStyleTags = await driver.page.evaluate(() => {
          const styleTags = Array.from(
            document.querySelectorAll('div[data-key="dynamic-styles"] style')
          );
          const AnimationStyleTags = styleTags.filter((styleTag) =>
            styleTag.id.includes('scrollCss')
          );
          return AnimationStyleTags.length;
        });
        // the default e2e images is always 20 so we should get 20 animation style tags
        expect(numberOfAnimationStyleTags).toEqual(20);
      });
    }
  });

  it(`should not create animation style tag when scrollAnimation is NO_EFFECT`, async () => {
    await driver.navigate({
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      scrollAnimation: GALLERY_CONSTS.scrollAnimations.NO_EFFECT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const numberOfAnimationStyleTags = await driver.page.evaluate(() => {
      const styleTags = Array.from(
        document.querySelectorAll('div[data-key="dynamic-styles"] style')
      );
      const AnimationStyleTags = styleTags.filter((styleTag) =>
        styleTag.id.includes('scrollCss')
      );
      return AnimationStyleTags.length;
    });
    expect(numberOfAnimationStyleTags).toEqual(0);
  });
});
