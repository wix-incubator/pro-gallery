import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options, container } from '../drivers/mocks/styles';

describe('options - layoutParams_navigationArrows_container_borderRadius', () => {
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

  it('should set arrows border-radius', async () => {
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      layoutParams: {
        navigationArrows: {
          container: {
            type: GALLERY_CONSTS.arrowsContainerStyleType.BOX,
            borderRadius: 10,
          },
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const arrow = driver.find.selector('.nav-arrows-container');
    expect(arrow.props().style.borderRadius).to.eq('10%');
  });
});
