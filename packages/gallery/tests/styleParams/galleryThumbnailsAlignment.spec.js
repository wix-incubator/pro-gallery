import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - galleryThumbnailsAlignment', () => {

  let driver;
  const initialProps = {
    container,
    items: [...images2],
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should have thumbnails in the bottom of the gallery', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.THUMBNAIL,
      thumbnailsPosition: GALLERY_CONSTS.thumbnailsAlignment.BOTTOM,
    });
    // driver.mount.proGallery(initialProps);
    // const textContainer = driver.find.selector('.gallery-item-bottom-info').at(0);
    // expect(textContainer.props().style.paddingTop).to.eq('65px');
    // driver.detach.proGallery();
  });
})