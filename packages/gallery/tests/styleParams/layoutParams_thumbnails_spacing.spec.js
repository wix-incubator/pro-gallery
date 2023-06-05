import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_thumbnails_spacings', () => {
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

  it('should set "layoutParams_thumbnails_spacing" of "25"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.spacing]: 25,
      [optionsMap.layoutParams.thumbnails.size]: 100,
    });
    const mock = {
      left: 125,
    };
    driver.mount.proGallery(initialProps);
    await driver.update();
    const item = driver.find.selector('.thumbnailItem').at(1);
    expect(item.props().style).to.include(mock);
    driver.detach.proGallery();
  });
});
