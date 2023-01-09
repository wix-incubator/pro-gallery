import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_navigationArrows_container_type', () => {
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

  const mountSlideshowGalleryAnGetArrow = async (containerStyleType) => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .SLIDESHOW,
      [optionsMap.layoutParams.navigationArrows.container.type]:
        containerStyleType,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    return driver.find.selector('.nav-arrows-container');
  };
  it('should have drop-shadow to arrows', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow(
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type]
        .SHADOW
    );
    expect(arrow.hasClass('drop-shadow')).to.be.true;
    driver.detach.proGallery();
  });

  it('should have a cube container', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow(
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type]
        .BOX
    );
    const { width, height } = arrow.props().style;
    expect(width).to.eq(height);
    driver.detach.proGallery();
  });

  it('should not have a cube container', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow(
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type]
        .NONE
    );
    const { width, height } = arrow.props().style;
    expect(width).to.not.eq(height);
    driver.detach.proGallery();
  });
  it('should not have a drop shadow (NONE)', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow(
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type]
        .NONE
    );
    expect(arrow.hasClass('drop-shadow')).to.be.false;
    driver.detach.proGallery();
  });

  it('should not have a drop shadow (BOX)', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow(
      GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type]
        .BOX
    );
    expect(arrow.hasClass('drop-shadow')).to.be.false;
    driver.detach.proGallery();
  });
});
