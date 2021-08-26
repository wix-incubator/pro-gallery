import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container, customComponents } from '../drivers/mocks/styles';

describe('options - textBoxWidth', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
      customComponents,
    };
  });

  it('should set "textBoxWidth" of "250"(manual)', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT,
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
