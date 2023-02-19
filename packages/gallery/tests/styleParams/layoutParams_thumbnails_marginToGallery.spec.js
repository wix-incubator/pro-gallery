import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_thumbnails_marginToGallery', () => {
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

  it('should set "layoutParams_thumbnails_marginToGallery" of "49"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.marginToGallery]: 49,
    });
    const mock = {
      marginTop: 49,
    };
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.thumbnails-gallery').at(0);
    expect(item.props().style).to.include(mock);
    driver.detach.proGallery();
  });
  it('should set "layoutParams_thumbnails_marginToGallery" of "63" also when horizontal', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.marginToGallery]: 63,
      [optionsMap.layoutParams.thumbnails.alignment]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].RIGHT,
    });
    const mock = {
      marginLeft: 63,
    };
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.thumbnails-gallery').at(0);
    expect(item.props().style).to.include(mock);
    driver.detach.proGallery();
  });
});
