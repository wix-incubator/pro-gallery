import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - textBoxHeight', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set "textBoxHeight" of "250"(manual)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      allowTitle: true,
      calculateTextBoxHeightMode: GALLERY_CONSTS.textBoxHeightCalculationOptions.MANUAL,
      textBoxHeight: 250,
    })
    driver.mount.proGallery(initialProps);
    const textBox = driver.find.selector('.gallery-item-common-info').at(0);
    const { height } = textBox.props().style;
    expect(height).to.eq(250);
    driver.detach.proGallery();
  });
})
