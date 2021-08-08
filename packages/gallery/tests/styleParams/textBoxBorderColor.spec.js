import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import {
  styleParams,
  container,
  customRenderers,
} from '../drivers/mocks/styles';

describe('styleParam - textBoxBorderColor', () => {
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
  it('should set border-color to the text container when "imageInfoType" is "SEPARATED_BACKGROUND"', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderColor: { value: 'rgba(0,0,0,0)' },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderColor).to.eq('rgba(0,0,0,0)');
    driver.detach.proGallery();
  });
  it('should not set border-color to the text container when "imageInfoType" is not "SEPARATED_BACKGROUND"', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      textBoxBorderColor: { value: 'rgba(0,0,0,0)' },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const textsStyles = driver.find
      .selector('.gallery-item-bottom-info')
      .at(0)
      .parent();
    expect(textsStyles.props().style.borderColor).to.eq(undefined);
    driver.detach.proGallery();
  });
});
