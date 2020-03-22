import GalleryDriver from '../drivers/reactDriver'
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';
import GALLERY_CONSTS from '../../src/common/constants';
import GalleryItem from '../../src/components/item/galleryItem';
import sinon from 'sinon';

describe('styleParam - imageLoadingMode', () => {

  let driver;
  let imageStub;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams
  }

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should preload blury image', () => {
    Object.assign(initialProps.styles, {
      galleryLayout:  GALLERY_CONSTS.layout.GRID,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      oneRow: false,
      imageLoadingMode: GALLERY_CONSTS.loadingMode.MAIN_COLOR,
    })
    imageStub = sinon.stub(GalleryItem.prototype, 'createUrl');
    driver.mount.proGallery(initialProps);
    const item = driver.find.hook('image-item').at(0);
    console.log(imageStub.calledWith('resized','thumb'));
    console.log(imageStub.called);
    
    expect();
    driver.detach.proGallery();
  });
})