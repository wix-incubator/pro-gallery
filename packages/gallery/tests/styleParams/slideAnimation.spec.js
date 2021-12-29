import GalleryDriver from '../drivers/reactDriver';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';
import { mergeNestedObjects } from 'pro-gallery-lib';

describe('options - slideAnimation', () => {
  let initialProps;
  const currentFadeAnimationStylesMock = {
    opacity: 1,
    display: 'block',
  };

  const getRelevantStylesForCompare = (styles) => {
    const { opacity, display } = styles;
    return { opacity, display };
  };

  describe('Slideshow', () => {
    let driver;
    beforeEach(() => {
      initialProps = {
        container,
        items: images2,
        options,
      };
      driver = new GalleryDriver();
    });

    afterEach(() => {
      driver.detach.proGallery();
    });
    it('should not have Fade animation styles when "slideAnimations" is "Scroll"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
        slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.selector('.gallery-item-wrapper a').at(0);
      expect(getRelevantStylesForCompare(item.props().style)).toEqual({});
    });
  });

  describe('Thumbnails', () => {
    let driver;
    beforeEach(() => {
      initialProps = {
        container,
        items: images2,
        options,
      };
      driver = new GalleryDriver();
    });

    afterEach(() => {
      driver.detach.proGallery();
    });
    it('should not have Fade animation styles when "slideAnimations" is "Scroll"', async () => {
      initialProps.options = mergeNestedObjects(initialProps.options, {
        galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
        slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-wrapper').at(0);
      expect(item.props().style).not.toMatchObject(
        currentFadeAnimationStylesMock
      );
    });
  });
});
