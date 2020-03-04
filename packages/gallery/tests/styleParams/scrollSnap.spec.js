import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - scrollSnap', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }
  beforeEach(() => {
    driver = new GalleryDriver();
  });
  it('should set class "scroll-snap"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.EMPTY,
      scrollSnap:true,
      oneRow:true,
    })
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#gallery-horizontal-scroll');
    expect(galleryContainer.hasClass('scroll-snap')).to.be.true;
    driver.detach.proGallery();
  });

  it('should not set class "scroll-snap"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.EMPTY,
      scrollSnap:false,
      oneRow:true,
    })
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#gallery-horizontal-scroll');
    expect(galleryContainer.hasClass('scroll-snap')).to.be.false;
    driver.detach.proGallery();
  });
})