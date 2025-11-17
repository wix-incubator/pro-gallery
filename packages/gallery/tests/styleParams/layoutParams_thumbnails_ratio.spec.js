import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_thumbnails_ratio', () => {
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
  it('should use default ratio of 1 (square thumbnails)', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 120,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { width, height } = thumbnailItem.props().style;
    expect(width).to.eq(120);
    expect(height).to.eq(120);
    driver.detach.proGallery();
  });
  it('should apply ratio of 0.75 (3:4 portrait thumbnails)', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 120,
      [optionsMap.layoutParams.thumbnails.ratio]: 0.75,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { width, height } = thumbnailItem.props().style;
    expect(width).to.eq(120);
    expect(height).to.eq(160); // 120 / 0.75 = 160
    driver.detach.proGallery();
  });
  it('should apply ratio of 1.333 (4:3 landscape thumbnails)', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 120,
      [optionsMap.layoutParams.thumbnails.ratio]: 1.333,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { width, height } = thumbnailItem.props().style;
    expect(width).to.eq(120);
    expect(height).to.be.closeTo(90, 1); // 120 / 1.333 ≈ 90
    driver.detach.proGallery();
  });
  it('should update thumbnail height when ratio changes', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 200,
      [optionsMap.layoutParams.thumbnails.ratio]: 2,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { width, height } = thumbnailItem.props().style;
    expect(width).to.eq(200);
    expect(height).to.eq(100); // 200 / 2 = 100
    driver.detach.proGallery();
  });
});
