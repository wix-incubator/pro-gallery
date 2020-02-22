import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - itemBorderWidth', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set border-width of 10 to items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemBorderWidth: 10,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderWidth).to.eq('10px')
    driver.detach.proGallery();
  });
  it('should set border-width of 40 to items', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      itemBorderWidth: 40,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderWidth).to.eq('40px')
    driver.detach.proGallery();
  });
  it('should not set border-width to when hoveringBehaviour is "NEVER_SHOW"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NEVER_SHOW,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('item-container').at(0);
    expect(item.props().style.borderWidth).to.eq(undefined);
    driver.detach.proGallery();
  });
})