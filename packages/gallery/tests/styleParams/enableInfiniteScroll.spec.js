import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams } from '../drivers/mocks/styles';
import { getElementDimensions } from '../utils/utils';
import { GALLERY_CONSTS } from 'pro-gallery-lib';

describe('styleParam - enableInfiniteScroll', () => {
  let driver;
  const initialProps = {
    container: {
      height: 600,
      width: 600,
      scrollBase: 0,
    },
    items: [...images2, ...images2],
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  it('should render "Show More" button when "enableInfiniteScroll" is "false"', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      enableInfiniteScroll: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(1);
    driver.detach.proGallery();
  });
  it('should not render "Show More" button when "enableInfiniteScroll" is "true"', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      enableInfiniteScroll: true,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
  it('should not render "Show More" button in a horizontal gallery when "enableInfiniteScroll" is false', async () => {
    // make sure to give the right params to make a horizontal gallery for the test
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.HORIZONTAL,
      enableInfiniteScroll: false,
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const showMoreBtn = driver.find.hook('show-more');
    //expect to not have "Show more" button
    expect(showMoreBtn).to.have.lengthOf(0);
    driver.detach.proGallery();
  });
  it('should set the gallery height (container.height - show-more-container" height) when "enableInfiniteScroll" "false"', async () => {
    // make sure to give the right params to make a vertical gallery for the test
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      enableInfiniteScroll: false,
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
    Object.assign(initialProps.styles, {
      galleryLayout: 2,
      scrollDirection: GALLERY_CONSTS.scrollDirection.VERTICAL,
      enableInfiniteScroll: true,
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
