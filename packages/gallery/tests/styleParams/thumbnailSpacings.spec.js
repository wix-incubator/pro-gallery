import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - thumbnailSpacings', () => {

  //let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set "thumbnailSpacing" of "10"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailSpacings: 10,
    });
    driver.mount.proGallery(initialProps);
    const item = driver.find.selector('.thumbnailItem').at(0);
    expect(item.props().style.margin).to.eq(10);
    driver.detach.proGallery();
  });
  it('should set "thumbnailSpacing" of "30"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailSpacings: 30,
    });
    driver.mount.proGallery(initialProps);
    const item = driver.find.selector('.thumbnailItem').at(0);
    expect(item.props().style.margin).to.eq(30);
    driver.detach.proGallery();
  });
})
