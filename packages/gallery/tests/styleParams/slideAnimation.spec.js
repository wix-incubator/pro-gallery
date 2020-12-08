import GalleryDriver from '../drivers/reactDriver';
import { GALLERY_CONSTS } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - slideAnimation', () => {
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };
  const nextAnimationStylesMock = {
    transition: 'opacity .8s ease',
    opacity: 0,
    display: 'block',
  };
  const currentAnimationStylesMock = {
    transition: 'none',
    opacity: 1,
    display: 'block',
  };

  describe('Slideshow', () => {
    let driver;
    beforeEach(() => {
      driver = new GalleryDriver();
    });

    afterEach(() => {
      driver.detach.proGallery();
    });
    it('should set the correct "Fade" animation styles to the current item', () => {
      Object.assign(initialProps.styles, {
        galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
        slideAnimation: GALLERY_CONSTS.slideAnimations.FADE,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.selector('.gallery-item-wrapper a').at(0);
      expect(item.props().style).toEqual(currentAnimationStylesMock);
    });
    it('should set the correct "Fade" animation styles to the next item. (before navigating)', () => {
      Object.assign(initialProps.styles, {
        galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
        slideAnimation: GALLERY_CONSTS.slideAnimations.FADE,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.selector('.gallery-item-wrapper a').at(1);
      expect(item.props().style).toEqual(nextAnimationStylesMock);
    });
    it('should set to the previous item the correct "Fade" animation styles. (after navigating)', async () => {
      Object.assign(initialProps.styles, {
        galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
        slideAnimation: GALLERY_CONSTS.slideAnimations.FADE,
      });
      driver.mount.proGallery(initialProps);
      const button = driver.find.hook('nav-arrow-next');
      button.simulate('click');
      await driver.update(400);
      const item = driver.find.selector('.gallery-item-wrapper a').at(0);
      expect(item.props().style).toEqual(nextAnimationStylesMock);
    });
    it('should not have animation styles when slideAnimations is "Scroll"', async () => {
      Object.assign(initialProps.styles, {
        galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
        slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.selector('.gallery-item-wrapper a').at(0);
      expect(item.props().style).toEqual({});
    });
  });

  describe('Thumbnails', () => {
    let driver;
    beforeEach(() => {
      driver = new GalleryDriver();
    });

    afterEach(() => {
      driver.detach.proGallery();
    });
    it('should set the correct "Fade" animation styles to the current item', () => {
      Object.assign(initialProps.styles, {
        galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
        slideAnimation: GALLERY_CONSTS.slideAnimations.FADE,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(0);
      expect(item.props().style).toMatchObject(currentAnimationStylesMock);
    });
    it('should set the correct "Fade" animation styles to the next item. (before navigating)', () => {
      Object.assign(initialProps.styles, {
        galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
        slideAnimation: GALLERY_CONSTS.slideAnimations.FADE,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(1);
      expect(item.props().style).toMatchObject(nextAnimationStylesMock);
    });

    it('should set to the previous item the correct "Fade" animation styles. (after navigating)', async () => {
      Object.assign(initialProps.styles, {
        galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
        slideAnimation: GALLERY_CONSTS.slideAnimations.FADE,
      });
      driver.mount.proGallery(initialProps);
      const button = driver.find.hook('nav-arrow-next');
      button.simulate('click');
      await driver.update(400);
      const item = driver.find.hook('item-wrapper').at(0);
      expect(item.props().style).toMatchObject(nextAnimationStylesMock);
    });

    it('should not have animation styles when slideAnimations is "Scroll"', () => {
      Object.assign(initialProps.styles, {
        galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
        slideAnimation: GALLERY_CONSTS.slideAnimations.SCROLL,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(0);
      expect(item.props().style).not.toMatchObject(currentAnimationStylesMock);
    });
  });
});
