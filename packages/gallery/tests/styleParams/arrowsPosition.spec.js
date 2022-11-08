import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - arrowsPosition', () => {
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

  it('should calculate gallery width accroding to "arrowsPosition" ("OUTSIDE_GALLERY")', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .SLIDESHOW,
      [optionsMap.layoutParams.navigationArrows.position]:
        GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position]
          .OUTSIDE_GALLERY,
      [optionsMap.layoutParams.navigationArrows.size]: 40,
      [optionsMap.layoutParams.structure.itemSpacing]: 0, // fixed in slideshow
    });
    driver.mount.proGallery(initialProps);
    await driver.update();

    const galleryContainer = driver.getContainer();
    const { width } = galleryContainer.props().style;
    const newWidth =
      initialProps.container.width -
      2 *
        (initialProps.options[optionsMap.layoutParams.navigationArrows.size] +
          40 +
          initialProps.options[optionsMap.layoutParams.structure.itemSpacing]);
    expect(width).to.eq(newWidth);
    driver.detach.proGallery();
  });
  it('should have original container width (arrowsPosition = "OUTSIDE_GALLERY")', async () => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .SLIDESHOW,
      [optionsMap.layoutParams.navigationArrows.position]:
        GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.position]
          .ON_GALLERY,
      [optionsMap.layoutParams.navigationArrows.size]: 40,
      [optionsMap.layoutParams.structure.itemSpacing]: 0, // fixed in slideshow
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    const { width } = galleryContainer.props().style;

    expect(width).to.eq(initialProps.container.width);
    driver.detach.proGallery();
  });
});
