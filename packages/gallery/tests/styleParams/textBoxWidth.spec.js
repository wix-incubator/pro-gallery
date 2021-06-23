import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import {
  styleParams,
  container,
  customRenderers,
} from '../drivers/mocks/styles';

describe('styleParam - textBoxWidth', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
    ...customRenderers,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set "textBoxWidth" of "250"(manual)', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      calculateTextBoxWidthMode:
        GALLERY_CONSTS.textBoxWidthCalculationOptions.MANUAL,
      textBoxWidth: 250,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textBox = driver.find.selector('.gallery-item-common-info').at(0);
    const { width } = textBox.props().style;
    expect(width).to.eq(250);
    driver.detach.proGallery();
  });
});
