import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_thumbnails_size', () => {
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
  it('should "layoutParams_thumbnails_size" of "300"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 300,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { height } = thumbnailItem.props().style;
    expect(height).to.eq(300);
    driver.detach.proGallery();
  });
  it('should "layoutParams_thumbnails_size" of "150"', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 150,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { height } = thumbnailItem.props().style;
    expect(height).to.eq(150);
    driver.detach.proGallery();
  });
  it('should set the gallery height for layoutParams_thumbnails_size=300', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 300,
      [optionsMap.layoutParams.thumbnails.spacing]: 10,
      [optionsMap.layoutParams.thumbnails.alignment]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].BOTTOM,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    const { height } = galleryContainer.props().style;
    // expect to galleryContainer height without the thumbnails to be container.height - thumbnails and margins
    expect(initialProps.container.height - 300 - 3 * 10).to.eq(height);
    driver.detach.proGallery();
  });

  it('should set the gallery width for layoutParams_thumbnails_size=300', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 300,
      [optionsMap.layoutParams.thumbnails.spacing]: 10,
      [optionsMap.layoutParams.thumbnails.alignment]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    const { width } = galleryContainer.props().style;
    // expect to galleryContainer width without the thumbnails to be container.width - thumbnails and margins
    expect(initialProps.container.width - 300 - 3 * 10).to.eq(width);
    driver.detach.proGallery();
  });
});
