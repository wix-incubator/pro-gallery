import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { mergeNestedObjects } from 'pro-gallery-lib';
import { options, container } from '../drivers/mocks/styles';

describe('styleParam - arrowsVerticalPosition', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    options,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
    //base layout styles for entire test-suite
    initialProps.options = mergeNestedObjects(initialProps.options, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 39,
    });
  });

  afterEach(() => {
    driver.detach.proGallery();
  });

  it('Should not render the arrows when not enough info space', async () => {
    // Exact style params relevant to this sub-test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      slideshowInfoSize: 38, // info height is 39 when default, so slideshowInfoSize < arrowsSize
      arrowsVerticalPosition: 'INFO_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    expect(navArrows).to.have.lengthOf(0);
  });

  it('Checks if "INFO_CENTER" has correct distance from top for SlideShow', async () => {
    // Exact style params relevant to this sub-test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      arrowsVerticalPosition: 'INFO_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const { height: galleryHeight } = galleryContainer.props().style;
    const { top } = navArrows.props().style;
    const expectedInfoSpace = (-1 * galleryHeight) / 2;
    expect(top.replace(/\s/g, '')).to.eq(
      `calc(50%+0px-19.5px-${expectedInfoSpace}px)`
    );
  });

  it('Checks if "ITEM_CENTER" has correct distance from top for SlideShow', async () => {
    // Exact style params relevant to this sub-test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      arrowsVerticalPosition: 'ITEM_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    const { top } = navArrows.props().style;
    expect(top.replace(/\s/g, '')).to.eq(`calc(50%+0px-19.5px-0px)`);
  });

  it('Checks if "IMAGE_CENTER" has correct distance from top for SlideShow', async () => {
    // Exact style params relevant to this sub-test
    initialProps.options = mergeNestedObjects(initialProps.options, {
      arrowsVerticalPosition: 'IMAGE_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    const { top } = navArrows.props().style;
    const expectedInfoSpace = initialProps.options.slideshowInfoSize / 2;
    expect(top.replace(/\s/g, '')).to.eq(
      `calc(50%+0px-19.5px-${expectedInfoSpace}px)`
    );
  });
});
