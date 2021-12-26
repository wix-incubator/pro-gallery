import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_navigationArrows_containerStyleType', () => {
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

  it('should set arros background-color', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      layoutParams: {
        navigationArrows: {
          containerStyleType: GALLERY_CONSTS.arrowsContainerStyleType.BOX,
          containerBorderRadius: 10,
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const arrow = driver.find.selector('.nav-arrows-container');
    expect(arrow.props().style.borderRadius).to.eq(10);
  });
});
