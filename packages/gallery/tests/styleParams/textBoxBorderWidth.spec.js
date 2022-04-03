import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container, customComponents } from '../drivers/mocks/styles';

describe('options - textBoxBorderWidth', () => {
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

  it('should set border-width to the text container when "imageInfoType" is "SEPARATED_BACKGROUND"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderWidth: 10,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderWidth).to.eq('10px');
    driver.detach.proGallery();
  });
  it('should not set border-width to the text container when "imageInfoType" is not "SEPARATED_BACKGROUND"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderWidth: 10,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderWidth).to.eq(undefined);
    driver.detach.proGallery();
  });
});
