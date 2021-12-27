import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - slideshowInfoSize', () => {
  let driver;
  let initialProps;
  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container,
      items: images2,
      options,
    };
  });
  it('should set style for "slideshowInfoSize=250"', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 250,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const infoContainer = driver.find.selector('.gallery-slideshow-info').at(0);
    const infoStyleMock = {
      height: '250px',
      bottom: '-250px',
      transition: 'none',
    };
    expect(infoContainer.props().style).to.deep.equal(infoStyleMock);
    driver.detach.proGallery();
  });
  it.only('should set the right height for the gallery', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 250,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    const { height } = galleryContainer.props().style;
    //expect height to be container.height - slideshowInfoSize
    expect(height).to.eq(initialProps.container.height);
    driver.detach.proGallery();
  });
});
