import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import PLACEMENTS from '../../src/common/constants/placements';

describe('styleParam - titlePlacement', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should place texts below images when "titlePlacement" is "SHOW_BELOW"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      onRow:false,
      scrollDirection:0,
      allowTitle:true,
      titlePlacement: PLACEMENTS.SHOW_BELOW
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.gallery-item-bottom-info');
    expect(items).to.have.lengthOf(6)
    driver.detach.proGallery();
  });
  it('should place texts above images when "titlePlacement" is "SHOW_ABOVE"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      onRow:false,
      scrollDirection:0,
      allowTitle:true,
      titlePlacement: PLACEMENTS.SHOW_ABOVE
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.gallery-item-top-info');
    expect(items).to.have.lengthOf(6)
    driver.detach.proGallery();
  });
  it('should render texts when "titlePlacement" is "SHOW_ON_HOVER"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      onRow:false,
      scrollDirection:0,
      allowTitle:true,
      titlePlacement: PLACEMENTS.SHOW_ON_HOVER
    })
    driver.mount.proGallery(initialProps);
    const items = driver.find.selector('.gallery-item-hover .gallery-item-text');
    expect(items.length).to.be.greaterThan(0);
    driver.detach.proGallery();
  });
})