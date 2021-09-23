import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options } from '../drivers/mocks/styles';
import { getElementDimensions } from '../utils/utils';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

describe('options - loadMore-enable', () => {
  let driver;
  let initialProps;

  beforeEach(() => {
    driver = new GalleryDriver();
    initialProps = {
      container: {
        height: 600,
        width: 600,
        scrollBase: 0,
      },
      items: [...images2, ...images2],
      options,
    };
  });

  it('should render "Show More" button when "loadMore" is enabled', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      behaviourParams: {
        gallery: {
          vertical: {
            loadMore: {
              enable: true,
            },
          },
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should not render "Show More" button when "loadMore" is not enabled', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      behaviourParams: {
        gallery: {
          vertical: {
            loadMore: {
              enable: false,
            },
          },
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
  it('should not render "Show More" button in a horizontal gallery when "loadMore" is enabled', async () => {
    // make sure to give the right params to make a horizontal gallery for the test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      behaviourParams: {
        gallery: {
          vertical: {
            loadMore: {
              enable: true,
            },
          },
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
  it('should set the gallery height (container.height - show-more-container" height) when "loadMore" is enabled', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      behaviourParams: {
        gallery: {
          vertical: {
            loadMore: {
              enable: true,
            },
          },
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const galleryHeight = getElementDimensions(galleryContainer).height;

    //expect the height to be container.height - show-more-container" height(138)
    expect(galleryHeight).to.eq(initialProps.container.height - 138); //138 is the height given to "show-more-container"
    driver.detach.proGallery();
  });
  it('should set the gallery height as given in container.height (ProGallery props)', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      behaviourParams: {
        gallery: {
          vertical: {
            loadMore: {
              enable: false,
            },
          },
        },
      },
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const galleryHeight = getElementDimensions(galleryContainer).height;

    //expect the height to be more than the height given in container.height
    expect(galleryHeight).to.be.greaterThan(600);
    driver.detach.proGallery();
  });
});
