import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONST from '../../src/common/constants';

describe('styleParam - loveButton', () => {

  let driver;
  const initialProps = {
    container,
    items: [...images2, ...images2],
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render element "#gallery-horizontal-scroll" when "scrollDirection" is "1"', () => {
    Object.assign(initialProps.styles, {
      scrollDirection: GALLERY_CONST.scrollDirection.HORIZONTAL,
      galleryLayout:2
    });
    driver.mount.proGallery(initialProps);
    const elem = driver.find.selector('#gallery-horizontal-scroll');
    expect(elem).to.have.lengthOf(1)
    driver.detach.proGallery();
  });
  it('should render element "#pro-gallery-margin-container" when "scrollDirection" is "0"', () => {
    Object.assign(initialProps.styles, {
      scrollDirection: GALLERY_CONST.scrollDirection.VERTICAL,
      galleryLayout:2
    });
    driver.mount.proGallery(initialProps);
    const elem = driver.find.selector('#pro-gallery-margin-container');
    expect(elem).to.have.lengthOf(1)
    driver.detach.proGallery();
  });
})