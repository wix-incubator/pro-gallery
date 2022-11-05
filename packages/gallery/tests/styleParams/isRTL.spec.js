import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
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
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.behaviourParams.gallery.layoutDirection]:
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection]
          .LEFT_TO_RIGHT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    expect(galleryContainer.hasClass('rtl')).to.be.false;
    driver.detach.proGallery();
  });
  it('should set "rtl" class to the gallery container', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.behaviourParams.gallery.layoutDirection]:
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection]
          .RIGHT_TO_LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });
  // it('should start keyboard navigation from left to right', async () => {
  //   initialProps.options = Object.assign(initialProps.options, {
  //     [optionsMap.layoutParams.structure.galleryLayout]:GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
  //     [optionsMap.behaviourParams.gallery.layoutDirection]: GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection].LEFT_TO_RIGHT,
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
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .SLIDESHOW,
      [optionsMap.behaviourParams.gallery.layoutDirection]:
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection]
          .RIGHT_TO_LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });

  it('should not set "rtl" class in slideShowView', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .SLIDESHOW,
      [optionsMap.behaviourParams.gallery.layoutDirection]:
        GALLERY_CONSTS[optionsMap.behaviourParams.gallery.layoutDirection]
          .RIGHT_TO_LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    expect(galleryContainer.hasClass('rtl')).to.be.true;
    driver.detach.proGallery();
  });
});
