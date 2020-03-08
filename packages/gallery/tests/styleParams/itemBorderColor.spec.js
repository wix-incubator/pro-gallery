import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - itemBorderColor', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set border-color of "rgba(0,0,0,1)" to the items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemBorderColor: {value: 'rgba(0,0,0,1)'},
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    console.log(item.props().style.borderColor);
    
    expect(item.props().style.borderColor).to.eq('rgba(0,0,0,1)');
    driver.detach.proGallery();
  });
  it('should set border-color of "rgba(23,110,23,1)" to items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemBorderColor: {value: 'rgba(23,110,23,1)'},
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderColor).to.eq('rgba(23,110,23,1)')
    driver.detach.proGallery();
  });
})