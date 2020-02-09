import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - galleryHorizontalAlign', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should align texts container to the left (galleryHorizontalAlign = "left")', () => {
    Object.assign(initialProps.styles, {
      gallerylayout: 2,
      galleryHorizontalAlign: GALLERY_CONSTS.horizontalAlign.LEFT
    });
    driver.mount.proGallery(initialProps);
    const textsContainer = driver.find.selector('.gallery-item-text').at(0);
    const { alignItems } = textsContainer.props().style
    expect(alignItems).to.eq('flex-start');
    driver.detach.proGallery();
  });
  it('should align texts container in th center (galleryHorizontalAlign = "center")', () => {
    Object.assign(initialProps.styles, {
      gallerylayout: 2,
      galleryHorizontalAlign: GALLERY_CONSTS.horizontalAlign.CENTER
    });
    driver.mount.proGallery(initialProps);
    const textsContainer = driver.find.selector('.gallery-item-text').at(0);
    const { alignItems } = textsContainer.props().style
    expect(alignItems).to.eq('center');
    driver.detach.proGallery();
  });
  it('should align texts container to the right (galleryHorizontalAlign = "right")', () => {
    Object.assign(initialProps.styles, {
      gallerylayout: 2,
      galleryHorizontalAlign: GALLERY_CONSTS.horizontalAlign.RIGHT
    });
    driver.mount.proGallery(initialProps);
    const textsContainer = driver.find.selector('.gallery-item-text').at(0);
    const { alignItems } = textsContainer.props().style
    expect(alignItems).to.eq('flex-end');
    driver.detach.proGallery();
  });
})