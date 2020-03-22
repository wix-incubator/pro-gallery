import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - enableScroll', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set class "slider" when "enableScroll" is "true"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      oneRow: true,
      scrollDirection:1,
      enableScroll: true,
    });
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    expect(galleryContainer.hasClass('slider')).to.be.true;
    driver.detach.proGallery();
  });
  it('should not set class "slider" when "enableScroll" is "false"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      oneRow: true,
      scrollDirection:1,
      enableScroll: false,
    });
    
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    expect(galleryContainer.hasClass('slider')).to.be.false;
    driver.detach.proGallery();
  });
})