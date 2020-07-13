import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - scrollAnimation', () => {

  describe('scrollAnimation - initial state', () => {
    let driver;
    const initialProps = {
      container,
      items: [...images2, ...images2],
      styles: styleParams,
    }

    beforeEach(() => {
      driver = new GalleryDriver();
    });

    it('Fade-In', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.FADE_IN,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(3).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }
      const animationMock = {
        filter: 'opacity(0)',
        transition: 'filter 1.100s ease-in'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Grayscale', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.GRAYSCALE,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(3).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }
      const animationMock = {
        filter: 'grayscale(100%)',
        transition: 'filter 1.300s ease-in'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Slide-Up', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.SLIDE_UP,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-container').at(3).getDOMNode();
      const animationProps = {
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        transform: 'translateY(100px)',
        transition: 'transform 0.8s cubic-bezier(.13,.78,.53,.92)'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Expand', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.EXPAND,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-container').at(3).getDOMNode();
      const animationProps = {
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        transform: 'scale(0.95)',
        transition: 'transform 1s cubic-bezier(.13,.78,.53,.92)'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Shrink', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.SHRINK,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-container').at(3).getDOMNode();
      const animationProps = {
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transition,
      }
      const animationMock = {
        transform: 'scale(1.05)',
        transition: 'transform 1s cubic-bezier(.13,.78,.53,.92)'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });
    it('Zoom-Out', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.ZOOM_OUT,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(3).getDOMNode();
      const animationProps = {
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        transform: 'scale(1.1)',
        transition: 'transform 1.2s cubic-bezier(.13,.78,.53,.92)',
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('One-Color', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.ONE_COLOR,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(3).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        filter: 'opacity(0)',
        transition: 'filter 0.700s ease-in',
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Main-Color', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.MAIN_COLOR,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('gallery-item-image-canvas').at(3).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        filter: 'opacity(0)',
        transition: 'filter 1.100s ease-in',
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Blur', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.BLUR,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('gallery-item-image-canvas').at(3).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        filter: 'opacity(0)',
        transition: 'filter 1.100s ease-in',
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });
  })


  describe('scrollAnimation - final state', () => {
    let driver;
    const initialProps = {
      container,
      items: [...images2, ...images2],
      styles: styleParams,
    }

    beforeEach(() => {
      driver = new GalleryDriver();
    });

    it('Fade-In', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.FADE_IN,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(0).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }
      const animationMock = {
        filter: 'opacity(1)',
        transition: 'filter 1.100s ease-in'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Grayscale', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.GRAYSCALE,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(0).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }
      const animationMock = {
        filter: 'grayscale(0)',
        transition: 'filter 1.300s ease-in'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Slide-Up', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.SLIDE_UP,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-container').at(0).getDOMNode();
      const animationProps = {
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        transform: 'translateY(0)',
        transition: 'transform 0.8s cubic-bezier(.13,.78,.53,.92)'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Expand', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.EXPAND,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-container').at(0).getDOMNode();
      const animationProps = {
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        transform: 'scale(1)',
        transition: 'transform 1s cubic-bezier(.13,.78,.53,.92)'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Shrink', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.SHRINK,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-container').at(0).getDOMNode();
      const animationProps = {
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transition,
      }
      const animationMock = {
        transform: 'scale(1)',
        transition: 'transform 1s cubic-bezier(.13,.78,.53,.92)'
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });
    it('Zoom-Out', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.ZOOM_OUT,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(0).getDOMNode();
      const animationProps = {
        transform: getComputedStyle(item).transform,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        transform: 'scale(1)',
        transition: 'transform 1.2s cubic-bezier(.13,.78,.53,.92)',
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('One-Color', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.ONE_COLOR,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('item-wrapper').at(0).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        filter: 'opacity(1)',
        transition: 'filter 0.700s ease-in',
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Main-Color', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.MAIN_COLOR,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('gallery-item-image-canvas').at(0).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        filter: 'opacity(1)',
        transition: 'filter 1.100s ease-in',
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });

    it('Blur', () => {
      Object.assign(initialProps.styles, {
        oneRow: false,
        scrollDirection: 0,
        galleryLayout: 2,
        scrollAnimation: GALLERY_CONSTS.scrollAnimations.BLUR,
      });
      driver.mount.proGallery(initialProps);
      const item = driver.find.hook('gallery-item-image-canvas').at(0).getDOMNode();
      const animationProps = {
        filter: getComputedStyle(item).filter,
        transition: getComputedStyle(item).transition,
      }

      const animationMock = {
        filter: 'opacity(1)',
        transition: 'filter 1.100s ease-in',
      }
      expect(animationProps).to.deep.equal(animationMock)
      driver.detach.proGallery();
    });
  })
})