import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - titleDescriptionSpace', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }
  beforeEach(() => {
    driver = new GalleryDriver();
  });
  it('should create sapcing between the title and the description', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.grid,
      titleDescriptionSpace: 10,
      allowTitle:true,
      allowDescription:true,
    })
    driver.mount.proGallery(initialProps);
    const thumbnailItem = driver.find.selector('.gallery-item-title').at(0);
    const { marginBottom } = thumbnailItem.props().style;
    expect(marginBottom).to.eq(10);
    driver.detach.proGallery();
  });
  it('should not create sapcing between when there is no description', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.grid,
      titleDescriptionSpace: 10,
      allowTitle:true,
      allowDescription:false,
    })
    driver.mount.proGallery(initialProps);
    const thumbnailItem = driver.find.selector('.gallery-item-title').at(0);
    const { marginBottom } = thumbnailItem.props().style;
    expect(marginBottom).to.eq(0);
    driver.detach.proGallery();
  });
})

