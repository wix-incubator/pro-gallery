import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - textBoxBorderRadius', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }
  beforeEach(() => {
    driver = new GalleryDriver();
  });
  it('should set border-radius to the text container when "imageInfoType" is "SEPARATED_BACKGROUND"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      allowTitle: true,
      textBoxBorderRadius: 10,
    })
    driver.mount.proGallery(initialProps);
    const textsStyles = driver.find.selector('.gallery-item-bottom-info').at(0).parent();
    expect(textsStyles.props().style.borderRadius).to.eq(10);
    driver.detach.proGallery();
  });

  it('should not set border-radius to the text container when "imageInfoType" is not "SEPARATED_BACKGROUND"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      oneRow: false,
      allowTitle: true,
      textBoxBorderWidth: 10,
    })
    driver.mount.proGallery(initialProps);
    const textsStyles = driver.find.selector('.gallery-item-bottom-info').at(0).parent();
    expect(textsStyles.props().style.borderRadius).to.eq(undefined);
    driver.detach.proGallery();
  });
})