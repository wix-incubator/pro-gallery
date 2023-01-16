import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { GALLERY_CONSTS, optionsMap } from 'pro-gallery-lib';
import { images2 } from '../drivers/mocks/items';
import { options } from '../drivers/mocks/styles';
import { getElementDimensions } from '../utils/utils';

describe('options - behaviourParams_gallery_vertical_loadMore_enable', () => {
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

  it('should render "Show More" button when "behaviourParams_gallery_vertical_loadMore_enable" is "false"', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should not render "Show More" button when "behaviourParams_gallery_vertical_loadMore_enable" is "true"', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
  it('should not render "Show More" button in a horizontal gallery when "behaviourParams_gallery_vertical_loadMore_enable" is false', async () => {
    // make sure to give the right params to make a horizontal gallery for the test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .HORIZONTAL,
      [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
  it('should set the gallery height (container.height - show-more-container" height) when "behaviourParams_gallery_vertical_loadMore_enable" "false"', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    const galleryHeight = getElementDimensions(galleryContainer).height;

    //expect the height to be container.height - show-more-container" height(138)
    expect(galleryHeight).to.eq(initialProps.container.height - 138); //138 is the height given to "show-more-container"
    driver.detach.proGallery();
  });
  it.skip('should set the gallery height as given in container.height (ProGallery props)', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    initialProps.options = Object.assign(initialProps.options, {
      [optionsMap.layoutParams.structure.galleryLayout]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.galleryLayout].GRID,
      [optionsMap.layoutParams.structure.scrollDirection]:
        GALLERY_CONSTS[optionsMap.layoutParams.structure.scrollDirection]
          .VERTICAL,
      [optionsMap.behaviourParams.gallery.vertical.loadMore.enable]: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const galleryContainer = driver.getContainer();
    const galleryHeight = getElementDimensions(galleryContainer).height;

    //expect the height to be more than the height given in container.height
    expect(galleryHeight).to.be.greaterThan(600);
    driver.detach.proGallery();
  });
});
