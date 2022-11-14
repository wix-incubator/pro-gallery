import GalleryDriver from '../drivers/reactDriver';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';

describe('options - slideAnimation', () => {
  let initialProps;
  const notCurrentFadeAnimationStylesMock = {
    opacity: 0,
    display: 'block',
  };
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
    it('should set the correct "Fade" animation styles to the items', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
            .SLIDESHOW,
        [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
          GALLERY_CONSTS[
            optionsMap.behaviourParams.gallery.horizontal.slideAnimation
          ].FADE,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const currentItem = driver.find
        .selector('[data-hook="item-wrapper"]')
        .at(0);
      const nextItem = driver.find.selector('[data-hook="item-wrapper"]').at(1);
      expect(getRelevantStylesForCompare(currentItem.props().style)).toEqual(
        currentFadeAnimationStylesMock
      );
      expect(getRelevantStylesForCompare(nextItem.props().style)).toEqual(
        notCurrentFadeAnimationStylesMock
      );
      const button = driver.find.hook('nav-arrow-next');
      button.simulate('click');
      await driver.update(400);
      const prevItem = driver.find.selector('[data-hook="item-wrapper"]').at(0);
      expect(getRelevantStylesForCompare(prevItem.props().style)).toEqual(
        notCurrentFadeAnimationStylesMock
      );
      expect(1).toEqual(1);
    });
    it('should not have Fade animation styles when "slideAnimations" is "Scroll"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
            .SLIDESHOW,
        [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
          GALLERY_CONSTS[
            optionsMap.behaviourParams.gallery.horizontal.slideAnimation
          ].SCROLL,
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
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
            .THUMBNAIL,
        [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
          GALLERY_CONSTS[
            optionsMap.behaviourParams.gallery.horizontal.slideAnimation
          ].FADE,
      });
      driver.mount.proGallery(initialProps);
      await driver.update();
      const currentItem = driver.find.hook('item-wrapper').at(0);
      const nextItem = driver.find.hook('item-wrapper').at(1);
      expect(
        getRelevantStylesForCompare(currentItem.props().style)
      ).toMatchObject(currentFadeAnimationStylesMock);
      expect(getRelevantStylesForCompare(nextItem.props().style)).toMatchObject(
        notCurrentFadeAnimationStylesMock
      );
      const button = driver.find.hook('nav-arrow-next');
      button.simulate('click');
      await driver.update(400);
      const prevItem = driver.find.hook('item-wrapper').at(0);
      expect(getRelevantStylesForCompare(prevItem.props().style)).toMatchObject(
        notCurrentFadeAnimationStylesMock
      );
    });
    it('should not have Fade animation styles when "slideAnimations" is "Scroll"', async () => {
      initialProps.options = Object.assign(initialProps.options, {
        [optionsMap.layoutParams.structure.galleryLayout]:
          GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
            .THUMBNAIL,
        [optionsMap.behaviourParams.gallery.horizontal.slideAnimation]:
          GALLERY_CONSTS[
            optionsMap.behaviourParams.gallery.horizontal.slideAnimation
          ].SCROLL,
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
