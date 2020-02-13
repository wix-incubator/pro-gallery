import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - galleryTextAlign', () => {

  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should align text to the left', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false,
      allowTitle: true,
      allowDescription: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.LEFT,
    })
    driver.mount.proGallery(initialProps);
    const textsContainer = driver.find.selector('.gallery-item-text').at(0);
    const { textAlign } = textsContainer.props().style
    expect(textAlign).to.eq('left');
    driver.detach.proGallery();
  });
  it('should align text to the right', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false,
      allowTitle: true,
      allowDescription: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.RIGHT,
    })
    driver.mount.proGallery(initialProps);
    const textsContainer = driver.find.selector('.gallery-item-text').at(0);
    const { textAlign } = textsContainer.props().style
    expect(textAlign).to.eq('right');
    driver.detach.proGallery();
  });
  it('should align text to the center', () => {
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      oneRow:false,
      allowTitle: true,
      allowDescription: true,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      hoveringBehaviour: GALLERY_CONSTS.infoBehaviourOnHover.NO_CHANGE,
      galleryTextAlign: GALLERY_CONSTS.galleryTextAlign.CENTER,
    })
    driver.mount.proGallery(initialProps);
    const textsContainer = driver.find.selector('.gallery-item-text').at(0);
    const { textAlign } = textsContainer.props().style
    expect(textAlign).to.eq('center');
    driver.detach.proGallery();
  });
})