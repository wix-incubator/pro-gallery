import GalleryDriver from '../../drivers/pptrDriver';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

describe('behaviourParams_gallery_scrollAnimation - e2e', () => {
  let driver;

  beforeAll(async () => {
    driver = new GalleryDriver();
    await driver.openPage();
  });

  afterAll(async () => {
    await driver.closePage();
  });

  Object.keys(
    GALLERY_CONSTS[optionsMap.behaviourParams.gallery.scrollAnimation]
  ).forEach((animationKey) => {
    if (animationKey !== 'NO_EFFECT') {
      it(`should create ${animationKey} animation style tag for each item`, async () => {
        await driver.navigate({
          [optionsMap.layoutParams.structure.galleryLayout]:
            GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
              .GRID,
          [optionsMap.behaviourParams.gallery.scrollAnimation]:
            GALLERY_CONSTS[optionsMap.behaviourParams.gallery.scrollAnimation][
              animationKey
            ],
        });
        await driver.waitFor.hookToBeVisible('item-container');
        const numberOfAnimationStyleTags = await driver.page.evaluate(() => {
          const styleTags = Array.from(
            document.querySelectorAll('div[data-key="items-styles"] style')
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

  it(`should not create animation style tag when behaviourParams_gallery_scrollAnimation is NO_EFFECT`, async () => {
    await driver.navigate({
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.behaviourParams.gallery.scrollAnimation]:
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.scrollAnimation]
          .NO_EFFECT,
    });
    await driver.waitFor.hookToBeVisible('item-container');
    const numberOfAnimationStyleTags = await driver.page.evaluate(() => {
      const styleTags = Array.from(
        document.querySelectorAll('div[data-key="items-styles"] style')
      );
      const AnimationStyleTags = styleTags.filter((styleTag) =>
        styleTag.id.includes('scrollCss')
      );
      return AnimationStyleTags.length;
    });
    expect(numberOfAnimationStyleTags).toEqual(0);
  });
});
