import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import {
  styleParams,
  container,
  customComponents,
} from '../drivers/mocks/styles';

describe('styleParam - textBoxHeight', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      styles: styleParams,
      customComponents,
    };
  });

  it('should set "textBoxHeight" of "250"', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
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
