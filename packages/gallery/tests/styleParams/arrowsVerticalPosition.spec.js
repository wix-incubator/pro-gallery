import { GALLERY_CONSTS } from 'pro-gallery-lib';
import GalleryDriver from '../drivers/reactDriver';
import { expect } from 'chai';
import { images2 } from '../drivers/mocks/items';
import { styleParams, container } from '../drivers/mocks/styles';

describe('styleParam - arrowsVerticalPosition', () => {
  let driver;
  const initialProps = {
    container,
    items: images2,
    styles: styleParams,
  };

  beforeEach(() => {
    driver = new GalleryDriver();
  });

  afterEach(() => {
    driver.detach.proGallery();
  });

  it('Should not render the arrows when not enough info space', async () => {
    const currentTestStyles = {
      ...initialProps.styles,
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 38, // info height is 39 when default, so slideshowInfoSize < arrowsSize
      arrowsVerticalPosition: 'INFO_CENTER',
    };
    driver.mount.proGallery(currentTestStyles);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    expect(navArrows).to.have.lengthOf(0);
  });

  // Checks if INFO_CENTER position is good on Slideshow
  it('Checks if "INFO_CENTER" has correct distance from top for SlideShow', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 39,
      arrowsVerticalPosition: 'INFO_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const { height: galleryHeight } = galleryContainer.props().style;
    const { top } = navArrows.props().style;
    const expectedInfoSpace = (-1 * galleryHeight) / 2;
    expect(top).to.eq(`calc(50% - 19.5px + 0px - ${expectedInfoSpace}px)`);
  });

  it('Checks if "ITEM_CENTER" has correct distance from top for SlideShow', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 39,
      arrowsVerticalPosition: 'ITEM_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    const { top } = navArrows.props().style;
    expect(top).to.eq(`calc(50% - 19.5px + 0px - 0px)`);
  });

  it('Checks if "IMAGE_CENTER" has correct distance from top for SlideShow', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDESHOW,
      slideshowInfoSize: 39,
      arrowsVerticalPosition: 'IMAGE_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    const { top } = navArrows.props().style;
    const expectedInfoSpace = initialProps.styles.slideshowInfoSize / 2;
    expect(top).to.eq(`calc(50% - 19.5px + 0px - ${expectedInfoSpace}px)`);
  });

  // Checks if INFO_CENTER position is good on Slider and below placement
  it('Checks if "INFO_CENTER" has correct distance from top for Slider', async () => {
    Object.assign(initialProps.styles, {
      galleryLayout: GALLERY_CONSTS.layout.SLIDER,
      slideshowInfoSize: 39,
      titlePlacement: 'SHOW_BELOW',
      arrowsVerticalPosition: 'ITEM_CENTER',
    });
    driver.mount.proGallery(initialProps);
    await driver.update();
    const navArrows = driver.find.selector('.nav-arrows-container');
    const galleryContainer = driver.find.selector('#pro-gallery-container');
    const { height: galleryHeight } = galleryContainer.props().style;
    const { top } = navArrows.props().style;
    const expectedInfoSpace = (-1 * galleryHeight) / 2;
    expect(top).to.eq(`calc(50% - 19.5px + 2.5px - ${expectedInfoSpace}px)`);
  });
});
