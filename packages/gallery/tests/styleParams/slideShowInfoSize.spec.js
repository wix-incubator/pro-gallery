import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';

describe('styleParam - slideshowInfoSize', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }
  beforeEach(() => {
    driver = new GalleryDriver();
  });
  it('should set style for "slideshowInfoSize=250"', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.SLIDESHOW,
      allowTitle:true,
      slideshowInfoSize: 250,
    })
    driver.mount.proGallery(initialProps);
    const infoContainer = driver.find.selector('.gallery-item-info').at(0);
    console.log(infoContainer.props().style);
    const infoStyleMock = {
      height: '250px',
      bottom: '-250px'
    }
    expect(infoContainer.props().style).to.deep.equal(infoStyleMock);
    driver.detach.proGallery();
  });
  it('should set the right height for the gallery', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.SLIDESHOW,
      allowTitle:true,
      slideshowInfoSize: 250,
    })
    driver.mount.proGallery(initialProps);
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    console.log(initialProps.container.height);
    const { height } = galleryContainer.props().style
    //expect height to be container.height - slideshowInfoSize
    expect(height).to.eq(initialProps.container.height - 250);
    driver.detach.proGallery();
  });
})