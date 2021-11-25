import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - isRTL', () => {
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

  it('should not set "rtl" class to the gallery container', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      isRTL: GALLERY_CONSTS.layoutDirection.LEFT_TO_RIGHT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('.pro-gallery');
    expect(galleryContainer.hasClass('rtl')).to.be.false;
    driver.detach.proGallery();
  });
  it('should set "rtl" class to the gallery container', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.EMPTY,
      isRTL: GALLERY_CONSTS.layoutDirection.RIGHT_TO_LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('.pro-gallery');
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });
  // it('should start keyboard navigation from left to right', async () => {
  //   initialProps.options = mergeNestedObjects(initialProps.options, {
  //     galleryLayout: GALLERY_CONSTS.layout.GRID,
  //     isRTL: GALLERY_CONSTS.layoutDirection.LEFT_TO_RIGHT,
  //   })
  //   driver.mount.proGallery(initialProps);
  //   const galleryContainer = driver.find.selector('#pro-gallery-container');
  //   const stub = sinon.stub(driver.wrapper.instance());
  //   galleryContainer.getDOMNode().focus();
  //   galleryContainer.simulate('keydown', {key: 'Tab',keyCode: 9, which: 9});
  //   console.log(galleryContainer.is(':focus'));

  //   // driver.wrapper.simulate('keydown', {key: 'Tab',keyCode: 9, which: 9});
  //   // galleryContainer.simulate('keydown', {key: 'Tab',keyCode: 9, which: 9});
  //   console.log(document.activeElement.tagName);

  //   expect()
  //   driver.detach.proGallery();
  // });

  it('should set "rtl" class in slideShowView', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      isRTL: GALLERY_CONSTS.layoutDirection.RIGHT_TO_LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('.pro-gallery');
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });

  it('should not set "rtl" class in slideShowView', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      isRTL: GALLERY_CONSTS.layoutDirection.RIGHT_TO_LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('.pro-gallery');
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });
});
