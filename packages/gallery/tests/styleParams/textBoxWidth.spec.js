import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - textBoxWidth', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should ', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      allowTitle: true,
      textBoxWidth: 10,
    })
    driver.mount.proGallery(initialProps);
    const textsStyles = driver.find.selector('.gallery-item-bottom-info').at(0).parent();
    expect(textsStyles.props().style.borderWidth).to.eq('10px')
    driver.detach.proGallery();
  });
})