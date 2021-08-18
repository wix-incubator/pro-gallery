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

describe('styleParam - textBoxBorderRadius', () => {
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
  it('should set border-radius to the text container when "imageInfoType" is "SEPARATED_BACKGROUND"', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderRadius: 10,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderRadius).to.eq(10);
    driver.detach.proGallery();
  });

  it('should not set border-radius to the text container when "imageInfoType" is not "SEPARATED_BACKGROUND"', async () => {
    initialProps.styles = mergeNestedObjects(initialProps.styles, {
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
    expect(textsStyles.props().style.borderRadius).to.eq(undefined);
    driver.detach.proGallery();
  });
});
