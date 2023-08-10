import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - behaviourParams_gallery_horizontal_loop', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container: { ...container, width: 400 },
      items: images2.slice(0, 2),
      totalItemsCount: 2,
      options,
    };
  });
  it('should be able to to click next when reached last item', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDESHOW,
      [optionsMap.behaviourParams.gallery.horizontal.loop]: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    driver.find.hook('nav-arrow-next').simulate('click');
    await driver.update(500);
    expect(driver.find.hook('nav-arrow-next')).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should not be able to to click next', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].SLIDESHOW,
      [optionsMap.behaviourParams.gallery.horizontal.loop]: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    driver.find.hook('nav-arrow-next').simulate('click');
    await driver.update(500);
    expect(driver.find.hook('nav-arrow-next')).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
});
