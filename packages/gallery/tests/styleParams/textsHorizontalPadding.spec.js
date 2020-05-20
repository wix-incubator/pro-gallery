import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - textsHorizontalPadding', () => {

  let driver;
  const initialProps = {
    container,
    items: [...images2],
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set horizontal padding + 30 when (imageInfoType=SEPARATED_BACKGROUND)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      imageInfoType: GALLERY_CONSTS.infoType.SEPARATED_BACKGROUND,
      textsHorizontalPadding: 50,
    });
    driver.mount.proGallery(initialProps);
    const textContainer = driver.find.selector('.gallery-item-bottom-info').at(0);
    expect(textContainer.props().style.paddingRight).to.eq('80px');
    driver.detach.proGallery();
  });

  it('should set horizontal padding without any additions when (imageInfoType=ATTACHED_BACKGROUND)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      imageInfoType: GALLERY_CONSTS.infoType.ATTACHED_BACKGROUND,
      textsHorizontalPadding: 50,
    });
    driver.mount.proGallery(initialProps);
    const textContainer = driver.find.selector('.gallery-item-bottom-info').at(0);
    expect(textContainer.props().style.paddingRight).to.eq('80px');
    driver.detach.proGallery();
  });
  it('should set horizontal padding + 30 when (imageInfoType=DONT_SHOW)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      imageInfoType: GALLERY_CONSTS.infoType.DONT_SHOW,
      textsHorizontalPadding: 50,
    });
    driver.mount.proGallery(initialProps);
    const textContainer = driver.find.selector('.gallery-item-bottom-info').at(0);
    expect(textContainer.props().style.paddingRight).to.eq('50px');
    driver.detach.proGallery();
  });
  it('should set horizontal padding + 30 when (imageInfoType=NO_BACKGROUND)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      imageInfoType: GALLERY_CONSTS.infoType.NO_BACKGROUND,
      textsHorizontalPadding: 50,
    });
    driver.mount.proGallery(initialProps);
    const textContainer = driver.find.selector('.gallery-item-bottom-info').at(0);
    expect(textContainer.props().style.paddingRight).to.eq('50px');
    driver.detach.proGallery();
  });
})
