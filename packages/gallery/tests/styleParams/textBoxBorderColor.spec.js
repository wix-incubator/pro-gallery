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

describe('styleParam - textBoxBorderColor', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
    customComponents,
  };
  beforeEach(() => {
    driver = new GalleryDriver();
  });
  it('should set border-color to the text container when "imageInfoType" is "SEPARATED_BACKGROUND"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderColor: { value: 'rgba(0,0,0,0)' },
      itemBorderWidth: 1,
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderColor).to.be.undefined;
    driver.detach.proGallery();
  });
  it('should not set border-color to the text container when "imageInfoType" is not "SEPARATED_BACKGROUND"', async () => {
    const styles = mergeNestedObjects(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderColor: { value: 'rgba(0,0,0,0)' },
    });
    driver.mount.proGallery(styles);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderColor).to.eq(undefined);
    driver.detach.proGallery();
  });
});
