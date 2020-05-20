import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - textsVerticalPadding', () => {

  let driver;
  const initialProps = {
    container,
    items: [...images2],
    styles: styleParams,
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should set vertical padding + 15 when (titlePlacement=SHOW_BELOW)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_BELOW,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      textsVerticalPadding: 50,
    });
    driver.mount.proGallery(initialProps);
    const textContainer = driver.find.selector('.gallery-item-bottom-info').at(0);
    expect(textContainer.props().style.paddingTop).to.eq('65px');
    driver.detach.proGallery();
  });

  it('should set vertical padding + 15 when (titlePlacement=ABOVE)', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.GRID,
      titlePlacement: GALLERY_CONSTS.placements.SHOW_ABOVE,
      onRow: false,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      textsVerticalPadding: 50,
    });
    driver.mount.proGallery(initialProps);
    const textContainer = driver.find.selector('.gallery-item-top-info').at(0);
    expect(textContainer.props().style.paddingTop).to.eq('65px');
    driver.detach.proGallery();
  });
})
