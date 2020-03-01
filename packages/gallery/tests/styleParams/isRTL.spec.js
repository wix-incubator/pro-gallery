import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';
import sinon from 'sinon';

describe('styleParam - isRTL', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should not set "rtl" class to the gallery container', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      isRTL: GALLERY_CONSTS.layoutDirection.LEFT_TO_RIGHT,
    })
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    expect(galleryContainer.hasClass('rtl')).to.be.false;
    driver.detach.proGallery();
  });
  it('should set "rtl" class to the gallery container', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      isRTL: GALLERY_CONSTS.layoutDirection.RIGHT_TO_LEFT,
    })
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });
  // it('should start keyboard navigation from left to right', () => {
  //   Object.assign(initialProps.styles, {
  //     galleryLayout: GALLERY_CONSTS.layout.GRID,
  //     isRTL: GALLERY_CONSTS.layoutDirection.LEFT_TO_RIGHT,
  //   })
  //   driver.mount.proGallery(initialProps);
  //   const galleryContainer = driver.find.selector('#pro-gallery-container');
  //   const stub = sinon.stub(driver.wrapper.instance());
  //   galleryContainer.getDOMNode().focus();
  //   galleryContainer.simulate('keydown', {key: 'Tab',keyCode: 9, which: 9});
  //   console.log(galleryContainer.is(':focus'));
    
  //   // driver.wrapper.simulate('keydown', {key: 'Tab',keyCode: 9, which: 9});
  //   // galleryContainer.simulate('keydown', {key: 'Tab',keyCode: 9, which: 9});
  //   console.log(document.activeElement.tagName);
    
  //   expect()
  //   driver.detach.proGallery();
  // });

  it('should set "rtl" class in slideShowView', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      isRTL: GALLERY_CONSTS.layoutDirection.RIGHT_TO_LEFT,
    })
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });

  it('should not set "rtl" class in slideShowView', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      isRTL: GALLERY_CONSTS.layoutDirection.RIGHT_TO_LEFT,
    })
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });

  it('should show right arrow at first in slideShowView', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      isRTL: GALLERY_CONSTS.layoutDirection.LEFT_TO_RIGHT,
    })
    driver.mount.proGallery(initialProps);
    const arrow = driver.find.hook('nav-arrow-next');
    console.log(arrow.props().style);
    const mock = {
      length: 1, //should be only 1 arrow at first
      right: 5, // arrow distance from right side
    }

    expect({
      length: arrow.length, 
      right: arrow.props().style.left
    });
    driver.detach.proGallery();
  });

})