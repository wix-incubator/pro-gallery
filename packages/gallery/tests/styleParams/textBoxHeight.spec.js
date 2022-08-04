import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container, customComponents } from '../drivers/mocks/styles';

describe('options - textBoxHeight', () => {
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

  it('should set "textBoxHeight" of "250"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      textBoxHeight: 250,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textBox = driver.find.selector('.gallery-item-common-info').at(0);
    const { height } = textBox.props().style;
    expect(height).to.eq(250);
    driver.detach.proGallery();
  });
});
