import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - showArrows', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }
  beforeEach(() => {
    driver = new GalleryDriver();
  });
  it('should show arrows"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.EMPTY,
      scrollSnap:true,
      oneRow:true,
      showArrows: true,
    })
    driver.mount.proGallery(initialProps);
    const arrows = driver.find.selector('.nav-arrows-container');
    expect(arrows.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
  it('should not show arrows"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.EMPTY,
      scrollSnap:true,
      oneRow:true,
      showArrows: false,
    })
    driver.mount.proGallery(initialProps);
    const arrows = driver.find.selector('.nav-arrows-container');
    expect(arrows.length).to.eq(0);
    driver.detach.proGallery();
  });
})
