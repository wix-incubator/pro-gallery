import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container, customRenderers } from '../drivers/mocks/styles';

describe('styleParam - textBoxHeight', () => {

  //let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
    ...customRenderers,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set "textBoxHeight" of "250"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      textBoxHeight: 250,
    })
    driver.mount.proGallery(initialProps);
    const textBox = driver.find.selector('.gallery-item-common-info').at(0);
    const { height } = textBox.props().style;
    expect(height).to.eq(250);
    driver.detach.proGallery();
  });
})
