import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - itemBorderRadius', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set border-radius of 10 to items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemBorderRadius: 10,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderRadius).to.eq(10)
    driver.detach.proGallery();
  });
  it('should set border-radius of 40 to items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemBorderRadius: 40,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderRadius).to.eq(40)
    driver.detach.proGallery();
  });
  it('should not set border-radius to when "cubeType" is "fit"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      cubeType: GALLERY_CONSTS.cubeType.FIT,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      itemBorderRadius: 40,
      oneRow: false,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderRadius).to.eq(0);
    driver.detach.proGallery();
  });
})
