import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
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
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      layoutParams: {
        navigationArrows: {
          container: {
            type: GALLERY_CONSTS.arrowsContainerStyleType.BOX,
            ...containerOptions,
          },
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    return driver.find.selector('.nav-arrows-container');
  };

  it('should set arrows background-color', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow({
      backgroundColor: 'red',
    });
    expect(arrow.props().style.backgroundColor).to.eq('red');
    driver.detach.proGallery();
  });

  it('should set arrows border-radius', async () => {
    const arrow = await mountSlideshowGalleryAnGetArrow({ borderRadius: 10 });
    expect(arrow.props().style.borderRadius).to.eq('10%');
    driver.detach.proGallery();
  });
});
