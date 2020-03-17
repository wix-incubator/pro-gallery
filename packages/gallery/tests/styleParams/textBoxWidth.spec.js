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

  it('should set "textBoxWidth" of "250"(manual)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      allowTitle: true,
      calculateTextBoxWidthMode: GALLERY_CONSTS.textBoxWidthCalculationOptions.MANUAL,
      textBoxWidth: 250,
    })
    driver.mount.proGallery(initialProps);
    const textBox = driver.find.selector('.gallery-item-common-info').at(0);
    console.log(textBox.props().style.width);
    const { width } = textBox.props().style;
    expect(width).to.eq(250);
    driver.detach.proGallery();
  });
})