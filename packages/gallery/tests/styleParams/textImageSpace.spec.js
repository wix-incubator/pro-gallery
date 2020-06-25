import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container, customRenderers } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - textImageSpace', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
    ...customRenderers,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set spacing between the image and the texts (texts below items and separated background)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      textImageSpace: 20,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.selector('.gallery-item-bottom-info').at(0).parent();
    // expect marginTop to equal textImageSpace value.
    expect(item.props().style.marginTop).to.eq(20);
    driver.detach.proGallery();
  });
  it('should set spacing between the image and the texts (texts above items and separated background)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ABOVE,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      textImageSpace: 20,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.selector('.gallery-item-top-info').at(0).parent();
    // expect marginBottom to equal textImageSpace value.
    expect(item.props().style.marginBottom).to.eq(20);
    driver.detach.proGallery();
  });
  it('should not set when "imageInfoType" is not "SEPARATED_BACKGROUND"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ABOVE,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      textImageSpace: 20,
      oneRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
    })
    driver.mount.proGallery(initialProps);
    const item = driver.find.selector('.gallery-item-top-info').at(0).parent();
    // expect marginBottom to be undefined.
    expect(item.props().style.marginBottom).to.eq(undefined);
    driver.detach.proGallery();
  });
})
