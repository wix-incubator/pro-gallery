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
    expect(width).to.eq(90); // 120 * 0.75 = 90
    expect(height).to.eq(120);
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
    expect(width).to.be.closeTo(160, 1); // 120 * 1.333 ≈ 160
    expect(height).to.eq(120);
    driver.detach.proGallery();
  });
  it('should update thumbnail width when ratio changes', async () => {
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
    expect(width).to.eq(400); // 200 * 2 = 400
    expect(height).to.eq(200);
    driver.detach.proGallery();
  });
  it('should apply ratio to height for vertical thumbnails (LEFT placement)', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 120,
      [optionsMap.layoutParams.thumbnails.ratio]: 1.333,
      [optionsMap.layoutParams.thumbnails.alignment]: GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].LEFT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { width, height } = thumbnailItem.props().style;
    // For vertical thumbnails: maintain width, adjust height
    expect(width).to.eq(120); // width stays constant
    expect(height).to.be.closeTo(90, 1); // 120 / 1.333 ≈ 90
    driver.detach.proGallery();
  });
  it('should apply ratio to height for vertical thumbnails (RIGHT placement)', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 120,
      [optionsMap.layoutParams.thumbnails.ratio]: 0.75,
      [optionsMap.layoutParams.thumbnails.alignment]:
        GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].RIGHT,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { width, height } = thumbnailItem.props().style;
    // For vertical thumbnails: maintain width, adjust height
    expect(width).to.eq(120); // width stays constant
    expect(height).to.be.closeTo(160, 1); // 120 / 0.75 = 160
    driver.detach.proGallery();
  });
  it('should apply ratio to width for horizontal thumbnails (TOP placement)', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 120,
      [optionsMap.layoutParams.thumbnails.ratio]: 1.333,
      [optionsMap.layoutParams.thumbnails.alignment]: GALLERY_CONSTS[optionsMap.layoutParams.thumbnails.alignment].TOP,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { width, height } = thumbnailItem.props().style;
    // For horizontal thumbnails: maintain height, adjust width
    expect(height).to.eq(120); // height stays constant
    expect(width).to.be.closeTo(160, 1); // 120 * 1.333 ≈ 160
    driver.detach.proGallery();
  });
  it('should apply ratio of 0.5625 (9:16 portrait thumbnails)', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].THUMBNAIL,
      [optionsMap.layoutParams.thumbnails.size]: 120,
      [optionsMap.layoutParams.thumbnails.ratio]: 9 / 16,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const thumbnailItem = driver.find.selector('.thumbnailItem').at(0);
    const { width, height } = thumbnailItem.props().style;
    expect(width).to.be.closeTo(67.5, 1); // 120 * (9/16) = 120 * 0.5625 = 67.5
    expect(height).to.eq(120);
    driver.detach.proGallery();
  });
});
