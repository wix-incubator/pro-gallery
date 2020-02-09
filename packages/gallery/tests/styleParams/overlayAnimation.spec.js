import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('galleryVerticalAlign - overlayAnimation', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      galleryVerticalAlign: GALLERY_CONSTS.verticalAlign.TOP,
    })
    driver.mount.proGallery(initialProps);
    const textContainer = driver.find.selector('.gallery-item-text').at(0);
    const { justifyContent } = textContainer.props().style;
    expect(justifyContent).to.eq('flex-start')
    driver.detach.proGallery();
  });
  
})