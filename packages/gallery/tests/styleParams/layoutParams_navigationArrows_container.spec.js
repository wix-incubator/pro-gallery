import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_navigationArrows_container', () => {
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

  const mountSlideshowGalleryAnGetArrow = async (containerOptions) => {
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout]
          .SLIDESHOW,
      [optionsMap.layoutParams.navigationArrows.container.type]:
        GALLERY_CONSTS[optionsMap.layoutParams.navigationArrows.container.type]
          .BOX,
      ...containerOptions,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    return driver.find.selector('.nav-arrows-container');
  };

  it('should set arrows background-color', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow({
      [optionsMap.layoutParams.navigationArrows.container.backgroundColor]:
        'red',
    });
    expect(arrow.props().style.backgroundColor).to.eq('red');
    driver.detach.proGallery();
  });

  it('should set arrows border-radius', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow({
      [optionsMap.layoutParams.navigationArrows.container.borderRadius]: 10,
    });
    expect(arrow.props().style.borderRadius).to.eq('10%');
    driver.detach.proGallery();
  });
});
