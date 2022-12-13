import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_gallery_horizontal_blockScroll', () => {
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

  it('should set class "slider" when "behaviourParams_gallery_horizontal_blockScroll" is "true"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
      [optionsMap.behaviourParams.gallery.horizontal.blockScroll]: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    expect(galleryContainer.hasClass('slider')).to.be.true;
    driver.detach.proGallery();
  });
  it('should not set class "slider" when "behaviourParams_gallery_horizontal_blockScroll" is "false"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].EMPTY,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
      [optionsMap.behaviourParams.gallery.horizontal.blockScroll]: true,
    });

    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    expect(galleryContainer.hasClass('slider')).to.be.false;
    driver.detach.proGallery();
  });
});
