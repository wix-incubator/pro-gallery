import GalleryDriver from '../drivers/reactDriver';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

describe('options - behaviourParams_gallery_horizontal_slideAnimation', () => {
  let initialProps;
  const FADE_CLASSED = {
    VISIBLE: 'fade-visible',
    HIDDEN: 'fade-hidden',
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
    it('should set the correct "Fade" animation styles to the items', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDESHOW,
        [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].FADE,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const currentItem = driver.find.selector('[data-hook="item-wrapper"]').at(0);
      const nextItem = driver.find.selector('[data-hook="item-wrapper"]').at(1);
      expect(currentItem.hasClass(FADE_CLASSED.VISIBLE)).toBeTruthy();
      expect(nextItem.hasClass(FADE_CLASSED.HIDDEN)).toBeTruthy();
      const button = driver.find.hook('nav-arrow-next');
      button.simulate('click');
      await driver.update(400);
      const prevItem = driver.find.selector('[data-hook="item-wrapper"]').at(0);
      expect(prevItem.hasClass(FADE_CLASSED.HIDDEN)).toBeTruthy();
      expect(1).toEqual(1);
    });
    it('should not have Fade animation styles when "behaviourParams_gallery_horizontal_slideAnimation" is "Scroll"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDESHOW,
        [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.selector('[data-hook="item-wrapper"]').at(0);
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
    it('should set the correct "Fade" animation styles to the items', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
        [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].FADE,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const currentItem = driver.find.hook('item-wrapper').at(0);
      const nextItem = driver.find.hook('item-wrapper').at(1);
      expect(currentItem.hasClass(FADE_CLASSED.VISIBLE)).toBeTruthy();
      expect(nextItem.hasClass(FADE_CLASSED.HIDDEN)).toBeTruthy();
      const button = driver.find.hook('nav-arrow-next');
      button.simulate('click');
      await driver.update(400);
      const prevItem = driver.find.hook('item-wrapper').at(0);
      expect(prevItem.hasClass(FADE_CLASSED.HIDDEN)).toBeTruthy();
    });
    it('should not have Fade animation styles when "behaviourParams_gallery_horizontal_slideAnimation" is "Scroll"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
        [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
          GALLERY_CONSTS[optionsMap.behaviourParams.gallery.horizontal.slideAnimation].SCROLL,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const item = driver.find.hook('item-wrapper').at(0);
      expect(item.hasClass(FADE_CLASSED.VISIBLE)).toBeFalsy();
    });
  });
});
